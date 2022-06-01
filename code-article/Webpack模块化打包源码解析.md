因为开发习惯的问题，一直在使用FIS3作为前端工程化工具。对于FIS3解决前端模块依赖的问题一直有些疑惑，所以前段时间就专门研究了一下。刚好最近的项目中用到了webpack就顺便研究了一下Webpack是怎么解决前端模块化问题的。

首先按照Webpack的官方文档介绍，Webpack是分别支持AMD,CMD,Common.js,UMD的前端模块化打包方案的。平时自己也主要是使用Common.js规范。所以这篇文章主要分析Webpack是怎么解决Commonjs规范的文件依赖的。

## 同步加载代码

首先我简单定义了三个模块的文件：

a.js

```javascript

exports.aaaFn = () => {
    console.log('*****************************');
    console.log('我是a模块');
    console.log('*******************************');
};

```


b.js

```javascript
const aFn = require('./a');
console.log(aFn.aaaFn());

```

c.js

```javascript
exports.ccFn = () => {
    console.log('*****************************');
    console.log('我是C模块');
    console.log('*******************************');
}

```
我的webpack的配置如下：

```javascript

const path = require('path');

module.exports = {
    entry: './js/b.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: 'file:///Users/TestDemo/webpack模块/dist/'
    },
    mode: 'development'
};

```

由webpack的配置文件可以知道，我的入口文件时`b.js`而且在`b.js`文件中可以看到我依赖了`a.js`.

那么运行webpack进行编译，会在dist目录下产出一个`bundle.js`的文件。打开这个文件，可以看到webpack在编译期合并了a.js和b.js之外还为我们生成了一大坨的其它的代码。当然这些额外的其它代码就是webpack帮我们解决模块依赖的代码。

那我们就一步一步来分析：





## 异步加载代码

## 1.require.ensure方式


## 2.import...then...方式
