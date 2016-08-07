function abc (lab){
    console.log(lab + this.name);
}

var person1 = {
    name:'xiaogang'
}

var person2={
    name:'zhiqiang21'
}

var sayNamePer1 =abc.bind(person1);
sayNamePer1('person1');


var sayNamePer2 =abc.bind(person2,'person2');
sayNamePer2();

person2.sayName = sayNamePer1;
person2.sayName('person2');