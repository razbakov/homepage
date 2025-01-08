import { exec } from "child_process";

const topic = process.argv[2];

if (!topic) {
  console.error("Please provide a topic name.");
  process.exit(1);
}

exec(
  `pnpm slidev content/slides/${topic}/slides.md --open`,
  (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
      process.exit(1);
    }
    console.log(stdout);
  }
);
