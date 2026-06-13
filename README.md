# Privacy for WhatsApp Web (Auto Blur WA) ![Logo](https://github.com/aryomuzakki/privacy-whatsapp-web-auto-blur/blob/main/src/images/icon32.png?raw=true)

[![GitHub license](https://img.shields.io/github/license/aryomuzakki/privacy-whatsapp-web-auto-blur.svg)](https://github.com/aryomuzakki/privacy-whatsapp-web-auto-blur/blob/main/LICENSE)

> **Note on Revival**: This is a revived and actively maintained fork of the original [Privacy-Extension-For-WhatsApp-Web](https://github.com/LukasLen/Privacy-Extension-For-WhatsApp-Web) by Lukas Lenhardt. As the original extension has been unmaintained and WhatsApp Web continues to update, I (a former collaborator) have decided to release this version to ensure the community still has a working, up-to-date privacy tool.

<p align="center">
  <img width="48%" title="WhatsApp™ Web with the extension" alt="WhatsApp™ Web with the extension" src="https://github.com/aryomuzakki/privacy-whatsapp-web-auto-blur/blob/main/screenshots/PFWA_Header.png?raw=true">
  <img width="48%" title="WhatsApp™ Web with the extension" alt="WhatsApp™ Web with the extension" src="https://github.com/aryomuzakki/privacy-whatsapp-web-auto-blur/blob/main/screenshots/PFWA_Settings.png?raw=true">
</p>

To increase privacy in public spaces, Privacy for WhatsApp Web (Auto Blur WA) blurs your messages. Your messages and other content only reveals upon hovering over with your mouse cursor. Additionally you can quickly toggle all effects by using a keyboard shortcut or by clicking the toggle button in the extension menu.

---

<details>

<summary>
Table of Contents (Click to Show/Hide)
</summary>

---

## Table of Contents

- [Customize it](#customize-it)
  - [Quick Toggle](#quick-toggle)
- [Installation](#installation)
  - [Chrome](#chrome)
  - [Microsoft Edge](#microsoft-edge)
  - [Mozilla Firefox](#mozilla-firefox)
  - [Manual Load](#manual-load)
- [Issues and Feature Requests](#issues-and-feature-requests)
- [Development Guide](#development-guide)
  - [Quickstart for Chrome](#quickstart-for-chrome)
  - [Quickstart for Firefox](#quickstart-for-firefox)
- [License](#license)
- [Acknowledgments](#acknowledgments)

</details>

---

## Customize it

It adapts to your needs by letting you decide which elements you want to blur. Your options:

- All messages in chat: _Blurs all messages in the current chat._
- Last messages preview: _Blurs all message previews on the left._
- Media preview: _Blurs all images, videos, stickers, etc. in separation from the text._
- Media gallery: _Blurs all small icons of images, videos, etc. while viewing an image, video, etc._
- Text input: _Makes the color in your input field lighter to make it hard to read._
- Profile pictures: _Blurs all profile pictures._
- Group/Users names: _Blurs all group and usernames._
- No transition delay: _Allows you to turn off the delay before revealing an item on hover._
- Unblur all on app hover: _Unblurs all elements when you hover over the WhatsApp Web app._
- Blur WhatsApp on Idle: _Blurs WhatsApp when there is no mouse/keyboard activity after a certain time._
- Advanced Settings: _Customize the blur amount (in pixels) for various elements independently and set the idle timeout duration._
- Theme Toggle: _Switch between Light, Dark, or System Preference theme for the extension._

### Quick Toggle

You can quickly toggle the blur in the settings or with a keyboard shortcut (Default: Alt+X).
To change this navigate to:

- Chrome: [chrome://extensions/shortcuts](chrome://extensions/shortcuts)
- Firefox: [about:addons](about:addons) -> Settings icon on the top right -> Manage Extension Shortcuts

## Installation

### Chrome

**Official Chrome webstore page**: https://chromewebstore.google.com/detail/privacy-for-whatsapp-web/fbinmigdlajillpobajlalknjinccgem?utm_source=readme

### Microsoft Edge

Open the chrome webstore page link on microsoft edge and click `Get` button

### Mozilla Firefox

**Official Firefox Add-on page**: https://addons.mozilla.org/en-US/firefox/addon/privacy-for-whatsapp-web/

### Manual Load

If you prefer to load the extension manually without using the web stores:

1. Download the newest release [here](https://github.com/aryomuzakki/privacy-whatsapp-web-auto-blur/releases). Make sure to choose the respective zip file formatted for your browser (`[release_version]-[browser]-pfwa.zip`, e.g., `v3.4.1-chrome-pfwa.zip` or `v3.4.1-firefox-pfwa.zip`) and unzip it.
2. For **Chrome / Edge**:
   - Navigate to [chrome://extensions](chrome://extensions)
   - Activate the developer mode (on the top right)
   - Click on "Load Unpacked"
   - Select the unzipped folder (this folder has to be persistent so you might want to keep it somewhere where you won't delete it)
3. For **Firefox**:
   - Navigate to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
   - Click on "Load Temporary Add-on..."
   - Select the `manifest.json` file from your unzipped folder
4. Check back on the releases page for new updates

## Issues and Feature Requests

If you have a feature request or encountered a problem, please create a new issue under this link: [https://github.com/aryomuzakki/privacy-whatsapp-web-auto-blur/issues](https://github.com/aryomuzakki/privacy-whatsapp-web-auto-blur/issues)

## Development Guide

If you want to modify the extension code or run it directly from the source repository:

### Quickstart for Chrome

- Clone the repository
- Navigate to [chrome://extensions](chrome://extensions)
- Activate the developer mode (on the top right)
- Click on "Load Unpacked"
- Select the `/src` folder from the cloned repository
- You can edit the CSS and JS files in `/src`.

### Quickstart for Firefox

- Clone the repository
- Rename `src/manifest_firefox.json` into `manifest.json` (replacing the existing Chrome `manifest.json`, which you can optionally rename to `manifest_chrome.json`)
- Navigate to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
- Click on "Load Temporary Add-on..."
- Select the `manifest.json` file from the `/src` folder
- You can edit the CSS and JS files in `/src`.

> Make sure to check and edit `src/css/noDelay.css` and `src/css/unblurActive.css` too if the old class exists there when making styling changes.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/aryomuzakki/privacy-whatsapp-web-auto-blur/blob/main/LICENSE) file for details.

### Acknowledgments

- Original project and design by [Lukas Lenhardt](https://github.com/LukasLen)

---

> This extension does not collect information about you or your messages. Visit the [privacy policy](https://pfwa.muzakki.id/privacy-policy/) to learn more.
>
> **_Disclaimer:_** _WhatsApp is a trademark of WhatsApp LLC, a subsidiary of Meta Platforms, Inc., registered in the U.S. and other countries. This extension is an independent project and has no relationship with WhatsApp, WhatsApp LLC, or Meta Platforms, Inc._
