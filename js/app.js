/* Core Application Logic - SSLC Social Science Cram App */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

let currentRecallQuestion = null;
let currentWriteQuestion = null;
let currentRapidQuestion = null;
let rapidTimerInterval = null;
let rapidSecondsLeft = 30;
let rapidStreak = 0;
let currentNumProblem = null;

// 5-Hour Timer variables
let cramTimerInterval = null;
let cramSeconds = 5 * 3600; // 5 hours default

// Final Boss variables
let bossCurrentIndex = 0;
let bossQuestions = [];
let bossUserAnswers = [];

function initApp() {
  setupNavigation();
  updateHeaderStats();
  renderTopicTable();
  populateTopicFilter();
  setupActiveRecall();
  setupWriteAnswerMode();
  setupRapidFireMode();
  setupMapTrainingMode();
  setupNumericalTrainingMode();
  setupCram5HrMode();
  setupLast30MinMode();
  setupFinalBossMode();
  renderProgressDashboard();

  // Reset Stats Button
  const resetBtn = document.getElementById("btn-reset-stats");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all progress stats? This cannot be undone.")) {
        srs.resetAllState();
        updateHeaderStats();
        renderTopicTable();
        renderProgressDashboard();
        alert("Progress reset successfully!");
      }
    });
  }
}

/* 1. Navigation / View Switcher */
function setupNavigation() {
  const navBtns = document.querySelectorAll(".nav-btn");
  const panels = document.querySelectorAll(".view-panel");

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");

      navBtns.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }

      // Refresh panel specific dynamic content
      if (targetId === "topics-view") renderTopicTable();
      if (targetId === "progress-view") renderProgressDashboard();
      if (targetId === "recall-view") loadNextRecallQuestion();
      if (targetId === "write-answer-view") loadNextWriteQuestion();
      if (targetId === "rapid-fire-view") loadNextRapidQuestion();
      if (targetId === "map-training-view") loadNextMapQuestion();
      if (targetId === "numerical-view") loadNextNumericalProblem();
      if (targetId === "cram-5hr-view") renderCramQueue();
      if (targetId === "last-30min-view") renderLast30MinCards();
    });
  });
}

function updateHeaderStats() {
  const readiness = srs.getExamReadiness();
  const readinessBadge = document.getElementById("header-readiness");
  if (readinessBadge) {
    readinessBadge.textContent = `Readiness: ${readiness}%`;
  }
}

/* 2. Topic Table Renderer */
function renderTopicTable() {
  const tbody = document.getElementById("topic-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  let weakCount = 0;
  let highPriCount = 0;

  TOPICS_DATA.forEach(topic => {
    const status = srs.getTopicStatus(topic.id);
    if (status === "WEAK") weakCount++;
    if (topic.priority === "HIGH") highPriCount++;

    const tr = document.createElement("tr");

    let statusBadge = `<span class="badge" style="background:#475569; color:#f8fafc;">NEW</span>`;
    if (status === "MASTERED") statusBadge = `<span class="badge" style="background:rgba(34,197,94,0.2); color:#22c55e; border:1px solid #22c55e;">MASTERED</span>`;
    if (status === "WEAK") statusBadge = `<span class="badge priority-tag">WEAK</span>`;

    tr.innerHTML = `
      <td><strong>#${topic.rank}</strong></td>
      <td><strong>${topic.title}</strong></td>
      <td>${topic.chapter}</td>
      <td>${topic.frequency}%</td>
      <td><span class="badge marks-tag">${topic.expectedMarks} Marks</span></td>
      <td><span class="badge ${topic.priority === 'HIGH' ? 'priority-tag' : topic.priority === 'MEDIUM' ? 'type-tag' : 'srs-box'}">${topic.priority}</span></td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-secondary topic-study-btn" data-topic-id="${topic.id}" style="padding:4px 8px; font-size:0.78rem;">
          Study Now ➔
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  const highPriEl = document.getElementById("topic-high-pri-count");
  const weakEl = document.getElementById("topic-weak-count");
  if (highPriEl) highPriEl.textContent = highPriCount;
  if (weakEl) weakEl.textContent = weakCount;

  document.querySelectorAll(".topic-study-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const topicId = btn.getAttribute("data-topic-id");
      const filterSelect = document.getElementById("recall-topic-filter");
      if (filterSelect) filterSelect.value = topicId;

      const recallNavBtn = document.querySelector('.nav-btn[data-target="recall-view"]');
      if (recallNavBtn) recallNavBtn.click();
    });
  });
}

function populateTopicFilter() {
  const select = document.getElementById("recall-topic-filter");
  if (!select) return;

  select.innerHTML = `<option value="all">All Topics (15)</option>`;
  TOPICS_DATA.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `#${t.rank} - ${t.title}`;
    select.appendChild(opt);
  });
}

/* 3. Active Recall Engine */
function setupActiveRecall() {
  const topicFilter = document.getElementById("recall-topic-filter");
  const typeFilter = document.getElementById("recall-type-filter");
  const revealBtn = document.getElementById("btn-reveal-answer");
  const skipBtn = document.getElementById("btn-skip-question");

  if (topicFilter) topicFilter.addEventListener("change", () => loadNextRecallQuestion());
  if (typeFilter) typeFilter.addEventListener("change", () => loadNextRecallQuestion());

  if (revealBtn) {
    revealBtn.addEventListener("click", () => revealModelAnswer());
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      srs.confirmSkip(() => {
        loadNextRecallQuestion();
      });
    });
  }

  const gradeBtns = document.querySelectorAll(".btn-grade[data-grade]");
  gradeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const grade = btn.getAttribute("data-grade");
      if (currentRecallQuestion) {
        srs.recordAttempt(currentRecallQuestion.id, currentRecallQuestion.topicId, grade);
        updateHeaderStats();
        loadNextRecallQuestion();
      }
    });
  });
}

function getFilteredQuestions() {
  const topicVal = document.getElementById("recall-topic-filter")?.value || "all";
  const typeVal = document.getElementById("recall-type-filter")?.value || "all";

  return QUESTIONS_DATA.filter(q => {
    const topicMatch = topicVal === "all" || q.topicId === topicVal;
    const typeMatch = typeVal === "all" || q.type === typeVal;
    return topicMatch && typeMatch;
  });
}

function loadNextRecallQuestion() {
  const questions = getFilteredQuestions();
  if (questions.length === 0) {
    document.getElementById("recall-question-box").innerHTML = "<em>No questions match the selected filter. Try selecting 'All Topics'.</em>";
    document.getElementById("recall-input-area").innerHTML = "";
    document.getElementById("recall-pre-reveal").classList.add("hidden");
    document.getElementById("recall-model-section").classList.add("hidden");
    return;
  }

  const weightedList = [];
  questions.forEach(q => {
    const box = srs.getQuestionSRSBox(q.id);
    const topicStatus = srs.getTopicStatus(q.topicId);
    let weight = 6 - box;
    if (topicStatus === "WEAK") weight += 3;

    for (let i = 0; i < weight; i++) {
      weightedList.push(q);
    }
  });

  const randomIndex = Math.floor(Math.random() * weightedList.length);
  currentRecallQuestion = weightedList[randomIndex];

  renderRecallQuestionCard(currentRecallQuestion);
}

function renderRecallQuestionCard(q) {
  const topicObj = TOPICS_DATA.find(t => t.id === q.topicId);
  const srsBox = srs.getQuestionSRSBox(q.id);

  document.getElementById("recall-priority").textContent = `Priority: ${topicObj ? topicObj.priority : 'NORMAL'}`;
  document.getElementById("recall-topic-name").textContent = topicObj ? topicObj.title : 'General';
  document.getElementById("recall-type").textContent = q.type.toUpperCase();
  document.getElementById("recall-srs-box").textContent = `SRS Box ${srsBox}`;

  document.getElementById("recall-question-box").textContent = q.question;

  const inputArea = document.getElementById("recall-input-area");
  inputArea.innerHTML = "";

  if (q.type === "mcq" || q.type === "reasoning" || q.type === "chart") {
    const optionsGrid = document.createElement("div");
    optionsGrid.className = "options-grid";

    (q.options || []).forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${optText}`;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        btn.dataset.userVal = optText;
      });
      optionsGrid.appendChild(btn);
    });
    inputArea.appendChild(optionsGrid);
  } else if (q.type === "fill") {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "recall-text-input";
    input.className = "custom-input";
    input.placeholder = "Type missing word / key concept...";
    inputArea.appendChild(input);
  } else {
    const textarea = document.createElement("textarea");
    textarea.id = "recall-text-input";
    textarea.className = "custom-textarea";
    textarea.rows = 4;
    textarea.placeholder = "Type your response here before revealing answer...";
    inputArea.appendChild(textarea);
  }

  document.getElementById("recall-pre-reveal").classList.remove("hidden");
  document.getElementById("recall-model-section").classList.add("hidden");
}

function revealModelAnswer() {
  if (!currentRecallQuestion) return;

  let userAttempt = "";
  const selectedOpt = document.querySelector(".option-btn.selected");
  const textInput = document.getElementById("recall-text-input");

  if (selectedOpt) {
    userAttempt = selectedOpt.dataset.userVal || selectedOpt.textContent;
  } else if (textInput) {
    userAttempt = textInput.value.trim();
  }

  if (!userAttempt) {
    userAttempt = "(No attempt typed)";
  }

  document.getElementById("recall-user-attempt").textContent = userAttempt;

  const modelBox = document.getElementById("recall-model-answer");
  modelBox.innerHTML = `
    <p><strong>Correct Answer / Model Response:</strong></p>
    <p style="margin-top:4px; font-size:1rem; color:#f8fafc;">${currentRecallQuestion.correctAnswer}</p>
    ${currentRecallQuestion.explanation ? `<p style="margin-top:8px; font-size:0.85rem; color:#94a3b8;"><em>Note: ${currentRecallQuestion.explanation}</em></p>` : ''}
  `;

  if (currentRecallQuestion.type === "mcq" || currentRecallQuestion.type === "reasoning" || currentRecallQuestion.type === "chart") {
    document.querySelectorAll(".option-btn").forEach(btn => {
      const btnText = btn.dataset.userVal || btn.textContent;
      if (btnText.includes(currentRecallQuestion.correctAnswer) || currentRecallQuestion.correctAnswer.includes(btnText)) {
        btn.classList.add("correct-opt");
      } else if (btn.classList.contains("selected")) {
        btn.classList.add("wrong-opt");
      }
    });
  }

  document.getElementById("recall-pre-reveal").classList.add("hidden");
  document.getElementById("recall-model-section").classList.remove("hidden");
}

/* 4. Write-the-Answer Mode (3 - 8 Marks) */
function setupWriteAnswerMode() {
  const textarea = document.getElementById("write-user-input");
  const wordCountEl = document.getElementById("write-word-count");
  const submitBtn = document.getElementById("btn-submit-write");

  if (textarea) {
    textarea.addEventListener("input", () => {
      const words = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
      if (wordCountEl) wordCountEl.textContent = words;
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", () => evaluateWriteAnswer());
  }

  const writeGradeBtns = document.querySelectorAll("[data-write-grade]");
  writeGradeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const grade = btn.getAttribute("data-write-grade");
      if (currentWriteQuestion) {
        srs.recordAttempt(currentWriteQuestion.id, currentWriteQuestion.topicId, grade);
        updateHeaderStats();
        loadNextWriteQuestion();
      }
    });
  });
}

function loadNextWriteQuestion() {
  const longQuestions = QUESTIONS_DATA.filter(q => q.type === "long");
  if (longQuestions.length === 0) return;

  const randomIndex = Math.floor(Math.random() * longQuestions.length);
  currentWriteQuestion = longQuestions[randomIndex];

  const topicObj = TOPICS_DATA.find(t => t.id === currentWriteQuestion.topicId);

  document.getElementById("write-marks-badge").textContent = `${currentWriteQuestion.marks || 5} Marks`;
  document.getElementById("write-topic-badge").textContent = topicObj ? topicObj.title : "General";
  document.getElementById("write-question-box").textContent = currentWriteQuestion.question;

  const textarea = document.getElementById("write-user-input");
  if (textarea) textarea.value = "";
  document.getElementById("write-word-count").textContent = "0";

  document.getElementById("write-feedback-section").classList.add("hidden");
}

function evaluateWriteAnswer() {
  if (!currentWriteQuestion) return;

  const userText = (document.getElementById("write-user-input")?.value || "").toLowerCase();

  if (!userText.trim()) {
    alert("Please type your attempt before revealing the model answer!");
    return;
  }

  document.getElementById("write-model-text").textContent = currentWriteQuestion.correctAnswer;

  const keypointsList = document.getElementById("write-keypoints-list");
  keypointsList.innerHTML = "";

  const keyPoints = currentWriteQuestion.keyPoints || [];
  keyPoints.forEach(kp => {
    const li = document.createElement("li");
    const isMatched = userText.includes(kp.toLowerCase());

    if (isMatched) {
      li.style.color = "#22c55e";
      li.innerHTML = `✅ <strong>Included:</strong> Key concept "${kp}" detected in your answer.`;
    } else {
      li.style.color = "#ef4444";
      li.innerHTML = `❌ <strong>Missing:</strong> Key concept "${kp}" was omitted.`;
    }
    keypointsList.appendChild(li);
  });

  document.getElementById("write-feedback-section").classList.remove("hidden");
}

/* 5. Rapid Fire Mode */
function setupRapidFireMode() {
  const nextBtn = document.getElementById("btn-next-rapid");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => loadNextRapidQuestion());
  }
}

function loadNextRapidQuestion() {
  clearInterval(rapidTimerInterval);
  rapidSecondsLeft = 30;

  const mcqQuestions = QUESTIONS_DATA.filter(q => q.options && q.options.length > 0);
  const randomIndex = Math.floor(Math.random() * mcqQuestions.length);
  currentRapidQuestion = mcqQuestions[randomIndex];

  const topicObj = TOPICS_DATA.find(t => t.id === currentRapidQuestion.topicId);

  document.getElementById("rapid-topic-badge").textContent = topicObj ? topicObj.title : "Rapid Concept";
  document.getElementById("rapid-streak-badge").textContent = `Streak: ${rapidStreak}`;
  document.getElementById("rapid-question-box").textContent = currentRapidQuestion.question;

  const container = document.getElementById("rapid-options-container");
  container.innerHTML = "";

  currentRapidQuestion.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
    btn.addEventListener("click", () => handleRapidAnswer(opt, btn));
    container.appendChild(btn);
  });

  document.getElementById("rapid-feedback-banner").classList.add("hidden");
  document.getElementById("btn-next-rapid").classList.add("hidden");

  startRapidTimer();
}

function startRapidTimer() {
  const clock = document.getElementById("rapid-timer-clock");
  const fill = document.getElementById("rapid-timer-fill");

  rapidTimerInterval = setInterval(() => {
    rapidSecondsLeft--;
    if (clock) clock.textContent = `${rapidSecondsLeft}s`;
    if (fill) fill.style.width = `${(rapidSecondsLeft / 30) * 100}%`;

    if (rapidSecondsLeft <= 0) {
      clearInterval(rapidTimerInterval);
      handleRapidAnswer(null, null);
    }
  }, 1000);
}

function handleRapidAnswer(selectedOpt, clickedBtn) {
  clearInterval(rapidTimerInterval);

  const banner = document.getElementById("rapid-feedback-banner");
  const nextBtn = document.getElementById("btn-next-rapid");
  banner.classList.remove("hidden");
  nextBtn.classList.remove("hidden");

  document.querySelectorAll("#rapid-options-container .option-btn").forEach(b => {
    b.disabled = true;
    if (b.textContent.includes(currentRapidQuestion.correctAnswer)) {
      b.classList.add("correct-opt");
    }
  });

  if (selectedOpt === currentRapidQuestion.correctAnswer) {
    rapidStreak++;
    banner.style.backgroundColor = "rgba(34, 197, 94, 0.2)";
    banner.style.color = "#22c55e";
    banner.textContent = "⚡ CORRECT! Rapid response!";
    srs.recordAttempt(currentRapidQuestion.id, currentRapidQuestion.topicId, "correct");
  } else {
    rapidStreak = 0;
    banner.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
    banner.style.color = "#ef4444";
    banner.textContent = selectedOpt ? `❌ WRONG! Correct answer: ${currentRapidQuestion.correctAnswer}` : `⏰ TIME OUT! Correct answer: ${currentRapidQuestion.correctAnswer}`;
    if (clickedBtn) clickedBtn.classList.add("wrong-opt");
    srs.recordAttempt(currentRapidQuestion.id, currentRapidQuestion.topicId, "wrong");
  }

  document.getElementById("rapid-streak-badge").textContent = `Streak: ${rapidStreak}`;
  updateHeaderStats();
}

/* 6. Map Training Mode */
function setupMapTrainingMode() {
  const nextMapBtn = document.getElementById("btn-next-map");
  if (nextMapBtn) {
    nextMapBtn.addEventListener("click", () => loadNextMapQuestion());
  }

  const pins = document.querySelectorAll(".map-pin");
  pins.forEach(pin => {
    pin.addEventListener("click", () => {
      const targetName = pin.getAttribute("data-target");
      evaluateMapSelection(targetName, pin);
    });
  });
}

let currentMapTarget = null;
function loadNextMapQuestion() {
  const randomIndex = Math.floor(Math.random() * MAP_TARGETS_DATA.length);
  currentMapTarget = MAP_TARGETS_DATA[randomIndex];

  document.getElementById("map-target-name").textContent = `${currentMapTarget.name} (${currentMapTarget.type})`;
  document.getElementById("map-feedback-box").textContent = "Click on the matching pin on the world map!";
  document.getElementById("map-feedback-box").style.backgroundColor = "var(--bg-card)";
  document.getElementById("map-feedback-box").style.color = "var(--text-main)";

  document.querySelectorAll(".pin-circle").forEach(c => c.style.fill = "var(--accent-red)");
}

function evaluateMapSelection(selectedName, pinElement) {
  if (!currentMapTarget) return;

  const circle = pinElement.querySelector(".pin-circle");
  const feedback = document.getElementById("map-feedback-box");

  srs.state.mapScore.total++;

  if (selectedName === currentMapTarget.name) {
    srs.state.mapScore.correct++;
    if (circle) circle.style.fill = "var(--accent-green)";
    feedback.textContent = `🎯 CORRECT! Identified ${selectedName} in ${currentMapTarget.location}!`;
    feedback.style.backgroundColor = "rgba(34, 197, 94, 0.2)";
    feedback.style.color = "#22c55e";
  } else {
    if (circle) circle.style.fill = "var(--accent-red)";
    feedback.textContent = `❌ WRONG PIN! You clicked ${selectedName}. Correct location for ${currentMapTarget.name} is ${currentMapTarget.location}.`;
    feedback.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
    feedback.style.color = "#ef4444";
  }

  document.getElementById("map-score-val").textContent = `${srs.state.mapScore.correct} / ${srs.state.mapScore.total}`;
  srs.saveState();
}

/* 7. Numerical Training Engine */
function setupNumericalTrainingMode() {
  const submitBtn = document.getElementById("btn-submit-numerical");
  const nextBtn = document.getElementById("btn-next-numerical");

  if (submitBtn) submitBtn.addEventListener("click", () => evaluateNumericalAnswer());
  if (nextBtn) nextBtn.addEventListener("click", () => loadNextNumericalProblem());
}

function loadNextNumericalProblem() {
  const randomIndex = Math.floor(Math.random() * NUMERICAL_PROBLEMS_DATA.length);
  currentNumProblem = NUMERICAL_PROBLEMS_DATA[randomIndex];

  const problemBox = document.getElementById("num-problem-box");
  problemBox.innerHTML = `
    <h3>Location: ${currentNumProblem.city}</h3>
    <p style="margin-top:6px;"><strong>Max Temperature ($T_{max}$):</strong> ${currentNumProblem.maxTemp} °C</p>
    <p><strong>Min Temperature ($T_{min}$):</strong> ${currentNumProblem.minTemp} °C</p>
    <p style="margin-top:8px; font-size:0.9rem; color:#94a3b8;"><strong>Recorded Hourly Readings:</strong> [ ${currentNumProblem.hourlyReadings.join("°C, ")}°C ]</p>
  `;

  document.getElementById("num-user-range").value = "";
  document.getElementById("num-user-mean").value = "";
  document.getElementById("num-solution-box").classList.add("hidden");
}

function evaluateNumericalAnswer() {
  if (!currentNumProblem) return;

  const userRange = parseFloat(document.getElementById("num-user-range").value);
  const userMean = parseFloat(document.getElementById("num-user-mean").value);

  if (isNaN(userRange) || isNaN(userMean)) {
    alert("Please calculate and enter both Diurnal Range and Daily Mean Temperature!");
    return;
  }

  const exactRange = currentNumProblem.range;
  const exactMean = currentNumProblem.mean;

  const isRangeCorrect = Math.abs(userRange - exactRange) <= 0.2;
  const isMeanCorrect = Math.abs(userMean - exactMean) <= 0.2;

  const sumReadings = currentNumProblem.hourlyReadings.reduce((a, b) => a + b, 0).toFixed(1);
  const countReadings = currentNumProblem.hourlyReadings.length;

  const solutionContent = document.getElementById("num-solution-content");
  solutionContent.innerHTML = `
    <p>${isRangeCorrect ? "✅" : "❌"} <strong>Diurnal Range Calculation:</strong><br>
       Formula: $T_{max} - T_{min}$ = ${currentNumProblem.maxTemp} °C - ${currentNumProblem.minTemp} °C = <strong>${exactRange} °C</strong> (Your Answer: ${userRange} °C)
    </p>
    <p style="margin-top:10px;">${isMeanCorrect ? "✅" : "❌"} <strong>Daily Mean Temperature Calculation:</strong><br>
       Formula: $\\frac{\\text{Sum of Readings}}{\\text{Total Readings}}$ = $\\frac{${sumReadings}}{${countReadings}}$ = <strong>${exactMean} °C</strong> (Your Answer: ${userMean} °C)
    </p>
  `;

  document.getElementById("num-solution-box").classList.remove("hidden");

  const isOverallCorrect = isRangeCorrect && isMeanCorrect;
  srs.recordAttempt(currentNumProblem.id, "topic-2", isOverallCorrect ? "correct" : "wrong");
  updateHeaderStats();
}

/* 8. 5-Hour Cram Mode */
function setupCram5HrMode() {
  const startBtn = document.getElementById("btn-start-5hr");
  const pauseBtn = document.getElementById("btn-pause-5hr");
  const resetBtn = document.getElementById("btn-reset-5hr");

  if (startBtn) startBtn.addEventListener("click", start5HrTimer);
  if (pauseBtn) pauseBtn.addEventListener("click", pause5HrTimer);
  if (resetBtn) resetBtn.addEventListener("click", reset5HrTimer);
}

function start5HrTimer() {
  if (cramTimerInterval) return;

  const headerTimer = document.getElementById("header-cram-timer");
  if (headerTimer) headerTimer.classList.remove("hidden");

  cramTimerInterval = setInterval(() => {
    if (cramSeconds > 0) {
      cramSeconds--;
      update5HrClockDisplay();
    } else {
      clearInterval(cramTimerInterval);
      alert("⏱️ 5-Hour Cram Session Complete! You are ready for the SSLC exam!");
    }
  }, 1000);
}

function pause5HrTimer() {
  clearInterval(cramTimerInterval);
  cramTimerInterval = null;
}

function reset5HrTimer() {
  pause5HrTimer();
  cramSeconds = 5 * 3600;
  update5HrClockDisplay();
}

function update5HrClockDisplay() {
  const h = Math.floor(cramSeconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((cramSeconds % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(cramSeconds % 60).toString().padStart(2, "0");

  const timeStr = `${h}:${m}:${s}`;
  const clockEl = document.getElementById("cram-main-clock");
  const headerEl = document.getElementById("header-cram-timer");

  if (clockEl) clockEl.textContent = timeStr;
  if (headerEl) headerEl.textContent = `⏱️ ${timeStr}`;
}

function renderCramQueue() {
  const container = document.getElementById("cram-queue-container");
  if (!container) return;

  container.innerHTML = "";

  // Prioritization formula: frequency * expectedMarks * weaknessFactor
  const prioritized = TOPICS_DATA.map(topic => {
    const wFactor = srs.getWeaknessFactor(topic.id);
    const score = Math.round(topic.frequency * topic.expectedMarks * wFactor);
    return { ...topic, cramScore: score, weaknessFactor: wFactor };
  }).sort((a, b) => b.cramScore - a.cramScore);

  prioritized.forEach((item, index) => {
    const status = srs.getTopicStatus(item.id);
    const div = document.createElement("div");
    div.className = "cram-item";
    div.innerHTML = `
      <div class="cram-item-info">
        <span>#${index + 1} <strong>${item.title}</strong></span>
        <div style="font-size:0.78rem; color:#94a3b8; margin-top:2px;">
          Freq: ${item.frequency}% | Exp Marks: ${item.expectedMarks} | Cram Weight Score: ${item.cramScore}
        </div>
      </div>
      <div>
        <button class="btn btn-primary btn-cram-study" data-topic-id="${item.id}" style="padding:4px 10px; font-size:0.8rem;">
          Cram Topic ⚡
        </button>
      </div>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".btn-cram-study").forEach(btn => {
    btn.addEventListener("click", () => {
      const topicId = btn.getAttribute("data-topic-id");
      const filterSelect = document.getElementById("recall-topic-filter");
      if (filterSelect) filterSelect.value = topicId;

      const recallNavBtn = document.querySelector('.nav-btn[data-target="recall-view"]');
      if (recallNavBtn) recallNavBtn.click();
    });
  });
}

/* 9. Last 30 Minutes View */
function setupLast30MinMode() {
  renderLast30MinCards();
}

function renderLast30MinCards() {
  const container = document.getElementById("last30-container");
  if (!container) return;

  container.innerHTML = "";

  LAST_30_MIN_FACTS.forEach(item => {
    const card = document.createElement("div");
    card.className = "flashcard";
    card.innerHTML = `
      <div class="flashcard-topic">🚨 ${item.topic}</div>
      <div class="flashcard-fact">${item.fact}</div>
    `;
    container.appendChild(card);
  });
}

/* 10. Final Boss 30-Question Exam Mode */
function setupFinalBossMode() {
  const startBtn = document.getElementById("btn-start-boss");
  const nextBtn = document.getElementById("btn-boss-next");
  const restartBtn = document.getElementById("btn-restart-boss");

  if (startBtn) startBtn.addEventListener("click", startFinalBossExam);
  if (nextBtn) nextBtn.addEventListener("click", handleBossNextQuestion);
  if (restartBtn) restartBtn.addEventListener("click", startFinalBossExam);
}

function startFinalBossExam() {
  // Generate 30 random/mixed questions across topics
  bossQuestions = [];
  bossUserAnswers = [];
  bossCurrentIndex = 0;

  // Pool all questions and duplicate if necessary to reach 30
  let pool = [...QUESTIONS_DATA];
  while (pool.length < 30) {
    pool = pool.concat([...QUESTIONS_DATA]);
  }

  // Shuffle pool
  pool.sort(() => Math.random() - 0.5);
  bossQuestions = pool.slice(0, 30);

  document.getElementById("boss-start-container").classList.add("hidden");
  document.getElementById("boss-result-container").classList.add("hidden");
  document.getElementById("boss-quiz-container").classList.remove("hidden");

  renderBossQuestion();
}

function renderBossQuestion() {
  const q = bossQuestions[bossCurrentIndex];
  const topicObj = TOPICS_DATA.find(t => t.id === q.topicId);

  document.getElementById("boss-q-num").textContent = `Question ${bossCurrentIndex + 1} of 30`;
  document.getElementById("boss-topic-tag").textContent = topicObj ? topicObj.title : "General";
  document.getElementById("boss-question-text").textContent = q.question;

  const progressPct = ((bossCurrentIndex + 1) / 30) * 100;
  document.getElementById("boss-progress-fill").style.width = `${progressPct}%`;

  const inputContainer = document.getElementById("boss-input-container");
  inputContainer.innerHTML = "";

  if (q.options && q.options.length > 0) {
    const grid = document.createElement("div");
    grid.className = "options-grid";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn boss-opt-btn";
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".boss-opt-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        btn.dataset.val = opt;
      });
      grid.appendChild(btn);
    });
    inputContainer.appendChild(grid);
  } else {
    const textarea = document.createElement("textarea");
    textarea.className = "custom-textarea";
    textarea.id = "boss-text-input";
    textarea.rows = 4;
    textarea.placeholder = "Type your complete answer here...";
    inputContainer.appendChild(textarea);
  }
}

function handleBossNextQuestion() {
  const q = bossQuestions[bossCurrentIndex];
  let answerGiven = "";

  const selectedOpt = document.querySelector(".boss-opt-btn.selected");
  const textInput = document.getElementById("boss-text-input");

  if (selectedOpt) {
    answerGiven = selectedOpt.dataset.val;
  } else if (textInput) {
    answerGiven = textInput.value.trim();
  }

  bossUserAnswers.push({
    question: q,
    userAnswer: answerGiven || "(Blank)"
  });

  bossCurrentIndex++;

  if (bossCurrentIndex < 30) {
    renderBossQuestion();
  } else {
    finishBossExam();
  }
}

function finishBossExam() {
  document.getElementById("boss-quiz-container").classList.add("hidden");
  document.getElementById("boss-result-container").classList.remove("hidden");

  let correctCount = 0;

  const breakdownContainer = document.getElementById("boss-detailed-breakdown");
  breakdownContainer.innerHTML = "";

  bossUserAnswers.forEach((item, idx) => {
    const q = item.question;
    const userAns = item.userAnswer;

    let isCorrect = false;
    if (q.options) {
      isCorrect = userAns.includes(q.correctAnswer) || q.correctAnswer.includes(userAns);
    } else {
      isCorrect = userAns.length > 5; // Simple heuristic for written attempts in trial exam
    }

    if (isCorrect) correctCount++;

    const div = document.createElement("div");
    div.style.marginBottom = "12px";
    div.style.padding = "10px";
    div.style.backgroundColor = isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)";
    div.style.borderLeft = `4px solid ${isCorrect ? '#22c55e' : '#ef4444'}`;
    div.style.borderRadius = "4px";

    div.innerHTML = `
      <p><strong>Q${idx + 1}: ${q.question}</strong></p>
      <p style="font-size:0.85rem; margin-top:4px;">Your Answer: <span style="color:${isCorrect ? '#22c55e' : '#ef4444'};">${userAns}</span></p>
      <p style="font-size:0.85rem; color:#f8fafc; margin-top:2px;">Model Answer: ${q.correctAnswer}</p>
    `;
    breakdownContainer.appendChild(div);

    srs.recordAttempt(q.id, q.topicId, isCorrect ? "correct" : "wrong");
  });

  document.getElementById("boss-final-score").textContent = `${correctCount} / 30`;
  const pct = Math.round((correctCount / 30) * 100);
  document.getElementById("boss-readiness-label").textContent = `Exam Readiness Level: ${pct}%`;

  srs.state.bossCompleted = true;
  srs.state.bossScore = correctCount;
  srs.saveState();

  updateHeaderStats();
}

function renderProgressDashboard() {
  const readiness = srs.getExamReadiness();
  const accuracy = srs.getAccuracy();

  const progReadiness = document.getElementById("prog-readiness");
  const progAttempted = document.getElementById("prog-attempted");
  const progAccuracy = document.getElementById("prog-accuracy");
  const progMasteredCount = document.getElementById("prog-mastered-count");

  if (progReadiness) progReadiness.textContent = `${readiness}%`;
  if (progAttempted) progAttempted.textContent = srs.state.attemptedCount;
  if (progAccuracy) progAccuracy.textContent = `${accuracy}%`;

  let masteredCount = 0;
  const weakList = document.getElementById("prog-weak-list");
  const masteredList = document.getElementById("prog-mastered-list");

  if (weakList) weakList.innerHTML = "";
  if (masteredList) masteredList.innerHTML = "";

  TOPICS_DATA.forEach(t => {
    const status = srs.getTopicStatus(t.id);
    const stats = srs.state.topicStats[t.id] || { attempted: 0, correct: 0 };
    const topicAcc = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;

    const li = document.createElement("li");
    li.innerHTML = `<span><strong>${t.title}</strong></span><span>${topicAcc}% acc (${stats.attempted} att)</span>`;

    if (status === "WEAK" && weakList) {
      weakList.appendChild(li);
    } else if (status === "MASTERED" && masteredList) {
      masteredCount++;
      masteredList.appendChild(li);
    }
  });

  if (weakList && weakList.children.length === 0) {
    weakList.innerHTML = `<li style="color:#22c55e;">No weak topics identified yet! Keep practicing.</li>`;
  }
  if (masteredList && masteredList.children.length === 0) {
    masteredList.innerHTML = `<li style="color:#94a3b8;">No topics mastered yet. Complete questions with high accuracy.</li>`;
  }

  if (progMasteredCount) progMasteredCount.textContent = `${masteredCount} / ${TOPICS_DATA.length}`;
}
