
let element = document.documentElement;





let handler;
let startX, startY;
let isPan = false, isTap = true, isPress = false;

export class Dispatcher {
    constructor(element){
        this.element = element;
    }

    dispatch(type, properties){
        let event = new Event(type);
        for (let name in properties){
            event[name] = properties[name];
        }
        this.element.dispatchEvent(event);
    }
}


//listen => recognize => dispatch

//new Listener(new Recognizer(dispatch))

export class Listener {
    constructor(element, recognizer) {
        let isListeningMouse = false;

        let contexts = new Map();

        element.addEventListener("mousedown",event => {
            
            let context = Object.create(null);
            contexts.set("mouse" + (1 << event.button), context);

            recognizer.start(event, context);

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
                        recognizer.move(event, context);
                    }
                    button = button << 1;
                }        
            };
            let mouseup =  event => {
                let context = contexts.get("mouse" + (1 << event.button));
                recognizer.end(event, context);
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
        
        element.addEventListener("touchstart", event=>{
            for(let touch of event.changedTouches){
                let context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        })

        element.addEventListener("touchmove", event=>{
            for(let touch of event.changedTouches){
                let context = contexts.get(touch.identifier);
                recognizer.move(touch, context);
            }
        })

        element.addEventListener("touchend", event=>{
            for(let touch of event.changedTouches){
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        })

        element.addEventListener("touchcancel", event=>{
            for(let touch of event.changedTouches){
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context);
                contexts.delete(touch.identifier);
            }
        })

    }
}

export class Recognizer {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }

    start(point, context) {
        context.startX = point.clientX, context.startY = point.clientY;
        this.dispatcher.dispatch("start",{
            clientX: point.clientX,
            clientY: point.clientY
        });
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
        context.handler = setTimeout(() => {
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            //context.handler = null;
            //console.log("press start");
            this.dispatcher.dispatch("pressstart",{});
        },500);
    }

    move(point, context) {
        //if(!context.isPress)return;
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
        if(!context.isPan &&(dx ** 2 + dy ** 2)>100){
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            context.isVertical = Math.abs(dx) < Math.abs(dy);
            clearTimeout(context.handler);
            context.handler=null;
            this.dispatcher.dispatch("pantart",{
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            });
        }
        if(context.isPan){
            this.dispatcher.dispatch("pan",{
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            });
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

    end(point, context) {
        if(context.isTap){
            clearTimeout(context.handler);
            context.handler=null;
            this.dispatcher.dispatch("tap", {});
        }
        
        if(context.isPress){
            this.dispatcher.dispatch("press end",{});
        }
        context.points = context.points.filter(point => (Date.now() - point.t) < 500);
        let d,v;
        if(!context.points.length){
            v=0;
        }
        else
        {
            try{        
                console.log(":1",point.ClientX,context.points[0].x,point.ClientY,context.points[0].y);
                d = Math.sqrt((point.ClientX - context.points[0].x) ** 2 +
                (point.ClientY - context.points[0].y) ** 2);
                let t = (Date.now() - context.points[0].t);
                if(t !== 0){
                    v = d / t;
                }else{
                    v = 0;                
                }
                console.log(":2",d,t,v);
            }catch(e){
                v = 0;
                console.log("end Exception:"+e);
            }
        }
        if(v > 1.5){
            //console.log("flick");
            this.dispatcher.dispatch("flick",{});
            context.isFlick = true;
            if(context.isPan){
                this.dispatcher.dispatch("flick",{
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    isVertical: context.isVertical,
                    isFlick: context.isFlick,
                    velocity: v
                });
            }
        }else{
            context.isFlick = false;
        }
        console.log("end v = " + v);

        if(context.isPan){
            this.dispatcher.dispatch("panend",{
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            });
        }
    }

    cancel(point, context) {
        clearTimeout(context.handler);
        context.handler=null;
        this.dispatcher.dispatch("cancel",{});
    }

}

export function enableGesture(element){
    new Listener(element, new Recognizer(new Dispatcher(element)));
}