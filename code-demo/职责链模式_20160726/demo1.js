/**
 * Created by baidu on 16/7/23.
 */

/**
 *
 * @param orderType 订单类型
 * @param pay   用户是否已经支付过定金 true or false
 * @param stock 表示手机的库存量
 */
var order = function (orderType, pay, stock){
    if (orderType === 1) {
        if (pay === true) {
            console.log('500定金预购,得到100元优惠券');
        }
        else {
            if (stock > 0) {
                console.log('普通购买,没有优惠券');
            }
            else {
                console.log('手机库存不足');
            }
        }
    }
    else if (orderType === 2) {
        if (pay === true) {
            console.log('200定金预购,得到50元优惠券');
        }
        else {
            if (stock > 0) {
                console.log('普通购买,没有优惠券');
            }
            else {
                console.log('手机库存不足');
            }
        }
    }
    else if (orderType === 3) {
        if (stock > 0) {
            console.log('普通购买,没有优惠券');
        }
        else {
            console.log('手机库存不足');
        }
    }
};