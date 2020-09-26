const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");

export class TimeLine{
    constructor(){
        
        this[ANIMATIONS] = new Set();
    }

    get rate(){

    }
    set rate(newvalue){

    }

    start(){
        let startTime = Date.now();
        this[TICK] = () => {
            let t = Date.now() - startTime;
            for(let animation of this[ANIMATIONS]){
                let t0 =  t;
                //console.log(t0);
                if(animation.duration<t){
                    this[ANIMATIONS].delete(animation);
                    t0=animation.duration;
                }
                animation.receive(t0);
            }
            requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

    pause(){
        
    }

    resume(){
        
    }

    reset(){

    }

    add(animation){
        this[ANIMATIONS].add(animation);
    }
}


export class Animation {
    constructor(object,property,startValue,endValue,duration,timingFunction){
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
    }
    receive(time){
        //console.log(time);
        let range = this.endValue-this.startValue;
        this.object[this.property] = this.startValue+range*time/this.duration;
    }
}