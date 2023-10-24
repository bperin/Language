import path from 'path';
import { transcribeAudio } from './transcribe.mjs';

console.log("running");

if (process.argv.length !== 3) {
    console.log('Usage: node script.js <file_path>');
    process.exit(1); // Exit the script with an error code
}

const filePath = process.argv[2];

if (path.extname(filePath).toLowerCase() !== '.wav') {
    console.log('Please provide a WAV file.');
    process.exit(1); // Exit the script with an error code
}
transcribeAudio(filePath)
    .then(result => {
        console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
        console.log(JSON.stringify(error, null, 2));
    });
