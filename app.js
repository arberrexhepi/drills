window.onload = () => {
   
    for (let i = 1; i < 99999; i++) window.clearInterval(i);

const comboSets = {
  "Muay Thai – Attack (Using 5 Methods of JKD)": [
    // 1. Single Direct Attack (SDA)
    "From stance, deliver a single explosive rear roundhouse kick to the bag—no telegraph, full commitment.",
    // 2. Attack By Combination (ABC)
    "Jab to rear elbow, then a hard low kick. Reset. Keep it tight and fluid.",
    // 3. Hand Immobilization Attack (HIA)
    "Simulate trapping their guard with your lead hand (touch the bag), then step in with a sharp horizontal elbow. Follow with a right knee.",
    // 4. Progressive Indirect Attack (PIA)
    "Feint a low kick to shift their guard, then whip a high switch kick to the opposite side. Read the bag’s sway.",
    // 5. Attack by Drawing (ABD)
    "Step back slightly and lower your guard to bait the attack, then return with a fast teep to the bag’s center, followed by a cross and rear elbow."
  ],

  "Muay Thai – Defence": [
    "Check the bag’s swing with a solid shin block. Return immediately with a cross to establish control.",
    "Parry the imaginary jab and counter with a lead hook, then angle off and teep the bag to reset.",
    "Slip right, step left. Throw a fast body hook. Pivot and regain center control.",
    "Simulate catching a kick. Scoop with the rear hand and slam a hard low kick in return.",
    "Cover high against a swing. Return fire with a horizontal elbow and reset."
  ],

  "Muay Thai – Footwork": [
    "Circle left while jabbing the bag. At every third jab, drop in a low kick, then continue circling.",
    "Forward shuffle step with double jab. Step back and teep to control distance.",
    "Step offline diagonally, land a body cross. Step again and switch kick. Emphasize balance.",
    "Pendulum step in with a jab, cross. Pendulum out with a switch teep to regain range.",
    "Step right, jab. Step left, hook. Constant motion. Keep the bag centered but never stationary."
  ]
};


  let selectedSetKey = null;
  let interval = null;
  let currentIndex = 0;
  let drillRunning = false;
  let availableVoices = [];
  let selectedVoice = null;

  const statusEl = document.getElementById("status");
  const startBtn = document.getElementById("startButton");
  const selectorEl = document.getElementById("comboSelector");

  const modal = document.getElementById("confirmModal");
  const confirmBtn = document.getElementById("confirmStop");
  const cancelBtn = document.getElementById("cancelStop");
  let modalTimeout = null;

  function loadVoices() {
    availableVoices = speechSynthesis.getVoices();
    if (availableVoices.length) {
      const preferred = ["Google US English", "Samantha", "Alex"];
      selectedVoice =
        preferred
          .map((name) => availableVoices.find((v) => v.name === name))
          .find(Boolean) ||
        availableVoices.find((v) => v.lang.startsWith("en")) ||
        availableVoices[0];
    }
  }

  function ensureVoiceReady(callback) {
    loadVoices();
    if (selectedVoice) {
      callback();
    } else {
      const voiceWaiter = setInterval(() => {
        loadVoices();
        if (selectedVoice) {
          clearInterval(voiceWaiter);
          callback();
        }
      }, 200);
    }
  }

  function beepSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (err) {
      console.warn("[Beep] Error:", err);
    }
  }

  function speak(text, onDone) {
    if (!selectedVoice) {
      if (onDone) onDone();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
    utterance.rate = 1;
    utterance.onend = () => onDone && onDone();
    utterance.onerror = () => onDone && onDone();
    speechSynthesis.speak(utterance);
  }

  function lockCards() {
    document.querySelectorAll("#comboSelector button").forEach((btn) => {
      btn.classList.add("locked");
    });
  }

  function unlockCards() {
    document.querySelectorAll("#comboSelector button").forEach((btn) => {
      btn.classList.remove("locked", "active");
    });
  }

  function playComboTwice(index, callback) {
    const combos = comboSets[selectedSetKey];
    if (index >= combos.length) {
      stopDrill();
      statusEl.textContent = "Drill complete! Great job!";
      return;
    }

    const line = combos[index];
    statusEl.textContent = `Combo ${index + 1}: ${line}`;

    const allButtons = document.querySelectorAll("#comboSelector button");
    allButtons.forEach((btn) => btn.classList.remove("active"));

    const selectedButton = Array.from(allButtons).find(
      (btn) => btn.textContent.trim() === selectedSetKey
    );
    if (selectedButton) selectedButton.classList.add("active");

    beepSound();
    setTimeout(() => {
      speak(line, () => {
        setTimeout(() => {
          speak("Again for this drill. " + line, () => callback && callback());
        }, 500);
      });
    }, 500);
  }

  function startDrill() {
    if (!selectedSetKey) {
      alert("Please select a combo set first.");
      return;
    }

    ensureVoiceReady(() => {
      currentIndex = 0;
      drillRunning = true;
      lockCards();
      startBtn.textContent = "Stop Drill";

      playComboTwice(currentIndex, function next() {
        currentIndex++;
        setTimeout(() => {
          if (drillRunning) playComboTwice(currentIndex, next);
        }, 30000);
      });
    });
  }

  function stopDrill() {
    drillRunning = false;
    clearInterval(interval);
    speechSynthesis.cancel();
    unlockCards();
    currentIndex = 0;
    startBtn.textContent = "Start Drill";
    statusEl.textContent = "Drill stopped.";
  }

  // UI Initialization
  Object.keys(comboSets).forEach((key) => {
    const card = document.createElement("button");
    card.className =
      "bg-white border hover:shadow-lg p-4 rounded-xl text-left transition-all";
    card.textContent = key;
    card.addEventListener("click", () => {
      selectedSetKey = key;
      document.querySelectorAll("#comboSelector button").forEach((btn) => {
        btn.classList.remove("selected");
      });
      card.classList.add("selected");
      statusEl.textContent = `Selected: ${key}`;
    });
    selectorEl.appendChild(card);
  });

  startBtn.addEventListener("click", () => {
    if (!drillRunning) {
      startDrill();
    } else {
      showStopDrillConfirmation();
    }
  });

  function showStopDrillConfirmation() {
    modal.classList.remove("hidden");

    // Auto-hide after 5 seconds if no response
    modalTimeout = setTimeout(() => {
      hideModal();
    }, 5000);
  }

  function hideModal() {
    modal.classList.add("hidden");
    clearTimeout(modalTimeout);
  }

  confirmBtn.addEventListener("click", () => {
    hideModal();
    stopDrill();
  });

  cancelBtn.addEventListener("click", () => {
    hideModal();
  });

  if (!localStorage.getItem("ttsInitialized")) {
    window.addEventListener("click", initTTSOnce, { once: true });

    function initTTSOnce() {
      console.log("[Init] First interaction – initializing TTS");
      speechSynthesis.cancel();
      loadVoices();
      localStorage.setItem("ttsInitialized", "true");
    }
  } else {
    console.log("[Init] TTS already initialized – skipping preload listener");
  }
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
};
