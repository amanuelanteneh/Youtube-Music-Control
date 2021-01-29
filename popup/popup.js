var playButton = document.getElementById("myPlayButton");
var pauseButton = document.getElementById("myPauseButton");
var nextButton = document.getElementById("myNextButton");
var prevButton = document.getElementById("myPrevButton");
var albumArtImg = document.getElementById("albumArt");
var volumeSlider = document.getElementById("volumeSlider");
var volume = 0;
var message = "Album art"; //set equal to this for message sent below

/*  function to send messages to content script   */
function sendMessage(tabs) {
    for (let tab of tabs) {
      browser.tabs.sendMessage(
        tab.id,
        {greeting: message,
         vol: volume }
      ).then(response => {
        if (response.response != "0") {
            albumArtImg.src = response.response;
            document.getElementById("bkgd").style.backgroundImage = "url(" + response.response + ")";
            volumeSlider.value = response.volume;
            albumArtImg.title = response.songInfo;
            }
        })
    }
  }

browser.tabs.query({ /* execute this every time popup is loaded to load album art, volume & track name */
       currentWindow: true,
    }).then(sendMessage);

playButton.addEventListener('click', function() {
    message = "Play";
    browser.tabs.query({
        currentWindow: true, //only control from tabs in same browser window
      }).then(sendMessage);

});

pauseButton.addEventListener('click', function() {
    message = "Pause";
    browser.tabs.query({
        currentWindow: true,
      }).then(sendMessage);

});

nextButton.addEventListener('click', function() {
    message = "Next";
    browser.tabs.query({
        currentWindow: true,
      }).then(sendMessage);

});

prevButton.addEventListener('click', function() {
    message = "Previous";
    browser.tabs.query({
        currentWindow: true,
      }).then(sendMessage);

});

volumeSlider.addEventListener('change', function() {
    message = "Volume";
    volume = volumeSlider.value;
    browser.tabs.query({
        currentWindow: true,
      }).then(sendMessage);

});

/* To handle messages/responses from content script on YT music page */
function handleMessage(request, sender, sendResponse) { 

     if (request.greeting == "Song change") {
        if ( request.newURL != undefined ) {
            document.getElementById("albumArt").src = request.newURL;
            document.getElementById("bkgd").style.backgroundImage = "url(" + request.newURL + ")";
            albumArtImg.title = request.songInfo;
        }
        else {
           document.getElementById("albumArt").src = "../icons/defaultAlbumIcon.png";
        }
      }
}

browser.runtime.onMessage.addListener(handleMessage); //add listener for messages