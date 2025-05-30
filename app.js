window.onload = () => {
  const combos = [
    "Start with a Jeet Kune Do lead straight to intercept your opponent’s advance. Follow it immediately with a powerful Muay Thai roundhouse kick. Stay sharp, in and out.",
    "Use a flick jab to test their guard, then land a clean cross. As they react, chop their lead leg with a Muay Thai low kick. Jab, cross, low kick.",
    "Trap their lead hand briefly, clearing the line. Now step in with a horizontal elbow, then enter the Muay Thai clinch. Control their posture and get ready to knee.",
    "Feint the lead hand to draw a reaction. Step outside the line and throw a switch kick to the body. Land and angle out.",
    "Throw a Jeet Kune Do stop kick to their thih as they step forward. Now close the gap with a diagonal elbow, and reset your stance.",
    "Final push. Jab, cross. Quick step to the side. Teep kick to create distance. Stay mobile, jab, cross, angle, teep."
  ];

  let interval = null;
  let currentIndex = 0;
  let drillRunning = false;
  let availableVoices = [];
  let selectedVoice = null;

  function loadVoices() {
    availableVoices = speechSynthesis.getVoices();
    if (availableVoices.length) {
      selectedVoice = availableVoices.find(V => V.name.includes("Google") || V.lang === "en-US") || availableVoices[0];
      console.log("[Voice] Selected: ", selectedVoice.name);
    } else {
      console.warn("[Voice] No voices available yet. Waiting...");
    }
  }

  function beepSound() {
    console.log("[Beep] Triggered");
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, ctx.startTime);
      oscillator.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (err) {
      console.warn("[Beep] AudioContext error:", err);
    }
  }

  function speak(text) {
    if (!selectedVoice) {
      console.warn("[Speak] No voice available yet. Skipping speech.");
      return;
    }
    console.log("[Speak] Speaking...", text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
    utterance.rate = 1;
    utterance.onstart = () => console.log("[Speak] Speech started");
    utterance.onend = () => console.log("[Speak] Speech ended");
    utterance.onerror = (e) => console.error("[Speak] Speech error:", e);
    speechSynthesis.speak(utterance);
  }

  function startDrill() {
    ensureVoiceReady(() => {
      console.log("[Drill] Starting");
      document.getElementById("status").textContent = "Drill started. Listen closely!";
      document.getElementById("startButton").textContent = "Stop Drill";
      drillRunning = true;

      interval = setInterval(() => {
        if (currentIndex >= combos.length) {
          stopDrill();
          document.getElementById("status").textContent = "Drill complete! Great job!";
          return;
        }

        beepSound();
        setTimeout(() => speak(combos[currentIndex]), 500);
        document.getElementById("status").textContent = `Combo ${currentIndex + 1}: ${combos[currentIndex]`;
        currentIndex++;
      }, 3000);
    });
    });
  }

  function stopDrill() {
    console.log("[Drill] Stopping");
    clearInterval(interval);
    speechSynthesis.cancel();
    document.getElementById("status").textContent = "Drill stopped.";
    document.getElementById("startButton").textContent = "Start Drill";
    currentIndex = 0;
    drillRunning = false;
  }

  window.addEventListener("click", () => {
    console.log("[Init] User interaction detected – warming up TTS");
    speechSynthesis.cancel();
    loadVoices();
  });

  window.speechSynthesis.onvoiceschanged = () => {
    console.log("[Voice] voiceschanged event fired");
    loadVoices();
  };

  document.getElementById("startButton").addEventListener("click", () => {
    if (!drillRunning) {
      startDrill();
    } else {
      stopDrill();
    }
  });

  console.log("[Init] Drill system ready. Waiting for interaction...");
};