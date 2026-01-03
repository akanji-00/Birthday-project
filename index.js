document.addEventListener("DOMContentLoaded", () => {
  const bgMusic = document.getElementById("bgMusic");
  const voiceNote = document.getElementById("voiceNote");
  const playVoiceBtn = document.getElementById("playVoiceNoteBtn");
  const darkOverlay = document.getElementById("darkOverlay");
  const finalMessage = document.getElementById("finalMessage");

  // === SET SOURCES EXPLICITLY ===
  bgMusic.src = "/audio/background-music.mp3";
  voiceNote.src = "/audio/voice-note.m4a";

  //Initial audio states
  bgMusic.volume = 0.5;
  bgMusic.preload = "auto";
  voiceNote.preload = "auto";

  let bgmFadeInterval = null;

  // ========== PAGE SWITCHING LOGIC ==============
  const pages = document.querySelectorAll(".page");

  function showPage(id) {
    pages.forEach((page) => page.classList.remove("active"));
    const nextPage = document.getElementById(id);

    if (nextPage) {
      nextPage.classList.add("active");
    }
  }

  // ====== SUBTLE HAPTIC FEEDBACK FUNCTION =======
  function hapticFeedback(duration = 20) {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }

  const landingBtn = document.getElementById("landingBtn");
  // const btnText = landingBtn.querySelector(".btn-text");
  const spinner = landingBtn.querySelector(".spinner");

  // =========== Landing Page Transition ==============
  landingBtn.addEventListener("click", async () => {
    hapticFeedback(15);
    // Prevent double clicks
    landingBtn.disabled = true;

    // Enter loading state
    landingBtn.classList.add("loading");
    setTimeout(() => {
      spinner.classList.remove("spinner-hidden");
    }, 180);

    try {
      //Start background music (user gesture)
      await bgMusic.play();

      //Small intentional delay
      setTimeout(() => {
        showPage("page-2");
        // startBGM();
        startHeart();
      }, 2000);
    } catch (err) {
      console.error("Audio play failed:", err);

      //Restore button if something fails
      landingBtn.disabled = false;
      landingBtn.classList.remove("loading");
      spinner.classList.add("spinner-hidden");
    }
  });

  //SMOOTH FADE OUT FUNCTION
  function fadeOutAudio(audio, duration = 2000) {
    const step = audio.volume / (duration / 50);

    const fade = setInterval(() => {
      if (audio.volume > step) {
        audio.volume -= step;
      } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(fade);
      }
    }, 50);
  }

  // function startBGM() {
  //   bgMusic.volume = 0;
  //   bgMusic.play().catch(() => {});

  //   fadeOutAudio(bgMusic, 0.6, 1500);
  // }

  // function stopBGM() {
  //   fadeOutAudio(bgMusic, 0, 1500, () => {
  //     bgMusic.pause();
  //     bgMusic.currentTime = 0;
  //   });
  // }

  // //Voice Note
  // function playVoiceNote() {
  //   voiceNote.currentTime = 0;
  //   voiceNote.volume = 1;
  //   voiceNote.play();
  // }

  // // Fadeout background music
  // function fadeOutAudio(audio, targetVolume, duration, onComplete) {
  //   clearInterval(bgmFadeInterval);

  //   const steps = 30;
  //   const stepTime = duration / steps;
  //   const volumeStep = (targetVolume - audio.volume) / steps;

  //   let currentStep = 0;

  //   bgmFadeInterval = setInterval(() => {
  //     audio.volume = Math.max(0, Math.min(1, audio.volume + volumeStep));
  //     currentStep++;

  //     if (currentStep >= steps) {
  //       clearInterval(bgmFadeInterval);
  //       audio.volume = targetVolume;
  //       if (onComplete) onComplete();
  //     }
  //   }, stepTime);
  // }

  // ======== Controlled Heart generation =============
  let heartsInterval = null;

  function startHeart() {
    if (heartsInterval) return;

    heartsInterval = setInterval(() => {
      const heart = document.createElement("span");
      heart.className = "heart";
      heart.textContent = "❤️";

      heart.style.left = Math.random() * 100 + "vw";
      heart.style.animationDuration = 6 + Math.random() * 4 + "s";

      document.getElementById("hearts-container").appendChild(heart);

      setTimeout(() => heart.remove(), 10000);
    }, 600);
  }

  function stopHearts() {
    clearInterval(heartsInterval);
    heartsInterval = null;
    document.getElementById("hearts-container").innerHTML = "";
  }

  // TYPEWRITER FUNCTION LOGIC
  const lines = [
    "Akanke mi...",
    "I wanted to do something quiet.",
    "Something that felt like us.",
    "So I made this little page just for you.",
    "Hope you like it❤️.",
  ];
  const typeContainer = document.getElementById("typewriter-lines");
  const toPage3Btn = document.getElementById("toPage3Btn");

  async function typeLine(text) {
    return new Promise((resolve) => {
      const lineEl = document.createElement("div");
      lineEl.className = "type-line";
      typeContainer.appendChild(lineEl);

      let index = 0;
      const typing = setInterval(() => {
        lineEl.textContent += text[index];
        index++;

        if (index === text.length) {
          clearInterval(typing);
          lineEl.classList.add("visible");
          resolve();
        }
      }, 70);
    });
  }

  async function startStackingTypewriter() {
    await new Promise((r) => setTimeout(r, 700)); //initial delay

    for (let i = 0; i < lines.length; i++) {
      await typeLine(lines[i]);
      await new Promise((r) => setTimeout(r, 500)); //pause between lines
    }
    toPage3Btn.classList.remove("hidden");
    toPage3Btn.classList.add("visible-btn");
  }

  //START WHEN PAGE BECOMES ACTIVE
  const observer = new MutationObserver(() => {
    if (document.getElementById("page-2").classList.contains("active")) {
      observer.disconnect();
      startStackingTypewriter();
    }
  });

  observer.observe(document.getElementById("page-2"), {
    attributes: true,
    attributeFilter: ["class"],
  });

  //Navigation placeholder
  toPage3Btn.addEventListener("click", () => {
    hapticFeedback(12);
    showPage("page-3");
  });

  // ========= AFFIRMATIONS LOGIC ==============
  const affirmations = [
    "How deeply you care about your friends and family.",
    "How you make intentional efforts for those around you.",
    "How you smile even when things might be messy inside.",
    "How you worry about the tiniest of details because you are just so passionate about your vision of things.",
    "How you pray on everything no matter how little.",
  ];

  const affirmationList = document.getElementById("affirmationList");
  const affirmationBtn = document.getElementById("affirmationBtn");

  let currentIndex = 0;

  affirmationBtn.addEventListener("click", () => {
    if (currentIndex < affirmations.length) {
      const line = document.createElement("div");
      line.className = "affirmation-line";
      line.textContent = affirmations[currentIndex];
      affirmationList.appendChild(line);

      currentIndex++;

      if (currentIndex === affirmations.length) {
        affirmationBtn.textContent = "Keep going";
      }

      return;
    }

    //Move to next page
    showPage("page-4");
  });

  // ========= Quotes Logic =============
  const quotes = [
    "'Men will leave you in the desert without water'",
    "'You don't love me anymore'",
    "'I put you on the best things'",
    "'Do you even care about me Mohammed'",
    "'I'm just a girl'",
  ];

  const quoteContent = document.getElementById("quoteContent");
  const prevBtn = document.getElementById("prevQuote");
  const nextBtn = document.getElementById("nextQuote");
  const toAudioBtn = document.getElementById("toAudioBtn");

  let quoteIndex = 0;

  function updateQuote() {
    quoteContent.textContent = quotes[quoteIndex];

    prevBtn.disabled = quoteIndex === 0;
    nextBtn.disabled = quoteIndex === quotes.length - 1;

    //Show keep going button only on last quote
    if (quoteIndex === quotes.length - 1) {
      toAudioBtn.classList.remove("hidden");
      toAudioBtn.classList.add("visible-btn");
    } else {
      toAudioBtn.classList.add("hidden");
      toAudioBtn.classList.remove("visible-btn");
      // showPage("audio-page");
    }
  }

  //Initialise
  updateQuote();

  //Arrow Navigation
  prevBtn.addEventListener("click", () => {
    if (quoteIndex > 0) {
      quoteIndex--;
      updateQuote();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (quoteIndex < quotes.length - 1) {
      quoteIndex++;
      updateQuote();
    }
  });

  toAudioBtn.addEventListener("click", () => {
    hapticFeedback(12);
    showPage("audio-page");
  });

  //Play voice note activation

  playVoiceBtn.addEventListener("click", () => {
    //Hide text + button
    playVoiceBtn.style.opacity = "0";
    document.querySelector(".audio-title").style.opacity = "0";
    document.querySelector(".audio-subtitle").style.opacity = "0";

    // Darken screen
    darkOverlay.style.opacity = "1";

    //Fade background Music
    fadeOutAudio(bgMusic, 2000);

    //Start voice note after short delay
    setTimeout(() => {
      voiceNote.play();
    }, 800);
  });

  //When voicenote ends > show final message
  voiceNote.addEventListener("ended", () => {
    finalMessage.classList.remove("hidden");
  });
});
