###**1.改变页面标题的内容**
有时候我们开发 h5页面的时候需要动态的去更新title 的名字，这个时候使用
```javascript
	document.titile='修改后的名字';
```
就可以解决我们的问题。

或者使用
```javascript
	//当前firefox对 title 参数不支持
	history.pushstate(state,title,url);
```

这种方法不仅能够修改 title 而且能够修改 url 的值，并且将这些信息存储到浏览器的历史堆栈中，当用户使用返回按钮的时候能够得到更加好的体验。
当我们在做一个无刷新更新页面数据的时候，可以使用这种方法来记录页面的状态，使得页面能够回退。


###**2.日志记录同步发送请求**
有这样的一个场景：
在做电商类的产品的时候，我们要对每个产品的点击数进行统计（其实就是出发一个` ajax `请求）。PC端的交互大多数是点击商品后新开页面。这个时候` ajax `是`同步发送`或者`异步发送`对统计没有影响。
但是嵌套在客户端中，长长是在当前 `tab` 中跳页。如果我们仍旧使用异步的`ajax` 请求，有请求会被阻断，统计结果不准确。


###**3.JavaScript 中 this 相关**
这部分内容之前也是看过很多次，但是都不能够理解深层次的含义。后来看的多了，也就理解了。

```javascript
var ab = {
    'a': 1,
    'b': 2,
    'c': 3,
    abc:function(){
        // 对象的方法中，this是绑定的当前对象
        var that=this;

        console.log('abc');
        var aaa=function(){
            //that指向的是当前对象
            console.log(that.a);
            //函数中this的值绑定的是全局的window对象
            console.log(this);
        };

        aaa();
    }
};
console.log('---------');
ab.abc();
```
以上代码浏览器中输出结果如下：

![这里写图片描述](http://img.blog.csdn.net/20160104144023276)

```javascript
	var BBB=function(){
	    var a=0;
	    this.b=1;
	    return this;
	}

	var bb= new BBB();
```
在浏览器中输入一下的内容查看输出：

![这里写图片描述](http://img.blog.csdn.net/20160104144757327)

我们对代码做一下修改，如下：
```javascript
	var BBB=function(){
	    var a=0;
	    this.b=1;
	}

	var bb= new BBB();
```
与之上相同的输入，查看一下输出是什么

![这里写图片描述](http://img.blog.csdn.net/20160104150509110)

**由上可知 new  操作符的执行过程：**

 1. 一个新对象被创建。它继承自`BBB.prototype`。
 2. 构造函数 `BBB` 被执行。执行的时候，相应的传参会被传入，同时上下文`this`会被指定为这个新实例。`new BBB` 等同于` new BBB()`, 只能用在不传递任何参数的情况。
 3. 如果构造函数返回了一个“对象”，那么这个对象会取代整个new出来的结果。如果构造函数没有返回对象，那么new出来的结果为步骤1创建的对象。
 
 >一般情况下构造函数不返回任何值，不过用户如果想覆盖这个返回值，可以自己选择返回一个普通对象来覆盖。当然，返回数组也会覆盖，因为数组也是对象。

###**4.JavaScript 中闭包相关**

>定义在闭包中的函数可以“记忆”它创建时候的环境。

```javascript
var test=function(string){
    return function(){
        console.log(string);
    }
};
var tt=test();
tt();
```

```javascript
//li列表点击每一行 显示当前的行数 
var add_li_event=function(node){
    var helper=function(i){
        return function(e){
            alert(i);
        }
    };

    for (var i = 0, len =node.length; i < len; i++) {
       node[i].onclick=helper(i); 
    }
};
```

###**5.销毁事件绑定**
我自己在写 js 的事件绑定的时候也经历了一个过程，刚开始的时候`onclick`，`bind`，`live`，`delegate`,`on` 这样一个过程。

之所以会有这样的需求就是因为我们页面上的 DOM 是动态更新。比如说，某块内容是点击页面上的内容显示出来，然后在这块新出现的内容上使用`click`肯定是满足不了需求的。

`live` 和`delegate` 属于较早版本的事件委托（代理事件）的写法。最新版本的 jquery 都是使用`on` 来做代理事件。效率上比 `live` 和 `delegate`更高。

`live`是将事件绑定到当前的`document` ，如果文档元素嵌套太深，在冒泡的过程中影响性能。
而 `delegate`和`on` 的区别就是
```javascript
	jQueryObject.delegate( selector , events [, data ], handler )
	//或者
	jQueryObject.delegate( selector, eventsMap )
```

```javascript
	jQueryObject.on( events [, selector ] [, data ], handler )
	//或者
	jQueryObject.on( eventsMap [, selector ] [, data ] )
```
由此可知，使用`on`的话，子代元素的选择器是可选的。但是 `delegate`的选择器是必须的。`on`比`delegate`更加的灵活。

很多时候我们都是只声明事件绑定，而不管事件的销毁。但是在编写前端插件的时候，我们需要提供事件销毁的方法，提供给插件使用者调用。这样做的好处就是使，使用者对插件更加可控，释放内存，提供页面的性能。
```javascript
	var that={};
	$('.event_dom').on('click','.childK_dom',function(){});
	$(window).on('scroll',scrollEvent);
	var scrollEvent=function(){};
	//事件销毁
	that.desrory=function(){
		$('.event_dom').off();
		//window 方法的销毁必须使用事件名称和回调函数,主要是 window 上可能绑定这系统自定义的事件和回掉
		$(window).off('scroll',scrollEvent);
	};
```
