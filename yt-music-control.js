var video = document.querySelector("video");
var player = document.querySelector('#movie_player');
var nextButton = document.getElementsByClassName("next-button")[0];
var previousButton = document.getElementsByClassName("previous-button")[0];
var albumImageURL = document.querySelector("#song-image").children[0].children[0].src;

if (albumImageURL != null && albumImageURL != undefined) {
      browser.runtime.sendMessage({
        greeting: "Song change",
        newURL: albumImageURL 
      });
}

browser.runtime.onMessage.addListener(handleMessage);

/* To check if url changes */
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, {subtree: true, childList: true});

function onUrlChange() {

    browser.runtime.sendMessage({
        greeting: "Song change",
        newURL: document.querySelector("#song-image").children[0].children[0].src
    });

}


function handleMessage(request, sender, sendResponse) {

    if (request.greeting == "Play"){
        video.play();
    }
    else if (request.greeting == "Pause") {
        video.pause();
    }
    else if (request.greeting == "Next") {
        nextButton.click();
    }
    else if (request.greeting == "Previous") {
        previousButton.click();
    }
    else if (request.greeting == "Album art") { //update album art and volume
        console.log(document.querySelector(".volume-slider").value );
        return Promise.resolve({ response: document.querySelector("#song-image").children[0].children[0].src,
                                volume: document.querySelector("#volume-slider").value });
    }

    return Promise.resolve({ response: "0" });
}