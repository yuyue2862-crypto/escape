(() => {
  "use strict";

  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const DEFAULT_VIEW = Object.freeze({ latitude: 0, longitude: 0, rotation: 0 });
  const VALID_MODES = new Set(["idle", "view", "rotate", "select", "interactive"]);
  const MIN_SCALE = 0.6;
  const DEFAULT_MAX_SCALE = 2;
  const MAX_CONFIGURABLE_SCALE = 8;
  const LATITUDE_LABEL_VALUES = Object.freeze([-90, -80, -60, -40, -20, 0, 20, 40, 60, 80, 90]);
  const LATITUDE_LABEL_MERIDIANS = Object.freeze([0, 180]);
  // -180 and 180 are the same meridian, so it is intentionally represented once.
  const LONGITUDE_LABEL_VALUES = Object.freeze([-180, -150, -120, -90, -60, -30, 30, 60, 90, 120, 150]);
  const LABEL_MINIMUM_DEPTH = 0.08;
  const DEFAULT_CONFIG = Object.freeze({
    size: "min(76vh, 52rem, 92vw)",
    viewBoxSize: 640,
    center: [0.5, 0.5],
    radiusRatio: 0.4,
    longitudeStep: 30,
    latitudeStep: 20,
    sampleStep: 2,
    maxTilt: 75,
    dragSensitivity: 1,
    dragThreshold: 5,
    pointRadiusRatio: 0.006,
    labelFontSize: "clamp(18px, 1.4vw, 28px)",
    coordinateLabelFontSize: "clamp(12px, 1vw, 18px)",
  });

  // The data module is loaded before this component. Its outline coordinates
  // use Natural Earth's conventional [longitude, latitude] order.
  const NATURAL_EARTH_LAND_OUTLINES = window.Task4NaturalEarthLand || Object.freeze([]);
  let instanceSequence = 0;

  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
  const radians = (angle) => angle * Math.PI / 180;
  const degrees = (angle) => angle * 180 / Math.PI;
  const dot = (left, right) => left.reduce((sum, value, index) => sum + value * right[index], 0);
  const normalizeLongitude = (longitude) => ((longitude + 180) % 360 + 360) % 360 - 180;

  function numberInRange(value, minimum, maximum, name) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < minimum || number > maximum) throw new TypeError(`Invalid globe ${name}.`);
    return number;
  }

  function normalizeConfig(options) {
    const config = { ...DEFAULT_CONFIG, ...options };
    config.viewBoxSize = numberInRange(config.viewBoxSize, 100, 4096, "viewBoxSize");
    config.radiusRatio = numberInRange(config.radiusRatio, 0.1, 0.48, "radiusRatio");
    config.longitudeStep = numberInRange(config.longitudeStep, 5, 180, "longitudeStep");
    config.latitudeStep = numberInRange(config.latitudeStep, 5, 90, "latitudeStep");
    config.sampleStep = numberInRange(config.sampleStep, 0.5, 5, "sampleStep");
    config.maxTilt = numberInRange(config.maxTilt, 0, 85, "maxTilt");
    config.dragSensitivity = numberInRange(config.dragSensitivity, 0.1, 3, "dragSensitivity");
    config.dragThreshold = numberInRange(config.dragThreshold, 0, 30, "dragThreshold");
    config.pointRadiusRatio = numberInRange(config.pointRadiusRatio, 0.002, 0.02, "pointRadiusRatio");
    if (!Array.isArray(config.center) || config.center.length !== 2) throw new TypeError("Globe center must contain two relative coordinates.");
    config.center = config.center.map((value) => numberInRange(value, config.radiusRatio, 1 - config.radiusRatio, "center"));
    config.size = typeof config.size === "number" ? `${config.size}px` : String(config.size);
    config.labelFontSize = typeof config.labelFontSize === "number" ? `${config.labelFontSize}px` : String(config.labelFontSize);
    config.coordinateLabelFontSize = typeof config.coordinateLabelFontSize === "number"
      ? `${config.coordinateLabelFontSize}px`
      : String(config.coordinateLabelFontSize);
    return Object.freeze(config);
  }

  function normalizeCoordinate(coordinate) {
    const latitude = numberInRange(coordinate.latitude, -90, 90, "latitude");
    const longitude = Number(coordinate.longitude);
    if (!Number.isFinite(longitude)) throw new TypeError("Invalid globe longitude.");
    return { latitude, longitude: normalizeLongitude(longitude) };
  }

  // Paths, picking and the temporary dot share these geographic coordinates.
  function toCartesian({ latitude, longitude }) {
    if (latitude === 90 || latitude === -90) return [0, Math.sign(latitude), 0];
    const phi = radians(latitude);
    const lambda = radians(longitude);
    return [Math.cos(phi) * Math.sin(lambda), Math.sin(phi), Math.cos(phi) * Math.cos(lambda)];
  }

  function createBasis(view) {
    const phi = radians(view.latitude);
    const lambda = radians(view.longitude);
    return {
      east: [Math.cos(lambda), 0, -Math.sin(lambda)],
      north: [-Math.sin(phi) * Math.sin(lambda), Math.cos(phi), -Math.sin(phi) * Math.cos(lambda)],
      front: [Math.cos(phi) * Math.sin(lambda), Math.sin(phi), Math.cos(phi) * Math.cos(lambda)],
    };
  }

  function create({ mount = null, config: options = {}, onViewChange = null, onSurfaceSelect = null } = {}) {
    const config = normalizeConfig(options);
    const radius = config.viewBoxSize * config.radiusRatio;
    const center = config.center.map((value) => value * config.viewBoxSize);
    const prefix = `task4-earth-${++instanceSequence}`;
    const markers = new Map();
    const markerNodes = new Map();
    const grid = [];
    const land = [];
    const coordinateLabels = [];
    let markerSequence = 0;
    let destroyed = false;
    let mode = "idle";
    let scale = 1;
    let maxScale = DEFAULT_MAX_SCALE;
    let view = { ...DEFAULT_VIEW };
    let basis = createBasis(view);
    let svg = null;
    let selectionNode = null;
    let coordinateLabelLayer = null;
    let markerLayer = null;
    let selectedCoordinate = null;
    let drag = null;
    let pinch = null;
    const touchPointers = new Map();
    let previousSize = "";

    const assertActive = () => {
      if (destroyed) throw new Error("Task four globe has been destroyed.");
    };
    const getOverlayScale = () => Math.min(1, DEFAULT_MAX_SCALE / scale);
    const element = (tag, attributes = {}) => {
      const node = mount.ownerDocument.createElementNS(SVG_NAMESPACE, tag);
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
      return node;
    };

    function projectWorld(world) {
      const depth = dot(world, basis.front);
      return {
        x: center[0] + radius * dot(world, basis.east),
        y: center[1] - radius * dot(world, basis.north),
        depth: Math.abs(depth) < 1e-12 ? 0 : depth,
        visible: depth >= -1e-12,
      };
    }

    function projectCoordinate(coordinate) {
      return projectWorld(toCartesian(normalizeCoordinate(coordinate)));
    }

    function buildCurve(parent, kind, value, start, end) {
      const pointAt = kind === "latitude"
        ? (longitude) => toCartesian({ latitude: value, longitude })
        : (latitude) => toCartesian({ latitude, longitude: value });
      const steps = Math.ceil((end - start) / config.sampleStep);
      const samples = Array.from({ length: steps + 1 }, (_, index) => {
        const parameter = start + (end - start) * index / steps;
        return { parameter, world: pointAt(parameter) };
      });
      const path = element("path", {
        class: `task4-real-earth__grid-line task4-real-earth__grid-line--${kind}`,
        "data-value": value,
      });
      parent.append(path);
      grid.push({ path, pointAt, samples, closed: kind === "latitude" });
    }

    function interpolateGeographicPoint(from, to, progress) {
      const longitudeDifference = normalizeLongitude(to[0] - from[0]);
      return {
        latitude: from[1] + (to[1] - from[1]) * progress,
        longitude: normalizeLongitude(from[0] + longitudeDifference * progress),
      };
    }

    function createOutlineSamples(outline) {
      const samples = [];
      for (let index = 0; index < outline.length; index += 1) {
        const from = outline[index];
        const to = outline[(index + 1) % outline.length];
        const latitudeDistance = Math.abs(to[1] - from[1]);
        const longitudeDistance = Math.abs(normalizeLongitude(to[0] - from[0]));
        const steps = Math.max(1, Math.ceil(Math.max(latitudeDistance, longitudeDistance) / config.sampleStep));
        for (let step = 0; step < steps; step += 1) {
          samples.push(toCartesian(interpolateGeographicPoint(from, to, step / steps)));
        }
      }
      return samples;
    }

    function outlineDirection(outline) {
      const firstLongitude = outline[0][0];
      let longitude = firstLongitude;
      let signedArea = 0;
      for (let index = 1; index < outline.length; index += 1) {
        const nextLongitude = longitude + normalizeLongitude(outline[index][0] - outline[index - 1][0]);
        signedArea += longitude * outline[index][1] - nextLongitude * outline[index - 1][1];
        longitude = nextLongitude;
      }
      // A polar outline can wind through a full 360° in unwrapped longitude.
      // Close its planar area against the original first point, not the
      // numerically equivalent point at firstLongitude ± 360°.
      signedArea += longitude * outline[0][1] - firstLongitude * outline.at(-1)[1];
      // Orthographic projection preserves this orientation on the front face.
      return signedArea < 0 ? -1 : 1;
    }

    function buildLandMass(parent, outline, index) {
      const path = element("path", {
        class: "task4-real-earth__landmass",
        "data-land-outline": index,
      });
      parent.append(path);
      land.push({ parent, index, paths: [path], direction: outlineDirection(outline), samples: createOutlineSamples(outline) });
    }

    function limbIntersection(curve, from, to) {
      let low = from.parameter;
      let high = to.parameter;
      const lowIsFront = projectWorld(from.world).visible;
      for (let index = 0; index < 28; index += 1) {
        const middle = (low + high) / 2;
        if (projectWorld(curve.pointAt(middle)).visible === lowIsFront) low = middle;
        else high = middle;
      }
      return projectWorld(curve.pointAt((low + high) / 2));
    }

    function renderCurve(curve) {
      const commands = [];
      const append = (command, point) => commands.push(`${command}${point.x.toFixed(4)},${point.y.toFixed(4)}`);
      let previous = curve.samples[0];
      let previousPoint = projectWorld(previous.world);
      let allFront = previousPoint.visible;
      if (previousPoint.visible) append("M", previousPoint);
      for (const sample of curve.samples.slice(1)) {
        const point = projectWorld(sample.world);
        if (previousPoint.visible && point.visible) append("L", point);
        else if (previousPoint.visible && !point.visible) append("L", limbIntersection(curve, previous, sample));
        else if (!previousPoint.visible && point.visible) {
          append("M", limbIntersection(curve, previous, sample));
          append("L", point);
        }
        allFront = allFront && point.visible;
        previous = sample;
        previousPoint = point;
      }
      if (curve.closed && allFront) commands.push("Z");
      curve.path.setAttribute("d", commands.join(" "));
    }

    function limbIntersectionWorld(from, to) {
      let low = 0;
      let high = 1;
      const lowIsFront = projectWorld(from).visible;
      for (let index = 0; index < 28; index += 1) {
        const middle = (low + high) / 2;
        const world = from.map((value, pointIndex) => value + (to[pointIndex] - value) * middle);
        if (projectWorld(world).visible === lowIsFront) low = middle;
        else high = middle;
      }
      return from.map((value, pointIndex) => value + (to[pointIndex] - value) * ((low + high) / 2));
    }

    // Cut the closed coast at every limb crossing. Each visible boundary loop
    // follows real coast segments and then the spherical limb, never a chord
    // connecting coast sections that are separated by the back hemisphere.
    function renderLandMass(mass) {
      const projected = mass.samples.map(projectWorld);
      const firstBack = projected.findIndex((point) => !point.visible);
      const output = [];
      const format = (point) => `${point.x.toFixed(4)},${point.y.toFixed(4)}`;

      if (firstBack === -1) {
        output.push(`M${format(projected[0])} ${projected.slice(1).map((point) => `L${format(point)}`).join(" ")} Z`);
      } else {
        const runs = [];
        let currentRun = null;
        let previousIndex = firstBack;
        for (let offset = 1; offset <= projected.length; offset += 1) {
          const index = (firstBack + offset) % projected.length;
          const previousPoint = projected[previousIndex];
          const point = projected[index];
          if (!previousPoint.visible && point.visible) {
            currentRun = [projectWorld(limbIntersectionWorld(mass.samples[previousIndex], mass.samples[index])), point];
          } else if (previousPoint.visible && point.visible) {
            currentRun.push(point);
          } else if (previousPoint.visible && !point.visible) {
            currentRun.push(projectWorld(limbIntersectionWorld(mass.samples[previousIndex], mass.samples[index])));
            runs.push(currentRun);
            currentRun = null;
          }
          previousIndex = index;
        }

        const angleAt = (point) => Math.atan2(center[1] - point.y, point.x - center[0]);
        const onLimb = (point) => {
          const angle = angleAt(point);
          return { x: center[0] + radius * Math.cos(angle), y: center[1] - radius * Math.sin(angle), angle };
        };
        const fullTurn = 2 * Math.PI;
        const angleAlongLimb = (from, to) => {
          const difference = mass.direction < 0 ? from.angle - to.angle : to.angle - from.angle;
          return ((difference % fullTurn) + fullTurn) % fullTurn;
        };
        const entries = runs.map((run) => onLimb(run[0]));
        const exits = runs.map((run) => onLimb(run.at(-1)));
        const limbPosition = (point) => {
          const angle = mass.direction < 0 ? -point.angle : point.angle;
          return ((angle % fullTurn) + fullTurn) % fullTurn;
        };
        const exitOrder = exits.map((_, index) => index).sort((left, right) => limbPosition(exits[left]) - limbPosition(exits[right]));
        const entryOrder = entries.map((_, index) => index).sort((left, right) => limbPosition(entries[left]) - limbPosition(entries[right]));
        // Match limb crossings in circular order. Independent nearest-entry
        // matching can send two exits to one entry near a pole; SVG's final Z
        // would then draw the long chord that caused the triangular artifacts.
        let bestShift = 0;
        let bestDistance = Infinity;
        for (let shift = 0; shift < runs.length; shift += 1) {
          let distance = 0;
          for (let index = 0; index < runs.length; index += 1) {
            const from = exitOrder[index];
            const to = entryOrder[(index + shift) % runs.length];
            distance += angleAlongLimb(exits[from], entries[to]);
          }
          if (distance < bestDistance) {
            bestDistance = distance;
            bestShift = shift;
          }
        }
        const nextRun = Array(runs.length);
        exitOrder.forEach((from, index) => {
          const to = entryOrder[(index + bestShift) % runs.length];
          nextRun[from] = { index: to, angle: angleAlongLimb(exits[from], entries[to]) };
        });

        const visited = new Set();
        for (let start = 0; start < runs.length; start += 1) {
          if (visited.has(start)) continue;
          const commands = [`M${format(entries[start])}`];
          let current = start;
          while (!visited.has(current)) {
            visited.add(current);
            runs[current].slice(1, -1).forEach((point) => commands.push(`L${format(point)}`));
            commands.push(`L${format(exits[current])}`);
            const connection = nextRun[current];
            const entry = entries[connection.index];
            if (connection.angle > 1e-7) {
              const midpointAngle = exits[current].angle + mass.direction * connection.angle / 2;
              const midpoint = {
                x: center[0] + radius * Math.cos(midpointAngle),
                y: center[1] - radius * Math.sin(midpointAngle),
              };
              const sweep = mass.direction < 0 ? 1 : 0;
              commands.push(`A${radius},${radius} 0 0 ${sweep} ${format(midpoint)}`);
              commands.push(`A${radius},${radius} 0 0 ${sweep} ${format(entry)}`);
            }
            current = connection.index;
          }
          commands.push("Z");
          output.push(commands.join(" "));
        }
      }

      output.forEach((pathData, index) => {
        if (!mass.paths[index]) {
          const path = element("path", {
            class: "task4-real-earth__landmass",
            "data-land-outline": mass.index,
          });
          mass.parent.append(path);
          mass.paths.push(path);
        }
        mass.paths[index].setAttribute("d", pathData);
      });
      mass.paths.slice(output.length).forEach((path) => path.setAttribute("d", ""));
    }

    function renderSelection() {
      if (!selectionNode) return;
      const point = selectedCoordinate ? projectCoordinate(selectedCoordinate) : null;
      selectionNode.setAttribute("visibility", point?.visible ? "visible" : "hidden");
      selectionNode.setAttribute("aria-hidden", String(!point?.visible));
      if (point) selectionNode.setAttribute("transform", `translate(${point.x} ${point.y}) scale(${getOverlayScale()})`);
    }

    function renderMarkers() {
      markers.forEach((marker, id) => {
        const node = markerNodes.get(id);
        if (!node) return;
        const point = projectCoordinate(marker);
        node.setAttribute("visibility", point.visible ? "visible" : "hidden");
        node.setAttribute("aria-hidden", String(!point.visible));
        node.setAttribute("transform", `translate(${point.x} ${point.y}) scale(${getOverlayScale()})`);
      });
    }

    function formatCoordinateLabel(kind, value) {
      if (value === 0) return "0°";
      if (kind === "latitude") return `${Math.abs(value)}°${value > 0 ? "N" : "S"}`;
      if (Math.abs(value) === 180) return "180°";
      return `${Math.abs(value)}°${value > 0 ? "E" : "W"}`;
    }

    function buildCoordinateLabel(kind, value, referenceMeridian = 0) {
      const coordinate = kind === "latitude"
        ? { latitude: value, longitude: referenceMeridian }
        : { latitude: 0, longitude: value };
      const node = element("text", {
        class: `task4-real-earth__coordinate-label task4-real-earth__coordinate-label--${kind}`,
        "data-value": value,
        "data-reference-meridian": kind === "latitude" ? referenceMeridian : "",
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        dy: kind === "latitude" ? "-0.65em" : "1.25em",
        visibility: "hidden",
        "aria-hidden": "true",
      });
      node.textContent = formatCoordinateLabel(kind, value);
      coordinateLabelLayer.append(node);
      coordinateLabels.push({
        node,
        world: toCartesian(coordinate),
        showOnLimb: kind === "latitude" && Math.abs(value) === 90,
      });
    }

    function renderCoordinateLabels() {
      coordinateLabels.forEach(({ node, world, showOnLimb }) => {
        const point = projectWorld(world);
        const visible = showOnLimb ? point.depth >= -1e-12 : point.depth > LABEL_MINIMUM_DEPTH;
        node.setAttribute("visibility", visible ? "visible" : "hidden");
        node.setAttribute("aria-hidden", String(!visible));
        node.setAttribute("transform", `translate(${point.x} ${point.y}) scale(${getOverlayScale()})`);
      });
    }

    function updateMarkerNode(marker) {
      if (!markerLayer) return;
      let node = markerNodes.get(marker.id);
      if (!node) {
        node = element("g", { class: "task4-real-earth__marker", "aria-hidden": "true" });
        const pointRadius = config.viewBoxSize * config.pointRadiusRatio;
        node.append(
          element("circle", { class: "task4-real-earth__marker-ring", r: pointRadius * 2.4 }),
          element("circle", { class: "task4-real-earth__marker-core", r: pointRadius }),
          element("text", { class: "task4-real-earth__marker-label", x: pointRadius * 3.5, y: -pointRadius * 2 }),
        );
        markerLayer.append(node);
        markerNodes.set(marker.id, node);
      }
      node.setAttribute("data-type", marker.type);
      node.querySelector("text").textContent = marker.label;
    }

    function render() {
      basis = createBasis(view);
      land.forEach(renderLandMass);
      grid.forEach(renderCurve);
      renderCoordinateLabels();
      renderMarkers();
      renderSelection();
    }

    function localPoint(clientX, clientY) {
      const matrix = svg?.getScreenCTM();
      if (!matrix) return null;
      const point = new mount.ownerDocument.defaultView.DOMPoint(clientX, clientY);
      return point.matrixTransform(matrix.inverse());
    }

    function getCoordinateAt(clientX, clientY) {
      const point = localPoint(clientX, clientY);
      if (!point) return null;
      const x = (point.x - center[0]) / radius;
      const y = (center[1] - point.y) / radius;
      const distanceSquared = x * x + y * y;
      if (distanceSquared > 1 + 1e-12) return null;
      // The positive depth root selects only the visible hemisphere.
      const z = Math.sqrt(Math.max(0, 1 - distanceSquared));
      const world = basis.east.map((value, index) => x * value + y * basis.north[index] + z * basis.front[index]);
      return {
        latitude: degrees(Math.asin(clamp(world[1], -1, 1))),
        longitude: Math.hypot(world[0], world[2]) < 1e-10
          ? view.longitude
          : normalizeLongitude(degrees(Math.atan2(world[0], world[2]))),
      };
    }

    function selectCoordinate(coordinate) {
      const normalized = normalizeCoordinate(coordinate);
      if (!projectCoordinate(normalized).visible) return null;
      selectedCoordinate = normalized;
      renderSelection();
      onSurfaceSelect?.({ ...normalized });
      return { ...normalized };
    }

    function setView(nextView = {}) {
      assertActive();
      const latitude = Number(nextView.latitude ?? view.latitude);
      const longitude = Number(nextView.longitude ?? view.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new TypeError("Globe view requires finite latitude and longitude.");
      // No roll: the latitude limit keeps the north pole above the south pole.
      view = { latitude: clamp(latitude, -config.maxTilt, config.maxTilt), longitude: normalizeLongitude(longitude), rotation: 0 };
      render();
      onViewChange?.({ ...view });
    }

    function setScale(nextScale) {
      assertActive();
      const value = Number(nextScale);
      if (!Number.isFinite(value)) throw new TypeError("Globe scale must be finite.");
      scale = clamp(value, MIN_SCALE, maxScale);
      // Scale the whole SVG; getScreenCTM() then inverts the same transform for picking.
      if (svg) svg.style.transform = `scale(${scale})`;
      // Beyond the original 2x limit, keep labels and points near their former
      // screen size so geography enlarges without oversized classroom labels.
      renderCoordinateLabels();
      renderMarkers();
      renderSelection();
      return scale;
    }

    function setMaxScale(nextMaxScale) {
      assertActive();
      maxScale = numberInRange(nextMaxScale, MIN_SCALE, MAX_CONFIGURABLE_SCALE, "maximum scale");
      // Re-apply the current scale so lowering a stage-specific limit remains smooth and valid.
      return setScale(scale);
    }

    function wheelZoom(event) {
      if (!getCoordinateAt(event.clientX, event.clientY)) return;
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? svg.clientHeight : 1);
      setScale(scale * Math.exp(-delta * 0.001));
    }

    function stopDrag({ releaseCapture = true } = {}) {
      if (!drag) return;
      const pointerId = drag.pointerId;
      drag = null;
      svg.classList.remove("is-pointer-down");
      svg.classList.remove("is-dragging");
      if (releaseCapture && svg.hasPointerCapture?.(pointerId)) svg.releasePointerCapture(pointerId);
    }

    function stopPinch() {
      pinch = null;
      svg?.classList.remove("is-pinching");
    }

    function releaseTouchPointer(pointerId) {
      touchPointers.delete(pointerId);
      if (svg?.hasPointerCapture?.(pointerId)) svg.releasePointerCapture(pointerId);
    }

    function getTouchDistance(first, second) {
      return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
    }

    function beginSinglePointerDrag(event) {
      drag = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startPoint: localPoint(event.clientX, event.clientY),
        startView: { ...view },
        moved: false,
      };
      svg.classList.add("is-pointer-down");
    }

    function beginPinch() {
      const [first, second] = [...touchPointers.values()];
      if (!first || !second) return;
      stopDrag({ releaseCapture: false });
      pinch = {
        pointerIds: [first.pointerId, second.pointerId],
        startDistance: Math.max(1, getTouchDistance(first, second)),
        startScale: scale,
      };
      svg.classList.add("is-pinching");
    }

    function pointerDown(event) {
      if (!["rotate", "select", "interactive"].includes(mode)) return;
      if (!getCoordinateAt(event.clientX, event.clientY)) return;

      if (event.pointerType === "touch") {
        if (touchPointers.has(event.pointerId) || touchPointers.size >= 2) return;
        touchPointers.set(event.pointerId, {
          pointerId: event.pointerId,
          clientX: event.clientX,
          clientY: event.clientY,
        });
        svg.setPointerCapture(event.pointerId);
        if (touchPointers.size === 1) beginSinglePointerDrag(event);
        else beginPinch();
        event.preventDefault();
        return;
      }

      if (drag || pinch || !event.isPrimary || event.button !== 0) return;
      beginSinglePointerDrag(event);
      svg.setPointerCapture(event.pointerId);
      event.preventDefault();
    }

    function pointerMove(event) {
      if (event.pointerType === "touch" && touchPointers.has(event.pointerId)) {
        touchPointers.set(event.pointerId, {
          pointerId: event.pointerId,
          clientX: event.clientX,
          clientY: event.clientY,
        });
        if (pinch) {
          const first = touchPointers.get(pinch.pointerIds[0]);
          const second = touchPointers.get(pinch.pointerIds[1]);
          if (first && second) {
            setScale(pinch.startScale * getTouchDistance(first, second) / pinch.startDistance);
          }
          event.preventDefault();
          return;
        }
      }

      if (!drag || drag.pointerId !== event.pointerId) return;
      if (Math.hypot(event.clientX - drag.startClientX, event.clientY - drag.startClientY) > config.dragThreshold) drag.moved = true;
      if (drag.moved && (mode === "rotate" || mode === "interactive")) {
        svg.classList.add("is-dragging");
        const point = localPoint(event.clientX, event.clientY);
        if (!point) return;
        const sensitivity = config.dragSensitivity * 180 / (Math.PI * radius);
        setView({
          longitude: drag.startView.longitude - (point.x - drag.startPoint.x) * sensitivity,
          latitude: drag.startView.latitude + (point.y - drag.startPoint.y) * sensitivity,
        });
      }
      event.preventDefault();
    }

    function pointerUp(event) {
      if (event.pointerType === "touch" && touchPointers.has(event.pointerId)) {
        const wasPinching = Boolean(pinch);
        touchPointers.delete(event.pointerId);
        if (wasPinching) {
          if (svg.hasPointerCapture?.(event.pointerId)) svg.releasePointerCapture(event.pointerId);
          stopPinch();
          stopDrag({ releaseCapture: false });
          event.preventDefault();
          return;
        }
        if (!drag || drag.pointerId !== event.pointerId) {
          if (svg.hasPointerCapture?.(event.pointerId)) svg.releasePointerCapture(event.pointerId);
          event.preventDefault();
          return;
        }
      }

      if (!drag || drag.pointerId !== event.pointerId) return;
      const wasClick = !drag.moved && Math.hypot(event.clientX - drag.startClientX, event.clientY - drag.startClientY) <= config.dragThreshold;
      stopDrag();
      if (wasClick && (mode === "select" || mode === "interactive")) {
        const coordinate = getCoordinateAt(event.clientX, event.clientY);
        if (coordinate) selectCoordinate(coordinate);
      }
    }

    function pointerCancel(event) {
      if (event.pointerType === "touch" && touchPointers.has(event.pointerId)) {
        releaseTouchPointer(event.pointerId);
        stopPinch();
      }
      if (drag?.pointerId === event.pointerId) stopDrag();
    }
    const listeners = { pointerdown: pointerDown, pointermove: pointerMove, pointerup: pointerUp, pointercancel: pointerCancel, lostpointercapture: pointerCancel };

    const api = Object.freeze({
      create() {
        assertActive();
        if (svg) return api;
        if (!mount?.ownerDocument) throw new TypeError("Globe create requires a DOM mount.");
        svg = element("svg", {
          class: "task4-real-earth", viewBox: `0 0 ${config.viewBoxSize} ${config.viewBoxSize}`,
          preserveAspectRatio: "xMidYMid meet", role: "img", "aria-label": "球面经纬网", "data-mode": mode,
        });
        previousSize = mount.style.getPropertyValue("--task4-globe-size");
        mount.style.setProperty("--task4-globe-size", config.size);
        svg.style.setProperty("--task4-globe-label-size", config.labelFontSize);
        svg.style.setProperty("--task4-coordinate-label-size", config.coordinateLabelFontSize);
        svg.style.transformOrigin = `${config.center[0] * 100}% ${config.center[1] * 100}%`;
        svg.style.transformBox = "view-box";
        svg.style.transform = `scale(${scale})`;
        const defs = element("defs");
        const fill = element("radialGradient", { id: `${prefix}-fill`, cx: "32%", cy: "26%", r: "76%" });
        [[0, "#477f99"], [0.52, "#20536d"], [1, "#081923"]].forEach(([offset, color]) => fill.append(element("stop", { offset, "stop-color": color })));
        const clip = element("clipPath", { id: `${prefix}-clip`, clipPathUnits: "userSpaceOnUse" });
        clip.append(element("circle", { cx: center[0], cy: center[1], r: radius }));
        defs.append(fill, clip);
        svg.append(defs, element("circle", {
          class: "task4-real-earth__sphere", cx: center[0], cy: center[1], r: radius, fill: `url(#${prefix}-fill)`,
        }));
        const landGroup = element("g", { class: "task4-real-earth__land", "clip-path": `url(#${prefix}-clip)`, "aria-hidden": "true" });
        NATURAL_EARTH_LAND_OUTLINES.forEach((outline, index) => buildLandMass(landGroup, outline, index));
        const gridGroup = element("g", { class: "task4-real-earth__grid", "clip-path": `url(#${prefix}-clip)`, "aria-hidden": "true" });
        for (let longitude = -180; longitude < 180; longitude += config.longitudeStep) buildCurve(gridGroup, "longitude", longitude, -90, 90);
        const maximumLatitude = Math.floor((90 - 1e-8) / config.latitudeStep) * config.latitudeStep;
        for (let latitude = -maximumLatitude; latitude <= maximumLatitude; latitude += config.latitudeStep) buildCurve(gridGroup, "latitude", latitude, -180, 180);
        coordinateLabelLayer = element("g", {
          class: "task4-real-earth__coordinate-labels",
          "aria-hidden": "true",
        });
        LATITUDE_LABEL_MERIDIANS.forEach((referenceMeridian) => {
          LATITUDE_LABEL_VALUES.forEach((latitude) => {
            // Both meridians meet at each pole, so polar labels are shared.
            if (Math.abs(latitude) === 90 && referenceMeridian !== 0) return;
            buildCoordinateLabel("latitude", latitude, referenceMeridian);
          });
        });
        LONGITUDE_LABEL_VALUES.forEach((longitude) => buildCoordinateLabel("longitude", longitude));
        markerLayer = element("g", { class: "task4-real-earth__markers", "clip-path": `url(#${prefix}-clip)` });
        markers.forEach(updateMarkerNode);
        selectionNode = element("g", { class: "task4-real-earth__selection", visibility: "hidden", "aria-hidden": "true" });
        const pointRadius = config.viewBoxSize * config.pointRadiusRatio;
        selectionNode.append(
          element("circle", { class: "task4-real-earth__point-ring", r: pointRadius * 1.8 }),
          element("circle", { class: "task4-real-earth__point-core", r: pointRadius }),
        );
        const pointLayer = element("g", { "clip-path": `url(#${prefix}-clip)` });
        pointLayer.append(selectionNode);
        svg.append(landGroup, gridGroup, coordinateLabelLayer, markerLayer, pointLayer);
        Object.entries(listeners).forEach(([name, handler]) => svg.addEventListener(name, handler));
        svg.addEventListener("wheel", wheelZoom, { passive: false });
        mount.append(svg);
        render();
        return api;
      },

      destroy() {
        if (destroyed) return;
        stopDrag();
        stopPinch();
        [...touchPointers.keys()].forEach(releaseTouchPointer);
        if (svg) Object.entries(listeners).forEach(([name, handler]) => svg.removeEventListener(name, handler));
        svg?.removeEventListener("wheel", wheelZoom);
        if (svg) {
          svg.remove();
          if (previousSize) mount.style.setProperty("--task4-globe-size", previousSize);
          else mount.style.removeProperty("--task4-globe-size");
        }
        svg = null;
        coordinateLabelLayer = null;
        markerLayer = null;
        selectionNode = null;
        selectedCoordinate = null;
        grid.length = 0;
        land.length = 0;
        coordinateLabels.length = 0;
        markers.clear();
        markerNodes.clear();
        destroyed = true;
      },

      setMode(nextMode = "idle") {
        assertActive();
        if (!VALID_MODES.has(nextMode)) throw new Error(`Unsupported task four globe mode: ${nextMode}`);
        stopDrag();
        stopPinch();
        [...touchPointers.keys()].forEach(releaseTouchPointer);
        mode = nextMode;
        svg?.setAttribute("data-mode", mode);
      },

      setView,
      setScale,
      setMaxScale,
      getScale() {
        return scale;
      },
      projectCoordinate,
      getCoordinateAt,

      addMarker(marker = {}) {
        assertActive();
        const coordinate = normalizeCoordinate(marker);
        const id = String(marker.id || `marker-${++markerSequence}`);
        const entry = { id, ...coordinate, label: String(marker.label ?? ""), type: String(marker.type ?? "location") };
        markers.set(id, entry);
        updateMarkerNode(entry);
        renderMarkers();
        return id;
      },

      clearMarkers() {
        assertActive();
        markers.clear();
        markerNodes.forEach((node) => node.remove());
        markerNodes.clear();
      },

      clearSelection() {
        assertActive();
        selectedCoordinate = null;
        renderSelection();
      },

      getState() {
        return {
          mount, mode, view: { ...view }, scale, config: { ...config, center: [...config.center] },
          selectedCoordinate: selectedCoordinate ? { ...selectedCoordinate } : null,
          markers: [...markers.values()].map((marker) => ({ ...marker })), created: Boolean(svg), destroyed,
        };
      },

      reportSurfaceSelect(coordinate) {
        assertActive();
        return selectCoordinate(coordinate);
      },
    });
    return api;
  }

  window.Task4RealEarthGlobe = Object.freeze({ create });
})();
