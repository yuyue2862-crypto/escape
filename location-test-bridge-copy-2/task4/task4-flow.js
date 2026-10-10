(() => {
  "use strict";

  const LOCATION_TASKS = Object.freeze([
    Object.freeze({ id: "beijing", name: "北京", label: "北京", latitude: 40, longitude: 116, type: "target", accurateToleranceDegrees: 1.5, basicToleranceDegrees: 3 }),
    Object.freeze({ id: "rio-de-janeiro", name: "里约热内卢", label: "里约热内卢", latitude: -23, longitude: -43, type: "target", accurateToleranceDegrees: 1.5, basicToleranceDegrees: 3 }),
    Object.freeze({ id: "zhuhai", name: "珠海", label: "珠海", latitude: 22.27, longitude: 113.58, type: "target", accurateToleranceDegrees: 1.5, basicToleranceDegrees: 3 }),
  ]);
  const TARGET_TYPING_INTERVAL = 30;
  const TARGET_LINE_DELAY = 90;
  const TARGET_REVEAL_DELAY = 2000;
  const TARGET_TYPING_SOUND_PEAK = 0.028;
  const NEXT_TASK_DELAY = 1400;
  const radians = (angle) => angle * Math.PI / 180;

  function angularDistance(first, second) {
    const latitudeDifference = radians(second.latitude - first.latitude);
    const longitudeDifference = radians(second.longitude - first.longitude);
    const haversine = Math.sin(latitudeDifference / 2) ** 2
      + Math.cos(radians(first.latitude)) * Math.cos(radians(second.latitude))
        * Math.sin(longitudeDifference / 2) ** 2;
    return 2 * Math.asin(Math.min(1, Math.sqrt(haversine))) * 180 / Math.PI;
  }

  const formatLatitude = (latitude) => `${Math.abs(latitude)}°${latitude >= 0 ? "N" : "S"}`;
  const formatLongitude = (longitude) => `${Math.abs(longitude)}°${longitude >= 0 ? "E" : "W"}`;

  function create({ stage, globeMount, globeConfig = {}, taskIds = null, onViewChange = null, onSurfaceSelect = null, onCheckpoint = null } = {}) {
    const requestedTaskIds = Array.isArray(taskIds) && taskIds.length ? new Set(taskIds) : null;
    const locationTasks = requestedTaskIds
      ? LOCATION_TASKS.filter((task) => requestedTaskIds.has(task.id))
      : [...LOCATION_TASKS];
    if (!locationTasks.length) throw new Error("Task four requires at least one location task.");
    let globe = null;
    let phase = "idle";
    let destroyed = false;
    let statusNode = null;
    let instructionNode = null;
    let targetNode = null;
    let feedbackNode = null;
    let currentTaskIndex = 0;
    let nextTaskTimer = null;
    let typingTimer = null;
    let targetRevealTimer = null;
    let typingToken = 0;
    let typingAudioContext = null;

    const assertActive = () => {
      if (destroyed) throw new Error("Task four flow has been destroyed.");
    };

    const ensureStatus = () => {
      if (statusNode || !stage?.ownerDocument) return;
      statusNode = stage.ownerDocument.createElement("div");
      statusNode.className = "task4-stage__status";
      const titleNode = stage.ownerDocument.createElement("p");
      titleNode.className = "task4-stage__title";
      titleNode.textContent = "定位测试";
      instructionNode = stage.ownerDocument.createElement("p");
      instructionNode.className = "task4-stage__instruction";
      targetNode = stage.ownerDocument.createElement("div");
      targetNode.className = "task4-stage__target";
      feedbackNode = stage.ownerDocument.createElement("p");
      feedbackNode.className = "task4-stage__feedback";
      feedbackNode.setAttribute("aria-live", "polite");
      statusNode.append(titleNode, instructionNode, targetNode, feedbackNode);
      stage.append(statusNode);
    };

    const getCurrentTask = () => locationTasks[currentTaskIndex];

    const stopNextTaskTimer = () => {
      if (nextTaskTimer !== null) window.clearTimeout(nextTaskTimer);
      nextTaskTimer = null;
    };

    const renderTaskInstruction = () => {
      if (!instructionNode) return;
      const task = getCurrentTask();
      instructionNode.replaceChildren(
        "请根据经纬度，",
        instructionNode.ownerDocument.createElement("br"),
        `在球面上点击${task.name}的坐标位置。`,
      );
    };

    const stopTargetTyping = () => {
      typingToken += 1;
      if (typingTimer !== null) window.clearTimeout(typingTimer);
      if (targetRevealTimer !== null) window.clearTimeout(targetRevealTimer);
      typingTimer = null;
      targetRevealTimer = null;
      targetNode?.classList.remove("is-typing");
      targetNode?.classList.remove("is-pending");
    };

    const getTypingAudioContext = () => {
      if (typingAudioContext) return typingAudioContext;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      typingAudioContext = new AudioContextClass();
      return typingAudioContext;
    };

    const prepareTargetTypingAudio = () => {
      if (stage?.ownerDocument.querySelector("#soundToggle")?.getAttribute("aria-pressed") === "true") return null;
      const context = getTypingAudioContext();
      if (context?.state === "suspended") {
        context.resume().catch(() => {});
      }
      return context;
    };

    const playTargetTypingTick = (characterIndex) => {
      if (characterIndex % 2 !== 0 || stage?.ownerDocument.querySelector("#soundToggle")?.getAttribute("aria-pressed") === "true") return;
      const context = prepareTargetTypingAudio();
      if (!context || context.state !== "running") return;
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(520, now);
      oscillator.frequency.exponentialRampToValueAtTime(430, now + 0.035);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(TARGET_TYPING_SOUND_PEAK, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.06);
    };

    const startTargetTyping = () => {
      if (!targetNode) return;
      prepareTargetTypingAudio();
      stopTargetTyping();
      const token = ++typingToken;
      let characterIndex = 0;
      let lineIndex = 0;
      let characterOffset = 0;
      targetNode.replaceChildren();
      const task = getCurrentTask();
      const targetInfoLines = [
        `目标${currentTaskIndex + 1}：${task.name}`,
        `坐标：纬度\u00a0\u00a0${formatLatitude(task.latitude)}，经度\u00a0\u00a0${formatLongitude(task.longitude)}`,
      ];
      const lines = targetInfoLines.map((text) => {
        const node = targetNode.ownerDocument.createElement("p");
        targetNode.append(node);
        return { node, text };
      });

      const writeNextCharacter = () => {
        if (destroyed || token !== typingToken) return;
        const line = lines[lineIndex];
        if (characterOffset < line.text.length) {
          line.node.textContent += line.text[characterOffset];
          playTargetTypingTick(characterIndex);
          characterOffset += 1;
          characterIndex += 1;
          typingTimer = window.setTimeout(writeNextCharacter, TARGET_TYPING_INTERVAL);
          return;
        }
        lineIndex += 1;
        characterOffset = 0;
        if (lineIndex < lines.length) {
          typingTimer = window.setTimeout(writeNextCharacter, TARGET_LINE_DELAY);
          return;
        }
        typingTimer = null;
        targetNode.classList.remove("is-typing");
      };

      targetNode.classList.add("is-pending");
      targetRevealTimer = window.setTimeout(() => {
        targetRevealTimer = null;
        if (destroyed || token !== typingToken) return;
        targetNode.classList.remove("is-pending");
        targetNode.classList.add("is-typing");
        writeNextCharacter();
      }, TARGET_REVEAL_DELAY);
    };

    const setFeedback = (lines = [], { success = false } = {}) => {
      if (!feedbackNode) return;
      feedbackNode.classList.remove("is-success");
      feedbackNode.replaceChildren(...lines.map((text) => {
        const line = feedbackNode.ownerDocument.createElement("span");
        line.textContent = text;
        return line;
      }));
      if (success && lines.length) {
        window.requestAnimationFrame(() => feedbackNode?.classList.add("is-success"));
      }
    };

    const activateLocationTask = (taskIndex) => {
      stopNextTaskTimer();
      currentTaskIndex = taskIndex;
      phase = "ready";
      globe.clearSelection();
      setFeedback();
      renderTaskInstruction();
      startTargetTyping();
      globe.setMode("interactive");
    };

    const getPrecisionThresholds = () => {
      const task = getCurrentTask();
      const scale = globe.getScale();
      return {
        accurate: task.accurateToleranceDegrees / scale,
        basic: task.basicToleranceDegrees / scale,
      };
    };

    const handleSurfaceSelection = (coordinate) => {
      if (phase !== "ready") return;
      const task = getCurrentTask();
      const errorDegrees = angularDistance(coordinate, task);
      const thresholds = getPrecisionThresholds();
      const accuracyLevel = errorDegrees <= thresholds.accurate
        ? "accurate"
        : errorDegrees <= thresholds.basic
          ? "basic"
          : "adjust";

      if (accuracyLevel !== "adjust") {
        phase = "located";
        setFeedback([accuracyLevel === "accurate" ? "定位准确！" : "定位基本准确！"], { success: true });
        globe.addMarker(task);
        globe.setMode("rotate");
        if (currentTaskIndex < locationTasks.length - 1) {
          nextTaskTimer = window.setTimeout(() => {
            nextTaskTimer = null;
            if (!destroyed) activateLocationTask(currentTaskIndex + 1);
          }, NEXT_TASK_DELAY);
        }
      } else {
        setFeedback(["偏差较大，请继续调整。"]);
      }
    };

    const ensureGlobe = () => {
      if (globe) return globe;
      if (!window.Task4RealEarthGlobe) {
        throw new Error("Task four globe component is unavailable.");
      }
      globe = window.Task4RealEarthGlobe.create({
        mount: globeMount,
        config: globeConfig,
        onViewChange: (view) => {
          onViewChange?.({ ...view });
        },
        onSurfaceSelect: (coordinate) => {
          handleSurfaceSelection(coordinate);
          onSurfaceSelect?.({ ...coordinate });
        },
      });
      globe.create();
      return globe;
    };

    return Object.freeze({
      initialize() {
        assertActive();
        ensureGlobe();
        ensureStatus();
        return this;
      },

      start({ taskId = null } = {}) {
        assertActive();
        const activeGlobe = ensureGlobe();
        ensureStatus();
        stopNextTaskTimer();
        const requestedTaskIndex = taskId
          ? locationTasks.findIndex((task) => task.id === taskId)
          : -1;
        currentTaskIndex = requestedTaskIndex >= 0 ? requestedTaskIndex : 0;
        activeGlobe.clearMarkers();
        activateLocationTask(currentTaskIndex);
        stage?.setAttribute("aria-hidden", "false");
        stage?.removeAttribute("hidden");
      },

      setGlobeMode(mode) {
        assertActive();
        ensureGlobe().setMode(mode);
      },

      setGlobeView(view) {
        assertActive();
        ensureGlobe().setView(view);
      },

      setGlobeScale(scale) {
        assertActive();
        return ensureGlobe().setScale(scale);
      },

      getGlobeScale() {
        assertActive();
        return ensureGlobe().getScale();
      },

      addGlobeMarker(marker) {
        assertActive();
        return ensureGlobe().addMarker(marker);
      },

      clearGlobeMarkers() {
        assertActive();
        ensureGlobe().clearMarkers();
      },

      projectCoordinate(coordinate) {
        assertActive();
        return ensureGlobe().projectCoordinate(coordinate);
      },

      getCoordinateAt(clientX, clientY) {
        assertActive();
        return ensureGlobe().getCoordinateAt(clientX, clientY);
      },

      saveCheckpoint(snapshot) {
        assertActive();
        onCheckpoint?.(snapshot);
      },

      getState() {
        const task = getCurrentTask();
        const precisionThresholds = globe ? getPrecisionThresholds() : null;
        return {
          phase,
          currentTask: {
            index: currentTaskIndex,
            total: locationTasks.length,
            id: task.id,
            name: task.name,
            precisionThresholds,
          },
          globe: globe?.getState() || null,
          destroyed,
        };
      },

      destroy() {
        if (destroyed) return;
        stopNextTaskTimer();
        globe?.destroy();
        globe = null;
        stopTargetTyping();
        statusNode?.remove();
        statusNode = null;
        instructionNode = null;
        targetNode = null;
        feedbackNode = null;
        stage?.setAttribute("aria-hidden", "true");
        stage?.setAttribute("hidden", "");
        destroyed = true;
      },
    });
  }

  window.Task4Flow = Object.freeze({ create });
})();
