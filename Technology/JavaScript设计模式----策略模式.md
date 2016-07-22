
### 1.策略模式的定义
将不变的部分和变化的部分隔开是每个设计模式的主题。

>定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

### 2.策略模式的目的
将算法的使用与算法的实现分离开来。


### 3.传统语言中的策略模式和JavaScript中的策略模式对比

#### 3.1.传统语言中的策略模式

```javascript

var performances = function () {};

performances.prototype.calculate = function (salary) {
    return salary * 4;
};

var performanceA =function () {};

performanceA.prototype.calculate=function (salary) {
    return salary * 3;
};

var performanceB =function () {};

performanceB.prototype.calculate=function (salary) {
    return salary * 2;
};

//定义奖金类Bonus

var Bonus =function () {
    this.salary = null;  //原始工资
    this.strategy = null;//绩效等级对应的策略对象
};

Bonus.prototype.setSalary=function (salary) {
    this.salary=salary;  //设置员工的原始工资
};

Bonus.prototype.setStrategy=function (strategy) {
    this.strategy=strategy;//设置绩效等级对应的策略对象
};


Bonus.prototype.getBonus =function () { //取得奖金数额
    return this.strategy.calculate(this.salary);//把计算奖金的操作委托给对应的策略对象
};




var bonus = new Bonus();
bonus.setSalary(10000);
bonus.setStrategy(new performances());//设置策略对象

console.log(bonus.getBonus());

bonus.setStrategy(new performanceA());

console.log(bonus.getBonus());



```

#### 3.2.JavaScript中的策略模式


```javascript

//封装的策略算法
var strategies={
    "S":function (salary) {
        return salary * 4;
    },
    "A":function (salary) {
        return salary * 3;
    },
    "B":function (salary) {
        return salary * 2;
    }
};


//具体的计算方法
var calculateBonus=function (level, salary) {
    return strategies[level](salary);
};

console.log(calculateBonus('S',1000));
console.log(calculateBonus('A',4000));
```
