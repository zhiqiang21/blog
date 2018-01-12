## 背景
我们团队有个项目由于开发时间较长，且是前后端杂糅的开发方式，维护成本很高，在线上暴露的问题很多。而且因为对接了公司一百多条产品线，每天都会接到大量的客诉和产品线反馈的问题。2017年11月份以产品为主导，从产品层面对流程进行重新设计，对该项目进行了前后端的重构。作为前端的负责人我用这篇文章分享下，整个过程从技术选型，开发，上线的一些经验。


## 技术选型的思考
首先我们先看下下面我们项目中的几个页面，来总结下一些他们的特点。

![](http://ww1.sinaimg.cn/mw690/698e22a9ly1fndnn1miboj205k0923yt.jpg)![](http://ww1.sinaimg.cn/mw690/698e22a9ly1fndnnb4rbxj205k09gmxp.jpg)![](http://ww1.sinaimg.cn/mw690/698e22a9ly1fndnkv75ouj205k0a1755.jpg)

我们的页面主要是需要用户填写的表单居多，在页面加载的时候不需要去请求获取和渲染大量的数据。而且一个页面需要显示的状态较多（比如上面的3张图，在项目中是一个组件）。还有一个最主要的业务需求，百度公司内部产品线较多，不同的业务都有其独特的账号标签，这些账号除了会走一些通用流程还要走一些对应产品线特色的流程。

结合这些业务特色和之前有Nodejs和React的开发经验，我整体的一个技术选型是FIS3+Nodejs+React+Redux+React-Router。那么这些技术选型能带来什么呢？

1. 前端可以在浏览器端控制页面跳转的路由，增加了前端开发的灵活性；
2. 页面可以根据业务需求在服务选择模板引擎渲染或者是同构渲染；
3. 前端对错误码文案和页面文案做统一的管理，而且通过Nodejs来实现线下“热更新”他们，线上实时生效；
4. 有了Redux之后，做跨组件（多页面）的数据共享更加方便。减少无意义的网络请求。提高项目运行的稳定性和可用性。

这里简单的聊下工程化工具的选择。目前在业内最火的工程化工具就是Webpack了吧。除了看过文档之外，并没有太多的实际应用经验。**我一直认为使用工具就是来帮助开发者解决一些开发过程中遇到的一些需要人为频繁去操作的无异议的工作**。抛开Webpack我们依旧可以手动去编译代码，手动部署，手动刷新页面来开发，使用工具只是让这一系列的流程能够连贯起来，降低开发成本。

**在我的所有跟公司有关的项目中选择的都是FIS3，我也认为他足够的好用，能满足我各色各样的工程化需求。我并不是排斥Webpack。我只是还没有找到一个理由，让我选择放弃现在使用的FIS3去使用Webpack。**

## 新老框架机制的区别
这里简单介绍下，决定了技术选型之后，对于渲染页面渲染机制的一些区别。

![](https://ws2.sinaimg.cn/large/006tKfTcly1fndokxpjruj315o0fodj5.jpg)

之前旧项目使用PHP+Smarty的渲染模式，将页面在服务端渲染完成之后再统一吐给前端浏览器。而使用新的技术架构之后，我们渲染页面的方式更加的灵活。可以选择在服务端渲染，可以完全交给浏览器渲染，可以同构渲染。**因为我们的页面在首屏的时候不需要加载大量的数据，所以我还是让大部分页面在浏览器端进行渲染。**

还有一种区别就是之前所有来自用户的请求都会落到PHP的服务器上去。而新框架的请求都会落到前端的Nodejs服务器上去。所以前端工程师不仅仅是写好页面和做好兼容性。对前端工程师的技术能力也会带来考验。


![](https://ws4.sinaimg.cn/large/006tKfTcly1fndp4weij7j30dw0cp3yt.jpg)


## React带给前端的便利

### 前端控制路由渲染页面
前面谈的技术选型已经提到了使用React-Router来做页面路由控制。而且React-Router提供了异步加载组件的功能，这为我们上线优化页面的异步加载提供了技术基础。

```javascript
<Route path="/v4/appeal/fillname" component={FillName} />
{* 这里对某些组件做异步加载 *}
<Route
    path="/v4/appeal/selectuser"
    getComponent={selectUser()}
/>
        
function selectUser() {
    return (location, cb) => {
            require(['../accountselect/container/AccountSelect'], function (component) {
                cb(null, component);
            });
        };
    }
```

通过React-Router来做路由控制除了前端代码之外，服务端也许呀做些配置。不然我们的页面在回退的时候就会出现问题（页面找不到路由）。其实就是在我们通常说的action成面做下路由控制，因为我使用的是Nodejs，所以我的配置下面这样子的。


```javascript
router.get('/fillname', router.action('index'));
router.get('/selectuser', router.action('index'));
```

### 事件
在前端事件因为开源协议的问题曾经短暂使用过Preact。React和Preact最大的区别就是对于一些事件的封装。这些造成了Preact相对于React体积小很多。
做移动端开发，前端经常会面临的一个问题就是`click`事件 **300ms** 延时的问题。在React中提供的`onClick`事件同样也会出现这样的问题。如果如果我们想要在点击一个按钮之后，在其它地方立即出现反馈，最好就是使用`onTouchEnd`事件，或者就是使用开源的Npm包`react-fastclick`能很好的解决`click`事件 **`300ms`**延时的问题。


使用的方法就是在我们代码的入口地方，声明以下语句，他默认会改变react的`onClick`事件的行为


```javascript
import initReactFastclick from 'react-fastclick';

initReactFastclick();
```



### 组件的设计
在使用React的时候可能都会面临的问题，我的组件应该是无状态的还是有状态的。我的组件状态怎么共享。什么时候我应该使用Redux来管理组件的状态。刚开始接触react都会有这样的疑问吧。

一种比较极端的做法就是，不管状态需不需要共享，组件的所有状态都试用Redux来管理。这样的做法就是我们需要写大量的Action。如果是一两个页面还好，如果是十几个页面，真的写action是能把人写崩溃的。

**那么最佳实践是什么呢？看下图**

![](https://ws3.sinaimg.cn/large/006tKfTcly1fndtrwpwpaj312y0b8why.jpg)


当我们要写一个组件的时候，首先想下这个组件是不是需要与其它组件共享它本身的状态。如果需要我们应该把它当做有状态的组件来设计，而且共享的状态使用Redux来管理。如果简单的就是无状态组件或者是这个组件本身的状态改变不会影响其它的组件，就可以将组件设计为无状态组件（虽然叫无状态组件，其实组件本身的状态也是可以使用`this.state`来管理的）。


### 组件的复用关系

React的一大热点就是组件化的开发思想。小到页面上的一个按钮都是可以设计成一个组件。既然是组件我们首先就应该考虑这个组件怎么被其它组件复用。

**举个简单的例子，在整个项目中都会用到的弹窗组件：**

```javascript

class AlertForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showlayout: false,  // false 以tip的方式提示错误， true以弹层的方式提示错误
            btnlist: false,
            formbtn: false
        };
    }

    componentWillReceiveProps(nextProps) {
        
    }

    handleHideLayout = () => {
    }

    handleMobile = () => {
    }

    handleChangeCheck = () => {
        history.go(-1);
    }

    render() {

        return (
            <div className="component-alertform" style={this.state.showlayout ? {display: 'block'} : {display: 'none'}}>
                
            </div>
        );
    }
}

export default AlertForm;

```


我们将这种可能在其他页面都用的组件单独抽象成出来，在需要用的地方`import`。

```javascript
import AlertForm from '../../components/AlertForm';

<AlertForm
    errno={errno}
    stateObj={fillAppealName}
    actions={actions}
/>
```


## 开发环境和生产环境打包优化

**完成项目之后肯定要做的一项工作就是上下前的优化，上线前我做的工作主要如下：**

![](https://ws1.sinaimg.cn/large/006tKfTcly1fnduw1bw6oj30dw080q46.jpg)

前面已经谈到错对于大多数用户来说都只是会走一些普通流程。有些具有产品线特色的用户会走一些特殊流程。所以在上线前肯定要拆包，和做组件的异步加载。具体的前面已经提到过了。在打包的时候对这些页面的js需要使用打包工具做单独的处理。

![](https://ws3.sinaimg.cn/large/006tKfTcly1fndv1ii7iij31kw0nlala.jpg)

其实除了这些需要异步加载的页面之外还会存在一些其他自己编写的lib库（自己编写的小函数）。还有比如全国省市地区对应关系，电话区号对应关系。因为这些函数或者是地区关系映射图在上线以后基本上都是不会再变化的，所以与业务的js分开打包。

**我们的打包的配置文件如下：**

![](https://ws2.sinaimg.cn/large/006tKfTcly1fndv6yxpn7j30dw0hiwkb.jpg)



## 运维
前面已经谈到使用Nodejs做中间层，做路由控制和服务端渲染。下面的这张图是我写这篇文章的时候截取的额以上服务实时状态图。可以发现，整个应用对于内存、磁盘IO利用率还是很正常的，对于CPU的利用率有点儿高，这也是后续需要优化的地方。

**这里想要说的是，如果使用了Nodejs，使用了服务端渲染，对于前端工程师的个人素质要求会比较高，因为需要处理很多服务端的问题。前面也分享过一篇处理安全工单的问题，不仅仅要面对服务端的问题，还有面对来自互联网安全的问题。**

![](https://ws3.sinaimg.cn/large/006tKfTcly1fndvacshx1j30rs0den25.jpg)

## 其它能力补充

使用Nodejs除了来做服务端渲染。我还在使用Nodejs做了一些其它的工作。
![](https://ws4.sinaimg.cn/large/006tKfTcly1fndv8vmejqj30dw074gmm.jpg)


比如我在服务端使用Nodejs管理了这样一个JSON文件。PHP端不在维护错误码和错误码显示的文案。所有前端需要显示文案放在Nodejs端做统一的管理。而且，我线下也可以同通过系统对这些错误文案进行动态的更新。提高系统的可用性。

![](https://ws4.sinaimg.cn/large/006tKfTcly1fndvgtcpy8j30om07ajso.jpg)



