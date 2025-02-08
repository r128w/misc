
var input = {
    a:false,
    d:false,
    s:false,
    w:false,
    space:false,
    tab:false,
    tabbed: false // ...
}
// console.log("ds")
window.addEventListener('keydown', (e) => {
    switch(e.key){
        case "a":input.a=true;break
        case "d":input.d=true;break
        case "s":input.s=true;break
        case "w":input.w=true;break
        case " ":input.space=true;break
        case "Tab":input.tab=true;input.tabbed = !input.tabbed;e.preventDefault();break
        // default:console.log(e.key);break
    }
})
window.addEventListener('keyup', (e) => {
    switch(e.key){
        case "a":input.a=false;break
        case "d":input.d=false;break
        case "s":input.s=false;break
        case "w":input.w=false;break
        case " ":input.space=false;break
        case "Tab":input.tab=false;e.preventDefault();break
    }
})