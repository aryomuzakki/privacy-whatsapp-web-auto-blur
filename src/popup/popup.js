/* Privacy for WhatsApp Web (Auto Blur WA)                           */
/* Original Copyright (c) 2024 Lukas Lenhardt - lukaslen.com         */
/* Fork & Maintenance Copyright (c) 2026 M Aryo Muzakki - muzakki.id */
/* Released under the MIT license, see LICENSE file for details      */

// Remove this upon Chrome supporting the browser namespace
if (typeof browser == "undefined") {
  // Redefine browser namespace for Chrome for interoperability with Firefox
  globalThis.browser = chrome;
}

const styleIdentifier = "pfwa";
const settingsIdentifier = "settings";

let version = browser.runtime.getManifest().version;
document.getElementById('version').innerText = version;

document.querySelectorAll('[data-locale]').forEach(e => {
  e.innerText = browser.i18n.getMessage(e.dataset.locale);
});
document.querySelectorAll('[data-localetitle]').forEach(e => {
  e.title = browser.i18n.getMessage(e.dataset.localetitle);
});

// Track switch changes and save settings
function saveSettings() {
  let id = this.dataset.style;
  let checked = this.checked;

  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (!result.hasOwnProperty(settingsIdentifier)) {
      browser.runtime.reload();
      return;
    }
    if (id == "on") {
      result.settings.on = checked;
    } else if (id === "blurOnIdle") {
      result.settings.blurOnIdle.isEnabled = checked;
    } else {
      result.settings.styles[id] = checked;
    }
    browser.storage.sync.set(result);
  });
}
const switches = document.querySelectorAll("input[type='checkbox']");
switches.forEach((checkbox) => {
  checkbox.addEventListener('change', saveSettings);
});

// toggle open/close blur amount settings
const onClickOutside = (targetElement, callback, once = true) => {
  function handler(ev) {
    if (!ev.composedPath().includes(targetElement)) {
      callback(ev);
      if (once) {
        document.removeEventListener("click", handler);
      }
    }
  }

  setTimeout(() => {
    document.addEventListener("click", handler);
  }, 0);

  return () => document.removeEventListener("click", handler);
}

let removeOutsideListener = null;

const togglePopup = (ev) => {
  const popoverElement = ev.currentTarget.parentNode.querySelector(".popover");
  const trigger = ev.currentTarget;

  const closeSetting = () => {
    trigger.classList.remove("active");
    popoverElement.setAttribute("aria-hidden", "true");
    popoverElement.style.maxHeight = null;
  }

  if (!trigger.classList.contains("active")) {
    trigger.classList.add("active");
    popoverElement.removeAttribute("aria-hidden");
    popoverElement.style.maxHeight = popoverElement.scrollHeight + "px";
    removeOutsideListener = onClickOutside(ev.currentTarget.parentNode.querySelector(".popover"), (ev) => {
      closeSetting();
    });
  } else {
    closeSetting();
    removeOutsideListener();
  }
}

const cancelAdvancedSetting = (ev) => {
  const popoverElement = ev.currentTarget.parentNode;

  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (!result.hasOwnProperty(settingsIdentifier)) {
      browser.runtime.reload();
      return;
    }
    popoverElement.querySelectorAll("input[type='number']").forEach(input => {
      const varName = input.dataset.varName;
      input.value = parseInt(
        varName === "itBlur"
          ? result.settings?.blurOnIdle?.idleTimeout || 15
          : result.settings.varStyles[varName]
      );
    });

    popoverElement.parentNode.querySelector(".trigger-btn.active")?.classList.remove("active");
    popoverElement.setAttribute("aria-hidden", "true");
    popoverElement.style.maxHeight = null;
    removeOutsideListener?.();
  })
}

const triggerButtons = document.querySelectorAll(".trigger-btn");
triggerButtons.forEach((triggerBtn) => {
  triggerBtn.addEventListener("click", togglePopup);
});
const cancelButtons = document.querySelectorAll(".cancel-btn");
cancelButtons.forEach((cancelBtn) => {
  cancelBtn.addEventListener("click", cancelAdvancedSetting);
});

// toast utility
const showToast = (message, duration = 3000, persistent = false) => {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
      <p class="msg">${message}</p>
      ${persistent ? `<button class="toast-close-btn">×</button>` : ""}
    `;
  container.appendChild(toast);

  const removeToast = (toast) => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }

  setTimeout(() => toast.classList.add('show'), 10);

  if (!persistent) {
    setTimeout(() => {
      removeToast(toast);
    }, duration < 0 ? 3000 : duration);
  } else {
    toast.querySelector(".toast-close-btn").addEventListener("click", () => {
      removeToast(toast);
    })
  }
}

// track form save/submit for advanced settings (variable style settings)
function saveFormSettings(ev) {
  ev.preventDefault();
  const [key, val] = Object.entries(Object.fromEntries(new FormData(ev.target)))[0];

  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (!result.hasOwnProperty(settingsIdentifier)) {
      browser.runtime.reload();
      return;
    }
    if (key === "itBlur") {
      result.settings.blurOnIdle.idleTimeout = val;
    } else {
      result.settings.varStyles[key] = val + "px";
    }
    browser.storage.sync.set(result);

    showToast(browser.i18n.getMessage('toastSaved'));
  });
}
const forms = document.querySelectorAll("form.var-style");
forms.forEach((form) => {
  form.addEventListener("submit", saveFormSettings);
})


// Load settings and update switches
browser.storage.sync.get([settingsIdentifier]).then((result) => {
  if (!result.hasOwnProperty(settingsIdentifier)) {
    browser.runtime.reload();
    return;
  }

  switches.forEach((checkbox) => {
    let id = checkbox.dataset.style;
    if (id == "on") {
      checkbox.checked = result.settings.on;
    } else if (id === "blurOnIdle") {
      checkbox.checked = result.settings?.blurOnIdle?.isEnabled;
    } else {
      checkbox.checked = result.settings.styles[id];
    }
  });

  // set variable input value
  forms.forEach((form) => {
    const numInput = form.querySelector(`input[type="number"]`)
    const varName = numInput.dataset.varName;
    if (varName === "itBlur") {
      numInput.value = parseInt(result.settings?.blurOnIdle?.idleTimeout || 15);
    } else {
      numInput.value = parseInt(result.settings.varStyles[varName]);
    }
  })

});