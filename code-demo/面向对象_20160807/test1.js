/**
 * Created by baidu on 16/8/2.
 */


var A = function (){
    console.log('A');
};

var B = function (){
    console.log('B');
};

var C = function (){
    console.log('C');
};

B.prototype= new A();

var b = new B();
var c = new C();
console.log(b.constructor.toString());   //奇怪啊
console.log(c.constructor.toString());

