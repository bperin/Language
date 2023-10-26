import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { promises as fsPromises } from 'fs';
import { fs } from 'fs';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const throttledTranscription = {
    rateLimit: {
        calls: 0,
        lastCallTimestamp: 0,
        maxCallsPerMinute: 3,
        delay: 20000, // Delay in milliseconds (20 seconds)
    },

    // Load ENV variables for Azure outside the function
    // endpoint: process.env.AZURE_API_ENDPOINT,
    subscriptionKey: process.env.AZURE_SPEECH_API_KEY,
    serviceRegion: process.env.AZURE_SPEECH_API_REGION,

    async transcribeAudio(filePath) {

        console.log(this.subscriptionKey);
        console.log(this.serviceRegion);

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

        let result = this.Result();

        try {
            // create the push stream we need for the speech sdk.
            const pushStream = sdk.AudioInputStream.createPushStream();

            // open the file and push it to the push stream.
            fsPromises.createReadStream(filePath).on('data', function (arrayBuffer) {
                pushStream.write(arrayBuffer.slice());
            }).on('end', function () {
                pushStream.close();
            });

            // we are done with the setup
            console.log("Now recognizing from: " + filePath);


            const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
            const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

            // setting the recognition language to English.
            speechConfig.speechRecognitionLanguage = "en-US";

            // create the speech recognizer.
            let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

            // start the recognizer and wait for a result.
            recognizer.recognizeOnceAsync(
                function (result) {
                    console.log(result);

                    recognizer.close();
                    recognizer = undefined;
                },
                function (err) {
                    console.log("err - " + err);

                    recognizer.close();
                    recognizer = undefined;
                });
        }
        catch (error) {
            console.log(error);
        }

        return result;
    },

    Result() {
        return {
            success: false,
            message: "",
            isSpanish: false,
            language: "",
            transcription: ""
        };
    },
};

export { throttledTranscription };
