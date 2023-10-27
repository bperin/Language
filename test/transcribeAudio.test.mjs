import { expect } from 'chai';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

// Define the transcribe worker script
const transcribeWorkerScript = './transcribeWorker.mjs';

// Define the environment variables
const subscriptionKey = process.env.AZURE_SPEECH_API_KEY;
const serviceRegion = process.env.AZURE_SPEECH_API_REGION;

describe('transcribeAudio', function () {

    const SPANISH = "es-ES";
    const ENGLISH = "en-US";

    // Function to transcribe audio in a worker thread
    async function transcribeAudioWorker(filePath) {
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

    it('should transcribe Spanish 1 audio file', async function () {
        // Spanish success
        const filePath = 'samples/spanish1.wav';

        const result = await transcribeAudioWorker(filePath);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(SPANISH);
    });

    it('should transcribe English 1 audio file', async function () {
        // English success
        const filePath = 'samples/english1.wav';

        const result = await transcribeAudioWorker(filePath);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(ENGLISH);
    });

    it('should transcribe Spanish 2 audio file', async function () {
        // Spanish success
        const filePath = 'samples/spanish2.wav';

        const result = await transcribeAudioWorker(filePath);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(SPANISH);
    });

    it('should transcribe Spanish 3 audio file', async function () {
        // Spanish success
        const filePath = 'samples/spanish3.wav';

        const result = await transcribeAudioWorker(filePath);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(SPANISH);
    });

    it('should transcribe English 2 audio file', async function () {
        // English success
        const filePath = 'samples/english2.wav';

        const result = await transcribeAudioWorker(filePath);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(ENGLISH);
    });
});
