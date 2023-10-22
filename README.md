# Language
 Detetct if a given audio file is spanish speaking
# Steps
1. Install packages
    ```
    npm install @azure/openai
    ``
2. Deploy OpenAi Resource to North Central US
3. Open zshrc
    ```vi ~/.zshrc```
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
6.  Run
    ```
    node --experimental-modules script.mjs samples/spanish1.wav
    ```