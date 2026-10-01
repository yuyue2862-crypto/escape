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
  const sphereNetwork = document.querySelector("#sphereNetwork");
  const latitudeTracks = document.querySelector("#latitudeTracks");
  const longitudeTracks = document.querySelector("#longitudeTracks");

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

  const sphereModel = {
    radius: 1,
    rotation: {
      x: 40,
      y: 14,
      z: -7,
    },
    camera: {
      position: [0.06, -0.18, -0.14],
      target: [0, 0.02, 1],
      focalLength: 720,
      center: [960, 555],
      nearPlane: 0.08,
    },
    latitudeValues: [-24, -8, 8, 24, 40],
    longitudeValues: [-48, -32, -16, 0, 16, 32, 48],
  };

  let deviceTimer = 0;
  let taskHasStarted = false;

  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function subtractVectors(left, right) {
    return left.map((value, index) => value - right[index]);
  }

  function dotProduct(left, right) {
    return left.reduce((sum, value, index) => sum + value * right[index], 0);
  }

  function crossProduct(left, right) {
    return [
      left[1] * right[2] - left[2] * right[1],
      left[2] * right[0] - left[0] * right[2],
      left[0] * right[1] - left[1] * right[0],
    ];
  }

  function normalizeVector(vector) {
    const length = Math.hypot(...vector);
    return vector.map((value) => value / length);
  }

  function rotateSpherePoint(point) {
    const rotationX = toRadians(sphereModel.rotation.x);
    const rotationY = toRadians(sphereModel.rotation.y);
    const rotationZ = toRadians(sphereModel.rotation.z);

    const afterX = [
      point[0],
      point[1] * Math.cos(rotationX) - point[2] * Math.sin(rotationX),
      point[1] * Math.sin(rotationX) + point[2] * Math.cos(rotationX),
    ];
    const afterY = [
      afterX[0] * Math.cos(rotationY) + afterX[2] * Math.sin(rotationY),
      afterX[1],
      -afterX[0] * Math.sin(rotationY) + afterX[2] * Math.cos(rotationY),
    ];

    return [
      afterY[0] * Math.cos(rotationZ) - afterY[1] * Math.sin(rotationZ),
      afterY[0] * Math.sin(rotationZ) + afterY[1] * Math.cos(rotationZ),
      afterY[2],
    ];
  }

  function createCameraBasis() {
    const forward = normalizeVector(
      subtractVectors(sphereModel.camera.target, sphereModel.camera.position),
    );
    const right = normalizeVector(crossProduct([0, 1, 0], forward));
    const up = normalizeVector(crossProduct(forward, right));

    return { forward, right, up };
  }

  const cameraBasis = createCameraBasis();

  function projectSpherePoint(point) {
    const rotatedPoint = rotateSpherePoint(point);
    const cameraVector = subtractVectors(rotatedPoint, sphereModel.camera.position);
    const depth = dotProduct(cameraVector, cameraBasis.forward);

    if (depth <= sphereModel.camera.nearPlane) {
      return null;
    }

    const viewX = dotProduct(cameraVector, cameraBasis.right);
    const viewY = dotProduct(cameraVector, cameraBasis.up);
    const screenX = sphereModel.camera.center[0] + (sphereModel.camera.focalLength * viewX) / depth;
    const screenY = sphereModel.camera.center[1] - (sphereModel.camera.focalLength * viewY) / depth;
    const isInsideExtendedView = screenX > -220 && screenX < 2140 && screenY > -180 && screenY < 1260;

    if (!isInsideExtendedView) {
      return null;
    }

    return {
      x: screenX,
      y: screenY,
      distance: Math.hypot(...cameraVector),
    };
  }

  function getLatitudePoint(latitude, longitude) {
    const latitudeRadians = toRadians(latitude);
    const longitudeRadians = toRadians(longitude);
    const horizontalRadius = sphereModel.radius * Math.cos(latitudeRadians);

    return [
      horizontalRadius * Math.sin(longitudeRadians),
      sphereModel.radius * Math.sin(latitudeRadians),
      horizontalRadius * Math.cos(longitudeRadians),
    ];
  }

  function getLongitudePoint(longitude, latitude) {
    return getLatitudePoint(latitude, longitude);
  }

  function projectLine(pointFactory, start, end, steps) {
    const segments = [];
    let currentSegment = [];

    for (let step = 0; step <= steps; step += 1) {
      const progress = step / steps;
      const value = start + (end - start) * progress;
      const projectedPoint = projectSpherePoint(pointFactory(value));

      if (projectedPoint) {
        currentSegment.push(projectedPoint);
        continue;
      }

      if (currentSegment.length > 1) {
        segments.push(currentSegment);
      }
      currentSegment = [];
    }

    if (currentSegment.length > 1) {
      segments.push(currentSegment);
    }

    return segments;
  }

  function createTrackPath(segment, type, lineIndex, segmentIndex) {
    const path = document.createElementNS(SVG_NAMESPACE, "path");
    const averageDistance = segment.reduce((sum, point) => sum + point.distance, 0) / segment.length;
    const proximity = Math.max(0, Math.min(1, (1.3 - averageDistance) / 0.52));
    const baseOpacity = type === "latitude" ? 0.29 : 0.27;
    const pathData = segment
      .map((point, pointIndex) => {
        const command = pointIndex === 0 ? "M" : "L";
        return `${command} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      })
      .join(" ");

    path.setAttribute("class", `light-track light-track--${type}`);
    path.setAttribute("d", pathData);
    path.setAttribute("data-line", String(lineIndex));
    path.setAttribute("data-segment", String(segmentIndex));
    path.style.setProperty("--track-opacity", (baseOpacity + proximity * 0.2).toFixed(3));
    path.style.setProperty("--track-delay", `${(-1.1 * lineIndex - 0.7 * segmentIndex).toFixed(1)}s`);

    return path;
  }

  function appendProjectedLine(group, type, lineIndex, segments) {
    segments.forEach((segment, segmentIndex) => {
      group.append(createTrackPath(segment, type, lineIndex, segmentIndex));
    });

    return segments.length > 0;
  }

  function buildSphereNetwork() {
    latitudeTracks.replaceChildren();
    longitudeTracks.replaceChildren();

    const visibleLatitudeCount = sphereModel.latitudeValues.reduce((count, latitude, lineIndex) => {
      const segments = projectLine(
        (longitude) => getLatitudePoint(latitude, longitude),
        -180,
        180,
        360,
      );
      return count + Number(appendProjectedLine(latitudeTracks, "latitude", lineIndex, segments));
    }, 0);

    const visibleLongitudeCount = sphereModel.longitudeValues.reduce((count, longitude, lineIndex) => {
      const segments = projectLine(
        (latitude) => getLongitudePoint(longitude, latitude),
        -89.5,
        89.5,
        240,
      );
      return count + Number(appendProjectedLine(longitudeTracks, "longitude", lineIndex, segments));
    }, 0);

    sphereNetwork.dataset.latitudeCount = String(visibleLatitudeCount);
    sphereNetwork.dataset.longitudeCount = String(visibleLongitudeCount);
  }

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

  buildSphereNetwork();
  beginOpening();
})();
