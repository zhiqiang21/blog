最近的项目中做了一个“跑马灯”的抽奖特效插件。上篇文章已经分享过`html`和`css` 的相关知识。这篇文章主要分享一些 JavaScript 相关的知识。这几天在写这篇文章的时候，也顺便把自己的代码重构了一下。
这里主要是来写写自己的优化过程。俗话说：
>**一个程序猿的进步是从对自己的代码不满意开始的。**

开始之前先来看上篇文章遗漏的两个问题和几个知识点，是自己重构的过程中需要用到的：

####**1.移动端1px像素线的问题**
对于设计师给我的手机端网页的设计稿都是2倍图。按照道理来说，在写网页的时候，所有对象的实际尺寸都是会除2。但是对于1像素的线呢？
先来看两张图，设计稿的效果：

![这里写图片描述](http://img.blog.csdn.net/20160215170256386)
在三星 S4下的实际显示效果：

![这里写图片描述](http://img.blog.csdn.net/20160215170101889)
可以看到这个时候1px的线竟然显示不出来了。**这个问题是跟 S4手机的屏幕像素密度有关。关于屏幕像素密度和1px 线的关系有很多文章介绍，可以自行搜索了解。我这里的解决方案是，对1px 的线不做处理。是多少就写多少。就算我的基础单位是`rem`，也不是其它单位。**

```css
{
	position: absolute;
    width: 13rem;
    height: 9.2rem;
	border:1px solid #000;
}
```

####**2.pc 端浏览器和移动端浏览器容错率的差异**

先来看一段代码：
```javascript
$('[node-type=row-a').find('div');
```
很明显可以发现，我使用的选择器是有语法错误的。但是在浏览器中运行会有什么结果呢？看下图：
![这里写图片描述](http://img.blog.csdn.net/20160202170800726)

**很明显可以看出对于属性选择器，就算我有语法错误，PC 端浏览器也是可以正确解析的。但是在手机端，这种写法是不能够正确解析，代码不能够运行。**

所以写代码的时候一定要注意一些小细节哈。。。

####**3.jQuery中选择器的使用**
在使用 jQuery 或者是 Zepto 的过程中最经常使用的选择器的写法就是下面这样吧，
```javascript
	$('div.testClass')
```
只是在`$()` 中写上自己需要的 Dom 节点的 class或者 ID 或 者使用属性选择器。
在查看 jQuery的文档，对于`$()`会有这样的描述：
```
jQuery([selector,[context]])
```
最重要的是看看对 `context` (它也是我们平时使用中最容易忽略，但是却非常有用的一个参数)的描述：
>默认情况下, 如果没有指定context参数，$()将在当前的 HTML document中查找 DOM 元素；如果指定了 context 参数，如一个 DOM 元素集或 jQuery 对象，那就会在这个 context 中查找。在jQuery 1.3.2以后，其返回的元素顺序等同于在context中出现的先后顺序。

刚开始学习 JavaScript 那会儿，就听说了操作 DOM 是很损耗浏览器性能，遍历 DOM 也是很影响程序性能的。
如果我们在指定的范围内查找需要的 Dom 会不会比从整个`document` 中查找快很多。**而且在我们写 web 组件的过程中，一个页面上组件可能出现很多次，那我们怎么判断我们要操作哪个组件呢？这个`context`参数就会起到决定行的作用。**具体请继续看哇。。。

####**4.jQuery对象到数组的转换**
刚开始学习 jQuery的时候在一本书上看到一句话：
>jQuery对象就是一个 JavaScript 数组。

而且在使用 jQuery的过程中，都会遇到，js对象转 jQuery对象，jQuery对象转 js对象。关于这些基础不做过多介绍。
但是有时候我们会想在 jQuery对象上运用一些原生`Array`对象的方法或者属性。来看一个简单的例子：
![这里写图片描述](http://img.blog.csdn.net/20160202175250457)

由图中的代码运行结果，可以知道在 jQuery对象上是没有我们要使用`reverse`方法的。**尽管`test`是一个数组**。
那么我们怎么办才可以让 jQuery对象使用原生的 `Array`对象的方法呢？

#####**4.1使用原型链扩展**
比如下面的代码：
```javascript
jQuery.prototype.reverse=function(){
	//一些操作
}
```

使用`prototype`来扩展方法的时候，大家一直比较认为是缺点的就是可能会污染已经存在的原型链上的方法。还有就是访问方法的时候需要查找原型链。

#####**4.2将 jQuery对象中的对象添加到数组中**
看下面的代码
```javascript
var test = $('div.test');
var a=[];
$(test).each(function(){
	a.push($(this));
});

a.reverse();
```
这样就可以将 jQuery对象翻转。

#####**4.3使用 Array对象的 from()方法**
这种方法也是自己在编写插件过程中使用的方法。看一下文档描述：
>**Array.from()** 方法可以将一个类数组对象或可迭代对象转换成真实的数组。

个人感觉使用这个代码比较简洁。暂时还不知道有没有性能的影响。继续看下面的代码：
```
var test = $('div.test');
var a= Array.from(test);
a.reverse();
```

####**5.setInterval()和setTimeout()对程序性能的影响**
因为`setTimeout()`和`setInterval()`这两个函数在 JavaScript 中的实现机制完全一样，这里只拿 `setTimeout()`验证

那么来看两段代码
```javascript
var a ={
	test:function(){
		setTimeout(this.bbb,1000);
	},
	bbb:function(){
		console.log('----');
	}
};
a.test()
```
输出结果如下：
![这里写图片描述](http://img.blog.csdn.net/20160202195550552)

看下面的代码输出是什么
```javascript
var a ={
	test:function(){
		setTimeout(function(){
			console.log(this);
			this.bbb();
		},1000);
	},
	bbb:function(){
		console.log('----');
	}
};
a.test();
```
运行这段代码的时候，代码报错
![这里写图片描述](http://img.blog.csdn.net/20160202195725772)

由以上的结果可以知道，当我们在使用`setInterval()`和`setTimeout()`的时候，在回掉中使用`this`的时候，`this`的作用域已经发生了改变，并且指向了 `window`。

>setTimeout(fn,0)的含义是，指定某个任务在主线程最早可得的空闲时间执行，也就是说，尽可能早得执行。它在"任务队列"的尾部添加一个事件，因此要等到同步任务和"任务队列"现有的事件都处理完，才会得到执行。

**意思就是说在我们设置 setTimeout()之后，也可能不是立即等待多少秒之后就立即执行回掉，而是会等待主线程的任务都处理完后再执行，所以存在 "等待"超过自己设置时间的现象。同时也会存在异步队列中已经存在了其它的 setTimeout() 也是会等待之前的都执行完再执行当前的。**

看一个 Demo：

```javascript
setTimeout(function bbb(){},4000);

function aaa(){
	setTimeout(function ccc(){},1000);
}

aaa();
```

如果运行上面的代码，当执行完 `aaa()` 等待一秒后并不会立即执行 `ccc()`,而是会等待 `bbb()` 执行完再执行 `ccc()`  这个时候离主线程运行结束已经4s 过去了。


[![这里写图片描述](http://img.blog.csdn.net/20160215161117055)](https://github.com/zhiqiang21/WebComponent/tree/master/light-rotate)