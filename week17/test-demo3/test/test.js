var assert = require('assert');
//var add = require("../add.js").add;
//var mul = require("../add.js").mul;

import {add, mul} from "../add.js"

describe("add function testing：",function(){
    it('1 + 2 should be 3：', function() {
        assert.strictEqual(add(1, 2), 3);
    });
    
    it('-5 + 2 should be -3：', function() {
        assert.strictEqual(add(-5, 2), -3);
    });    

    it('-5 * 2 should be -10：', function() {
        assert.strictEqual(mul(-5, 2), -10);
    }); 

})
