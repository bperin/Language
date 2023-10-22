import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { transcribeAudio } from './script.mjs'; // Assuming you've exported the main functionality

describe('Script', () => {
    it('should handle missing file path', async () => {
        process.argv = ['node', 'script.js'];
        const result = await transcribeAudio();
        expect(result).toBe('Usage: node script.js <file_path>');
    });

    it('should handle non-WAV file', async () => {
        process.argv = ['node', 'script.js', 'non-wav-file.mp3'];
        const result = await transcribeAudio();
        expect(result).toBe('Please provide a WAV file.');
    });
});
