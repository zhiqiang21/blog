/**
 * Created by baidu on 16/7/18.
 */


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