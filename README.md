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
        es-ES detected in 0.02 ms
        ha llegado al bu
        zón de correo
        de dar
        pro
        solutions
        le promete
        mos aquí
        no es
        donde
        las solici
        tudes de servicio
        se
        desvanecen en el a
        ire
        deje su
        nombre
        número de
        teléfono
        nombre
        comercial
        direc
        ción y solici
        tud de servicio
        le promete
        mos que
        alguien se pondrá
        en contacto
        con usted
        tan pronto como
        podamos
    ```

8. Run tests
    ```
    npm test
    ```