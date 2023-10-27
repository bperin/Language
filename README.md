# Language
 Detetct if a given audio file is spanish or english, transcribe the file. Supports 100 concurrent connections

# Steps
1. Install packages
    ```
    npm install mocha chai
    npm install microsoft-cognitiveservices-speech-sdk
    npm install @azure/ai-language-text
    ```
2. Deploy OpenAI Resource to North Central US get endpoint and api Key
3. Open zshrc
    ```
    vi ~/.zshrc
    ```
4. Add ENV variables, replace with your endpoint and API key
    ```
    export AZURE_SPEECH_API_KEY=2ce469f2fb74446aa9e71b4d3a86450a
    export AZURE_SPEECH_API_REGION=eastus
    ```
5.  Refresh ENV vars
    ```
    source ~/.zshrc
    ```
6.  Comand line usage
    ```
    node script.mjs samples/spanish1.wav
    node script.mjs samples/spanish2.wav
    node script.mjs samples/spanish3.wav
    node script.mjs samples/english1.wav
    node script.mjs samples/english2.wav
    ```
7. Output
    ```
    {
        "success": true,
        "message": "",
        "language": "es-ES",
        "transcription": "Ha llegado el buzón de correo de DART ProSolutions. Le prometemos, aquí no es donde las solicitudes de servicio se desvanecen en el aire. Deje su nombre, número de teléfono, nombre comercial, dirección y solicitudes de servicio. Le prometemos que alguien se pondrá en contacto con usted tan pronto como podamos. Gracias."
    }
    ```

8. Run tests
    ```
    npx mocha transcribeAudio.test.mjs
    ```