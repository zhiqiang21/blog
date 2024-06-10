[TOC]

### 前言

最近在学习下React Fiber架构，把相关内容了下，方便理解并且加深自己的印象。本篇文章主要分为三个内容：**基础知识储备**，**架构的设计**，**框架运行流程**。

### 1.单线程和“非阻塞”

**单线程**：js 是单线程的，这意味着在任何给定时间，只能执行一段代码。所有的代码执行都在一个主线程上完成。这种设计简化了编程模型，因为开发者不需要处理多线程编程中常见的数据竞争、死锁等问题
**非阻塞**：尽管 js 是单线程的，但它使用了事件循环和回调机制来支持非阻塞的 I/O 操作（例如网络请求、文件操作等）。这意味着当一个 I/O js 不会停下来等待操作完成，而是继续执行后续的代码。当 I/O 操作完成后，对应的回调函数会被放入事件队列中，等待主线程执行。

### 2.浏览器的刷新频率
因为JS 脚本执行和浏览器布局、绘制不能同时执行，所以 **gui渲染线程 与 js线程 是互斥的**。主流浏览器刷新频率为 60Hz，即每（1000ms / 60Hz）16.6ms 浏览器刷新一次。在 **16.6ms** 内，浏览器要处理**js脚本执行**、 **样式布局**、 **样式绘制**，如果任一环节的执行时间超过了16.6ms就会导致页面**掉帧**、**卡顿**。
**人眼的可视帧数是24Hz**，如果低于这个帧数，就能明显感受到卡顿，越高于这个帧数显示就越流畅。

### 3.单核cpu运行多任务

当我一次了解React Fiber架构时第一时间想到的是单核cpu时代，计算机是如何保证“多任务”运行的。

#### 3.1 .时间片轮转调度

  - 操作系统将 CPU 时间划分为称为“时间片”的小段。
  - 每个程序被分配一个时间片，即一段固定的处理时间。当程序的时间片用尽时，即使它还没有完成，CPU 也会被强制切换到另一个程序。
  - 操作系统的调度器维护一个就绪队列，所有准备执行的任务按一定的顺序排列在这个队列中。
  - 当一个任务的时间片结束后，它会被移回队列的末尾，CPU 则被分配给队列中的下一个任务。

#### 3.2 中断机制

  - 中断是由硬件或软件生成的信号，它告诉处理器立即停止当前任务，转而处理更高优先级的事件。
  - 中断可以由多种事件触发，如输入/输出请求完成、外部设备如键盘和鼠标的活动等。
  - 当中断发生时，操作系统会保存当前任务的状态，处理中断，然后恢复之前的任务或根据优先级调度新的任务。

#### 3.3 多级反馈队列

  - 这是一种更复杂的调度算法，用于进一步优化任务的响应时间和CPU利用率。
  - 它使用多个队列，每个队列有不同的优先级。任务可以根据它们的行为（如CPU使用时间和等待时间）在队列之间移动。
  - 这样可以保证即使系统中存在大量的后台任务，前台任务（如用户交互任务）也可以快速响应。

单核 cpu 和js 单线程的模型很像，都是一次只能处理一个任务，但是单核cpu借助 **时间片调度**、**中断机制**、**多级反馈队列**模拟了运行多任务目的。

### 4.基础API依赖

react主要是用下面的浏览器api ，在浏览器模拟“多任务”的执行。

#### 4.1 requestIdleCallback

这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序

#### 4.2  requestAnimationFrame

告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

为了提高性能和电池寿命，在大多数浏览器里，当 `requestAnimationFrame() `运行在后台标签页或者隐藏的 <iframe> 里时，`requestAnimationFrame() `会被暂停调用以提升性能和电池寿命。

#### 4.3 MessageChannel

使用` MessageChannel() `构造函数来创建通讯信道。一旦创建，信道的两个端口即可通过 `MessageChannel.port1` 和 `MessageChannel.port2 `属性进行访问（都会返回 MessagePort 对象）。创建信道的应用程序使用 port1，在另一端的程序使用 port2——你向 port2 发送信息，然后携带 2 个参数（需要传递的消息，要传递所有权的对象，在这里是 port 自身）调用 window.postMessage 方法将端口信息传递到另一个浏览器上下文。

#### 4.5MessageChannel的执行时机

```javascript
main();
function main() {
    let channel = new MessageChannel();
    let port1 = channel.port1;
    let port2 = channel.port2;
    port1.onmessage = function(e){
        console.log("port1接收到数据：",e.data);
    }
    
    setTimeout(() => {
        console.log('我是setTimeout:0')
    }, 0)

    port2.postMessage("port2数据:main");
    new Promise((resolve, reject) => {
        console.log('我是微任务Promise')
        port2.postMessage("port2数据:Promise");
        resolve()
    }).then((data) => {
        console.log('我是微任务Promise.then')
    });
    console.log('主线程任务！！！')
}
```

在浏览器环境中调整上述代码中的顺序，看下面的执行结果：

![](https://cdn.jsdelivr.net/gh/zhiqiang21/img-map@master/Microsoft%20Edge%202024-06-10%2013.41.04.png)

**对比上图代码在浏览器环境中执行结果得出以下结论：**

1. **new  Promise()函数，是在主线程立即执行；**

2. **MessageChannel和setTimeout(fn, 0)类似，主线程执行结束后，如果有postMessage，立即执行。并且两者之前没有优先级关系，谁在前面就先执行谁**
3. **微任务then的执行优先级比MessageChannel和setTimeout(fn, 0)都要高；**

> 这里的Promise是浏览器的原生API，如果使用某些库可能执行顺序会有差异。因为库会考虑兼容性问题，使用settimeout(fn, 0)模拟微任务。

##### 浏览器兼容性

| 主流浏览器列表  | requestIdleCallback | requestAnimationFrame | MessageChannel |
| --------------- | ------------------- | --------------------- | -------------- |
| Chrome  android | 47                  | 25                    | 18             |
| Firefox android | 55                  | 23                    | 41             |
| Opera android   | 34                  | 14                    | 11             |
| Chrome          | 47                  | 24                    | 2              |
| Edge            | 79                  | 12                    | 12             |
| FireFox         | 55                  | 23                    | 41             |
| Safari          | ❌                   | 7                     | 5              |

因为浏览器兼容性问题，react主要使用**requestAnimationFrame**和**MessageChannel** 来模拟实现**requestIdleCallback**的功能，并且是用**settimeout**来实现降级策略。

### 5.如何模拟“闲时”调用

根据前置知识，**requestAnimationFrame（RAF）**可以在浏览器重绘前执行指定的回调函数。可以将优先级较高（显示、用户操作等）相关的任务用RAF回调执行，当一帧执行完之后如果还有剩余的空闲时间，就通过postmessage告知任务队列当前帧有空余时间可以执行低优先级的任务。



![react原理-闲时调用 (2)](https://cdn.jsdelivr.net/gh/zhiqiang21/img-map@master/202406101638018.jpg)

```javascript
// 模拟暂停任务
function sleep(duration){
    let now = Date.now();
    while(duration+now>Date.now()){
    }
}

// 一帧的时间 16.6ms
let activeTimeFrame = 1000/60;
// 一帧结束的时间戳
let deadFrameTime;
let pendingCallback;
let channel = new MessageChannel();
// 当前帧剩余的时间
let timeRemaining = ()=>deadFrameTime - performance.now();
channel.port2.onmessage = function(){
    console.log("接收到port1 返回的消息");
    let currentTime = performance.now();
    let didTimeOut = deadFrameTime <= currentTime;
    if(didTimeOut||timeRemaining()>0){
        if(pendingCallback){
            pendingCallback({didTimeOut,timeRemaining})
        }
    }
}
// 模拟requestIdlCallback
window.requestIdleCallback = function(callback,option){
    window.requestAnimationFrame((rafTime)=>{
        console.log(rafTime);
        // 这里是计算，当前帧结束的时间
        deadFrameTime = rafTime + activeTimeFrame;
        pendingCallback = callback;
        channel.port1.postMessage("hello");
    })
}
let works = [
    ()=>{
        console.log("任务1")
        sleep(20);
    }, ()=>{
        console.log("任务2")
        sleep(20);
    },()=>{
        sleep(20);
        console.log("任务3")
    },()=>{
        sleep(20);
        console.log("任务4")
    },()=>{
        sleep(20);
        console.log("任务5")
    },
]
function progress(dealine){
    console.log("剩下多少空闲的时间：",dealine.timeRemaining());
    if(dealine.timeRemaining()>0&&works.length>0){
        performUnitOfWork();
    }
    if(works.length>0){
        window.requestIdleCallback(progress);
    }
}
function performUnitOfWork(){
    let work = works.shift();
    work();
}
window.requestIdleCallback(progress);
```

### 6.扩展知识

#### 进程

进程是操作系统分配资源和调度的基本单位。一个进程包含了运行程序所需的代码和数据资源，以及执行的上下文。进程间相互独立，拥有各自独立的地址空间，一个进程无法直接访问另一个进程的资源和数据。

#### 线程

线程是进程内的一个执行流程，是 CPU 调度和执行的最小单位。一个进程可以包含多个线程，它们共享该进程的资源（如内存空间）。线程之间的通信和数据共享比进程间更简单、效率更高，但这也意味着线程之间的同步非常重要，以避免数据竞争和不一致。协程

#### 协程

协程是一种用户态的轻量级"线程"，它的调度完全由用户控制，不需要操作系统介入。协程提供了非常高效的异步编程模型，能在等待操作（如 I/O）完成时挂起当前协程，并恢复其他协程的执行，从而提高程序的整体效率和响应性。

#### 纤程

纤程是一种比线程更轻量级的协作单元，它与协程类似，通常用于特定的程序库中实现。纤程的调度也是用户级的，允许开发者控制何时进行任务切换，适用于需要高度控制并发操作的场景。











