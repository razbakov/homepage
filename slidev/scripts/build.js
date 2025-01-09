import { readdirSync, statSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const slidesDir = "../content/slides";
const distDir = "dist";

// Clean dist directory
execSync(`rm -rf ${distDir}`);
execSync(`mkdir -p ${distDir}`);

// Get all directories in slides
const dirs = readdirSync(slidesDir).filter((file) =>
  statSync(join(slidesDir, file)).isDirectory()
);

// Build each slides directory
for (const dir of dirs) {
  const slidePath = join(slidesDir, dir, "slides.md");
  const distPath = join(distDir, dir);

  console.log(`Building slides for ${dir}...`);

  try {
    // Build slides
    execSync(`pnpm slidev build ${slidePath} --base /${dir}/`, {
      stdio: "inherit",
    });
    // Move built files to dist directory
    execSync(`mv ${join(slidesDir, dir, "dist")} ${distPath}`);
    console.log(`✓ Built ${dir} slides successfully`);
  } catch (error) {
    console.error(`✗ Failed to build ${dir} slides:`, error.message);
  }
}
