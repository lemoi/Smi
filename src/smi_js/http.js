//dependcy promise
class http{
	static get(url,type){
		var ajax=new XMLHttpRequest();
		return new Promise(function(resolve,reject){
			ajax.onreadystatechange=function(){
				if(ajax.readyState==4){
					if(ajax.status==200){
						if(type!==undefined){
							ajax.responseType=type;
						}
						resolve(ajax.response);
					}else reject(new error("error: http respnose code is"+ajax.status));
				}
			};
			ajax.open("GET",url);
			ajax.send();
		});
	}
	static post(url,content,type){
	var ajax=new XMLHttpRequest();
	return new Promise(function(resolve,reject){
		ajax.onreadystatechange=function(){
			if(ajax.readyState==4){
				if(ajax.status==200){
					if(type!==undefined){
						ajax.responseType=type;
					}
					resolve(ajax.response);
				}else reject(new error("error: http respnose code is"+ajax.status));
			}
		};
		ajax.open("POST",url);
		ajax.send(content);
		});
	}
}
// http.get("https://www.baidu.com").then(function(fulfilled){
// 	console.log(fulfilled);
// },function(rejected){
// 	console.log(rejected);
// });

/*
var a=new http(url);
var b=a.get(url);//async 可选的url
var c=a.post(url);
b.then(function(val){
	
},function(val){
	//failed
})
*/