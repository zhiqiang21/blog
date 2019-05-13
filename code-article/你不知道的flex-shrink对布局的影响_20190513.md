# 你不知道的flex-shrink对布局的影响
做前端已经有几年了，现在的知识储备已经能够解决工作中大多数的问题了。但是平时在做移动端项目的时候在一些特殊的机型上还是会遇到一些“奇葩”的问题。这个时候再查询文档才发现其实自己不经常使用的属性就是解决这些“奇葩”问题的方法，或者说是对文档理解的不够充分。


## 1.你不知道的`flex-shrink`和`flex-grow`和`flex-basis`

平时在工作中在使用弹性盒布局的时候最经常使用的就是`flex:1`。大多数的情况下可以满足弹性盒的布局。但是也会有一些特殊的情况。
先来看一个demo:

```html
<div class="test-flex">
  <div class="test1"></div>
  <div class="test2">sssssssssssssssssssss</div>
  <div class="test3"></div>
</div>
```

```stylus
.test-flex
  width 100px
  border 1px solid #000
  height 20px
  display flex
  flex-flow row nowrap
  .test1
    border 1px solid red
    height 20px
    width 20px
  .test2
    flex 1
```

代码的显示效果如下：
![](https://ws3.sinaimg.cn/large/006tNc79ly1g2yeym1xszj30ld0cajrj.jpg)

由上面的最终的显示结果可以看出来当我们给弹性盒的子元素设置了固定的宽度的时候，当其它可伸缩的子元素内容超出了剩余空间（弹性盒元素-固定宽度元素的宽度）的时候会压缩固定宽度元素。

这个时候深入研究下`flex:1 `这个属性的意义就知道是什么原因了。查阅文档可以知道：`flex`属性的值就是`flex-grow`、`flex-shrink` 、`flex-basis` 这3个属性值的缩写方式。 `flex: 1`其实就是  `flex: 1 1 0%`

这是三个属性的意义分别如下：

`flex-basis`：用来指定伸缩基准值，即在根据伸缩比率计算出剩余空间的分布之前，「flex子项」长度的起始数值。在「flex」属性中该值如果被省略则默认为 0% 。在「flex」属性中该值如果被指定为「auto」，则伸缩基准值的计算值是自身的 `width`设置，如果自身的宽度没有定义，则长度取决于内容。

**flex-basis属性的作用相当于width属性的替代品。如果子容器设置了flex-basis或者是width，那么在分配空间之前，他们会先跟父容器预约这么多的空间，然后剩下的才是归入到剩余空间。然后父容器再把剩余空间分配给设置了flex-grow 的容器。 如果同事设置了flex-basis和width，width属性会被覆盖，也就是说flex-basis的优先级比width属性高。另外如果flex-basis和width属性中有一个是auto，那么另外一个非auto属性的优先级会更高。**

flex-basis可取值的如下：` length（固定的宽度值） | <percentage> （可以设置百分比宽度） | auto | content`

`flex-grow`： 用了指定扩展比率，即剩余空间是正值时此「flex子项」相对于「flex容器」里其他「flex子项」能分配到的空间比例。 在「flex」属性中该值如果被省略则默认为 「1」

`flex-shrink`：用来指定收缩比率，即剩余空间是负值时此「flex子项」相对于「flex容器」里其它「flex子项」能收缩的空间比例。在收缩的时候收缩比率会以伸缩基准值加权。在「flex」属性中该值如果被省略则默认为 「1」。

还是前面的demo 我们做一下简单的修改

```stylus
.test-flex
  width 100px
  border 1px solid #000
  height 20px
  display flex
  flex-flow row nowrap
  .test1
    border 1px solid #fe0f3c
    height 20px
    width 20px
  .test2
    border 1px solid #0f31fe
    flex-basis 0%
    flex-grow 1
  .test3
    flex-basis 0%
    flex-grow 2
    border 1px solid #fef00f
```

代码的显示效果如下：

![](https://ws3.sinaimg.cn/large/006tNc79ly1g2yfstkckqj30nl0f1q38.jpg)

**flex-grow 的默认值是0，如果没有显示的定义该属性，是不会拥有分配剩余空间的权利的。**那么上面代码 test2和test3的宽度分别是多少呢，

flex 容器剩余空间的长度为 100px - 20px =80px
test2 宽度 = 80 * （1/3） = 26.6666px
test3 宽度 = 80 * （2/3） = 53.3333px

那我们再对以上的代码做些简单的修改，这个时候我们仅仅修改html不对css做修改。我们仅仅在`test3`的容器内添加了一些文本并且，这些文本超出了容器的本身宽度。看下显示效果

**可以很明显的看出来`test1`和`test2`的容器的宽度都被压缩了。**

![](https://ws4.sinaimg.cn/large/006tNc79ly1g2yg7exbquj30nx0gwjrn.jpg)

那么这是为什么呢，这个时候就轮到我们的`flex-shrink`出场了。

**flex-shrink属性的默认值为1.如果没有显示定义该属性，将会自动按照默认值1在所有因子相加之后计算比率来进行空间收缩。**

先来对代码做简单的修改看个简单的例子

```stylus
.test-flex
  width 100px
  background-color #000
  height 20px
  display flex

  .test2, .test3
    width 50px
  .test1
    background-color #fe0f3c
    height 20px
    width 20px
  .test2
    background-color #0f31fe
    flex-shrink 1
  .test3
    flex-shrink 2
    background-color #fef00f
```

根据定义我们来猜测下最后的显示效果应该是什么样子的。因为test1没有显式的声明 flex-shrink 所以使用默认值为1 所以弹性盒被分成了4份，他们的比例分别是 test1 : test2 : test3 = 1:1:2

容器定义为100px 子容器的宽度相加以后为 20px+50px+50px=120px 超出父容器20px 那么这20px就要被 a,b,c消化掉，通过收缩因子加权可得 20x1 + 50x1 + 50x2 = 170px

`溢出的计算量 = （子容器宽度*flex-shrink的值/加权值）* 溢出值`

由上可以计算出test1 test2 test3 将被移除的溢出量是多少，那么弹性盒的子容器的宽度分别为
test1 （20x1/170）x 20 = 2.35
test2 （50x1/170）x 20 = 5.88
test3 （50x2/170）x 20 = 11.76

那么压缩后伸缩子容器的宽度分别是
test1的宽度= 20-5 = 17.65px
test1的宽度= 50-5.88 = 44.12px
test1的宽度= 50-11.76 = 38.24

**然后使用chrome开发者工具分别查看三个子容器的宽度，大约都是等于我们刚刚计算出来的值**。

![](https://ws3.sinaimg.cn/large/006tNc79ly1g2zgxwo430j30rc0eojrl.jpg)

那我们再来验证一个问题就是`flex-basis` 和`width`的关系以及同时设置他们以后的优先级

```stylus
.test-flex
  width 100px
  background-color #000
  height 20px
  display flex

  .test2, .test3
    width 50px
  .test1
    background-color #fe0f3c
    height 20px
    width 20px
    flex-basis auto
  .test2
    background-color #0f31fe
    width 10px
    flex-basis 20px
    flex-shrink 1
  .test3
    flex-shrink 2
    flex-basis 0
    background-color #fef00f


```

**从以下的显示效果可以看出来，当我们设置了`flex-basis:0`的时候伸缩子容器的宽度变为了 0 .当我们同时设置了 `flex-basis` 和 `width` 时且都为数值时，`flex-basis`的优先级高于width ，当其中有一个设置了值为auto时，值为非auto 的属性的优先级更高。**

![](https://ws1.sinaimg.cn/large/006tNc79ly1g302uietjuj319z0u0myg.jpg)


由了以上的基础知识储备，我们一定知道为什么设置了固定宽度的子容器 test1 被压缩了。因为当其它的容器的内容超出了父容器的剩余空间时，会压缩子容器不是设置了flex-shrrink != 0的容器，因为test1的容器没有设置`flex-shrink`所以默认值为1 会被压缩。如果不想被压缩就设置`flex-shrink 0`
