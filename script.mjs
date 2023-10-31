import { Worker, isMainThread } from 'worker_threads';
import path from 'path';

// Function to create a worker and transcribe audio
async function transcribeAudioWorker(filePath, subscriptionKey, serviceRegion) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./transcribeWorker.mjs', {
            workerData: { filePath, subscriptionKey, serviceRegion },
            type: 'module'
        });

        worker.on('message', (message) => {
            if (message.language) {
                console.log(`Language: ${message.language} detected in ${message.executionTime} ms`);
            }
            if (message.transcription) {
                console.log(`Text: ${message.transcription}`);
            }
        });

        worker.on('error', (error) => {
            reject(error);
        });

        worker.on('exit', (code) => {
            if (code === 0) {
                resolve(); // Resolve the promise once the worker is finished
            } else {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });

        worker.postMessage('start');
    });
}

async function main() {
    if (isMainThread) {
        // This is the main thread

        if (process.argv.length !== 3) {
            console.error('Usage: node script.mjs <file_path>');
            process.exit(1); // Exit the script with an error code
        }

        const filePath = process.argv[2];

        if (path.extname(filePath).toLowerCase() !== '.wav') {
            console.error('Please provide a WAV file.');
            process.exit(1); // Exit the script with an error code
        }

        // Define your subscription key and service region
        const subscriptionKey = process.env.AZURE_SPEECH_API_KEY;
        const serviceRegion = process.env.AZURE_SPEECH_API_REGION;
        try {
            await transcribeAudioWorker(filePath, subscriptionKey, serviceRegion);
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }
}

main().catch((error) => {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
});
