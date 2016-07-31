/**
 * Created by baidu on 16/7/23.
 */

//500元订单
var order500 = function (orderType, pay, stock){
    if (orderType === 1 && pay === true) {
        console.log('500定金预购,得到100元优惠券');
    }
    else {
        return 'nextSuccessor';
    }
};

//300元订单
var order300=function (){

};

//200元订单
var order200 = function (orderType, pay, stock){
    if (orderType === 2 && pay === true) {
        console.log('200定金预购,得到50元优惠券');
    }
    else {
        return 'nextSuccessor';
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

var Chain=function (fn){
    this.fn=fn;
    this.successor=null;
};

Chain.prototype.setNextSuccessor=function (successor){
    return this.successor=successor;
};

Chain.prototype.passRequest=function(){
    var ret= this.fn.apply(this,arguments);

    if(ret==='nextSuccessor'){
        return this.successor && this.successor.passRequest.apply(this.successor,arguments);
    }

    return ret;
};

var chainOrder500=new Chain(order500());
var chainOrder300=new Chain(order300());
var chainOrder200=new Chain(order200());
var chainOrderNormal=new Chain(order());


chainOrder500.setNextSuccessor(chainOrder300);
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

chainOrder500.passRequest(1,true,500);
chainOrder500.passRequest(2,true,500);
chainOrder500.passRequest(1,false,0);


Chain.prototype.next=function(){
    return this.successor && this.successor.passRequest.apply(this.successor,arguments);
};



//异步职责链的例子
var fn1=new Chain(function (){
    console.log(1);
    return 'nextSuccessor';
});

var fn2=new Chain(function (){
    console.log(2);
    var self=this;
    setTimeout(function (){
        self.next();
    },1000);

});

var fn3=new Chain(function (){
    console.log(3);

});

fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
fn1.passRequest();


