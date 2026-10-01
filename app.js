(() => {
  "use strict";

  const scene = document.querySelector("#scene");
  const intro = document.querySelector("#intro");
  const introMessage = document.querySelector("#introMessage");
  const narration = document.querySelector("#narration");
  const signal = document.querySelector("#signal");
  const signalGuide = document.querySelector("#signalGuide");
  const signalGuideText = document.querySelector("#signalGuideText");
  const soundToggle = document.querySelector("#soundToggle");
  const device = document.querySelector("#device");
  const deviceDock = document.querySelector("#deviceDock");
  const deviceClose = document.querySelector("#deviceClose");
  const taskPrompt = document.querySelector("#taskPrompt");
  const taskTitle = document.querySelector("#taskTitle");
  const taskAction = document.querySelector("#taskAction");
  const taskReminder = document.querySelector("#taskReminder");
  const sphereNetwork = document.querySelector("#sphereNetwork");
  const latitudeTracks = document.querySelector("#latitudeTracks");
  const longitudeTracks = document.querySelector("#longitudeTracks");
  const investigationFeedback = document.querySelector("#investigationFeedback");
  const scanRecords = document.querySelector("#scanRecords");
  const scanStage = document.querySelector("#scanStage");
  const scanSphereShell = document.querySelector("#scanSphereShell");
  const scanContext = document.querySelector("#scanContext");
  const scanDrawing = document.querySelector("#scanDrawing");
  const scanResult = document.querySelector("#scanResult");
  const scanContinue = document.querySelector("#scanContinue");
  const comparisonStage = document.querySelector("#comparisonStage");
  const comparisonLatitude = document.querySelector("#comparisonLatitude");
  const comparisonLongitude = document.querySelector("#comparisonLongitude");
  const comparisonFeedback = document.querySelector("#comparisonFeedback");
  const namingStage = document.querySelector("#namingStage");
  const namingObservation = document.querySelector("#namingObservation");
  const namingTitle = document.querySelector("#namingTitle");
  const namingNote = document.querySelector("#namingNote");
  const namingContinue = document.querySelector("#namingContinue");

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

  // TODO: 找到正式背景音乐后，把文件放入 assets/audio/
  // 并将 bgmSrc 改为例如 "assets/audio/bgm.mp3"
  const audioConfig = {
    bgmSrc: "",
    bgmVolume: 0.18,
    bgmLoop: true,
  };

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
    latitudeValues: [-60, -40, -20, 0, 20, 40, 60],
    longitudeValues: Array.from({ length: 18 }, (_, index) => -180 + index * 20),
  };

  let deviceTimer = 0;
  let taskHasStarted = false;
  let investigationPhase = "opening";
  let feedbackTimer = 0;
  let taskPromptTimer = 0;
  let audioContext = null;
  let backgroundMusic = null;
  const scannedTypes = new Set();
  const scanHistory = [];

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

  function rotateSpherePoint(point, model = sphereModel) {
    const rotationX = toRadians(model.rotation.x);
    const rotationY = toRadians(model.rotation.y);
    const rotationZ = toRadians(model.rotation.z);

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

  function createCameraBasis(model = sphereModel) {
    const forward = normalizeVector(
      subtractVectors(model.camera.target, model.camera.position),
    );
    const right = normalizeVector(crossProduct([0, 1, 0], forward));
    const up = normalizeVector(crossProduct(forward, right));

    return { forward, right, up };
  }

  const cameraBasis = createCameraBasis();

  function projectSpherePoint(point, model = sphereModel, basis = cameraBasis) {
    const rotatedPoint = rotateSpherePoint(point, model);
    const cameraVector = subtractVectors(rotatedPoint, model.camera.position);
    const depth = dotProduct(cameraVector, basis.forward);

    if (depth <= model.camera.nearPlane) {
      return null;
    }

    const viewX = dotProduct(cameraVector, basis.right);
    const viewY = dotProduct(cameraVector, basis.up);
    const screenX = model.camera.center[0] + (model.camera.focalLength * viewX) / depth;
    const screenY = model.camera.center[1] - (model.camera.focalLength * viewY) / depth;
    const bounds = model.camera.bounds || [-220, 2140, -180, 1260];
    const isInsideExtendedView = screenX > bounds[0]
      && screenX < bounds[1]
      && screenY > bounds[2]
      && screenY < bounds[3];

    if (!isInsideExtendedView) {
      return null;
    }

    return {
      x: screenX,
      y: screenY,
      distance: Math.hypot(...cameraVector),
      depth,
      rotatedPoint,
    };
  }

  function getLatitudePoint(latitude, longitude, radius = sphereModel.radius) {
    const latitudeRadians = toRadians(latitude);
    const longitudeRadians = toRadians(longitude);
    const horizontalRadius = radius * Math.cos(latitudeRadians);

    return [
      horizontalRadius * Math.sin(longitudeRadians),
      radius * Math.sin(latitudeRadians),
      horizontalRadius * Math.cos(longitudeRadians),
    ];
  }

  function getLongitudePoint(longitude, latitude, radius = sphereModel.radius) {
    return getLatitudePoint(latitude, longitude, radius);
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
    const baseOpacity = type === "latitude" ? 0.59 : 0.56;
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
    path.style.setProperty("--track-opacity", (baseOpacity + proximity * 0.1).toFixed(3));
    path.style.setProperty("--track-delay", `${(-1.1 * lineIndex - 0.7 * segmentIndex).toFixed(1)}s`);

    return path;
  }

  function createHitPath(segment, type, lineIndex, segmentIndex) {
    const path = document.createElementNS(SVG_NAMESPACE, "path");
    const pathData = segment
      .map((point, pointIndex) => {
        const command = pointIndex === 0 ? "M" : "L";
        return `${command} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      })
      .join(" ");

    path.setAttribute("class", "track-hit-area");
    path.setAttribute("d", pathData);
    path.setAttribute("data-track-type", type);
    path.setAttribute("data-line", String(lineIndex));
    path.setAttribute("data-segment", String(segmentIndex));

    return path;
  }

  function appendProjectedLine(group, type, lineIndex, segments) {
    segments.forEach((segment, segmentIndex) => {
      group.append(createHitPath(segment, type, lineIndex, segmentIndex));
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

  const scanProjectionModels = {
    latitude: {
      radius: 1,
      rotation: { x: -14, y: 0, z: 0 },
      center: [250, 250],
      scale: 180,
    },
    longitude: {
      radius: 1,
      rotation: { x: 0, y: 0, z: 0 },
      center: [250, 250],
      scale: 180,
    },
  };

  function createSvgElement(tagName, attributes = {}) {
    const element = document.createElementNS(SVG_NAMESPACE, tagName);
    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, String(value));
    });
    return element;
  }

  function createScanProjectionModel(type, primaryValue = 0) {
    const baseModel = scanProjectionModels[type];
    return {
      ...baseModel,
      rotation: {
        ...baseModel.rotation,
        y: type === "longitude" ? -primaryValue : baseModel.rotation.y,
      },
    };
  }

  function projectOrthographicPoint(point, model) {
    const rotatedPoint = rotateSpherePoint(point, model);
    return {
      x: model.center[0] + rotatedPoint[0] * model.scale,
      y: model.center[1] - rotatedPoint[1] * model.scale,
      depth: rotatedPoint[2],
      rotatedPoint,
    };
  }

  function createSphereShellPath(type, model = scanProjectionModels[type]) {
    const points = [];
    for (let step = 0; step <= 240; step += 1) {
      const angle = (Math.PI * 2 * step) / 240;
      points.push({
        x: model.center[0] + Math.cos(angle) * model.radius * model.scale,
        y: model.center[1] - Math.sin(angle) * model.radius * model.scale,
      });
    }
    return points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ") + " Z";
  }

  function pathDataFromValues(pointFactory, start, end, steps, model) {
    const points = [];

    for (let step = 0; step <= steps; step += 1) {
      const value = start + ((end - start) * step) / steps;
      points.push(projectOrthographicPoint(pointFactory(value), model));
    }

    return points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ");
  }

  function createProjectionPaths(type, value, className, model = scanProjectionModels[type]) {
    const ranges = type === "latitude"
      ? [[0, 180, 150], [0, -180, 150]]
      : [[0, 90, 90], [0, -90, 90]];
    const pointFactory = type === "latitude"
      ? (longitude) => getLatitudePoint(value, longitude, model.radius)
      : (latitude) => getLongitudePoint(value, latitude, model.radius);

    return ranges.map(([start, end, steps]) => createSvgElement("path", {
      class: className,
      d: pathDataFromValues(pointFactory, start, end, steps, model),
      pathLength: 1,
    }));
  }

  function endpointPositions(longitude, model = scanProjectionModels.longitude) {
    return [90, -90].map((latitude) => projectOrthographicPoint(
      getLongitudePoint(longitude, latitude, model.radius),
      model,
    ));
  }

  function renderScanProjection(type, lineIndex) {
    scanContext.replaceChildren();
    scanDrawing.replaceChildren();
    const primaryValue = type === "latitude"
      ? sphereModel.latitudeValues[lineIndex]
      : sphereModel.longitudeValues[lineIndex];
    const projectionModel = createScanProjectionModel(type, primaryValue);
    scanSphereShell.setAttribute("d", createSphereShellPath(type, projectionModel));
    scanSphereShell.dataset.projection = type;
    const paths = createProjectionPaths(type, primaryValue, "scan-line", projectionModel);
    paths.forEach((path) => scanDrawing.append(path));

    const endpoints = [];
    const poleLabels = [];
    if (type === "longitude") {
      endpointPositions(primaryValue, projectionModel).forEach((point, index) => {
        if (!point) return;
        const endpoint = createSvgElement("circle", {
          class: "scan-endpoint",
          cx: point.x.toFixed(2),
          cy: point.y.toFixed(2),
          r: 6,
        });
        endpoints.push(endpoint);
        scanDrawing.append(endpoint);

        const label = createSvgElement("text", {
          class: "scan-pole-label",
          x: (point.x + 14).toFixed(2),
          y: (point.y + (index === 0 ? -10 : 23)).toFixed(2),
        });
        label.textContent = index === 0 ? "北极" : "南极";
        poleLabels.push(label);
        scanDrawing.append(label);
      });
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        paths.forEach((path) => path.classList.add("is-drawing"));
      });
    });

    return { endpoints, poleLabels, primaryValue, projectionModel };
  }

  function createContextGroup(type, value, variant, projectionModel) {
    const group = createSvgElement("g", {
      class: "scan-context-group",
      "data-geometry-type": type,
      "data-value": value,
    });
    createProjectionPaths(
      type,
      value,
      `scan-context-line scan-context-line--${variant}`,
      projectionModel,
    )
      .forEach((path) => group.append(path));
    scanContext.append(group);
    return group;
  }

  async function revealLatitudeContext(selectedIndex, projectionModel) {
    const companionGroups = sphereModel.latitudeValues
      .filter((_, index) => index !== selectedIndex)
      .map((value) => createContextGroup("latitude", value, "same", projectionModel));

    for (const group of companionGroups) {
      await wait(220);
      group.classList.add("is-visible");
    }

    await wait(320);
    [-60, 0, 60]
      .map((value) => createContextGroup("longitude", value, "reference", projectionModel))
      .forEach((group) => group.classList.add("is-visible"));
    await wait(900);
  }

  async function revealLongitudeContext(primaryValue, projectionModel) {
    const companionGroups = [20, 40, 60, 80]
      .map((offset) => createContextGroup(
        "longitude",
        primaryValue + offset,
        "same",
        projectionModel,
      ));

    for (const group of companionGroups) {
      await wait(360);
      group.classList.add("is-visible");
    }
    await wait(1000);
  }

  function waitForContinue(button) {
    button.disabled = false;
    button.classList.add("is-visible");
    return new Promise((resolve) => {
      button.addEventListener("click", () => {
        button.disabled = true;
        button.classList.remove("is-visible");
        resolve();
      }, { once: true });
    });
  }

  function renderComparisonProjection(svg, type) {
    svg.replaceChildren();
    svg.append(createSvgElement("path", {
      class: "comparison-sphere",
      d: createSphereShellPath(type),
    }));

    if (type === "latitude") {
      createProjectionPaths(type, 20, "comparison-line")
        .forEach((path) => svg.append(path));
    } else {
      [0, 60, 90].forEach((longitude, index) => {
        const className = index === 0
          ? "comparison-line"
          : "comparison-line comparison-line--soft";
        createProjectionPaths(type, longitude, className)
          .forEach((path) => svg.append(path));
      });
    }

    if (type === "longitude") {
      endpointPositions(0).forEach((point) => {
        if (!point) return;
        svg.append(createSvgElement("circle", {
          class: "comparison-endpoint",
          cx: point.x.toFixed(2),
          cy: point.y.toFixed(2),
          r: 6,
          opacity: 1,
        }));
      });
    }
  }

  function clearNetworkFocus() {
    scene.classList.remove("network-focus-latitude", "network-focus-longitude");
    document.querySelectorAll(".light-track.is-selected").forEach((track) => {
      track.classList.remove("is-selected");
    });
  }

  function focusNetworkType(type, lineIndex = null) {
    clearNetworkFocus();
    scene.classList.add(`network-focus-${type}`);

    if (lineIndex === null) return;
    document.querySelectorAll(`.light-track--${type}[data-line="${lineIndex}"]`).forEach((track) => {
      track.classList.add("is-selected");
    });
  }

  function showInvestigationFeedback(message, duration = 1500) {
    window.clearTimeout(feedbackTimer);
    investigationFeedback.textContent = message;
    investigationFeedback.classList.add("is-visible");
    feedbackTimer = window.setTimeout(() => {
      investigationFeedback.classList.remove("is-visible");
      window.setTimeout(() => {
        if (!investigationFeedback.classList.contains("is-visible")) {
          investigationFeedback.textContent = "";
        }
      }, 500);
    }, duration);
  }

  function updateSignalGuidePosition() {
    if (!signal.classList.contains("is-visible")) return;
    const guideBounds = signalGuide.getBoundingClientRect();
    const signalBounds = signal.getBoundingClientRect();
    const textBounds = signalGuideText.getBoundingClientRect();
    const edgePadding = Math.max(22, Math.min(40, guideBounds.width * 0.025));
    const horizontalGap = Math.max(30, Math.min(42, guideBounds.width * 0.022));
    const verticalLift = Math.max(20, Math.min(42, guideBounds.height * 0.035));
    const preferredLeft = signalBounds.left - guideBounds.left - horizontalGap - textBounds.width;
    const preferredTop = signalBounds.top - guideBounds.top
      + (signalBounds.height - textBounds.height) / 2
      - verticalLift;
    const left = Math.max(edgePadding, Math.min(
      preferredLeft,
      guideBounds.width - textBounds.width - edgePadding,
    ));
    const top = Math.max(edgePadding, Math.min(
      preferredTop,
      guideBounds.height - textBounds.height - edgePadding,
    ));

    signalGuideText.style.left = `${left.toFixed(1)}px`;
    signalGuideText.style.top = `${top.toFixed(1)}px`;
  }

  function getAudioContext() {
    if (audioContext) return audioContext;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
    return audioContext;
  }

  function getBackgroundMusic() {
    if (!audioConfig.bgmSrc) return null;
    if (backgroundMusic) return backgroundMusic;

    backgroundMusic = new Audio(audioConfig.bgmSrc);
    backgroundMusic.volume = audioConfig.bgmVolume;
    backgroundMusic.loop = audioConfig.bgmLoop;
    backgroundMusic.preload = "auto";
    return backgroundMusic;
  }

  function resumeBackgroundMusic() {
    const music = getBackgroundMusic();
    if (!music) return;
    music.play().catch(() => {});
  }

  function pauseBackgroundMusic() {
    if (!backgroundMusic) return;
    backgroundMusic.pause();
  }

  function playRecordTick(characterIndex) {
    if (soundToggle.getAttribute("aria-pressed") === "true" || characterIndex % 2 !== 0) return;
    const context = getAudioContext();
    if (!context || context.state !== "running") return;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(410, now);
    oscillator.frequency.exponentialRampToValueAtTime(350, now + 0.05);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.018, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  }

  async function addScanRecord(type) {
    const recordNumber = String(scanHistory.length).padStart(2, "0");
    const record = document.createElement("p");
    const label = document.createElement("small");
    const result = document.createElement("span");
    const resultText = type === "latitude"
      ? "○ 闭合圆圈，与经线垂直"
      : "⌒ 连接南北两极的半圆弧";
    record.className = "scan-record is-writing";
    label.textContent = `记录${recordNumber}`;
    result.className = "scan-record__result";
    record.append(label, result);
    scanRecords.append(record);

    await wait(220);
    for (const [characterIndex, character] of Array.from(resultText).entries()) {
      result.textContent += character;
      playRecordTick(characterIndex);
      await wait(60);
    }

    record.classList.remove("is-writing");
    record.classList.add("is-complete", "is-emphasized");
    await wait(520);
    record.classList.remove("is-emphasized");
  }

  async function runGlobeDiscovery() {
    investigationPhase = "discovery";
    scene.classList.add("globe-discovery");
    await wait(900);
    showInvestigationFeedback("等等……这些线都在同一个球面上。", 2300);
    await wait(3000);
    showInvestigationFeedback("再看看这个空间……我好像在一个巨大的地球仪里。", 3200);
    await wait(3800);
  }

  async function runScan(type, lineIndex) {
    investigationPhase = "scanning";
    scene.classList.add("investigation-busy");
    taskReminder.classList.remove("is-visible");
    taskPrompt.classList.remove("is-visible");
    taskAction.textContent = "";
    focusNetworkType(type, lineIndex);

    await wait(850);
    showInvestigationFeedback("检测到同类型的线", 1250);
    await wait(1450);

    scanContinue.disabled = true;
    scanContinue.classList.remove("is-visible");
    scanResult.textContent = "";
    scanResult.classList.remove("is-visible");
    scene.classList.add("scan-active");
    scanStage.setAttribute("aria-hidden", "false");
    await wait(700);

    const {
      endpoints,
      poleLabels,
      primaryValue,
      projectionModel,
    } = renderScanProjection(type, lineIndex);
    await wait(2300);
    endpoints.forEach((endpoint) => endpoint.classList.add("is-visible"));
    poleLabels.forEach((label) => label.classList.add("is-visible"));
    scanResult.textContent = type === "latitude"
      ? "扫描结果：闭合圆圈"
      : "扫描结果：连接南北两极的半圆弧";
    scanResult.classList.add("is-visible");

    if (type === "latitude") {
      await revealLatitudeContext(lineIndex, projectionModel);
    } else {
      await revealLongitudeContext(primaryValue, projectionModel);
    }

    investigationPhase = "scan-review";
    await waitForContinue(scanContinue);
    investigationPhase = "scanning";

    scene.classList.remove("scan-active");
    scanStage.setAttribute("aria-hidden", "true");
    await wait(850);
    scanContext.replaceChildren();
    scanDrawing.replaceChildren();
    scanResult.classList.remove("is-visible");

    scannedTypes.add(type);
    scanHistory.push(type);
    clearNetworkFocus();
    await addScanRecord(type);

    if (scannedTypes.size === 1) {
      await wait(700);
      investigationPhase = "investigating";
      scene.classList.remove("investigation-busy");
      taskReminder.textContent = "试着点击一条和刚才不同的线。";
      taskReminder.classList.add("is-visible");
      showInvestigationFeedback("还有另一种线没有调查。", 2400);
      return;
    }

    await runGlobeDiscovery();
    investigationPhase = "comparison";
    beginComparison();
  }

  async function handleTrackSelection(type, lineIndex) {
    if (investigationPhase !== "investigating") return;

    if (scannedTypes.has(type)) {
      investigationPhase = "repeat";
      scene.classList.add("investigation-busy");
      focusNetworkType(type, lineIndex);
      showInvestigationFeedback("这种线已经调查过了，试试另一种线。", 2200);
      await wait(2250);
      clearNetworkFocus();
      scene.classList.remove("investigation-busy");
      investigationPhase = "investigating";
      return;
    }

    await runScan(type, lineIndex);
  }

  function beginComparison() {
    clearNetworkFocus();
    scene.classList.remove("globe-discovery");
    renderComparisonProjection(comparisonLatitude, "latitude");
    renderComparisonProjection(comparisonLongitude, "longitude");
    comparisonFeedback.textContent = "";
    comparisonFeedback.classList.remove("is-visible");
    scene.classList.add("comparison-active");
    comparisonStage.setAttribute("aria-hidden", "false");
  }

  async function changeNamingText(observation, title, note, type) {
    namingStage.classList.add("is-changing");
    await wait(650);
    focusNetworkType(type);
    namingObservation.textContent = observation;
    namingTitle.textContent = title;
    namingNote.textContent = note;
    namingStage.classList.remove("is-changing");
  }

  async function runNamingSequence() {
    investigationPhase = "naming";
    comparisonStage.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
    scene.classList.remove("comparison-active");
    comparisonStage.setAttribute("aria-hidden", "true");
    await wait(850);

    scene.classList.add("naming-active");
    namingStage.setAttribute("aria-hidden", "false");
    focusNetworkType("latitude");
    namingObservation.textContent = "闭合圆圈";
    namingTitle.textContent = "这些闭合的圆圈，叫纬线。";
    namingNote.textContent = "纬线都是闭合的圆圈，绕地球一周，并与经线垂直相交。";
    namingContinue.textContent = "继续";
    await waitForContinue(namingContinue);

    await changeNamingText(
      "连接南北两极的半圆弧",
      "这些连接南北两极的半圆弧，叫经线。",
      "经线是连接南极和北极的半圆弧。",
      "longitude",
    );
    namingContinue.textContent = "完成调查";
    await waitForContinue(namingContinue);

    namingStage.classList.add("is-changing");
    await wait(650);
    scene.classList.remove("naming-active");
    namingStage.setAttribute("aria-hidden", "true");
    clearNetworkFocus();
    scene.classList.remove("investigation-busy");
    scene.classList.add("investigation-complete");
    investigationPhase = "complete";

    taskTitle.textContent = "原来，眼前这个网格，是由经线和纬线共同组成的。";
    taskAction.textContent = "";
    taskPrompt.classList.add("is-visible");
    await wait(3600);
    taskPrompt.classList.remove("is-visible");
    taskReminder.textContent = "已识别：经线、纬线";
    taskReminder.classList.add("is-visible");
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
    narration.textContent = "这里……好像不是普通的地面。";
    narration.classList.add("is-visible");
    await wait(2800);
    narration.classList.remove("is-visible");
    await wait(1200);
    narration.textContent = "怎么会有一个像网格一样的东西？这是什么？";
    narration.classList.add("is-visible");
    await wait(3500);
    narration.classList.remove("is-visible");
    await wait(900);
    signal.classList.add("is-visible");
    updateSignalGuidePosition();
    signalGuide.classList.add("is-visible");
    window.setTimeout(updateSignalGuidePosition, 260);
    window.setTimeout(updateSignalGuidePosition, 2200);
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

  function startTaskBeat() {
    taskHasStarted = true;
    scene.classList.add("tracks-awake", "investigation-ready");
    investigationPhase = "investigating";
    taskPrompt.classList.add("is-visible");
    window.clearTimeout(taskPromptTimer);
    taskPromptTimer = window.setTimeout(() => {
      taskPrompt.classList.remove("is-visible");
      window.setTimeout(() => {
        if (investigationPhase === "investigating" && scanHistory.length === 0) {
          taskReminder.classList.add("is-visible");
        }
      }, 800);
    }, 5200);
  }

  function distanceToSegment(point, start, end) {
    const segmentX = end.x - start.x;
    const segmentY = end.y - start.y;
    const lengthSquared = segmentX * segmentX + segmentY * segmentY;
    if (lengthSquared === 0) return Math.hypot(point.x - start.x, point.y - start.y);
    const progress = Math.max(0, Math.min(1,
      ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / lengthSquared));
    const nearestX = start.x + segmentX * progress;
    const nearestY = start.y + segmentY * progress;
    return Math.hypot(point.x - nearestX, point.y - nearestY);
  }

  function distanceToPath(path, point) {
    const totalLength = path.getTotalLength();
    const steps = Math.max(24, Math.ceil(totalLength / 18));
    let previousPoint = path.getPointAtLength(0);
    let minimumDistance = Number.POSITIVE_INFINITY;

    for (let step = 1; step <= steps; step += 1) {
      const currentPoint = path.getPointAtLength((totalLength * step) / steps);
      minimumDistance = Math.min(
        minimumDistance,
        distanceToSegment(point, previousPoint, currentPoint),
      );
      previousPoint = currentPoint;
    }

    return minimumDistance;
  }

  function handleTrackPointer(event) {
    if (!event.target.closest(".track-hit-area")) return;
    const svg = sphereNetwork.ownerSVGElement;
    const screenMatrix = svg?.getScreenCTM();
    if (!svg || !screenMatrix) return;
    const pointer = svg.createSVGPoint();
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    const worldPoint = pointer.matrixTransform(screenMatrix.inverse());
    const hitArea = [...document.querySelectorAll(".track-hit-area")]
      .map((path) => ({ path, distance: distanceToPath(path, worldPoint) }))
      .sort((left, right) => left.distance - right.distance)[0]?.path;
    if (!hitArea) return;
    const type = hitArea.dataset.trackType;
    const lineIndex = Number(hitArea.dataset.line);
    handleTrackSelection(type, lineIndex);
  }

  sphereNetwork.addEventListener("pointerup", handleTrackPointer);

  comparisonStage.addEventListener("click", (event) => {
    const answerButton = event.target.closest("[data-answer]");
    if (!answerButton || investigationPhase !== "comparison") return;

    if (answerButton.dataset.answer === "same") {
      comparisonFeedback.textContent = "再看看：一种是闭合圆圈，另一种是连接南北两极的半圆弧。";
      comparisonFeedback.classList.add("is-visible");
      return;
    }

    comparisonFeedback.classList.remove("is-visible");
    runNamingSequence();
  });

  signal.addEventListener("click", () => {
    signal.classList.remove("is-visible");
    signalGuide.classList.remove("is-visible");
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
    if (isMuted) {
      const context = getAudioContext();
      if (context?.state === "suspended") {
        context.resume().catch(() => {});
      }
      resumeBackgroundMusic();
      return;
    }
    pauseBackgroundMusic();
  });

  window.addEventListener("resize", updateSignalGuidePosition);
  document.addEventListener("fullscreenchange", updateSignalGuidePosition);

  buildSphereNetwork();
  beginOpening();
})();
