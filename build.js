import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// Paths relative to repository root
const REPO_DIR = __dirname;
const SOURCE_DIR = path.join(REPO_DIR, "src");
const DEST_DIR = REPO_DIR;
const TEMP_DIR = path.join(REPO_DIR, "temp_build_src");

// 1. Read manifest to get the version
const manifestPath = path.join(SOURCE_DIR, "manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.error(`Error: manifest.json not found at ${manifestPath}`);
  process.exit(1);
}

const manifestContent = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestContent);
const version = manifest.version;

// Prefix (ignore CLI flags starting with --)
const argPrefix = process.argv.slice(2).find(arg => !arg.startsWith("--"));
const prefix = argPrefix || "blurwa";

const chromeZipName = `v${version}-chrome-${prefix}.zip`;
const firefoxZipName = `v${version}-firefox-${prefix}.zip`;

const chromeZipPath = path.join(DEST_DIR, chromeZipName);
const firefoxZipPath = path.join(DEST_DIR, firefoxZipName);

// Helper to run cross-platform zip command (tar on Windows 10/11, zip utility on Linux/macOS)
function createZip(sourcePath, destinationZip) {
  if (process.platform === "win32") {
    execSync(`tar -a -cf "${destinationZip}" -C "${sourcePath}" *`, { stdio: "inherit" });
  } else {
    execSync(`cd "${sourcePath}" && zip -r "${destinationZip}" .`, { stdio: "inherit" });
  }
}

console.log(`Starting build for version v${version}...\n`);

// 2. Create Chrome Zip
console.log(`[Chrome] Creating zip: ${chromeZipName}`);
if (fs.existsSync(chromeZipPath)) {
  fs.unlinkSync(chromeZipPath);
}
createZip(SOURCE_DIR, chromeZipPath);
console.log(`[Chrome] Zip created successfully at ${chromeZipPath}\n`);

// 3. Create Firefox Zip
console.log(`[Firefox] Creating zip: ${firefoxZipName}`);

if (fs.existsSync(TEMP_DIR)) {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}
fs.cpSync(SOURCE_DIR, TEMP_DIR, { recursive: true });

const tempManifestPath = path.join(TEMP_DIR, "manifest.json");
const tempFirefoxManifestPath = path.join(TEMP_DIR, "manifest_firefox.json");
const tempChromeManifestPath = path.join(TEMP_DIR, "manifest_chrome.json");

if (fs.existsSync(tempManifestPath)) {
  fs.unlinkSync(tempManifestPath);
}
if (fs.existsSync(tempFirefoxManifestPath)) {
  fs.renameSync(tempFirefoxManifestPath, tempManifestPath);
} else {
  console.warn(`[Firefox] Warning: manifest_firefox.json not found in source directory.`);
}

if (fs.existsSync(tempChromeManifestPath)) {
  fs.unlinkSync(tempChromeManifestPath);
}

if (fs.existsSync(firefoxZipPath)) {
  fs.unlinkSync(firefoxZipPath);
}

createZip(TEMP_DIR, firefoxZipPath);
// 4. Cleanup temporary directory unless --keep-temp is specified
const keepTemp = process.argv.includes("--keep-temp") || process.env.KEEP_TEMP === "true";
if (!keepTemp) {
  console.log(`Cleaning up temporary files...`);
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

console.log(`\nDone! Both extensions have been packaged.`);
