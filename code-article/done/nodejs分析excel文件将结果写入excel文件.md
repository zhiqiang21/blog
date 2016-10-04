# 背景
因为 Team 本身工作性质的问题，平时需要值班。值班数据可以导出为本地的Excel文件。之后需要对Excel中的结果数据做分析，并且制作图表写周报发给老大。

对于我这种对word都玩不转的人，别说用Excel中强大的公式分析数据了😓。轮到我值班的时候就用nodejs写了一个脚本自动处理Excel中的数据，并且将数据再写入Excel文件。后来分享给同事，得到了老大的夸奖，自信心爆棚  😂

之前仅仅为了满足工作的需要写的比较的随便，刚好国庆有时间按照CMD规范重写一下。然后分享给大家。

## 脚本目的
读取Excel文件，分析Excel中的数据，并且将结果写入Excel中。

## 使用的第三方包
在这个过程中使用了两个第三方的包分别如下：

```javascript
require('date-utils');
var xlsx = require('node-xlsx');
```

使用`date-utils`主要是用来做一些时间上的处理。比如说时间差，当前时间向后加七天的日期。这个包非常的强大。可以看下API：

具体的API详细文档可以参考这里：[点击](https://jerrysievert.github.io/date-utils/Date.html)[这里](https://segmentfault.com/a/1190000003777624)

**上面的两片文档可以结合着看。**


`<static>`这些方法扩展的是Date对象，而后面的这些方法这些用于对象的实例。实例代码如下：

```javascript

//当前日期推后7天的日期
var time = '2016-10-04 14:30:24'
var nextSevenDay = (new Date(time)).add({'day':7});

//比较时间差
var temp = Date.compare(time1,time2);   //结果位数值

```

2. `node-xlsx`主要做一些excel相关的处理

比如说读取Excel 文件：

```javascript
var workExcel = xlsx.parse('xxx.xls');
```

比如创建excel文件对象：

```javascript
var buffer = xlsx.build([{name: name, data: datalist}]);
```



## cmd规范相关内容

如果对CMD规范不熟悉的话可以[参考这里](https://github.com/seajs/seajs/issues/242)

我的脚本的目录结构如下：
![](http://ww1.sinaimg.cn/large/698e22a9jw1f8godil3dgj20j2088758.jpg)

如果对`package.json`文件配置不是很熟悉的话可以[参考这里](http://javascript.ruanyifeng.com/nodejs/packagejson.html)


![](http://ww4.sinaimg.cn/large/698e22a9jw1f8goc812m2j20o20e6abe.jpg)



主要代码解析：

通过`node-xlsx` 读取的excel文件就是一个json数据。我们应该都知道一个Excel文件可以包含多张表，每张表都可以管理自己的数据。

看照上面已知内容，代码如下：

```javascript
//读取某个excel文件
var chatExcel = xlsx.parse('./历史记录.xls');

//获取需要excel某个表中的数据
var tableData = excelFunc.getDataContent('历史记录', chatExcel);

//获取当前表中获取第一行数据，通常在excel中这一行就是每一列的title
var tableTitle = tableData[0];
```


在使用nodejs的过程中可能最大的一个迷惑就是区别`exports`和`module.exports`吧，它们两者的主要区别如下：

![](http://ww4.sinaimg.cn/large/698e22a9jw1f8gntz46wmj21260n4af6.jpg)


**1. 简单的代码示例：**

一个test1.js文件，其中代码如下：

```javascript

module.exports="test";

exports.fileName = function(){
    console.log('test1');
};

```

在test2.js文件中使用test1.js模块的方法：

```javascript
var test1 = require('test1');

test1.fileName();    //TypeError: Object test! has no method 'fileName'

```



**2. 如果模块是一个类如有一个consoleName.js的文件，其中代码如下：**


```javascript
module.exports=function(name){
    this.name =name;
    this.consoleName = function(){
        console.log(this.name);
    }
}

```

其它模块中的调用模块的方法：

```javascript
var ConsoleName = require('consoleName');
var con = new ConsoleName('zhiqiang');
con.consoleName();  //zhiqiang
```



**3. 如果模块是一个数组，例如有一个test1.js的文件，其中的代码如下：**


```javascript
module.exports =['zhiqiang1','houzhiqiang'];

```

在其它模块的调用方法

```javascript
var arr =require('test1')
console.log(arr[1])   //houzhiqiang

```



其它的代码就没有什么别的了，都是关于公式的存计算的问题。如果有兴趣的同学可以访问源码看一下。[源码地址](https://github.com/zhiqiang21/nodetools)