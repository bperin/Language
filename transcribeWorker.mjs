import { parentPort, workerData } from 'worker_threads';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { promises as fsPromises } from 'fs';

// Define your custom myResult object
function createMyResult() {
    return {
        success: false,
        message: '',
        language: '',
        confidence: '',
        transcription: '',
    };
}

// Function to transcribe audio
async function transcribeAudio() {
    const { filePath, subscriptionKey, serviceRegion } = workerData;
    const myResult = createMyResult(); // Initialize myResult object

    try {
        const audio = await fsPromises.readFile(filePath);
        const audioConfig = sdk.AudioConfig.fromWavFileInput(audio);
        const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
        const enLanguageConfig = sdk.SourceLanguageConfig.fromLanguage('en-US');
        const esLanguageConfig = sdk.SourceLanguageConfig.fromLanguage('es-ES');
        const languageConfig = sdk.AutoDetectSourceLanguageConfig.fromSourceLanguageConfigs([enLanguageConfig, esLanguageConfig]);
        const recognizer = new sdk.SpeechRecognizer.FromConfig(speechConfig, languageConfig, audioConfig);

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

        // Populate the myResult object with the transcription result
        myResult.transcription = result.privText;
        myResult.success = true;
        myResult.language = result.privLanguage; // Include language information
        myResult.confidence = result.privLanguageDetectionConfidence; // Include language detection confidence
    } catch (error) {
        myResult.message = error;
    } finally {
        parentPort.postMessage(myResult); // Send the result to the main thread
        parentPort.close(); // Close the worker thread
    }
}

// Handle incoming messages from the main thread
parentPort.on('message', async (message) => {
    if (message === 'start') {
        await transcribeAudio();
    }
});
