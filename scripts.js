/* Elements */

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");
const fullscreen = player.querySelector(".fullscreen");
const volumeBar = player.querySelector("volume")

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "en-US";

/*functions */
function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function onlyPlay() {
  if (video.paused) {
    video.play();
  } 
}

function onlyPause() {
  if (video.play) {
    video.pause();
  }
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  console.log(icon);
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function skipForward() {
  video.currentTime += parseFloat(10);
}

function skipBackward() {
  video.currentTime -= parseFloat(10);
}

function restart() {
  video.currentTime = 0;
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleFullscreen() {
  console.log("fullscreen attempt");
  video.requestFullscreen();
}

function mute() {
  video.volume = 0;
}

function unmute() {
  video.volume = 1;
}

/* Hook up the event listeners */
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);
fullscreen.addEventListener("click", toggleFullscreen);

toggle.addEventListener("click", togglePlay);
skipButtons.forEach((button) => button.addEventListener("click", skip));
ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));
ranges.forEach((range) => range.addEventListener("mousemove", handleRangeUpdate));

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));
/* speech detection event listener */

recognition.addEventListener("result", (e) => {
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  if (e.results[0].isFinal) {
    console.log(transcript);
  }
  /* we need a voice recog for "play", "pause","skip ahead", "skip back", "mute", "unmute", "restart"*/
  if (transcript.includes("play")) {
    onlyPlay();
  }

  if (transcript.includes("pause")) {
    onlyPause();
  }

  if (transcript.includes("skip forward")) {
    skipForward();
  }

  if (transcript.includes("skip back")) {
    skipBackward();
  }

  if (transcript.includes("restart")) {
    restart();
    onlyPause();
  }

  if (transcript.includes("mute")) {
    mute();
  }

  if (transcript.includes("unmute")) {
    unmute();
  }

});
recognition.addEventListener("end", recognition.start);
recognition.start();
