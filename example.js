example:
var a=CUI.deF({
	state:{

	},
	prop:{
		_class:,
		_title:,
		_name:,	
		_style:,
		_data:,
		_raw_:,
	},
	fns:{

	},
	content:function(){
		return this.prop.l;
	}
});
var c1=CUI.deF({
	state:{//改变其中的属性值导致刷新
		a:"a";
	},//隐藏掉
	prop:{// 合并属性 包含自己定义的和父类元素传递进来的
		c:this.state.a;
	},
	fns:{
		handleClick:function(EVENT){
			this.state.a="c";
		},
		requstData:function(){
			var promise=new Promise(requstData());
			promise.then(function resolve(data){this.state.b=2;},function reject(){});	//提供setstate()Api		
		}
	},
	raw:"div",
	content:function(){
		return [
			   a({l:this.prop.a,b:"b"},{click:this.fns.handleClick}),
			   a({l:"a"})
			   ];                                 //需要动态刷新的属性存在于this.state中
	}
}
});
CUI.render(c1({},{}),document.getElementById("ele"));

父元素prop->子元素prop 单向复制

prop中
建议只传递必要的属性，不建议传递元素内建属性
父元素传递值的优先级高于自元素
组件渲染中父元素传递属性值与子元素属性值同名，优先覆盖
_raw_作为特殊prop可预先配置是否有意愿通过父元素传值改变其属性值
fns与prop相似

组件名({prop对象},{fns对象})
fns作为特殊prop
核查prop是否非function
核查fns是否为function
参数2 fns可省略

改变state中的属性值导致刷新


组件建立-->过程
定义时：deF
抽象出由state确定的prop值（可行办法给state属性添加特殊属性，通过引用）
初步计算content 标签及普通字符内容（包含未标记的确定prop属性）
实例化底层组件
判断是否出现由之前标记过prop或者state属性值确定的东西 
  未标记过的prop直接复制值传递到下一层prop属性
  标记过的prop与state 也复制到下一层prop属性 这些prop带有标记
  建立初步层级结构组 create addattr 

抽象出可能会改变的值

render{{prop}}:
  实例化一个组件
  直接传递到顶层
  设置之前不确定的属性值
  设置下层不确定的prop值

  添加事件监听
  事件监听队列管理


事件监听函数 启动 
setState({键：值});
先行改变涉及到变化的属性值state
改变由state确定的prop
对当前层diff
当前prop传递到下层 再对该层diff

