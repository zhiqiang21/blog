## **myslide 插件开发知识点总结和 css3 动画性能问题的研究**


这篇文章主要是总结最近开发过程中遇到的问题。有几个问题又是不容易发现原因的问题，但是最后的结果又是很简单的。

----
### **1.手机端的 slider 插件是否有必要集成点按操作**
对于我自己开发的版本来说还是集成了这个操作的。但是参考了京东，天猫，淘宝电商网站首页的 slider 图片轮播插件都没有支持点按操作。那么是为什么呢？

我想到的答案可能如下：
>对于移动端来说，屏幕太小，轮播图上的显示当前图片状态的圆点,人的手指不容易选中。

### **2.this到底指向谁,改变 this 的指向**
JavaScript 中`this`在使用过程中比较容易出错的。那么`this`到底是指向谁呢？我看到最多的一句话是：
>this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁，实际上this的最终指向的是那个调用它的对象;

**来看两段代码：**

```JavaScript
var a = {
    m: 12,
    b: {
        m: 13,
        func: function() {
            console.log(this.m);   //result: 13
        }
    }
};
a.b.func();
```
通过输出的结果，我们这个知道，当调用`this`的时候，`this`指向的是对象`b`；


```JavaScript
var a = {
    m: 12,
    b: {
        m: 13,
        func: function() {
            console.log(this.m);   //undefined
            console.log(this);      //window
        }
    }
};

var cc=a.b.func;
cc();     //相当于 window.cc();
```

由以上代码的输出结果是当`this`被调用的时候 `this` 指向的是当前的 window 相当于`window.cc()`，这个时候实际上是 `window` 调用了 `this`；

上面的代码也印证了小结开头提到的那句话。但是很多时候根据实际情况我们需要改变`this`的指向，那我们该怎么做呢？

比如下面这样,我有一个公共的 js 对象来保存一些公用的 DOM 操作的方法，比如：

```JavaScript
var Doing.prototype={
    likeSport:function(){
        //这里使用原型的方式定义对象，就是想要这里的 this  始终指向送的都是 Doing
        console.log(this.test2()'like speak');
    },
    getName:function(){
        // console.log('zhiqiang');
        return 'zhiqiang'
    }
}
```

我的应用场景如下，当我单击 test 节点的时候，打印出我喜欢的运动。

```html
<div class="father">
    <div class="test">我喜欢的运动是什么？</div>
</div>
```

```JavaScript
new Dong();

var Dong = function(){
    var _this = this;
    $('.father').on('click','.test',function(){
        console.log(this);   //this  指向的是 test 节点对象
        _this.likeSport();   //这时 likeSport方法中的 this 指向的是 .test 节点对象  
     });
};

```

根据以上的代码，虽然我使用了 `_this` 缓存了 `this` 的只想，以使在单击函数的回掉中可以使用，但是这样直接调用 Dong 对象的方法，会改变 `likeSport` 中 `this` 的指向。

那么我们怎么让我们在单击函数的回掉中调用 `likeSport`的方法时，`likeSport` 的方法中的`this`仍然指向的是`Dong`呢？

这个时候就要用到 `call`或者 `apply` 来解决问题了。

call 和 apply 都是可以指定 function函数运行时，this 的值。两者唯一的区别就是 call 第二个参数接受的是参数列表，而 apply 接受的是一个参数数组。

```JavaScript
fun.call(this,tp1,tp2);
fun.apply(this,[tp1,tp2]);
```

按照以上的知识点来修改我们的代码

```JavaScript
$('.father').on('click','.test',function(){
    console.log(this);   //this  指向的是 test 节点对象
    _this.likeSport().call(_this);   //这时 likeSport方法中的 this 指向的是 Dong
 });
```

### **3.使用CSS3 动画性能的问题**
为什么使用 css3属性来做动画？使用 css 3做动画有什么好处呢？

我们先借助 chrome 开发者工具对动画渲染做一个检测，先来看使用`margin-left`来做动画发生了什么

![2016-03-19 19_02_41](https://cloud.githubusercontent.com/assets/3990411/13898219/450ce9bc-ee05-11e5-95be-6eb2c3c62972.gif)


再来看使用 `translate3d` 做动画发生了什么

![2016-03-19 18_42_21](https://cloud.githubusercontent.com/assets/3990411/13898218/450d03fc-ee05-11e5-981f-5a5b374176ca.gif)



我们可以很明显的看到，在使用 `margin-left`做动画的过程中，浏览器每时每刻都在发生渲染操作，而使用 `translate3d` 只是在开始和结束的时候发生渲染操作。


**来看看 [csstrigger](https://csstriggers.com/) 网站上对 margin-left 和 transform 的区别：**

![qq20160319-0](https://cloud.githubusercontent.com/assets/3990411/13896738/68ecbba6-edd2-11e5-88cd-1945c074dd96.png)
![qq20160319-1](https://cloud.githubusercontent.com/assets/3990411/13896739/6a0b7266-edd2-11e5-99dc-5d9cba653e71.png)

由上面可以知道，我们在使用 margin-left 这样的属性的时候，会触发页面的重排和重绘，而使用 transform 的时候，可以调用 gpu 对渲染进行帮助。


#### 容易忽略的问题：

**1.** 在使用 jQuery 或者 Zepto 的 animate 方法做动画的时候，我的代码可能是这样的

```JavaScript
test.animate({left:'15px'},1000);
test.animate({transform:'translate3d(0,15px,0)'},1000);
```
但是根据 API 文档，我们可以直接这样写

```JavaScript
test.animate({translate3d:'0,15px,0'},1000);
```
这种写法比上面的写法简洁一些。


**2.** 在使用 CSS3 属性做动画的时候，数值要加单位，不然会没有效果，比如下面的代码

```JavaScript
var size = 150;
test.animate({'translate3d': '-' + size + ',0,0'},1000)
```

这样写是正确的：
```JavaScript
var size = 150;
test.animate({'translate3d': '-' + size + 'px,0,0'},1000)
```

### **4.scroll 滚动动画的问题**

我们会有这样的业务场景，需要从页面的最低部返回页面的头部，或者是返回到页面的某个部分。
能够想到的解决方案有两种：
1. 使用锚点；
2. 使用 js 来滚动页面

使用锚点没有什么可以多说的，也很简单，但是滚动效果比较生硬。使用 js 来滚动页面的话，可以设置滚动动画，来使页面的滚动的效果更加友好。

在网上如果搜索`scroll` 动画最多的答案就是使用下面这样的代码：

```JavaScript
    $('.body1').animate({scrollTop:200},2000);
```
但是我在使用这样代码的时候，却没有出现我想要的效果，最后通过各种尝试还是找到原因的。就是的父级元素没有设置`overflow:auto`

overflow 这个属性还是很有用的。比如：触发盒子的 `BFC` 还有就是禁止元素在水平或者竖直方向滚动。

**注意：**
`jQuery` 支持这样的滚动动画，但是 `Zepto` 不支持这个操作滚动动画；
