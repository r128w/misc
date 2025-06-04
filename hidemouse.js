const hidecursortagname = "hidecursor"
const cursortime = 2000
let cursortimer = null

document.addEventListener('DOMContentLoaded', ()=>{
    let eles = document.querySelectorAll("."+hidecursortagname)
    for(var i = 0; i < eles.length; i ++){
        eles[i].addEventListener('mousemove', ()=>{
            document.body.style.cursor = 'auto'
            clearTimeout(cursortimer)
            cursortimer = setTimeout(()=>{document.body.style.cursor = 'none'}, cursortime)
        })
        eles[i].addEventListener('mouseup', ()=>{
            document.body.style.cursor = 'auto'
            clearTimeout(cursortimer)
            cursortimer = setTimeout(()=>{document.body.style.cursor = 'none'}, cursortime)
        })
        eles[i].addEventListener('mouseleave', ()=>{
            document.body.style.cursor = 'auto'
            clearTimeout(cursortimer)
        })
    }
})