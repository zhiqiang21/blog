# line-height和vertical-align深入理解

本来以为很容易就能把这两个知识点总结完，但是在写`line-height`的时候，写一些示例demo总是会发现一些奇怪的细节问题（平时开发的过程中不关注可能对产品最后的样式并不会产生特别大的影响），但是既然要深入理解，那肯定是要刨根问底，追究其根本原因的。**知识的积累就是多问自己几个为什么，然后去寻找答案。**


## 1、深入理解line-height

先来看一个示例demo，以及在浏览器的显示效果。来切入我们这篇文章的主题，代码很简单如下：

![](https://ww1.sinaimg.cn/large/006tNc79ly1g3abh5ya2kj31ky0loabb.jpg)

由上图可以看到浏览器的解析结果：可以看到默认的情况下，在不设置`.test-span` 和 `.test-div` 的高度的时候，可以明显的看到字体和边框之间有一段很小的空白间隙。

**是的，这篇文章我们就来探究下这段空白间隙的由来。然后了解下我们并不熟悉的`line-height`。**

首先我们先准备一个不常用的基础知识，`window.getComputedStyle` [MDN文档地址](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle) ，文档定义如下：

>返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。 私有的CSS属性值可以通过对象提供的API或通过简单地使用CSS属性名称进行索引来访问。

使用方法：

```javascript
// 详细的使用方法请参考文档
/*
 * @param [element] 用于获取计算样式的element
 * @param [pseudoElt] 指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）
 */
let style = window.getComputedStyle(element, [pseudoElt]);
```


我们一步一步由浅入深，先来看看什么是行高？来看下下图：

![](https://raw.githubusercontent.com/zhiqiang21/img-map/master/20190520195327.png)

上面图种不同颜色的从上到下名称分别为（类似于我们初中开始学习英文时使用的拼音格）：

- 绿色：顶线
- 蓝色：中线
- 红色：基线
- 粉色：底线

**行高：** 上下文本行的基线间的垂直距离。

就是上图中的两条红线间的垂直距离（即图种：1+2+3+4的高度）。**那么我们很容易的根据图可以知道其实行高也是两条顶线（或者说两条中线、两条底线）之间的距离**。

**行距：**指一行底线到下一行顶线的垂直距离。就是上图中的第一行的粉色到下一行绿色之间的距离。
**字距（字体大小）**：即上图中的1+2+4的高度，就是四条线中显示文字的区域，即顶线和底线间的空间。
**内容区（content area）：** 在上图中内容只在绿线和粉色的线之间显示。这就是我们所说的内容区。

其实除了以上的几个概念在学习css的时候还会有一下的几个概念：行内框和行框呢和内容盒。

**行内框（inline boxes）**： 浏览器渲染模型中的一个概念。无法显示出来。每个行内元素都会生成一个行内框。在没有其它因素影响的时候（比如padding），行内框等于内容区域。**当设置`line-height`时，行内框并不会变化**。半行距分别增加/减少到内容区域的上下两边。

**行框（line boxes）**： 浏览器渲染模型中的一个概念。是本行的一个虚拟的矩形框。并没有实际的显示。行框的高度等于本行内所有元素中的行内框最大的值（以行高值最大的行为框为基准，其它行内框采用自己的对齐方式向基准对齐，最终计算行框的高度），当多行内容是，每行都会有自己的行框。

**内容盒（containing box）**： 外层盒子模型,包含了其他的boxes，即下面的整个灰色的区域。

![](https://raw.githubusercontent.com/zhiqiang21/img-map/master/20190520201059.png)

下面的这张图能够更加形象的来表示出各个盒子所占用的区域。

![](https://ww4.sinaimg.cn/large/006tNc79ly1g3afy89eegj30ja05ydg8.jpg)

那么到底是什么原因导致的这个空白的间隙呢？我们根据前面的JS脚本的特性来获取当前元素的一些计算属性，代码如下：

```javascript
    const testSpan = document.getElementsByClassName('test-span')[0];
    const testDiv = document.getElementsByClassName('test-div')[0];
    const test3span = document.getElementsByClassName('test3-span')[0];
    const test3 = document.getElementsByClassName('test3')[0];

    console.log('************testSpan style*****************');
    const testSpanStyle = window.getComputedStyle(testSpan)
    console.log(`font:${testSpanStyle.font}`);
    console.log(`lineHeight:${testSpanStyle.lineHeight}`);
    console.log(`fontFamily:${testSpanStyle.fontFamily}`);
    console.log('*******************************');
```

代码在浏览器（chrome）中的输出结果如下：

![](https://ww2.sinaimg.cn/large/006tNc79ly1g3ageewfh1j30l504qmx3.jpg)

由上图的输出结果可以知道当我们不给元素显式的设置`line-height`属性时，元素是会有一个默认值`normal`的。那么这个`normal`到底是一个什么东西呢，继续查询 [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/line-height) 可以知道，`line-height`的取值范围：

- 默认是`normal`这个取决于浏览器。**大多数浏览器的默认值是1.2左右，这取决于元素的`font-family`**。最重要的是这句话，如果我们不显式的声明元素的`line-height`的时候浏览器会给元素设置一个默认值。
- <length> 用长度指定行高不允许为负值。例如： `line-height=15px`
- <percentage> 用百分比指定行高。其百分比基于文本的`font-size`进行换算。不允许为负值。
- <number> 用乘积因子指定行高。不允许为负值。

根据定义可以知道当我们不显式的设置`line-height`时，浏览器默认使用乘积因子的方式给元素设置行高。有下面的一个计算默认行高的公式：

**默认的行高 = 1.2 * font-size**

那么根据以上的概念我们得出文章开头示例代码`test-span`的 `line-height = 16 * 1.2 = 19.2 ` （浏览器默认字体大小16px）那么行间距= (19.2-16)/2 约等于 2。其实那段空隙就是这么来的。

那么怎么解决 demo 中文字和边框间的间隙呢。根据定义当我们不知道具体的字体大小时我们只需要设置 `line-height=100%` 其实就是行高和字体大小相等 (行高=100% * 16)。

来看下效果，当元素是一个`block`元素时，文字撑满了父级容器。但是当父级元素是一个
`inline` 元素时，设置 `line-height =100%`对内部的文本竟然没有影响。

![](https://ww4.sinaimg.cn/large/006tNc79ly1g3agvfcfsgj30mb03m3yk.jpg)

**接下来继续探究line-height对inline元素的影响**

首先当我们给块级元素内的内联元素什么也不设置的时候，连块级元素也没有宽和高。

![](https://ww2.sinaimg.cn/large/006tNc79ly1g3b1t9chzsj31he0so403.jpg)

当我给块级元素内部的inline元素设置了内容的时候，根据下图，内联元素的高度完全由内容给撑开，然后又撑开了父级元素。

![](https://ww1.sinaimg.cn/large/006tNc79ly1g3b1vf0lrjj31a30u0abv.jpg)

当我给块级元素内部的inline元素设置了inline-block属性的时候

![](https://ww4.sinaimg.cn/large/006tNc79ly1g3b1xj8pxgj31d50u0jt6.jpg)

到这里的时候我们可能会猜测是**`line-height`**影响了inline元素的内容区域的显示，其实我也是这么想的，不过当我使用前面提到的js脚本获取浏览器对该元素的计算属性的时候我惊呆了，看下图竟然是`lineHeight=30px`，也就是说当父元素设置的line-height是具体的像素值的时候，当子元素没有显式的设置line-height时，会直接继承父级元素的line-height。

![](https://ww4.sinaimg.cn/large/006tNc79ly1g3b27t1vf0j30y407caa3.jpg)

那么到底是什么影响了内联元素的内容区域呢？内联元素的特点是什么？**内联元素是没有宽和高的元素（设置width和height对元素的大小没有影响）**，那么当浏览器渲染一个有内容的内联元素，这个内联元素内容区的大小跟具体浏览器的渲染引擎和字体（font-family）是有关系的（其实就是开头示例demo中内联元素文字和边框的那个空白间隙开发者无法改变）。也就是我们前面提到的行内框的概念，改变行高并不能影响行内框的高度，这个由内联元素的字体大小决定。


### 1.1 行高的继承

如果父元素的`line-height` 属性有单位且为 `px` 、`% ` 、 `em`那么继承的值则是换算后的一个具体的px级别的值。举例如下：

![](https://ww1.sinaimg.cn/large/006tNc79ly1g39bzinby6j30r70eomxe.jpg)

当设置 test1 的`line-height：150%`且`font-size:16px`时，时根据概念我们可以知道子元素span 继承的`line-height`值为 150% * 16 = 24px 那么行间距我们可以计算出来 **行间距=(24-30)/2 = -3px**。根据代码的显示效果确实看到了两行文本出现了重叠的效果。

那么当父元素的`line-height`是一个的像素值时，子元素的`line-height`是什么呢？

**根据文章开头我们的探究已经知道了，子元素直接继承这个`line-height`，但是当子元素是`inline`元素是，这个`line-height`并不会影响内容区的大小。**


如果属性值没有单位，则浏览器会直接继承这个“因子（数值）”，而非计算后的具体值，此时`line-height`会根据本身的font-size 值重新计算得到新的line-height值。

看下面的demo ，如果根据 上面的概念，子元素的行高应该是 3 * 20  = 60px
![](https://ww3.sinaimg.cn/large/006tNc79ly1g3c74cpq40j316c0u0jss.jpg)

根据前面的js脚本来验证一下，由下图完全验证了我们的定义。

![](https://ww3.sinaimg.cn/large/006tNc79ly1g3c78b1hffj30vi06swej.jpg)

根据以上知识的储备，当我们设置父级元素的`line-height`和父级元素容器的高度一样时，为什么子元素在不换行时可以垂直居中了？**因为子元素继承了父级元素的`line-height` 行距就是`(line-height - font-size)` 这个值除以2刚好填满字体的顶线和父容器上边距和字体的底线和父容器下边距。**


## 2、深入理解vertical-align

先看来一个简单的示例demo 的效果如下图：

![](https://raw.githubusercontent.com/zhiqiang21/img-map/master/20190521111837.png)

我们平时最常见的场景就是将图种的icon相对于父级元素垂直居中。那么有什么方法呢？
- 绝对定位 （代码量较多但是实现方法简单）
- flex （代码量简单，但是会改变父级容器和子容器的盒子特点）
- vertical-align （代码加单，但是如果对这个属性了解的不够透彻，会造成设置了不生效）
- 等等

前面的两种不是本文的内容。这里主要研究下 `vertical-align` 这个属性使元素相对于父级容器垂直居中（**近似垂直居中x-height/2**）。

先来了解`vertical-align`的的可选属性的概念：


- **baseline**: 当前盒的基线和父级盒的基线对齐。如果该盒没有基线，就将底部外边距的边界和父级的基线对齐。
![](https://ww1.sinaimg.cn/large/006tNc79ly1g3mq490pi8j30ki03qmx0.jpg)

那么上面概念的后半段的是什么意思呢？我们将子元素的内容删除，给子元素添加宽和高。来看下效果，如下图可以看出来这个时候黄色盒子的下边界对齐的是父元素文字的基线。

![](https://ww1.sinaimg.cn/large/006tNc79ly1g3mpvs9rs3j30o403qa9v.jpg)

- **sub**: 当前盒的基线降低到合适的位置作为父级盒的下标（该值不影响该元素文本的字体大小）
![](https://ww1.sinaimg.cn/large/006tNc79ly1g3mq2ytsqjj30q604cwec.jpg)

- **super**: 当前盒的基线提升到合适的位置作为父级盒的上标（该值不影响该元素文本的字体大小）
![](https://ww3.sinaimg.cn/large/006tNc79ly1g3mq1xykn4j30js03ajr8.jpg)

- **text-top**: 当前盒的top和父级盒的内容区的top对齐
![](https://ww1.sinaimg.cn/large/006tNc79ly1g3mp5rg09bj30qy03qt8k.jpg)

- **text-bottom**: 把当前盒的bottom和父级的内容区的bottom对齐
![](https://ww4.sinaimg.cn/large/006tNc79ly1g3mrcmjb6jj30lq03imx0.jpg)

- **middle**: 当前盒的垂直中心和父级盒的基线加上父级元素的**x-height**的一半对齐（关于[什么是x-height看这篇文章](https://www.zhangxinxu.com/wordpress/2015/06/about-letter-x-of-css/)）；
![](https://ww4.sinaimg.cn/large/006tNc79ly1g3mp6tn7fej30p8034mx0.jpg)

- **top**: 把当前盒的top与行盒的top对齐
![](https://ww1.sinaimg.cn/large/006tNc79ly1g3mp7kui24j30oe03mmx0.jpg)

- **bottom**: 把当前盒的bottom与行盒的bottom对齐
![](https://ww3.sinaimg.cn/large/006tNc79ly1g3mp80ogi8j30sa040t8k.jpg)

- **[percentage]**: 把当前盒提升（正值）或者是降低（负值）这个距离，百分比相对于line-height计算。当值为0%时等同于baseline。

- **[length]**: 把当前盒提升（正值）或者降低（负值）这个距离。当值为0时等同于baseline

当尝试给子元素设置`vertical-align`属性，那么最后的结果是怎么样呢（下面的demo我添加了一些文字作为参照）

![](https://raw.githubusercontent.com/zhiqiang21/img-map/master/20190521115129.png)

由上图发现这个时候文字和图标并没有按照我们的预期垂直居中。根据第一部分的知识，我们尝试把容器内文字的4个基本线划出来。看下图蓝色的线依次从上到下是顶线，中线，基线，底线。当我们对子元素 `span.icon`设置`vertical-align`后，只是将图标的中线和文字的中线对齐而已。

![](https://raw.githubusercontent.com/zhiqiang21/img-map/master/20190521115738.png)

由本片文章的第一部分可以知道给父级元素设置**line-height = 容器高度**可以使子容器内的元素垂直居中。这个时候的显示效果是什么样子呢？看下图：

![](https://raw.githubusercontent.com/zhiqiang21/img-map/master/20190521141711.png)

根据上图我们可以看出，当我们对父元素设置了**line-height=容器高度的时候**文字不仅居中对齐了，图标也居中对齐了。那么是为什么呢？由第一部分的知识可知当我们给元素设置`line-height > font-size`时，会在上下行的文字间添加行间距。我们再看下图：

![](https://raw.githubusercontent.com/zhiqiang21/img-map/master/20190521142724.png)

当设置`line-height`时，因为行间距的增加，影响容器内显示字体的**4条基本线**的位置。如果是单行文本元素时刚好能够居中文本。当我们对`span.icon`设置`vertical-align`时，就是将当前盒的垂直中心和父元素的中线对齐。就实现了我们看到的垂直居中的效果。

## 本文的参考文章列表如下：

- [行高：line-height图文解析](https://www.cnblogs.com/QingFlye/p/3876191.html)
- [CSS深入理解vertical-align和line-height的基友关系](https://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height/)
- [Inline elements and line-height](https://stackoverflow.com/questions/28363186/inline-elements-and-line-height?answertab=active#tab-top)
- [彻底搞定vertical-align垂直居中不起作用疑难杂症](https://juejin.im/post/5a7d6b886fb9a06349129463)
