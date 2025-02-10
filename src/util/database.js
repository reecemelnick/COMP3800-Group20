const { Client } = require('pg')

const connectObj = process.env.NODE_ENV === 'local' ?
    {
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        database: process.env.DATABASE_NAME,
    } :
    {
        user: 'dbuser',
        password: 'secretpassword',
        host: 'database.server.com',
        port: 3211,
        database: 'mydb',
    }

const client = new Client(connectObj)

module.exports = client