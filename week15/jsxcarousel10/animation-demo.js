import {TimeLine, Animation} from "./animation.js"
import {ease,easeIn,easeOut,easeInOut} from "./ease.js"
let tl = new TimeLine();

tl.start();


tl.add(new Animation(document.querySelector("#el").style, "transform", 0, 1000, 2000, 0, easeOut, v=>`translateX(${v}px)`));

document.querySelector("#el2").style.transition = 'transform ease-in 2s';
document.querySelector("#el2").style.transform = 'translateX(1000px)';

document.querySelector("#pause-btn").addEventListener("click",()=>{tl.pause();});
document.querySelector("#resume-btn").addEventListener("click",()=>{tl.resume();});
document.querySelector("#reset-btn").addEventListener("click",()=>{tl.reset();});