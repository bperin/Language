# Language
 Detetct if a given audio file is spanish speaking, transcribe the file,
 Azure throttles requests to 3 per minute

# Steps
1. Install packages
    ```
    npm install @azure/openai
    npm install mocha chai
    ```
2. Deploy OpenAI Resource to North Central US get endpoint and api Key
3. Open zshrc
    ```
    vi ~/.zshrc
    ```
4. Add ENV variables, replace with your endpoint and API key
    ```
    export AZURE_API_ENDPOINT=https://opencity2.openai.azure.com/
    export AZURE_API_KEY=ff62e59e43c94f489efde8736e6b5ec4
    export AZURE_DEPLOYMENT_NAME=OpenCityWhisper
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
        "isSpanish": true,
        "transcription": "Ha llegado el buzón de correo de DART ProSolutions. Le prometemos, aquí no es donde las solicitudes de servicio se desvanecen en el aire. Deje su nombre, número de teléfono, nombre comercial, dirección y solicitudes de servicio. Le prometemos que alguien se pondrá en contacto con usted tan pronto como podamos. Gracias."
    }
    ```

8. Run tests
    ```
    npx mocha transcribeAudio.test.mjs
    ```