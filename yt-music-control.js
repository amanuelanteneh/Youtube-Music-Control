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
    UrlChange();
  }
}).observe(document, {subtree: true, childList: true});

function UrlChange() {

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
        browser.runtime.sendMessage({
            greeting: "Song change",
            newURL: document.querySelector("#song-image").children[0].children[0].src,
            songName: document.getElementsByClassName("ytp-title-link")[0].innerHTML
        });
    }
    else if (request.greeting == "Previous") {
        previousButton.click();
        browser.runtime.sendMessage({
            greeting: "Song change",
            newURL: document.querySelector("#song-image").children[0].children[0].src,
            songName: document.getElementsByClassName("ytp-title-link")[0].innerHTML
        });        
    }
    else if (request.greeting == "Volume") {
        document.getElementsByClassName("volume-slider")[0].setAttribute("value", request.vol);
        console.log(request.vol);
    }

    else if (request.greeting == "Album art") { //update album art and volume
        console.log( document.getElementsByClassName("volume-slider")[0].getAttribute("value") );
        return Promise.resolve({ response: document.querySelector("#song-image").children[0].children[0].src,
                                 songName: document.getElementsByClassName("ytp-title-link")[0].innerHTML,
                                 volume: document.getElementsByClassName("volume-slider")[0].getAttribute("value") }); //for some reason .value returns undefined...
    }

    return Promise.resolve({ response: "0" });
}