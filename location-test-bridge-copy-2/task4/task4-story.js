(() => {
  "use strict";

  const STORY_STATE = Object.freeze({
    POSITION_CONFIRMATION_PENDING: "POSITION_CONFIRMATION_PENDING",
    AWAITING_NEXT_STAGE: "AWAITING_NEXT_STAGE",
    AWAITING_S4_01: "AWAITING_S4_01",
    S4_01_READY: "S4_01_READY",
    WAITING_DIRECTION_CHOICE: "WAITING_DIRECTION_CHOICE",
    WAITING_NORTH_POSITIONING: "WAITING_NORTH_POSITIONING",
    NORTH_SCAN_ACTIVE: "NORTH_SCAN_ACTIVE",
    WAITING_EAST_POSITIONING: "WAITING_EAST_POSITIONING",
    LOCATION_ANALYSIS: "LOCATION_ANALYSIS",
    POSITION_PROBLEM_DISCOVERY: "POSITION_PROBLEM_DISCOVERY",
    LATITUDE_INVESTIGATION: "LATITUDE_INVESTIGATION",
    LATITUDE_DISCOVERED: "LATITUDE_DISCOVERED",
    LONGITUDE_INVESTIGATION: "LONGITUDE_INVESTIGATION",
    LONGITUDE_DISCOVERED: "LONGITUDE_DISCOVERED",
    GRID_INTERSECTION_FOUND: "GRID_INTERSECTION_FOUND",
    READY_FOR_LOCATION_TEST: "READY_FOR_LOCATION_TEST",
    LOCATION_TEST: "LOCATION_TEST",
  });

  const ANALYSIS_LINE_DELAY = 480;

  function create({
    stage,
    onContinueInvestigation = null,
    onStartNorthPositioning = null,
    onStartEastPositioning = null,
    onStartLocationTest = null,
  } = {}) {
    let storyNode = null;
    let statusNode = null;
    let logNode = null;
    let problemNode = null;
    let openingNode = null;
    let openingNoteNode = null;
    let openingQuestionNode = null;
    let summaryNode = null;
    let teachingNode = null;
    let actionGroupNode = null;
    let actionNode = null;
    let secondaryActionNode = null;
    let phase = "idle";
    let runToken = 0;
    let destroyed = false;
    let completedDirections = new Set();

    const assertActive = () => {
      if (destroyed) throw new Error("Task four story has been destroyed.");
    };

    const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    const isCurrentRun = (token) => !destroyed && token === runToken;

    const setState = (nextState) => {
      phase = nextState;
      storyNode.dataset.storyState = nextState;
    };

    const appendLogLine = (text, tone = "normal") => {
      const line = logNode.ownerDocument.createElement("p");
      line.className = "task4-story__log-line is-visible";
      line.dataset.tone = tone;
      line.textContent = text || "\u00a0";
      logNode.append(line);
      return line;
    };

    const clearField = () => {
      storyNode?.classList.remove(
        "is-opening-sequence",
        "is-s401-choice",
        "is-east-handoff",
        "is-s402-summary",
      );
      openingNoteNode?.classList.remove(
        "is-opening-visible",
        "is-opening-leaving",
        "is-direction-feedback",
      );
      openingQuestionNode?.classList.remove(
        "is-opening-visible",
        "is-opening-leaving",
        "is-s401-guide",
      );
      openingNoteNode?.replaceChildren();
      openingQuestionNode?.replaceChildren();
      summaryNode?.replaceChildren();
      if (summaryNode) summaryNode.hidden = true;
      statusNode?.classList.remove("is-opening-visible");
      if (statusNode) statusNode.hidden = false;
      problemNode.replaceChildren();
      problemNode.hidden = true;
      teachingNode.replaceChildren();
      teachingNode.hidden = true;
    };

    const setAction = (
      label,
      { hidden = false, disabled = false, secondary = null } = {},
    ) => {
      actionNode.textContent = label;
      actionGroupNode.hidden = hidden;
      actionNode.disabled = disabled;
      secondaryActionNode.hidden = !secondary;
      if (secondary) {
        secondaryActionNode.textContent = secondary.label;
        secondaryActionNode.disabled = Boolean(secondary.disabled);
      }
    };

    const showDirectionFeedback = (text) => {
      openingNoteNode.textContent = text;
      openingNoteNode.classList.remove("is-opening-visible", "is-opening-leaving");
      openingNoteNode.classList.add("is-direction-feedback");
    };

    const createSvgElement = (name, attributes = {}) => {
      const node = stage.ownerDocument.createElementNS("http://www.w3.org/2000/svg", name);
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
      return node;
    };

    const createText = (className, text) => {
      const node = stage.ownerDocument.createElement("p");
      node.className = className;
      node.textContent = text;
      return node;
    };

    const showQuestion = (firstLine, secondLine) => {
      problemNode.hidden = false;
      problemNode.replaceChildren();
      return appendQuestion(firstLine, secondLine);
    };

    const appendQuestion = (firstLine, secondLine) => {
      const question = problemNode.ownerDocument.createElement("p");
      question.className = "task4-story__question";
      question.append(
        firstLine,
        problemNode.ownerDocument.createElement("br"),
        secondLine,
      );
      problemNode.append(question);
      return question;
    };

    const typeOpeningQuestion = async (text, token) => {
      openingQuestionNode.classList.add("is-opening-visible");
      for (const character of Array.from(text)) {
        if (!isCurrentRun(token)) return false;
        openingQuestionNode.textContent += character;
        await wait(80);
      }
      return true;
    };

    const createDirectionInvestigation = (kind, { showCandidates = false, showFinding = false } = {}) => {
      const isLatitude = kind === "latitude";
      const investigation = stage.ownerDocument.createElement("section");
      investigation.className = `task4-story__investigation task4-story__investigation--${kind}`;
      const heading = stage.ownerDocument.createElement("h3");
      heading.textContent = isLatitude ? "调查一条纬线" : "调查一条经线";
      const prompt = createText(
        "task4-story__investigation-prompt",
        isLatitude
          ? "只参考这条纬线，能锁定珠海吗？"
          : "只参考这条经线，能锁定珠海吗？",
      );
      const diagram = createSvgElement("svg", {
        class: "task4-story__investigation-diagram",
        viewBox: "0 0 440 260",
        "aria-hidden": "true",
      });
      diagram.append(createSvgElement("circle", {
        class: "task4-story__lesson-sphere",
        cx: "220",
        cy: "130",
        r: "102",
      }));

      if (isLatitude) {
        diagram.append(createSvgElement("ellipse", {
          class: "task4-story__lesson-line task4-story__lesson-line--latitude",
          cx: "220",
          cy: "130",
          rx: "102",
          ry: "30",
        }));
        if (showCandidates) {
          [138, 220, 302].forEach((x) => diagram.append(createSvgElement("circle", {
            class: "task4-story__candidate-point",
            cx: String(x),
            cy: String(130 - 30 * Math.sqrt(Math.max(0, 1 - ((x - 220) / 102) ** 2))),
            r: "7",
          })));
        }
      } else {
        diagram.append(createSvgElement("path", {
          class: "task4-story__lesson-line task4-story__lesson-line--longitude",
          d: "M 220 28 C 147 92 147 168 220 232",
        }));
        if (showCandidates) {
          [73, 130, 187].forEach((y) => diagram.append(createSvgElement("circle", {
            class: "task4-story__candidate-point",
            cx: String(220 - 73 * Math.sin(((y - 130) / 102) * Math.PI / 2)),
            cy: String(y),
            r: "7",
          })));
        }
      }

      investigation.append(heading, prompt, diagram);
      if (showCandidates) {
        investigation.append(createText(
          "task4-story__observation",
          isLatitude ? "同一条纬线经过多个候选位置。" : "同一条经线经过多个候选位置。",
        ));
      }
      if (showFinding) {
        investigation.append(createText(
          "task4-story__finding",
          isLatitude
            ? "调查记录：纬线只能确定南北方向，不能确定具体地点。"
            : "调查记录：经线只能确定东西方向，不能确定具体地点。",
        ));
      }
      return investigation;
    };

    const createIntersectionInvestigation = ({ revealPoint = false, showFinding = false } = {}) => {
      const investigation = stage.ownerDocument.createElement("section");
      investigation.className = "task4-story__investigation task4-story__investigation--intersection";
      const heading = stage.ownerDocument.createElement("h3");
      heading.textContent = "组合两项调查";
      const prompt = createText(
        "task4-story__investigation-prompt",
        revealPoint ? "两条线相交的位置，是否只剩一个？" : "把两项调查结果叠加，能锁定位置吗？",
      );
      const diagram = createSvgElement("svg", {
        class: "task4-story__investigation-diagram",
        viewBox: "0 0 440 260",
        "aria-hidden": "true",
      });
      diagram.append(
        createSvgElement("circle", {
          class: "task4-story__lesson-sphere",
          cx: "220",
          cy: "130",
          r: "102",
        }),
        createSvgElement("ellipse", {
          class: "task4-story__lesson-line task4-story__lesson-line--latitude",
          cx: "220",
          cy: "130",
          rx: "102",
          ry: "30",
        }),
        createSvgElement("path", {
          class: "task4-story__lesson-line task4-story__lesson-line--longitude",
          d: "M 220 28 C 147 92 147 168 220 232",
        }),
      );
      if (revealPoint) {
        diagram.append(
          createSvgElement("circle", {
            class: "task4-story__intersection-halo",
            cx: "175",
            cy: "100",
            r: "18",
          }),
          createSvgElement("circle", {
            class: "task4-story__intersection-point",
            cx: "175",
            cy: "100",
            r: "6",
          }),
        );
      }
      investigation.append(heading, prompt, diagram);
      if (showFinding) {
        investigation.append(createText(
          "task4-story__finding",
          "调查结果：两个方向的信息结合，才会留下一个具体位置。",
        ));
      }
      return investigation;
    };

    const ensureStory = () => {
      if (storyNode || !stage?.ownerDocument) return;
      storyNode = stage.ownerDocument.createElement("section");
      storyNode.className = "task4-story";
      storyNode.setAttribute("aria-live", "polite");

      const field = stage.ownerDocument.createElement("div");
      field.className = "task4-story__field";
      problemNode = stage.ownerDocument.createElement("div");
      problemNode.className = "task4-story__problem";
      problemNode.hidden = true;
      openingNode = stage.ownerDocument.createElement("div");
      openingNode.className = "task4-story__opening";
      openingNoteNode = stage.ownerDocument.createElement("p");
      openingNoteNode.className = "task4-story__opening-note";
      openingQuestionNode = stage.ownerDocument.createElement("p");
      openingQuestionNode.className = "task4-story__opening-question";
      openingNode.append(openingNoteNode, openingQuestionNode);
      summaryNode = stage.ownerDocument.createElement("div");
      summaryNode.className = "task4-story__summary";
      summaryNode.hidden = true;
      teachingNode = stage.ownerDocument.createElement("div");
      teachingNode.className = "task4-story__teaching";
      teachingNode.hidden = true;
      statusNode = stage.ownerDocument.createElement("p");
      statusNode.className = "task4-story__status";
      logNode = stage.ownerDocument.createElement("div");
      logNode.className = "task4-story__log";
      field.append(statusNode, logNode, openingNode, summaryNode, problemNode, teachingNode);

      actionGroupNode = stage.ownerDocument.createElement("div");
      actionGroupNode.className = "task4-story__action-group";
      actionNode = stage.ownerDocument.createElement("button");
      actionNode.className = "task4-story__action";
      actionNode.type = "button";
      actionNode.addEventListener("click", handleAction);
      secondaryActionNode = stage.ownerDocument.createElement("button");
      secondaryActionNode.className = "task4-story__action";
      secondaryActionNode.type = "button";
      secondaryActionNode.hidden = true;
      secondaryActionNode.addEventListener("click", handleSecondaryAction);
      actionGroupNode.append(actionNode, secondaryActionNode);
      field.append(actionGroupNode);
      storyNode.append(field);
      stage.append(storyNode);
    };

    const showPositionConfirmationPending = () => {
      const token = ++runToken;
      setState(STORY_STATE.POSITION_CONFIRMATION_PENDING);
      clearField();
      statusNode.textContent = "任务四：寻找回家的坐标";
      logNode.replaceChildren();
      storyNode.classList.add("is-opening-sequence");
      openingNoteNode.textContent = "返航定位器仍显示：具体位置未确认。";
      const question = "南北定位和东西定位都已经恢复了，\n可是为什么还是不能确定珠海的具体位置？";
      setAction("", { hidden: true, disabled: true });

      void (async () => {
        openingNoteNode.classList.add("is-opening-visible");
        await wait(1800);
        if (!isCurrentRun(token)) return;
        await wait(1000);
        if (!isCurrentRun(token)) return;
        if (!await typeOpeningQuestion(question, token)) return;
        await wait(1000);
        if (!isCurrentRun(token)) return;
        statusNode.classList.add("is-opening-visible");
        await wait(2000);
        if (!isCurrentRun(token)) return;
        setAction("继续调查");
      })();
    };

    const showS401DirectionChoice = async () => {
      const token = ++runToken;
      setState(STORY_STATE.S4_01_READY);
      setAction("", { hidden: true, disabled: true });
      onContinueInvestigation?.();
      openingNoteNode.classList.remove("is-opening-visible");
      openingNoteNode.classList.add("is-opening-leaving");
      openingQuestionNode.classList.add("is-opening-leaving");
      await wait(620);
      if (!isCurrentRun(token)) return;

      openingNoteNode.textContent = "";
      openingNoteNode.classList.remove("is-opening-visible", "is-opening-leaving");
      openingQuestionNode.textContent = "尝试通过南北/东西定位，确定珠海的大概位置？";
      openingQuestionNode.classList.remove("is-opening-leaving");
      openingQuestionNode.classList.add("is-s401-guide");
      storyNode.classList.add("is-s401-choice");
      await wait(520);
      if (!isCurrentRun(token)) return;

      completedDirections = new Set();
      setState(STORY_STATE.WAITING_DIRECTION_CHOICE);
      setAction("南北定位", {
        secondary: { label: "东西定位", disabled: false },
      });
    };

    const hideForLatitudePractice = () => {
      runToken += 1;
      storyNode.hidden = true;
      stage?.classList.remove("is-story-mode");
      stage?.setAttribute("aria-hidden", "true");
      if (stage) stage.hidden = true;
      setAction("", { hidden: true, disabled: true });
    };

    const showDirectionChoice = ({ completed = [], lastCompletedDirection = null } = {}) => {
      const token = ++runToken;
      completedDirections = new Set(completed);
      setState(STORY_STATE.WAITING_DIRECTION_CHOICE);
      storyNode.hidden = false;
      stage?.classList.add("is-story-mode");
      stage?.setAttribute("aria-hidden", "false");
      stage?.removeAttribute("hidden");
      clearField();
      storyNode.classList.add("is-opening-sequence", "is-s401-choice");
      statusNode.textContent = "任务四：寻找回家的坐标";
      statusNode.classList.add("is-opening-visible");
      openingQuestionNode.textContent = lastCompletedDirection === "east"
        ? "东西定位还不能确定具体位置，那再试试南北定位？"
        : lastCompletedDirection === "north"
          ? "南北定位还不能确定具体位置，那再试试东西定位？"
          : "尝试通过南北/东西定位，确定珠海的大概位置？";
      openingQuestionNode.classList.add("is-opening-visible", "is-s401-guide");
      setAction("南北定位", {
        secondary: { label: "东西定位", disabled: false },
      });
      return isCurrentRun(token);
    };

    const showDirectionSummary = (directionOrder = []) => {
      const token = ++runToken;
      setState("S4_02_DIRECTION_SUMMARY");
      storyNode.hidden = false;
      stage?.classList.add("is-story-mode");
      stage?.setAttribute("aria-hidden", "false");
      stage?.removeAttribute("hidden");
      clearField();
      storyNode.classList.add("is-s402-summary");
      statusNode.textContent = "任务四：寻找回家的坐标";
      statusNode.classList.add("is-opening-visible");
      const recordByDirection = {
        north: "南北定位，找到了一条纬线，但无法确定具体位置。",
        east: "东西定位，找到了一条经线，也无法确定具体位置。",
      };
      const orderedRecords = directionOrder
        .filter((direction) => recordByDirection[direction])
        .map((direction) => recordByDirection[direction]);
      const records = orderedRecords.length === 2
        ? orderedRecords
        : [recordByDirection.north, recordByDirection.east];
      [
        ...records,
        "看来，单凭一条纬线或者一条经线，都无法确定一个地点的具体位置。",
        "那么，接下来还能用什么办法确定珠海的位置？",
      ].forEach((text, index) => {
        const level = index < 2 ? "record" : index === 2 ? "finding" : "question";
        summaryNode.append(createText(
          `task4-story__summary-line task4-story__summary-line--${level}`,
          text,
        ));
      });
      summaryNode.hidden = false;
      setAction("", { hidden: true, disabled: true });
      void (async () => {
        for (const line of summaryNode.children) {
          if (!isCurrentRun(token)) return;
          line.classList.add("is-visible");
          await wait(1100);
        }
      })();
    };

    const beginLatitudeInvestigation = () => {
      setState(STORY_STATE.LATITUDE_INVESTIGATION);
      statusNode.textContent = "位置确认调查";
      logNode.replaceChildren();
      appendLogLine("调查对象：一条纬线", "heading");
      clearField();
      teachingNode.replaceChildren(createDirectionInvestigation("latitude"));
      teachingNode.hidden = false;
      setAction("查看纬线经过的位置");
    };

    const showLatitudeCandidates = () => {
      setState(STORY_STATE.POSITION_PROBLEM_DISCOVERY);
      teachingNode.replaceChildren(createDirectionInvestigation("latitude", { showCandidates: true }));
      setAction("记录纬线调查结果");
    };

    const recordLatitudeFinding = () => {
      setState(STORY_STATE.LATITUDE_DISCOVERED);
      teachingNode.replaceChildren(createDirectionInvestigation("latitude", {
        showCandidates: true,
        showFinding: true,
      }));
      setAction("调查经线");
    };

    const beginLongitudeInvestigation = () => {
      setState(STORY_STATE.LONGITUDE_INVESTIGATION);
      statusNode.textContent = "位置确认调查";
      logNode.replaceChildren();
      appendLogLine("调查对象：一条经线", "heading");
      clearField();
      teachingNode.replaceChildren(createDirectionInvestigation("longitude"));
      teachingNode.hidden = false;
      setAction("查看经线经过的位置");
    };

    const showLongitudeCandidates = () => {
      setState(STORY_STATE.POSITION_PROBLEM_DISCOVERY);
      teachingNode.replaceChildren(createDirectionInvestigation("longitude", { showCandidates: true }));
      setAction("记录经线调查结果");
    };

    const recordLongitudeFinding = () => {
      setState(STORY_STATE.LONGITUDE_DISCOVERED);
      teachingNode.replaceChildren(createDirectionInvestigation("longitude", {
        showCandidates: true,
        showFinding: true,
      }));
      setAction("组合两项调查");
    };

    const beginIntersectionInvestigation = () => {
      setState(STORY_STATE.GRID_INTERSECTION_FOUND);
      statusNode.textContent = "位置确认调查";
      logNode.replaceChildren();
      appendLogLine("正在叠加两项调查结果……", "working");
      clearField();
      teachingNode.replaceChildren(createIntersectionInvestigation());
      teachingNode.hidden = false;
      setAction("叠加两条线");
    };

    const revealIntersection = () => {
      setState(STORY_STATE.GRID_INTERSECTION_FOUND);
      teachingNode.replaceChildren(createIntersectionInvestigation({ revealPoint: true }));
      setAction("确认定位规律");
    };

    const showReadyForLocationTest = () => {
      setState(STORY_STATE.READY_FOR_LOCATION_TEST);
      statusNode.textContent = "定位系统检测";
      logNode.replaceChildren();
      appendLogLine("位置确认：已找到规律", "ready");
      clearField();
      teachingNode.replaceChildren(createIntersectionInvestigation({
        revealPoint: true,
        showFinding: true,
      }));
      teachingNode.hidden = false;
      showQuestion("两个方向的信息结合，", "才能锁定一个具体位置。");
      const detection = problemNode.ownerDocument.createElement("p");
      detection.className = "task4-story__problem-note";
      detection.textContent = "定位系统需要重新测试。";
      problemNode.append(detection);
      setAction("开始定位测试");
    };

    const runLocationAnalysis = async () => {
      const token = ++runToken;
      setState(STORY_STATE.LOCATION_ANALYSIS);
      statusNode.textContent = "定位问题分析";
      logNode.replaceChildren();
      clearField();
      setAction("", { hidden: true, disabled: true });
      const analysisLines = [
        ["正在分析位置确认问题……", "working"],
        ["检测结果：", "heading"],
        ["南北定位能力：正常 ✓", "ready"],
        ["东西定位能力：正常 ✓", "ready"],
        ["位置确认：未完成", "working"],
      ];
      for (const [text, tone] of analysisLines) {
        if (!isCurrentRun(token)) return;
        appendLogLine(text, tone);
        await wait(ANALYSIS_LINE_DELAY);
      }
      if (!isCurrentRun(token)) return;
      showQuestion("已经知道南北方向和东西方向，", "为什么还是无法确认唯一位置？");
      setAction("先调查纬线");
    };

    function handleAction() {
      if (destroyed) return;
      if (phase === STORY_STATE.POSITION_CONFIRMATION_PENDING) {
        setState(STORY_STATE.AWAITING_S4_01);
        setAction("", { hidden: true, disabled: true });
        void showS401DirectionChoice();
        return;
      }
      if (phase === STORY_STATE.WAITING_DIRECTION_CHOICE) {
        if (completedDirections.has("north")) {
          showDirectionFeedback("已做过测试，无法确定，请选择东西定位");
          return;
        }
        setState(STORY_STATE.NORTH_SCAN_ACTIVE);
        setAction("", { hidden: true, disabled: true });
        onStartNorthPositioning?.();
        return;
      }
      if (phase === STORY_STATE.LOCATION_ANALYSIS) {
        beginLatitudeInvestigation();
        return;
      }
      if (phase === STORY_STATE.LATITUDE_INVESTIGATION) {
        showLatitudeCandidates();
        return;
      }
      if (phase === STORY_STATE.POSITION_PROBLEM_DISCOVERY) {
        if (teachingNode.querySelector(".task4-story__investigation--latitude")) {
          recordLatitudeFinding();
        } else {
          recordLongitudeFinding();
        }
        return;
      }
      if (phase === STORY_STATE.LATITUDE_DISCOVERED) {
        beginLongitudeInvestigation();
        return;
      }
      if (phase === STORY_STATE.LONGITUDE_INVESTIGATION) {
        showLongitudeCandidates();
        return;
      }
      if (phase === STORY_STATE.LONGITUDE_DISCOVERED) {
        beginIntersectionInvestigation();
        return;
      }
      if (phase === STORY_STATE.GRID_INTERSECTION_FOUND) {
        if (teachingNode.querySelector(".task4-story__intersection-point")) {
          showReadyForLocationTest();
        } else {
          revealIntersection();
        }
        return;
      }
      if (phase !== STORY_STATE.READY_FOR_LOCATION_TEST) return;
      setState(STORY_STATE.LOCATION_TEST);
      storyNode.hidden = true;
      stage?.classList.remove("is-story-mode");
      setAction("", { hidden: true, disabled: true });
      onStartLocationTest?.();
    }

    function handleSecondaryAction() {
      if (destroyed || phase !== STORY_STATE.WAITING_DIRECTION_CHOICE) return;
      if (completedDirections.has("east")) {
        showDirectionFeedback("已做过测试，无法确定，请选择南北定位");
        return;
      }
      setState("EAST_SCAN_ACTIVE");
      setAction("", { hidden: true, disabled: true });
      onStartEastPositioning?.();
    }

    return Object.freeze({
      initialize() {
        assertActive();
        ensureStory();
        return this;
      },

      start() {
        assertActive();
        ensureStory();
        storyNode.hidden = false;
        stage?.classList.add("is-story-mode");
        stage?.setAttribute("aria-hidden", "false");
        stage?.removeAttribute("hidden");
        showPositionConfirmationPending();
      },

      getState() {
        return { phase, destroyed };
      },

      hideForLatitudePractice() {
        assertActive();
        hideForLatitudePractice();
      },

      hideForLongitudePractice() {
        assertActive();
        hideForLatitudePractice();
      },

      showDirectionChoice(options) {
        assertActive();
        return showDirectionChoice(options);
      },

      showDirectionSummary(directionOrder) {
        assertActive();
        showDirectionSummary(directionOrder);
      },

      startLocationAnalysis() {
        assertActive();
        if (phase !== STORY_STATE.AWAITING_NEXT_STAGE) return false;
        void runLocationAnalysis();
        return true;
      },

      destroy() {
        if (destroyed) return;
        runToken += 1;
        actionNode?.removeEventListener("click", handleAction);
        secondaryActionNode?.removeEventListener("click", handleSecondaryAction);
        stage?.classList.remove("is-story-mode");
        storyNode?.remove();
        storyNode = null;
        statusNode = null;
        logNode = null;
        problemNode = null;
        openingNode = null;
        openingNoteNode = null;
        openingQuestionNode = null;
        summaryNode = null;
        teachingNode = null;
        actionGroupNode = null;
        actionNode = null;
        secondaryActionNode = null;
        phase = "destroyed";
        destroyed = true;
      },
    });
  }

  window.Task4Story = Object.freeze({ create, STORY_STATE });
})();
