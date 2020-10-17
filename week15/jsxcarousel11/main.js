import {Component, createElement} from "./framework.js"
import {Carousel} from "./Carousel.js"
//import {Button} from "./Button.js"
import {List} from "./List.js"

/*
let d = [
     "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg"
    ,"https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg"
    ,"https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg"
    ,"https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
];

//为什么可以{d}这么用，参见：https://babeljs.io/docs/en/babel-plugin-transform-react-jsx
let a = <Carousel src={d} 
onChange={event => console.log("Change:"+event.detail.position)}
onClick={event => window.location.href = event.detail.data}
></Carousel>
a.mountTo(document.body);
*/

/*
let a = <Button>
    content
</Button>

a.mountTo(document.body);
*/

let d = [
    {
        img:"https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
        url:"http://www.csdn.net",
        title:"蓝猫"
    }
   ,{
       img:"https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
       url:"http://www.csdn.net",
       title:"红猫"
   }
   ,{
       img:"https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
       url:"http://www.csdn.net",
       title:"白猫"
   }
   ,{
       img:"https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
       url:"http://www.csdn.net",
       title:"花猫"
    }
];

let a = <List data={d}>
    {(record) =>
        <div>
            <img src={record.img}></img>
            <a href={record.url}>{record.title}</a>
        </div>
    }
</List>

a.mountTo(document.body);
