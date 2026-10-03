(() => {
  "use strict";

  const experience = document.querySelector(".experience");
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
  const combinedObserve = document.querySelector("#combinedObserve");
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
  const positionTestLayer = document.querySelector("#positionTestLayer");
  const positionTestStage = document.querySelector("#positionTestStage");
  const positionTestLead = document.querySelector("#positionTestLead");
  const positionTestPrompt = document.querySelector("#positionTestPrompt");
  const positionTestActions = document.querySelector("#positionTestActions");
  const positionTestFeedback = document.querySelector("#positionTestFeedback");
  const positionMapping = document.querySelector("#positionMapping");
  const deviceNetworkRow = document.querySelector("#deviceNetworkRow");
  const deviceNetworkValue = document.querySelector("#deviceNetworkValue");
  const deviceNorthValue = document.querySelector("#deviceNorthValue");
  const deviceEastValue = document.querySelector("#deviceEastValue");
  const deviceSystemRow = document.querySelector("#deviceSystemRow");
  const deviceSystemValue = document.querySelector("#deviceSystemValue");
  const progressToggle = document.querySelector("#progressToggle");
  const progressOverlay = document.querySelector("#progressOverlay");
  const progressPanel = document.querySelector("#progressPanel");
  const progressClose = document.querySelector("#progressClose");
  const progressCurrent = document.querySelector("#progressCurrent");
  const progressContinue = document.querySelector("#progressContinue");
  const progressTaskList = document.querySelector("#progressTaskList");
  const progressReset = document.querySelector("#progressReset");
  const progressResetConfirm = document.querySelector("#progressResetConfirm");

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
  let positionDeviceReviewActive = false;
  let positionDeviceCloseResolver = null;
  let relationshipRecordResult = null;
  const scannedTypes = new Set();
  const scanHistory = [];
  const scannedLineIndices = {};

  const positionTestConfig = {
    start: { latitude: 20, longitude: -60 },
    northEnd: { latitude: 68, longitude: -60 },
    eastEnd: { latitude: 20, longitude: 40 },
    movementDuration: 5200,
    lineFlashDuration: 680,
  };

  const positionTestState = {
    phase: "idle",
    northCorrect: false,
    eastCorrect: false,
    mapping: {
      north: null,
      east: null,
    },
  };

  const PROGRESS_KEY = "geoEscapeProgress";
  const RESUME_REQUEST_KEY = "geoEscapeResumeRequest";
  const PROGRESS_VERSION = 1;
  const taskRegistry = [
    {
      id: "task1",
      title: "任务一：认识经线和纬线",
      startCheckpoint: "task1-start",
    },
    {
      id: "position-test",
      title: "定位测试：建立位置与线的对应",
      startCheckpoint: "position-test-start",
    },
  ];
  const checkpointRegistry = {
    opening: { task: "opening", furthestTask: "opening" },
    "task1-start": { task: "task1", furthestTask: "task1" },
    "task1-one-scan-complete": { task: "task1", furthestTask: "task1" },
    "task1-two-scans-complete": { task: "task1", furthestTask: "task1" },
    "task1-combined-complete": { task: "task1", furthestTask: "task1" },
    "task1-complete": { task: "position-test", furthestTask: "position-test" },
    "position-test-start": { task: "position-test", furthestTask: "position-test" },
    "north-test-complete": { task: "position-test", furthestTask: "position-test" },
    "east-test-complete": { task: "position-test", furthestTask: "position-test" },
    "position-test-complete": { task: "position-test", furthestTask: "position-test" },
  };
  const taskOrder = ["opening", "task1", "position-test"];
  let progressData = loadProgress();
  let activeCheckpoint = "opening";

  function getEmptyTaskState() {
    return {
      task1: {
        scannedTypes: [],
        scanHistory: [],
        scannedLineIndices: {},
      },
      positionTest: {
        northCorrect: false,
        eastCorrect: false,
        mapping: { north: null, east: null },
      },
    };
  }

  function createProgress(checkpoint = "opening") {
    const checkpointMeta = checkpointRegistry[checkpoint] || checkpointRegistry.opening;
    return {
      version: PROGRESS_VERSION,
      furthestTask: checkpointMeta.furthestTask,
      currentTask: checkpointMeta.task,
      checkpoint,
      completedTasks: [],
      taskCheckpoints: {},
      completedTaskState: {},
      taskState: getEmptyTaskState(),
    };
  }

  function normalizeProgress(candidate) {
    if (!candidate || candidate.version !== PROGRESS_VERSION) return null;
    if (!checkpointRegistry[candidate.checkpoint]) return null;
    if (!taskOrder.includes(candidate.furthestTask)) return null;
    if (!taskOrder.includes(candidate.currentTask)) return null;

    const emptyState = getEmptyTaskState();
    const task1State = candidate.taskState?.task1 || {};
    const positionState = candidate.taskState?.positionTest || {};
    const validScannedTypes = Array.isArray(task1State.scannedTypes)
      ? task1State.scannedTypes.filter((type) => type === "latitude" || type === "longitude")
      : [];
    const validScanHistory = Array.isArray(task1State.scanHistory)
      ? task1State.scanHistory.filter((type) => (
        type === "latitude" || type === "longitude" || type === "relationship"
      ))
      : [];
    const validCompletedTasks = Array.isArray(candidate.completedTasks)
      ? candidate.completedTasks.filter((taskId) => taskRegistry.some((task) => task.id === taskId))
      : [];
    const normalizedFurthestTask = validCompletedTasks.includes("task1")
      && taskOrder.indexOf(candidate.furthestTask) < taskOrder.indexOf("position-test")
      ? "position-test"
      : candidate.furthestTask;
    const taskCheckpoints = {};
    taskRegistry.forEach((task) => {
      const savedCheckpoint = candidate.taskCheckpoints?.[task.id];
      if (savedCheckpoint && checkpointRegistry[savedCheckpoint]?.task === task.id) {
        taskCheckpoints[task.id] = savedCheckpoint;
      }
    });
    if (!taskCheckpoints[candidate.currentTask] && candidate.currentTask !== "opening") {
      taskCheckpoints[candidate.currentTask] = candidate.checkpoint;
    }
    if (
      normalizedFurthestTask === "position-test"
      && !taskCheckpoints["position-test"]
      && validCompletedTasks.includes("task1")
    ) {
      taskCheckpoints["position-test"] = "task1-complete";
    }
    const completedTaskState = {};
    if (candidate.completedTaskState?.task1) {
      completedTaskState.task1 = {
        scannedTypes: [...new Set(
          (candidate.completedTaskState.task1.scannedTypes || [])
            .filter((type) => type === "latitude" || type === "longitude"),
        )],
        scanHistory: (candidate.completedTaskState.task1.scanHistory || [])
          .filter((type) => type === "latitude" || type === "longitude" || type === "relationship"),
        scannedLineIndices: { ...(candidate.completedTaskState.task1.scannedLineIndices || {}) },
      };
    } else if (validCompletedTasks.includes("task1") && validScanHistory.length) {
      completedTaskState.task1 = {
        scannedTypes: [...new Set(validScannedTypes)],
        scanHistory: [...validScanHistory],
        scannedLineIndices: { ...(task1State.scannedLineIndices || {}) },
      };
    }
    if (candidate.completedTaskState?.["position-test"]) {
      completedTaskState["position-test"] = {
        northCorrect: Boolean(candidate.completedTaskState["position-test"].northCorrect),
        eastCorrect: Boolean(candidate.completedTaskState["position-test"].eastCorrect),
        mapping: { ...(candidate.completedTaskState["position-test"].mapping || {}) },
      };
    }

    return {
      version: PROGRESS_VERSION,
      furthestTask: normalizedFurthestTask,
      currentTask: candidate.currentTask,
      checkpoint: candidate.checkpoint,
      completedTasks: [...new Set(validCompletedTasks)],
      taskCheckpoints,
      completedTaskState,
      taskState: {
        task1: {
          scannedTypes: [...new Set(validScannedTypes)],
          scanHistory: validScanHistory,
          scannedLineIndices: task1State.scannedLineIndices
            && typeof task1State.scannedLineIndices === "object"
            ? { ...task1State.scannedLineIndices }
            : {},
        },
        positionTest: {
          northCorrect: Boolean(positionState.northCorrect),
          eastCorrect: Boolean(positionState.eastCorrect),
          mapping: {
            north: positionState.mapping?.north || emptyState.positionTest.mapping.north,
            east: positionState.mapping?.east || emptyState.positionTest.mapping.east,
          },
        },
      },
    };
  }

  function loadProgress() {
    try {
      const storedValue = window.localStorage.getItem(PROGRESS_KEY);
      if (!storedValue) return null;
      return normalizeProgress(JSON.parse(storedValue));
    } catch (error) {
      return null;
    }
  }

  function saveProgress(nextProgress) {
    const normalized = normalizeProgress(nextProgress);
    if (!normalized) return null;
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(normalized));
      progressData = normalized;
      return normalized;
    } catch (error) {
      return null;
    }
  }

  function getCurrentTaskState() {
    return {
      task1: {
        scannedTypes: [...scannedTypes],
        scanHistory: [...scanHistory],
        scannedLineIndices: { ...scannedLineIndices },
      },
      positionTest: {
        northCorrect: positionTestState.northCorrect,
        eastCorrect: positionTestState.eastCorrect,
        mapping: { ...positionTestState.mapping },
      },
    };
  }

  function updateCheckpoint(checkpoint, options = {}) {
    const checkpointMeta = checkpointRegistry[checkpoint];
    if (!checkpointMeta) return null;
    const previous = progressData || createProgress(checkpoint);
    const liveState = getCurrentTaskState();
    const previousState = previous.taskState || getEmptyTaskState();
    const suppliedState = options.taskState || {};
    const furthestTask = taskOrder.indexOf(previous.furthestTask)
      >= taskOrder.indexOf(checkpointMeta.furthestTask)
      ? previous.furthestTask
      : checkpointMeta.furthestTask;
    const completedTasks = [...new Set([
      ...(previous.completedTasks || []),
      ...(options.completedTasks || []),
    ])];
    const shouldCaptureTask1 = checkpoint.startsWith("task1-");
    const shouldCapturePosition = checkpoint.includes("test-") || checkpoint === "position-test-complete";

    const nextProgress = {
      version: PROGRESS_VERSION,
      furthestTask,
      currentTask: checkpointMeta.task,
      checkpoint,
      completedTasks,
      taskCheckpoints: {
        ...(previous.taskCheckpoints || {}),
        ...(checkpointMeta.task === "opening" ? {} : { [checkpointMeta.task]: checkpoint }),
      },
      completedTaskState: {
        ...(previous.completedTaskState || {}),
        ...(options.completedTaskState || {}),
      },
      taskState: {
        task1: {
          ...previousState.task1,
          ...(shouldCaptureTask1 ? liveState.task1 : {}),
          ...(suppliedState.task1 || {}),
        },
        positionTest: {
          ...previousState.positionTest,
          ...(shouldCapturePosition ? liveState.positionTest : {}),
          ...(suppliedState.positionTest || {}),
          mapping: {
            ...previousState.positionTest?.mapping,
            ...(shouldCapturePosition ? liveState.positionTest.mapping : {}),
            ...(suppliedState.positionTest?.mapping || {}),
          },
        },
      },
    };

    activeCheckpoint = checkpoint;
    const savedProgress = saveProgress(nextProgress);
    if (savedProgress && checkpoint !== "opening") {
      setProgressToggleMode("menu");
    }
    return savedProgress;
  }

  function markTaskComplete(taskId, checkpoint) {
    const liveState = getCurrentTaskState();
    const completedState = taskId === "task1"
      ? liveState.task1
      : liveState.positionTest;
    return updateCheckpoint(checkpoint, {
      completedTasks: [taskId],
      completedTaskState: { [taskId]: completedState },
    });
  }

  function resetProgress() {
    try {
      window.localStorage.removeItem(PROGRESS_KEY);
      window.sessionStorage.removeItem(RESUME_REQUEST_KEY);
    } catch (error) {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
    progressData = null;
  }

  function setResumeRequest(checkpoint) {
    try {
      window.sessionStorage.setItem(RESUME_REQUEST_KEY, JSON.stringify({
        version: PROGRESS_VERSION,
        checkpoint,
      }));
    } catch (error) {
      return false;
    }
    return true;
  }

  function consumeResumeRequest() {
    try {
      const requestValue = window.sessionStorage.getItem(RESUME_REQUEST_KEY);
      window.sessionStorage.removeItem(RESUME_REQUEST_KEY);
      if (!requestValue) return null;
      const request = JSON.parse(requestValue);
      if (request.version !== PROGRESS_VERSION || !checkpointRegistry[request.checkpoint]) return null;
      return request.checkpoint;
    } catch (error) {
      return null;
    }
  }

  function resumeProgress() {
    if (!progressData || !checkpointRegistry[progressData.checkpoint]) return;
    if (!setResumeRequest(progressData.checkpoint)) return;
    window.location.reload();
  }

  function resumeTaskProgress(taskId) {
    const checkpoint = progressData?.taskCheckpoints?.[taskId];
    if (!checkpoint || !checkpointRegistry[checkpoint]) return;
    const nextProgress = {
      ...progressData,
      currentTask: taskId,
      checkpoint,
    };
    if (!saveProgress(nextProgress)) return;
    if (!setResumeRequest(checkpoint)) return;
    window.location.reload();
  }

  function jumpToTask(taskId) {
    const task = taskRegistry.find((entry) => entry.id === taskId);
    if (!task) return;
    const taskState = taskId === "task1"
      ? {
        task1: {
          scannedTypes: [],
          scanHistory: [],
          scannedLineIndices: {},
        },
      }
      : {
        positionTest: {
          northCorrect: false,
          eastCorrect: false,
          mapping: { north: null, east: null },
        },
      };
    updateCheckpoint(task.startCheckpoint, { taskState });
    if (!setResumeRequest(task.startCheckpoint)) return;
    window.location.reload();
  }

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

  const combinedProjectionModel = {
    radius: 1,
    rotation: { x: -14, y: -18, z: 0 },
    center: [250, 250],
    scale: 180,
  };

  const combinedLongitudeValues = [-149, -89, -29, 31, 91, 151];

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

  function createCombinedScanGroup(type, value) {
    const group = createSvgElement("g", {
      class: "scan-combined-group",
      "data-geometry-type": type,
      "data-value": value,
    });
    createProjectionPaths(
      type,
      value,
      `scan-combined-line scan-combined-line--${type}`,
      combinedProjectionModel,
    ).forEach((path) => group.append(path));
    scanDrawing.append(group);
    return group;
  }

  function renderCombinedRelationshipProjection() {
    scanContext.replaceChildren();
    scanDrawing.replaceChildren();
    scanSphereShell.setAttribute("d", createSphereShellPath("latitude", combinedProjectionModel));
    scanSphereShell.dataset.projection = "combined";

    const latitudeGroups = sphereModel.latitudeValues
      .map((value) => createCombinedScanGroup("latitude", value));
    const longitudeGroups = combinedLongitudeValues
      .map((value) => createCombinedScanGroup("longitude", value));
    return { latitudeGroups, longitudeGroups };
  }

  async function revealCombinedRelationship() {
    const { latitudeGroups, longitudeGroups } = renderCombinedRelationshipProjection();
    await wait(350);
    [...latitudeGroups, ...longitudeGroups].forEach((group) => group.classList.add("is-visible"));
    await wait(900);
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

  function setPositionTestCopy({ lead = "", prompt = "", feedback = "" } = {}) {
    positionTestLead.textContent = lead;
    positionTestPrompt.textContent = prompt;
    positionTestFeedback.textContent = feedback;
  }

  function waitForPositionAction(actions) {
    positionTestActions.replaceChildren();

    return new Promise((resolve) => {
      actions.forEach(({ label, value }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.dataset.positionAction = value;
        button.addEventListener("click", () => {
          positionTestActions.querySelectorAll("button").forEach((actionButton) => {
            actionButton.disabled = true;
          });
          resolve(value);
        }, { once: true });
        positionTestActions.append(button);
      });
    });
  }

  function setPositionMarker(latitude, longitude) {
    const point = getLatitudePoint(latitude, longitude);
    const projectedPoint = projectSpherePoint(point);
    if (!projectedPoint) {
      positionTestLayer.classList.remove("is-visible");
      positionTestLayer.setAttribute("aria-hidden", "true");
      return false;
    }

    positionTestLayer.setAttribute(
      "transform",
      `translate(${projectedPoint.x.toFixed(2)} ${projectedPoint.y.toFixed(2)})`,
    );
    positionTestLayer.classList.add("is-visible");
    positionTestLayer.setAttribute("aria-hidden", "false");
    positionTestLayer.dataset.latitude = latitude.toFixed(2);
    positionTestLayer.dataset.longitude = longitude.toFixed(2);
    return true;
  }

  function clearPositionTrackEffects() {
    sphereNetwork.querySelectorAll(".is-route-reference, .is-crossed-flash").forEach((track) => {
      track.classList.remove("is-route-reference", "is-crossed-flash");
    });
  }

  function setPositionRouteReference(type, value) {
    clearPositionTrackEffects();
    const values = type === "latitude"
      ? sphereModel.latitudeValues
      : sphereModel.longitudeValues;
    const lineIndex = values.indexOf(value);
    if (lineIndex < 0) return;

    sphereNetwork.querySelectorAll(`.light-track--${type}[data-line="${lineIndex}"]`).forEach((track) => {
      track.classList.add("is-route-reference");
    });
  }

  function flashPositionCrossedLine(type, value) {
    const values = type === "latitude"
      ? sphereModel.latitudeValues
      : sphereModel.longitudeValues;
    const lineIndex = values.indexOf(value);
    if (lineIndex < 0) return;

    const tracks = sphereNetwork.querySelectorAll(`.light-track--${type}[data-line="${lineIndex}"]`);
    tracks.forEach((track) => track.classList.add("is-crossed-flash"));
    window.setTimeout(() => {
      tracks.forEach((track) => track.classList.remove("is-crossed-flash"));
    }, positionTestConfig.lineFlashDuration);
  }

  function getCrossedLineValues(type, startValue, endValue) {
    const values = type === "latitude"
      ? sphereModel.latitudeValues
      : sphereModel.longitudeValues;
    const movingForward = endValue > startValue;
    return values
      .filter((value) => movingForward
        ? value > startValue && value <= endValue
        : value < startValue && value >= endValue)
      .sort((left, right) => movingForward ? left - right : right - left);
  }

  function animatePositionMovement({ start, end, crossedType }) {
    const movingLatitude = start.latitude !== end.latitude;
    const startValue = movingLatitude ? start.latitude : start.longitude;
    const endValue = movingLatitude ? end.latitude : end.longitude;
    const crossedValues = getCrossedLineValues(crossedType, startValue, endValue);
    const movingForward = endValue > startValue;

    return new Promise((resolve) => {
      let startTime = null;
      let nextCrossedIndex = 0;
      positionTestLayer.classList.add("is-moving");

      function renderFrame(timestamp) {
        if (startTime === null) startTime = timestamp;
        const rawProgress = Math.min(1, (timestamp - startTime) / positionTestConfig.movementDuration);
        const easedProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);
        const latitude = start.latitude + (end.latitude - start.latitude) * easedProgress;
        const longitude = start.longitude + (end.longitude - start.longitude) * easedProgress;
        const currentValue = movingLatitude ? latitude : longitude;

        setPositionMarker(latitude, longitude);

        while (
          nextCrossedIndex < crossedValues.length
          && (movingForward
            ? currentValue >= crossedValues[nextCrossedIndex]
            : currentValue <= crossedValues[nextCrossedIndex])
        ) {
          flashPositionCrossedLine(crossedType, crossedValues[nextCrossedIndex]);
          nextCrossedIndex += 1;
        }

        if (rawProgress < 1) {
          window.requestAnimationFrame(renderFrame);
          return;
        }

        positionTestLayer.classList.remove("is-moving");
        resolve();
      }

      window.requestAnimationFrame(renderFrame);
    });
  }

  function updatePositionDevice(isComplete) {
    deviceNetworkRow.hidden = false;
    deviceNetworkValue.textContent = "经线、纬线";
    deviceNorthValue.textContent = isComplete ? "对应纬线" : "无法识别";
    deviceEastValue.textContent = isComplete ? "对应经线" : "无法识别";
    deviceSystemValue.textContent = isComplete ? "位置规则已建立" : "待建立位置规则";
    deviceSystemRow.classList.toggle("device-readout__fault", false);
    deviceSystemRow.classList.toggle("device-readout__ready", isComplete);
  }

  function reviewPositionDevice(isComplete) {
    updatePositionDevice(isComplete);
    device.classList.add("is-position-alert");
    positionDeviceReviewActive = true;
    setDeviceOpen(true);

    return new Promise((resolve) => {
      positionDeviceCloseResolver = resolve;
    });
  }

  async function playNorthMovement() {
    positionTestState.phase = "north-moving";
    setPositionTestCopy({ prompt: "让定位点向北移动，看看它会经过哪些线。" });
    positionTestActions.replaceChildren();
    setPositionRouteReference("longitude", positionTestConfig.start.longitude);
    setPositionMarker(positionTestConfig.start.latitude, positionTestConfig.start.longitude);
    await wait(350);
    await animatePositionMovement({
      start: positionTestConfig.start,
      end: positionTestConfig.northEnd,
      crossedType: "latitude",
    });
  }

  async function runNorthExperiment() {
    positionTestState.phase = "north-ready";
    positionMapping.hidden = true;
    setPositionMarker(positionTestConfig.start.latitude, positionTestConfig.start.longitude);
    setPositionTestCopy({ prompt: "让定位点向北移动，看看它会经过哪些线。" });
    await waitForPositionAction([{ label: "向北移动", value: "move-north" }]);
    await playNorthMovement();

    while (!positionTestState.northCorrect) {
      positionTestState.phase = "north-question";
      setPositionTestCopy({ prompt: "向北移动时，定位点不断经过的是哪一种线？" });
      const answer = await waitForPositionAction([
        { label: "经线", value: "longitude" },
        { label: "纬线", value: "latitude" },
      ]);

      if (answer === "latitude") {
        positionTestState.northCorrect = true;
        break;
      }

      positionTestState.phase = "north-retry";
      setPositionTestCopy({
        prompt: "向北移动时，定位点不断经过的是哪一种线？",
        feedback: "再看一次：定位点向北移动时，依次穿过了哪些线？",
      });
      await waitForPositionAction([{ label: "再看一次", value: "replay-north" }]);
      setPositionMarker(positionTestConfig.start.latitude, positionTestConfig.start.longitude);
      await playNorthMovement();
    }

    positionTestState.phase = "north-complete";
    setPositionTestCopy({ feedback: "南北位置变化时，会经过不同的纬线。" });
    updateCheckpoint("north-test-complete");
    await waitForPositionAction([{ label: "继续测试东西位置", value: "continue-east" }]);
  }

  async function playEastMovement() {
    positionTestState.phase = "east-moving";
    setPositionTestCopy({ prompt: "再试试向东移动，看看它会经过哪些线。" });
    positionTestActions.replaceChildren();
    setPositionRouteReference("latitude", positionTestConfig.start.latitude);
    setPositionMarker(positionTestConfig.start.latitude, positionTestConfig.start.longitude);
    await wait(350);
    await animatePositionMovement({
      start: positionTestConfig.start,
      end: positionTestConfig.eastEnd,
      crossedType: "longitude",
    });
  }

  async function runEastExperiment() {
    positionTestState.phase = "east-ready";
    setPositionMarker(positionTestConfig.start.latitude, positionTestConfig.start.longitude);
    setPositionTestCopy({ prompt: "再试试向东移动，看看它会经过哪些线。" });
    await waitForPositionAction([{ label: "向东移动", value: "move-east" }]);
    await playEastMovement();

    while (!positionTestState.eastCorrect) {
      positionTestState.phase = "east-question";
      setPositionTestCopy({ prompt: "向东移动时，定位点不断经过的是哪一种线？" });
      const answer = await waitForPositionAction([
        { label: "经线", value: "longitude" },
        { label: "纬线", value: "latitude" },
      ]);

      if (answer === "longitude") {
        positionTestState.eastCorrect = true;
        break;
      }

      positionTestState.phase = "east-retry";
      setPositionTestCopy({
        prompt: "向东移动时，定位点不断经过的是哪一种线？",
        feedback: "再看一次：定位点向东移动时，依次穿过了哪些线？",
      });
      await waitForPositionAction([{ label: "再看一次", value: "replay-east" }]);
      setPositionMarker(positionTestConfig.start.latitude, positionTestConfig.start.longitude);
      await playEastMovement();
    }

    positionTestState.phase = "east-complete";
    setPositionTestCopy({ feedback: "东西位置变化时，会经过不同的经线。" });
    updateCheckpoint("east-test-complete");
    await waitForPositionAction([{ label: "完成位置与线的对应", value: "continue-mapping" }]);
  }

  function preparePositionMapping() {
    positionTestState.mapping.north = null;
    positionTestState.mapping.east = null;
    positionMapping.hidden = false;
    positionMapping.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", "false");
    });
    positionTestLead.textContent = "";
    positionTestPrompt.textContent = "";
    positionTestFeedback.textContent = "";
    positionTestActions.replaceChildren();

    const submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.textContent = "完成对应";
    submitButton.dataset.positionAction = "submit-mapping";
    submitButton.disabled = true;
    positionTestActions.append(submitButton);
    return submitButton;
  }

  function waitForMappingSubmit(submitButton) {
    return new Promise((resolve) => {
      submitButton.addEventListener("click", resolve, { once: true });
    });
  }

  async function runPositionMapping() {
    positionTestState.phase = "mapping";
    clearPositionTrackEffects();
    setPositionMarker(positionTestConfig.start.latitude, positionTestConfig.start.longitude);
    const submitButton = preparePositionMapping();

    while (positionTestState.phase === "mapping") {
      await waitForMappingSubmit(submitButton);
      const isCorrect = positionTestState.mapping.north === "latitude"
        && positionTestState.mapping.east === "longitude";

      if (isCorrect) break;

      positionTestFeedback.textContent = "再回想一下：向北时跨过什么线？向东时又跨过什么线？";
      submitButton.disabled = false;
    }

    positionTestState.phase = "mapping-complete";
    positionMapping.hidden = true;
    setPositionTestCopy({
      lead: "南北位置 → 纬线",
      prompt: "东西位置 → 经线",
    });
    await waitForPositionAction([{ label: "查看返航定位器", value: "review-device" }]);
  }

  async function finishPositionTest() {
    positionTestState.phase = "device-complete";
    scene.classList.remove("position-test-active");
    positionTestStage.setAttribute("aria-hidden", "true");
    await reviewPositionDevice(true);

    scene.classList.add("position-test-active");
    positionTestStage.setAttribute("aria-hidden", "false");
    setPositionTestCopy({ prompt: "方向对应已经找到了。" });
    positionTestActions.replaceChildren();
    await wait(1800);
    setPositionTestCopy({
      prompt: "可是，同一组里有这么多条线，怎么知道自己具体在哪一条？",
    });
    await wait(1700);
    positionTestState.phase = "complete";
    positionTestFeedback.textContent = "下一步：想办法区分不同的纬线";
    taskReminder.textContent = "下一步：想办法区分不同的纬线";
    taskReminder.classList.add("is-visible");
    markTaskComplete("position-test", "position-test-complete");
  }

  async function beginPositionTest() {
    investigationPhase = "position-test";
    positionTestState.phase = "device-intro";
    await wait(1200);
    await reviewPositionDevice(false);

    taskReminder.classList.remove("is-visible");
    scene.classList.add("position-test-active");
    positionTestStage.setAttribute("aria-hidden", "false");
    setPositionTestCopy({
      lead: "经线和纬线已经认出来了。",
      prompt: "可是，哪一种线能帮助判断南北位置，哪一种线能帮助判断东西位置？",
    });
    updateCheckpoint("position-test-start");
    await waitForPositionAction([{ label: "开始定位测试", value: "start-position-test" }]);

    await runNorthExperiment();
    await runEastExperiment();
    await runPositionMapping();
    await finishPositionTest();
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

  async function writeScanRecord(resultText) {
    const recordNumber = String(scanHistory.length).padStart(2, "0");
    const record = document.createElement("p");
    const label = document.createElement("small");
    const result = document.createElement("span");
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
    return result;
  }

  async function addScanRecord(type) {
    const resultText = type === "latitude"
      ? "○ 闭合圆圈"
      : "⌒ 连接南北两极的半圆弧";
    await writeScanRecord(resultText);
  }

  async function addRelationshipRecord() {
    relationshipRecordResult = await writeScanRecord("＋ 两类线垂直相交");
  }

  async function finalizeRelationshipRecord() {
    if (!relationshipRecordResult) return;
    relationshipRecordResult.classList.add("is-updating");
    await wait(320);
    relationshipRecordResult.textContent = "＋ 经线与纬线垂直相交";
    relationshipRecordResult.classList.remove("is-updating");
    await wait(420);
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

  function waitForCombinedObservation() {
    combinedObserve.disabled = false;
    combinedObserve.classList.add("is-visible");
    taskPrompt.classList.add("has-action", "is-visible");
    return new Promise((resolve) => {
      combinedObserve.addEventListener("click", () => {
        combinedObserve.disabled = true;
        combinedObserve.classList.remove("is-visible");
        taskPrompt.classList.remove("has-action", "is-visible");
        resolve();
      }, { once: true });
    });
  }

  async function runCombinedRelationshipScan() {
    investigationPhase = "combined-scan";
    scene.classList.add("investigation-busy");
    taskReminder.classList.remove("is-visible");
    clearNetworkFocus();

    scanContinue.disabled = true;
    scanContinue.classList.remove("is-visible");
    scanResult.textContent = "";
    scanResult.classList.remove("is-visible");
    scene.classList.add("scan-active");
    scanStage.setAttribute("aria-hidden", "false");
    await wait(700);

    await revealCombinedRelationship();
    scanResult.textContent = "扫描发现：两类线垂直相交";
    scanResult.classList.add("is-visible");

    investigationPhase = "combined-review";
    await waitForContinue(scanContinue);

    scene.classList.remove("scan-active");
    scanStage.setAttribute("aria-hidden", "true");
    await wait(850);
    scanContext.replaceChildren();
    scanDrawing.replaceChildren();
    scanResult.classList.remove("is-visible");

    scanHistory.push("relationship");
    await addRelationshipRecord();
    updateCheckpoint("task1-combined-complete");
    await runGlobeDiscovery();
    investigationPhase = "comparison";
    beginComparison();
  }

  async function beginCombinedObservation() {
    investigationPhase = "combined-ready";
    scene.classList.remove("investigation-busy");
    clearNetworkFocus();
    taskTitle.textContent = "两种线都调查过了。";
    taskAction.textContent = "把它们放在一起，再看看。";
    await waitForCombinedObservation();
    await runCombinedRelationshipScan();
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

    if (type === "latitude") {
      await revealLatitudeContext(lineIndex, projectionModel);
    } else {
      await revealLongitudeContext(primaryValue, projectionModel);
    }

    scanResult.textContent = type === "latitude"
      ? "扫描结果：闭合圆圈"
      : "扫描结果：连接南北两极的半圆弧";
    scanResult.classList.add("is-visible");

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
    scannedLineIndices[type] = lineIndex;
    scanHistory.push(type);
    clearNetworkFocus();
    await addScanRecord(type);

    if (scannedTypes.size === 1) {
      updateCheckpoint("task1-one-scan-complete");
      await wait(700);
      investigationPhase = "investigating";
      scene.classList.remove("investigation-busy");
      taskReminder.textContent = "试着点击一条和刚才不同的线。";
      taskReminder.classList.add("is-visible");
      showInvestigationFeedback("还有另一种线没有调查。", 2400);
      return;
    }

    updateCheckpoint("task1-two-scans-complete");
    await beginCombinedObservation();
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
    await finalizeRelationshipRecord();

    namingStage.classList.add("is-changing");
    await wait(650);
    scene.classList.remove("naming-active");
    namingStage.setAttribute("aria-hidden", "true");
    clearNetworkFocus();
    scene.classList.remove("investigation-busy");
    scene.classList.add("investigation-complete");
    investigationPhase = "complete";
    markTaskComplete("task1", "task1-complete");

    taskTitle.textContent = "原来，眼前这个网格，是由经线和纬线共同组成的。";
    taskAction.textContent = "";
    taskPrompt.classList.add("is-visible");
    await wait(3600);
    taskPrompt.classList.remove("is-visible");
    taskReminder.textContent = "已识别：经线、纬线";
    taskReminder.classList.add("is-visible");
    await beginPositionTest();
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
      if (!positionDeviceReviewActive) {
        deviceTimer = window.setTimeout(() => setDeviceOpen(false), 6800);
      }
      return;
    }

    if (positionDeviceReviewActive) {
      positionDeviceReviewActive = false;
      device.classList.remove("is-position-alert");
      const resolveDeviceReview = positionDeviceCloseResolver;
      positionDeviceCloseResolver = null;
      resolveDeviceReview?.();
    }

    if (!taskHasStarted) {
      startTaskBeat();
    }
  }

  function startTaskBeat() {
    taskHasStarted = true;
    scene.classList.add("tracks-awake", "investigation-ready");
    investigationPhase = "investigating";
    updateCheckpoint("task1-start");
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

  function appendRestoredRecord(resultText, recordIndex) {
    const record = document.createElement("p");
    const label = document.createElement("small");
    const result = document.createElement("span");
    record.className = "scan-record is-complete";
    label.textContent = `记录${String(recordIndex + 1).padStart(2, "0")}`;
    result.className = "scan-record__result";
    result.textContent = resultText;
    record.append(label, result);
    scanRecords.append(record);
    return result;
  }

  function restoreScanRecords(history, useFinalRelationshipText = false) {
    scanRecords.replaceChildren();
    scanHistory.length = 0;
    scannedTypes.clear();
    Object.keys(scannedLineIndices).forEach((type) => delete scannedLineIndices[type]);
    relationshipRecordResult = null;

    history.forEach((type, index) => {
      scanHistory.push(type);
      if (type === "latitude" || type === "longitude") {
        scannedTypes.add(type);
      }
      const resultText = type === "latitude"
        ? "○ 闭合圆圈"
        : type === "longitude"
          ? "⌒ 连接南北两极的半圆弧"
          : useFinalRelationshipText
            ? "＋ 经线与纬线垂直相交"
            : "＋ 两类线垂直相交";
      const result = appendRestoredRecord(resultText, index);
      if (type === "relationship") relationshipRecordResult = result;
    });
  }

  function prepareRestoredWorld() {
    window.clearTimeout(deviceTimer);
    window.clearTimeout(feedbackTimer);
    window.clearTimeout(taskPromptTimer);
    positionDeviceReviewActive = false;
    positionDeviceCloseResolver = null;
    taskHasStarted = true;

    scene.className = "scene is-recovering tracks-awake";
    scene.setAttribute("aria-hidden", "false");
    intro.classList.add("is-gone");
    introMessage.classList.remove("is-visible");
    soundToggle.classList.add("is-visible");
    narration.classList.remove("is-visible");
    signal.classList.remove("is-visible");
    signal.disabled = true;
    signalGuide.classList.remove("is-visible");

    device.className = "device is-found";
    deviceDock.setAttribute("aria-expanded", "false");
    deviceDock.setAttribute("aria-label", "打开返航定位器");
    deviceNetworkRow.hidden = true;
    deviceNorthValue.textContent = "无法识别";
    deviceEastValue.textContent = "无法识别";
    deviceSystemValue.textContent = "损坏";
    deviceSystemRow.classList.add("device-readout__fault");
    deviceSystemRow.classList.remove("device-readout__ready");

    taskPrompt.className = "task-prompt";
    combinedObserve.classList.remove("is-visible");
    combinedObserve.disabled = true;
    taskReminder.classList.remove("is-visible");
    investigationFeedback.classList.remove("is-visible");
    investigationFeedback.textContent = "";

    scanStage.setAttribute("aria-hidden", "true");
    scanContinue.classList.remove("is-visible");
    scanResult.classList.remove("is-visible");
    scanContext.replaceChildren();
    scanDrawing.replaceChildren();
    comparisonStage.setAttribute("aria-hidden", "true");
    namingStage.setAttribute("aria-hidden", "true");
    positionTestStage.setAttribute("aria-hidden", "true");
    positionMapping.hidden = true;
    positionTestActions.replaceChildren();
    setPositionTestCopy();
    clearNetworkFocus();
    clearPositionTrackEffects();
    positionTestLayer.classList.remove("is-visible", "is-moving");
    positionTestLayer.setAttribute("aria-hidden", "true");

    positionTestState.phase = "idle";
    positionTestState.northCorrect = false;
    positionTestState.eastCorrect = false;
    positionTestState.mapping.north = null;
    positionTestState.mapping.east = null;
  }

  function prepareTaskOneRestore(task1State, options = {}) {
    prepareRestoredWorld();
    scene.classList.add("investigation-ready");
    investigationPhase = "investigating";
    taskTitle.textContent = "任务一：调查这个网格是由什么样的线组成的？";
    taskAction.textContent = "任意点击一条你想了解的线。";

    const history = Array.isArray(task1State?.scanHistory)
      ? task1State.scanHistory
      : [];
    restoreScanRecords(history, Boolean(options.finalRelationship));
    (task1State?.scannedTypes || []).forEach((type) => scannedTypes.add(type));
    Object.assign(scannedLineIndices, task1State?.scannedLineIndices || {});

    if (options.completed) {
      scene.classList.remove("investigation-ready");
      scene.classList.add("investigation-complete");
      investigationPhase = "complete";
      taskReminder.textContent = "已识别：经线、纬线";
      taskReminder.classList.add("is-visible");
    }
  }

  function getSavedTask1State() {
    return progressData?.taskState?.task1 || getEmptyTaskState().task1;
  }

  function restoreTaskOneStart() {
    prepareTaskOneRestore(getEmptyTaskState().task1);
    taskPrompt.classList.add("is-visible");
  }

  function restoreTaskOneScanComplete() {
    const task1State = getSavedTask1State();
    if (task1State.scanHistory.length !== 1) {
      restoreTaskOneStart();
      return;
    }
    prepareTaskOneRestore(task1State);
    taskReminder.textContent = "试着点击一条和刚才不同的线。";
    taskReminder.classList.add("is-visible");
  }

  function restoreTaskOneTwoScansComplete() {
    prepareTaskOneRestore(getSavedTask1State());
    void beginCombinedObservation();
  }

  function restoreTaskOneCombinedComplete() {
    prepareTaskOneRestore(getSavedTask1State());
    investigationPhase = "comparison";
    scene.classList.add("investigation-busy");
    beginComparison();
  }

  function prepareCompletedTaskOneWorld() {
    const savedState = progressData?.completedTaskState?.task1 || getSavedTask1State();
    const completedHistory = savedState.scanHistory.includes("relationship")
      ? savedState.scanHistory
      : ["latitude", "longitude", "relationship"];
    prepareTaskOneRestore({
      ...savedState,
      scannedTypes: ["latitude", "longitude"],
      scanHistory: completedHistory,
    }, {
      completed: true,
      finalRelationship: true,
    });
  }

  function preparePositionTestRestore() {
    prepareCompletedTaskOneWorld();
    investigationPhase = "position-test";
    taskReminder.classList.remove("is-visible");
    scene.classList.add("position-test-active");
    positionTestStage.setAttribute("aria-hidden", "false");
    updatePositionDevice(false);
  }

  async function continuePositionTestFromStart() {
    await waitForPositionAction([{ label: "开始定位测试", value: "start-position-test" }]);
    await runNorthExperiment();
    await runEastExperiment();
    await runPositionMapping();
    await finishPositionTest();
  }

  function restorePositionTestStart() {
    preparePositionTestRestore();
    positionTestState.phase = "intro-ready";
    setPositionTestCopy({
      lead: "经线和纬线已经认出来了。",
      prompt: "可是，哪一种线能帮助判断南北位置，哪一种线能帮助判断东西位置？",
    });
    void continuePositionTestFromStart();
  }

  async function continueAfterNorthCheckpoint() {
    await waitForPositionAction([{ label: "继续测试东西位置", value: "continue-east" }]);
    await runEastExperiment();
    await runPositionMapping();
    await finishPositionTest();
  }

  function restoreNorthTestComplete() {
    preparePositionTestRestore();
    positionTestState.phase = "north-complete";
    positionTestState.northCorrect = true;
    setPositionRouteReference("longitude", positionTestConfig.start.longitude);
    setPositionMarker(positionTestConfig.northEnd.latitude, positionTestConfig.northEnd.longitude);
    setPositionTestCopy({ feedback: "南北位置变化时，会经过不同的纬线。" });
    void continueAfterNorthCheckpoint();
  }

  async function continueAfterEastCheckpoint() {
    await waitForPositionAction([{ label: "完成位置与线的对应", value: "continue-mapping" }]);
    await runPositionMapping();
    await finishPositionTest();
  }

  function restoreEastTestComplete() {
    preparePositionTestRestore();
    positionTestState.phase = "east-complete";
    positionTestState.northCorrect = true;
    positionTestState.eastCorrect = true;
    setPositionRouteReference("latitude", positionTestConfig.start.latitude);
    setPositionMarker(positionTestConfig.eastEnd.latitude, positionTestConfig.eastEnd.longitude);
    setPositionTestCopy({ feedback: "东西位置变化时，会经过不同的经线。" });
    void continueAfterEastCheckpoint();
  }

  function restorePositionTestComplete() {
    preparePositionTestRestore();
    positionTestState.phase = "complete";
    positionTestState.northCorrect = true;
    positionTestState.eastCorrect = true;
    updatePositionDevice(true);
    setPositionMarker(positionTestConfig.start.latitude, positionTestConfig.start.longitude);
    setPositionTestCopy({
      prompt: "可是，同一组里有这么多条线，怎么知道自己具体在哪一条？",
      feedback: "下一步：想办法区分不同的纬线",
    });
    taskReminder.textContent = "下一步：想办法区分不同的纬线";
    taskReminder.classList.add("is-visible");
  }

  function restoreCheckpoint(checkpoint) {
    activeCheckpoint = checkpoint;
    switch (checkpoint) {
      case "task1-start":
        restoreTaskOneStart();
        break;
      case "task1-one-scan-complete":
        restoreTaskOneScanComplete();
        break;
      case "task1-two-scans-complete":
        restoreTaskOneTwoScansComplete();
        break;
      case "task1-combined-complete":
        restoreTaskOneCombinedComplete();
        break;
      case "task1-complete":
      case "position-test-start":
        restorePositionTestStart();
        break;
      case "north-test-complete":
        restoreNorthTestComplete();
        break;
      case "east-test-complete":
        restoreEastTestComplete();
        break;
      case "position-test-complete":
        restorePositionTestComplete();
        break;
      default:
        beginOpening();
    }
  }

  function getTaskTitle(taskId) {
    return taskRegistry.find((task) => task.id === taskId)?.title || "问题情境";
  }

  function setProgressToggleMode(mode) {
    const isMenu = mode === "menu";
    progressToggle.querySelector("span").textContent = isMenu ? "MENU" : "SKIP";
    progressToggle.querySelector("small").textContent = isMenu ? "进度菜单" : "略过";
    progressToggle.dataset.mode = isMenu ? "menu" : "skip";
    progressToggle.setAttribute(
      "aria-label",
      isMenu
        ? progressData
          ? "打开探索进度菜单，检测到上次进度"
          : "打开探索进度菜单"
        : "略过开场并打开探索进度",
    );
  }

  function createProgressButton(label, action, taskId = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "progress-primary";
    button.textContent = label;
    button.dataset.progressAction = action;
    if (taskId) button.dataset.taskId = taskId;
    return button;
  }

  function renderProgressPanel() {
    progressContinue.replaceChildren();
    progressTaskList.replaceChildren();
    progressResetConfirm.hidden = true;

    const activeTask = checkpointRegistry[activeCheckpoint]?.task || "opening";
    progressCurrent.textContent = activeTask === "opening"
      ? "当前：问题情境"
      : `当前：${getTaskTitle(activeTask)}`;

    if (!progressData) {
      const label = document.createElement("p");
      label.className = "progress-task-list__label";
      label.textContent = "可前往";
      progressTaskList.append(
        label,
        createProgressButton("跳过开场，进入任务一", "start-task1", "task1"),
      );
      return;
    }

    progressContinue.append(createProgressButton(
      `▶ 继续上次进度：${getTaskTitle(progressData.currentTask)}`,
      "resume",
    ));

    const listLabel = document.createElement("p");
    listLabel.className = "progress-task-list__label";
    listLabel.textContent = "已解锁";
    progressTaskList.append(listLabel);

    const furthestIndex = taskOrder.indexOf(progressData.furthestTask);
    taskRegistry
      .filter((task) => taskOrder.indexOf(task.id) <= furthestIndex)
      .forEach((task) => {
        const isCurrent = progressData.currentTask === task.id
          && progressData.checkpoint !== "position-test-complete";
        const isCompleted = progressData.completedTasks.includes(task.id);
        const hasSavedCheckpoint = Boolean(progressData.taskCheckpoints?.[task.id]);
        const row = document.createElement("button");
        row.type = "button";
        row.className = "progress-task-row";
        row.dataset.taskId = task.id;

        if (isCurrent || (!isCompleted && hasSavedCheckpoint)) {
          row.textContent = `● ${task.title}`;
          row.dataset.progressAction = "toggle-current";
          const options = document.createElement("div");
          options.className = "progress-task-options";
          options.hidden = true;
          const continueButton = createProgressButton(
            isCurrent ? "继续当前进度" : "继续已保存进度",
            isCurrent ? "resume" : "resume-task",
            task.id,
          );
          continueButton.className = "progress-task-option";
          const replayButton = createProgressButton("从本任务开头重玩", "replay-task", task.id);
          replayButton.className = "progress-task-option";
          options.append(continueButton, replayButton);
          progressTaskList.append(row, options);
          return;
        }

        if (isCompleted) {
          row.textContent = `✓ ${task.title}`;
          row.dataset.progressAction = "replay-task";
          progressTaskList.append(row);
        }
      });
  }

  function openProgressPanel() {
    renderProgressPanel();
    progressOverlay.classList.add("is-open");
    progressOverlay.setAttribute("aria-hidden", "false");
    progressToggle.setAttribute("aria-expanded", "true");
    window.setTimeout(() => progressClose.focus(), 120);
  }

  function closeProgressPanel() {
    progressOverlay.classList.remove("is-open");
    progressOverlay.setAttribute("aria-hidden", "true");
    progressToggle.setAttribute("aria-expanded", "false");
    progressResetConfirm.hidden = true;
    progressToggle.focus();
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

  positionMapping.addEventListener("click", (event) => {
    const option = event.target.closest("[data-map-direction]");
    if (!option || positionTestState.phase !== "mapping") return;

    const direction = option.dataset.mapDirection;
    const value = option.dataset.mapValue;
    positionTestState.mapping[direction] = value;
    positionMapping.querySelectorAll(`[data-map-direction="${direction}"]`).forEach((button) => {
      button.setAttribute("aria-pressed", String(button === option));
    });
    positionTestFeedback.textContent = "";

    const submitButton = positionTestActions.querySelector('[data-position-action="submit-mapping"]');
    if (submitButton) {
      submitButton.disabled = !(positionTestState.mapping.north && positionTestState.mapping.east);
    }
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

  progressToggle.addEventListener("click", () => {
    setProgressToggleMode("menu");
    openProgressPanel();
  });
  progressClose.addEventListener("click", closeProgressPanel);
  progressOverlay.addEventListener("click", (event) => {
    if (event.target === progressOverlay) closeProgressPanel();
  });

  function handleProgressAction(event) {
    const actionButton = event.target.closest("[data-progress-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.progressAction;

    if (action === "resume") {
      resumeProgress();
      return;
    }

    if (action === "resume-task") {
      resumeTaskProgress(actionButton.dataset.taskId);
      return;
    }

    if (action === "start-task1" || action === "replay-task") {
      jumpToTask(actionButton.dataset.taskId);
      return;
    }

    if (action === "toggle-current") {
      const options = actionButton.nextElementSibling;
      if (options?.classList.contains("progress-task-options")) {
        options.hidden = !options.hidden;
      }
    }
  }

  progressContinue.addEventListener("click", handleProgressAction);
  progressTaskList.addEventListener("click", handleProgressAction);
  progressReset.addEventListener("click", () => {
    progressResetConfirm.hidden = false;
  });
  progressResetConfirm.addEventListener("click", (event) => {
    const resetAction = event.target.closest("[data-reset-action]")?.dataset.resetAction;
    if (resetAction === "cancel") {
      progressResetConfirm.hidden = true;
      return;
    }
    if (resetAction === "confirm") {
      resetProgress();
      window.location.reload();
    }
  });
  progressToggle.addEventListener("animationend", (event) => {
    if (event.animationName === "progress-toggle-attention") {
      progressToggle.classList.remove("is-attention");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && progressOverlay.classList.contains("is-open")) {
      closeProgressPanel();
    }
  });

  window.addEventListener("resize", updateSignalGuidePosition);
  document.addEventListener("fullscreenchange", updateSignalGuidePosition);

  buildSphereNetwork();
  setProgressToggleMode(progressData ? "menu" : "skip");
  const requestedCheckpoint = consumeResumeRequest();
  if (requestedCheckpoint) {
    experience.classList.add("is-restoring");
    restoreCheckpoint(requestedCheckpoint);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => experience.classList.remove("is-restoring"));
    });
  } else {
    beginOpening();
  }
})();
