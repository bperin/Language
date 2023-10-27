import { Worker, isMainThread, workerData } from 'worker_threads';
import path from 'path';

// Define the transcribe worker script
const transcribeWorkerScript = './transcribeWorker.mjs';

// Function to create a worker and transcribe audio
async function transcribeAudioWorker(filePath, subscriptionKey, serviceRegion) {
    return new Promise((resolve) => {
        const worker = new Worker(transcribeWorkerScript, {
            workerData: { filePath, subscriptionKey, serviceRegion },
            type: 'module'
        });

        worker.on('message', (result) => {
            worker.terminate(); // Terminate the worker after receiving the result
            resolve(result);
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
            const result = await transcribeAudioWorker(filePath, subscriptionKey, serviceRegion);
            console.log(JSON.stringify(result, null, 2));
            process.exit(0); // Exit the script with a success code
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            process.exit(1); // Exit the script with an error code
        }
    }
}

main().catch((error) => {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
});
