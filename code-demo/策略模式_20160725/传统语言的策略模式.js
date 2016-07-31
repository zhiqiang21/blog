/**
 * Created by baidu on 16/7/18.
 */


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





