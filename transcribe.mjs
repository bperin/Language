import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { promises as fsPromises } from 'fs';

// Define a rate limit for the method (3 calls per minute)
const rateLimit = {
    calls: 0,
    lastCallTimestamp: 0,
    maxCallsPerMinute: 3,
    delay: 20000, // Delay in milliseconds (20 seconds)
};

async function transcribeAudio(filePath) {
    // Calculate the current timestamp
    const currentTimestamp = Date.now();

    // Check if we've exceeded the rate limit for this minute
    if (
        rateLimit.calls >= rateLimit.maxCallsPerMinute &&
        currentTimestamp - rateLimit.lastCallTimestamp < 60000 // 60,000 milliseconds in a minute
    ) {
        // Calculate the time remaining in the current minute
        const timeRemaining = 60000 - (currentTimestamp - rateLimit.lastCallTimestamp);

        // Introduce a delay for the remaining time
        await new Promise(resolve => setTimeout(resolve, timeRemaining));

        // Reset the rate limit for the new minute
        rateLimit.calls = 0;
        rateLimit.lastCallTimestamp = 0;
    }

    // Load ENV variables for Azure
    const endpoint = process.env["AZURE_API_ENDPOINT"];
    const azureApiKey = process.env["AZURE_API_KEY"];
    const deploymentName = process.env["AZURE_DEPLOYMENT_NAME"];

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey)); // Create OpenAI Client

    const audio = await fsPromises.readFile(filePath);

    let result = Result();

    try {
        const format = 'verbose_json';
        const transcription = await client.getAudioTranscription(deploymentName, audio, format); // Get transcription as verbose JSON

        result.success = true;
        result.transcription = transcription.text;
        result.language = transcription.language;
        result.isSpanish = transcription.language === "spanish";

        // Update the rate limit tracking variables
        rateLimit.calls++;
        rateLimit.lastCallTimestamp = currentTimestamp;
    } catch (error) {
        result.message = error;
    }
    return result;
}

function Result() {
    return {
        success: false,
        message: "",
        isSpanish: false,
        language: "",
        transcription: ""
    };
}

export { transcribeAudio };
