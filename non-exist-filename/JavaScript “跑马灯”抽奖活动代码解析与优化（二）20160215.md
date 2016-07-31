既然是要编写插件。那么叫做“插件”的东西肯定是具有的某些特征能够满足我们平时开发的需求或者是提高我们的开发效率。那么叫做插件的东西应该具有哪些基本特征呢？让我们来总结一下：
###**1.JavaScript 插件一些基本特征：**

 1. 配置一定要简单
 2. 插件中定义的变量不污染全局变量；
 3. 同一段代码可以在不同的地方复用；
 4. 用户可以自定义自己功能参数；
 5. 具有销毁变量和参数的功能；

如果按照以上的几个特征来写插件的话，我们可以总结出一个基本的代码结构，我们一个一个的来看：

####**1.插件配置要尽可能的简单**
html中配置容器节点

```
//这里的node-type="reward-area" 是标识我们插件的容器节点
<div class="re-area" node-type="reward-area" >
```
DOM加载完成以后初始化插件
```
$(function() {
	//这里的 test 是代表容器的 class
	window.LightRotate.init($('[node-type=reward-area]'));
});
```

####**2.插件中定义的变量不污染全局变量**
JavaScript 具有块级作用域的标识符就是`function`了。那我们怎么声明我们的变量才可以使它不污染全局变量呢？
这里我们需要用到的一个 `JavaScript` 函数的自执行的知识点。代码如下：

```
(function(){
	// do something
})();
```

####**3.在不同的地方复用功能代码**
这就要用到我们面向对象的知识点，把我们的功能代码抽象成对象，在我们需要使用的时候，实例化对象就可以了。那我们接着第二部的代码继续写，

```javaScript 
//
(function($){
	// 创建功能对象
	var LightRotate = function (select) {
		// do something
	};

	LightRotate.init = function (select) {
        var _this = this;
        //根据不同的容器实例化不同的对象
        select.each(function () {
            new _this($(this));
        });
    };

    window.LightRotate = LightRotate;
})(jQuery);
```

####**4.用户可以自定义功能参数**
首先我们应该有默认的参数设定，比如下面这样

```javaScript 
//
(function($){
	// 创建功能对象
	var LightRotate = function (select) {
		// 自定义的参数
		this.setting = {
            liAutoPlay: false,  //周围的灯是否自动旋转
            roLiSpeed: 100,     //灯旋转的速度ms
            roPrSpeed: 200,     //奖品旋转速度ms
            liDirection: true,  //旋转方向 true  正方向   false  反方向
            randomPrize: false  //空格是否随机选取
        };
	};

	LightRotate.init = function (select) {
        var _this = this;
        //根据不同的容器实例化不同的对象
        select.each(function () {
            new _this($(this));
        });
    };

    window.LightRotate = LightRotate;
})(jQuery);
```

其实这样写的话，使用者已经可以修改我们的 JavaScript 文件来完成自定义了。但是为了能够让我们的差价足够的好用，比如说，我们的使用者一点儿都不懂 js 呢？该怎么办？
这样我们可以把这些参数用自定义属性配置在 `html`中,如下：

```
<div class="re-area" node-type="reward-area" data-setting='{
    "liAutoPlay":false,
    "roLiSpeed":100,
    "roPrSpeed":200,
    "liDirection":true,
    "randomPrize":false}'>
```
这样用户只需要在 html的节点中就可以配置当前容器运行的参数。**这样的好处还可以使同一页面上的不同容器，可以单独的配置参数，减少耦合。**

那么在 js 中我们该怎么获取这些参数呢？在上面的代码中，已经有了功能对象函数。那么我们想扩展对象方法来获取用户的自定义参数，怎么办呢？我们一般使用`prototype`的东西来扩展我们已有对象的方法，代码如下：

```javaScript 
//
(function($){
	// 创建功能对象
	var LightRotate = function (select) {
		// 自定义的参数
		this.setting = {
            liAutoPlay: false,  //周围的灯是否自动旋转
            roLiSpeed: 100,     //灯旋转的速度ms
            roPrSpeed: 200,     //奖品旋转速度ms
            liDirection: true,  //旋转方向 true  正方向   false  反方向
            randomPrize: false  //空格是否随机选取
        };
		
		//这里调用对象的获取用户自定义参数的方法，并且将默认参数合并
		$.extend(_this.setting, _this.getSettingUser());
	};

	LightRotate.prototype = {
		//扩展获取用户自定义参数的方法
		getSettingUser: function () {
            var userSetting = this.LightArea.attr('data-setting');
            if (userSetting && userSetting !== '') {
                return $.parseJSON(userSetting);
            } else {
                return {};
            }
        }
	}；

	LightRotate.init = function (select) {
        var _this = this;
        //根据不同的容器实例化不同的对象
        select.each(function () {
            new _this($(this));
        });
    };

    window.LightRotate = LightRotate;
})(jQuery);
```


####**5.销毁变量和参数的功能；**

最后一个就是我们的插件应该具有销毁自身变量和参数的功能。我们该怎么写呢？还是在上面的代码基础上继续扩展功能对象的可调用方法，代码如下：

```
LightRotate.prototype = {
		//扩展获取用户自定义参数的方法
		getSettingUser: function () {
            var userSetting = this.LightArea.attr('data-setting');
            if (userSetting && userSetting !== '') {
                return $.parseJSON(userSetting);
            } else {
                return {};
            }
        },
        //销毁对象参数
        destory: function () {
            $(_this.LightArea).off();
            this.closeAnimation();
            this.rewardTimer = null;
        }
	}；
```

**由以上我们的内容我们可以大概了解了一个成熟的插件应该具有的基本功能。**

###**2.插件开发和优化示例**
**刚好这个项目是在春节放假前的一个紧急的项目，当时为了赶进度就没有详细思考自己的代码结构，这样野味自己的后续优化提供了机会。**

由上一节介绍的定时器的内容可以知道 JavaScript  是**单线程**的。所以
>如果一段代码运行效率很低，就会影响后续代码的执行。**所以对于 JavaScript ，代码优化是必须的。**

先来看看我们的“跑马灯”插件应该具有哪些功能：

1. 能够控制灯是否自动播放；
2. 灯的旋转方向可以控制；
3. 灯的旋转速度可以控制；
4. 奖品的旋转速度可以控制；

**这里就不详细的介绍这些功能点的开发过程，仅仅介绍优化过程。如果有兴趣可以看我文章最后附上的源代码地址，进行下载阅读。**

####**1.*“顺序”*获取旋转灯代码的优化**
因为周围的灯我是使用绝对定位来做的，所以我需要“顺序”的获取他们的列表，然后操作。

**首先获取 DOM节点。**

```
//获取外围的灯，可以看到我这里使用的选择器多了一个 select，是为了获取当前容器下的某些元素，避免有多个容器存在时冲突
this.topLight = $('[node-type=re-top]', select).find('span');
this.rightLight = $('[node-type=re-right]', select).find('span');
this.bottomLight = $('[node-type=re-bottom]', select).find('span');
this.leftLight = $('[node-type=re-left]', select).find('span');
```

然后就应该“顺序”的获取“灯”节点的 DOM 元素列表。

**我的第一版是这样做的：**

```
Zepto(topLight).each(function() {
      lightList.push(this);
});

Zepto(rightLight).each(function() {
      lightList.push(this);
});

for (var j = bottomLight.length - 1; j >= 0; j--) {
     lightList.push(bottomLight[j]);
}

for (var m = leftLight.length - 1; m >= 0; m--) {
       lightList.push(leftLight[m]);
}
```

因为“下”和“左”方向的灯是需要倒序的，所以我使用了两个倒序的 for循环，其实当循环出现的时候，我们都应该思考我们的代码是否有可优化的空间。

**优化后的代码是这样子的，在这里我减少了4次循环的使用**
```
function () {
	var lightList = [];
    var bottomRever;
    var leftRever;
     bottomRever = Array.from(this.bottomLight).reverse();
     leftRever = Array.from(this.leftLight).reverse();

     lightList = Array.from(this.topLight).concat(Array.from(this.rightLight));
     lightList = lightList.concat(bottomRever);
     lightList = lightList.concat(leftRever);
     }
```

列表倒序我使用了原生 `Array`对象的`reverse`方法。

####**2.使用“闭包”优化顺序循环播放**

为了能够使我们的“灯”顺序的跑起来，第一版的思路是：
>*给**每一个“灯”（注意，这里是每一个，罪过...罪过...）**定义一个`setTimeout()`，执行时间就是数序的加入 js 执行队列中去。*

代码是下面这样子的：
```
			var zepto_light = Zepto(lightList);
            var changeTime = 100;
            var lightLength = zepto_light.length;
            var totleTime = changeTime * lightLength;

            function lightOpen() {
                for (var i = 0; i < lightLength; i++) {
                    (function temp(i) {
                        lightTimer = setTimeout(function() {
                            if (stopAnimation === false) {
                                Zepto(zepto_light).removeClass('light_open');
                                Zepto(zepto_light[i]).addClass("light_open");
                            } else {
                                return;
                            }
                        }, changeTime * i);
                    })(i);
                }
            }
```

这样子写的缺点很明显：**如果我有100个“灯”那么就会在当前的 js 执行队列中加入100个`setTimeout()`，再次强调的是我这里又使用了`for`循环，在时间复杂度上又增加了。代码的执行效率又下降了。**

后来思考了下，JavaScript 中“闭包”符合我当前的使用场景，就想着用闭包优化一下，优化后代码如下：

```
lightRun: function () {
            var _this = this;
            function tempFunc() {
                var lightList = _this.getLightList();
                var lightLength = lightList.length;
                var i = 0;
                return function () {

                    $(lightList, _this.LightArea).removeClass('light_open');
                    $(lightList[i], _this.LightArea).addClass("light_open");
                    i++;

                    //使一轮循环结束后能够继续下次循环
                    if (i === lightLength) {
                        i = 0;
                    }
                };
            }

            var lightRunFunc = tempFunc();
            lightRunFunc();
            _this.lightInterVal = setInterval(lightRunFunc, _this.setting.roLiSpeed);
        }
```

由以上的代码可以很明显的发现两个优点：**第一，就是减少了 `for`循环的使用，降低了代码的时间复杂度，第二就是，每次我仅仅在当前代码执行的队列中创建一个`setInterval()`。减小了执行队列的复杂度。**

到这里关于“跑马灯”插件的代码解析详和优化就已经完了。详细的代码和使用文档请[点击链接](https://github.com/zhiqiang21/WebComponent/tree/master/light-rotate)。如果有什么问题可以随时在 github 上反馈给我。

[![这里写图片描述](http://img.blog.csdn.net/20160215161117055)](https://github.com/zhiqiang21/WebComponent/tree/master/light-rotate)