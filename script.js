const fs = require('fs');

// Check if a file path is provided as a command-line argument
if (process.argv.length < 3) {
    console.log('Usage: node script.js <file_path>');
    process.exit(1); // Exit the script with an error code
}

// Get the file path from the command-line arguments
const filePath = process.argv[2];

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(data); // Contents of the file
});