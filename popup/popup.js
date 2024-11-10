import { ALBUM_ART, NEXT_MESSAGE, PLAY_PAUSE, PREVIOUS_MESSAGE, SHUFFLE, VOLUME_MESSAGE, ON_OPEN } from "../constants.js"

var volume = 50;
var paused = false;

const playPauseButtonDoc = document.getElementById("playPauseIcon")
const albumArtImgDoc = document.getElementById("albumArt");
const volumeSliderDoc = document.getElementById("volumeSlider");
const backgroundDoc = document.getElementById("bkgd");
const youtubeMusicURL = "*://music.youtube.com/*"

const pauseIconImage = "../icons/pauseIcon.png"
const playIconImage = "../icons/playIcon.png"
const actions = [
  {
    message: PLAY_PAUSE,
    userAction: "click",
    document: document.getElementById("myPlayPauseButton"),
  },
  {
    message: ALBUM_ART,
    userAction: "mouseover",
    document: document.getElementById("albumArt"),
  },
  {
    message: SHUFFLE,
    userAction: "click",
    document: document.getElementById("myShuffleButton")
  },
  {
    message: NEXT_MESSAGE,
    userAction: "click",
    document: document.getElementById("myNextButton")
  },
  {
    message: PREVIOUS_MESSAGE,
    userAction: "click",
    document: document.getElementById("myPrevButton")
  },
  {
    message: VOLUME_MESSAGE,
    userAction: "change",
    document: volumeSliderDoc,
    function: () => {
      volume = volumeSliderDoc.value
    }
  }
]


/*  function to send messages to content script   */
function sendMessage(tabs, message) {
  for (const tab of tabs) {
    browser.tabs
      .sendMessage(tab.id, {
        greeting: message,
        vol: volume,
      })
      .then((response) => {
        if (message == ON_OPEN) {
          volume = response.volume
        }
        setMusicInfo(response)
      });
  }
}


window.onload = () => { browser.tabs.query({}).then(tabs => sendMessage(tabs, ON_OPEN)); }

for (const action of actions) {
  action.document.addEventListener(action.userAction, () => {
    console.log(action.message + " event received")
    if (action.function) {
      action.function()
    }
    browser.tabs.query({}).then(tabs => sendMessage(tabs, action.message));
  })
}

function setMusicInfo(response) {
  albumArtImgDoc.src = response.songImg;
  backgroundDoc.style.backgroundImage =
    "url(" + response.songImg + ")";
  albumArtImgDoc.title = response.songInfo;
  volumeSliderDoc.setAttribute("value", volume);
  setPlayPauseIcon(response.playPauseStatus)
}

function setPlayPauseIcon(playPauseStatus) {
  if (playPauseStatus == "Play") {
    playPauseButtonDoc.src = playIconImage;
    paused = true;
  } else {
    playPauseButtonDoc.src = pauseIconImage;
    paused = false;
  }
}


/* To handle messages/responses from content script on YT music page */
function handleMessage(request, sender, sendResponse) {
  if (request.greeting == "Song change") {
    if (request.songImg) {
      setMusicInfo(request)
    } else {
      albumArtImgDoc.src = "../icons/defaultAlbumIcon.png";
    }
  }
}

browser.runtime.onMessage.addListener(handleMessage); //add listener for messages
