// Run the mraa-gpio utility as root
// Usage: `node gpio set 40 1` to turn on pin 40 and `node gpio set 40 0` to turn it off
const execFile = require('child_process').execFile;
const child = execFile('sudo', ['mraa-gpio', process.argv[2], process.argv[3], process.argv[4]], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
})

