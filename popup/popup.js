var playPauseButton = document.getElementById("myPlayPauseButton");
var nextButton = document.getElementById("myNextButton");
var prevButton = document.getElementById("myPrevButton");
var shuffleButton = document.getElementById("myShuffleButton");
var albumArtImg = document.getElementById("albumArt");
var volumeSlider = document.getElementById("volumeSlider");
var volume = 0;
var message = "Album art"; //set equal to this for message sent below
var paused = 0;
/*  function to send messages to content script   */
function sendMessage(tabs) {
  for (let tab of tabs) {
    browser.tabs
      .sendMessage(tab.id, {
        greeting: message,
        vol: volume,
      })
      .then((response) => {
        if (response.response != "0") {
          albumArtImg.src = response.response;
          document.getElementById("bkgd").style.backgroundImage =
            "url(" + response.response + ")";

          volumeSlider.value = response.volume;
          albumArtImg.title = response.songInfo;
          if (response.playPauseStatus == "Play") {
            document.getElementById("playPauseIcon").src =
              "../icons/playIcon.png";
            paused = 1;
          } else {
            document.getElementById("playPauseIcon").src =
              "../icons/pauseIcon.png";
            paused = 0;
          }
        }
      });
  }
}

browser.tabs
  .query({
    /* execute this every time popup is loaded to load album art, volume & track name */
  })
  .then(sendMessage);

/* This is so song info is always up to date, bascially j get the song info whenever user hovers over album art */
albumArtImg.addEventListener("mouseover", function () {
  message = "Album art";
  browser.tabs.query({}).then(sendMessage);
});

playPauseButton.addEventListener("click", function () {
  message = "Play-Pause";
  if (paused) {
    document.getElementById("playPauseIcon").src = "../icons/pauseIcon.png";
    paused = !paused;
  } else {
    document.getElementById("playPauseIcon").src = "../icons/playIcon.png";
    paused = !paused;
  }
  browser.tabs.query({}).then(sendMessage);
});

shuffleButton.addEventListener("click", function () {
  message = "Shuffle";
  browser.tabs.query({}).then(sendMessage);
});

nextButton.addEventListener("click", function () {
  message = "Next";
  browser.tabs.query({}).then(sendMessage);
});

prevButton.addEventListener("click", function () {
  message = "Previous";
  browser.tabs
    .query({
      //no currentWindow parameter so you can control the player from any firefox window
    })
    .then(sendMessage);
});

volumeSlider.addEventListener("change", function () {
  message = "Volume";
  volume = volumeSlider.value;
  browser.tabs.query({}).then(sendMessage);
});

/* To handle messages/responses from content script on YT music page */
function handleMessage(request, sender, sendResponse) {
  if (request.greeting == "Song change") {
    if (request.newURL != undefined) {
      document.getElementById("albumArt").src = request.newURL;
      document.getElementById("bkgd").style.backgroundImage =
        "url(" + request.newURL + ")";
      albumArtImg.title = request.songInfo;
      if (request.playPauseStatus == "Play") {
        document.getElementById("playPauseIcon").src = "../icons/playIcon.png";
        paused = 1;
      } else {
        document.getElementById("playPauseIcon").src = "../icons/pauseIcon.png";
        paused = 0;
      }
    } else {
      document.getElementById("albumArt").src = "../icons/defaultAlbumIcon.png";
    }
  }
}

browser.runtime.onMessage.addListener(handleMessage); //add listener for messages
