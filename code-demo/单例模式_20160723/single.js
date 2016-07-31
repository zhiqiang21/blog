/**
 * Created by baidu on 16/7/22.
 */

//获取单例
var getSingle = function(fn){
    var result;
    return function (){
        return result || (result=fn.apply(this,arguments));
    };
};

//创建登录框
var createLoginLayer=function (){
    var div= document.createElement('div');
    div.innerHTML='我是登录框';
    document.body.appendChild(div);
    return div;
};

var createSingleLoginLayer = getSingle(createLoginLayer);

var loginLayer1 = createSingleLoginLayer();
var loginLayer2 = createSingleLoginLayer();

console.log(loginLayer1 === loginLayer2);
