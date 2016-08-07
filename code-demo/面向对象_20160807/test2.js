/**
 * Created by baidu on 16/8/3.
 */
var aaa = {
    a:'111',
    b:'222',
    c:'333'
};

// aaa.prototype.d = '444';   //这样会报错   这里的a相当于一个对象的实例

var BBB =function(){
    this._name ='aaa';
    this._age='bbb';
};

BBB.prototype.d='444';     //prototype是作用在类上面的（对象）

var bbb = new BBB();

console.log(bbb.d);
console.log(Object.keys(bbb));

var obj = new Object();

console.log(obj);

for (var i in obj){
    console.log(i);   //为什么没有便利处原型上的keys方法   可能keys()是不可以枚举的
}