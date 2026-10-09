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
  const deviceNorthRow = document.querySelector("#deviceNorthRow");
  const deviceNorthValue = document.querySelector("#deviceNorthValue");
  const deviceEastRow = document.querySelector("#deviceEastRow");
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
  const latitudeIntroStage = document.querySelector("#latitudeIntroStage");
  const latitudeIntroLine1 = document.querySelector("#latitudeIntroLine1");
  const latitudeIntroLine2 = document.querySelector("#latitudeIntroLine2");
  const latitudeIntroTitle = document.querySelector("#latitudeIntroTitle");
  const latitudeIntroHint = document.querySelector("#latitudeIntroHint");
  const latitudeIntroStart = document.querySelector("#latitudeIntroStart");
  const latitudeStage = document.querySelector("#latitudeStage");
  const latitudeKicker = latitudeStage.querySelector(".latitude-stage__kicker");
  const latitudePrompt = document.querySelector("#latitudePrompt");
  const latitudeFeedback = document.querySelector("#latitudeFeedback");
  const latitudeActions = document.querySelector("#latitudeActions");
  const latitudeSphereShell = document.querySelector("#latitudeSphereShell");
  const latitudeTeachingLines = document.querySelector("#latitudeTeachingLines");
  const latitudeTeachingLabels = document.querySelector("#latitudeTeachingLabels");
  const latitudeTeachingMarker = document.querySelector("#latitudeTeachingMarker");
  const longitudeIntroStage = document.querySelector("#longitudeIntroStage");
  const longitudeIntroLead = document.querySelector("#longitudeIntroLead");
  const longitudeIntroQuestion = document.querySelector("#longitudeIntroQuestion");
  const longitudeIntroTitle = document.querySelector("#longitudeIntroTitle");
  const longitudeIntroStart = document.querySelector("#longitudeIntroStart");
  const longitudeStage = document.querySelector("#longitudeStage");
  const longitudePrompt = document.querySelector("#longitudePrompt");
  const longitudeFeedback = document.querySelector("#longitudeFeedback");
  const longitudeActions = document.querySelector("#longitudeActions");
  const longitudeGlobe = document.querySelector("#longitudeGlobe");
  const longitudeSphereShell = document.querySelector("#longitudeSphereShell");
  const longitudeTeachingLines = document.querySelector("#longitudeTeachingLines");
  const longitudeTeachingLabels = document.querySelector("#longitudeTeachingLabels");
  const longitudeTeachingMarker = document.querySelector("#longitudeTeachingMarker");
  const task4Stage = document.querySelector("#task4Stage");
  const task4GlobeMount = document.querySelector("#task4GlobeMount");

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  const PROCESS_ACTION_DELAY = 2000;
  let task4Flow = null;
  let task4Story = null;

  function initializeTask4Architecture() {
    if (task4Flow) return task4Flow;
    if (!window.Task4Flow) return null;
    task4Flow = window.Task4Flow.create({
      stage: task4Stage,
      globeMount: task4GlobeMount,
      taskIds: ["beijing", "rio-de-janeiro"],
      // Task-four checkpoint persistence is deliberately deferred.
      onCheckpoint: () => {},
    });
    task4Flow.initialize();
    return task4Flow;
  }

  function startTask4LocationTest(taskId = null) {
    return initializeTask4Architecture()?.start({ taskId }) || null;
  }

  function initializeTask4Story() {
    if (task4Story) return task4Story;
    if (!window.Task4Story) return null;
    task4Story = window.Task4Story.create({
      stage: task4Stage,
      // S4-00 ends by waiting for the separately implemented S4-01.
      onContinueInvestigation: () => {
        task4Stage.dataset.nextStage = "s4-01";
      },
      onStartNorthPositioning: () => {
        void startTask4NorthPositioning();
      },
      onStartEastPositioning: () => {
        void startTask4EastPositioning();
      },
      onStartLocationTest: startTask4LocationTest,
    });
    task4Story.initialize();
    return task4Story;
  }

  function startTask4Story({ saveCheckpoint = true } = {}) {
    if (saveCheckpoint) updateCheckpoint("task4-start");
    resetTask4DirectionProgress();
    delete task4Stage.dataset.nextStage;
    scene.classList.add("task4-story-active");
    return initializeTask4Story()?.start() || null;
  }

  function destroyTask4WhenImplemented() {
    resetTask4LatitudeBranch();
    resetTask4LongitudeBranch();
    resetTask4DirectionProgress();
    task4Story?.destroy();
    task4Story = null;
    task4Flow?.destroy();
    task4Flow = null;
    delete task4Stage.dataset.nextStage;
    scene.classList.remove("task4-story-active");
  }
  const DEVICE_UPDATE_HIGHLIGHT_DURATION = 2600;
  const processActionRevealTokens = new WeakMap();

  function cancelProcessActionReveal(target) {
    const nextToken = (processActionRevealTokens.get(target) || 0) + 1;
    processActionRevealTokens.set(target, nextToken);
    return nextToken;
  }

  async function revealProcessActionAfterDelay(
    target,
    render,
    { immediate = false, isCurrent = () => true } = {},
  ) {
    const token = cancelProcessActionReveal(target);
    if (!immediate) await wait(PROCESS_ACTION_DELAY);
    if (processActionRevealTokens.get(target) !== token || !isCurrent()) return false;
    render();
    return true;
  }

  function clearProcessActionContainer(container) {
    cancelProcessActionReveal(container);
    container.replaceChildren();
    container.classList.remove("is-process-actions");
  }

  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

  // 音频文件放在 assets/audio/；背景音乐从经纬网出现时开始，独立于音效开关。
  const audioConfig = {
    bgmSrc: "assets/audio/bgm.mp3",
    bgmVolume: 0.18,
    bgmLoop: true,
    buttonClickSrc: "assets/audio/button-click.mp3",
    buttonClickVolume: 0.3,
    deviceOpenSrc: "assets/audio/device-open.mp3",
    deviceOpenVolume: 0.35,
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
  let deviceUpdateTimer = 0;
  let completionDeviceReviewType = null;
  let taskHasStarted = false;
  let investigationPhase = "opening";
  let feedbackTimer = 0;
  let taskPromptTimer = 0;
  let audioContext = null;
  let backgroundMusic = null;
  let backgroundMusicRequested = false;
  const soundEffects = new Map();
  let positionDeviceReviewActive = false;
  let positionDeviceCloseResolver = null;
  let task4DeviceCloseResolver = null;
  let task4DeviceScanActive = false;
  let relationshipRecordResult = null;
  let latitudeQuestionSequence = 0;
  let longitudeQuestionSequence = 0;
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

  const latitudeTeachingValues = [-80, -60, -40, -20, 0, 20, 40, 60, 80];
  const latitudeTeachingModel = {
    radius: 1,
    rotation: { x: -12, y: -18, z: 0 },
    center: [310, 310],
    scale: 220,
  };
  const latitudeTravelLongitude = getFrontFacingLatitudeTravelLongitude(latitudeTeachingModel);
  const latitudeTaskState = {
    phase: "idle",
    equatorFound: false,
    exploredDirections: [],
    nsEstablished: false,
    calibration1Complete: false,
    calibration2Complete: false,
    calibration1Errors: 0,
    calibration2Errors: 0,
  };
  const task4LatitudeState = {
    phase: "idle",
    answer: null,
    runToken: 0,
  };
  const task4LongitudeState = {
    phase: "idle",
    answer: null,
    runToken: 0,
  };
  const task4DirectionState = {
    active: null,
    order: [],
    north: { status: "idle", reference: null, answer: null },
    east: { status: "idle", reference: null, answer: null },
  };
  const TASK4_DIRECTION_SCAN_DURATION = 4000;
  const TASK4_LATITUDE_CANDIDATE_INTERVAL = 600;
  const TASK4_LATITUDE_CANDIDATE_REVEAL_DURATION = 420;
  const TASK4_LATITUDE_CANDIDATE_OBSERVE_DURATION = 500;
  const TASK4_PRACTICE_EXIT_DURATION = 850;

  const longitudeTeachingValues = [
    -180,
    -150,
    -120,
    -90,
    -60,
    -30,
    0,
    30,
    60,
    90,
    120,
    150,
  ];
  const longitudeDegreeValues = [30, 60, 90, 120, 150, 180];
  const LONGITUDE_FRONT_DEPTH_TOLERANCE = 0.012;
  const longitudeTeachingModel = {
    radius: 1,
    rotation: { x: 0, y: 180, z: 0 },
    center: [310, 310],
    scale: 220,
  };
  const longitudeTaskState = {
    phase: "idle",
    zeroAttempts: 0,
    zeroAttemptValues: [],
    primeEstablished: false,
    exploredDirections: [],
    ewEstablished: false,
    calibration1Complete: false,
    calibration2Complete: false,
    calibration1Errors: 0,
    calibration2Errors: 0,
  };
  const longitudeDragState = {
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startRotation: 180,
    targetLongitude: null,
    moved: false,
    suppressClick: false,
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
    {
      id: "latitude",
      title: "任务二：修复南北定位",
      startCheckpoint: "latitude-start",
    },
    {
      id: "longitude",
      title: "任务三：修复东西定位",
      startCheckpoint: "longitude-start",
    },
    {
      id: "task4",
      title: "任务四：寻找回家的坐标",
      startCheckpoint: "task4-start",
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
    "position-test-complete": { task: "latitude", furthestTask: "latitude" },
    "latitude-start": { task: "latitude", furthestTask: "latitude" },
    "latitude-equator-found": { task: "latitude", furthestTask: "latitude" },
    "latitude-one-side-complete": { task: "latitude", furthestTask: "latitude" },
    "latitude-both-sides-complete": { task: "latitude", furthestTask: "latitude" },
    "latitude-ns-complete": { task: "latitude", furthestTask: "latitude" },
    "latitude-calibration-1-complete": { task: "latitude", furthestTask: "latitude" },
    "latitude-calibration-complete": { task: "latitude", furthestTask: "latitude" },
    "latitude-complete": { task: "longitude", furthestTask: "longitude" },
    "longitude-start": { task: "longitude", furthestTask: "longitude" },
    "longitude-one-zero-attempt": { task: "longitude", furthestTask: "longitude" },
    "longitude-zero-conflict-complete": { task: "longitude", furthestTask: "longitude" },
    "longitude-prime-established": { task: "longitude", furthestTask: "longitude" },
    "longitude-one-side-complete": { task: "longitude", furthestTask: "longitude" },
    "longitude-both-sides-complete": { task: "longitude", furthestTask: "longitude" },
    "longitude-ew-complete": { task: "longitude", furthestTask: "longitude" },
    "longitude-calibration-1-complete": { task: "longitude", furthestTask: "longitude" },
    "longitude-calibration-complete": { task: "longitude", furthestTask: "longitude" },
    "longitude-complete": { task: "longitude", furthestTask: "longitude" },
    "task4-start": { task: "task4", furthestTask: "task4" },
  };
  const taskOrder = ["opening", "task1", "position-test", "latitude", "longitude", "task4"];
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
      latitude: {
        equatorFound: false,
        exploredDirections: [],
        nsEstablished: false,
        calibration1Complete: false,
        calibration2Complete: false,
      },
      longitude: {
        zeroAttempts: 0,
        zeroAttemptValues: [],
        primeEstablished: false,
        exploredDirections: [],
        ewEstablished: false,
        calibration1Complete: false,
        calibration2Complete: false,
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
    const latitudeState = candidate.taskState?.latitude || {};
    const longitudeState = candidate.taskState?.longitude || {};
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
    let normalizedFurthestTask = candidate.furthestTask;
    if (
      validCompletedTasks.includes("task1")
      && taskOrder.indexOf(normalizedFurthestTask) < taskOrder.indexOf("position-test")
    ) {
      normalizedFurthestTask = "position-test";
    }
    if (
      (validCompletedTasks.includes("position-test") || candidate.checkpoint === "position-test-complete")
      && taskOrder.indexOf(normalizedFurthestTask) < taskOrder.indexOf("latitude")
    ) {
      normalizedFurthestTask = "latitude";
    }
    if (
      (validCompletedTasks.includes("latitude") || candidate.checkpoint === "latitude-complete")
      && taskOrder.indexOf(normalizedFurthestTask) < taskOrder.indexOf("longitude")
    ) {
      normalizedFurthestTask = "longitude";
    }
    if (
      candidate.checkpoint === "task4-start"
      && taskOrder.indexOf(normalizedFurthestTask) < taskOrder.indexOf("task4")
    ) {
      normalizedFurthestTask = "task4";
    }
    const normalizedCurrentTask = checkpointRegistry[candidate.checkpoint].task;
    const taskCheckpoints = {};
    taskRegistry.forEach((task) => {
      const savedCheckpoint = candidate.taskCheckpoints?.[task.id];
      if (savedCheckpoint && checkpointRegistry[savedCheckpoint]?.task === task.id) {
        taskCheckpoints[task.id] = savedCheckpoint;
      }
    });
    if (!taskCheckpoints[normalizedCurrentTask] && normalizedCurrentTask !== "opening") {
      taskCheckpoints[normalizedCurrentTask] = candidate.checkpoint;
    }
    if (
      normalizedFurthestTask === "position-test"
      && !taskCheckpoints["position-test"]
      && validCompletedTasks.includes("task1")
    ) {
      taskCheckpoints["position-test"] = "task1-complete";
    }
    if (
      normalizedFurthestTask === "latitude"
      && !taskCheckpoints.latitude
      && validCompletedTasks.includes("position-test")
    ) {
      taskCheckpoints.latitude = "position-test-complete";
    }
    if (
      normalizedFurthestTask === "longitude"
      && !taskCheckpoints.longitude
      && validCompletedTasks.includes("latitude")
    ) {
      taskCheckpoints.longitude = "latitude-complete";
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
    if (candidate.completedTaskState?.latitude) {
      completedTaskState.latitude = {
        equatorFound: Boolean(candidate.completedTaskState.latitude.equatorFound),
        exploredDirections: [...new Set(
          (candidate.completedTaskState.latitude.exploredDirections || [])
            .filter((direction) => direction === "north" || direction === "south"),
        )],
        nsEstablished: Boolean(candidate.completedTaskState.latitude.nsEstablished),
        calibration1Complete: Boolean(candidate.completedTaskState.latitude.calibration1Complete),
        calibration2Complete: Boolean(candidate.completedTaskState.latitude.calibration2Complete),
      };
    }
    if (candidate.completedTaskState?.longitude) {
      completedTaskState.longitude = {
        zeroAttempts: Math.min(2, Math.max(0, Number(candidate.completedTaskState.longitude.zeroAttempts) || 0)),
        zeroAttemptValues: (candidate.completedTaskState.longitude.zeroAttemptValues || [])
          .filter((value) => Number.isFinite(Number(value)))
          .slice(0, 2)
          .map(Number),
        primeEstablished: Boolean(candidate.completedTaskState.longitude.primeEstablished),
        exploredDirections: [...new Set(
          (candidate.completedTaskState.longitude.exploredDirections || [])
            .filter((direction) => direction === "east" || direction === "west"),
        )],
        ewEstablished: Boolean(candidate.completedTaskState.longitude.ewEstablished),
        calibration1Complete: Boolean(candidate.completedTaskState.longitude.calibration1Complete),
        calibration2Complete: Boolean(candidate.completedTaskState.longitude.calibration2Complete),
      };
    }

    return {
      version: PROGRESS_VERSION,
      furthestTask: normalizedFurthestTask,
      currentTask: normalizedCurrentTask,
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
        latitude: {
          equatorFound: Boolean(latitudeState.equatorFound),
          exploredDirections: [...new Set(
            (latitudeState.exploredDirections || [])
              .filter((direction) => direction === "north" || direction === "south"),
          )],
          nsEstablished: Boolean(latitudeState.nsEstablished),
          calibration1Complete: Boolean(latitudeState.calibration1Complete),
          calibration2Complete: Boolean(latitudeState.calibration2Complete),
        },
        longitude: {
          zeroAttempts: Math.min(2, Math.max(0, Number(longitudeState.zeroAttempts) || 0)),
          zeroAttemptValues: (longitudeState.zeroAttemptValues || [])
            .filter((value) => Number.isFinite(Number(value)))
            .slice(0, 2)
            .map(Number),
          primeEstablished: Boolean(longitudeState.primeEstablished),
          exploredDirections: [...new Set(
            (longitudeState.exploredDirections || [])
              .filter((direction) => direction === "east" || direction === "west"),
          )],
          ewEstablished: Boolean(longitudeState.ewEstablished),
          calibration1Complete: Boolean(longitudeState.calibration1Complete),
          calibration2Complete: Boolean(longitudeState.calibration2Complete),
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
      latitude: {
        equatorFound: latitudeTaskState.equatorFound,
        exploredDirections: [...latitudeTaskState.exploredDirections],
        nsEstablished: latitudeTaskState.nsEstablished,
        calibration1Complete: latitudeTaskState.calibration1Complete,
        calibration2Complete: latitudeTaskState.calibration2Complete,
      },
      longitude: {
        zeroAttempts: longitudeTaskState.zeroAttempts,
        zeroAttemptValues: [...longitudeTaskState.zeroAttemptValues],
        primeEstablished: longitudeTaskState.primeEstablished,
        exploredDirections: [...longitudeTaskState.exploredDirections],
        ewEstablished: longitudeTaskState.ewEstablished,
        calibration1Complete: longitudeTaskState.calibration1Complete,
        calibration2Complete: longitudeTaskState.calibration2Complete,
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
    const shouldCaptureLatitude = checkpoint.startsWith("latitude-");
    const shouldCaptureLongitude = checkpoint.startsWith("longitude-");

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
        latitude: {
          ...previousState.latitude,
          ...(shouldCaptureLatitude ? liveState.latitude : {}),
          ...(suppliedState.latitude || {}),
        },
        longitude: {
          ...previousState.longitude,
          ...(shouldCaptureLongitude ? liveState.longitude : {}),
          ...(suppliedState.longitude || {}),
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
    const completedState = liveState[taskId === "position-test" ? "positionTest" : taskId];
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
    if (
      taskId === "task4"
      && (!progressData || taskOrder.indexOf(progressData.furthestTask) < taskOrder.indexOf("task4"))
    ) {
      return;
    }
    let taskState;
    if (taskId === "task1") {
      taskState = {
        task1: {
          scannedTypes: [],
          scanHistory: [],
          scannedLineIndices: {},
        },
      };
    } else if (taskId === "position-test") {
      taskState = {
        positionTest: {
          northCorrect: false,
          eastCorrect: false,
          mapping: { north: null, east: null },
        },
      };
    } else if (taskId === "latitude") {
      taskState = {
        latitude: {
          equatorFound: false,
          exploredDirections: [],
          nsEstablished: false,
          calibration1Complete: false,
          calibration2Complete: false,
        },
      };
    } else if (taskId === "longitude") {
      taskState = {
        longitude: {
          zeroAttempts: 0,
          zeroAttemptValues: [],
          primeEstablished: false,
          exploredDirections: [],
          ewEstablished: false,
          calibration1Complete: false,
          calibration2Complete: false,
        },
      };
    } else if (taskId === "task4") {
      taskState = {};
    } else {
      return;
    }
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

  function getFrontFacingLongitudeRotation(longitude, model) {
    let bestRotation = model.rotation.y;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let rotationY = 0; rotationY <= 360; rotationY += 1) {
      const candidateModel = {
        ...model,
        rotation: { ...model.rotation, y: rotationY },
      };
      const point = projectOrthographicPoint(
        getLongitudePoint(longitude, 0, model.radius),
        candidateModel,
      );
      const centerDistance = Math.abs(point.x - model.center[0]);
      const frontPenalty = (point.depth + model.radius) * model.scale;
      const score = centerDistance + Math.max(0, frontPenalty);
      if (score < bestScore) {
        bestScore = score;
        bestRotation = rotationY;
      }
    }

    return bestRotation;
  }

  function getFrontFacingLatitudeTravelLongitude(model) {
    let frontLongitude = -180;
    let nearestDepth = Number.POSITIVE_INFINITY;

    for (let longitude = -180; longitude < 180; longitude += 1) {
      const { depth } = projectOrthographicPoint(
        getLatitudePoint(0, longitude, model.radius),
        model,
      );
      // The teaching globe is observed from the negative-z side, so the
      // smallest rotated z value is the point nearest the viewer.
      if (depth < nearestDepth) {
        nearestDepth = depth;
        frontLongitude = longitude;
      }
    }

    return frontLongitude;
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
    const pointFactory = type === "latitude"
      ? (longitude) => getLatitudePoint(value, longitude, model.radius)
      : (latitude) => getLongitudePoint(value, latitude, model.radius);

    if (type === "latitude") {
      return [createSvgElement("path", {
        class: className,
        d: `${pathDataFromValues(pointFactory, -180, 180, 300, model)} Z`,
        pathLength: 1,
      })];
    }

    return [[0, 90, 90], [0, -90, 90]].map(([start, end, steps]) => createSvgElement("path", {
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

    const finishScanStroke = (path) => {
      path.classList.remove("is-drawing");
      path.classList.add("is-complete");
    };
    paths.forEach((path) => {
      path.addEventListener("animationend", () => finishScanStroke(path), { once: true });
      window.setTimeout(() => finishScanStroke(path), 2300);
    });

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

  function createCombinedLongitudePath(value, sharedPoles) {
    const points = [];
    for (let step = 0; step <= 180; step += 1) {
      const latitude = -90 + step;
      if (latitude <= -88) {
        points.push(sharedPoles.south);
      } else if (latitude >= 88) {
        points.push(sharedPoles.north);
      } else {
        points.push(projectOrthographicPoint(
          getLongitudePoint(value, latitude, combinedProjectionModel.radius),
          combinedProjectionModel,
        ));
      }
    }
    points[0] = sharedPoles.south;
    points[points.length - 1] = sharedPoles.north;
    const pathData = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ");
    return createSvgElement("path", {
      class: "scan-combined-line scan-combined-line--longitude",
      d: pathData,
    });
  }

  function createCombinedPoleMarker(point) {
    return createSvgElement("circle", {
      class: "scan-combined-pole",
      cx: point.x.toFixed(2),
      cy: point.y.toFixed(2),
      r: 3.2,
    });
  }

  function createCombinedScanGroup(type, value, sharedPoles = null) {
    const group = createSvgElement("g", {
      class: "scan-combined-group",
      "data-geometry-type": type,
      "data-value": value,
    });
    if (type === "longitude") {
      group.append(createCombinedLongitudePath(value, sharedPoles));
    } else {
      createProjectionPaths(
        type,
        value,
        `scan-combined-line scan-combined-line--${type}`,
        combinedProjectionModel,
      ).forEach((path) => group.append(path));
    }
    scanDrawing.append(group);
    return group;
  }

  function renderCombinedRelationshipProjection() {
    scanContext.replaceChildren();
    scanDrawing.replaceChildren();
    scanSphereShell.setAttribute("d", createSphereShellPath("latitude", combinedProjectionModel));
    scanSphereShell.dataset.projection = "combined";

    const sharedPoles = {
      north: projectOrthographicPoint(
        getLongitudePoint(0, 90, combinedProjectionModel.radius),
        combinedProjectionModel,
      ),
      south: projectOrthographicPoint(
        getLongitudePoint(0, -90, combinedProjectionModel.radius),
        combinedProjectionModel,
      ),
    };

    const latitudeGroups = sphereModel.latitudeValues
      .map((value) => createCombinedScanGroup("latitude", value));
    const longitudeGroups = combinedLongitudeValues
      .map((value) => createCombinedScanGroup("longitude", value, sharedPoles));
    scanDrawing.append(
      createCombinedPoleMarker(sharedPoles.north),
      createCombinedPoleMarker(sharedPoles.south),
    );
    return { latitudeGroups, longitudeGroups };
  }

  async function revealCombinedRelationship() {
    const { latitudeGroups, longitudeGroups } = renderCombinedRelationshipProjection();
    await wait(350);
    [...latitudeGroups, ...longitudeGroups].forEach((group) => group.classList.add("is-visible"));
    await wait(900);
  }

  function getLatitudeTeachingLabelPoint(latitude) {
    let rightmostPoint = null;
    for (let longitude = -180; longitude <= 180; longitude += 2) {
      const point = projectOrthographicPoint(
        getLatitudePoint(latitude, longitude, latitudeTeachingModel.radius),
        latitudeTeachingModel,
      );
      if (!rightmostPoint || point.x > rightmostPoint.x) rightmostPoint = point;
    }
    return rightmostPoint;
  }

  function createLatitudeTeachingText(className, latitude, x, y) {
    return createSvgElement("text", {
      class: className,
      x: x.toFixed(2),
      y: y.toFixed(2),
      "data-latitude": latitude,
      "aria-hidden": "true",
    });
  }

  function buildLatitudeTeachingGlobe() {
    latitudeTeachingLines.replaceChildren();
    latitudeTeachingLabels.replaceChildren();
    latitudeSphereShell.setAttribute("d", createSphereShellPath("latitude", latitudeTeachingModel));

    latitudeTeachingValues.forEach((latitude) => {
      const group = createSvgElement("g", {
        class: "latitude-line-group",
        "data-latitude": latitude,
        role: "button",
        tabindex: -1,
        "aria-label": "纬线候选",
        "aria-disabled": "true",
      });
      createProjectionPaths(
        "latitude",
        latitude,
        "latitude-line",
        latitudeTeachingModel,
      ).forEach((path) => group.append(path));
      createProjectionPaths(
        "latitude",
        latitude,
        "latitude-line-hit",
        latitudeTeachingModel,
      ).forEach((path) => group.append(path));
      latitudeTeachingLines.append(group);

      const labelPoint = getLatitudeTeachingLabelPoint(latitude);
      const label = createLatitudeTeachingText(
        latitude === 0 ? "latitude-label latitude-label--equator" : "latitude-label",
        latitude,
        labelPoint.x + 14,
        labelPoint.y + 8,
      );
      if (latitude === 0) label.textContent = "赤道 0°";
      latitudeTeachingLabels.append(label);
    });

    [90, -90].forEach((latitude) => {
      const point = projectOrthographicPoint(
        getLatitudePoint(latitude, latitudeTravelLongitude, latitudeTeachingModel.radius),
        latitudeTeachingModel,
      );
      const dot = createSvgElement("circle", {
        class: "latitude-pole-dot",
        cx: point.x.toFixed(2),
        cy: point.y.toFixed(2),
        r: 5,
        "data-pole-latitude": latitude,
      });
      const degree = createLatitudeTeachingText(
        "latitude-pole-degree",
        latitude,
        point.x,
        point.y + (latitude > 0 ? -22 : 28),
      );
      const name = createLatitudeTeachingText(
        "latitude-pole-name",
        latitude,
        point.x,
        point.y + (latitude > 0 ? 31 : 56),
      );
      degree.setAttribute("text-anchor", "middle");
      name.setAttribute("text-anchor", "middle");
      name.textContent = latitude > 0 ? "北极" : "南极";
      latitudeTeachingLabels.append(dot, degree, name);
    });
  }

  function getLatitudeLineGroup(latitude) {
    return latitudeTeachingLines.querySelector(`.latitude-line-group[data-latitude="${latitude}"]`);
  }

  function getLatitudeDegreeLabel(latitude) {
    return latitudeTeachingLabels.querySelector(`.latitude-label[data-latitude="${latitude}"]`);
  }

  function getLatitudePoleElements(latitude) {
    return {
      degree: latitudeTeachingLabels.querySelector(`.latitude-pole-degree[data-latitude="${latitude}"]`),
      name: latitudeTeachingLabels.querySelector(`.latitude-pole-name[data-latitude="${latitude}"]`),
    };
  }

  function setLatitudeLineInteraction(isInteractive) {
    latitudeTeachingLines.querySelectorAll(".latitude-line-group").forEach((group) => {
      group.classList.toggle("is-interactive", isInteractive);
      group.setAttribute("tabindex", isInteractive ? "0" : "-1");
      group.setAttribute("aria-disabled", String(!isInteractive));
      group.querySelectorAll(".latitude-line-hit").forEach((hitArea) => {
        hitArea.style.pointerEvents = isInteractive ? "stroke" : "none";
      });
    });
  }

  function setLatitudeMarker(latitude) {
    const point = projectOrthographicPoint(
      getLatitudePoint(latitude, latitudeTravelLongitude, latitudeTeachingModel.radius),
      latitudeTeachingModel,
    );
    latitudeTeachingMarker.setAttribute(
      "transform",
      `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`,
    );
    latitudeTeachingMarker.classList.add("is-visible");
    latitudeTeachingMarker.setAttribute("aria-hidden", "false");
    latitudeTeachingMarker.dataset.latitude = latitude.toFixed(2);
  }

  function hideLatitudeMarker() {
    latitudeTeachingMarker.classList.remove("is-visible", "is-moving");
    latitudeTeachingMarker.setAttribute("aria-hidden", "true");
  }

  function showLatitudeDegree(latitude, notation = "plain") {
    if (latitude === 0) {
      const equatorLabel = getLatitudeDegreeLabel(0);
      equatorLabel.textContent = "赤道 0°";
      equatorLabel.classList.add("is-visible");
      equatorLabel.setAttribute("aria-hidden", "false");
      return;
    }

    const suffix = notation === "ns" ? (latitude > 0 ? "N" : "S") : "";
    const text = `${Math.abs(latitude)}°${suffix}`;
    if (Math.abs(latitude) === 90) {
      const pole = getLatitudePoleElements(latitude);
      pole.degree.textContent = text;
      pole.degree.classList.add("is-visible");
      pole.name.classList.add("is-visible");
      pole.degree.setAttribute("aria-hidden", "false");
      pole.name.setAttribute("aria-hidden", "false");
      return;
    }

    const label = getLatitudeDegreeLabel(latitude);
    label.textContent = text;
    label.classList.add("is-visible");
    label.setAttribute("aria-hidden", "false");
  }

  function showLatitudeDirection(direction, notation = "plain") {
    const sign = direction === "north" ? 1 : -1;
    [20, 40, 60, 80, 90].forEach((degree) => showLatitudeDegree(sign * degree, notation));
  }

  function hideLatitudeDegreeLabels(keepEquator = true) {
    latitudeTeachingLabels.querySelectorAll(
      ".latitude-label, .latitude-pole-degree, .latitude-pole-name",
    ).forEach((label) => {
      const latitude = Number(label.dataset.latitude);
      const shouldRemainVisible = keepEquator && latitude === 0;
      label.classList.toggle("is-visible", shouldRemainVisible);
      label.setAttribute("aria-hidden", String(!shouldRemainVisible));
    });
  }

  function hideLatitudeDegree(latitude) {
    const label = getLatitudeDegreeLabel(latitude);
    if (!label) return;
    label.classList.remove("is-visible");
    label.setAttribute("aria-hidden", "true");
  }

  function showCompleteLatitudeNotation() {
    showLatitudeDegree(0);
    showLatitudeDirection("north", "ns");
    showLatitudeDirection("south", "ns");
  }

  function resetLatitudeTeachingVisuals() {
    latitudeTeachingLines.querySelectorAll(".latitude-line-group").forEach((group) => {
      group.classList.remove(
        "is-interactive",
        "is-equator",
        "is-calibration-target",
        "is-calibration-pulse",
        "is-pair-flash",
      );
    });
    hideLatitudeDegreeLabels(false);
    hideLatitudeMarker();
  }

  function waitForContinue(button, { immediate = false, isCurrent = () => true } = {}) {
    button.disabled = true;
    button.classList.remove("is-visible");
    return new Promise((resolve) => {
      void revealProcessActionAfterDelay(button, () => {
        button.disabled = false;
        button.classList.add("is-visible");
        button.addEventListener("click", () => {
          cancelProcessActionReveal(button);
          button.disabled = true;
          button.classList.remove("is-visible");
          resolve();
        }, { once: true });
      }, { immediate, isCurrent });
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
      [0, 20, 40, 60, 80].forEach((longitude, index) => {
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

  function waitForPositionAction(actions, { immediate = false } = {}) {
    clearProcessActionContainer(positionTestActions);
    const expectedPhase = positionTestState.phase;
    const teachingValues = new Set(["move-north", "move-east", "longitude", "latitude"]);
    const isProcessGroup = actions.length > 0
      && actions.every(({ value }) => !teachingValues.has(value));
    positionTestActions.classList.toggle("is-process-actions", isProcessGroup);

    return new Promise((resolve) => {
      const render = () => {
        actions.forEach(({ label, value }) => {
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = label;
          button.dataset.positionAction = value;
          button.addEventListener("click", () => {
            cancelProcessActionReveal(positionTestActions);
            positionTestActions.querySelectorAll("button").forEach((actionButton) => {
              actionButton.disabled = true;
            });
            resolve(value);
          }, { once: true });
          positionTestActions.append(button);
        });
      };

      if (!isProcessGroup) {
        render();
        return;
      }

      void revealProcessActionAfterDelay(positionTestActions, render, {
        immediate,
        isCurrent: () => positionTestState.phase === expectedPhase,
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

  function highlightDeviceUpdates(fields = []) {
    window.clearTimeout(deviceUpdateTimer);
    const rows = {
      network: deviceNetworkRow,
      north: deviceNorthRow,
      east: deviceEastRow,
      system: deviceSystemRow,
    };
    Object.values(rows).forEach((row) => row.classList.remove("is-recently-updated"));
    fields.forEach((field) => rows[field]?.classList.add("is-recently-updated"));
    if (fields.length === 0) return;
    deviceUpdateTimer = window.setTimeout(() => {
      Object.values(rows).forEach((row) => row.classList.remove("is-recently-updated"));
    }, DEVICE_UPDATE_HIGHLIGHT_DURATION);
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
    highlightDeviceUpdates(isComplete ? ["north", "east", "system"] : ["network"]);
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
    clearProcessActionContainer(positionTestActions);
    setPositionRouteReference("longitude", positionTestConfig.start.longitude);
    setPositionMarker(positionTestConfig.start.latitude, positionTestConfig.start.longitude);
    flashPositionCrossedLine("latitude", positionTestConfig.start.latitude);
    await wait(positionTestConfig.lineFlashDuration);
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
    clearProcessActionContainer(positionTestActions);
    setPositionRouteReference("latitude", positionTestConfig.start.latitude);
    setPositionMarker(positionTestConfig.start.latitude, positionTestConfig.start.longitude);
    flashPositionCrossedLine("longitude", positionTestConfig.start.longitude);
    await wait(positionTestConfig.lineFlashDuration);
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
    clearProcessActionContainer(positionTestActions);

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
    positionTestState.phase = "knowledge-bridge";
    setPositionTestCopy({ prompt: "南北定位，要借助纬线。" });
    await waitForPositionAction([{ label: "继续", value: "continue-latitude-bridge" }]);
    setPositionTestCopy({ prompt: "可是，地球上有这么多条纬线，怎样区分它们呢？" });
    await waitForPositionAction([{ label: "答案", value: "reveal-latitude-answer" }]);
    setPositionTestCopy({ prompt: "我们可以用度数来区别不同的纬线。" });
    await waitForPositionAction([{ label: "原来如此", value: "open-latitude-task" }]);
    positionTestState.phase = "complete";
    taskReminder.classList.remove("is-visible");
    markTaskComplete("position-test", "position-test-complete");
    await showLatitudeTaskIntro(true);
  }

  async function beginPositionTest() {
    investigationPhase = "position-test";
    positionTestState.phase = "device-intro";
    applyScanRecordKnowledgeLabels();
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

  function setLatitudeCopy({ prompt = "", feedback = "" } = {}) {
    latitudeQuestionSequence += 1;
    latitudePrompt.classList.remove("is-typing-question");
    latitudePrompt.removeAttribute("aria-busy");
    latitudePrompt.textContent = prompt;
    latitudeFeedback.textContent = feedback;
  }

  function setLatitudeNotationFeedback(count) {
    const explanations = [
      ["north", "赤道以北，叫北纬，用 N 表示。"],
      ["south", "赤道以南，叫南纬，用 S 表示。"],
    ];
    latitudeFeedback.replaceChildren(...explanations.slice(0, count).map(([side, message]) => {
      const line = document.createElement("span");
      line.className = `latitude-notation__${side}`;
      line.textContent = message;
      return line;
    }));
  }

  async function typeLatitudeQuestion(question) {
    const sequence = ++latitudeQuestionSequence;
    latitudePrompt.textContent = "";
    latitudeFeedback.textContent = "";
    latitudePrompt.classList.add("is-typing-question");
    latitudePrompt.setAttribute("aria-busy", "true");
    await wait(100);

    for (const [characterIndex, character] of Array.from(question).entries()) {
      if (sequence !== latitudeQuestionSequence) return false;
      latitudePrompt.textContent += character;
      playRecordTick(characterIndex);
      await wait(46);
    }

    if (sequence !== latitudeQuestionSequence) return false;
    latitudePrompt.classList.remove("is-typing-question");
    latitudePrompt.removeAttribute("aria-busy");
    return true;
  }

  function setLatitudeStageMode(mode = "default") {
    latitudeStage.classList.remove(
      "is-exploration-layout",
      "is-calibration-layout",
      "is-calibration-one",
      "is-calibration-two",
      "is-summary-layout",
      "is-notation-layout",
    );
    if (mode === "exploration") {
      latitudeStage.classList.add("is-exploration-layout");
    }
    if (mode === "calibration-one" || mode === "calibration-two") {
      latitudeStage.classList.add(
        "is-calibration-layout",
        mode === "calibration-one" ? "is-calibration-one" : "is-calibration-two",
      );
    }
    if (mode === "summary") {
      latitudeStage.classList.add("is-summary-layout");
    }
    if (mode === "notation") latitudeStage.classList.add("is-notation-layout");
  }

  function setLatitudeActions(actions = [], { immediate = false } = {}) {
    clearProcessActionContainer(latitudeActions);
    const actionNames = actions.map(({ action }) => action);
    const isAnswerGroup = actionNames.length > 0 && actionNames.every((action) => action.startsWith("answer-"));
    const isTeachingGroup = actionNames.length > 0 && actionNames.every((action) => action.startsWith("explore-"));
    const isProcessGroup = actionNames.length > 0 && !isAnswerGroup && !isTeachingGroup;
    const expectedPhase = latitudeTaskState.phase;
    latitudeActions.classList.toggle("is-answer-actions", isAnswerGroup);
    latitudeActions.classList.toggle("is-teaching-actions", isTeachingGroup);
    latitudeActions.classList.toggle("is-process-actions", isProcessGroup);
    const render = () => {
      actions.forEach(({ label, action }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.dataset.latitudeAction = action;
        latitudeActions.append(button);
      });
    };
    if (!isProcessGroup) {
      render();
      return;
    }
    void revealProcessActionAfterDelay(latitudeActions, render, {
      immediate,
      isCurrent: () => latitudeTaskState.phase === expectedPhase,
    });
  }

  function updateLatitudeDevice() {
    deviceNetworkRow.hidden = false;
    deviceNetworkValue.textContent = "经线、纬线";
    deviceNorthValue.textContent = "纬度识别已恢复";
    deviceEastValue.textContent = "对应经线";
    deviceSystemValue.textContent = "仍未完成";
    deviceSystemRow.classList.add("device-readout__fault");
    deviceSystemRow.classList.remove("device-readout__ready");
  }

  function resetTask4DirectionProgress() {
    task4DirectionState.active = null;
    task4DirectionState.order.length = 0;
    ["north", "east"].forEach((direction) => {
      task4DirectionState[direction].status = "idle";
      task4DirectionState[direction].reference = null;
      task4DirectionState[direction].answer = null;
    });
  }

  function getTask4DirectionReadout(direction) {
    const state = task4DirectionState[direction];
    if (state.status === "scanning") {
      return direction === "north" ? "南北定位扫描中…" : "东西定位扫描中…";
    }
    if (state.status === "complete") return "已测试，具体位置未确认";
    if (state.reference) {
      return direction === "north"
        ? `珠海附近的参考纬度：${state.reference}`
        : `珠海附近的参考经度：${state.reference}`;
    }
    return direction === "north" ? "纬度识别已恢复" : "经度识别已恢复";
  }

  function updateTask4DirectionDevice({ scanningDirection = null, highlight = [] } = {}) {
    deviceNetworkRow.hidden = false;
    deviceNetworkValue.textContent = "经线、纬线";
    deviceNorthValue.textContent = getTask4DirectionReadout("north");
    deviceEastValue.textContent = getTask4DirectionReadout("east");
    deviceSystemValue.textContent = scanningDirection === "north"
      ? "正在获取参考纬度…"
      : scanningDirection === "east"
        ? "正在获取参考经度…"
        : "具体位置未确认";
    deviceSystemRow.classList.add("device-readout__fault");
    deviceSystemRow.classList.remove("device-readout__ready");
    highlightDeviceUpdates(highlight);
  }

  function updateTask4NorthReferenceDevice() {
    updateTask4DirectionDevice({ highlight: ["north", "system"] });
  }

  function showTask4NorthScanInProgress() {
    updateTask4DirectionDevice({
      scanningDirection: "north",
      highlight: ["north", "system"],
    });
  }

  function setTask4LatitudeActions(actions = [], mode = "process") {
    clearProcessActionContainer(latitudeActions);
    latitudeActions.classList.remove("is-answer-actions", "is-teaching-actions");
    latitudeActions.classList.toggle("is-answer-actions", mode === "answer");
    latitudeActions.classList.toggle("is-process-actions", mode === "process" && actions.length > 0);
    actions.forEach(({ label, action, disabled = false }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.latitudeAction = action;
      button.disabled = disabled;
      latitudeActions.append(button);
    });
  }

  function clearTask4LatitudeCandidates() {
    latitudeTeachingLabels.querySelector(".task4-latitude-candidates")?.remove();
  }

  function showTask4LatitudeCandidates() {
    clearTask4LatitudeCandidates();
    const candidateLayer = createSvgElement("g", {
      class: "task4-latitude-candidates",
      "aria-label": "20度北纬线上的多个候选位置",
    });
    [-72, -48, -24, 0, 24, 48, 72].forEach((offset, index) => {
      const point = projectOrthographicPoint(
        getLatitudePoint(
          20,
          latitudeTravelLongitude + offset,
          latitudeTeachingModel.radius,
        ),
        latitudeTeachingModel,
      );
      const candidate = createSvgElement("g", {
        class: "task4-latitude-candidate",
        transform: `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`,
        style: `--candidate-index: ${index}`,
      });
      candidate.append(
        createSvgElement("circle", { class: "task4-latitude-candidate__halo", r: 13 }),
        createSvgElement("circle", { class: "task4-latitude-candidate__core", r: 4.5 }),
      );
      candidateLayer.append(candidate);
    });
    latitudeTeachingLabels.append(candidateLayer);
    return candidateLayer.childElementCount;
  }

  function resetTask4LatitudeBranch() {
    task4LatitudeState.runToken += 1;
    task4LatitudeState.phase = "idle";
    task4LatitudeState.answer = null;
    task4DeviceScanActive = false;
    device.classList.remove("is-task4-north-scanning", "is-task4-east-scanning");
    deviceClose.disabled = false;
    const resolvePendingDeviceReview = task4DeviceCloseResolver;
    task4DeviceCloseResolver = null;
    resolvePendingDeviceReview?.();
    clearTask4LatitudeCandidates();
    getLatitudeLineGroup(20)?.classList.remove("is-calibration-target", "is-error-flash");
    if (scene.classList.contains("task4-latitude-active")) {
      scene.classList.remove("latitude-active", "task4-latitude-active");
      latitudeStage.setAttribute("aria-hidden", "true");
      setLatitudeLineInteraction(false);
      setTask4LatitudeActions();
      setLatitudeCopy();
    }
    latitudeStage.classList.remove("is-task4-latitude-layout");
    latitudeKicker.textContent = "任务二：修复南北定位";
  }

  function activateTask4LatitudePractice() {
    task4LatitudeState.phase = "WAITING_FOR_20N";
    task4Story?.hideForLatitudePractice();
    latitudeIntroStage.classList.remove("is-visible");
    latitudeIntroStage.setAttribute("aria-hidden", "true");
    latitudeStage.setAttribute("aria-hidden", "false");
    latitudeStage.classList.add("is-task4-latitude-layout");
    latitudeKicker.textContent = "任务四：寻找回家的坐标";
    scene.classList.add("latitude-active", "task4-latitude-active");
    setLatitudeStageMode();
    buildLatitudeTeachingGlobe();
    resetLatitudeTeachingVisuals();
    showCompleteLatitudeNotation();
    setLatitudeLineInteraction(true);
    setTask4LatitudeActions();
    setLatitudeCopy({ prompt: "请在球面上找到20°N纬线。" });
  }

  async function startTask4NorthPositioning() {
    if (task4DirectionState.active || task4DirectionState.north.status !== "idle") return;
    const token = ++task4LatitudeState.runToken;
    task4LatitudeState.phase = "NORTH_SCAN_ACTIVE";
    task4DirectionState.active = "north";
    task4DirectionState.north.status = "scanning";
    task4LatitudeState.answer = null;
    task4DeviceScanActive = true;
    showTask4NorthScanInProgress();
    device.classList.add("is-found", "is-position-alert");
    device.classList.add("is-task4-north-scanning");
    deviceClose.disabled = true;

    const deviceClosed = new Promise((resolve) => {
      task4DeviceCloseResolver = resolve;
    });
    setDeviceOpen(true);
    await wait(TASK4_DIRECTION_SCAN_DURATION);
    if (token !== task4LatitudeState.runToken || task4LatitudeState.phase !== "NORTH_SCAN_ACTIVE") return;
    task4DeviceScanActive = false;
    device.classList.remove("is-task4-north-scanning");
    deviceClose.disabled = false;
    task4DirectionState.north.reference = "20°N";
    task4DirectionState.north.status = "reference-ready";
    updateTask4NorthReferenceDevice();
    await deviceClosed;
    if (token !== task4LatitudeState.runToken || task4LatitudeState.phase !== "NORTH_SCAN_ACTIVE") return;
    task4LatitudeState.phase = "NORTH_SCAN_COMPLETE";
    activateTask4LatitudePractice();
  }

  function handleTask4LatitudeSelection(latitude) {
    if (task4LatitudeState.phase !== "WAITING_FOR_20N") return;
    if (latitude !== 20) {
      const errorGroup = getLatitudeLineGroup(latitude);
      errorGroup?.classList.remove("is-error-flash");
      window.requestAnimationFrame(() => errorGroup?.classList.add("is-error-flash"));
      window.setTimeout(() => errorGroup?.classList.remove("is-error-flash"), 620);
      const feedback = latitude <= 0
        ? "20°N在赤道以北，再找找北纬20度。"
        : "方向对了，再看看度数：目标是20°N。";
      setLatitudeCopy({ prompt: "请在球面上找到20°N纬线。", feedback });
      return;
    }

    task4LatitudeState.phase = "FOUND_20N";
    setLatitudeLineInteraction(false);
    getLatitudeLineGroup(20)?.classList.add("is-calibration-target");
    showLatitudeDegree(20, "ns");
    setLatitudeCopy({ prompt: "现在能确定珠海的具体位置了吗？" });
    task4LatitudeState.phase = "WAITING_JUDGMENT";
    setTask4LatitudeActions([
      { label: "能", action: "task4-answer-can" },
      { label: "不能", action: "task4-answer-cannot" },
    ], "answer");
  }

  async function showTask4LatitudeEvidence(answer) {
    const token = task4LatitudeState.runToken;
    task4LatitudeState.phase = "SHOWING_CANDIDATES";
    task4LatitudeState.answer = answer;
    setTask4LatitudeActions();
    const candidateCount = showTask4LatitudeCandidates();
    setLatitudeCopy({
      prompt: "现在能确定珠海的具体位置了吗？",
    });
    const candidateRevealDuration = TASK4_LATITUDE_CANDIDATE_REVEAL_DURATION
      + (Math.max(0, candidateCount - 1) * TASK4_LATITUDE_CANDIDATE_INTERVAL);
    await wait(candidateRevealDuration + TASK4_LATITUDE_CANDIDATE_OBSERVE_DURATION);
    if (token !== task4LatitudeState.runToken || task4LatitudeState.phase !== "SHOWING_CANDIDATES") return;
    setLatitudeCopy({
      prompt: "现在能确定珠海的具体位置了吗？",
      feedback: answer === "can"
        ? "这条线上有这么多可能位置，究竟是哪一个？"
        : "判断正确。沿着整条20°N纬线，仍然有许多可能位置。",
    });
    setTask4LatitudeActions([{ label: "我看清楚了", action: "task4-show-limitation" }]);
  }

  function showTask4LatitudeLimitation() {
    task4LatitudeState.phase = "ONE_DIRECTION_LIMIT_FOUND";
    task4DirectionState.north.status = "complete";
    task4DirectionState.north.answer = task4LatitudeState.answer;
    if (!task4DirectionState.order.includes("north")) task4DirectionState.order.push("north");
    updateTask4DirectionDevice();
    setLatitudeCopy({
      prompt: "只知道纬度，还不能确定一个地点的具体位置。",
      feedback: "20°N只缩小了南北范围，整条纬线仍然保留着多个可能位置。",
    });
    setTask4LatitudeActions([{
      label: task4DirectionState.east.status === "complete" ? "继续调查" : "继续探索",
      action: "task4-continue-east-prompt",
    }]);
  }

  async function finishTask4LatitudeBranch() {
    const token = task4LatitudeState.runToken;
    task4LatitudeState.phase = "LEAVING";
    task4DirectionState.active = null;
    setTask4LatitudeActions();
    scene.classList.remove("latitude-active", "task4-latitude-active");
    await wait(TASK4_PRACTICE_EXIT_DURATION);
    if (token !== task4LatitudeState.runToken || task4LatitudeState.phase !== "LEAVING") return;
    latitudeStage.setAttribute("aria-hidden", "true");
    latitudeStage.classList.remove("is-task4-latitude-layout");
    setLatitudeLineInteraction(false);
    setTask4LatitudeActions();
    setLatitudeCopy();
    clearTask4LatitudeCandidates();
    latitudeKicker.textContent = "任务二：修复南北定位";
    if (task4DirectionState.north.status === "complete" && task4DirectionState.east.status === "complete") {
      task4LatitudeState.phase = "COMPLETE";
      task4Story?.showDirectionSummary([...task4DirectionState.order]);
      return;
    }
    task4LatitudeState.phase = "COMPLETE";
    task4Story?.showDirectionChoice({
      completed: [...task4DirectionState.order],
      lastCompletedDirection: "north",
    });
  }

  function updateTask4EastScanInProgressDevice() {
    updateTask4DirectionDevice({
      scanningDirection: "east",
      highlight: ["east", "system"],
    });
  }

  function updateTask4EastReferenceDevice() {
    updateTask4DirectionDevice({ highlight: ["east", "system"] });
  }

  function setTask4LongitudeActions(actions = [], mode = "process") {
    clearProcessActionContainer(longitudeActions);
    longitudeActions.classList.remove("is-teaching-actions");
    longitudeActions.classList.toggle("is-answer-actions", mode === "answer");
    longitudeActions.classList.toggle("is-process-actions", mode === "process" && actions.length > 0);
    actions.forEach(({ label, action }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.longitudeAction = action;
      longitudeActions.append(button);
    });
  }

  function clearTask4LongitudeCandidates() {
    longitudeTeachingLabels.querySelector(".task4-longitude-candidates")?.remove();
  }

  function showTask4LongitudeCandidates() {
    clearTask4LongitudeCandidates();
    const candidateLayer = createSvgElement("g", {
      class: "task4-longitude-candidates",
      "aria-label": "120度东经线上的多个候选位置",
    });
    [-60, -40, -20, 0, 20, 40, 60].forEach((latitude, index) => {
      const point = projectOrthographicPoint(
        getLongitudeTeachingPoint(120, latitude),
        longitudeTeachingModel,
      );
      const candidate = createSvgElement("g", {
        class: "task4-longitude-candidate task4-latitude-candidate",
        transform: `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`,
        style: `--candidate-index: ${index}`,
      });
      candidate.append(
        createSvgElement("circle", { class: "task4-latitude-candidate__halo", r: 13 }),
        createSvgElement("circle", { class: "task4-latitude-candidate__core", r: 4.5 }),
      );
      candidateLayer.append(candidate);
    });
    longitudeTeachingLabels.append(candidateLayer);
    return candidateLayer.childElementCount;
  }

  function resetTask4LongitudeBranch() {
    task4LongitudeState.runToken += 1;
    task4LongitudeState.phase = "idle";
    task4LongitudeState.answer = null;
    task4DeviceScanActive = false;
    device.classList.remove("is-task4-east-scanning");
    deviceClose.disabled = false;
    const resolvePendingDeviceReview = task4DeviceCloseResolver;
    task4DeviceCloseResolver = null;
    resolvePendingDeviceReview?.();
    clearTask4LongitudeCandidates();
    getLongitudeLineGroup(120)?.classList.remove("is-calibration-target", "is-error-flash");
    if (scene.classList.contains("task4-longitude-active")) {
      scene.classList.remove("longitude-active", "task4-longitude-active");
      longitudeStage.setAttribute("aria-hidden", "true");
      setLongitudeLineInteraction(false);
      setTask4LongitudeActions();
      setLongitudeCopy();
    }
    longitudeStage.classList.remove("is-task4-longitude-layout");
    longitudeStage.querySelector(".longitude-stage__kicker").textContent = "任务三：修复东西定位";
  }

  function activateTask4LongitudePractice() {
    task4LongitudeState.phase = "WAITING_FOR_120E";
    task4DirectionState.active = "east";
    task4Story?.hideForLongitudePractice();
    prepareCompletedTaskOneWorld();
    scene.classList.add("task4-story-active");
    updateTask4DirectionDevice();
    longitudeIntroStage.classList.remove("is-visible");
    longitudeIntroStage.setAttribute("aria-hidden", "true");
    longitudeStage.setAttribute("aria-hidden", "false");
    longitudeStage.classList.add("is-task4-longitude-layout");
    longitudeStage.querySelector(".longitude-stage__kicker").textContent = "任务四：寻找回家的坐标";
    scene.classList.add("longitude-active", "task4-longitude-active");
    setLongitudeStageMode("task4-search");
    buildLongitudeTeachingGlobe();
    resetLongitudeTeachingVisuals();
    showCompleteLongitudeNotation("ew");
    setLongitudeLineInteraction(true);
    setTask4LongitudeActions();
    setLongitudeCopy({ prompt: "请在球面上找到120°E经线。" });
  }

  async function startTask4EastPositioning() {
    if (task4DirectionState.active || task4DirectionState.east.status !== "idle") return;
    const token = ++task4LongitudeState.runToken;
    task4LongitudeState.phase = "EAST_SCAN_ACTIVE";
    task4DirectionState.active = "east";
    task4DirectionState.east.status = "scanning";
    task4LongitudeState.answer = null;
    task4DeviceScanActive = true;
    updateTask4EastScanInProgressDevice();
    device.classList.add("is-found", "is-position-alert", "is-task4-east-scanning");
    deviceClose.disabled = true;
    const deviceClosed = new Promise((resolve) => {
      task4DeviceCloseResolver = resolve;
    });
    setDeviceOpen(true);
    await wait(TASK4_DIRECTION_SCAN_DURATION);
    if (token !== task4LongitudeState.runToken || task4LongitudeState.phase !== "EAST_SCAN_ACTIVE") return;
    task4DeviceScanActive = false;
    device.classList.remove("is-task4-east-scanning");
    deviceClose.disabled = false;
    task4DirectionState.east.reference = "120°E";
    task4DirectionState.east.status = "reference-ready";
    updateTask4EastReferenceDevice();
    await deviceClosed;
    if (token !== task4LongitudeState.runToken || task4LongitudeState.phase !== "EAST_SCAN_ACTIVE") return;
    task4LongitudeState.phase = "EAST_SCAN_COMPLETE";
    activateTask4LongitudePractice();
  }

  function handleTask4LongitudeSelection(longitude) {
    if (task4LongitudeState.phase !== "WAITING_FOR_120E") return false;
    const normalized = canonicalLongitude(longitude);
    if (normalized !== 120) {
      flashLongitudeError(normalized);
      const feedback = normalized <= 0
        ? "120°E在本初子午线以东，再找找东经120度。"
        : "方向对了，再看看度数：目标是120°E。";
      setLongitudeCopy({ prompt: "请在球面上找到120°E经线。", feedback });
      return true;
    }
    task4LongitudeState.phase = "FOUND_120E";
    setLongitudeLineInteraction(false);
    longitudeStage.classList.remove("is-draggable");
    getLongitudeLineGroup(120)?.classList.add("is-calibration-target");
    showLongitudeLabel("east", 120, "ew");
    setLongitudeCopy({ prompt: "现在能确定珠海的具体位置了吗？" });
    task4LongitudeState.phase = "WAITING_JUDGMENT";
    setTask4LongitudeActions([
      { label: "能", action: "task4-longitude-answer-can" },
      { label: "不能", action: "task4-longitude-answer-cannot" },
    ], "answer");
    return true;
  }

  async function showTask4LongitudeEvidence(answer) {
    const token = task4LongitudeState.runToken;
    task4LongitudeState.phase = "SHOWING_CANDIDATES";
    task4LongitudeState.answer = answer;
    setTask4LongitudeActions();
    const candidateCount = showTask4LongitudeCandidates();
    setLongitudeCopy({ prompt: "现在能确定珠海的具体位置了吗？" });
    const revealDuration = TASK4_LATITUDE_CANDIDATE_REVEAL_DURATION
      + (Math.max(0, candidateCount - 1) * TASK4_LATITUDE_CANDIDATE_INTERVAL);
    await wait(revealDuration + TASK4_LATITUDE_CANDIDATE_OBSERVE_DURATION);
    if (token !== task4LongitudeState.runToken || task4LongitudeState.phase !== "SHOWING_CANDIDATES") return;
    setLongitudeCopy({
      prompt: "现在能确定珠海的具体位置了吗？",
      feedback: answer === "can"
        ? "这条经线上有多个可能位置，无法判断究竟是哪一个。"
        : "目前只能确定东西方向的位置范围，仍不能确定唯一地点。",
    });
    setTask4LongitudeActions([{ label: "我看清楚了", action: "task4-longitude-show-limitation" }]);
  }

  function showTask4LongitudeLimitation() {
    task4LongitudeState.phase = "ONE_DIRECTION_LIMIT_FOUND";
    task4DirectionState.east.status = "complete";
    task4DirectionState.east.answer = task4LongitudeState.answer;
    if (!task4DirectionState.order.includes("east")) task4DirectionState.order.push("east");
    updateTask4DirectionDevice();
    setLongitudeCopy({
      prompt: "只知道经度，仍然无法确定一个地点的具体位置。",
      feedback: "120°E只缩小了东西范围，整条经线仍然保留着多个可能位置。",
    });
    setTask4LongitudeActions([{
      label: task4DirectionState.north.status === "complete" ? "继续调查" : "继续探索",
      action: "task4-finish-longitude",
    }]);
  }

  async function finishTask4LongitudeBranch() {
    const token = task4LongitudeState.runToken;
    task4LongitudeState.phase = "LEAVING";
    task4DirectionState.active = null;
    setTask4LongitudeActions();
    scene.classList.remove("longitude-active", "task4-longitude-active");
    await wait(TASK4_PRACTICE_EXIT_DURATION);
    if (token !== task4LongitudeState.runToken || task4LongitudeState.phase !== "LEAVING") return;
    longitudeStage.setAttribute("aria-hidden", "true");
    longitudeStage.classList.remove("is-task4-longitude-layout");
    setLongitudeStageMode();
    setLongitudeLineInteraction(false);
    setTask4LongitudeActions();
    setLongitudeCopy();
    clearTask4LongitudeCandidates();
    if (task4DirectionState.north.status === "complete" && task4DirectionState.east.status === "complete") {
      task4LongitudeState.phase = "COMPLETE";
      task4Story?.showDirectionSummary([...task4DirectionState.order]);
      return;
    }
    task4LongitudeState.phase = "COMPLETE";
    task4Story?.showDirectionChoice({
      completed: [...task4DirectionState.order],
      lastCompletedDirection: "east",
    });
  }

  function resetLatitudeTaskState() {
    latitudeTaskState.phase = "idle";
    latitudeTaskState.equatorFound = false;
    latitudeTaskState.exploredDirections.length = 0;
    latitudeTaskState.nsEstablished = false;
    latitudeTaskState.calibration1Complete = false;
    latitudeTaskState.calibration2Complete = false;
    latitudeTaskState.calibration1Errors = 0;
    latitudeTaskState.calibration2Errors = 0;
  }

  function loadLatitudeTaskState() {
    const savedState = progressData?.taskState?.latitude || getEmptyTaskState().latitude;
    latitudeTaskState.equatorFound = Boolean(savedState.equatorFound);
    latitudeTaskState.exploredDirections.length = 0;
    latitudeTaskState.exploredDirections.push(...savedState.exploredDirections);
    latitudeTaskState.nsEstablished = Boolean(savedState.nsEstablished);
    latitudeTaskState.calibration1Complete = Boolean(savedState.calibration1Complete);
    latitudeTaskState.calibration2Complete = Boolean(savedState.calibration2Complete);
    latitudeTaskState.calibration1Errors = 0;
    latitudeTaskState.calibration2Errors = 0;
  }

  function showLatitudeIntroContent() {
    latitudeIntroLine1.textContent = "";
    latitudeIntroLine1.hidden = true;
    latitudeIntroLine2.textContent = "";
    latitudeIntroLine2.hidden = true;
    latitudeIntroTitle.textContent = "任务二：修复南北定位";
    latitudeIntroHint.textContent = "先找一找，哪一条纬线适合作为0°。";
    latitudeIntroHint.hidden = false;
    latitudeIntroStart.textContent = "开始调查";
    delete latitudeIntroStart.dataset.transitionAction;
    latitudeIntroStart.disabled = false;
    void revealProcessActionAfterDelay(latitudeIntroStart, () => {
      latitudeIntroStart.hidden = false;
    }, { immediate: true });
  }

  async function showLatitudeTaskIntro(animate = false) {
    scene.classList.remove("position-test-active", "latitude-active", "latitude-extracting");
    positionTestStage.setAttribute("aria-hidden", "true");
    positionTestLayer.classList.remove("is-visible");
    positionTestLayer.setAttribute("aria-hidden", "true");
    taskReminder.classList.remove("is-visible");
    latitudeStage.setAttribute("aria-hidden", "true");
    latitudeIntroStage.setAttribute("aria-hidden", "false");
    latitudeIntroStage.classList.add("is-visible");
    cancelProcessActionReveal(latitudeIntroStart);
    latitudeIntroStart.hidden = true;
    latitudeIntroStart.textContent = "开始调查";
    delete latitudeIntroStart.dataset.transitionAction;

    if (!animate) {
      showLatitudeIntroContent();
      return;
    }

    latitudeIntroLine1.textContent = "";
    latitudeIntroLine1.hidden = true;
    latitudeIntroLine2.textContent = "";
    latitudeIntroLine2.hidden = true;
    latitudeIntroTitle.textContent = "";
    latitudeIntroHint.textContent = "";
    latitudeIntroHint.hidden = false;
    latitudeIntroStart.hidden = true;
    await wait(650);
    latitudeIntroTitle.textContent = "任务二：修复南北定位";
    await wait(850);
    latitudeIntroHint.textContent = "先找一找，哪一条纬线适合作为0°。";
    await revealProcessActionAfterDelay(latitudeIntroStart, () => {
      latitudeIntroStart.hidden = false;
    }, {
      isCurrent: () => latitudeIntroStage.classList.contains("is-visible")
        && !scene.classList.contains("latitude-active"),
    });
  }

  function activateLatitudeTeachingStage() {
    cancelProcessActionReveal(latitudeIntroStart);
    latitudeIntroStart.hidden = true;
    prepareCompletedTaskOneWorld();
    updatePositionDevice(true);
    latitudeIntroStage.classList.remove("is-visible");
    latitudeIntroStage.setAttribute("aria-hidden", "true");
    latitudeStage.setAttribute("aria-hidden", "false");
    scene.classList.add("latitude-active");
    setLatitudeStageMode();
    buildLatitudeTeachingGlobe();
    resetLatitudeTeachingVisuals();
    setLatitudeActions();
    setLatitudeCopy();
  }

  function prepareLatitudeEquatorQuestion() {
    latitudeTaskState.phase = "equator-question";
    setLatitudeLineInteraction(true);
    setLatitudeCopy({ prompt: "先找一找，哪一条纬线适合作为0°。" });
    setLatitudeActions();
  }

  async function startLatitudeTask() {
    resetLatitudeTaskState();
    updateCheckpoint("latitude-start");
    latitudeIntroStart.disabled = true;
    cancelProcessActionReveal(latitudeIntroStart);
    latitudeIntroStage.classList.remove("is-visible");
    latitudeIntroStage.setAttribute("aria-hidden", "true");
    scene.classList.add("latitude-extracting");
    await wait(950);
    activateLatitudeTeachingStage();
    scene.classList.remove("latitude-extracting");
    await wait(450);
    prepareLatitudeEquatorQuestion();
  }

  function showLatitudeExplorationChoices() {
    latitudeTaskState.phase = "choose-direction";
    setLatitudeStageMode("exploration");
    setLatitudeLineInteraction(false);
    getLatitudeLineGroup(0)?.classList.add("is-equator");
    showLatitudeDegree(0);
    setLatitudeMarker(0);
    setLatitudeCopy({
      prompt: latitudeTaskState.exploredDirections.length
        ? "另一侧还没有探索。"
        : "从赤道出发，选择一个方向进行探索。",
    });
    const actions = [];
    if (!latitudeTaskState.exploredDirections.includes("north")) {
      actions.push({ label: "向北探索", action: "explore-north" });
    }
    if (!latitudeTaskState.exploredDirections.includes("south")) {
      actions.push({ label: "向南探索", action: "explore-south" });
    }
    setLatitudeActions(actions);
  }

  function animateLatitudeDirection(direction) {
    const sign = direction === "north" ? 1 : -1;
    const crossedDegrees = [20, 40, 60, 80, 90];
    const duration = 5600;
    let startTime = null;
    let nextDegreeIndex = 0;
    latitudeTeachingMarker.classList.add("is-moving");

    return new Promise((resolve) => {
      function renderFrame(timestamp) {
        if (startTime === null) startTime = timestamp;
        const rawProgress = Math.min(1, (timestamp - startTime) / duration);
        const easedProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);
        const latitude = sign * 90 * easedProgress;
        setLatitudeMarker(latitude);

        while (
          nextDegreeIndex < crossedDegrees.length
          && Math.abs(latitude) >= crossedDegrees[nextDegreeIndex]
        ) {
          showLatitudeDegree(sign * crossedDegrees[nextDegreeIndex]);
          nextDegreeIndex += 1;
        }

        if (rawProgress < 1) {
          window.requestAnimationFrame(renderFrame);
          return;
        }
        latitudeTeachingMarker.classList.remove("is-moving");
        resolve();
      }
      window.requestAnimationFrame(renderFrame);
    });
  }

  function flashLatitudePairs() {
    [-80, -60, -40, -20, 20, 40, 60, 80].forEach((latitude) => {
      getLatitudeLineGroup(latitude)?.classList.add("is-pair-flash");
    });
    window.setTimeout(() => {
      latitudeTeachingLines.querySelectorAll(".is-pair-flash").forEach((group) => {
        group.classList.remove("is-pair-flash");
      });
    }, 1300);
  }

  function showBothLatitudeSidesQuestion(immediateProcessAction = false) {
    latitudeTaskState.phase = "both-sides-question";
    setLatitudeStageMode();
    getLatitudeLineGroup(0)?.classList.add("is-equator");
    showLatitudeDegree(0);
    showLatitudeDirection("north");
    showLatitudeDirection("south");
    hideLatitudeMarker();
    setLatitudeCopy({
      prompt: "两边都有相同的度数，如何分辨它们在赤道的哪一边？",
    });
    setLatitudeActions(
      [{ label: "继续", action: "establish-ns" }],
      { immediate: immediateProcessAction },
    );
  }

  async function exploreLatitudeDirection(direction) {
    if (latitudeTaskState.exploredDirections.includes(direction)) return;
    latitudeTaskState.phase = `exploring-${direction}`;
    setLatitudeActions();
    setLatitudeCopy({
      prompt: direction === "north"
        ? "定位点从赤道向北移动。"
        : "定位点从赤道向南移动。",
    });
    setLatitudeMarker(0);
    await animateLatitudeDirection(direction);
    await wait(650);
    hideLatitudeMarker();
    await wait(430);
    setLatitudeMarker(0);
    latitudeTaskState.exploredDirections.push(direction);

    if (latitudeTaskState.exploredDirections.length === 1) {
      updateCheckpoint("latitude-one-side-complete");
      showLatitudeExplorationChoices();
      return;
    }

    updateCheckpoint("latitude-both-sides-complete");
    flashLatitudePairs();
    showBothLatitudeSidesQuestion();
  }

  async function establishLatitudeNotation() {
    latitudeTaskState.phase = "establishing-ns";
    setLatitudeStageMode("notation");
    setLatitudeActions();
    const directionQuestion = "两边都有相同的度数，如何分辨它们在赤道的哪一边？";
    setLatitudeCopy({
      prompt: directionQuestion,
    });
    setLatitudeNotationFeedback(1);
    for (const degree of [20, 40, 60, 80, 90]) {
      showLatitudeDegree(degree, "ns");
      await wait(230);
    }
    await wait(850);
    setLatitudeCopy({
      prompt: directionQuestion,
    });
    setLatitudeNotationFeedback(2);
    for (const degree of [20, 40, 60, 80, 90]) {
      showLatitudeDegree(-degree, "ns");
      await wait(230);
    }
    await wait(750);
    latitudeTaskState.nsEstablished = true;
    latitudeTaskState.phase = "ns-established";
    updateCheckpoint("latitude-ns-complete");
    setLatitudeActions([{ label: "结论", action: "show-latitude-conclusion" }]);
  }

  function showLatitudeConclusion(immediateProcessAction = false) {
    latitudeTaskState.phase = "ns-conclusion";
    setLatitudeStageMode();
    setLatitudeCopy({
      prompt: "纬度从赤道的0°开始，向南、向北逐渐增大，到两极达到90°。",
    });
    setLatitudeActions(
      [{ label: "进入定位校准", action: "start-calibration-1" }],
      { immediate: immediateProcessAction },
    );
  }

  function startLatitudeCalibrationOne() {
    latitudeTaskState.phase = "calibration-1";
    latitudeTaskState.calibration1Errors = 0;
    setLatitudeStageMode("calibration-one");
    showCompleteLatitudeNotation();
    latitudeTeachingLines.querySelectorAll(".latitude-line-group").forEach((group) => {
      group.classList.remove("is-calibration-target", "is-calibration-pulse");
    });
    setLatitudeLineInteraction(false);
    setLatitudeCopy();
    setLatitudeActions();
    void typeLatitudeQuestion("校准1：请找到 40°S。").then((didFinish) => {
      if (didFinish && latitudeTaskState.phase === "calibration-1") {
        setLatitudeLineInteraction(true);
      }
    });
  }

  async function startLatitudeCalibrationTwo() {
    latitudeTaskState.phase = "calibration-2";
    latitudeTaskState.calibration2Errors = 0;
    setLatitudeStageMode("calibration-two");
    showCompleteLatitudeNotation();
    hideLatitudeDegree(60);
    setLatitudeLineInteraction(false);
    latitudeTeachingLines.querySelectorAll(".latitude-line-group").forEach((group) => {
      group.classList.remove("is-calibration-target", "is-calibration-pulse");
    });
    getLatitudeLineGroup(0)?.classList.remove("is-equator");
    getLatitudeLineGroup(60)?.classList.add("is-calibration-target", "is-calibration-pulse");
    setLatitudeCopy();
    setLatitudeActions();
    const didFinish = await typeLatitudeQuestion("图中高亮的这条纬线的纬度是多少？");
    if (didFinish && latitudeTaskState.phase === "calibration-2") {
      setLatitudeActions([
        { label: "60°N", action: "answer-60-n" },
        { label: "60°S", action: "answer-60-s" },
      ]);
    }
  }

  function showLatitudeTaskEnding() {
    latitudeIntroStage.setAttribute("aria-hidden", "false");
    latitudeIntroStage.classList.add("is-visible");
    latitudeIntroLine1.hidden = false;
    latitudeIntroLine1.textContent = "南北位置已经解决了。接下来，要想办法区分不同的经线。";
    latitudeIntroLine2.hidden = true;
    latitudeIntroLine2.textContent = "";
    latitudeIntroTitle.textContent = "";
    latitudeIntroHint.textContent = "";
    latitudeIntroHint.hidden = true;
    latitudeIntroStart.textContent = "继续";
    latitudeIntroStart.dataset.transitionAction = "longitude-intro";
    latitudeIntroStart.disabled = false;
    latitudeIntroStart.hidden = true;
    void revealProcessActionAfterDelay(latitudeIntroStart, () => {
      latitudeIntroStart.hidden = false;
    }, {
      isCurrent: () => latitudeIntroStage.classList.contains("is-visible")
        && latitudeIntroStart.dataset.transitionAction === "longitude-intro",
    });
  }

  function showLatitudeCalibrationSummary(saveCheckpoint = true) {
    latitudeTaskState.phase = "calibration-summary";
    setLatitudeStageMode("summary");
    latitudeTaskState.calibration2Complete = true;
    setLatitudeLineInteraction(false);
    latitudeTeachingLines.querySelectorAll(".latitude-line-group").forEach((group) => {
      group.classList.remove("is-calibration-target", "is-calibration-pulse");
    });
    getLatitudeLineGroup(0)?.classList.add("is-equator");
    showLatitudeDegree(0);
    showLatitudeDirection("north", "ns");
    showLatitudeDirection("south", "ns");
    setLatitudeActions(
      [{ label: "完成校准", action: "complete-calibration" }],
      { immediate: !saveCheckpoint },
    );
    setLatitudeCopy({
      prompt: "纬度从赤道的0°开始，向南、向北逐渐增大，到两极达到90°。",
    });
    if (saveCheckpoint) updateCheckpoint("latitude-calibration-complete");
  }

  async function completeLatitudeTask() {
    latitudeTaskState.phase = "complete";
    setLatitudeActions();
    markTaskComplete("latitude", "latitude-complete");
    scene.classList.remove("latitude-active");
    latitudeStage.setAttribute("aria-hidden", "true");
    await wait(700);
    updateLatitudeDevice();
    highlightDeviceUpdates(["north"]);
    completionDeviceReviewType = "latitude";
    device.classList.add("is-found", "is-position-alert");
    setDeviceOpen(true);
  }

  function restoreLatitudeStart() {
    resetLatitudeTaskState();
    activateLatitudeTeachingStage();
    prepareLatitudeEquatorQuestion();
  }

  function restoreLatitudeEquatorFound() {
    loadLatitudeTaskState();
    activateLatitudeTeachingStage();
    latitudeTaskState.equatorFound = true;
    getLatitudeLineGroup(0)?.classList.add("is-equator");
    showLatitudeDegree(0);
    showLatitudeExplorationChoices();
  }

  function restoreLatitudeOneSideComplete() {
    loadLatitudeTaskState();
    activateLatitudeTeachingStage();
    getLatitudeLineGroup(0)?.classList.add("is-equator");
    showLatitudeDegree(0);
    latitudeTaskState.exploredDirections.forEach((direction) => {
      showLatitudeDirection(direction);
    });
    showLatitudeExplorationChoices();
  }

  function restoreLatitudeBothSidesComplete() {
    loadLatitudeTaskState();
    activateLatitudeTeachingStage();
    showBothLatitudeSidesQuestion(true);
  }

  function restoreLatitudeNotationComplete() {
    loadLatitudeTaskState();
    activateLatitudeTeachingStage();
    setLatitudeStageMode("notation");
    getLatitudeLineGroup(0)?.classList.add("is-equator");
    showLatitudeDegree(0);
    showLatitudeDirection("north", "ns");
    showLatitudeDirection("south", "ns");
    latitudeTaskState.phase = "ns-established";
    setLatitudeCopy({
      prompt: "两边都有相同的度数，如何分辨它们在赤道的哪一边？",
    });
    setLatitudeNotationFeedback(2);
    setLatitudeActions(
      [{ label: "结论", action: "show-latitude-conclusion" }],
      { immediate: true },
    );
  }

  function restoreLatitudeCalibrationOneComplete() {
    loadLatitudeTaskState();
    activateLatitudeTeachingStage();
    getLatitudeLineGroup(0)?.classList.add("is-equator");
    showLatitudeDegree(0);
    startLatitudeCalibrationTwo();
  }

  function restoreLatitudeCalibrationComplete() {
    loadLatitudeTaskState();
    activateLatitudeTeachingStage();
    showLatitudeCalibrationSummary(false);
  }

  function restoreLatitudeComplete() {
    prepareCompletedTaskOneWorld();
    latitudeTaskState.phase = "complete";
    updateLatitudeDevice();
    highlightDeviceUpdates(["north"]);
    completionDeviceReviewType = "latitude";
    device.classList.add("is-found", "is-position-alert");
    setDeviceOpen(true);
  }

  function canonicalLongitude(value) {
    const normalized = ((Number(value) + 180) % 360 + 360) % 360 - 180;
    return normalized === 180 ? -180 : normalized;
  }

  function getLongitudePrimeViewRotation() {
    return getFrontFacingLongitudeRotation(0, longitudeTeachingModel);
  }

  function setLongitudeCopy({ prompt = "", feedback = "" } = {}) {
    longitudeQuestionSequence += 1;
    longitudePrompt.classList.remove("is-typing-question");
    longitudePrompt.removeAttribute("aria-busy");
    longitudePrompt.textContent = prompt;
    longitudeFeedback.textContent = feedback;
  }

  function setLongitudeNotationFeedback(count) {
    const explanations = [
      ["east", "本初子午线以东，叫东经，用 E 表示。"],
      ["west", "本初子午线以西，叫西经，用 W 表示。"],
      ["shared", "注意：0°和180°没有东西经之分。"],
    ];
    longitudeFeedback.replaceChildren(...explanations.slice(0, count).map(([side, message]) => {
      const line = document.createElement("span");
      line.className = `longitude-notation__${side}`;
      line.textContent = message;
      return line;
    }));
  }

  async function typeLongitudeQuestion(question) {
    const sequence = ++longitudeQuestionSequence;
    longitudePrompt.textContent = "";
    longitudeFeedback.textContent = "";
    longitudePrompt.classList.add("is-typing-question");
    longitudePrompt.setAttribute("aria-busy", "true");
    await wait(100);

    for (const [characterIndex, character] of Array.from(question).entries()) {
      if (sequence !== longitudeQuestionSequence) return false;
      longitudePrompt.textContent += character;
      playRecordTick(characterIndex);
      await wait(46);
    }

    if (sequence !== longitudeQuestionSequence) return false;
    longitudePrompt.classList.remove("is-typing-question");
    longitudePrompt.removeAttribute("aria-busy");
    return true;
  }

  function setLongitudeStageMode(mode = "default") {
    longitudeStage.classList.remove(
      "is-prime-layout",
      "is-exploration-layout",
      "is-calibration-layout",
      "is-calibration-one",
      "is-calibration-two",
      "is-summary-layout",
      "is-notation-layout",
      "is-draggable",
    );
    if (mode === "prime") longitudeStage.classList.add("is-prime-layout");
    if (mode === "exploration") longitudeStage.classList.add("is-exploration-layout");
    if (mode === "calibration-one" || mode === "calibration-two") {
      longitudeStage.classList.add(
        "is-calibration-layout",
        "is-draggable",
        mode === "calibration-one" ? "is-calibration-one" : "is-calibration-two",
      );
    }
    if (mode === "task4-search") {
      longitudeStage.classList.add("is-calibration-layout", "is-draggable");
    }
    if (mode === "summary") longitudeStage.classList.add("is-summary-layout");
    if (mode === "notation") longitudeStage.classList.add("is-notation-layout");
  }

  function setLongitudeActions(actions = [], { immediate = false } = {}) {
    clearProcessActionContainer(longitudeActions);
    const actionNames = actions.map(({ action }) => action);
    const isAnswerGroup = actionNames.length > 0 && actionNames.every((action) => action.startsWith("answer-"));
    const isTeachingGroup = actionNames.length > 0 && actionNames.every((action) => action.startsWith("explore-"));
    const isProcessGroup = actionNames.length > 0 && !isAnswerGroup && !isTeachingGroup;
    const expectedPhase = longitudeTaskState.phase;
    longitudeActions.classList.toggle("is-answer-actions", isAnswerGroup);
    longitudeActions.classList.toggle("is-teaching-actions", isTeachingGroup);
    longitudeActions.classList.toggle("is-process-actions", isProcessGroup);
    const render = () => {
      actions.forEach(({ label, action }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.dataset.longitudeAction = action;
        longitudeActions.append(button);
      });
    };
    if (!isProcessGroup) {
      render();
      return;
    }
    void revealProcessActionAfterDelay(longitudeActions, render, {
      immediate,
      isCurrent: () => longitudeTaskState.phase === expectedPhase,
    });
  }

  function resetLongitudeTaskState() {
    longitudeTaskState.phase = "idle";
    longitudeTaskState.zeroAttempts = 0;
    longitudeTaskState.zeroAttemptValues.length = 0;
    longitudeTaskState.primeEstablished = false;
    longitudeTaskState.exploredDirections.length = 0;
    longitudeTaskState.ewEstablished = false;
    longitudeTaskState.calibration1Complete = false;
    longitudeTaskState.calibration2Complete = false;
    longitudeTaskState.calibration1Errors = 0;
    longitudeTaskState.calibration2Errors = 0;
  }

  function loadLongitudeTaskState() {
    const savedState = progressData?.taskState?.longitude || getEmptyTaskState().longitude;
    longitudeTaskState.zeroAttempts = Math.min(2, Math.max(0, Number(savedState.zeroAttempts) || 0));
    longitudeTaskState.zeroAttemptValues.length = 0;
    longitudeTaskState.zeroAttemptValues.push(...(savedState.zeroAttemptValues || []).map(Number).slice(0, 2));
    longitudeTaskState.primeEstablished = Boolean(savedState.primeEstablished);
    longitudeTaskState.exploredDirections.length = 0;
    longitudeTaskState.exploredDirections.push(...savedState.exploredDirections);
    longitudeTaskState.ewEstablished = Boolean(savedState.ewEstablished);
    longitudeTaskState.calibration1Complete = Boolean(savedState.calibration1Complete);
    longitudeTaskState.calibration2Complete = Boolean(savedState.calibration2Complete);
    longitudeTaskState.calibration1Errors = 0;
    longitudeTaskState.calibration2Errors = 0;
  }

  function updateLongitudeDevice(isComplete = false) {
    deviceNetworkRow.hidden = false;
    deviceNetworkValue.textContent = "经线、纬线";
    deviceNorthValue.textContent = "纬度识别已恢复";
    deviceEastValue.textContent = isComplete ? "经度识别已恢复" : "对应经线";
    deviceSystemValue.textContent = isComplete ? "具体位置未确认" : "仍未完成";
    deviceSystemRow.classList.toggle("device-readout__fault", !isComplete);
    deviceSystemRow.classList.remove("device-readout__ready");
  }

  async function showLongitudeTaskIntro(animate = false) {
    scene.classList.remove("latitude-active", "latitude-extracting", "longitude-active");
    latitudeStage.setAttribute("aria-hidden", "true");
    latitudeIntroStage.classList.remove("is-visible");
    latitudeIntroStage.setAttribute("aria-hidden", "true");
    longitudeStage.setAttribute("aria-hidden", "true");
    longitudeIntroStage.setAttribute("aria-hidden", "false");
    longitudeIntroStage.classList.add("is-visible");
    cancelProcessActionReveal(longitudeIntroStart);
    longitudeIntroStart.hidden = true;
    longitudeIntroStart.disabled = false;
    longitudeIntroLead.textContent = animate ? "" : "东西定位，要借助经线。";
    longitudeIntroQuestion.textContent = animate
      ? ""
      : "可是，这些经线看起来都一样，哪一条应该作为经度的0°线？";
    longitudeIntroTitle.textContent = animate ? "" : "任务三：修复东西定位";

    if (!animate) {
      await revealProcessActionAfterDelay(longitudeIntroStart, () => {
        longitudeIntroStart.hidden = false;
      }, { immediate: true });
      return;
    }

    await wait(500);
    longitudeIntroLead.textContent = "东西定位，要借助经线。";
    await wait(720);
    longitudeIntroQuestion.textContent = "可是，这些经线看起来都一样，哪一条应该作为经度的0°线？";
    await wait(820);
    longitudeIntroTitle.textContent = "任务三：修复东西定位";
    await revealProcessActionAfterDelay(longitudeIntroStart, () => {
      longitudeIntroStart.hidden = false;
    }, {
      isCurrent: () => longitudeIntroStage.classList.contains("is-visible")
        && !scene.classList.contains("longitude-active"),
    });
  }

  function getLongitudeTeachingPoint(longitude, latitude) {
    return getLongitudePoint(-longitude, latitude, longitudeTeachingModel.radius);
  }

  function createFrontSurfacePathData(pointFactory, start, end, steps) {
    const projectedPoints = [];

    for (let step = 0; step <= steps; step += 1) {
      const value = start + ((end - start) * step) / steps;
      projectedPoints.push(projectOrthographicPoint(pointFactory(value), longitudeTeachingModel));
    }

    const commands = [];
    const appendPoint = (command, point) => {
      commands.push(`${command} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`);
    };
    const getLimbIntersection = (from, to) => {
      const depthRange = from.depth - to.depth;
      const progress = depthRange === 0 ? 0 : from.depth / depthRange;
      return {
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
      };
    };

    let previous = projectedPoints[0];
    let previousIsFront = previous.depth <= LONGITUDE_FRONT_DEPTH_TOLERANCE;
    if (previousIsFront) appendPoint("M", previous);

    for (let index = 1; index < projectedPoints.length; index += 1) {
      const current = projectedPoints[index];
      const currentIsFront = current.depth <= LONGITUDE_FRONT_DEPTH_TOLERANCE;

      if (previousIsFront && currentIsFront) {
        appendPoint("L", current);
      } else if (previousIsFront && !currentIsFront) {
        appendPoint("L", getLimbIntersection(previous, current));
      } else if (!previousIsFront && currentIsFront) {
        appendPoint("M", getLimbIntersection(previous, current));
        appendPoint("L", current);
      }

      previous = current;
      previousIsFront = currentIsFront;
    }

    return commands.join(" ");
  }

  function createFrontLongitudePathData(longitude, endLatitude) {
    const equatorPoint = projectOrthographicPoint(
      getLongitudeTeachingPoint(longitude, 0),
      longitudeTeachingModel,
    );
    if (equatorPoint.depth > LONGITUDE_FRONT_DEPTH_TOLERANCE) return "";
    return createFrontSurfacePathData(
      (latitude) => getLongitudeTeachingPoint(longitude, latitude),
      0,
      endLatitude,
      90,
    );
  }

  function getLongitudeLineGroup(longitude) {
    const normalized = canonicalLongitude(longitude);
    return longitudeTeachingLines.querySelector(
      `.longitude-line-group[data-longitude="${normalized}"]`,
    );
  }

  function getLongitudeDegreeLabel(direction, degree) {
    if (degree === 180) {
      return longitudeTeachingLabels.querySelector('.longitude-label[data-degree="180"]');
    }
    return longitudeTeachingLabels.querySelector(
      `.longitude-label[data-direction="${direction}"][data-degree="${degree}"]`,
    );
  }

  function updateLongitudeTeachingGeometry() {
    longitudeTeachingModel.rotation.y = Number(longitudeTeachingModel.rotation.y);
    longitudeTeachingLines.querySelectorAll(".longitude-line-group").forEach((group) => {
      const longitude = Number(group.dataset.longitude);
      const paths = group.querySelectorAll("path");
      const northFrontData = createFrontLongitudePathData(longitude, 90);
      const southFrontData = createFrontLongitudePathData(longitude, -90);
      paths.forEach((path) => {
        const isNorth = path.classList.contains("longitude-line--north");
        const pathData = isNorth ? northFrontData : southFrontData;
        path.setAttribute("d", pathData);
      });
      const equatorHit = group.querySelector(".longitude-line-hit-node");
      if (equatorHit) {
        const equatorPoint = projectOrthographicPoint(
          getLongitudeTeachingPoint(longitude, 0),
          longitudeTeachingModel,
        );
        equatorHit.setAttribute("cx", equatorPoint.x.toFixed(2));
        equatorHit.setAttribute("cy", equatorPoint.y.toFixed(2));
        const isFront = equatorPoint.depth <= LONGITUDE_FRONT_DEPTH_TOLERANCE;
        const isEdge = Math.abs(equatorPoint.depth) < 0.22;
        group.classList.toggle("is-edge-hit", isEdge);
        equatorHit.setAttribute("r", isEdge ? "18" : "13");
        equatorHit.classList.toggle("is-back", !isFront);
        equatorHit.style.pointerEvents = group.classList.contains("is-interactive") && isFront
          ? "all"
          : "none";
      }
    });

    longitudeTeachingLabels.querySelectorAll(".longitude-label").forEach((label) => {
      const longitude = Number(label.dataset.longitude);
      const point = projectOrthographicPoint(
        getLongitudeTeachingPoint(longitude, 0),
        longitudeTeachingModel,
      );
      const isPrimeLabel = label.dataset.direction === "prime";
      const isFront = isPrimeLabel ? point.depth < -0.94 : point.depth < -0.01;
      if (isPrimeLabel) {
        label.setAttribute("x", longitudeTeachingModel.center[0].toFixed(2));
        label.setAttribute("y", (longitudeTeachingModel.center[1] - 44).toFixed(2));
        label.setAttribute("text-anchor", "middle");
      } else {
        const isRight = point.x >= longitudeTeachingModel.center[0];
        label.setAttribute("x", (point.x + (isRight ? 13 : -13)).toFixed(2));
        label.setAttribute("y", (point.y + (isFront ? -16 : 30)).toFixed(2));
        label.setAttribute("text-anchor", isRight ? "start" : "end");
      }
      label.classList.toggle("is-back", !isFront);
      if (isPrimeLabel) {
        label.dataset.longitude = "0";
        label.textContent = "本初子午线 0°";
      }
      syncLongitudeLabelVisibility(label);
    });

    if (longitudeTeachingMarker.classList.contains("is-visible")) {
      const longitude = Number(longitudeTeachingMarker.dataset.longitude || 0);
      const point = projectOrthographicPoint(
        getLongitudeTeachingPoint(longitude, 0),
        longitudeTeachingModel,
      );
      longitudeTeachingMarker.setAttribute(
        "transform",
        `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`,
      );
    }
  }

  function buildLongitudeTeachingGlobe() {
    longitudeTeachingLines.replaceChildren();
    longitudeTeachingLabels.replaceChildren();
    longitudeTeachingModel.rotation.y = getLongitudePrimeViewRotation();
    longitudeSphereShell.setAttribute("d", createSphereShellPath("longitude", longitudeTeachingModel));

    longitudeTeachingValues.forEach((longitude) => {
      const group = createSvgElement("g", {
        class: `longitude-line-group${longitude === -180 ? " is-antimeridian" : ""}`,
        "data-longitude": longitude,
        role: "button",
        tabindex: -1,
        "aria-label": "经线候选",
        "aria-disabled": "true",
      });
      [90, -90].forEach((endLatitude) => {
        group.append(
          createSvgElement("path", {
            class: `longitude-line ${endLatitude > 0 ? "longitude-line--north" : "longitude-line--south"}`,
            d: createFrontLongitudePathData(longitude, endLatitude),
          }),
          createSvgElement("path", {
            class: `longitude-line-hit ${endLatitude > 0 ? "longitude-line--north" : "longitude-line--south"}`,
            d: createFrontLongitudePathData(longitude, endLatitude),
          }),
        );
      });
      const equatorPoint = projectOrthographicPoint(
        getLongitudeTeachingPoint(longitude, 0),
        longitudeTeachingModel,
      );
      group.append(createSvgElement("circle", {
        class: "longitude-line-hit-node",
        cx: equatorPoint.x.toFixed(2),
        cy: equatorPoint.y.toFixed(2),
        r: 13,
      }));
      longitudeTeachingLines.append(group);
    });

    const labelSpecs = [
      { longitude: 0, degree: 0, direction: "prime", text: "本初子午线 0°" },
      ...[30, 60, 90, 120, 150].map((degree) => ({
        longitude: degree,
        degree,
        direction: "east",
        text: `${degree}°`,
      })),
      ...[30, 60, 90, 120, 150].map((degree) => ({
        longitude: -degree,
        degree,
        direction: "west",
        text: `${degree}°`,
      })),
      { longitude: -180, degree: 180, direction: "shared", text: "180°" },
    ];
    labelSpecs.forEach((spec) => {
      const label = createSvgElement("text", {
        class: `longitude-label longitude-label--${spec.direction}`,
        "data-longitude": spec.longitude,
        "data-degree": spec.degree,
        "data-direction": spec.direction,
        "aria-hidden": "true",
      });
      label.textContent = spec.text;
      longitudeTeachingLabels.append(label);
    });
    updateLongitudeTeachingGeometry();
  }

  function resetLongitudeTeachingVisuals() {
    longitudeTeachingLines.querySelectorAll(".longitude-line-group").forEach((group) => {
      group.classList.remove(
        "is-interactive",
        "is-attempted",
        "is-prime",
        "is-antimeridian-highlight",
        "is-calibration-target",
        "is-calibration-pulse",
        "is-error-flash",
      );
    });
    longitudeTeachingLabels.querySelectorAll(".longitude-label").forEach((label) => {
      label.classList.remove("is-visible", "is-target-hidden");
      label.setAttribute("aria-hidden", "true");
    });
    longitudeTeachingMarker.classList.remove("is-visible", "is-moving");
    longitudeTeachingMarker.setAttribute("aria-hidden", "true");
  }

  function setLongitudeLineInteraction(isInteractive) {
    longitudeTeachingLines.querySelectorAll(".longitude-line-group").forEach((group) => {
      group.classList.toggle("is-interactive", isInteractive);
      group.setAttribute("tabindex", isInteractive ? "0" : "-1");
      group.setAttribute("aria-disabled", String(!isInteractive));
      group.querySelectorAll(".longitude-line-hit, .longitude-line-hit-node").forEach((hitArea) => {
        const isFrontNode = hitArea.classList.contains("longitude-line-hit-node")
          && !hitArea.classList.contains("is-back");
        hitArea.style.pointerEvents = !isInteractive
          ? "none"
          : hitArea.classList.contains("longitude-line-hit-node")
            ? isFrontNode ? "all" : "none"
            : "stroke";
      });
    });
  }

  function showLongitudeLabel(direction, degree, notation = "plain") {
    const label = getLongitudeDegreeLabel(direction, degree);
    if (!label) return;
    if (degree === 0) {
      label.textContent = "本初子午线 0°";
    } else if (degree === 180) {
      label.textContent = "180°";
    } else {
      const suffix = notation === "ew" ? (direction === "east" ? "E" : "W") : "";
      label.textContent = `${degree}°${suffix}`;
    }
    label.classList.add("is-visible");
    label.classList.remove("is-target-hidden");
    syncLongitudeLabelVisibility(label);
  }

  function syncLongitudeLabelVisibility(label) {
    const shouldDisplay = label.classList.contains("is-visible")
      && !label.classList.contains("is-back")
      && !label.classList.contains("is-target-hidden");
    label.setAttribute("aria-hidden", String(!shouldDisplay));
  }

  function hideLongitudeLabels(keepPrime = true) {
    longitudeTeachingLabels.querySelectorAll(".longitude-label").forEach((label) => {
      const shouldRemain = keepPrime && label.dataset.direction === "prime";
      label.classList.toggle("is-visible", shouldRemain);
      label.classList.remove("is-target-hidden");
      label.setAttribute("aria-hidden", String(!shouldRemain));
    });
  }

  function showLongitudeDirection(direction, notation = "plain") {
    [30, 60, 90, 120, 150].forEach((degree) => showLongitudeLabel(direction, degree, notation));
    showLongitudeLabel("shared", 180);
  }

  function showCompleteLongitudeNotation(notation = "ew") {
    showLongitudeLabel("prime", 0);
    showLongitudeDirection("east", notation);
    showLongitudeDirection("west", notation);
    showLongitudeLabel("shared", 180);
    getLongitudeLineGroup(-180)?.classList.toggle("is-antimeridian-highlight", notation === "ew");
  }

  function setLongitudeMarker(longitude) {
    const point = projectOrthographicPoint(
      getLongitudeTeachingPoint(longitude, 0),
      longitudeTeachingModel,
    );
    longitudeTeachingMarker.setAttribute(
      "transform",
      `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`,
    );
    longitudeTeachingMarker.dataset.longitude = Number(longitude).toFixed(2);
    longitudeTeachingMarker.classList.add("is-visible");
    longitudeTeachingMarker.setAttribute("aria-hidden", "false");
  }

  function hideLongitudeMarker() {
    longitudeTeachingMarker.classList.remove("is-visible", "is-moving");
    longitudeTeachingMarker.setAttribute("aria-hidden", "true");
  }

  function establishPrimeVisual() {
    longitudeTeachingLines.querySelectorAll(".longitude-line-group.is-prime").forEach((group) => {
      group.classList.remove("is-prime");
    });
    const primeGroup = longitudeTeachingLines.querySelector(
      '.longitude-line-group[data-longitude="0"]',
    );
    primeGroup?.classList.add("is-prime");
    const primeLabel = longitudeTeachingLabels.querySelector(
      '.longitude-label[data-direction="prime"]',
    );
    if (primeLabel) {
      primeLabel.dataset.longitude = "0";
      primeLabel.dataset.degree = "0";
      primeLabel.textContent = "本初子午线 0°";
    }
    showLongitudeLabel("prime", 0);
  }

  function activateLongitudeTeachingStage() {
    cancelProcessActionReveal(longitudeIntroStart);
    longitudeIntroStart.hidden = true;
    prepareCompletedTaskOneWorld();
    updateLatitudeDevice();
    latitudeIntroStage.classList.remove("is-visible");
    latitudeIntroStage.setAttribute("aria-hidden", "true");
    latitudeStage.setAttribute("aria-hidden", "true");
    longitudeIntroStage.classList.remove("is-visible");
    longitudeIntroStage.setAttribute("aria-hidden", "true");
    longitudeStage.setAttribute("aria-hidden", "false");
    scene.classList.add("longitude-active");
    setLongitudeStageMode();
    buildLongitudeTeachingGlobe();
    resetLongitudeTeachingVisuals();
    setLongitudeActions();
    setLongitudeCopy();
  }

  function prepareLongitudeZeroQuestion() {
    longitudeTaskState.phase = "zero-question";
    setLongitudeStageMode();
    setLongitudeLineInteraction(true);
    setLongitudeCopy({ prompt: "这些经线看起来都一样，哪一条应该作为经度的0°线？" });
    setLongitudeActions();
  }

  async function startLongitudeTask() {
    resetLongitudeTaskState();
    updateCheckpoint("longitude-start");
    longitudeIntroStart.disabled = true;
    cancelProcessActionReveal(longitudeIntroStart);
    longitudeIntroStage.classList.remove("is-visible");
    longitudeIntroStage.setAttribute("aria-hidden", "true");
    await wait(650);
    activateLongitudeTeachingStage();
    await wait(420);
    prepareLongitudeZeroQuestion();
  }

  function showLongitudeZeroConflict(immediateProcessAction = false) {
    longitudeTaskState.phase = "zero-conflict";
    setLongitudeLineInteraction(false);
    setLongitudeCopy({
      prompt: "既然没有一条经线天然适合作为0°，那该怎么办？",
      feedback: "换一条也是一样。看来，经线中没有一条天然特别。",
    });
    setLongitudeActions(
      [{ label: "继续", action: "reveal-prime" }],
      { immediate: immediateProcessAction },
    );
  }

  async function revealPrimeMeridian() {
    longitudeTaskState.phase = "prime-reveal";
    setLongitudeStageMode("prime");
    setLongitudeActions();
    setLongitudeCopy({
      prompt: "1884年国际经度会议规定：通过英国格林尼治天文台旧址的那条经线作为0°经线。“本初”的原意是起点，因此称为本初子午线。",
    });
    longitudeTeachingModel.rotation.y = getLongitudePrimeViewRotation();
    updateLongitudeTeachingGeometry();
    longitudeTeachingLines.querySelectorAll(".longitude-line-group.is-attempted").forEach((group) => {
      group.classList.remove("is-attempted");
    });
    establishPrimeVisual();
    await wait(1500);
    longitudeTaskState.primeEstablished = true;
    longitudeTaskState.phase = "prime-established";
    updateCheckpoint("longitude-prime-established");
    setLongitudeActions([{ label: "继续", action: "continue-after-prime" }]);
  }

  function showLongitudeExplorationChoices() {
    longitudeTaskState.phase = "choose-direction";
    setLongitudeStageMode("exploration");
    setLongitudeLineInteraction(false);
    establishPrimeVisual();
    setLongitudeMarker(0);
    setLongitudeCopy({
      prompt: longitudeTaskState.exploredDirections.length
        ? "回到本初子午线0°，再探索另一边。"
        : "从本初子午线0°出发，选择一个方向进行探索。",
    });
    const actions = [];
    if (!longitudeTaskState.exploredDirections.includes("east")) {
      actions.push({ label: "向东探索", action: "explore-east" });
    }
    if (!longitudeTaskState.exploredDirections.includes("west")) {
      actions.push({ label: "向西探索", action: "explore-west" });
    }
    setLongitudeActions(actions);
  }

  function animateLongitudeDirection(
    direction,
    { showMarker = true, notation = "plain" } = {},
  ) {
    const sign = direction === "east" ? 1 : -1;
    const duration = 7600;
    const primeRotation = getLongitudePrimeViewRotation();
    let startTime = null;
    let nextDegreeIndex = 0;
    if (showMarker) longitudeTeachingMarker.classList.add("is-moving");

    return new Promise((resolve) => {
      function renderFrame(timestamp) {
        if (startTime === null) startTime = timestamp;
        const rawProgress = Math.min(1, (timestamp - startTime) / duration);
        const easedProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);
        const longitude = sign * 180 * easedProgress;
        longitudeTeachingModel.rotation.y = primeRotation + longitude;
        updateLongitudeTeachingGeometry();
        if (showMarker) setLongitudeMarker(longitude);

        while (
          nextDegreeIndex < longitudeDegreeValues.length
          && Math.abs(longitude) >= longitudeDegreeValues[nextDegreeIndex]
        ) {
          showLongitudeLabel(direction, longitudeDegreeValues[nextDegreeIndex], notation);
          if (notation === "ew" && longitudeDegreeValues[nextDegreeIndex] === 180) {
            getLongitudeLineGroup(-180)?.classList.add("is-antimeridian-highlight");
          }
          nextDegreeIndex += 1;
        }

        if (rawProgress < 1) {
          window.requestAnimationFrame(renderFrame);
          return;
        }
        if (showMarker) longitudeTeachingMarker.classList.remove("is-moving");
        resolve();
      }
      window.requestAnimationFrame(renderFrame);
    });
  }

  function animateLongitudeReturn(direction, { showMarker = true } = {}) {
    const startLongitude = direction === "east" ? 180 : -180;
    const startRotation = longitudeTeachingModel.rotation.y;
    const primeRotation = getLongitudePrimeViewRotation();
    const duration = 1900;
    let startTime = null;
    if (showMarker) longitudeTeachingMarker.classList.add("is-moving");

    return new Promise((resolve) => {
      function renderFrame(timestamp) {
        if (startTime === null) startTime = timestamp;
        const rawProgress = Math.min(1, (timestamp - startTime) / duration);
        const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
        const longitude = startLongitude * (1 - easedProgress);
        longitudeTeachingModel.rotation.y = startRotation
          + (primeRotation - startRotation) * easedProgress;
        updateLongitudeTeachingGeometry();
        if (showMarker) setLongitudeMarker(longitude);
        if (rawProgress < 1) {
          window.requestAnimationFrame(renderFrame);
          return;
        }
        if (showMarker) longitudeTeachingMarker.classList.remove("is-moving");
        resolve();
      }
      window.requestAnimationFrame(renderFrame);
    });
  }

  function showBothLongitudeSidesQuestion(immediateProcessAction = false) {
    longitudeTaskState.phase = "both-sides-question";
    setLongitudeStageMode();
    longitudeTeachingModel.rotation.y = getLongitudePrimeViewRotation();
    updateLongitudeTeachingGeometry();
    hideLongitudeMarker();
    showCompleteLongitudeNotation("plain");
    setLongitudeCopy({
      prompt: "东西两边都有相同的度数，怎样区分它们在本初子午线的哪一边？",
    });
    setLongitudeActions(
      [{ label: "继续", action: "establish-ew" }],
      { immediate: immediateProcessAction },
    );
  }

  async function exploreLongitudeDirection(direction) {
    if (longitudeTaskState.exploredDirections.includes(direction)) return;
    longitudeTaskState.phase = `exploring-${direction}`;
    setLongitudeActions();
    establishPrimeVisual();
    setLongitudeCopy({
      prompt: direction === "east"
        ? "定位点沿赤道向东移动，观察经度怎样变化。"
        : "定位点沿赤道向西移动，观察经度怎样变化。",
    });
    setLongitudeMarker(0);
    await animateLongitudeDirection(direction);
    await wait(700);
    longitudeTaskState.exploredDirections.push(direction);
    await animateLongitudeReturn(direction);

    if (longitudeTaskState.exploredDirections.length === 1) {
      updateCheckpoint("longitude-one-side-complete");
      showLongitudeExplorationChoices();
      return;
    }

    updateCheckpoint("longitude-both-sides-complete");
    showBothLongitudeSidesQuestion();
  }

  async function establishLongitudeNotation() {
    longitudeTaskState.phase = "establishing-ew";
    setLongitudeStageMode("notation");
    setLongitudeActions();
    longitudeTeachingModel.rotation.y = getLongitudePrimeViewRotation();
    updateLongitudeTeachingGeometry();
    hideLongitudeMarker();
    showCompleteLongitudeNotation("plain");
    const directionQuestion = "东西两边都有相同的度数，怎样区分它们在本初子午线的哪一边？";
    setLongitudeCopy({
      prompt: directionQuestion,
    });
    setLongitudeNotationFeedback(1);
    await animateLongitudeDirection("east", { showMarker: false, notation: "ew" });
    await wait(500);
    await animateLongitudeReturn("east", { showMarker: false });
    await wait(650);
    setLongitudeCopy({
      prompt: directionQuestion,
    });
    setLongitudeNotationFeedback(2);
    await animateLongitudeDirection("west", { showMarker: false, notation: "ew" });
    await wait(500);
    await animateLongitudeReturn("west", { showMarker: false });
    showCompleteLongitudeNotation("ew");
    setLongitudeCopy({
      prompt: directionQuestion,
    });
    setLongitudeNotationFeedback(3);
    longitudeTaskState.ewEstablished = true;
    longitudeTaskState.phase = "ew-established";
    updateCheckpoint("longitude-ew-complete");
    setLongitudeActions([{ label: "结论", action: "show-longitude-conclusion" }]);
  }

  function showLongitudeConclusion(immediateProcessAction = false) {
    longitudeTaskState.phase = "ew-conclusion";
    setLongitudeStageMode();
    setLongitudeCopy({
      prompt: "经度从本初子午线的0°开始，向东、向西逐渐增大，到180°。",
    });
    setLongitudeActions(
      [{ label: "进入定位校准", action: "start-longitude-calibration-1" }],
      { immediate: immediateProcessAction },
    );
  }

  function startLongitudeCalibrationOne(animateQuestion = true) {
    longitudeTaskState.phase = "longitude-calibration-1";
    longitudeTaskState.calibration1Errors = 0;
    setLongitudeStageMode("calibration-one");
    longitudeTeachingModel.rotation.y = getLongitudePrimeViewRotation();
    updateLongitudeTeachingGeometry();
    showCompleteLongitudeNotation("ew");
    setLongitudeLineInteraction(false);
    setLongitudeCopy();
    setLongitudeActions();
    const enableInteraction = () => {
      if (longitudeTaskState.phase === "longitude-calibration-1") {
        setLongitudeLineInteraction(true);
      }
    };
    if (animateQuestion) {
      void typeLongitudeQuestion("校准1：请找到 60°W。").then((didFinish) => {
        if (didFinish) enableInteraction();
      });
    } else {
      setLongitudeCopy({ prompt: "校准1：请找到 60°W。" });
      enableInteraction();
    }
  }

  async function startLongitudeCalibrationTwo(animateQuestion = true) {
    longitudeTaskState.phase = "longitude-calibration-2";
    longitudeTaskState.calibration2Errors = 0;
    setLongitudeStageMode("calibration-two");
    longitudeTeachingModel.rotation.y = 30;
    updateLongitudeTeachingGeometry();
    showCompleteLongitudeNotation("ew");
    setLongitudeLineInteraction(false);
    longitudeTeachingLines.querySelectorAll(".longitude-line-group").forEach((group) => {
      group.classList.remove("is-calibration-target", "is-calibration-pulse");
    });
    // The 180° line is useful while explaining east/west notation, but it
    // competes visually with the 150°E target in this calibration question.
    getLongitudeLineGroup(-180)?.classList.remove("is-antimeridian-highlight");
    getLongitudeLineGroup(150)?.classList.add("is-calibration-target", "is-calibration-pulse");
    const targetLabel = getLongitudeDegreeLabel("east", 150);
    targetLabel?.classList.add("is-target-hidden");
    targetLabel?.setAttribute("aria-hidden", "true");
    setLongitudeCopy();
    setLongitudeActions();
    const showAnswers = () => {
      if (longitudeTaskState.phase === "longitude-calibration-2") {
        setLongitudeActions([
          { label: "150°E", action: "answer-150-e" },
          { label: "150°W", action: "answer-150-w" },
        ]);
      }
    };
    if (animateQuestion) {
      const didFinish = await typeLongitudeQuestion("图中高亮的这条经线的经度是多少？");
      if (didFinish) showAnswers();
    } else {
      setLongitudeCopy({ prompt: "图中高亮的这条经线的经度是多少？" });
      showAnswers();
    }
  }

  function showLongitudeCalibrationSummary(saveCheckpoint = true) {
    longitudeTaskState.phase = "longitude-calibration-summary";
    longitudeTaskState.calibration2Complete = true;
    setLongitudeStageMode("summary");
    setLongitudeLineInteraction(false);
    longitudeTeachingModel.rotation.y = getLongitudePrimeViewRotation();
    longitudeTeachingLines.querySelectorAll(".longitude-line-group").forEach((group) => {
      group.classList.remove("is-calibration-target", "is-calibration-pulse");
    });
    updateLongitudeTeachingGeometry();
    showCompleteLongitudeNotation("ew");
    hideLongitudeMarker();
    setLongitudeCopy({
      prompt: "经度从本初子午线的0°开始，向东、向西逐渐增大，到180°。",
    });
    setLongitudeActions(
      [{ label: "完成校准", action: "complete-longitude-calibration" }],
      { immediate: !saveCheckpoint },
    );
    if (saveCheckpoint) updateCheckpoint("longitude-calibration-complete");
  }

  async function completeLongitudeTask() {
    longitudeTaskState.phase = "complete";
    setLongitudeActions();
    markTaskComplete("longitude", "longitude-complete");
    scene.classList.remove("longitude-active");
    longitudeStage.setAttribute("aria-hidden", "true");
    await wait(700);
    updateLongitudeDevice(true);
    showFinalLocationKnowledgeSummary();
    highlightDeviceUpdates(["east", "system"]);
    completionDeviceReviewType = "longitude";
    device.classList.add("is-found", "is-position-alert");
    setDeviceOpen(true);
  }

  function restoreLongitudeStart() {
    resetLongitudeTaskState();
    activateLongitudeTeachingStage();
    prepareLongitudeZeroQuestion();
  }

  function restoreLongitudeOneZeroAttempt() {
    loadLongitudeTaskState();
    activateLongitudeTeachingStage();
    longitudeTaskState.phase = "zero-question";
    longitudeTaskState.zeroAttemptValues.forEach((value) => {
      getLongitudeLineGroup(value)?.classList.add("is-attempted");
    });
    setLongitudeLineInteraction(true);
    setLongitudeCopy({
      prompt: "再换一条经线看看。",
      feedback: "这条经线与其他经线没有什么不同，长度都是相等的。",
    });
  }

  function restoreLongitudeZeroConflictComplete() {
    loadLongitudeTaskState();
    activateLongitudeTeachingStage();
    longitudeTaskState.zeroAttemptValues.forEach((value) => {
      getLongitudeLineGroup(value)?.classList.add("is-attempted");
    });
    showLongitudeZeroConflict(true);
  }

  function restoreLongitudePrimeEstablished() {
    loadLongitudeTaskState();
    activateLongitudeTeachingStage();
    setLongitudeStageMode("prime");
    establishPrimeVisual();
    longitudeTaskState.phase = "prime-established";
    setLongitudeCopy({
      prompt: "1884年国际经度会议规定：通过英国格林尼治天文台旧址的那条经线作为0°经线。“本初”的原意是起点，因此称为本初子午线。",
    });
    setLongitudeActions(
      [{ label: "继续", action: "continue-after-prime" }],
      { immediate: true },
    );
  }

  function restoreLongitudeOneSideComplete() {
    loadLongitudeTaskState();
    activateLongitudeTeachingStage();
    establishPrimeVisual();
    longitudeTaskState.exploredDirections.forEach((direction) => {
      showLongitudeDirection(direction);
    });
    showLongitudeExplorationChoices();
  }

  function restoreLongitudeBothSidesComplete() {
    loadLongitudeTaskState();
    activateLongitudeTeachingStage();
    establishPrimeVisual();
    showBothLongitudeSidesQuestion(true);
  }

  function restoreLongitudeNotationComplete() {
    loadLongitudeTaskState();
    activateLongitudeTeachingStage();
    setLongitudeStageMode("notation");
    establishPrimeVisual();
    showCompleteLongitudeNotation("ew");
    longitudeTaskState.phase = "ew-established";
    setLongitudeCopy({
      prompt: "东西两边都有相同的度数，怎样区分它们在本初子午线的哪一边？",
    });
    setLongitudeNotationFeedback(3);
    setLongitudeActions(
      [{ label: "结论", action: "show-longitude-conclusion" }],
      { immediate: true },
    );
  }

  function restoreLongitudeCalibrationOneComplete() {
    loadLongitudeTaskState();
    activateLongitudeTeachingStage();
    establishPrimeVisual();
    void startLongitudeCalibrationTwo(false);
  }

  function restoreLongitudeCalibrationComplete() {
    loadLongitudeTaskState();
    activateLongitudeTeachingStage();
    establishPrimeVisual();
    showLongitudeCalibrationSummary(false);
  }

  function restoreLongitudeComplete() {
    prepareCompletedTaskOneWorld();
    longitudeTaskState.phase = "complete";
    updateLongitudeDevice(true);
    showFinalLocationKnowledgeSummary();
    highlightDeviceUpdates(["east", "system"]);
    completionDeviceReviewType = "longitude";
    device.classList.add("is-found", "is-position-alert");
    setDeviceOpen(true);
  }

  function restoreTask4Start() {
    destroyTask4WhenImplemented();
    prepareCompletedTaskOneWorld();
    longitudeTaskState.phase = "complete";
    updateLongitudeDevice(true);
    showFinalLocationKnowledgeSummary();
    highlightDeviceUpdates(["east", "system"]);
    completionDeviceReviewType = "longitude";
    device.classList.add("is-found", "is-position-alert");
    setDeviceOpen(true);
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

  function unlockRecordAudio() {
    if (soundToggle.getAttribute("aria-pressed") === "true") return;
    const context = getAudioContext();
    if (!context) return;
    if (context.state === "running") {
      document.removeEventListener("pointerdown", unlockRecordAudio);
      document.removeEventListener("keydown", unlockRecordAudio);
    } else if (context.state === "suspended") {
      context.resume().then(() => {
        document.removeEventListener("pointerdown", unlockRecordAudio);
        document.removeEventListener("keydown", unlockRecordAudio);
      }).catch(() => {});
    }
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
    if (!music || !music.paused) return;
    music.play().then(() => {
      document.removeEventListener("pointerdown", retryBackgroundMusic);
      document.removeEventListener("keydown", retryBackgroundMusic);
    }).catch(() => {});
  }

  function retryBackgroundMusic() {
    if (backgroundMusicRequested) resumeBackgroundMusic();
  }

  function startBackgroundMusic() {
    if (backgroundMusicRequested) return;
    backgroundMusicRequested = true;
    document.addEventListener("pointerdown", retryBackgroundMusic);
    document.addEventListener("keydown", retryBackgroundMusic);
    resumeBackgroundMusic();
  }

  function playSoundEffect(kind) {
    if (soundToggle.getAttribute("aria-pressed") === "true") return;
    const src = kind === "button" ? audioConfig.buttonClickSrc : audioConfig.deviceOpenSrc;
    if (!src) return;

    let sound = soundEffects.get(kind);
    if (!sound) {
      sound = new Audio(src);
      sound.volume = kind === "button" ? audioConfig.buttonClickVolume : audioConfig.deviceOpenVolume;
      sound.preload = "auto";
      soundEffects.set(kind, sound);
    }
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  function stopSoundEffects() {
    soundEffects.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
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

  function applyScanRecordKnowledgeLabels() {
    const knowledgeLabels = {
      longitude: "经线",
      latitude: "纬线",
      relationship: "经纬线关系",
    };
    scanRecords.querySelectorAll(".scan-record").forEach((record, index) => {
      const label = record.querySelector("small");
      const recordType = scanHistory[index];
      if (label && knowledgeLabels[recordType]) {
        label.textContent = knowledgeLabels[recordType];
      }
    });
  }

  function showFinalLocationKnowledgeSummary() {
    const summaryItems = [
      {
        title: "纬度",
        lines: [
          "从赤道的0°开始，",
          "向北、向南逐渐增大，到90°，",
          "分别记北纬N、南纬S",
        ],
      },
      {
        title: "经度",
        lines: [
          "从本初子午线的0°开始，",
          "向东、向西逐渐增大，到180°，",
          "分别记东经E、西经W",
        ],
      },
    ];
    scanRecords.replaceChildren();
    scanRecords.classList.add("is-final-summary");
    relationshipRecordResult = null;
    summaryItems.forEach(({ title, lines }) => {
      const block = document.createElement("section");
      const label = document.createElement("small");
      block.className = "final-knowledge-block";
      label.textContent = title;
      block.append(label);
      lines.forEach((line) => {
        const value = document.createElement("span");
        value.className = "final-knowledge-block__line";
        value.textContent = line;
        block.append(value);
      });
      scanRecords.append(block);
    });
    taskReminder.textContent = "已完成：纬度定位南北 · 经度定位东西";
    taskReminder.classList.add("is-visible");
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
    cancelProcessActionReveal(combinedObserve);
    combinedObserve.disabled = true;
    combinedObserve.classList.remove("is-visible");
    taskPrompt.classList.add("has-action", "is-visible");
    return new Promise((resolve) => {
      void revealProcessActionAfterDelay(combinedObserve, () => {
        combinedObserve.disabled = false;
        combinedObserve.classList.add("is-visible");
        combinedObserve.addEventListener("click", () => {
          cancelProcessActionReveal(combinedObserve);
          combinedObserve.disabled = true;
          combinedObserve.classList.remove("is-visible");
          taskPrompt.classList.remove("has-action", "is-visible");
          resolve();
        }, { once: true });
      }, { isCurrent: () => investigationPhase === "combined-ready" });
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
    startBackgroundMusic();

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
    if (!isOpen && task4DeviceScanActive) return;
    window.clearTimeout(deviceTimer);
    const wasOpen = device.classList.contains("is-open");
    device.classList.toggle("is-open", isOpen);
    deviceDock.setAttribute("aria-expanded", String(isOpen));
    deviceDock.setAttribute("aria-label", isOpen ? "返航定位器已打开" : "打开返航定位器");

    if (isOpen) {
      if (!wasOpen) playSoundEffect("deviceOpen");
      if (!positionDeviceReviewActive && !completionDeviceReviewType && !task4DeviceCloseResolver) {
        deviceTimer = window.setTimeout(() => setDeviceOpen(false), 6800);
      }
      return;
    }

    if (task4DeviceCloseResolver) {
      const resolveTask4DeviceReview = task4DeviceCloseResolver;
      task4DeviceCloseResolver = null;
      device.classList.remove("is-position-alert");
      resolveTask4DeviceReview();
    }

    if (positionDeviceReviewActive) {
      positionDeviceReviewActive = false;
      device.classList.remove("is-position-alert");
      const resolveDeviceReview = positionDeviceCloseResolver;
      positionDeviceCloseResolver = null;
      resolveDeviceReview?.();
    }

    if (completionDeviceReviewType) {
      const completedType = completionDeviceReviewType;
      completionDeviceReviewType = null;
      device.classList.remove("is-position-alert");
      if (completedType === "latitude") showLatitudeTaskEnding();
      if (completedType === "longitude") startTask4Story();
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
    scanRecords.classList.remove("is-final-summary");
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
    window.clearTimeout(deviceUpdateTimer);
    window.clearTimeout(feedbackTimer);
    window.clearTimeout(taskPromptTimer);
    positionDeviceReviewActive = false;
    positionDeviceCloseResolver = null;
    task4DeviceCloseResolver = null;
    task4DeviceScanActive = false;
    device.classList.remove("is-task4-north-scanning", "is-task4-east-scanning");
    deviceClose.disabled = false;
    completionDeviceReviewType = null;
    taskHasStarted = true;

    scene.className = "scene is-recovering tracks-awake";
    scene.setAttribute("aria-hidden", "false");
    intro.classList.add("is-gone");
    startBackgroundMusic();
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
    highlightDeviceUpdates([]);

    taskPrompt.className = "task-prompt";
    cancelProcessActionReveal(combinedObserve);
    combinedObserve.classList.remove("is-visible");
    combinedObserve.disabled = true;
    taskReminder.classList.remove("is-visible");
    investigationFeedback.classList.remove("is-visible");
    investigationFeedback.textContent = "";

    scanStage.setAttribute("aria-hidden", "true");
    cancelProcessActionReveal(scanContinue);
    scanContinue.classList.remove("is-visible");
    scanResult.classList.remove("is-visible");
    scanContext.replaceChildren();
    scanDrawing.replaceChildren();
    comparisonStage.setAttribute("aria-hidden", "true");
    namingStage.setAttribute("aria-hidden", "true");
    cancelProcessActionReveal(namingContinue);
    positionTestStage.setAttribute("aria-hidden", "true");
    positionMapping.hidden = true;
    clearProcessActionContainer(positionTestActions);
    setPositionTestCopy();
    latitudeIntroStage.classList.remove("is-visible");
    latitudeIntroStage.setAttribute("aria-hidden", "true");
    cancelProcessActionReveal(latitudeIntroStart);
    latitudeIntroStart.hidden = false;
    latitudeIntroStart.disabled = false;
    latitudeStage.setAttribute("aria-hidden", "true");
    clearProcessActionContainer(latitudeActions);
    setLatitudeCopy();
    latitudeTeachingLines.replaceChildren();
    latitudeTeachingLabels.replaceChildren();
    hideLatitudeMarker();
    longitudeIntroStage.classList.remove("is-visible");
    longitudeIntroStage.setAttribute("aria-hidden", "true");
    cancelProcessActionReveal(longitudeIntroStart);
    longitudeIntroStart.hidden = false;
    longitudeIntroStart.disabled = false;
    longitudeStage.setAttribute("aria-hidden", "true");
    clearProcessActionContainer(longitudeActions);
    setLongitudeCopy();
    longitudeTeachingLines.replaceChildren();
    longitudeTeachingLabels.replaceChildren();
    hideLongitudeMarker();
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
    applyScanRecordKnowledgeLabels();
  }

  function preparePositionTestRestore() {
    prepareCompletedTaskOneWorld();
    applyScanRecordKnowledgeLabels();
    investigationPhase = "position-test";
    taskReminder.classList.remove("is-visible");
    scene.classList.add("position-test-active");
    positionTestStage.setAttribute("aria-hidden", "false");
    updatePositionDevice(false);
  }

  async function continuePositionTestFromStart() {
    await waitForPositionAction(
      [{ label: "开始定位测试", value: "start-position-test" }],
      { immediate: true },
    );
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
    await waitForPositionAction(
      [{ label: "继续测试东西位置", value: "continue-east" }],
      { immediate: true },
    );
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
    await waitForPositionAction(
      [{ label: "完成位置与线的对应", value: "continue-mapping" }],
      { immediate: true },
    );
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
    prepareCompletedTaskOneWorld();
    positionTestState.phase = "complete";
    positionTestState.northCorrect = true;
    positionTestState.eastCorrect = true;
    updatePositionDevice(true);
    void showLatitudeTaskIntro(false);
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
      case "latitude-start":
        restoreLatitudeStart();
        break;
      case "latitude-equator-found":
        restoreLatitudeEquatorFound();
        break;
      case "latitude-one-side-complete":
        restoreLatitudeOneSideComplete();
        break;
      case "latitude-both-sides-complete":
        restoreLatitudeBothSidesComplete();
        break;
      case "latitude-ns-complete":
        restoreLatitudeNotationComplete();
        break;
      case "latitude-calibration-1-complete":
        restoreLatitudeCalibrationOneComplete();
        break;
      case "latitude-calibration-complete":
        restoreLatitudeCalibrationComplete();
        break;
      case "latitude-complete":
        restoreLatitudeComplete();
        break;
      case "longitude-start":
        restoreLongitudeStart();
        break;
      case "longitude-one-zero-attempt":
        restoreLongitudeOneZeroAttempt();
        break;
      case "longitude-zero-conflict-complete":
        restoreLongitudeZeroConflictComplete();
        break;
      case "longitude-prime-established":
        restoreLongitudePrimeEstablished();
        break;
      case "longitude-one-side-complete":
        restoreLongitudeOneSideComplete();
        break;
      case "longitude-both-sides-complete":
        restoreLongitudeBothSidesComplete();
        break;
      case "longitude-ew-complete":
        restoreLongitudeNotationComplete();
        break;
      case "longitude-calibration-1-complete":
        restoreLongitudeCalibrationOneComplete();
        break;
      case "longitude-calibration-complete":
        restoreLongitudeCalibrationComplete();
        break;
      case "longitude-complete":
        restoreLongitudeComplete();
        break;
      case "task4-start":
        restoreTask4Start();
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
          && progressData.checkpoint !== "position-test-complete"
          && progressData.checkpoint !== "latitude-complete"
          && progressData.checkpoint !== "longitude-complete";
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
          return;
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

  latitudeIntroStart.addEventListener("click", () => {
    if (latitudeIntroStart.dataset.transitionAction === "longitude-intro") {
      cancelProcessActionReveal(latitudeIntroStart);
      latitudeIntroStart.hidden = true;
      latitudeIntroStart.disabled = true;
      delete latitudeIntroStart.dataset.transitionAction;
      void showLongitudeTaskIntro(true);
      return;
    }
    void startLatitudeTask();
  });

  function handleLatitudeLineSelection(latitude) {
    if (task4LatitudeState.phase === "WAITING_FOR_20N") {
      handleTask4LatitudeSelection(latitude);
      return;
    }

    if (latitudeTaskState.phase === "equator-question") {
      if (latitude !== 0) {
        setLatitudeCopy({
          prompt: "先找一找，哪一条纬线适合作为0°。",
          feedback: "再看看，哪条纬线正好环绕地球的中间，并且是最长的纬线圈？",
        });
        return;
      }

      latitudeTaskState.phase = "equator-confirmed";
      latitudeTaskState.equatorFound = true;
      setLatitudeLineInteraction(false);
      getLatitudeLineGroup(0)?.classList.add("is-equator");
      showLatitudeDegree(0);
      setLatitudeCopy({
        prompt: "这条纬线正好环绕地球的中间，而且是最长的纬线圈。",
        feedback: "它叫赤道，是纬度的0°线。",
      });
      setLatitudeActions([{ label: "继续", action: "continue-after-equator" }]);
      return;
    }

    if (latitudeTaskState.phase !== "calibration-1") return;
    if (latitude !== -40) {
      latitudeTaskState.calibration1Errors += 1;
      const firstErrorFeedback = latitude > 0
        ? "目标是40°S，先看看它应该在赤道的哪一边。"
        : latitude === 0
          ? "40°S在赤道以南。"
          : "方向对了，再看看度数：目标是40°S。";
      const errorGroup = getLatitudeLineGroup(latitude);
      errorGroup?.classList.remove("is-error-flash");
      window.requestAnimationFrame(() => errorGroup?.classList.add("is-error-flash"));
      window.setTimeout(() => errorGroup?.classList.remove("is-error-flash"), 620);
      setLatitudeCopy({
        prompt: "校准1：请找到 40°S。",
        feedback: latitudeTaskState.calibration1Errors === 1
          ? firstErrorFeedback
          : "S表示南纬；找到赤道以南的40°纬线。",
      });
      return;
    }

    latitudeTaskState.phase = "calibration-1-complete";
    latitudeTaskState.calibration1Complete = true;
    setLatitudeLineInteraction(false);
    getLatitudeLineGroup(-40)?.classList.add("is-calibration-target");
    showLatitudeDegree(-40, "ns");
    setLatitudeCopy({ feedback: "40°S，定位匹配。" });
    updateCheckpoint("latitude-calibration-1-complete");
    window.setTimeout(startLatitudeCalibrationTwo, 1750);
  }

  latitudeTeachingLines.addEventListener("click", (event) => {
    const hitArea = event.target.closest(".latitude-line-hit");
    if (!hitArea) return;
    const latitude = Number(hitArea.closest(".latitude-line-group")?.dataset.latitude);
    if (Number.isFinite(latitude)) handleLatitudeLineSelection(latitude);
  });

  latitudeTeachingLines.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const group = event.target.closest(".latitude-line-group.is-interactive");
    if (!group) return;
    event.preventDefault();
    const latitude = Number(group.dataset.latitude);
    if (Number.isFinite(latitude)) handleLatitudeLineSelection(latitude);
  });

  latitudeActions.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-latitude-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.latitudeAction;

    if (
      (action === "task4-answer-can" || action === "task4-answer-cannot")
      && task4LatitudeState.phase === "WAITING_JUDGMENT"
    ) {
      void showTask4LatitudeEvidence(action === "task4-answer-can" ? "can" : "cannot");
      return;
    }

    if (action === "task4-show-limitation" && task4LatitudeState.phase === "SHOWING_CANDIDATES") {
      showTask4LatitudeLimitation();
      return;
    }

    if (
      action === "task4-continue-east-prompt"
      && task4LatitudeState.phase === "ONE_DIRECTION_LIMIT_FOUND"
    ) {
      void finishTask4LatitudeBranch();
      return;
    }

    if (action === "continue-after-equator" && latitudeTaskState.phase === "equator-confirmed") {
      setLatitudeActions();
      updateCheckpoint("latitude-equator-found");
      showLatitudeExplorationChoices();
      return;
    }

    if (action === "explore-north" || action === "explore-south") {
      const direction = action === "explore-north" ? "north" : "south";
      if (latitudeTaskState.phase === "choose-direction") {
        void exploreLatitudeDirection(direction);
      }
      return;
    }

    if (action === "establish-ns" && latitudeTaskState.phase === "both-sides-question") {
      void establishLatitudeNotation();
      return;
    }

    if (action === "show-latitude-conclusion" && latitudeTaskState.phase === "ns-established") {
      setLatitudeActions();
      showLatitudeConclusion();
      return;
    }

    if (action === "start-calibration-1" && latitudeTaskState.nsEstablished) {
      startLatitudeCalibrationOne();
      return;
    }

    if (action === "complete-calibration" && latitudeTaskState.phase === "calibration-summary") {
      void completeLatitudeTask();
      return;
    }

    if (latitudeTaskState.phase !== "calibration-2") return;
    if (action === "answer-60-s") {
      latitudeTaskState.calibration2Errors += 1;
      setLatitudeCopy({
        prompt: "图中高亮的这条纬线的纬度是多少？",
        feedback: latitudeTaskState.calibration2Errors === 1
          ? "高亮的纬线在赤道以北，再判断应该用N还是S。"
          : "赤道以北是北纬，用N表示。",
      });
      return;
    }

    if (action === "answer-60-n") {
      latitudeTaskState.phase = "calibration-2-complete";
      latitudeTaskState.calibration2Complete = true;
      getLatitudeLineGroup(60)?.classList.remove("is-calibration-pulse");
      showLatitudeDegree(60, "ns");
      setLatitudeActions();
      setLatitudeCopy({
        prompt: "图中高亮的这条纬线的纬度是多少？",
        feedback: "判断正确，这是60°N。",
      });
      window.setTimeout(() => showLatitudeCalibrationSummary(), 1750);
    }
  });

  longitudeIntroStart.addEventListener("click", () => {
    void startLongitudeTask();
  });

  function flashLongitudeError(longitude) {
    const group = getLongitudeLineGroup(longitude);
    group?.classList.remove("is-error-flash");
    window.requestAnimationFrame(() => group?.classList.add("is-error-flash"));
    window.setTimeout(() => group?.classList.remove("is-error-flash"), 620);
  }

  function handleLongitudeLineSelection(longitude) {
    if (handleTask4LongitudeSelection(longitude)) return;
    const normalized = canonicalLongitude(longitude);
    if (longitudeTaskState.phase === "zero-question") {
      if (longitudeTaskState.zeroAttemptValues.includes(normalized)) {
        setLongitudeCopy({
          prompt: "再换一条经线看看。",
          feedback: "请点击另一条经线进行比较。",
        });
        return;
      }

      longitudeTaskState.zeroAttempts += 1;
      longitudeTaskState.zeroAttemptValues.push(normalized);
      getLongitudeLineGroup(normalized)?.classList.add("is-attempted");
      if (longitudeTaskState.zeroAttempts === 1) {
        setLongitudeCopy({
          prompt: "再换一条经线看看。",
          feedback: "这条经线与其他经线没有什么不同，长度都是相等的。",
        });
        updateCheckpoint("longitude-one-zero-attempt");
        return;
      }

      updateCheckpoint("longitude-zero-conflict-complete");
      showLongitudeZeroConflict();
      return;
    }

    if (longitudeTaskState.phase !== "longitude-calibration-1") return;
    if (normalized !== -60) {
      longitudeTaskState.calibration1Errors += 1;
      flashLongitudeError(normalized);
      let firstFeedback = "W表示西经；找到本初子午线以西的60°经线。";
      if (normalized > 0 && normalized < 180) {
        firstFeedback = "目标是60°W，先看看它在本初子午线的哪一边。";
      } else if (normalized === 0) {
        firstFeedback = "60°W在本初子午线以西。";
      } else if (normalized < 0 && normalized > -180) {
        firstFeedback = "方向对了，再看看度数：目标是60°W。";
      }
      setLongitudeCopy({
        prompt: "校准1：请找到 60°W。",
        feedback: longitudeTaskState.calibration1Errors === 1
          ? firstFeedback
          : "W表示西经；找到本初子午线以西的60°经线。",
      });
      return;
    }

    longitudeTaskState.phase = "longitude-calibration-1-complete";
    longitudeTaskState.calibration1Complete = true;
    setLongitudeLineInteraction(false);
    getLongitudeLineGroup(-60)?.classList.add("is-calibration-target");
    showLongitudeLabel("west", 60, "ew");
    setLongitudeCopy({ feedback: "60°W，定位匹配。" });
    updateCheckpoint("longitude-calibration-1-complete");
    window.setTimeout(() => void startLongitudeCalibrationTwo(), 1750);
  }

  longitudeTeachingLines.addEventListener("click", (event) => {
    if (longitudeDragState.suppressClick) return;
    if (longitudeStage.classList.contains("is-draggable")) return;
    const hitArea = event.target.closest(".longitude-line-hit, .longitude-line-hit-node");
    if (!hitArea) return;
    const longitude = Number(hitArea.closest(".longitude-line-group")?.dataset.longitude);
    if (Number.isFinite(longitude)) handleLongitudeLineSelection(longitude);
  });

  longitudeTeachingLines.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const group = event.target.closest(".longitude-line-group.is-interactive");
    if (!group) return;
    event.preventDefault();
    const longitude = Number(group.dataset.longitude);
    if (Number.isFinite(longitude)) handleLongitudeLineSelection(longitude);
  });

  longitudeGlobe.addEventListener("pointerdown", (event) => {
    if (!longitudeStage.classList.contains("is-draggable")) return;
    longitudeDragState.active = true;
    longitudeDragState.pointerId = event.pointerId;
    longitudeDragState.startX = event.clientX;
    longitudeDragState.startY = event.clientY;
    longitudeDragState.startRotation = longitudeTeachingModel.rotation.y;
    const targetGroup = event.target.closest(".longitude-line-hit, .longitude-line-hit-node")
      ?.closest(".longitude-line-group");
    longitudeDragState.targetLongitude = targetGroup
      ? Number(targetGroup.dataset.longitude)
      : null;
    longitudeDragState.moved = false;
    longitudeDragState.suppressClick = false;
    longitudeGlobe.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  longitudeGlobe.addEventListener("pointermove", (event) => {
    if (!longitudeDragState.active || event.pointerId !== longitudeDragState.pointerId) return;
    const deltaX = event.clientX - longitudeDragState.startX;
    const deltaY = event.clientY - longitudeDragState.startY;
    if (Math.hypot(deltaX, deltaY) > 7) longitudeDragState.moved = true;
    if (longitudeDragState.moved) {
      longitudeTeachingModel.rotation.y = longitudeDragState.startRotation + deltaX * 0.34;
      updateLongitudeTeachingGeometry();
    }
    event.preventDefault();
  });

  function finishLongitudeDrag(event, allowSelection = true) {
    if (!longitudeDragState.active || event.pointerId !== longitudeDragState.pointerId) return;
    const selectedLongitude = longitudeDragState.targetLongitude;
    const wasDrag = longitudeDragState.moved;
    longitudeDragState.active = false;
    longitudeDragState.pointerId = null;
    longitudeDragState.targetLongitude = null;
    longitudeDragState.suppressClick = true;
    if (longitudeGlobe.hasPointerCapture?.(event.pointerId)) {
      longitudeGlobe.releasePointerCapture(event.pointerId);
    }
    if (allowSelection && !wasDrag && Number.isFinite(selectedLongitude)) {
      handleLongitudeLineSelection(selectedLongitude);
    }
    window.setTimeout(() => {
      longitudeDragState.suppressClick = false;
    }, 0);
  }

  longitudeGlobe.addEventListener("pointerup", (event) => finishLongitudeDrag(event));
  longitudeGlobe.addEventListener("pointercancel", (event) => finishLongitudeDrag(event, false));

  longitudeActions.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-longitude-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.longitudeAction;

    if (
      (action === "task4-longitude-answer-can" || action === "task4-longitude-answer-cannot")
      && task4LongitudeState.phase === "WAITING_JUDGMENT"
    ) {
      void showTask4LongitudeEvidence(action === "task4-longitude-answer-can" ? "can" : "cannot");
      return;
    }
    if (
      action === "task4-longitude-show-limitation"
      && task4LongitudeState.phase === "SHOWING_CANDIDATES"
    ) {
      showTask4LongitudeLimitation();
      return;
    }
    if (action === "task4-finish-longitude" && task4LongitudeState.phase === "ONE_DIRECTION_LIMIT_FOUND") {
      void finishTask4LongitudeBranch();
      return;
    }

    if (action === "reveal-prime" && longitudeTaskState.phase === "zero-conflict") {
      void revealPrimeMeridian();
      return;
    }
    if (action === "continue-after-prime" && longitudeTaskState.phase === "prime-established") {
      setLongitudeActions();
      showLongitudeExplorationChoices();
      return;
    }
    if (action === "explore-east" || action === "explore-west") {
      if (longitudeTaskState.phase === "choose-direction") {
        void exploreLongitudeDirection(action === "explore-east" ? "east" : "west");
      }
      return;
    }
    if (action === "establish-ew" && longitudeTaskState.phase === "both-sides-question") {
      void establishLongitudeNotation();
      return;
    }
    if (action === "show-longitude-conclusion" && longitudeTaskState.phase === "ew-established") {
      setLongitudeActions();
      showLongitudeConclusion();
      return;
    }
    if (action === "start-longitude-calibration-1" && longitudeTaskState.ewEstablished) {
      startLongitudeCalibrationOne();
      return;
    }
    if (
      action === "complete-longitude-calibration"
      && longitudeTaskState.phase === "longitude-calibration-summary"
    ) {
      void completeLongitudeTask();
      return;
    }
    if (longitudeTaskState.phase !== "longitude-calibration-2") return;
    if (action === "answer-150-w") {
      longitudeTaskState.calibration2Errors += 1;
      setLongitudeCopy({
        prompt: "图中高亮的这条经线的经度是多少？",
        feedback: longitudeTaskState.calibration2Errors === 1
          ? "高亮的经线在本初子午线以东，再判断应该用E还是W。"
          : "本初子午线以东是东经，用E表示。",
      });
      return;
    }
    if (action === "answer-150-e") {
      longitudeTaskState.phase = "longitude-calibration-2-complete";
      longitudeTaskState.calibration2Complete = true;
      getLongitudeLineGroup(150)?.classList.remove("is-calibration-pulse");
      const targetLabel = getLongitudeDegreeLabel("east", 150);
      targetLabel?.classList.remove("is-target-hidden");
      targetLabel?.classList.add("is-visible");
      targetLabel?.setAttribute("aria-hidden", "false");
      setLongitudeActions();
      setLongitudeCopy({
        prompt: "图中高亮的这条经线的经度是多少？",
        feedback: "判断正确，这是150°E。",
      });
      window.setTimeout(() => showLongitudeCalibrationSummary(), 1750);
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
    soundToggle.setAttribute("aria-label", isMuted ? "音效已开启" : "音效已关闭");
    if (isMuted) {
      const context = getAudioContext();
      if (context?.state === "suspended") {
        context.resume().catch(() => {});
      }
      return;
    }
    stopSoundEffects();
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button && button !== deviceDock) playSoundEffect("button");
  });
  document.addEventListener("pointerdown", unlockRecordAudio);
  document.addEventListener("keydown", unlockRecordAudio);

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
      return;
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
