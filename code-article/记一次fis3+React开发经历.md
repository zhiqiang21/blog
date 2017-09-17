## 前言：

虽然说是记录fis3+react的一次开发经历。但是在项目的上线前几天收到公司TC委员会的邮件，因为react的开源协议让找到react的替代方案，并且逐步下线线上的react项目。真的是可以用“出师未捷身先死”来形容这次开发了。

不过经过调研以后发现在业界已经有了一些开源方案来替代react 。最有名的就是preact的了吧。而且按照官网的方案来做迁移的话，迁移的成本也挺小的。后续会介绍下迁移的情况。本文也是主要介绍下，使用react+fis3开发的一些经验和其中遇到的问题的解决方案。

**下面的文章也统一用`react`这个名词。**


## 1.为什么要使用react+fis3
目前在选择使用`Vue`或者是`React`的时候，总要说些为什么要用。其实我的想法很简单。因为我们的产品是偏向业务型的，复杂的数据交互不多，但是流程多，而且很多业务要复用一些页面流程。按照我们旧的开发模式来说，我们的模板文件存在着很多的`if...else`来做流程判断。这样对于我们维护项目来说是非常的不方便的。我们希望引入一项技术来解决不同流程公用一些页面的问题，而且可以在不同的流程中自定义这个页面的表现的技术。

`React`的组件思想是一种解决方案。页面的每一个元素都可以作为一个组件来抽象。扩大到一个页面也可以作为一个组件。所以这是我选择`React`来开发我的页面。

按照业内主流做法使用react搭配webpack是最主流的。但是在公司内主推fis3的情况下还是选择了fis3。而且fi3的维护团队也产出过一篇引导文章和demo来介绍使用fi3开发react应用（参考文章见文章末尾）。

在项目开始前也在分析要不要引入`redux`。我们的页面是偏向业务的，很多页面都是表单的提交和验证。并没有很多的状态需要维护，而且我们的数据源也很单一。不过在经过一个页面的开发后还是发现一些页面引入`redux`会对开发工作带来很大的便利。


## 2.项目的目录结构和作用
react的开发模式基本上都差不多。因为这次我并没有引入`redux`。所以我的目录结构也相对简单一些。如下：

```
.
├── components    //组件目录
├── containers    //组件容器
├── language    //语言包目录，为项目做国际化预留的能力
├── node_modules       //npm依赖
├── package-lock.json
├── package.json
├── page    //页面模块
├── routes    //路由模块
├── state    //因为没有引入redux但是有一个页面的状态实在太多还是单独为它做了一个文件管理state
├── static    //静态文件模块
└── yarn.lock
```

## 3.拆分页面
使用react的第一项工作就是要拆分自己页面。把自己的页面拆分成“一块一块”
的组件。所以看下图我的页面结构。

![](http://7xs2tr.com1.z0.glb.clouddn.com/zhiqiang21/k25ud.PNG?imageMogr2/auto-orient/thumbnail/!80p/blur/1x0/quality/75|watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/400/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim)


我是这样拆分我的页面的，红色的线就是我的拆分模式。


![](http://7xs2tr.com1.z0.glb.clouddn.com/zhiqiang21/sw0ht.jpg?imageMogr2/auto-orient/thumbnail/!80p/blur/1x0/quality/75|watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/400/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim)

所以我的`components`目录下的文件是这样的，分别对应这我对页面拆分后的组件。

```
├── components
│   ├── Header.jsx
│   ├── Input.jsx
│   ├── PassBtn.jsx
│   ├── SafeCenter.jsx
│   ├── SafeList.jsx
│   ├── header.styl
│   ├── input.styl
│   ├── passbtn.styl
│   ├── safecenter.styl
│   └── safelist.styl
```


而我的`comtainers`目录就是对应着我的页面文件，其实就是一个个零散组件的容器。

```
├── containers
│   ├── BankList.jsx
│   ├── EditUserInfor.jsx
│   ├── EditUserInfor.styl
│   ├── SafeCenterIndex.jsx
│   ├── VerifyBank.jsx
│   ├── VerifyRealName.jsx
│   ├── banklist.styl
│   ├── verifybank.styl
│   └── verifyrealname.styl
```

还有最有一个值得介绍的就是`routes`目录，管理整个项目的路由。

```
├── routes
│   └── index.jsx
```
因为使用的`preact-router`这里的写法和`react-router`的有一些不同。代码如下：

```javascript
export default (
    <Router history={createBrowserHistory()} >
        <SafeCenterIndex path="/v4/security/"/>
        <VerifyRealName path="/v4/security/verifyname"/>
        <VerifyBank path="/v4/security/verifybank"/>
    </Router>
);

```

## 4.写react肯定会面临的问题

写react时，我们在享受着react的**visual dom**的高性能和不依赖dom的编程的便利时，面对最大的问题就是对组件的`state`的管理吧。当然最好的解决方案肯定是引入`redux`做状态管理。但是当我们没有引入`redux`时怎么办呢？

我先来举个简单的例子。我们有以下一个对像来管理页面的显示状态：

```javascript

var obj= {
    "aaa": {
    
        "bbb": {
            "ccc": {
                "ddd": {
                    "header": "istrue"
                }
            }
        }
    }
}

```

当我们的一个`state`嵌套太深时，按照我们使用js的一般做法要更新`header`的值的做法如下：

```javascript

 obj.aaa.bbb.ccc.ddd.header='isfalse'; 

```
有时候我们为了能够让代码更健壮可能会这么写：

```javascript
obj.aaa || obj.aaa.bbb || obj.aaa.bbb.ccc || obj.aaa.bbb.ccc.ddd || obj.aaa.bbb.ccc.ddd.header = 'isfalse'
```

会发现这样做真的繁琐。当然我在做的时候也面临着这样的问题。通过查询相关资料，最佳的解决方案当然还是引入`redux`。那么次佳的解决方案呢。其实就是引入第三方库，最具代表性的就是facebook自己的`facebook/immutable-js`。这个库能让我们方便、安全、高效的更新一个**层次**较深的`state`。但是也有一个缺点就是文件体积较大。当然与之相对应的就是开源大神做了优化后的版本`immutability-helper`和`immutability-helper`。

这三个库中文分析介绍的文档挺多的可以自行搜索了解。当然最后我上面的都没有用。因为之前的我的项目中已经引入了`lodash`这个开源库。而它也提供了较安全的更新一个深层次`object`的方法

如果使用lodash更新上面header的值，写法如下：

```javascript
import * as _ form 'lodash';

_.set(obj, 'aaa.bbb.ccc.ddd.header', 'isfalse');   //更新header的值

var header =  _.get(obj, 'aaa.bbb.ccc.ddd.header') //获取header的值

```

还有一个值得注意的地方就是在我们更新`state`之前，都是“克隆”而且是“深克隆”一个`state`去更新。“深克隆”肯定是会影响程序性能的，所以facebook的`facebook/immutable-js`提供了高效的方法去“深克隆”一个对象。

当然使用`lodash`也会更方便一些。但是这样的操作不应该经常的发生。

```javascript
import * as _ form 'lodash';

var initState = {};

var deepCloneState = _.cloneDeep(initState);   // 我们操作的其实都是这个clone的备份

```


第三个，出现的比较坑的问题。浏览器或者是webview缓存`GET`请求。

这个问题主要发生在需要多次以**`GET`**的方式请求同一个接口。解决的方案也挺简单就是在我们发起的GET请求后面加上时间戳。以使用`axios`为例：


```javascript
axios.get('/v4/xxx/action?v=' + (new Date).getTime())
    .then(data => {})
    .catch(err => {})
```


## 5.打包工具的配置
本来想统一的使用`typescript`插件来编译`jsx`的。因为迁移`preact`原因，要修改全局pragma。所以编译前端的jsx就使用了`babel-5.x`插件，以下是全局的配置文件介绍。


```javascript
// 定义一个全局的变量目录
const dirList = '{actions,components,constants,routes,containers,page,state,language,reducers,store}';

fis.match('/client/(' + dirList + '/**.{js,es,jsx,ts,tsx})', {
        parser: fis.plugin('babel-5.x', {
            sourceMaps: false,
            optional: ['es7.decorators', 'es7.classProperties'],
            jsxPragma: 'h'   // 这里也是最重要的迁移preact后必须加的一个参数
        }),
        // 页面中显示的url并且加上自定义的v4前缀
        url: '/v4${static}/${namespace}/$1$2$3$4$5$6$7$8$9$10',
        isJsXLike: true,
        // 设置位模块目录最后的编译结果都是会用define包裹
        isMod: true
    })
    // 这里都是为了给静态文件加上v4自定义前缀
    .match('/client/({components,containers}/**.styl)', {
        url: '/v4${static}/${namespace}/$1',
    })
    // 这里都是为了给静态文件加上v4自定义前缀
    .match('/client/static/({img,js,styl}/**.{png,js,ico,styl})', {
        url: '/v4${static}/${namespace}/static/$1$2$3'
    })
    
    // 因为使用的stylus做位css的预编译工具，这里的配置是编译stylus的配置
    .match('*.styl', {
        rExt: '.css',
        parser: fis.plugin('stylus', {
            sourcemap: false
        }),
        preprocessor: fis.plugin('autoprefixer', {
            'browsers': ['Android >= 2.1', 'iOS >= 4', 'ie >= 8', 'firefox >= 15'],
            'cascade': false
        })

    })

```


以上的配置文件是开发环境的配置，在页面加载的时候也是对静态文件逐条加载的。

![](http://7xs2tr.com1.z0.glb.clouddn.com/zhiqiang21/my2dd.jpg?imageMogr2/auto-orient/thumbnail/!80p/blur/1x0/quality/75|watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/400/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim)

而且页面的加载时间也比较长不符合我们线上的加载静态文件的需求。

![](http://7xs2tr.com1.z0.glb.clouddn.com/zhiqiang21/mv4i9.jpg?imageMogr2/auto-orient/thumbnail/!80p/blur/1x0/quality/75|watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/400/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim)



紧接着对打包脚本进行优化


```javascript
fis.media('prod')
   // 压缩css 
    .match('*.{styl,css}', {
        'useHash': true,
        'optimizer': fis.plugin('clean-css')
    })
    .match('/client/node_modules/**.{js,jsx}', {
        'isMod': true
    })
    .match('/client/**.{js,es,jsx,ts,tsx}', {
        'preprocessor': [
            fis.plugin('js-require-file'),
            fis.plugin('js-require-css')
        ]
    })
    
    //合并静态文件
    .match('::packager', {
        'packager': fis.plugin('deps-pack', {
            // 将所有的npm依赖打包成一个文件
            '/client/pkg/npm/bundle.js': [
                '/client/page/index.js:deps',
                '!/client/' + dirList + '/**'
            ],
            //将所有的业务代码打包成一个文件
            '/client/pkg/npm/index.js': [
                '/client/page/index.js',
                '/client/page/index.js:deps'
            ],
            //将所有的css文件打包成一个文件
            '/client/pkg/npm/bundle.css': [
                '/client/**.{styl,css}',
                '!/client/static/**.{styl,css}'
            ]
        })
    })
    //给所有打包完的文件加前缀
    .match('/client/(pkg/npm/**.{js,css})', {
        'url': '/v4${static}/${namespace}/$1',
    });

```

这样做最后线上的页面加载时，加载的静态文件（除了图片）只有3个。页面的加载时间也保留在**`200ms`**以内。而所有的npm依赖最后的bundle文件也只有80kb的大小。这个对于现代的前端网络是可以接受的。
![](http://7xs2tr.com1.z0.glb.clouddn.com/zhiqiang21/w005y.jpg?imageMogr2/auto-orient/thumbnail/!80p/blur/1x0/quality/75|watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/400/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim)


排除非首屏的加载，使用缓存加载页面的。这个时间已经缩短的极小了。

![](http://7xs2tr.com1.z0.glb.clouddn.com/zhiqiang21/1cg5w.jpg?imageMogr2/auto-orient/thumbnail/!80p/blur/1x0/quality/75|watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/400/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim)


以下是我在一APP内打开页面后，每次都使用缓存文件加载的结果。所有的静态文件都使用了本地缓存，http状态码都是**304**。

![](http://7xs2tr.com1.z0.glb.clouddn.com/zhiqiang21/uw5sd.jpg?imageMogr2/auto-orient/thumbnail/!80p/blur/1x0/quality/75|watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/400/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim)


在这个过程中也发现一个问题，就是使用时间戳的方式和使用hash戳的方式，缓存静态文件。观察下面的截图发现，**使用时间戳的方式，并不能有效的缓存我们的静态文件，每次进入页面，静态文件都重新发起了请求。因为又没有使用CDN加速，这样其实也间接的对我们的服务器造成压力。**

![](http://7xs2tr.com1.z0.glb.clouddn.com/zhiqiang21/f6hkd.jpg?imageMogr2/auto-orient/thumbnail/!80p/blur/1x0/quality/75|watermark/2/text/aHR0cHM6Ly9naXRodWIuY29tL3poaXFpYW5nMjE=/font/5b6u6L2v6ZuF6buR/fontsize/400/fill/I0ZBMEMwQw==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim)





## 迁移preact

最后就是介绍下迁移react到preact我都是做了那些工作吧。当然按照官网提供的步骤一步一步走肯定是没有错的。

首先是修改库的引入方式

```javascript

import {h, render, Component} from 'preact';

```

因为使用了`preact-router`。所以路由的配置方式和`react-router`的有些不一样的

```javascript
import {h, render, Component} from 'preact';
import {Router} from 'preact-router';
// import {Router} from 'react-router';
import SafeCenterIndex from '../containers/SafeCenterIndex';
import VerifyRealName from '../containers/VerifyRealName';
import VerifyBank from '../containers/VerifyBank';
import {createBrowserHistory} from 'history';



export default (
    //这里的写法和react-router不一样。
    <Router history={createBrowserHistory()} >
        <SafeCenterIndex path="/v4/security/"/>
        <VerifyRealName path="/v4/security/verifyname"/>
        <VerifyBank path="/v4/security/verifybank"/>
    </Router>
);
```

第二就是修改编译的打包脚本。按照官网的介绍就是要修改最后编译结果的jsx的包裹方式。在前面的关于打包脚本的配置已经介绍过了.主要就是配置`jsxPragma`属性。

```javascript
fis.match('/client/(' + dirList + '/**.{js,es,jsx,ts,tsx})', {
        parser: fis.plugin('babel-5.x', {
            sourceMaps: false,
            optional: ['es7.decorators', 'es7.classProperties'],
            jsxPragma: 'h'
        }),
        url: '/v4${static}/${namespace}/$1$2$3$4$5$6$7$8$9$10',
        isJsXLike: true,
        isMod: true
    })
```



## 后续的计划

1. 引入redux做状态管理
2. 因为使用了preact，它默认是不提供prop-type做类型检查的。所以以后准备在项目引入typescript编写代码。因为它默认提供了静态类型检查的机制。
3. 因为react的特点。当我们切换页面的时候其实是在不同的view（或者说是state）间进行切换。我们并没有重新请求页面服务器。所以页面切换的时候可以做一些类似原生的切换动画。
4. 将静态文件的加载走cdn加速域名。



## 参考文章：

1. [如何用 fis3 来开发 React?](https://fex.baidu.com/blog/2016/04/develop-react-with-fis3/)


