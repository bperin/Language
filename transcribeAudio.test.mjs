import { expect } from 'chai';
import { throttledTranscription } from './transcribe.mjs';

describe('transcribeAudio', function () {

    this.timeout(60000 * 5); //set a long timeout because of quota rate throttling amount of test cases + 1

    const SPANISH = "es-ES";
    const ENGLISH = "en-US";

    it('should transcribe Spanish 1 audio file', async function () {

        //spanish success
        const filePath = 'samples/spanish1.wav';

        const result = await throttledTranscription.transcribeAudio(filePath);

        console.log(result);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(SPANISH);
    });
    it('should transcribe English 1 audio file', async function () {

        //english success
        const filePath = 'samples/english1.wav';

        const result = await throttledTranscription.transcribeAudio(filePath);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(ENGLISH);
    });
    it('should transcribe Spanish 2 audio file', async function () {

        //spanish success
        const filePath = 'samples/spanish2.wav';

        const result = await throttledTranscription.transcribeAudio(filePath);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(SPANISH);
    });
    it('should transcribe Spanish 3 audio file', async function () {

        //spanish success
        const filePath = 'samples/spanish3.wav';

        const result = await throttledTranscription.transcribeAudio(filePath);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(SPANISH);
    });
    it('should transcribe English 2 audio fileh', async function () {

        //english success
        const filePath = 'samples/english2.wav';

        const result = await throttledTranscription.transcribeAudio(filePath);

        expect(result.success).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal(ENGLISH);
    });
});
