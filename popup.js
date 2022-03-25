let activate = document.querySelector("#activate")
let handleDiv = document.querySelector(".size-handler")
let min = document.querySelector(".min")
let max = document.querySelector(".max")
let guide = document.querySelector(".btn-txt")

const pxtoVh = (pxh) => {
    const vh100 = document.documentElement.clientHeight
    return (100/vh100)*pxh
}

const pxtoVw = (pxw) => {
    const vw100 = document.documentElement.clientWidth
    return (100/vw100)*pxw
}


chrome.storage.sync.get("isActive", async ({isActive}) => {
    if(!isActive) {
        activate.innerHTML = "Resize"
        activate.style.backgroundColor = "rgb(26, 255, 26)"
        return handleDiv.style.display = "none"
    } else {
        activate.innerHTML = "Return"
        activate.style.backgroundColor = "red"
        guide.innerHTML = "Fullscreen mode is active"
        handleDiv.style.display = "flex"
    }
})


const onActivate = async () => {

    chrome.storage.sync.get("isActive", async ({isActive}) => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const tabId = tab.id;
        const url = tab.url.toString()
        if(url.includes("https://www.youtube.com")) {
            if(isActive) {
                chrome.scripting.executeScript(
                    {
                        target: {tabId: tabId, allFrames: true},
                        func: () => window.location.reload(true)
                    }
                )
                isActive = false
                return chrome.storage.sync.set({ isActive })
            } else {
                const addIframe = async () => {
                    let Str = `<!DOCTYPE html><html lang="en"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>My youube</title> </head> <body> <iframe src=${document.URL.replace("?v=", "/").replace("watch","embed")} frameborder="0" style="width: 100vw; height: 100vh" class="myiframe"> </iframe> </body></html>`
                    var newHTML = document.open("text/html", "replace");
                    newHTML.write(Str);
                    newHTML.close();
                }
        
                chrome.scripting.executeScript(
                    {
                        target: {tabId: tabId, allFrames: true},
                        func: addIframe,
                    }
                )
                activate.innerHTML = "Return"
                activate.style.backgroundColor = "red"
                handleDiv.style.display = "flex"
                guide.innerHTML = "Fullscreen mode is active"
                isActive = true
                return chrome.storage.sync.set({ isActive })
            }
        }
        else {
            return alert("This extension is only for youtube!!!")
        }
    })

}

activate.addEventListener("click", onActivate)
min.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tab.id;
    const onMax = async () => {
        let iframe = document.querySelector(".myiframe")
        if(iframe) {
            iframe.style.width = `${(parseInt(iframe.style.width.replace("vw","")) - 5)}vw`
            iframe.style.height = `${(parseInt(iframe.style.height.replace("vw","")) - 5)}vh`
        }
    }
    chrome.scripting.executeScript(
        {
            target: {tabId: tabId, allFrames: true},
            func: onMax
        }
    )
})
max.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tab.id;
    const onMax = async () => {
        let iframe = document.querySelector(".myiframe")
        if(iframe) {
            iframe.style.width = `${(parseInt(iframe.style.width.replace("vw","")) + 5)}vw`
            iframe.style.height = `${(parseInt(iframe.style.height.replace("vw","")) + 5)}vh`
        }
    }
    chrome.scripting.executeScript(
        {
            target: {tabId: tabId, allFrames: true},
            func: onMax
        }
    )
})
