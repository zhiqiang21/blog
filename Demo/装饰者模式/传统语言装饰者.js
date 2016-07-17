/**
 * Created by baidu on 16/7/17.
 */


//模拟传统语言的装饰者
var Plan = function () {
};

Plan.prototype.fire = function () {
    console.log('发射普通子弹');
};

var MissileDecorator = function (plan) {
    this.plan = plan;
}

MissileDecorator.prototype.fire = function () {
    this.plan.fire();
    console.log('发射导弹!');
};

var plan = new Plan();
plan = new MissileDecorator(plan);
plan.fire();



