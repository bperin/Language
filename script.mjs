import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { formatWithOptions } from 'util';

async function transcribeAudio(filePath) {

    // Load ENV variables for Azure
    const endpoint = process.env["AZURE_API_ENDPOINT"];
    const azureApiKey = process.env["AZURE_API_KEY"];
    const deploymentName = process.env["AZURE_DEPLOYMENT_NAME"];

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey)); // Create OpenAI Client

    const audio = await fsPromises.readFile(filePath);

    let result = Result();

    try {

        const format = 'verbose_json';
        const transcription = await client.getAudioTranscription(deploymentName, audio, format); //get transcription as verbose json

        result.success = true;
        result.transcription = transcription.text;
        result.language = transcription.language;
        result.isSpanish = transcription.language == "spanish";

    } catch (error) {
        result.message = error;
    }
    return result;
}
if (process.argv.length !== 3) {
    console.log('Usage: node script.js <file_path>');
    process.exit(1); // Exit the script with an error code
}

const filePath = process.argv[2];

if (path.extname(filePath).toLowerCase() !== '.wav') {
    console.log('Please provide a WAV file.');
    process.exit(1); // Exit the script with an error code
}
transcribeAudio(filePath)
    .then(result => {
        console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
        console.log(JSON.stringify(error, null, 2));
    });
function Result() {
    return {
        success: false,
        message: "",
        isSpanish: false,
        language: "",
        transcription: ""
    };
}
