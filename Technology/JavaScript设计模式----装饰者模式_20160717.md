**声明：这个系列的主要内容来自《JavaScript设计模式与开发实践》 ----曾探@著一书**

# 目录：

- [装饰者模式的定义：](#装饰者模式的定义)
- [装饰者模式的特点：](#装饰者模式的特点)
- [继承的一些缺点：](#继承的一些缺点)
- [传统面向对象的装饰者和JavaScript装饰者对比：](#传统面向对象的装饰者和javascript装饰者对比)
	- [1.模拟传统面向对象语言的装饰者模式](#1模拟传统面向对象语言的装饰者模式)
	- [2.JavaScript中的装饰者模式](#2javascript中的装饰者模式)
- [装饰函数](#装饰函数)
	- [1.使用装饰者模式例子](#1使用装饰者模式例子)
	- [2.使用AOP（面向切面编程）装饰函数](#2使用aop面向切面编程装饰函数)
		- [2.1.封装的before函数](#21封装的before函数)
		- [2.2.封装的after函数](#22封装的after函数)
		- [2.3.不污染Function原型的做法](#23不污染function原型的做法)
- [装饰者模式用法示例：](#装饰者模式用法示例)
	- [1.ajax动态添加参数](#1ajax动态添加参数)
	- [2.表单验证并且提交](#2表单验证并且提交)
- [总结：](#总结)


----
### 装饰者模式的定义：
**装饰者(decorator)**模式能够在不改变对象自身的基础上，在程序运行期间给对像动态的添加职责。与继承相比，装饰者是一种更轻便灵活的做法。

### 装饰者模式的特点：
可以动态的给某个对象添加额外的职责，而不会影响从这个类中派生的其它对象；

### 继承的一些缺点：
1. 继承会导致超类和子类之间存在强耦合性，当超类改变时，子类也会随之改变；
2. 超类的内部细节对于子类是可见的，继承常常被认为破坏了封装性；


### 传统面向对象的装饰者和JavaScript装饰者对比：

#### 1.模拟传统面向对象语言的装饰者模式


```javascript
//模拟传统语言的装饰者

//原始的飞机类
var Plan = function () {
};

Plan.prototype.fire = function () {
    console.log('发射普通子弹');
};


//装饰类
var MissileDecorator = function (plan) {
    this.plan = plan;
}

MissileDecorator.prototype.fire = function () {
    this.plan.fire();
    console.log('发射导弹!');
};

var plan = new Plan();
plan = new MissileDecorator(plan);
plan.fire();
```

#### 2.JavaScript中的装饰者模式

>装饰者模式将一个对象嵌入到另一个对象之中，实际上相当于这个对象被另一个对像包装起来，形成一条包装链。请求随着这条包装链依次传递到所有的对象，每个对象都有处理这条请求的机会。

```javascript

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

```


### 装饰函数

在JavaScript中可以很方便的给某个对象扩展属性和方法，但却很难在不改动某个函数源代码的情况下，给该函数添加一些额外的功能。**也就是在代码运行期间，我们很难切入某个函数的执行环境**。


#### 1.使用装饰者模式例子

```javascript
//对window.onload的处理

window.onload=function () {
    console.log('test');
};

var  _onload= window.onload || function () {};

window.onload=function () {
    _onload();
    console.log('自己的处理函数');
};
```


#### 2.使用AOP（面向切面编程）装饰函数

**主要是以为在JavaScript中会存在随着函数的调用，`this`的指向发生变化，导致执行结果发生变化。**

##### 2.1.封装的before函数
**在需要执行的函数之前执行某个新添加的功能函数**

```javascript
//是新添加的函数在旧函数之前执行
Function.prototype.before=function (beforefn) {
    var _this= this;                               //保存旧函数的引用
    return function () {                           //返回包含旧函数和新函数的“代理”函数
        beforefn.apply(this,arguments);            //执行新函数,且保证this不被劫持,新函数接受的参数
                                                    // 也会被原封不动的传入旧函数,新函数在旧函数之前执行
        return _this.apply(this,arguments);
    };
};
```
##### 2.2.封装的after函数
**在需要执行的函数之后执行某个新添加的功能函数**

```javascript

//新添加的函数在旧函数之后执行
Function.prototype.after=function (afterfn) {
    var _this=this;
    return function () {
        var ret=_this.apply(this,arguments);
        afterfn.apply(this,arguments);
        return ret;
    };
};
```
##### 2.3.不污染Function原型的做法

```javascript
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
```


### 装饰者模式用法示例：

#### 1.ajax动态添加参数
**使用装饰者模式动态的改变ajax函数，传输的参数**

```javascript
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
```

#### 2.表单验证并且提交
**装饰者模式分离表单验证和提交的函数**


```javascript
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
```


### 总结：
装饰者模式和代理模式的区别：
1. 代理模式的目的是，当直接访问本体不方便或者不符合需要时，为这个本体提供一个代替者。本体定义了关键功能，而代理提供了或者拒绝对他的访问，或者是在访问本体之前做一些额外的事情。
2. 装饰者模式的作用就是为对象动态的加入某些行为。
