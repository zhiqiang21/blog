var createLoginLayer=(function(){
    var div;
    return function(){
        if(!div){
            div=document.createElement('div');
            //创建一个登录框
        }
        return div;
    }
})();

document.getElementById('loginBtn').onclick=function(){
    var loginLayer=createLoginLayer();
    loginLayer.style.display='block';
};