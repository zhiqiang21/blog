/**
 * Created by baidu on 16/7/23.
 */

//500元订单
var order500 = function (orderType, pay, stock){
    if (orderType === 1 && pay === true) {
        console.log('500定金预购,得到100元优惠券');
    }
    else {
        order200(orderType, pay, stock);  //将请求传递给200
    }
};

//200元订单
var order200 = function (orderType, pay, stock){
    if (orderType === 2 && pay === true) {
        console.log('200定金预购,得到50元优惠券');
    }
    else {
        order(orderType, pay, stock);
    }
};

//普通购买订单
var order = function (orderType, pay, stock){
    if (stock>0) {
        console.log('普通购买,没有优惠券');
    }
    else {
    console.log('手机库存不足');
    }
};

//测试调用
order500(1,true,500);
order500(3,false,0);