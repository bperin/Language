import path from 'path';
import { throttledTranscription } from './transcribe.mjs';

async function main() {
    if (process.argv.length !== 3) {
        console.error('Usage: node script.js <file_path>');
        process.exit(1); // Exit the script with an error code
    }

    const filePath = process.argv[2];

    if (path.extname(filePath).toLowerCase() !== '.wav') {
        console.error('Please provide a WAV file.');
        process.exit(1); // Exit the script with an error code
    }

    try {
        const result = await throttledTranscription.transcribeAudio(filePath);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error(JSON.stringify(error, null, 2));
    }
}

main().catch((error) => {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
});
