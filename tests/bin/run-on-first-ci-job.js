const ciJobNumber = require("ci-job-number");
const { spawn } = require("child_process");

if (ciJobNumber() !== 1) {
  // If it's not the first job, then just return with a success code.
  process.exit(0);
}

// Run the command otherwise.
const parts = process.argv[2].split(" ");

const execution = spawn(parts[0], parts.slice(1));

execution.stdout.on("data", data => {
  process.stdout.write(data.toString());
});

execution.stderr.on("data", data => {
  console.error(data.toString());
});

execution.on("close", code => process.exit(code));
