
const hidemouse = {
    time:2000,
    timer:null,
    tagname:"hidecursor",
    fn:()=>{
        document.body.style.cursor = 'auto'
        clearTimeout(hidemouse.timer)
        hidemouse.timer = setTimeout(()=>{document.body.style.cursor = 'none'}, hidemouse.time)
    },
    fnLeave:()=>{
        document.body.style.cursor = 'auto'
        clearTimeout(hidemouse.timer)
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    let eles = document.querySelectorAll("."+hidemouse.tagname)
    for(var i = 0; i < eles.length; i ++){
        eles[i].addEventListener('mousemove', hidemouse.fn)
        eles[i].addEventListener('mouseup', hidemouse.fn)
        eles[i].addEventListener('mouseleave', hidemouse.fnLeave)
    }
})
