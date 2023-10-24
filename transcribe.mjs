// Import necessary modules
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { promises as fsPromises } from 'fs';

const throttledTranscription = {
    rateLimit: {
        calls: 0,
        lastCallTimestamp: 0,
        maxCallsPerMinute: 3,
        delay: 20000, // Delay in milliseconds (20 seconds)
    },

    // Load ENV variables for Azure outside the function
    endpoint: process.env.AZURE_API_ENDPOINT,
    azureApiKey: process.env.AZURE_API_KEY,
    deploymentName: process.env.AZURE_DEPLOYMENT_NAME,

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

        const client = new OpenAIClient(this.endpoint, new AzureKeyCredential(this.azureApiKey)); // Create OpenAI Client

        const audio = await fsPromises.readFile(filePath);

        let result = this.Result();

        try {
            const format = 'verbose_json';
            const transcription = await client.getAudioTranscription(this.deploymentName, audio, format); // Get transcription as verbose JSON

            result.success = true;
            result.transcription = transcription.text;
            result.language = transcription.language;
            result.isSpanish = transcription.language === "spanish";

            // Update the rate limit tracking variables
            this.rateLimit.calls++;
            this.rateLimit.lastCallTimestamp = currentTimestamp;
        } catch (error) {
            result.message = error;
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
