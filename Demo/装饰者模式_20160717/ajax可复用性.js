/**
 * Created by baidu on 16/7/17.
 */



//是新添加的函数在旧函数之前执行
Function.prototype.before=function (beforefn) {
    var _this= this;                               //保存旧函数的引用
    return function () {                           //返回包含旧函数和新函数的“代理”函数
        beforefn.apply(this,arguments);            //执行新函数,且保证this不被劫持,新函数接受的参数
        // 也会被原封不动的传入旧函数,新函数在旧函数之前执行
        return _this.apply(this,arguments);
    };
};


var func = function (param) {
    console.log(param);
};

func = func.before(function (param) {
    param.b = 'b';
});

func({b:'222'});


//给ajax请求动态添加参数的例子
var ajax=function (type,url,param) {
    console.log(param);
};

var getToken=function () {
    return 'Token';
};


ajax=ajax.before(function (type, url, param) {
    param.token=getToken();
});

ajax('get','http://www.jn.com',{name:'zhiqiang'});

