
window.onresize()

loadSprites()
runFrame()


var frameTimer;

function runFrame(){

    iterateFrame()
    renderFrame()

    frameTimer = setTimeout(runFrame, 16)
}
function halt(){clearTimeout(frameTimer)}