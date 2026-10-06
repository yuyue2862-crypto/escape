(() => {
  "use strict";

  const BEIJING = Object.freeze({ id: "beijing", latitude: 40, longitude: 116, label: "北京", type: "target" });
  const BEIJING_TOLERANCE_DEGREES = 6;
  const radians = (angle) => angle * Math.PI / 180;

  function angularDistance(first, second) {
    const latitudeDifference = radians(second.latitude - first.latitude);
    const longitudeDifference = radians(second.longitude - first.longitude);
    const haversine = Math.sin(latitudeDifference / 2) ** 2
      + Math.cos(radians(first.latitude)) * Math.cos(radians(second.latitude))
        * Math.sin(longitudeDifference / 2) ** 2;
    return 2 * Math.asin(Math.min(1, Math.sqrt(haversine))) * 180 / Math.PI;
  }

  function create({ stage, globeMount, globeConfig = {}, onViewChange = null, onSurfaceSelect = null, onCheckpoint = null } = {}) {
    let globe = null;
    let phase = "idle";
    let destroyed = false;
    let statusNode = null;
    let feedbackNode = null;

    const assertActive = () => {
      if (destroyed) throw new Error("Task four flow has been destroyed.");
    };

    const ensureStatus = () => {
      if (statusNode || !stage?.ownerDocument) return;
      statusNode = stage.ownerDocument.createElement("div");
      statusNode.className = "task4-stage__status";
      const titleNode = stage.ownerDocument.createElement("p");
      titleNode.className = "task4-stage__title";
      titleNode.textContent = "定位任务";
      const targetNode = stage.ownerDocument.createElement("div");
      targetNode.className = "task4-stage__target";
      ["目标：", "北京", "坐标：", "纬度：40°N", "经度：116°E"].forEach((text) => {
        const line = stage.ownerDocument.createElement("p");
        line.textContent = text;
        targetNode.append(line);
      });
      feedbackNode = stage.ownerDocument.createElement("p");
      feedbackNode.className = "task4-stage__feedback";
      feedbackNode.setAttribute("aria-live", "polite");
      statusNode.append(titleNode, targetNode, feedbackNode);
      stage.append(statusNode);
    };

    const setFeedback = (lines = []) => {
      if (!feedbackNode) return;
      feedbackNode.replaceChildren(...lines.map((text) => {
        const line = feedbackNode.ownerDocument.createElement("span");
        line.textContent = text;
        return line;
      }));
    };

    const handleSurfaceSelection = (coordinate) => {
      if (phase !== "ready") return;
      if (angularDistance(coordinate, BEIJING) <= BEIJING_TOLERANCE_DEGREES) {
        phase = "located";
        setFeedback(["定位成功！", "北京坐标已锁定", "40°N，116°E"]);
        globe.addMarker(BEIJING);
        globe.setMode("rotate");
      } else {
        setFeedback(["位置不正确，请根据经纬度继续寻找。"]);
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

      start() {
        assertActive();
        const activeGlobe = ensureGlobe();
        ensureStatus();
        phase = "ready";
        activeGlobe.clearMarkers();
        activeGlobe.clearSelection();
        setFeedback();
        activeGlobe.setMode("interactive");
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
        return {
          phase,
          globe: globe?.getState() || null,
          destroyed,
        };
      },

      destroy() {
        if (destroyed) return;
        globe?.destroy();
        globe = null;
        statusNode?.remove();
        statusNode = null;
        feedbackNode = null;
        stage?.setAttribute("aria-hidden", "true");
        stage?.setAttribute("hidden", "");
        destroyed = true;
      },
    });
  }

  window.Task4Flow = Object.freeze({ create });
})();
