window.onload = () => {
   

  for (let i = 1; i < 99999; i++) window.clearInterval(i);

const comboSets = {
  "Muay Thai – Attack (5 Methods of JKD)": [
    // SDA – Single Direct Attack
    "Start with a Jeet Kune Do lead straight to intercept. Immediately follow up with a Muay Thai roundhouse. Enter, strike, exit clean.",
    
    // ABC – Attack By Combination
    "Jab to flick jab, then cross. As they react, hammer the lead leg with a low kick. Jab, cross, low kick.",
    
    // HIA – Hand Immobilization Attack
    "Simulate trapping their lead hand (touch or pin the bag), then fire a horizontal elbow. Clinch and deliver two strong knees.",
    
    // PIA – Progressive Indirect Attack
    "Feint a low kick to shift their weight. Switch kick to the body as they adjust. Reset and pivot out.",
    
    // ABD – Attack By Drawing
    "Step back and lower your guard slightly to draw them in. Fire a teep to the midline, then cross and follow with a diagonal elbow.",
  ],

  "Muay Thai – Defence": [
    "Check an imaginary kick with your lead shin, then return immediately with a cross and a low kick.",
    "Parry the incoming jab, counter with a lead hook, then teep the bag to regain space.",
    "Slip outside the centerline and throw a fast rear uppercut. Angle out and stay light.",
    "Catch and scoop the imagined kick. Slam a rear low kick to finish the exchange.",
    "Cover and shell against pressure. Explode with a lead elbow and step off at an angle."
  ],

  "Muay Thai – Footwork & Mobility": [
    "Circle left while peppering the bag with jabs. On the third jab, drop a low kick, then continue circling.",
    "Step in with jab, jab. Retreat with a teep. Control the centerline and range.",
    "Pendulum step in with jab-cross. Pendulum out with a switch teep to reset distance.",
    "Step diagonally offline, land a cross to the bag's side. Follow with a switch kick, then reset.",
    "Angle right with a jab, step left into a hook. Stay light and mobile—bag centered, feet active."
  ],

"Boxing Fundamentals": [
  "Double jab to measure distance. Fire a sharp cross down the center. Keep your head moving between shots.",
  "Slip outside the bag's line and dig a hook to the body. Rise with a cross. Reset with light footwork.",
  "Duck under as if avoiding a hook. Come up with a rear shovel uppercut. Follow with a lead hook to the head.",
  "Jab to the head, jab to the body, cross upstairs. Mix your levels to confuse and break the guard.",
  "Roll under a punch, step in, and throw a compact 3-punch combo: hook–cross–hook. Maintain tight form and balance."
],

   "Boxing Fundamentals 2": [
  // 1. Single Direct Attack (SDA)
  "Step into range and land a sharp, committed cross down the pipe. One strike, full intent. Reset immediately.",
  
  // 2. Attack By Combination (ABC)
  "Jab to the head, jab to the body, rise with a rear uppercut, then finish with a lead hook. Flow seamlessly through each shot.",
  
  // 3. Hand Immobilization Attack (HIA)
  "Simulate pinning or framing the guard with your lead hand, then fire a short-range rear straight. Follow with a clinch-entry elbow or frame off.",
  
  // 4. Progressive Indirect Attack (PIA)
  "Feint a jab to the head, then throw a lead hook to the body. Rise with a rear hook to the head. Use rhythm breaks to open the guard.",
  
  // 5. Attack by Drawing (ABD)
  "Drop your level and posture slightly to bait a counter. As the bag swings in, step off line and counter with a jab–cross–pivot out. Make them chase shadows."
],

"Taekwondo Precision Kicks": [
  "Chamber high and snap a lightning-fast front kick to the bag’s core. Keep posture upright and recover clean.",
  "Spin into a tight hook kick, striking with the heel at eye level. Reset with a pivot or bounce back.",
  "Fire an axe kick straight down onto the bag. Imagine striking collarbone-level. Step off line after impact.",
  "Lead with a side kick to the ribs. Full chamber, then extend with control and recoil. Stay bladed.",
  "Feint low, then leap into a jumping roundhouse kick. Land soft and square up immediately. Flashy but controlled."
],
};


  let selectedSetKey = null;
  let interval = null;
  let currentIndex = 0;
  let drillRunning = false;
  let availableVoices = [];
  let selectedVoice = null;
  let timerInterval = null;
  let timeLeft = 30;

  const statusEl = document.getElementById("status");
  const startBtn = document.getElementById("startButton");
  const selectorEl = document.getElementById("comboSelector");

  const modal = document.getElementById("confirmModal");
  const confirmBtn = document.getElementById("confirmStop");
  const cancelBtn = document.getElementById("cancelStop");

  let modalTimeout = null;

  function startTimer() {
    clearInterval(timerInterval);

    const circle = document.querySelector("#roundTimer .fg");
    const text = document.querySelector("#roundTimer .timer-text");

    if (!circle || !text) {
      console.warn("Timer SVG elements not found.");
      return;
    }

    timeLeft = 30;
    circle.style.strokeDashoffset = 0;
    text.textContent = "30";

    timerInterval = setInterval(() => {
      timeLeft--;
      const offset = 1 - timeLeft / 30;
      circle.style.strokeDashoffset = offset;
      text.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    const circle = document.querySelector("#roundTimer .fg");
    const text = document.querySelector("#roundTimer .timer-text");
    circle.style.strokeDashoffset = 1;
    text.textContent = "--";
  }

  function updateComboList(index = -1) {
    const listEl = document.getElementById("comboList");
    listEl.innerHTML = "";

    if (!selectedSetKey) return;
    const combos = comboSets[selectedSetKey];

    combos.forEach((line, i) => {
      const div = document.createElement("div");
      div.textContent = `• ${line}`;
      div.className = "combo-line" + (i === index ? " active-line" : "");
      listEl.appendChild(div);
    });
  }

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
    updateComboList(index);
    startTimer();

    // Highlight card
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
        if (drillRunning) {
          setTimeout(() => {
            playComboTwice(currentIndex, next);
          }, 30000);
        }
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
    stopTimer();
    updateComboList(-1);
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

  // Always preload voices, but wait for user interaction to allow playback
  window.addEventListener(
    "click",
    () => {
      console.log("[Init] User interaction – loading voices");
      speechSynthesis.cancel();
      loadVoices();
    },
    { once: true }
  );

  // Reload voices if available changes
  window.speechSynthesis.onvoiceschanged = () => {
    console.log("[Voice] voiceschanged event fired");
    loadVoices();
  };
};
