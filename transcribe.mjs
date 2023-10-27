import { promises as fsPromises } from 'fs';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const throttledTranscription = {
    concurrentConnections: 0, // Application-level tracking of concurrent connections

    // Load ENV variables for Azure outside the function
    subscriptionKey: process.env.AZURE_SPEECH_API_KEY,
    serviceRegion: process.env.AZURE_SPEECH_API_REGION,

    async transcribeAudio(filePath) {
        // Wait if the number of concurrent connections exceeds 100
        while (this.concurrentConnections > 100) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
        }

        // Increment the concurrent connections counter
        this.concurrentConnections++;

        var myResult = this.Result();

        try {
            const audio = await fsPromises.readFile(filePath);

            const audioConfig = sdk.AudioConfig.fromWavFileInput(audio);
            const speechConfig = sdk.SpeechConfig.fromSubscription(this.subscriptionKey, this.serviceRegion);

            const enLanguageConfig = sdk.SourceLanguageConfig.fromLanguage("en-US");
            const esLanguageConfig = sdk.SourceLanguageConfig.fromLanguage("es-ES");

            const languageConfig = sdk.AutoDetectSourceLanguageConfig.fromSourceLanguageConfigs([enLanguageConfig, esLanguageConfig]);

            // create the speech recognizer for English and Spanish
            const recognizer = new sdk.SpeechRecognizer.FromConfig(speechConfig, languageConfig, audioConfig);

            try {
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

                myResult.transcription = result.privText;
                myResult.success = true;
                myResult.language = result.privLanguage; // Include language information
                myResult.confidence = result.privLanguageDetectionConfidence; // Include language detection confidence
            } catch (error) {
                myResult.message = error;
            }
        } catch (error) {
            myResult.message = error;
        } finally {
            // Decrement the concurrent connections counter when the processing is done
            this.concurrentConnections--;
        }

        return myResult;
    },

    Result() {
        return {
            success: false,
            message: "",
            language: "",
            confidence: "",
            transcription: ""
        };
    },
};

export { throttledTranscription };
