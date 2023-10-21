# Language
 Detetct if a given audio file is spanish speaking
# Steps
1. ```vi ~/.zshrc```
2. Add ENV variables, replace with your endpoint and API key
    ```
    export AZURE_API_ENDPOINT=https://opencity.openai.azure.com/
    export AZURE_API_KEY=2ab54827560342249d74b80265427557
    ```
3. ```
    source ~/.zshrc
    ```
4. ```
    node --experimental-modules script.mjs samples/spanish1.wav
    ```