class Animation{
	constructor(){
		this.animationLine=[];
	}
	rotate(deg){
		this.animationLine.push("rotate("+deg+"deg)");
		return this;
	}
}