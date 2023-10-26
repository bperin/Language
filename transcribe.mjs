import { promises as fsPromises } from 'fs';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const throttledTranscription = {
    rateLimit: {
        calls: 0,
        lastCallTimestamp: 0,
        maxCallsPerMinute: 20,
    },

    // Load ENV variables for Azure outside the function
    subscriptionKey: process.env.AZURE_SPEECH_API_KEY,
    serviceRegion: process.env.AZURE_SPEECH_API_REGION,

    async transcribeAudio(filePath) {

        // Calculate the current timestamp
        const currentTimestamp = Date.now();

        // Check if we've exceeded the rate limit for this minute
        if (
            this.rateLimit.calls >= this.rateLimit.maxCallsPerMinute &&
            currentTimestamp - this.rateLimit.lastCallTimestamp < 60000 // 60,000 milliseconds in a minute
        ) {
            // Calculate the time remaining in the current minute
            const timeRemaining = 60000 - (currentTimestamp - this.rateLimit.lastCallTimestamp);

            // Introduce a delay for the remaining time
            await new Promise(resolve => setTimeout(resolve, timeRemaining));

            // Reset the rate limit for the new minute
            this.rateLimit.calls = 0;
            this.rateLimit.lastCallTimestamp = 0;
        }

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
                myResult = await new Promise((resolve, reject) => {
                    recognizer.recognizeOnceAsync(
                        function (result) {
                            myResult.transcription = result.privText;
                            myResult.success = true;
                            myResult.language = result.privLanguage; // Include language information
                            myResult.confidence = result.privLanguageDetectionConfidence; // Include language detection confidence

                            recognizer.close();
                            recognizer = undefined;

                            resolve(myResult);
                        },
                        function (err) {
                            recognizer.close();
                            recognizer = undefined;
                            myResult.message = err;

                            reject(myResult);
                        }
                    );
                });
            } catch (error) {
                myResult.message = error;
            }
        } catch (error) {
            myResult.message = error;
        }
        console.log(myResult);
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
