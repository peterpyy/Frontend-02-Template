
let element = document.documentElement;

let isListeningMouse = false;

element.addEventListener("mousedown",event => {
    
    let context = Object.create(null);
    contexts.set("mouse" + (1 << event.button), context);

    start(event, context);

    let mousemove = event => {
        let button = 1;
        while(button <= event.buttons){
            if(button & event.buttons){
                //order of buttons & button property is not the same
                let key;
                if(button ===2)
                {
                    key = 4;
                }
                else if(button ===4)
                {
                    key = 2;
                }
                else
                {
                    key = button;
                }
                let context = contexts.get("mouse" + key);
                move(event, context);
            }
            button = button << 1;
        }        
    };
    let mouseup =  event => {
        let context = contexts.get("mouse" + (1 << event.button));
        end(event, context);
        contexts.delete("mouse" + (1 << event.button));
        if(event.buttons === 0){
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mouseup", mouseup);
            isListeningMouse=false;
        }
    };
    if(!isListeningMouse){
        isListeningMouse=true;
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
    }
});

let contexts = new Map();

element.addEventListener("touchstart", event=>{
    for(let touch of event.changedTouches){
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        start(touch, context);
    }
})

element.addEventListener("touchmove", event=>{
    for(let touch of event.changedTouches){
        let context = contexts.get(touch.identifier);
        move(touch, context);
    }
})

element.addEventListener("touchend", event=>{
    for(let touch of event.changedTouches){
        let context = contexts.get(touch.identifier);
        end(touch, context);
        contexts.delete(touch.identifier);
    }
})

element.addEventListener("touchcancel", event=>{
    for(let touch of event.changedTouches){
        let context = contexts.get(touch.identifier);
        cancel(touch, context);
        contexts.delete(touch.identifier);
    }
})

let handler;
let startX, startY;
let isPan = false, isTap = true, isPress = false;

let start = (point, context)=> {
    //console.log("start", point.clientX, point.clientY);
    context.startX = point.clientX, context.startY = point.clientY;
    context.points = [
        {
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }
    ];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.handler = setTimeout(()=>{
        context.isTap = false;
        context.isPan = false;
        context.isPress = true;
        //context.handler = null;
        console.log("press start");
    },500);
}

let move = (point, context)=> {
    //if(!context.isPress)return;
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    if(!context.isPan &&(dx ** 2 + dy ** 2)>100){
        context.isTap = false;
        context.isPan = true;
        context.isPress = false;
        clearTimeout(context.handler);
        context.handler=null;
        console.log("pan start");
    }
    if(context.isPan){
        console.log(dx,dy);
        console.log("pan");
    }

    context.points = context.points.filter(point => (Date.now() - point.t) < 500);

    context.points.push(
        {
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }
    );
    //console.log("move", point.clientX, point.clientY);
}

let end = (point, context)=> {
    if(context.isTap){
        clearTimeout(context.handler);
        context.handler=null;
        //console.log("tap end");
        dispatch("tap", {});
    }
    if(context.isPan){
        console.log("pan end");
    }
    if(context.isPress){
        console.log("press end");
    }
    context.points = context.points.filter(point => (Date.now() - point.t) < 500);
    let d,v;
    if(!context.points.length){
        v=0;
    }
    else
    {
        d = Math.sqrt((point.ClientX - context.points[0].x) ** 2 +
            (point.ClientY - context.points[0].y) ** 2);
        v = d / (Date.now() - context.points[0].t);
    }
    if(v > 1.5){
        console.log("flick");
        context.isFlick = true;
    }else{
        context.isFlick = false;
    }
    console.log(v);
    //console.log("end", point.clientX, point.clientY);
}

let cancel = (point, context)=> {
    clearTimeout(context.handler);
    context.handler=null;
    //console.log("cancel", point.clientX, point.clientY);
}

function dispatch(type, properties){
    let event = new Event(type);
    for (let name in properties){
        event[name] = properties[name];
    }
    element.dispatchEvent(event);
}