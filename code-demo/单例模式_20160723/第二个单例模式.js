var Singleton = function(name) {
    this.name = name;
};

Singleton.prototype.getName = function() {
    alert(this.name);
};

//利用闭包的特性创建单例,同时符合惰性单例的特性
Singleton.getInstance = (function(name) {
    var instance;
    return function(name){
        if (!instance) {
            instance = new Singleton(name);
        }
    }
})();

var a = Singleton.getInstance('seven1');
var b = Singleton.getInstance('seven2');

console.log(a===b);   //true
