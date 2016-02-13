// function foo(x,y,z){
// 	console.log(x,y,z);
// }
// foo(...[1,2,3]);
// function foo(x,y,...z){
// 	console.log(z);
// }
// foo(1,2,3,4,5);
// var a=[2,3,4];
// console.log([...a])
// var {a:x,b:y,c:z}={x:1,y:2,z:3};
// var {x,y,z}={x:1,y:2,z:3};
// var ({x:bam,y:baz,z:bap}={x:1,y:2,z:3});
// console.log(bam,baz,bap);
// var x=1,y=3;
// [x,y]=[y,x];
// function foo(strings,...values){
// 	console.log(strings,values);
// }
// var desc="awesome";
// console.log(`Everything is ${desc}!`);

// var n1=0o52;
// var n2=42;
// var n3=0x2a;
// var n4=0b101010;
// console.log(n1,n2,n3,n4);

// var m=new Map();
// m.set("foo",42);
// m.set({cool:true},"hello world");
// var it1=m.entries();
// console.log(it1.next());
// console.log(it1.next());
// console.log(it1.next());

// var Fib={
// 	[Symbol.iterator](){
// 		var n1=1,n2=1;
// 		return {
// 			next() {
// 				var current=n1;
// 				n2=n1;
// 				n1=n1+n2;
// 				return {value:current,done:false};
// 			},
// 			return(v) {
// 				console.log("Fibonacci sequence abandoned");
// 				return {value:v,done:true};
// 			}
// 		};
// 	}
// };
// for(var v of Fib){
// 	console.log(v);
// 	if(v>50) break;
// }
// var tasks={
// 	[Symbol.iterator](){
// 		var steps=this.actions.slice();
// 		return {
// 			next(...args){
// 				if(steps.length>0){
// 					let res=steps.shift()(...args);
// 					return {value:res,done:false}
// 				}else{
// 					return {value:res,done:false};
// 				}
// 			},
// 			return(v){
// 				steps.length=0;
// 				return {value:v,done:true};
// 			}
// 		}
// 	},
// 	actions:[]
// };
// tasks.actions.push(
// 	function step1(x){
// 		console.log("step 1:x",x);
// 		return x*2;
// 	},
// 	function step2(x,y){
// 		console.log("step2",x,y);
// 		return x+(y*2);
// 	},
// 	function(x,y,z){
// 		console.log("step 3:",x,y,z);
// 		return (x*y)+z;
// 	}
// );
// var it=tasks[Symbol.iterator]();
// it.next(10);
// it.next(20,50);
// it.next(20,50,120);
// it.next();

// if(!Number.prototype[Symbol.iterator]){
// 	Object.defineProperty(
// 		Number.prototype,
// 		Symbol.iterator,
// 		{
// 			writable:true,
// 			configurable:true,
// 			enumerable:false,
// 			value:function(){
// 				var i,inc,done=false,top=+this;
// 				inc=1*(top<0?-1:1);
// 				return {
// 					next(){
// 						if(!done){
// 							if(i==null){
// 								i=0;
// 							}else if(top>=0){
// 								i=Math.min(top,i+inc);
// 							}else{
// 								i=Math.max(top,i+inc)
// 							}
// 							if(i==top) done=true;
// 							return {value:i,done:false};
// 						}else{
// 							return {done:true};
// 						}
// 					}
// 				};
// 			}
// 		}
// 	);
// }
// var c=0;
// for(var i of 3){
// 	if(c++>5) break;
// 	console.log(i);
// }

// var [a,b,c,d,e]=[...3];
// console.log([...3])
'use strict';
// class A{
// 	constructor(a,b){
// 		this.a=a;
// 		this.b=b;
// 	}
// 	printab(){
// 		console.log(this.a,this.b)
// 	}
// }
// class B extends A{
// 	constructor(a,b,c){
// 		super(a,b);
// 		this.c=c;
// 	}
// 	printabc(){
// 		super.printab();
// 		console.log(this.c);
// 	}
// }
// var a=new B(1,2,3);
// a.printabc()
// class A extends Array{
// 	static get [Symbol.species](){console.log(this);return Array;};
// }
// var b=new A();
// console.log(b,b instanceof A);

var a = {
	a: 1
};
var pro = Proxy.revocable(a, {
	get: function get(target, key, context) {
		console.log(key);
	}
});
a.a;