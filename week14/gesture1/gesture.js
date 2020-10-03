
let element = document.documentElement;

element.addEventListener("mousedown",event => {

    start(event);

    let mousemove = event => {
        move(event);
    };
    let mouseup =  event => {
        end(event);
        element.removeEventListener("mousemove", mousemove);
        element.removeEventListener("mouseup", mouseup);
    };
    element.addEventListener("mousemove", mousemove);
    element.addEventListener("mouseup", mouseup);
});

element.addEventListener("touchstart", event=>{
    for(let touch of event.changedTouches){
        start(touch);
    }
})

element.addEventListener("touchmove", event=>{
    for(let touch of event.changedTouches){
        move(touch);
    }
})

element.addEventListener("touchend", event=>{
    for(let touch of event.changedTouches){
        end(touch);
    }
})

element.addEventListener("touchcancel", event=>{
    for(let touch of event.changedTouches){
        cancel(touch);
    }
})

let handler;
let startX, startY;
let isPan = false, isTap = true, isPress = false;

let start = (point)=> {
    //console.log("start", point.clientX, point.clientY);
    startX = point.clientX, startY = point.clientY;
    isTap = true;
    isPan = false;
    isPress = false;
    handler = setTimeout(()=>{
        isTap = false;
        isPan = false;
        isPress = true;
        //handler = null;
        console.log("press start");
    },500);
}

let move = (point)=> {
    if(!isPress)return;
    let dx = point.clientX - startX, dy = point.clientY - startY;
    if(!isPan &&(dx ** 2 + dy ** 2)>100){
        isTap = false;
        isPan = true;
        isPress = false;
        clearTimeout(handler);
        handler=null;
        console.log("pan start");
    }
    if(isPan){
        console.log(dx,dy);
        console.log("pan");
    }
    //console.log("move", point.clientX, point.clientY);
}

let end = (point)=> {
    if(isTap){
        clearTimeout(handler);
        handler=null;
        console.log("tap end");
    }
    if(isPan){
        console.log("pan end");
    }
    if(isPress){
        console.log("press end");
    }
    //console.log("end", point.clientX, point.clientY);
}

let cancel = (point)=> {
    clearTimeout(handler);
    handler=null;
    //console.log("cancel", point.clientX, point.clientY);
}