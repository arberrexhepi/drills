window.onload = () => {
   for (let i = 1; i < 99999; i++) window.clearInterval(i);

  const comboSets = {
    "Jeet Kune Do + Muay Thai Hybrid": [
      "Start with a Jeet Kune Do lead straight to intercept your opponent’s advance. Follow it immediately with a powerful Muay Thai roundhouse kick. Stay sharp, in and out.",
      "Use a flick jab to test their guard, then land a clean cross. As they react, chop their lead leg with a Muay Thai low kick. Jab, cross, low kick.",
      "Trap their lead hand briefly, clearing the line. Now step in with a horizontal elbow, then enter the Muay Thai clinch. Control their posture and get ready to knee.",
      "Feint the lead hand to draw a reaction. Step outside the line and throw a switch kick to the body. Land and angle out.",
      "Throw a Jeet Kune Do stop kick to their thigh as they step forward. Now close the gap with a diagonal elbow, and reset your stance.",
      "Final push. Jab, cross. Quick step to the side. Teep kick to create distance. Stay mobile, jab, cross, angle, teep.",
    ],
    "Boxing Fundamentals": [
      "Start with a double jab followed by a right cross.",
      "Slip to the outside and return with a hook to the body.",
      "Duck under and counter with a shovel uppercut.",
    ],
    "Taekwondo Precision Kicks": [
      "Chamber and snap a fast front kick.",
      "Follow up with a spinning hook kick to the head.",
      "Reset and throw a fast axe kick, then step off line.",
    ],
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

  function playComboTwice(index, callback) {
    const combos = comboSets[selectedSetKey];
    if (index >= combos.length) {
      stopDrill();
      statusEl.textContent = "Drill complete! Great job!";
      return;
    }

    const line = combos[index];
    statusEl.textContent = `Combo ${index + 1}: ${line}`;
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
      stopDrill();
    }
  });

  window.addEventListener("click", () => {
    speechSynthesis.cancel();
    loadVoices();
  });

  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
};
