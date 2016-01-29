
`rem` 单位在做移动端的h5开发的时候是最经常使用的单位。为解决自适应的问题，我们需要动态的给文档的更节点添加`font-size` 值。使用`mediaquery` 可以解决这个问题，但是每一个文件都引用一大串的`font-size` 值很繁琐，而且值也不能达到连续的效果。

就使用js动态计算给文档的`fopnt-size`  动态赋值解决问题。

**使用的时候，请将下面的代码放到页面的顶部（head标签内）；**
```
/**
 * [以iPhone6的设计稿为例js动态设置文档 rem 值]
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
        fontValue = ((62.5 * currClientWidth) /originWidth).toFixed(2);
        document.documentElement.style.fontSize = fontValue + '%';
    }
    </script>
```
