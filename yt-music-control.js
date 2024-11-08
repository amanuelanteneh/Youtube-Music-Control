var video = document.querySelector("video");
var playPauseButton = document.getElementById("play-pause-button");
var nextButton = document.getElementsByClassName("next-button")[0];
var previousButton = document.getElementsByClassName("previous-button")[0];
var shuffleButton = document.querySelector(".shuffle.ytmusic-player-bar");
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
  browser.runtime.sendMessage({
    greeting: "Song change",
    newURL: document.querySelector("#song-image").children[0].children[0].src,
  });
}

function handleMessage(request, sender, sendResponse) {
  if (request.greeting == "Play-Pause") {
    playPauseButton.click();
  } else if (request.greeting == "Shuffle") {
    shuffleButton.click();
  } else if (request.greeting == "Next") {
    nextButton.click();
    browser.runtime.sendMessage({
      greeting: "Song change",
      newURL: document.querySelector("#song-image").children[0].children[0].src,
      songInfo:
        document.getElementsByClassName("ytp-title-link")[0].innerHTML +
        " • " +
        document.querySelector(".byline.ytmusic-player-bar").title,
      playPauseStatus: document
        .getElementById("play-pause-button")
        .getAttribute("title"),
    });
  } else if (request.greeting == "Previous") {
    previousButton.click();

    browser.runtime.sendMessage({
      greeting: "Song change",
      newURL: document.querySelector("#song-image").children[0].children[0].src,
      songInfo:
        document.getElementsByClassName("ytp-title-link")[0].innerHTML +
        " • " +
        document.querySelector(".byline.ytmusic-player-bar").textContent,
      playPauseStatus: document
        .getElementById("play-pause-button")
        .getAttribute("title"),
    });
  } else if (request.greeting == "Volume") {
    //change volume
    if (video) {
      video.volume = request.vol / 100;
    }
  } else if (request.greeting == "Album art") {
    //update album art and volume
    return Promise.resolve({
      response:
        document.querySelector("#song-image").children[0].children[0].src, //album art
      songInfo:
        document.getElementsByClassName("ytp-title-link")[0].innerHTML +
        " • " +
        document.querySelector(".byline.ytmusic-player-bar").textContent, //track info
      volume: video?.volume ?? 100,
      playPauseStatus: document
        .getElementById("play-pause-button")
        .getAttribute("title"),
    });
  }

  return Promise.resolve({ response: "0" }); //return 0 if no response needed
}
