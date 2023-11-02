import { expect } from 'chai';
import { Worker} from 'worker_threads';

// Define the transcribe worker script
const transcribeWorkerScript = './transcribeWorker.mjs';

describe('transcribeAudio', function () {
    const SPANISH = "es-ES";
    const ENGLISH = "en-US";
    const subscriptionKey = process.env.AZURE_SPEECH_API_KEY;
    const serviceRegion = process.env.AZURE_SPEECH_API_REGION;

    // Function to transcribe audio in a worker thread
    async function transcribeAudioWorker(filePath) {
        return new Promise((resolve) => {
            const worker = new Worker(transcribeWorkerScript, {
                workerData: { filePath, subscriptionKey, serviceRegion },
                type: 'module'
            });

            let receivedLanguageEvent = false;
            let transcription = '';

            worker.on('message', (message) => {
                if (message.language) {
                    receivedLanguageEvent = true;
                    expect(message.language).to.equal(SPANISH); // Update this with the expected language
                    // You can also check execution time if needed: expect(message.executionTime).to.be.a('number');
                } else if (message.transcription) {
                    // Accumulate intermediate results
                    transcription += message.transcription;
                }
            });

            worker.on('exit', (code) => {
                worker.terminate();
                expect(receivedLanguageEvent, 'No language event received').to.be.true;
                const result = {
                    success: true,
                    transcription,
                    language: SPANISH, // Update with the expected language
                };
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
    it('should transcribe English 1 audio file', async function () {
        // English success
        const filePath = 'samples/english1.wav';
        const result = await transcribeAudioWorker(filePath);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(ENGLISH);
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
