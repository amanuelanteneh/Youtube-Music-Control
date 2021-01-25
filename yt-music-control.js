var player = document.querySelector("video");

browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(request, sender, sendResponse) {
    
    //console.log("Message from the background script:");
    //console.log(request.greeting);
    if (request.greeting == "Play"){
        player.play();
    }
    else if (request.greeting == "Pause") {
        player.pause();
    }

    //return Promise.resolve({response: "Hi from content script"});    
}