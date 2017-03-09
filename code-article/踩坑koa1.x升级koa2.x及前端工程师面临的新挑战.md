
# 前言

较早的Nodejs开发者为了实现程序的同步都会使用几个“工具”，`回调`，`promise`，`co`，或者是`generator`。记得写过一个递归删除目录下文件和文件夹的需求，用以上方法都是各种不爽（关键我就是想简单的写个递归啊）。

![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-06-9216f85db30b55123fbb78c1f.png?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)



就在前几天Nodejs发布了`v7.6.0`版本。Nodejs开发者终于不用使用第三方模块就可以使用`async`和`await`让自己的程序在不需要异步的地方保持同步的特性了。

就在Nodejs `v7.6.0`刚发布不久，**koa**的作者也正式的发布的**koa2**。

![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-06-072643.jpg?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)

一句话总结：使用`async`和`await`是极大的解放生产力，减少脑细胞的消耗。

因为之前使用koa做了一个小项目，想着就把它给升级一下，及做一下网络请求方面的优化。

## 1.升级koa2.x及相关koa依赖

因为koa1.x和koa2.x区别还是挺大的。大部分的中间件目前已经做了针对koa2.x的兼容。没有做兼容的中间件，koa2.x本身也提供了方法进行兼容（后面会提到用法）。

升级的方法也很简单就是针对每一个中间件执行：`yarn add koa-xxxxx@next ` 就可以升级到最新版本；

以下就是项目所依赖所有的中间件，都已经升级了最新的支持koa2。

```javascript
"koa-bodyparser": "^3.2.0",
"koa-compress": "^2.0.0",
"koa-convert": "^1.2.0",
"koa-router": "^7.0.1",
"koa-static": "^3.0.0",
"koa-static-cache": "^4.0.0",
"koa-views": "^5.2.1",
```

## 2.针对koa2.x的特点对项目进行重构

koa1.x的特点就是使用`genetator`来控制项目的同步，而koa2.x最大的特点就是使用`async`和`await`

`generator`的写法：

```javascript
myRouter.get('/', function *(){
    let body ;
    let peopleList =configParams.onDutyPeople();

    body = yield render('index', {'peopleList':peopleList});
    this.body = body;
    this.type='text/html; charset=utf-8';
});
```


`await`的写法
```javascript
router
    .get('/', async(ctx, next) => {
        let peopleList = configParams.onDutyPeople();

        await ctx.render('index.jade', { 'peopleList': peopleList });
        ctx.type = 'text/html; charset=utf-8';
    })
```


## 3.不兼容koa2.x的中间件怎么办
在做网络优化的时候用到一个中间件`koa-static-cache`。这个中间件目前是不兼容koa2.x的，那么怎么在Koa2.x中使用呢？

**运行的时候报错信息如下：**

![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-06-064112.jpg?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)




**通过网络查询得出原因如下：**


![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-06-v3%E4%B8%8D%E6%94%AF%E6%8C%81koa2.png?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)

解决方法如下，使用`koa-convert`中间件把`generator`转化一下，使用方法如下：

```javascript
const convert = require('koa-convert');
const staticCache = require('koa-static-cache');

//静态文件服务
app.use(convert(staticCache(path.join(__dirname, 'public'), {
    maxAge: 365 * 24 * 60 * 60
})));
```

对于代码的重构就是这样子，在需要使用`promise`来控制异步的地方，可以换写成`async`和`await`降低了代码的复杂度。第二就是对不支持koa2.x的中间件使用`koa-convert`来做兼容。




## 4.网络请求的优化

**通过下面的图片可以发现，页面在加载过程中请求了多个静态文件。这无疑会影响页面的加载速度。从打开页面到页面加载完成总共花费了`2.59s`**

![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-06-133504.jpg?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)

**那么怎么优化呢？其实就是借用了请打的fis对静态文件进行了压缩和合并。使页面在加载过程需要多个静态文件，变成只请求两个静态文件。最后优化的结果是页面加载只需要`1.76s`比之前快了将近`1s`。效果还是很明显的。**

![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-06-133353.jpg?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)


**当我在观察这些网络请求的时候发现一个问题。每次我刷新页面或者是关闭浏览器重新打开页面的时候，浏览器都没有使用本地的缓存文件，而是重新向服务器发送请求，下载需要的静态文件。看下面的截图：**

![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-06-132259.jpg?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)

## 5.使浏览器使用本地缓存文件


做法也很简单，就是使用koa中间件`koa-static-cache`控制服务端的静态文件在客户单进行缓存。

```javascript

//静态文件服务
app.use(convert(staticCache(path.join(__dirname, 'public'), {
    maxAge: 365 * 24 * 60 * 60
})));
```

我们来看看这样做到底有没有什么效果？看下面的截图（我多刷了几次页面）：

![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-07-073724.jpg?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)


与前面的那张截图做对比可以明显的发现，静态文件的下载时间变短了。页面加载时间变为了**1.44s**。比之前还是有所缩短的。而且在size那一栏会看到**from memorycache**和**from disk cache**这样的字段。而不再是显示具体的文件大小。关于这里的区别可以看文章最后的参考文章。


## 6.对“文件”资源进行压缩

大多数情况下，我们的网站不仅仅就是存文字的还要包含一些其他类型的文件，比如：图片，mp3等。我们知道浏览器是支持加载gzip压缩过的网页的，所以以nginx为代表的静态文件服务器默认都会开启gzip压缩。那么我们Nodejs服务能不能对资源文件进行压缩呢？

答案是肯定的。Koa的作者写了一个中间件`compress`,支持对请求的`response`进行压缩，具体的使用如下：

```javascript
var compress = require('koa-compress')
var Koa = require('koa')

var app = new Koa()
app.use(compress({
  filter: function (content_type) {  //配置过滤的压缩文件的类型
    return /text/i.test(content_type)
  },
  threshold: 2048,   //要压缩的最小响应字节
  flush: require('zlib').Z_SYNC_FLUSH  //同步的刷新缓冲区数据；
}))
```

因为当前项目中并没有提价较大的文件，所以该中间件并没有在项目中使用。这里仅仅介绍koa有中间件提供这样的能力供开发者使用。

## 7.怎么维护一个稳定nodejs服务

像这样`node app.js`来维护线上的服务肯定是不行。因为端口可能会不知不觉让linux给kill掉。目前在业界普遍使用的都是pm2来维护nodejs服务。提供了日志，端口被Kill后自动重启，性能监控等强大的功能。


### 7.1收集系统日志

使用pm2启动Nodejs进程后，会默认吧代码运行异常的错误和标准输出日志（比如：console.log）打到以下的目录下面。

![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-07-083116.jpg?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)


### 7.2进程信息

提供了进行运行时相关信息；

![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-07-083321.jpg?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)

### 7.3性能监控

提供了内存监控和cpu监控的命令。

![](http://7xs2tr.com1.z0.glb.clouddn.com/2017-03-07-084814.jpg?imageslim&watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/600/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10)



## 总结：

FE到现在在大多数的后端工程师眼中都是切切页面，用js写写“特效”的角色。所以被大家戏称为“页面仔”。这也是为什么说FE是一个很容易遇到职业瓶颈的行业。

自从基于Nodejs的前后端开发模式在业界得到越来越多的实践后，前端工程师在其中扮演着重要的角色。由以上内容可以看出，在使用Nodejs以后，虽然前端技术栈得到了机房，但对FE的个人素质要求也会有所提高，**性能优化**，**网络请求优化**都是前端工程师需要去面临的问题。因为我们会成为用户发起的网络请求在服务端的第一层接收者，我们也会面临着**web安全**的问题。


## 参考资料：

[Koa文档](http://koajs.com/)

[Koa2入门](https://cnodejs.org/topic/5709959abc564eaf3c6a48c8)

[配置错误产生的差距：200 OK (FROM CACHE) 与 304 NOT MODIFIED](   http://div.io/topic/854)

[HTTP缓存技术，304(Not Modified)和200(from cache)有何区别？](https://www.oschina.net/question/1395553_175941)
















