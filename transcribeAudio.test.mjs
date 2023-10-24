import { expect } from 'chai';
import { transcribeAudio } from './transcribe.mjs';

describe('transcribeAudio', function () {

    this.timeout(180000); //set a long timeout because of quota rate throttling

    it('should transcribe Spanish 1 audio file and set isSpanish to true', async function () {

        //spanish success
        const filePath = 'samples/spanish1.wav';

        const result = await transcribeAudio(filePath);

        expect(result.success).to.be.true;
        expect(result.isSpanish).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal('spanish');
    });
    it('should transcribe English 1 audio file and set isSpanish to false, is english', async function () {

        //english success
        const filePath = 'samples/english1.wav';

        const result = await transcribeAudio(filePath);

        expect(result.success).to.be.true;
        expect(result.isSpanish).to.be.false;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal('english');
    });
    it('should transcribe Spanish 2 audio file and set isSpanish to true', async function () {

        //spanish success
        const filePath = 'samples/spanish2.wav';

        const result = await transcribeAudio(filePath);

        expect(result.success).to.be.true;
        expect(result.isSpanish).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal('spanish');
    });
    it('should transcribe Spanish 3 audio file and set isSpanish to true', async function () {

        //spanish success
        const filePath = 'samples/spanish3.wav';

        const result = await transcribeAudio(filePath);

        expect(result.success).to.be.true;
        expect(result.isSpanish).to.be.true;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal('spanish');
    });
    it('should transcribe English 2 audio file and set isSpanish to false, is english', async function () {

        //english success
        const filePath = 'samples/english2.wav';

        const result = await transcribeAudio(filePath);

        expect(result.success).to.be.true;
        expect(result.isSpanish).to.be.false;
        expect(result.transcription).to.be.a('string');
        expect(result.language).to.equal('english');
    });
});
