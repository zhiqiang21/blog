var Singleton = function(name) {
    this.name = name;
    this.instance = null;
};

Singleton.prototype.getName = function() {
    alert(this.name);
};

Singleton.getInstance = function(name) {
    if (!this.instance) {
        this.instance = new Singleton(name);
    }

    return this.instance;
};

var a = Singleton.getInstance('seven1');
var b = Singleton.getInstance('seven2');

//或者使用
