**声明：这个系列为阅读《JavaScript设计模式与开发实践》 ----曾探@著一书的读书笔记**


- [1.策略模式的定义](#1策略模式的定义)
- [2.策略模式的目的](#2策略模式的目的)
- [3.传统语言中的策略模式和JavaScript中的策略模式对比](#3传统语言中的策略模式javascript中的策略模式对比)
	- [3.1.传统语言中的策略模式](#31传统语言中的策略模式)
	- [3.2.JavaScript中的策略模式](#32javascript中的策略模式)
- [4.策略模式实现的表单校验](#4策略模式实现的表单校验)
	- [4.1使用JavaScript来实现的一个支持多重校验规则表单校验](#41使用javascript来现的一个支持多重校验规则表单校验)
	- [4.2策略模式的优缺点：](#42策略模式的优缺点)
			- [4.3函数多态性的描述](#43函数多态性的描述)
- [总结：](#总结)


### 1.策略模式的定义
将不变的部分和变化的部分隔开是每个设计模式的主题。

>定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

### 2.策略模式的目的
将算法的使用与算法的实现分离开来。


### 3.传统语言中的策略模式和JavaScript中的策略模式对比

#### 3.1.传统语言中的策略模式

使用策略模式来实现计算奖金

```javascript

var performances = function () {};

performances.prototype.calculate = function (salary) {
    return salary * 4;
};

var performanceA =function () {};

performanceA.prototype.calculate=function (salary) {
    return salary * 3;
};

var performanceB =function () {};

performanceB.prototype.calculate=function (salary) {
    return salary * 2;
};

//定义奖金类Bonus

var Bonus =function () {
    this.salary = null;  //原始工资
    this.strategy = null;//绩效等级对应的策略对象
};

Bonus.prototype.setSalary=function (salary) {
    this.salary=salary;  //设置员工的原始工资
};

Bonus.prototype.setStrategy=function (strategy) {
    this.strategy=strategy;//设置绩效等级对应的策略对象
};


Bonus.prototype.getBonus =function () { //取得奖金数额
    return this.strategy.calculate(this.salary);//把计算奖金的操作委托给对应的策略对象
};




var bonus = new Bonus();
bonus.setSalary(10000);
bonus.setStrategy(new performances());//设置策略对象

console.log(bonus.getBonus());

bonus.setStrategy(new performanceA());

console.log(bonus.getBonus());

```
定义有系列的算法，把它们各自封装成策略类，算法被封装在策略类内部的方法里。在客户端对Context发起请求的时候，Context总是把请求委托给这些策略对象中间的某一个进行计算。


#### 3.2.JavaScript中的策略模式


```javascript

//封装的策略算法
var strategies={
    "S":function (salary) {
        return salary * 4;
    },
    "A":function (salary) {
        return salary * 3;
    },
    "B":function (salary) {
        return salary * 2;
    }
};


//具体的计算方法
var calculateBonus=function (level, salary) {
    return strategies[level](salary);
};

console.log(calculateBonus('S',1000));
console.log(calculateBonus('A',4000));
```
使用策略模式重构代码，可以消除程序中大片的条件分支语句。在实际开发中，我们通常会把算法的含义扩散开来，使策略模式也可以用来封装一系列的“业务规则”。只要这些**业务规则指向的目标一致**，并且可以被替换使用，我们就可以使用策略模式来封装他们。

### 4.策略模式实现的表单校验

#### 4.1使用JavaScript来实现的一个支持多重校验规则表单校验
```javascript
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
```

#### 4.2策略模式的优缺点：

**优点：**

- 策略模式利用组合，委托和多态等技术思想，可以有效的避免多重条件选择语句；
- 策略模式提供了对开放-封闭原则的完美支持，将算法封装在独立的`strategy`中，使得它们易于切换，易于理解，易于扩展。
- 策略模式中的算法也可以复用在系统的其它地方，从而避免许多重复的复制粘贴工作。
- 在策略模式中利用组合和委托来让`Context`拥有执行算法的能力，这也是继承的一种更轻便的替代方案。

**缺点：**

- 策略模式会在程序中添加许多的策略类和策略对象
- 要使用策略模式，就必须要了解各个`strategy`和他们之间的不同点，这样才能选择一个合适的`strategy`。



#### 4.3函数多态性的描述

>在函数作为一等对象的语言中，策略模式是隐形的。strategy就是值为函数的变量。

在JavaScript中，除了使用类来封装算法和行为之外，使用函数当然也是一种选择。这些“算法”可以被封装到函数中并且四处传递，也就是我们常说的“高阶函数”。

实际上在JavaScript这种将函数作为一等对象的语言里，策略模式已经融入到了语言本身当中，我们经常使用高阶函数来封装不同的行为，并且把它传递到另一个函数中。当我们对这些函数发出“调用”的消息时，不同的函数会返回不同的执行结果。所以在JavaScript中，“函数对象的多态性”会更加简单些。

### 总结：
在JavaScript语言的策略模式中，策略类往往被函数所代替，这时策略模式就成了一种“隐形”的模式。
