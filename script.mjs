import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { promises as fsPromises } from 'fs';

async function transcribeAudio(filePath) {
    // Load ENV variables for Azure
    const endpoint = process.env["AZURE_API_ENDPOINT"];
    const azureApiKey = process.env["AZURE_API_KEY"];
    const deploymentName = process.env["AZURE_DEPLOYMENT_NAME"];

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey)); // Create OpenAI Client

    const audio = await fsPromises.readFile(filePath);

    try {
        const result = await client.getAudioTranscription(deploymentName, audio);
        if (result.language === "spanish") {
            return `Spanish Transcription: ${result.text}`;
        } else {
            return `${result.language} Transcription: ${result.text}`;
        }
    } catch (error) {
        return `An error occurred: ${error}`;
    }
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
        console.log(result);
    })
    .catch(error => {
        console.error("An error occurred:", error);
    });
