require('dotenv').config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` })
const { server, app, path } = require('./expressServer')
const fsPromises = require('node:fs/promises')
const { client } = require('./util')

const launch = async () => {
    try {
        await Promise.all([
            client.connect(),
        ])
        console.log('MongoDB connect successful.')

        await migration()
        console.log('Migration successful.')

        if (process.send) process.send('ready')

        server.listen(process.env.PORT, () => {
            const { address, port } = server.address()
            console.log('Server is listening at http://%s:%s', address, port)
            console.log(`Process is running now on ${app.get('env')}. (pid: ${process.pid})`)
        })
    } catch (err) {
        console.log(err)
        console.log('Database connection failed')
        process.exit(1)
    }
}

const migration = async () => {
    const dir = path.resolve('./sql/migration/')
    const filePaths = await fsPromises.readdir(dir)
    filePaths.sort()

    // migration must be sequential therefore for of loop was used
    for (const filePath of filePaths) {
        const contents = await fsPromises.readFile(path.join(dir, filePath), { encoding: 'utf8' })
        await client.query(contents)
    }
}

const dBShutdown = async () => {
    await client.end()
    console.log('Database connection closed.')
}

process.on('SIGINT', () => {
    console.log('SIGINT signal received.')
    console.log('Closing http server...')
    server.close(async (err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log('Http server closed.')
        try {
            await Promise.all([
                dBShutdown(),
            ])
            process.exit(0)
        } catch (err) {
            console.error(err)
            process.exit(1)
        }
    })
})

process.on('uncaughtException', (err) => {
    console.log(err)
})

launch()
