**声明：这个系列为阅读《JavaScript设计模式与开发实践》 ----曾探@著一书的读书笔记**

- [1.职责链模式的定义](#1职责链模式的定义)
- [2.](#2)
	- [2.1 简单职责链模式](#21-简单职责链模式)
	- [2.2职责链重构上面的代码](#22职责链重构上面的代码)
	- [2.3灵活的拆分职责链节点](#23灵活的拆分职责链节点)
- [3.异步职责链](#3异步职责链)
- [4.职责链模式的优缺点：](#4职责链模式的优缺点)
- [5.使用AOP（面向切面编程）来快速的创建职责链](#5使用aop面向切面编程来快速的创建职责链)
- [总结：](#总结)

### 1.职责链模式的定义
>使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

### 2.

#### 2.1 简单职责链模式

故事背景：用户可以支付定金购买手机，并且可以获得优惠券。没有支付定金的就是普通用户，进入普通购买模式，没有优惠券，且库存不足的情况下不一定能够买到手机。

```javascript
/**
 *
 * @param orderType 订单类型
 * @param pay   用户是否已经支付过定金 true or false
 * @param stock 表示手机的库存量
 */
var order = function (orderType, pay, stock){
    if (orderType === 1) {
        if (pay === true) {
            console.log('500定金预购,得到100元优惠券');
        }
        else {
            if (stock > 0) {
                console.log('普通购买,没有优惠券');
            }
            else {
                console.log('手机库存不足');
            }
        }
    }
    else if (orderType === 2) {
        if (pay === true) {
            console.log('200定金预购,得到50元优惠券');
        }
        else {
            if (stock > 0) {
                console.log('普通购买,没有优惠券');
            }
            else {
                console.log('手机库存不足');
            }
        }
    }
    else if (orderType === 3) {
        if (stock > 0) {
            console.log('普通购买,没有优惠券');
        }
        else {
            console.log('手机库存不足');
        }
    }
};
```

#### 2.2职责链重构上面的代码

主要通过拆分功能语句，来使用职责链重构:

```javascript
//500元订单
var order500 = function (orderType, pay, stock){
    if (orderType === 1 && pay === true) {
        console.log('500定金预购,得到100元优惠券');
    }
    else {
        order200(orderType, pay, stock);  //将请求传递给200
    }
};

//200元订单
var order200 = function (orderType, pay, stock){
    if (orderType === 2 && pay === true) {
        console.log('200定金预购,得到50元优惠券');
    }
    else {
        order(orderType, pay, stock);
    }
};

//普通购买订单
var order = function (orderType, pay, stock){
    if (stock>0) {
        console.log('普通购买,没有优惠券');
    }
    else {
    console.log('手机库存不足');
    }
};

//测试调用
order500(1,true,500);
order500(3,false,0);
```

**总结：**
上面的代码违反了开放-封闭的原则，请求在链条中传递的顺序非常僵硬，传递请求的代码被耦合在了业务函数中：

```javascript
var order500 = function (orderType, pay, stock){
    if (orderType === 1 && pay === true) {
        console.log('500定金预购,得到100元优惠券');
    }
    else {
        order200(orderType, pay, stock);  //将请求传递给200
    }
};

```

#### 2.3灵活的拆分职责链节点
为什么要拆分职责链的节点，因为某天需要添加新的职责，就需要修改业务代码（要修改的话，就需要先去了解他，熟悉它，花费大量的时间）。这显然不是每一个人所需要的。

```javascript
//500元订单
var order500 = function (orderType, pay, stock){
    if (orderType === 1 && pay === true) {
        console.log('500定金预购,得到100元优惠券');
    }
    else {
        return 'nextSuccessor';
    }
};

//200元订单
var order200 = function (orderType, pay, stock){
    if (orderType === 2 && pay === true) {
        console.log('200定金预购,得到50元优惠券');
    }
    else {
        return 'nextSuccessor';
    }
};

//普通购买订单
var order = function (orderType, pay, stock){
    if (stock>0) {
        console.log('普通购买,没有优惠券');
    }
    else {
        console.log('手机库存不足');
    }
};

var Chain=function (fn){
    this.fn=fn;
    this.successor=null;
};

Chain.prototype.setNextSuccessor=function (successor){
    return this.successor=successor;
};

Chain.prototype.passRequest=function(){
    var ret= this.fn.apply(this,arguments);

    if(ret==='nextSuccessor'){
        return this.successor && this.successor.passRequest.apply(this.successor,arguments);
    }

    return ret;
};

var chainOrder500=new Chain(order500());
var chainOrder200=new Chain(order200());
var chainOrderNormal=new Chain(order());

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

chainOrder500.passRequest(1,true,500);
chainOrder500.passRequest(2,true,500);
chainOrder500.passRequest(1,false,0);
```

加入某天网站添加了300元定金购买的职责，我只需要添加特定的节点就可以了：

```javascript
//300元订单
var order300=function (){

};

var chainOrder300=new Chain(order300());
chainOrder500.setNextSuccessor(chainOrder300);
chainOrder500.setNextSuccessor(chainOrder200);
```

这样的话只需要编写简单的功能函数，改变职责链中的相关节点的顺序即可。


### 3.异步职责链
上面的职责链代码中，每个节点函数同步返回一个特定的值`nextSuccessor`，来表示是否把请求传递给下一个节点。而现实开发中会遇到一些异步的问题，比如在一个节点中发起一个`ajax`异步请求，异步请求的结果才能决定是否继续在职责链中`passRequest`。

可以给`Chain`类添加一个原型方法`Chain.prototype.next`，表示手动传递请求给职责链中的下一个节点：

```javascript
Chain.prototype.next=function(){
    return this.successor && this.successor.passRequest.apply(this.successor,arguments);
};



//异步职责链的例子
var fn1=new Chain(function (){
    console.log(1);
    return 'nextSuccessor';
});

var fn2=new Chain(function (){
    console.log(2);
    var self=this;
    setTimeout(function (){
        self.next();
    },1000);

});

var fn3=new Chain(function (){
    console.log(3);

});

fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
fn1.passRequest();
```

### 4.职责链模式的优缺点：
**优点：**
- 职责链最大的优点就是解耦了请求发送者和N个接收者之间的复杂关系。
- 职责链可以手动指定起始节点，请求并不是非得从链中的第一个节点开始传递。

**缺点：**
- 不能保证某个请求一定会被链中的节点处理，这种情况可以在链尾增加一个保底的接受者节点来处理这种即将离开链尾的请求。
- 使程序中多了很多节点对象，可能再一次请求的过程中，大部分的节点并没有起到实质性的作用。他们的作用仅仅是让请求传递下去，从性能当面考虑，要避免过长的职责链到来的性能损耗。


### 5.使用AOP（面向切面编程）来快速的创建职责链

**AOP的具体概念可以参考装饰者模式**

```javascript

Function.prototype.after=function(fn){
    var self=this;
    return function(){
        var ret=self.apply(this,arguments);
        if(ret==='nextSuccessor'){
            return fn.apply(this,arguments);
        }

        return ret;
    }
};


var order=order500yuan.after(order200yuan).after(orderNormal);

order(1,true,500);
order(1,false,500);

```

AOP实现职责链简单又巧妙，但这种把函数叠在一起的方式，同时也叠加了函数的作用域，如果链条太长的话，也会对性能造成太大的影响。

### 总结：
职责链模式最大的优点：请求发送者只需要知道链中的第一个节点，从而弱化了发送者和一组接收者之前的强联系。

在JavaScript开发中，职责链模式是最容易被忽视的模式之一。但是只要运用得当，职责链模式可以很好的帮助我们管理代码，降低发起请求的对象和处理请求的对象之间的耦合性。且职责链中节点的数量和数序是可以自由变化的。可以在运行时决定链中包含哪些节点。

无论是作用域链，原型链，还是DOM节点中的事件冒泡，我们都能从中找到职责链模式的影子。
