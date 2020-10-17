import {Component, createElement} from "./framework.js"
import {Carousel} from "./carousel.js"
import {TimeLine, Animation} from "./animation.js"

let d = [
     "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg"
    ,"https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg"
    ,"https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg"
    ,"https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
];

let c = 6;
let b = 9;

function simpleTag(Strings,...exps) {
    console.log("Strings:" + Strings);
    for(const exp of exps){
        //console.log(exp);
    }
    return "foobar";
}

let untaggedResult = `${c} + ${b} = ${c + b}`;
let taggedResult = simpleTag`${c} + ${b} = ${c + b}`;
//, + , = ,

console.log(untaggedResult);
console.log(taggedResult);


//为什么可以{d}这么用，参见：https://babeljs.io/docs/en/babel-plugin-transform-react-jsx
let a = <Carousel src={d} 
onChange={event => console.log("Change:"+event.detail.position)}
onClick={event => window.location.href = event.detail.data}
></Carousel>
a.mountTo(document.body);

