# Automated Extension Publishing Guide (GitHub Actions)

This repository includes a GitHub Actions workflow ([`.github/workflows/publish.yml`](.github/workflows/publish.yml)) that automates building, GitHub Release creation, Chrome Web Store uploads, and Firefox Add-on (AMO) submissions whenever a version tag (e.g. `v3.4.4`) is pushed.

---

## 📑 Table of Contents

1. [How It Works](#-how-it-works)
2. [Step 1: Obtain Store API Credentials](#-step-1-obtain-store-api-credentials)
   - [Chrome Web Store API Setup](#1-chrome-web-store-api-setup)
   - [Firefox AMO API Setup](#2-firefox-amo-api-setup)
3. [Step 2: Configure GitHub Secrets](#-step-2-configure-github-secrets)
4. [Step 3: Flexible Publishing (Chrome-Only or Firefox-Only)](#-step-3-flexible-publishing-chrome-only-or-firefox-only)
5. [Step 4: Triggering an Automated Release](#-step-4-triggering-an-automated-release)

---

## 🚀 How It Works

```
Push Git Tag (v3.4.4) ──► Run build.js ──► Create GitHub Release ──► Upload to Chrome & Firefox Stores
```

> 💡 **Zero Maintenance Per Release**: Once the one-time credential setup (Steps 1 & 2) is completed, **pushing a version tag is literally the ONLY thing you need to do for every future release!** You do **not** need to re-generate tokens, run build scripts locally, or upload anything manually.

### Execution Steps Executed Automatically by GitHub:

1. **Trigger**: Push a version tag to GitHub (`git tag v3.4.4 && git push origin v3.4.4`).
2. **Build**: GitHub Actions automatically runs `bun build.js` to create Chrome (`-chrome-blurwa.zip`) and Firefox (`-firefox-blurwa.zip`) packages.
3. **Release**: GitHub Actions creates a GitHub Release with status badges and attaches the `.zip` packages.
4. **Publish**: GitHub Actions uploads the Chrome package to the Chrome Web Store and submits the Firefox package to Mozilla AMO.

---

## 🛠️ Step 1: Obtain Store API Credentials

Before configuring GitHub Secrets, generate the required API credentials for each store:

### 1. Chrome Web Store API Setup

To allow GitHub Actions to upload `.zip` builds to the Chrome Web Store:

1. **Google Cloud Project**:
   - Open [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
   - Go to **APIs & Services** > **Library**, search for **Chrome Web Store API**, and click **Enable**.
2. **OAuth 2.0 Client Credentials**:
   - Go to **APIs & Services** > **Credentials** > **Create Credentials** > **OAuth client ID**.
   - Select Application type: **Desktop app**.
   - Copy your **Client ID** and **Client Secret**.
3. **OAuth Refresh Token**:
   - Open [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
   - Click the ⚙️ gear icon (top-right), check **Use your own OAuth credentials**, and enter your **Client ID** & **Client Secret**.
   - In the left sidebar, select/enter scope: `https://www.googleapis.com/auth/chromewebstore` and click **Authorize APIs**.
   - Log in with your Google Developer account and authorize access.
   - Click **Exchange authorization code for tokens** and copy your **Refresh Token**.

4. **Chrome Extension ID & Store URL**:
   - Locate your Extension ID from the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/) (e.g. `fbinmigdlajillpobajlalknjinccgem`).

---

### 2. Firefox AMO API Setup

To allow GitHub Actions to submit builds to Mozilla Add-ons (AMO):

1. **Generate API Keys**:
   - Log in to [Mozilla AMO API Keys](https://addons.mozilla.org/en-US/developers/addon/api/key/).
   - Click **Generate new credentials**.
   - Copy your **JWT Issuer** (API Key) and **JWT Secret** (API Secret).
2. **Add-on Slug & Store URL**:
   - Locate your Add-on Slug from the [Firefox Developer Hub](https://addons.mozilla.org/en-US/developers/) (e.g. `privacy-for-whatsapp-web`).

---

## 🔑 Step 2: Configure GitHub Secrets

Navigate to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**, and add the credentials obtained from Step 1:

### 🌐 Chrome Web Store Secrets

| Secret Name            | Description                           | Example                                        | Where to Find                                               |
| ---------------------- | ------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| `CHROME_EXTENSION_ID`  | Item ID from Chrome Developer Console | `fbinmigdlajillpobajlalknjinccgem`             | [Chrome Web Store API Setup](#1-chrome-web-store-api-setup) |
| `CHROME_CLIENT_ID`     | OAuth 2.0 Client ID                   | `xxxx.apps.googleusercontent.com`              | [Chrome Web Store API Setup](#1-chrome-web-store-api-setup) |
| `CHROME_CLIENT_SECRET` | OAuth 2.0 Client Secret               | `GOCSPX-xxxx`                                  | [Chrome Web Store API Setup](#1-chrome-web-store-api-setup) |
| `CHROME_REFRESH_TOKEN` | OAuth 2.0 Refresh Token               | `1//0xxxx`                                     | [Chrome Web Store API Setup](#1-chrome-web-store-api-setup) |
| `CHROME_STORE_URL`     | Public Web Store Listing URL          | `https://chromewebstore.google.com/detail/...` | [Chrome Web Store API Setup](#1-chrome-web-store-api-setup) |

### 🦊 Firefox Add-ons (AMO) Secrets

| Secret Name         | Description                       | Example                                              | Where to Find                                     |
| ------------------- | --------------------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| `AMO_ADDON_ID`      | Add-on Slug or ID                 | `privacy-for-whatsapp-web`                           | [Firefox AMO API Setup](#2-firefox-amo-api-setup) |
| `AMO_JWT_ISSUER`    | JWT Issuer (API Key)              | `user:12345:678`                                     | [Firefox AMO API Setup](#2-firefox-amo-api-setup) |
| `AMO_JWT_SECRET`    | JWT Secret (API Secret)           | `64_char_hex_secret...`                              | [Firefox AMO API Setup](#2-firefox-amo-api-setup) |
| `FIREFOX_STORE_URL` | Public Firefox Add-on Listing URL | `https://addons.mozilla.org/en-US/firefox/addon/...` | [Firefox AMO API Setup](#2-firefox-amo-api-setup) |

---

## ⚙️ Step 3: Flexible Publishing (Chrome-Only or Firefox-Only)

The workflow (`.github/workflows/publish.yml`) includes built-in conditional execution checks:

- **Chrome-Only Publishing**: If you only want to publish to the Chrome Web Store, leave the Firefox secrets (`AMO_JWT_ISSUER`, `AMO_ADDON_ID`) empty or unconfigured. The Firefox upload step will automatically be skipped.
- **Firefox-Only Publishing**: If you only want to publish to Firefox Add-ons, leave the Chrome secrets (`CHROME_CLIENT_ID`, `CHROME_EXTENSION_ID`) empty or unconfigured. The Chrome upload step will automatically be skipped.
- **Both Stores**: Configure both sets of secrets to publish to Chrome and Firefox simultaneously.

---

## 📦 Step 4: Triggering an Automated Release

Whenever a new version is ready:

1. Update the `"version"` field in `src/manifest.json` and `src/manifest_firefox.json` (e.g. `"3.4.4"`).
2. Commit and push the changes:
   ```bash
   git add .
   git commit -m "chore: bump version to 3.4.4"
   git push origin main
   ```
3. Tag the version and push the tag:
   ```bash
   git tag v3.4.4
   git push origin v3.4.4
   ```
4. Open your GitHub Repository > **Actions** tab to watch the build, release, and store submission execute automatically!
