import { execSync } from "child_process";

const args = process.argv.slice(2);
const topic = args[0];

if (!topic) {
  console.error("Please provide a topic name");
  process.exit(1);
}

const slidePath = `../content/slides/${topic}/slides.md`;

try {
  execSync(`pnpm slidev ${slidePath} --open`, { stdio: "inherit" });
} catch (error) {
  console.error(`Failed to serve ${topic} slides:`, error.message);
}
