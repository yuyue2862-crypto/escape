(() => {
  "use strict";

  const scene = document.querySelector("#scene");
  const intro = document.querySelector("#intro");
  const introMessage = document.querySelector("#introMessage");
  const narration = document.querySelector("#narration");
  const signal = document.querySelector("#signal");
  const soundToggle = document.querySelector("#soundToggle");
  const device = document.querySelector("#device");
  const deviceDock = document.querySelector("#deviceDock");
  const deviceClose = document.querySelector("#deviceClose");
  const taskPrompt = document.querySelector("#taskPrompt");
  const taskReminder = document.querySelector("#taskReminder");

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  let deviceTimer = 0;
  let taskHasStarted = false;

  async function showIntroLine(text) {
    introMessage.textContent = text;
    await wait(80);
    introMessage.classList.add("is-visible");
    await wait(1900);
    introMessage.classList.remove("is-visible");
    await wait(1050);
  }

  async function beginOpening() {
    await wait(850);
    await showIntroLine("信号异常……");
    await showIntroLine("定位丢失……");
    await showIntroLine("返航失败……");

    scene.setAttribute("aria-hidden", "false");
    scene.classList.add("is-recovering");
    intro.classList.add("is-gone");

    await wait(3000);
    soundToggle.classList.add("is-visible");
    await wait(1700);
    narration.classList.add("is-visible");
    await wait(4700);
    signal.classList.add("is-visible");
    await wait(1500);
    narration.classList.remove("is-visible");
  }

  function setDeviceOpen(isOpen) {
    window.clearTimeout(deviceTimer);
    device.classList.toggle("is-open", isOpen);
    deviceDock.setAttribute("aria-expanded", String(isOpen));
    deviceDock.setAttribute("aria-label", isOpen ? "返航定位器已打开" : "打开返航定位器");

    if (isOpen) {
      deviceTimer = window.setTimeout(() => setDeviceOpen(false), 6800);
      return;
    }

    if (!taskHasStarted) {
      startTaskBeat();
    }
  }

  async function startTaskBeat() {
    taskHasStarted = true;
    scene.classList.add("tracks-awake");
    await wait(800);
    taskPrompt.classList.add("is-visible");
    await wait(3900);
    taskPrompt.classList.remove("is-visible");
    await wait(1000);
    taskReminder.classList.add("is-visible");
  }

  signal.addEventListener("click", () => {
    signal.classList.remove("is-visible");
    signal.disabled = true;
    device.classList.add("is-found");
    window.setTimeout(() => setDeviceOpen(true), 420);
  });

  deviceDock.addEventListener("click", () => setDeviceOpen(true));
  deviceClose.addEventListener("click", () => setDeviceOpen(false));

  soundToggle.addEventListener("click", () => {
    const isMuted = soundToggle.getAttribute("aria-pressed") === "true";
    soundToggle.setAttribute("aria-pressed", String(!isMuted));
    soundToggle.setAttribute("aria-label", isMuted ? "声音已开启" : "声音已关闭");
  });

  beginOpening();
})();
