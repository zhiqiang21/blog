/**
 * Created by baidu on 16/7/17.
 */

//表单验证的例子,使表单验证和表单提交分开  “开放封闭原则(AOP)”


Function.prototype.before=function (beforefn) {
    var _this= this;                               //保存旧函数的引用
    return function () {                           //返回包含旧函数和新函数的“代理”函数
        beforefn.apply(this,arguments);            //执行新函数,且保证this不被劫持,新函数接受的参数
        // 也会被原封不动的传入旧函数,新函数在旧函数之前执行
        return _this.apply(this,arguments);
    };
};

var validata=function () {
    if(username.value===''){
        alert('用户名不能为空!')
        return false;
    }
    if(password.value===''){
        alert('密码不能为空!')
        return false;
    }
}

var formSubmit=function () {
    var param={
        username=username.value;
        password=password.value;
    }

    ajax('post','http://www.mn.com',param);
}

formSubmit= formSubmit.before(validata);


submitBtn.onclick=function () {
    formSubmit();
}

