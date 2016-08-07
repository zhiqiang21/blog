
- [引子：](#引子)
- [1.JavaScript 中的变量类型和类型检测](#1javascript-中的变量类型和类型检测)
	- [1.1原始类型](#11原始类型)
	- [1.2引用类型](#12引用类型)
	- [1.3內建类型的实例化](#13內建类型的实例化)
	- [1.4函数的字面形式](#14函数的字面形式)
	- [1.5正则表达式的字面形式](#15正则表达式的字面形式)
	- [1.6类型检测](#16类型检测)
		- [1.6.1原始类型的检测](#161原始类型的检测)
		- [1.6.2鉴别引用类型](#162鉴别引用类型)
		- [1.6.3鉴别数组](#163鉴别数组)
		- [1.6.4原始封装类型](#164原始封装类型)
- [2.JavaScript 中的函数](#2javascript-中的函数)
	- [2.1定义函数的两种方式](#21定义函数的两种方式)
		- [2.1.1函数声明](#211函数声明)
		- [2.1.2函数表达式](#212函数表达式)
	- [2.2JavaScript函数的参数](#22javascript函数的参数)
	- [2.3函数的重载](#23函数的重载)
	- [2.4函数使用最重要的3个点](#24函数使用最重要的3个点)
		- [2.4.1 this的使用](#241-this的使用)
		- [2.4.2 call和apply的使用](#242-call和apply的使用)
		- [2.4.3 bind的使用](#243-bind的使用)


# 引子：

最近看了两本书，书中有些内容对自己还是很新的，有些内容是之前自己理解不够深的，所以拿出来总结一下，这两本书的名字如下：

- JavaScript 面向对象精要
- JavaScript 启示录

**如果对于 JavaScript 面向对象编程理解不够深的话，第一本书还是强烈推荐的。第二本书比较适合初中级的开发者阅读。对各种知识点都有代码示例。内容中规中矩。**

# 1.JavaScript 中的变量类型和类型检测

C#和Java等编程语言用栈存储原始类型，用堆存储引用类型，**JavaScript则完全不同：它使用一个变量对象追踪变量的生存期。原始值被直接保存在变量对象内，而引用值则作为一个指针保存在变量对象内**，该指针指向实际对象在内存中的存储位置。

## 1.1原始类型

在 JavaScript 中有5中原始类型，分别如下：

类型表达式     | 类型描述
:-------- | :-------------------------------------------------
boolean   | 布尔，值为 false或者 true
number    | 数字，值为任何整型或者浮点数值
string    | 字符串，值由单引号或者双引号括出的单个字符或者连续字符（JavaScript不区分字符类型）
null      | 空类型，该原始类型仅有一个值：null
undefined | 未定义，该原始类型仅有一个值：undefined(undefined会被赋给一个还没有初始化的变量)

所有原始类型的值都有字面形式，字面形式是不被保存在变量中的值。

```javascript

//string

var name='zhiqiang';
var selection='a';

//number

var count=235;
var cost=1.51;

//boolean

var found=true;

//null

var object=null;

//undefined

var flag=undefined;
var ref;

console.log(ref);  //undefined
```

原始类型的变量直接保存原始值（而不是一个指向对象的指针）。当将原始值赋值给一个变量时，该值将被复制到变量中。也就是说，如果你使一个变量等于另一个时，每个变量有它自己的一份数据拷贝。

示例代码如下：

```javascript
var color1='red';
var color2=color1;
```

内存中的保存形式，如下图：

![](http://ww1.sinaimg.cn/large/698e22a9jw1f5x8hodl02j20iu07it8x.jpg)

## 1.2引用类型

引用类型是在JavaScript中找到最能接近类的东西。引用值是引用类型的实例，也是对象的同义词。属性包含键（始终是字符串）和值。如果一个属性的值是函数，它就被称为方法。JavaScript中函数其实是引用值，除了函数可以运行以外，一个包含数组的属性和一个包含函数的属性没有区别。

创建引用类型的两种方式看下面的一段代码：

```javascript
//第一种使用new操作符
var obj1 = new Object();  //
var obj2 = obj1;

//第二种
var obj3 = {}
```

以上两种创建对象的方式并没有本质的区别，是等价的。

那么当我们创建了一个对象，且发生了赋值的时候，在内存中发生了什么呢？

**看下图：**

1.当发生了`new`操作的时候，先在内存中开辟一块空间，存放创建的对象，并且使`obj1`指向这块开辟的空间；

![](http://ww3.sinaimg.cn/mw690/698e22a9jw1f6cx4kh96fj20h608w74m.jpg)

2.引用类型发生赋值的时候，仅仅是引用地址指向了内存中的同一块区域；

![](http://ww4.sinaimg.cn/mw690/698e22a9jw1f6cx54dg6pj20lg0840t2.jpg)

JavaScript语言有"垃圾回收"功能，所以在使用引用类型的时候无需担心内存分配。但是为了防止"内存泄露"还是应该在不实用对象的时候将该对象的引用赋值为`null`。让"垃圾回收"器在特定的时间对那一块内存进行回收。

## 1.3內建类型的实例化

JavaScript中的內建类型如下：

类型       | 类型描述
:------- | :-------------------
Array    | 数组类型，以数字为索引的一组值的有序列表
Date     | 日期和时间类型
Error    | 运行期错误类型
Function | 函数类型
Object   | 通用对象类型
RegExp   | 正则表达式类型

內建引用类型有字面形式。字面形式允许你在不需要使用`new`操作符和构造函数显式创建对象的情况下生成引用值。（包括字符串，数字，布尔，空类型和未定义）；

## 1.4函数的字面形式

创建函数的三种方式：

```javascript
//第一种函数声明
function abc(){
    console.log(1);
}

//使用构造函数的形式
var value = new Function('','console.log(1)');

//函数表达式
var a = function(){
    console.log(1);
};
```

使用构造函数的方式创建函数，不易读，且调试不方便，不建议使用这种方式创建函数。

## 1.5正则表达式的字面形式

在JavaScript中使用正则表达式有两种方式：

```javascript
var a1 = /\d+/g;//使用字面形式
var a2 = new RegExp('\\d+','g');//使用构造函数的形式
```

在JavaScript中建议使用字面形式的正则表达式，因为不需要担心字符串中的转义字符。比如上面示例代码中字面形式使用`\d`而构造函数使用的是`\\d`；

## 1.6类型检测

### 1.6.1原始类型的检测

使用`typeof`运算符可以完成对原始类型的检测，看下面的一段代码：

![](http://ww3.sinaimg.cn/mw690/698e22a9jw1f6cybpefb3j20f60iewg0.jpg)

上面的代码中有一段比较特殊就是

```javascript
typeof null   //object
```

这里其实是不准确的，如果我们要判断一个值是否为空类型的最佳的方式是直接和`null`进行比较

```javascript
console.log(value === null);
```

`==`和`===`之间的最主要的区别就是前者在进行比较的时候会进行类型转化，而后者不会；

```javascript
console.log(5==5);//true
console.log('5'==5);//false
console.log('5'===5);//fasle
```

### 1.6.2鉴别引用类型

JavaScript中对于引用类型的检测较为复杂。对于函数类型的引用使用`typeof`返回的是`Function`，而对于非函数的引用类型返回的则是`object`。所以在JavaScript中鉴别引用类型的类型引入了`instanceof`。

> `instanceof`操作符以一个对象和一个构造函数作为参数；

```javascript
function a (){}
var b = {};
var c =[];

typeof a   // function
typeof b  //object
typeof c //object

a instanceof Function //true
b instanceof Object  //true
c instanceof Array   //true
```

### 1.6.3鉴别数组

有前一小结可以知道鉴别数组类型可以使用`instanceof`。但是在ECMAScript5中，`Array`对象提供了更好的方式来鉴别一个变量是不是数组类型。

```javascript
var a = [];
var b =3;
Array.isArray(a);  //true
Array.isArray(b); //false
```

**注意：IE8及更早的IE不支持该方法**

### 1.6.4原始封装类型

JavaScript中的原始封装类型共有3种。这些特殊引用类型的存在使得原始类型用起来和对象一样方便。**当读取字符串，数字，布尔类型时，原始封装类型被自动创建。**

```javascript
var a ='qwer';
var firstChar = a.chatAt(0);
console.log(firstChar);//  q
```

在JavaScript引擎中发生了如下的过程：

```javascript
var a ='qwer';
var temp = new String(a);
var firstChar = temp.chatAt(0);
temp =null;
console.log(firstChar);//  q
```

由于要把字符串当成对象使用，JavaScript引擎创建了一个字符串实体让`charAt`可以工作，字符串对象（`temp`）的存在仅仅用于该语句（`temp.chatAt(0)`）,随后便被销毁(`temp =null`)。

我们可以简单测试一下

```javascript
var a ='qwer';
a.temp ='122';
console.log(a.temp);  //undefined
```

上面代码的过程如下：

```javascript

var a ='qwer';
var temp = new String(a);
temp.temp ='122';
temp=null;

var temp = new String(a);
console.log(a.temp);  //undefined
temp=null;
```

由上面的代码我们可以看到我们实际上是在一个立刻就会被销毁的对象上而不是字符串上添加了一个新属性。当试图访问这个属性时，另一个不同的临时对象被创建，而新属性并不存在。虽然原始封装类型会被自动创建，但是在这些值上进行`instanceof`检查对应类型的返回值却都是`false`;

```javascript
var a ='1234';
var num = 10;

a instanceof String //false
num instanceof Number //false
```

这是因为临时对象仅在值被读取的时候创建，随即被销毁。`instanceof`操作符并没有读取到任何东西，也没有临时对象的创建，因此它告诉我们这些值并不属于原始封装类型；

但是我们可以手动创建原始封装类型，但是此时使用`typeof`没办法检测对象的实际类型,只能够使用`instanceof`来检测变量类型；

![](http://ww1.sinaimg.cn/mw690/698e22a9jw1f6d03avilej20gq0msq4t.jpg)

## 2.JavaScript 中的函数

在JavaScript中函数就是对象。函数不同于其他对象的决定性特点是，函数存在一个被称为`[[Call]]`的内部属性。内部属性无法通过代码访问而是定义了代码执行时的行为。ECMAScript为JavaScript的对象定义了多种内部属性，这些内部属性都用**双重中括号**来标注。

`[[Call]]`属性是函数独有的，表明该对象可以被执行。由于仅函数拥有该属性，ECMAScript定义了`typeof`操作符对任何具有`[[Call]]`属性的对象返回`**function**`>

### 2.1定义函数的两种方式

#### 2.1.1函数声明

函数声明是以`function`关键字开头，**这也是区别函数声明和函数表达式的一个重要的方法**。函数声明会在编译期对整个作用域内的变量名字进行查询，函数声明的变量被提升至上下文的顶部，也就是说可以先使用函数后声明它们。

```javascript
abc();
function abc(){
    console.log(2);
}
```

#### 2.1.2函数表达式

函数表达式是`function`关键字后边不需要加上函数的名字。这种函数被称为匿名函数。因为函数对象本身没有名字，所以函数表达式通常会被一个变量或者属性引用。

```javascript
abcd()
var abcd=function(){
    console.log(1)
};

var aaa={
    abc:function(){

    }
}
```

函数表达式只能通过变量引用，无法提升匿名函数的作用域。在使用函数表达式之前必须先创建它们，否则代码会报错。看示例代码的运行结果：

![](http://ww2.sinaimg.cn/mw690/698e22a9gw1f6dfmwbo9xj20ma0bqq4d.jpg)

### 2.2JavaScript函数的参数

JavaScript函数参数与很多语言函数参数不一样。你可以给函数传递任意数量的参数却不造成错误。那是因为函数实际上被保存在一个被称为`arguments`的类似数组的对象中。`arguments`可以自由增长来包含任意个数的值，这些值可以通过数字索引来引用。`arguments`的`length`属性会告诉你目前有多少个值（函数接受了多少个参数）。

> `arguments`是一个类数组对象，它本身并不具有JavaScript数组应该具有的全部的属性和方法。

这里我们思考一个问题，我们怎么将一个类数组转化为真正的数组？

1. 最基本的我们应该想到的是创建一个原始的空数组，使用`for`循环将类数组中的每一项添加到新的数组中；
2. 如果使用`Zepto`或者`jQuery`的话，会有一个`toArray()`的方法可以使用；
3. ES6有`Array.from(arrayLike[, mapFn[, thisArg]])`可以将类数组转化为数组对象；
4. 最后一种也是最高级的一种方法就是使用原型的方式；

借用原型的方式把一个类数组转化为真正的数组的示例代码：

```javascript

function abc(){
    console.log(arguments);
    var arrTemp = [].slice.apply(arguments);   //相当于Array.prototype.slice == [].slice
    console.log(arrTemp);
    console.log(Array.isArray(arrTemp));
}

abc(1,2,3);
```

输出结果：

![](http://ww1.sinaimg.cn/mw690/698e22a9jw1f6l0tzufyzj20s40dojt6.jpg)

### 2.3函数的重载

依稀的记得在学习的从C# 的时候，这些强类型语言对**重载**的定义：函数名相同，参数不同，或者是参数类型不同都可以叫做函数的重载。

但是在JavaScript这样的语言中因为 `arguments`的存在，JavaScript的函数根本就不存在所谓的签名，所以**重载**在JavaScript中实际是不存在的。

但是我们可以根据`arguments`传入函数体的参数个数来模拟_函数重载_：

```javascript
function abc(){
    if (arguments.length ===1){
        //A
    }
    if(arguments.length ===2){
        //B
    }
}

abc(11);
abc(11,22);
```

这里主要是满足某些特殊场合的需求吧。

### 2.4函数使用最重要的3个点

1. this;
2. apply()和call();
3. bind();

关于`this`，`call`，`apply`，`bind`这几个概念在之前博客文章已经介绍过很多遍了。在这里还是做一下简单的介绍。

#### 2.4.1 this的使用

> **this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁，实际上this的最终指向的是那个调用它的对象;**

`this`指向的对象是在代码的运行期决定的。既上面说的，谁调用了它，就指向谁。一个很简单的总结就是，在函数中使用`this`，当前`this`指向的是当前`window`对象。在对象的方法中使用`this`,`this`指向的是当前对象（这个也是最容易出错的地方）。

#### 2.4.2 call和apply的使用

关于这两个概念，之前的博客文章也介绍多很多次。这里也简单总结介绍一下。`call`和`apply`主要是在执行某个对象的方法的时候来改变当前`this`的指向。主要用在对象继承的时候。

#### 2.4.3 bind的使用

`bind`也是改变对象`this`指向的一个方法。这个方法是ECMAScript5中新添加的一个方法。但是`bind`和`call`,`apply`的主要区别就是`bind`的第一个参数是要传给新函数的this的值。其它所有参数代表需要被永久设置在新函数中的命名参数。可以在之后继续设置任何非永久参数。

来看一段示例代码：

```javascript
function abc (lab){
    console.log(lab + this.name);
}

var person1 = {
    name:'xiaogang'
}

var person2={
    name:'zhiqiang21'
}

var sayNamePer1 =abc.bind(person1);
sayNamePer1('person1');


var sayNamePer2 =abc.bind(person2,'person2');
sayNamePer2();

person2.sayName = sayNamePer1;
person2.sayName('person2');
```

![](http://ww1.sinaimg.cn/mw690/698e22a9gw1f6l20nfuw9j20vu0l6jun.jpg)

上面的代码中：

`sayNamePer1`在绑定的时候没有传入参数，所以仍需要后续执行`sayNamePer1`来传入`lab`参数；`sayNamePer2`不仅绑定了`this`为`person2`，还绑定了输入的第一个参数是`person2`。意味着可以可以直接执行`sayNamePer2()`。最后一个是将`sayNamePer1`设置位`person2`的`sayName`方法。由于其`this`的值已经绑定，所以虽然`sayNamePer1`是`person2`的方法，但是输出的仍然是`person1.name`的值。

**其实总结一句话`call`,`apply`和bind的主要区别就是：**

> `call`和`apply`是绑定既执行。`bind`是有返回值的，先绑定后执行。
