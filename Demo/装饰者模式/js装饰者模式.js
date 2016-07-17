/**
 * Created by baidu on 16/7/17.
 */


var Plan1 = {
    fire: function () {
        console.log('发射普通的子弹');
    }
};

var missileDecorator= function () {
    console.log('发射导弹!');
};

var fire = Plan1.fire;

Plan1.fire=function () {
    fire();
    missileDecorator();
};

Plan1.fire();


//对window.onload的处理

window.onload=function () {
    console.log('test');
};

var  _onload= window.onload || function () {};

window.onload=function () {
    _onload();
    console.log('自己的处理函数');
};