const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Enter the text to write to the file (type "exit" or press Ctrl+C to finish)');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Adiós');
    rl.close();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('close', () => {
  console.log('Auf Wiedersehen');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Auf Wiedersehen');
  rl.close();
});

