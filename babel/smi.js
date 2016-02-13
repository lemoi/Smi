"use strict";

var Smi = function () {
	var Attr = {};
	Attr.__attr__ = ["class", "data", "style", "id"];
	Attr.each = function (callback) {
		this.__attr__.forEach(function (value) {
			callback(value);
		});
	};
	var fns = {};
	fns.deepCopy = function (copyTo, obj) {
		Object.keys(obj).forEach(function (i) {
			if (Object.getPrototypeOf(obj[i]) === Object.prototype) {
				if (copyTo[i] && Object.getPrototypeOf(copyTo[i]) === Object.prototype) {} else {
					copyTo[i] = {};
				}
				this.deepCopy(copyTo[i], obj[i]);
			} else {
				try {
					copyTo[i] = obj[i];
				} catch (e) {
					copyTo = {};
					copyTo[i] = obj[i];
					console.warn("the object copyTo may not be a object");
				}
			}
		}.bind(this));
		return copyTo;
	};
	fns.Content = function (val, initInfo) {
		this.value = val;
		this.initInfo = initInfo || "computed";
	};
	fns.diff = function (obj1, obj2) {
		//以obj1为参考
		var plus, minus;
		if (obj1 === undefined) {
			if (obj2 instanceof Array) {
				obj1 = [];
			} else if (Object.getPrototypeOf(obj2) === Object.prototype) {
				obj1 = {};
			} else {
				obj1 = " ";
			}
		}
		if (obj1 instanceof Array && obj2 instanceof Array) {
			plus = [];
			minus = [];
			obj1.forEach(function (value) {
				if (!obj2.some(function (val) {
					return value == val;
				})) {
					minus.push(value);
				}
			});
			obj2.forEach(function (value) {
				if (!obj1.some(function (val) {
					return value == val;
				})) {
					plus.push(value);
				}
			});
			if (plus.length === 0 && minus.length === 0) {
				return true;
			} else {
				return {
					"+": plus,
					"-": minus
				};
			}
		} else if (Object.getPrototypeOf(obj1) === Object.prototype && Object.getPrototypeOf(obj2) === Object.prototype) {
			plus = {};
			minus = [];
			Object.keys(obj1).forEach(function (i) {
				if (obj2[i] === undefined) {
					minus.push(i);
				} else if (obj2[i] === obj1[i]) {
					return;
				} else {
					plus[i] = obj2[i];
				}
			});
			Object.keys(obj2).forEach(function (i) {
				if (obj1[i] === undefined) {
					plus[i] = obj2[i];
				} else if (obj2[i] === obj1[i]) {
					return;
				}
			});
			if (Object.keys(plus).length === 0 && minus.length === 0) {
				return true;
			} else {
				return {
					"+": plus,
					"-": minus
				};
			}
		} else if (typeof obj1 === "string" && typeof obj2 === "string") {
			if (obj1 === obj2) {
				return true;
			} else {
				return {
					"+": obj2
				};
			}
		} else {
			return false;
		}
	};
	fns.update = function (instance) {
		(function A() {
			Attr.each(function (value) {
				var _this = this;

				var i, diffs;
				if ((i = this.prop["_" + value + "_"]) !== undefined) {
					diffs = fns.diff(this.__currentState__[value], i);
					if (diffs !== true) {
						var a = {};
						a[value] = diffs;
						this.__opNum__.push(a);
						if (diffs["+"] instanceof Array) {
							this.__currentState__[value] = i.slice();
						} else if (typeof diffs["+"] === "string") {
							this.__currentState__[value] = i;
						} else {
							var plus = Object.keys(diffs["+"]);
							var minus = diffs["-"];
							plus.forEach(function (p) {
								_this.__currentState__[value][p] = i[p];
							});
							minus.forEach(function (m) {
								delete _this.__currentState__[value][m];
							});
						}
					}
				}
			}.bind(this));
			if (this.__opNum__.length !== 0) {
				this.__opNum__.forEach(function (value) {
					var i = Object.keys(value)[0];
					this.__op__(i, "+")(value[i]["+"]);
					this.__op__(i, "-")(value[i]["-"]);
				}.bind(this));
				this.__opNum__ = [];
			}
			var _arr1 = this.content();
			var _arr2 = this.__currentState__.content;
			if (_arr1 instanceof Array) {
				_arr1.forEach(function (c, i) {
					if (c instanceof Initinfo && c.__compT == _arr2[i].initInfo.__compT) {
						if (c.__dataAdd !== undefined) {
							_arr2[i].value.setPropData(c.__dataAdd);
						}
						A.call(_arr2[i].value);
					} else {
						_arr2[i].value.nodeValue = c;
					}
				});
			} else {
				if (_arr1 instanceof Initinfo) {
					if (_arr1.__dataAdd !== undefined) {
						_arr2[0].value.setPropData(_arr1.__dataAdd);
					}
					A.call(_arr2[0].value);
				} else {
					_arr2[0].value.nodeValue = _arr1;
				}
			}
		}).call(instance);
	};
	var Component = function Component(compT, dataObj, eveLisObj) {
		compT.prop = compT.prop || {};
		this.__prop__ = compT.prop;
		this.fns = compT.fns || {};
		this.content = compT.content || function () {
			return undefined;
		};
		this.setPropData(dataObj);
		this.prop._raw_ = this.prop._raw_ || "div";
		this.__raw__ = document.createElement(this.prop._raw_);
		this.__eventHandle__ = eveLisObj;
		this.__currentState__ = {};
		this.__opNum__ = []; //冻结对象
		this.__eventListeners__ = {}; //{"click":function(){},
	};
	Component.prototype.__op__ = function (attr, which) {
		var instance = this;
		function opDef(a, d) {
			switch (which) {
				case "+":
					return function (para) {
						if (para !== undefined) a.call(instance, para);
					};
				case "-":
					return function (para) {
						if (para !== undefined) d.call(instance, para);
					};
			}
		}
		switch (attr) {
			case "class":
				return opDef(function (para) {
					if (para instanceof Array) {
						para.forEach(function (item) {
							this.__raw__.classList.add(item);
						}.bind(this));
					} else {
						this.__raw__.classList.add(para);
					}
				}, function (para) {
					if (para instanceof Array) {
						para.forEach(function (item) {
							this.__raw__.classList.remove(item);
						}.bind(this));
					} else {
						this.__raw__.classList.remove(para);
					}
				});
			case "data":
				return opDef(function (para) {
					Object.keys(para).forEach(function (item) {
						this.__raw__.dataset[item] = para[item];
					}.bind(this));
				}, function (para) {
					if (para instanceof Array) {
						para.forEach(function (item) {
							this.__raw__.dataset[item] = "";
							delete this.__raw__.dataset[item];
						}.bind(this));
					} else {
						this.__raw__.dataset[item] = "";
						delete this.__raw__.dataset[para];
					}
				});
			case "style":
				return opDef(function (para) {
					Object.keys(para).forEach(function (item) {
						this.__raw__.style[item] = para[item];
					}.bind(this));
				}, function (para) {
					if (para instanceof Array) {
						para.forEach(function (item) {
							this.__raw__.style[item] = "";
						}.bind(this));
					} else {
						this.__raw__.style[para] = "";
					}
				});
			default:
				return opDef(function (para) {
					this.__raw__[attr] = para;
				}, function (para) {
					this.__raw__[attr] = "";
				});
		}
	};
	Component.prototype.update = function () {
		fns.update(this);
	};
	Component.prototype.setPropData = function (dataObj) {
		this.prop = fns.deepCopy(fns.deepCopy({}, this.__prop__), dataObj);
	};
	var Initinfo = function Initinfo(obj, dataObj, eveLisObj) {
		this.__compT = obj;
		this.__dataAdd = dataObj;
		this.__eventHandle = eveLisObj;
	};
	var deF = function deF(obj) {
		return function () {
			var dataObj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
			var eveLisObj = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			return new Initinfo(obj, dataObj, eveLisObj);
		};
	};
	var render = function render(topCompInfo, ele) {
		var build = function build(init) {
			var instance = new Component(init.__compT, init.__dataAdd, init.__eventHandle);
			Attr.each(function (value) {
				var i;
				if ((i = instance.prop["_" + value + "_"]) !== undefined) {
					switch (value) {
						case "style":
						case "data":
							instance.__currentState__[value] = {};
							fns.deepCopy(instance.__currentState__[value], i);
							break;
						case "class":
							instance.__currentState__[value] = i.slice();
							break;
						default:
							instance.__currentState__[value] = i;

					}
					instance.__op__(value, "+")(i);
				}
			});
			var _arr = instance.content();
			instance.__currentState__.content = [];
			if (_arr === undefined) {
				console.warn("lack of any required parameter");
				_arr = "undefined";
			}
			if (_arr instanceof Array) {
				_arr.forEach(function (c) {
					if (c === undefined) {
						console.warn("lack of any required parameter");
						c = "undefined";
					}
					if (c instanceof Initinfo) {
						var rc = build(c);
						instance.__currentState__.content.push(new fns.Content(rc, c));
						/*初步实现待整改，消息代理等等*/

						for (var i in rc.__eventHandle__) {
							rc.__raw__.addEventListener(i, rc.__eventHandle__[i].bind(instance));
						}
						instance.__raw__.appendChild(rc.__raw__);
					} else {
						try {
							var textNode = document.createTextNode(c);
							instance.__currentState__.content.push(new fns.Content(textNode));
							instance.__raw__.appendChild(textNode);
						} catch (err) {
							console.warn(err);
						}
					}
				});
			} else {
				try {
					var textNode = document.createTextNode(_arr);
					instance.__currentState__.content.push(new fns.Content(textNode));
					instance.__raw__.appendChild(document.createTextNode(_arr));
				} catch (err) {
					console.warn(err);
				}
			}
			return instance;
		};
		var rt = build(topCompInfo);
		for (var i in rt.__eventHandle__) {
			rt.__raw__.addEventListener(i, rt.__eventHandle__[i]);
		}
		ele.appendChild(rt.__raw__);
	};
	return {
		deF: deF,
		render: render
	};
}();