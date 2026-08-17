/* Spaced Repetition (SRS) & LocalStorage State Manager */

const STORAGE_KEY = "sslc_ss_cram_state_v1";

class SRSManager {
  constructor() {
    this.state = this.loadState();
  }

  getInitialState() {
    return {
      attemptedCount: 0,
      correctCount: 0,
      partialCount: 0,
      wrongCount: 0,
      srsBoxes: {}, // questionId -> Leitner box number (1 to 5)
      topicStats: {}, // topicId -> { attempted, correct, wrong }
      mapScore: { correct: 0, total: 0 },
      cramTimeRemaining: 5 * 3600, // 5 hours in seconds
      cramTimerActive: false,
      bossCompleted: false,
      bossScore: 0
    };
  }

  loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
    return this.getInitialState();
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }

  resetAllState() {
    this.state = this.getInitialState();
    this.saveState();
  }

  getQuestionSRSBox(qId) {
    return this.state.srsBoxes[qId] || 1;
  }

  recordAttempt(qId, topicId, grade) {
    this.state.attemptedCount++;

    // Update SRS Leitner Box
    let currentBox = this.getQuestionSRSBox(qId);
    if (grade === "correct") {
      this.state.correctCount++;
      currentBox = Math.min(5, currentBox + 1);
    } else if (grade === "partial") {
      this.state.partialCount++;
      // Partial remains in same box or resets to box 2
      currentBox = Math.max(1, currentBox);
    } else {
      this.state.wrongCount++;
      // Wrong moves question back to Box 1 immediately (Spaced Repetition reset)
      currentBox = 1;
    }
    this.state.srsBoxes[qId] = currentBox;

    // Update Topic-specific stats
    if (!this.state.topicStats[topicId]) {
      this.state.topicStats[topicId] = { attempted: 0, correct: 0, wrong: 0 };
    }
    const tStats = this.state.topicStats[topicId];
    tStats.attempted++;
    if (grade === "correct") tStats.correct++;
    if (grade === "wrong") tStats.wrong++;

    this.saveState();
  }

  getAccuracy() {
    if (this.state.attemptedCount === 0) return 0;
    return Math.round((this.state.correctCount / this.state.attemptedCount) * 100);
  }

  getExamReadiness() {
    if (this.state.attemptedCount === 0) return 0;
    // Formula: (Accuracy * 0.6) + (Mastery Coverage * 0.4)
    const accuracy = this.getAccuracy();
    const totalTopics = TOPICS_DATA.length;
    let masteredCount = 0;

    TOPICS_DATA.forEach(t => {
      const stats = this.state.topicStats[t.id];
      if (stats && stats.attempted >= 2 && (stats.correct / stats.attempted) >= 0.7) {
        masteredCount++;
      }
    });

    const masteryRatio = (masteredCount / totalTopics) * 100;
    const readiness = Math.min(100, Math.round((accuracy * 0.6) + (masteryRatio * 0.4)));
    return readiness;
  }

  getTopicStatus(topicId) {
    const stats = this.state.topicStats[topicId];
    if (!stats || stats.attempted === 0) return "NEUTRAL";
    const acc = stats.correct / stats.attempted;
    if (stats.attempted >= 2 && acc >= 0.7) return "MASTERED";
    if (stats.wrong >= 1 || acc < 0.5) return "WEAK";
    return "NEUTRAL";
  }

  getWeaknessFactor(topicId) {
    const status = this.getTopicStatus(topicId);
    if (status === "WEAK") return 3.0; // High multiplier for weak topics
    if (status === "NEUTRAL") return 1.5;
    return 0.5; // Mastered topics lower weight
  }

  // Confirmation modal prompt helper for skips
  confirmSkip(onConfirm) {
    const modal = document.getElementById("skip-modal");
    if (!modal) return;

    modal.classList.remove("hidden");

    const cancelBtn = document.getElementById("modal-btn-cancel");
    const confirmBtn = document.getElementById("modal-btn-confirm");

    const closeHandler = () => {
      modal.classList.add("hidden");
      cancelBtn.removeEventListener("click", closeHandler);
      confirmBtn.removeEventListener("click", confirmHandler);
    };

    const confirmHandler = () => {
      closeHandler();
      if (onConfirm) onConfirm();
    };

    cancelBtn.addEventListener("click", closeHandler);
    confirmBtn.addEventListener("click", confirmHandler);
  }
}

// Global instance
const srs = new SRSManager();
