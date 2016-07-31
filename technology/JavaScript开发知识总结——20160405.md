### **1.a标签的相互嵌套**

很多时候我们会有下面的场景，如下图中所显示的那样。点击1区域（从图上看1区域包含2区域）和2区域跳转不同的链接。

![a标签测试](http://ww2.sinaimg.cn/large/0066l7Uajw1f2lu4oetu3j30er02n3yt.jpg)

正常的代码结构应该是：
```html
<ul>
    <li>
        <a href="#1">
            <div>内容1区域
                <a href="#2">
                    <div>按钮2</div>
                </a>
            </div>
        </a>
    </li>
</ul>
```

但是上面的代码浏览器的编译结果是下面这样
![](http://ww3.sinaimg.cn/large/0066l7Uajw1f2lv8qjexgj30gb089js3.jpg)

很明显可以发现，浏览器的渲染结果并不是我们想要的结果。那么是为什么呢？

>根据 W3C 规范，a 标签是不是嵌套 a 标签的。如果出现 a 标签嵌套 a 标签的情况就会将 a 标签内的 a 标签渲染在外部。


其实按照设计图上虽然是包含的关系，但是我们可以按照下面的方式布局，通过定位解决，不同的跳转问题。
```html
<ul>
    <li>
        <a href="#1">
            <div>内容1区域
            </div>
        </a>
        <a href="#2">
            <div>按钮2</div>
        </a>
    </li>
</ul>
```


### **2.选择器的优先级**
编写 css 的时候，都会遇到选择器优先级的问题。这里给出一个优先级列表

```css
div{
    font-size:12px !important; //！important 的优先级最高，而且比内联的样式的优先级高
}
```
那么除了 important 之外的选择器呢？

| 元素                             | 权重 |
|:---------------------------------|:-----|
| 内联样式                         | 1000 |
| ID选择器                         | 100  |
| 类选择器（包括属性选择器和伪类） | 10   |
| 元素(标签)和伪元素选择器         | 1    |
| 结合符和通配符                   | 0    |

根据上面的选择器的权重列表，就对我们在编写 css 的过程中对样式优先级有一个比较清晰的计算方法

```css
.img-list > li {
    width: 32rem;   /*权重=11*/
}

.img-btn-list li:first-child {
    margin-left: 0; /*权重=21*/
}

.v-list a>span:nth-child(1) {
    margin-right: .7rem; /*权重=22*/
}

```

### **3.不同项目样式引用单位不统一问题解决方案**
`flex`布局的一些优点思考：
1. `flex` (弹性盒)布局一个最大的优点就是解决不同移动设备的适配问题。
2. 因为`flex`与具体的单位**无关性** ，所以可以解决不同项目间单位不统一，但是又需要引用公用样式的需求。

>问题2的参考网站：天猫 h5页面。  淘宝 h5 页面全站使用`rem`单位适配，而天猫页面有百分比，rem 单位的混用。

*当然 flex 解决上面的问题还有一个问题就是浏览器的兼容性。如果自己的网站或者是 H5页面需要兼容低版本的浏览器，我们可以参考使用百分比单位解决适配的问题。*
>参考网站：京东 h5页面（全站使用百分比单位解决多设备适配的问题）。


### **5.安卓和 IOS html5 动画卡顿解决方案**

#### 1.IOS 支持弹性滑动
```css
body{
    -webkit-overflow-scrolling:touch;
}
```

#### 2.动画卡顿的解决方案

2.1 改变元素位置使用 css3 新属性，触发 GPU (硬件加速)辅助渲染动画   **[扩展阅读点这里](https://github.com/zhiqiang21/blog/issues/12)**

2.2 使用 chrome 开发者工具，查看动画元素是否造成周围大量 DOM 节点的重排(reflow)，如果是则对动画元素使用 absolute 定位，脱离所在文档流，减少对周围元素的影响。

2.3 对要做动画的元素使用`backface-visibility`,`opacity`,`perspective`


这里属性主要是设置动画元素只渲染面向用户的一面。减少动画渲染对系统性能的消耗。
```css
{
-webkit-backface-visibility:hidden;
        backface-visibility:hidden;

        -webkit-perspective: 1000;
                perspective: 1000;
}
```
