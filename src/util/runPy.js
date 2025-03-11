const { spawn } = require('child_process')
// const path = require('path');
// const parentDir = path.join(__dirname, '..', '..'); // Go up two directories

/*
    Runs a python script.
    path: path of script
    args: cmd line arguments for script
    callback: sends data on success or error on failure.
 */
function runPythonScript(path, args, callback) {
    // Spawns a child process for the given script to execute, along with its arguments
    const pyProcess = spawn('python3', [path].concat(args));

    let data = '';
    // when the child process's stdout descriptor has data, append each memory chunk
    //  (data event) of stdout to data
    pyProcess.stdout.on('data', (chunk) => {
        data += chunk.toString();
        try {
            JSON.parse(data);
        } catch (err) {
            data = ""
        }
    });

    // logs errors. when the child process's stderr descriptor has data, log it
    pyProcess.stderr.on('data', (error) => {
        console.error(`stderr: ${error}`);
    });

    // when the child process is finished execution, verify its exit code and handle accordingly
    pyProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Python script exited with code ${code}`);
            callback(`Error: Script exited with code ${code}`, null);
        } else {
            console.log('Python script executed successfully');
            callback(null, data);
        }
    });
}

module.exports = runPythonScript;