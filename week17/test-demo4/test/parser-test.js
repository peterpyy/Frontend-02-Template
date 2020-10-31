var assert = require('assert');

import { parseHTML } from "../src/parser.js"

describe("parse html testing：",function(){
    it('<a></a>：', function() {
        let tree = parseHTML('<a></a>');
        //console.log(tree);
        //assert.strictEqual(tree.children[0].tagName, "a");
        //assert.strictEqual(tree.children[0].children.length, 0);
    });

    it('<a href="//time.geekbang.org"></a>：', function() {
        let tree = parseHTML('<a href="//time.geekbang.org"></a>');
        //console.log(tree);
        //assert.equal(tree.children.length, 1);
        //assert.equal(tree.children[0].children.length, 0);
    });

    it('<a href ></a>：', function() {
        let tree = parseHTML('<a href ></a>');
        //console.log(tree);
        //assert.equal(tree.children.length, 1);
        //assert.equal(tree.children[0].children.length, 0);
    });

    it('<a href id ></a>：', function() {
        let tree = parseHTML('<a href id ></a>');
        //console.log(tree);
        //assert.equal(tree.children.length, 1);
        //assert.equal(tree.children[0].children.length, 0);
    });

    it('<a id=abc />：', function() {
        let tree = parseHTML('<a id=abc />');
        //assert.equal(tree.children.length, 1);
        //assert.equal(tree.children[0].children.length, 0);
    });

    it('<a id="id1" href ></a>：', function() {
        let tree = parseHTML('<a id="id1" href ></a>');
        //console.log(tree);
        //assert.equal(tree.children.length, 1);
        //assert.equal(tree.children[0].children.length, 0);
    });

    it('<a id=id1 ></a>：', function() {
        let tree = parseHTML('<a id=id1 ></a>');
        //console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it('<a id=\'id1\' ></a>：', function() {
        let tree = parseHTML('<a id=\'id1\' ></a>');
        //onsole.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it('<a />：', function() {
        let tree = parseHTML('<a />');
        //assert.equal(tree.children.length, 1);
        //assert.equal(tree.children[0].children.length, 0);
    });

    it('<A /> uppercase：', function() {
        let tree = parseHTML('<A />');
        //assert.equal(tree.children.length, 1);
        //assert.equal(tree.children[0].children.length, 0);
    });

    it('<>：', function() {
        let tree = parseHTML('<>');
        onsole.log(tree);
        //assert.equal(tree.children.length, 1);
        //assert.equal(tree.children[0].children.length, 0);
    });


})
