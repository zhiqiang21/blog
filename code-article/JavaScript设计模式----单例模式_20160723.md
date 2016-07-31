**声明：这个系列为阅读《JavaScript设计模式与开发实践》 ----曾探@著一书的读书笔记**
# 目录：

- [1.单例模式的特点和定义](#1单模式的点和定义)
- [2.传统面向对象语言的单例模式](2传面向对象语言的单例模式)
	- [2.1传统语言描述的单式JavaScript实现](#21传统语描述的例模式javascript实现)
	- [2.2透明的单例模式：](#22透明的单例模式)
	- [2.3引入代理实现单例模式](#3引代理实现单例模式)
- [3.JavaScript的单例模比](#3javascript的单例模式对比)
	- [3.1惰性单例的例子](#31惰例的例子)
	- [3.2通用的单例模式例子](#3通用单例模式例子)
- [总结：](#总结)

### 1.单例模式的特点和定义
>保证一个类仅有一个实例，并且提供一个访问它的全局访问点。

### 2.传统面向对象语言的单例模式

#### 2.1传统语言描述的单例模式JavaScript实现
```javascript
var Singleton = function(name) {
    this.name = name;
    this.instance = null;
};

Singleton.prototype.getName = function() {
    alert(this.name);
};

Singleton.getInstance = function(name) {
    if (!this.instance) {
        this.instance = new Singleton(name);
    }

    return this.instance;
};

var a = Singleton.getInstance('seven1');
var b = Singleton.getInstance('seven2');

```
或者使用闭包的形式创建单例模式,同时符合惰性单例的特性

```javascript
var Singleton = function(name) {
    this.name = name;
};

Singleton.prototype.getName = function() {
    alert(this.name);
};

//利用闭包的特性创建单例,同时符合惰性单例的特性
Singleton.getInstance = (function(name) {
    var instance;
    return function(name){
        if (!instance) {
            instance = new Singleton(name);
        }
    }
})();

var a = Singleton.getInstance('seven1');
var b = Singleton.getInstance('seven2');

console.log(a===b);   //true

```


#### 2.2透明的单例模式：

```javascript
//反面的单例模式的例子

var CreateDiv = (function() {
    var instance;
    var CreateDiv = function(html) {
        if (instance) {
            return instance;
        }
        this.html = html;
        this.init();
        return instance = this;
    };

    CreateDiv.prototype.init = function() {
        var div = document.createElement('div');
        div.innerHTML = this.html;
        document.body.appendChild(div);
    }

    return CreateDiv;

})();

var a = new CreateDiv('seven1');
var b = new CreateDiv('seven2');
```
这样编写单例模式的缺点：

为了把`instance`封装起来，我们使用了自执行的匿名函数和闭包，并且让这个匿名函数返回真正的`Singleton`构造方法，这增加了一些程序的复杂度。

`CreateDiv`的构造函数负责了两件事情。1.创建对像和执行初始化`init`方法，第二是保证只有一个对象。不符合设计模式中的**单一职责**的概念。

#### 2.3引入代理实现单例模式

```javascript
var CreateDiv = function(html) {
    this.html = html;
    this.init();
};

CreateDiv.prototype.init = function() {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
}

var ProxySingletonCreateDiv = (function() {
    var instance;
    return function(html) {
        if (!instance) {
            instance = new CreateDiv(html);
        }
        return instance;
    }
})();

var a = new ProxySingletonCreateDiv('seven1');
var b = new ProxySingletonCreateDiv('seven2');

```
**引入代理实现单例模式的特点：**

我们负责管理单例的逻辑移到了代理类`ProxySingletonCreateDiv`中。这样一来，`CreateDiv`就变成了一个普通的类，他跟`ProxySingletonCreateDiv`组合起来可以达到单例模式的效果。

### 3.JavaScript的单例模式对比
在以上的代码中实现的单例模式都混入了传统面向对象语言的特点。而没有利用JavaScript这们语言的特点来实现一个单例模式。

#### 3.1惰性单例的例子
概念描述：
>惰性单例指的是在需要的时候才创建对象的实例。惰性单例是单例模式的重点。

```javascript
var createLoginLayer=(function(){
    var div;
    return function(){
        if(!div){
            div=document.createElement('div');
            //创建一个登录框
        }
        return div;
    }
})();

document.getElementById('loginBtn').onclick=function(){
    var loginLayer=createLoginLayer();
    loginLayer.style.display='block';
};
```
代码解析：
这里的对**惰性单例**的实现主要是只有单例了网页上的登录按钮，才会去创建，登录框的`dom`节点，并且只是创建一次。

#### 3.2通用的单例模式例子
根据3.1的代码示例，我们的单例对像，但是并不是通用的，比如我们要创建的不是`div`而是`iframe`，那要怎么办呢？

```javascript
//获取单例
var getSingle = function(fn){
    var result;
    return function (){
        return result || (result=fn.apply(this,arguments));
    };
};

//创建div登录框
var createLoginLayer=function (){
    var div= document.createElement('div');
    div.innerHTML='我是登录框';
    document.body.appendChild(div);
    return div;
};

//创建iframe的dom节点
var createIframe=function(){
    //创建irame节点的代码
}

var createSingleLoginLayer = getSingle(createLoginLayer);
var createSingleIframe=getSingle(createIframe);

var loginLayer1 = createSingleLoginLayer();
var loginLayer2 = createSingleLoginLayer();

var iframe1=createSingleIframe();
var iframe2=createSingleIframe();

console.log(loginLayer1 === loginLayer2);

```

通用的单例创建的例子就是通过封装一个`getSingle`需要实现单例模式的对象。而且只是会只创建一次。因为使用了**闭包**的原因通过`getSingle`创建的`result`会在内存中一直存在不会销毁（除非页面关闭，或者手动释放）。


### 总结：
单例模式是一种简单但非常实用的模式，特别是惰性单例技术，在合适的时候才创建对像，并且只创建唯一的一个。更奇妙的是，创建对象和管理单例的职责被分布在两个不同的方法中，这两个方法组合起来才具有单例模式的威力。
