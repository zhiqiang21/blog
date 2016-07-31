/**
 * Created by baidu on 16/7/17.
 */


var before=function (fn, before) {
    return function () {
        before.apply(this,arguments);
        return fn.apply(this,arguments);
    };
};

function func1(){console.log('1')}
function func2() {console.log('2')}

var a=before(func1,func2);

// a=before(a,func1);
a();