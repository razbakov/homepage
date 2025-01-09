import { readdirSync, statSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const slidesDir = "content/slides";
const publicDir = "public/slides";

// Clean public/slides directory
execSync(`rm -rf ${publicDir}`);
execSync(`mkdir -p ${publicDir}`);

// Get all directories in content/slides
const dirs = readdirSync(slidesDir).filter((file) =>
  statSync(join(slidesDir, file)).isDirectory()
);

// Build each slides directory
for (const dir of dirs) {
  const slidePath = join(slidesDir, dir, "slides.md");
  const publicPath = join(publicDir, dir);

  console.log(`Building slides for ${dir}...`);

  try {
    // Build slides
    execSync(`pnpm slidev build ${slidePath} --base /slides/${dir}/`, {
      stdio: "inherit",
    });
    // Move built files to public directory
    execSync(`mv ${join(slidesDir, dir, "dist")} ${publicPath}`);
    console.log(`✓ Built ${dir} slides successfully`);
  } catch (error) {
    console.error(`✗ Failed to build ${dir} slides:`, error.message);
  }
}
