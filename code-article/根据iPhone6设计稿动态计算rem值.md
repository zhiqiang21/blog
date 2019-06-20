# 2019-06-20更新

今天看到一篇文章，有大佬研究了 chrome 最小字体为 12px 限制的本质原因，文章让人豁然开朗受益匪浅，而且在文章的最后也谈到了如果使用 `rem` 做网页适配布局，设置根节点为 `62.5%` 的时候容易出现问题的本质原因。大家有兴趣的可以阅读下哈。文章链接如下：

[再谈Chrome的最小字体12px限制](https://www.yuque.com/docs/share/10f0516f-e58f-442c-81d7-b0ad544aec21?from=timeline&isappinstalled=0)


# 2019-05-14更新

## 1.为什么设置font-size=62.5%
简单说下为什么要来更新这篇博客的原因吧。这篇博客计算rem的方式是自己2014年刚毕业的时候做移动端项目写的。本身这段代码没有什么问题，但是在本地开发调试（比如chrome上） 因为设置 `html` 根元素的`font-size=62.5%` 导致在chrome上使用了rem单位的容器计算出来的正常的尺寸会有偏差（实际上在移动端设备上显示的又没有问题）。

这个问题的主要原因就是在pc上默认浏览器的字体最小只能显示 `12px`大小的字体**（当然这个说法也是指的大多数浏览器）**。所以当使用这篇博客脚本的来做`rem `的动态计算的时，如果元素的尺寸小于12px，在chrome上调试就会看到一个错误的容器尺寸。当时的一个简单的解决办法就是**自己手动到chrome设置里面去设置chrome的可以显示的最小字体。**

先来看下在chrome 浏览器里面的测试效果： 第一张和第二张图分别是浏览器计算出的容器的宽度和高度，可以明显发现test1 的宽度多了`2像素`
![](https://ws3.sinaimg.cn/large/006tNc79ly1g30p3yle9cj326e08st94.jpg)
![](https://ws3.sinaimg.cn/large/006tNc79ly1g30p3t27afj329e0940ta.jpg)

同样的代码在safari中浏览器却可以计算出正确的大小，下图可以看到test1和test2的宽度和高度是一样的。
![](https://ws1.sinaimg.cn/large/006tNc79ly1g30pq51xe1j31xe0c4jtz.jpg)
![](https://ws3.sinaimg.cn/large/006tNc79ly1g30p8eqimtj32ds0iawhu.jpg)

**就在我修改这篇文章的时候，chome已经是v74.0xxxx版本。通过设置chrome的最小显示字体已经无法让刚才的测试demo正常显示出计算结果了。意思就是说当我们设置跟节点的`html font-size 62.5%` 时（根据 1rem=16px， 0.625rem = 10px），计算得到的是`10px`，chrome也会强制的将计算结果设置为 `12px`。所以在浏览器中就是 `1rem=12px`了。**

下面再来简单介绍下为什么设置 `font-size 62.5%` 和怎么规避上面在chrome浏览器中计算误差的问题。

| rem | px |
| --- | --- |
| 1 | 16 |
| 0.625 | 10 |
| 6.25 | 100 |

由上面的表格可以知道当我们假设`1rem = 16px`时，那么`10px=0.625rem`，所以当我们选择`10px`为基准值的时候，假设我们需要设置的`rem 值为 Y`，设计稿的尺寸为 `X`,我们可以得出一个方程式：

`10 * Y = 0.625 * X`

也就是实际的rem设置的值就是

`Y = (0.625 * X) / 10 `

又因为 rem 是一个相对于 html 跟节点 font-size 的一个相对值。当我们设置了根节点的 html 的`font-size 62.5%`时，需要设置的rem的值就是

`Y = X / 10` （这里是一倍稿，当是2倍稿时，Y=X/10*2）

由以上的解析我们已经知道为什么设置`font-size 62.5% `的由来了，而且存在的问题。那么怎么规避在chrome上会计算错误的问题呢？

规避这个问题的方式就是我们将基准值设置为大于chrome能够显示的最小字体 `12px`。为了方便计算，如上面的表格我们可以使用`100px`作为基准值。也就是设置根节点的`font-size 625%`。所以当我们根据设计稿尺寸计算rem尺寸的时候直接`除100`（如果是2倍稿就`除2*100`)。

下图可以看出来这种选择更大的基准值时，chrome浏览器可以正确的计算出元素的尺寸。

![](https://ws2.sinaimg.cn/large/006tNc79ly1g30y89dloxj323m0c2jrz.jpg)


## 2.淘宝flexible方案解析
以上设置根节点`font-size`为百分比单位是一种使用rem适配的方案。还有一种设置`font-size`为动态的`像素值（px）`，比如淘宝的 lib-flexible。那么简单解释下淘宝方案的换算方法。

我们都知道iphone6/7/8手机的屏幕宽度是`375px`。当我们的设计稿是以iphone6为标准输出时（假设是1倍稿），在`lib-flexible`中有一句代码注释如下：

![](https://ws1.sinaimg.cn/large/006tNc79ly1g3133yz3cjj30yo07uglq.jpg)

**它的意思就是 `lib-flexible` 认为 `1rem = viewwidth/10`**，那么就有了下面的一个关系：

以一倍的iphone6设计稿为标准：

| rem  | px |
| --- | --- |
| 1 | 37.5 |

当我们设置 `37.5px` 为基准值，也就是 `font-size 37.5px` 时，由前面介绍的换算公式当我们要设置rem值时，就是

`Y = X / 37.5` （浏览器在计算的时候，实际是 37.5 * x / 37.5）

### 2.1 lib-flexible 对0.5像素的支持

查看`lib-flexible`的源码可以看到这段js代码

```javascript
if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    // offsetHeight 是一个只读属性，它返回该元素的像素高度，高度包含该元素的垂直内边距和边框，且是一个整数。
    // 主要是因为安卓手机上的dpr不统一，这里是增加校验
    // 这里检测 offsetHeight === 1 其实就是testElement 的上边框+下边框=1px
    // 如果 testElement 的上边框+下边框 > 1px 则不支持0.5像素的设置
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
```

上面代码的意思就是检测屏幕的 dpr 是不是大于等于2，当满足条件是就在 html 根节点上添加 `class="hairlines"` 的属性，当我们要使用 0.5像素的时候可以这么写代码

```css
.test1 {
            width: 100px;
            height: 100px;
            border: 1px solid red;
        }

        .test2 {
            width: 100px;
            height: 100px;
            border: 1px solid goldenrod;
        }
        /* 当满足dpr>=2时这段代码会生效，否者不会生效 */
        .hairlines .test2 {
            border: .5px solid goldenrod;
        }
```
![](https://ws3.sinaimg.cn/large/006tNc79ly1g313t7sh85j31vl0u00ut.jpg)

建议使用淘宝的rem 方案解决移动端适配的问题。地址：[https://github.com/amfe/lib-flexible](https://github.com/amfe/lib-flexible)

## 3.字体的适配
使用 `rem `我们可以控制元素在不同设备上面等比例的缩放和扩大，根据设备的`dpr`可以实现真实的**一像素**。那么字体的大小使用什么适配呢？

### 3.1 需不需要适配

在我的工作中（移动端项目）很少需要对字体进行适配。主要也是产品或者是UE、UI都对这里没有需求。直接使用的设计稿的 `px`尺寸。

### 3.2 需要适配怎么做
如果是需要对字体进行适配我们应该怎么做呢？

* 第一、就是像元素的宽高一样使用`rem`
* 第二、根据设备的dpr适配字体大小（可以使用media query来动态的设置字体的大小）；

> 使用`rem`会有点儿小问题，在安卓手机上`dpr`不统一，以及宽度的不统一，上面的两种方法都是尽可能的接近适配需要的大小。

### 3.3衬线字体和非衬线字体的区别
这里介绍个前端关于字体使用最经常使用的两个概念。

**衬线体**：具有装饰性（有边角）；代表字体：Times New Roman。常用于印刷品（书本杂志等），适用于长篇文章段落，因为边角易于辨别每个字母，读者在阅读较多的段落时会变得轻松。

**非衬线体**：顾名思义就是无装饰性（无边角），易识别；代表字体：Helvetica （iOS7、iOS8的预设字体）、San Francisco(iOS9、iOS10的预设字体)、Roboto（Android L的预设字体）、Arial（windows的预设字体）；缺点：某些字母相对难区分，如大些的I（i）与小写的l（L）。常用语电子设备。


## 旧版的博客内容（脚本内容已经更新20190514）

`rem` 单位在做移动端的h5开发的时候是最经常使用的单位。为解决自适应的问题，我们需要动态的给文档的更节点添加`font-size` 值。使用`mediaquery` 可以解决这个问题，但是每一个文件都引用一大串的`font-size` 值很繁琐，而且值也不能达到连续的效果。

就使用js动态计算给文档的`fopnt-size`  动态赋值解决问题。

**使用的时候，请将下面的代码放到页面的顶部（head标签内）；**
```javascript
/**
 * [以iPhone6的设计稿为例js动态设置文档 rem 值]
 * px和 rem的换算方式是 设计稿尺寸除100 如果是2倍稿 则是设计稿尺寸 除 2*100=200 3倍稿尺寸可以类推。
 * @param  {[type]} currClientWidth [当前客户端的宽度]
 * @param  {[type]} fontValue [计算后的 fontvalue值]
 * @return {[type]}     [description]
 */
<script>
    var currClientWidth, fontValue,originWidth;
    //originWidth用来设置设计稿原型的屏幕宽度（这里是以 Iphone 6为原型的设计稿）
    originWidth=375;
    __resize();

	//注册 resize事件
    window.addEventListener('resize', __resize, false);

    function __resize() {
        currClientWidth = document.documentElement.clientWidth;
        //这里是设置屏幕的最大和最小值时候给一个默认值
        if (currClientWidth > 640) currClientWidth = 640;
        if (currClientWidth < 320) currClientWidth = 320;
        //
        fontValue = ((625 * currClientWidth) /originWidth).toFixed(2);
        document.documentElement.style.fontSize = fontValue + '%';
    }
    </script>
```
