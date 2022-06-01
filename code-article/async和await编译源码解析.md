# async和await 编译源码解析

async和await是目前最好用也是最常用的在js中将异步的代码块变成同步执行的代码块的方法了。那么在async和await之后又是谁做了哪些工作呢？今天就来分析下babel编译后的结果。也会简单的介绍下ts的编译结果与babel的差异。


先来看一段实例代码

```javascript
async function func1() {
  console.log('func1');

    setTimeout(() => {
        console.log('func1 log settimeout0');
    }, 0)

  const aaa = await func2();

  console.log('func1 log aaa', aaa);
}

async function func2() {
  return new Promise((resolve, reject) => {
    console.log('func2');
    var _func2 = 0;

    setTimeout(function () {
      _func2 = 3;
      console.log('333', _func2);
      resolve(_func2);
    }, 1000);

    console.log('222', _func2);
  });

   setTimeout(() => {
        console.log('func1 log settimeout0');
    }, 0);
}

func1();

```


那么上面的那段代码经过babel处理后变成了什么呢？ 我们使用[babel的在线编译工具](https://babeljs.io/repl) 处理后，看到编译后的结果主要有以下几个部分：

```javascript
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
}

function _asyncToGenerator(fn) {
    
}

function func1() {
}

function _func() {
    }

function func2() {
}

function _func3() {
}


// 入口函数
func1();


```
