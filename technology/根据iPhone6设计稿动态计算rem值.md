`rem` 单位在做移动端的h5开发的时候是最经常使用的单位。为解决自适应的问题，我们需要动态的给文档的更节点添加`font-size` 值。使用`mediaquery` 可以解决这个问题，但是每一个文件都引用一大串的`font-size` 值很繁琐，而且值也不能达到连续的效果。

就使用js动态计算给文档的`fopnt-size`  动态赋值解决问题。

```
/**
 * [以iPhone6的设计稿为例js动态设置文档 rem 值]
 * @param  {[type]} doc [文档元素]
 * @param  {[type]} win [window]
 * @return {[type]}     [description]
 */
(function(doc, win) {
    var docEl = doc.documentElement;
    var resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var remcalc = function() {
        var clientWidth = docEl.clientWidth;
        var fontValue;
        if (!clientWidth) return;
        fontValue = ((62.5 * currClientWidth) / 375).toFixed(2);
        fontValue = fontValue > 106.67 ? 106.67 : fontValue;
        window.baseFontSize = fontValue;
        docEl.style.fontSize = baseFontSize + 'px';
    };
    if (!docEl.addEventListener) return;
    win.addEventListener(resizeEven, remcalc, false);
    doc.addEventListener('DOMContentLoaded', remcalc, false);
})(document, window);
```