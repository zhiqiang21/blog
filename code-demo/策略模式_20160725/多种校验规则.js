/**
 * Created by baidu on 16/7/19.
 */


//策略对象

var strategies = {
    isNonEmpty: function (value, errorMsg){
        if (value === '') {
            return errorMsg;
        }
    },
    minLength: function (value, length, errorMg){
        if (value.length < length) {
            return errorMg;
        }
    },
    isMobile: function (value, errorMsg){
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};



/**
 * Validator 类
 * @constructor
 */
var Validator = function (){
    this.cache = [];
};

Validator.prototype.add = function (dom, rules){
    var self = this;

    for (var i = 0, rule; rule = rules[i++];) {
        (function (rule){
            var strategyAry=rule.strategy.split(':');
            var errorMsg=rule.errorMsg;

            self.cache.push(function (){
                var strategy=strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errorMsg);
                return strategies[strategy].apply(dom,strategyAry);
            })
        })(rule)
    }
};

Validator.prototype.start=function (){
    for (var i=0,validatorFunc;validatorFunc=this.cache[i++];){
        var errorMsg=validatorFunc();
        if(errorMsg){
            return errorMsg;
        }
    }
};

//客户端调用的代码

var registerForm=document.getElementById('registerForm');
var validataFunc=function (){
    var validator=new Validator();

    validator.add(registerForm.userName,[{
        'strategy':'isNonEnpty',
        'errorMsg':'用户名不能为空'
    },{
        'strategy':'minLength',
        'errorMsg':'用户名长度不能小于10位'
    }]);

    // validator.add(registerForm.password,[])

    var errorMsg =validator.start();
    return errorMsg;

};


registerForm.onsubmit=function (){
    var errorMsg=validataFunc();

    if(errorMsg){
        alert(errorMsg);
        return false;
    }
};