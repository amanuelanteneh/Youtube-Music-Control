var video = document.getElementById("movie_player").querySelector("video")
var volumeSlider = document.getElementById("volume-slider");
var playPauseButton = document.getElementById("play-pause-button");
var nextButton = document.getElementsByClassName("next-button")[0];
var previousButton = document.getElementsByClassName("previous-button")[0];
var shuffleButton = document.getElementsByClassName("shuffle style-scope ytmusic-player-bar")[0];
var albumImageURL =
  document.querySelector("#song-image").children[0].children[0].src;

if (albumImageURL != null && albumImageURL != undefined) {
  browser.runtime.sendMessage({
    greeting: "Song change",
    newURL: albumImageURL,
  });
}

browser.runtime.onMessage.addListener(handleMessage);

/* To check if url (song) changes */
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    URLChange();
  }
}).observe(document, { subtree: true, childList: true });

function URLChange() {
  setVolume(volumeSlider.value)
  browser.runtime.sendMessage({
    greeting: "Song change",
    songImg: document.querySelector("#song-image").children[0].children[0].src,
    songInfo:
      document.getElementsByClassName("ytp-title-link")[0].innerHTML +
      " • " +
      document.querySelector(".byline.ytmusic-player-bar").title,
    volume: volumeSlider.value,
    playPauseStatus: document.getElementById("play-pause-button").title
  });
}

function handleMessage(request, sender, sendResponse) {
  var playPauseStatus = document.getElementById("play-pause-button").title
  var volume = request.vol
  switch (request.greeting) {
    case "On Open":
      volume = volumeSlider.getAttribute("value")
      break;
    case "Play Pause":
      playPauseButton.click();
      playPauseStatus = playPauseStatus == "Play" ? "Pause" : "Play";
      break;
    case "Shuffle":
      shuffleButton.click();
      playPauseStatus = "Pause";
      break;
    case "Next":
      nextButton.click();
      playPauseStatus = "Pause";
      break;
    case "Previous":
      previousButton.click();
      playPauseStatus = "Pause";
      break;
  }

  setVolume(volume)
  volumeSlider.setAttribute("value", volume)

  return Promise.resolve({
    songImg:
      document.querySelector("#song-image").children[0].children[0].src,
    songInfo:
      document.getElementsByClassName("ytp-title-link")[0].innerHTML +
      " • " +
      document.querySelector(".byline.ytmusic-player-bar").title,
    volume: volumeSlider.getAttribute("value"),
    playPauseStatus: playPauseStatus
  });
}

function setVolume(vol) {
  if (video) {
    video.volume = vol / 100;
  }
}