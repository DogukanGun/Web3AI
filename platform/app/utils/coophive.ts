import { exec } from 'child_process';
import fs from 'fs';

const executeCoophive = (message: string): string | any=> {
    // Prepare the command with the environment variable set
    const command = `export WEB3_PRIVATE_KEY=${process.env.PRIVATE_KEY} && export LIGHTHOUSE_KEY=${process.env.LIGHTHOUSE_KEY} && export CID=${process.env.CID} && hive run github.com/cemdenizsel/testRepo2:0.0.6 -i LIGHTHOUSE_KEY=${process.env.LIGHTHOUSE_KEY} -i CID=${process.env.CID} -i PRIVATE_KEY=${process.env.PRIVATE_KEY}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return "error"
        }

        console.log(`stdout: ${stdout}`);
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }

        // Extract file path from the command output
        const match = stdout.match(/\/tmp\/coophive\/data\/downloaded-files\/[\w]+\/stdout/);
        if (!match || match.length === 0) {
            return "error"
        }

        const resultFilePath = match[0];

        // Check if the file exists before reading
        if (!fs.existsSync(resultFilePath)) {
            return "error"
        }

        // Read the result file
        fs.readFile(resultFilePath, 'utf8', (readErr, data) => {
            if (readErr) {
                console.error(`readFile error: ${readErr}`);
                return "error"
            }

            // Send the file content and logs as response
            `Result File Content:\n${data}\n\nstdout:\n${stdout}`;
        });
    });
}

export default executeCoophive;