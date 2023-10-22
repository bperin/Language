# Language
 Detetct if a given audio file is spanish speaking
# Steps
1. Install packages
    ```
    npm install @azure/openai
    ``
2. Open zshrc
    ```vi ~/.zshrc```
3. Add ENV variables, replace with your endpoint and API key
    ```
    export AZURE_API_ENDPOINT=https://xxx.openai.azure.com/
    export AZURE_API_KEY=2ab54827560342249d74b80265427556
    ```
4.  Refresh ENV vars
    ```
    source ~/.zshrc
    ```
5.  Run
    ```
    node --experimental-modules script.mjs samples/spanish1.wav
    ```