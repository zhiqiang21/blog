

**原文地址：**[http://stackoverflow.com/questions/37367200/what-is-the-deferred-long-running-timer-tasks-warning-in-the-chrome-devtools](http://stackoverflow.com/questions/37367200/what-is-the-deferred-long-running-timer-tasks-warning-in-the-chrome-devtools)

在开发过程中遇到了题目描述的问题，使用 **Google** 搜索，中文答案很少，而且没有令人满意的。就在**[segmentfault](https://segmentfault.com/q/1010000005766747)**上提了一个问题，而且很快我就发现被很多人收藏了该问题（SF网站问题被收藏时，会收到消息提醒）。也有一些网友回答该问题，但是一直没有优质的答案。

后来在 **Stack overflow** 找到比较好的答案，这个回答也是点“赞”数想当高的。英文好的同学建议直接阅读英文，英文不好的同学可以阅读下面我的翻译（英文水平有限，没有按照字句翻译，只是根据我对他们的理解来翻译）。


### 浏览器中报错的信息如下：

![](http://ww4.sinaimg.cn/large/698e22a9jw1f644g93gt4j20m70hbwgp.jpg)


### 答案描述：
这个问题主要发生在当**`Blink`**(Chrome的渲染引擎)决定延时执行一个定时器函数的时候。比如：通过`requestAnimationFrame`,`setTimeout`,`setInterval`这些对象执行的函数。因为这些对象在执行函数时至少要花费 **50ms**的时间，如果在这个时候刚好有用户在网页上输入操作，`Blink`会优先执行用户的输入操作（比如：scrolls事件，tap事件）。

如果你的JavaScript代码在运行时也出现了这样的问题，可能是使用者触发了同样的“行为”（指在执行定时器函数时，刚好有用户在操作）。下面有几种方式来复现这个问题：

1. 通过`timer`（定时器函数）触发了一段执行时间比较长的JavaScript代码；
2. 在移动端（或者是在开发者工具中模拟移动设备的模式下）；
3. 当手指与屏幕发生了真实的接触，并且发生了输入或者是滚动的行为。触摸页面或是快速的滚动页面也会触发这个问题，但是非常少见的而且不容易复现的。
4. 使用开发者工具中的“CPU throttling”模式延长`JavaScript`代码执行时间，可以让你有更好的时机去复现该问题；

在`console`(控制台)中打印的消息指向的问题（chromium平台bug列表），可以从第40条评论中直接找到解决该问题的方法：

1. 在导致“deferral”的页面打开开发者工具记录时间线；
2. 选择整个时间线，然后在窗口底部打开“Event Log” 面板。
3. 在文本输入框中（Filter过滤的字段）中输入“Timer Fired”
4. 在列表中查找“总时间”超过50毫秒的定时器函数。这就是问题的所在。（当浏览器在处理用户的手势的情景下，定时器函数执行超过10毫秒也会触发该消息）

![](http://ww3.sinaimg.cn/large/698e22a9jw1f64762kfg5j21560lg79r.jpg)


### 英文原文

**如果阅读中文后还无法理解可以参考英文截图**

![](http://ww3.sinaimg.cn/large/698e22a9jw1f647x5wki1j215y0x27gk.jpg)
