import { parentPort, workerData } from 'worker_threads';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { promises as fsPromises } from 'fs';

let previouslyTranscribedText = '';

// Function to transcribe audio
async function transcribeAudio() {
    const { filePath, subscriptionKey, serviceRegion } = workerData;

    let languageDetected = false;
    let startTime = 0;

    try {
        const audio = await fsPromises.readFile(filePath);
        const audioConfig = sdk.AudioConfig.fromWavFileInput(audio);
        const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
        const enLanguageConfig = sdk.SourceLanguageConfig.fromLanguage('en-US');
        const esLanguageConfig = sdk.SourceLanguageConfig.fromLanguage('es-ES');
        const languageConfig = sdk.AutoDetectSourceLanguageConfig.fromSourceLanguageConfigs([enLanguageConfig, esLanguageConfig]);
        const recognizer = new sdk.SpeechRecognizer.FromConfig(speechConfig, languageConfig, audioConfig);

        // Attach the recognizing event handler
        recognizer.recognizing = (sender, event) => {
            if (!languageDetected && event.result.privLanguage) {
                languageDetected = true;
                const endTime = process.hrtime(startTime); // Stop the timer
                const executionTime = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2);
                parentPort.postMessage({
                    language: event.result.privLanguage,
                    executionTime: executionTime
                });
            }

            if (event.result.privText) {
                const transcribedText = event.result.privText;
                const newTranscription = transcribedText.replace(previouslyTranscribedText, '').trim();
                if (newTranscription.length > 0) {
                    parentPort.postMessage({ transcription: newTranscription });
                }
                previouslyTranscribedText = transcribedText;
            }
        };

        startTime = process.hrtime(); // Start the timer

        const result = await new Promise((resolve, reject) => {
            recognizer.recognizeOnceAsync(
                (result) => {
                    resolve(result);
                },
                (error) => {
                    reject(error);
                }
            );
        });

        // Continue with any further processing
    } catch (error) {
        parentPort.postMessage({ message: error });
        process.exit(1);
    } finally {
        parentPort.close(); // Close the worker thread
        process.exit(0);
    }
}

// Start transcribing audio when the worker thread receives a 'start' message
parentPort.on('message', async (message) => {
    if (message === 'start') {
        await transcribeAudio();
    }
});
