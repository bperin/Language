import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { promises as fsPromises } from 'fs';
import path from 'path';

(async () => {

    // Check if a file path is provided as a command-line argument
    if (process.argv.length < 3) {
        console.log('Usage: node script.js <file_path>');
        process.exit(1); // Exit the script with an error code
    }

    //load ENV variables for azure
    const endpoint = process.env["AZURE_API_ENDPOINT"];
    const azureApiKey = process.env["AZURE_API_KEY"];

    console.log(endpoint);
    console.log(azureApiKey);

    // Get the file path from the command-line arguments
    const filePath = process.argv[2];

    // Check if the file has a .wav extension
    if (path.extname(filePath).toLowerCase() !== '.wav') {
        console.log('Please provide a WAV file.');
        process.exit(1); // Exit the script with an error code
    }

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

    const deploymentName = "whisper-deployment";
    const audio = await fsPromises.readFile(filePath);
    const result = await client.getAudioTranscription(deploymentName, audio)
        .then(result => {
            console.log(`Transcription: ${result.text}`);
        })
        .catch(error => {
            console.error("An error occurred:", error);
        });

})();