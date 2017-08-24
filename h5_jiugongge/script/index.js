/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://www1.pclady.com.cn/zt/20160303/yqh/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nonzar on 16/3/16.
	 */
	window.__a__ = {
	    getAccount: function () {
	        return "18666524732";
	    },
	    getUserKey: function () {
	        return "9HgaVn2ZKi8ay2Egne31NwgLjFeHYRg8";
	    }
	}
	__webpack_require__(1);
	__webpack_require__(5);
	__webpack_require__(7);
	__webpack_require__(21);
	__webpack_require__(28);
	var $ = __webpack_require__(29),
	    Nzdelay = __webpack_require__(31),
	    Nzmask = __webpack_require__(32),
	    Nzgame = __webpack_require__(33),
	    Api = __webpack_require__(34),
	    BaseDataConvert = __webpack_require__(36),
	    Interface = __webpack_require__(37);
	/*
	 * 加载提示
	 * @param {object} [options] 参数
	 * @param {string} [options.txt] 显示的信息
	 * @param {int} [options.fs] 字体大小
	 */
	$.fn.loading = function (options) {
	    var $ms = this.find(">.ui-smask");
	    if (!options) {
	        $ms.remove();
	        return;
	    }
	    options = options || {};
	    if ($ms.length == 0) {
	        $ms = document.createElement("div");
	        $ms.classList.add("ui-smask");
	        $ms = $($ms);
	    }
	    $ms.text(options.txt || "处理中,请稍后...").css("font-size", options.fs || "initial");
	    this.append($ms[0]);
	}
	/* ----------------------------------------业务代码---------------------------------------- */
	//禁止操作
	$(".panel-game").loading({txt: "资源加载中,请稍后...", fs: "0.5rem"});
	$(".panel-winners .bd").loading({txt: "获取中,请稍后...", fs: "0.3rem"});
	//数据定义
	var User = {
	        account: Interface.accout = window.__a__ && window.__a__.getAccount(),
	        key: Interface.key = window.__a__ && window.__a__.getUserKey(),
	        postcode: null,
	        name: null,
	        phone: null,
	        addr: null,
	        lastPrz: null,
	        integral: -1,
	        canPlay: false
	    },
	    PrzConfigs = [],
	    Res = {
	        userInfo: false,
	        przConfigs: false
	    },
	    Mask = new Nzmask(),
	    Game = new Nzgame();
	window.alert = (function () {
	    var otit = document.querySelector("#msAlert .imp"),
	        otxt = document.querySelector("#msAlert .ui-alert2-bd :last-child"),
	        obtit = document.querySelector("#msAlert .ui-alert2-ft"),
	        ob_cb = null;
	    obtit.onclick = function () {
	        if (typeof(ob_cb) == "function") {
	            ob_cb();
	        }
	        Mask.hide();
	    }
	    return function (tit, txt, btit, cb) {
	        otit.innerHTML = tit;
	        otxt.innerHTML = txt;
	        obtit.innerHTML = btit;
	        ob_cb = cb;
	        Mask.show("msAlert");
	    }
	})();
	//数据读取:用户信息&积分&奖品配置&获奖用户
	Interface.getUserInfo(function (data) {
	    switch (data.code) {
	        case "1":
	            Res.userInfo = BaseDataConvert.toUserInfo.call(User, data);
	            $("#msReg input[name='name']").val(User.name);
	            $("#msReg input[name='tel']").val(User.phone);
	            $("#msReg input[name='postCode']").val(User.postcode);
	            $("#msReg input[name='addr']").val(User.addr.split("-")[3]);
	            break;
	        default:
	            window.alert("注意", data.msg, "跳转任务页", function () {
	                if (window.__a__ && window.__a__.test) {
	                    window.__a__.toTSKA();
	                }
	            });
	    }
	}, function () {
	    //faild
	    window.alert("注意", "网络不稳定", "刷新", function () {
	        window.location.reload(true);
	    });
	});
	Interface.getAwardConfig(function (data) {
	    switch (data.code) {
	        case "1":
	            Res.przConfigs = BaseDataConvert.toAwardConfig.call(PrzConfigs, data.configs);
	            var o = $(".panel-game .ui-prize > div");
	            for (var i = 0; i < PrzConfigs.length; i++) {
	                Api.getPrz(i).querySelector("div").appendChild(Api.createPrz(PrzConfigs[i]));
	            }
	            break;
	        default:
	            window.alert("注意", data.msg, "跳转任务页", function () {
	                if (window.__a__ && window.__a__.test) {
	                    window.__a__.toTSKA();
	                }
	            });
	    }
	}, function () {
	    //faild
	    window.alert("注意", "网络不稳定", "刷新", function () {
	        window.location.reload(true);
	    });
	});
	Interface.getWinner(function (data) {
	    Api.setWinners(data.lotterys);
	    $(".panel-winners .bd").loading();
	    var timer = setInterval(function () {
	        Interface.getWinner(function (data) {
	            Api.setWinners(data.lotterys);
	        }, function () {
	            //faild
	            clearInterval(timer);
	        });
	    }, 15000);
	}, function () {
	    //faild
	});
	//事件绑定
	$(".nzmask .btnClose,#msText .ui-btn-sty1,#msRegSucc .ui-btn-sty1").click(function () {
	    Mask.hide();
	});
	$("#msUnintg .ui-alert2-ft").click(function () {
	    if (window.__a__ && window.__a__.test) {
	        window.__a__.toTSKA();
	    }
	});
	$(".banner :nth-child(1)").click(function () {
	    Mask.show("msText");
	});
	$("#msPrize .ui-btn-sty1").click(function () {
	    switch (User.lastPrz.type) {
	        case 1:
	            Mask.hide();
	            break;
	        case 2:
	            document.querySelector("#msReg select[name='pr']").value = User.addr.split("-")[0];
	            $("#msReg select[name='pr']").change();
	            document.querySelector("#msReg select[name='city']").value = User.addr.split("-")[1];
	            $("#msReg select[name='city']").change();
	            document.querySelector("#msReg select[name='dist']").value = User.addr.split("-")[2];
	            Mask.show("msReg");
	            break;
	        default:
	            Mask.hide();
	    }
	});
	$("#msReg .ui-btn-sty1").click((function () {
	    var $bd = $("#msReg .ui-alert2"),
	        $name = $("#msReg input[name='name']"),
	        $tel = $("#msReg input[name='tel']"),
	        $postCode = $("#msReg input[name='postCode']"),
	        $addr_pr = $("#msReg select[name='pr']"),
	        $addr_city = $("#msReg select[name='city']"),
	        $addr_dist = $("#msReg select[name='dist']"),
	        $addr_more = $("#msReg input[name='addr']");
	    return function () {
	        $("#msReg .ui-alert2").loading({txt: "信息提交中,请稍等.", fs: "0.5rem"});
	        Interface.submitInfo({
	            name: $name.val(),
	            tel: $tel.val(),
	            postCode: $postCode.val(),
	            addr: (($addr_pr.val() == null || $addr_pr.val() == "请选择") ? "" : $addr_pr.val()) + "-" +
	            (($addr_city.val() == null || $addr_city.val() == "请选择") ? "" : $addr_city.val()) + "-" +
	            (($addr_dist.val() == null || $addr_dist.val() == "请选择") ? "" : $addr_dist.val()) + "-" +
	            $addr_more.val()
	        }, function (data) {
	            switch (data.code) {
	                case "1":
	                    Mask.show("msRegSucc");
	                    $("#msReg .ui-alert2").loading();
	                    break;
	                default:
	                    window.alert("注意", data.msg, "跳转任务页", function () {
	                        if (window.__a__ && window.__a__.test) {
	                            window.__a__.toTSKA();
	                        }
	                    });
	                    $("#msReg .ui-alert2").loading();
	            }
	        }, function () {
	            //faild
	            window.alert("注意", "网络不稳定", "刷新", function () {
	                window.location.reload(true);
	            });
	        });
	    }
	})());
	$("#msReg select[name='pr']").append(Api.getPr()).change(function (e) {
	    $("#msReg select[name='city']").hide().children().remove();
	    $("#msReg select[name='dist']").hide().children().remove();
	    if (this.selectedIndex == 0) {
	        return;
	    }
	    var df = Api.getCity(this.value);
	    if (df.childNodes.length > 1) {
	        $("#msReg select[name='city']").append(df).show();
	    } else {
	        $("#msReg select[name='city']").hide();
	    }
	});
	$("#msReg select[name='city']").change(function () {
	    $("#msReg select[name='dist']").children().remove();
	    if (this.selectedIndex == 0) {
	        return;
	    }
	    var df = Api.getDist(this.value);
	    if (df.childNodes.length > 1) {
	        $("#msReg select[name='dist']").append(df).show();
	    } else {
	        $("#msReg select[name='dist']").hide();
	    }
	});

	$(".panel-game .ui-lottery").click(function () {
	    if (!User.canPlay) {
	        return;
	    }
	    User.canPlay = false;
	    Game.pause = true;
	    Game.play((function () {
	        var t = 0, mins = 2;
	        return function () {
	            Api.selPrz(Api.selPrz() >= Api.getPrz().length - 1 ? 0 : (Api.selPrz() + 1));
	            this.speed = this.speed <= mins ? mins : (this.speed - 0.1 * t++);
	        }
	    })(), 10);
	    Interface.lottery(function (data) {
	        switch (data.code) {
	            case "1":
	                User.lastPrz = null;
	                for (var i = 0; i < PrzConfigs.length; i++) {
	                    if (PrzConfigs[i].id == data.configId) {
	                        User.lastPrz = PrzConfigs[i];
	                        break;
	                    }
	                }
	                if (User.lastPrz || i >= Api.getPrz().length) {
	                    Nzdelay.w(2000).r(function () {
	                        Game.pause = true;
	                        Game.play((function () {
	                            var t = 0, maxs = 25;
	                            return function () {
	                                this.speed = this.speed >= maxs ? maxs : (this.speed + 0.1 * t++);
	                                if (i == Api.selPrz(Api.selPrz() >= Api.getPrz().length - 1 ? 0 : (Api.selPrz() + 1)) && this.speed >= maxs) {
	                                    Game.over();
	                                    Nzdelay.w(500).r(function () {
	                                        Api.setMsPrz(User.lastPrz);
	                                        Mask.show("msPrize");
	                                    }).w(500).r(function () {
	                                        User.canPlay = true;
	                                    });
	                                }
	                            }
	                        })(), Game.speed);
	                    });
	                } else {
	                    Game.over();
	                    User.canPlay = true;
	                    alert("不存在此奖品");
	                }
	                break;
	            case "-2":
	                Mask.show("msUnintg");
	                Game.over();
	                User.canPlay = true;
	                break;
	            default:
	                Game.over();
	                User.canPlay = true;
	                window.alert("注意", data.msg, "跳转任务页", function () {
	                    if (window.__a__ && window.__a__.test) {
	                        window.__a__.toTSKA();
	                    }
	                });
	        }
	    }, function () {
	        window.alert("注意", "网络不稳定", "刷新", function () {
	            window.location.reload(true);
	        });
	    });
	});
	//数据载入检查
	window.requestAnimationFrame((function () {
	    var fn = function () {
	        if (Res.userInfo && Res.przConfigs) {
	            $(".panel-game").loading();
	            User.canPlay = true;
	        } else {
	            window.requestAnimationFrame(fn);
	        }
	    }
	    return function () {
	        fn.call(fn);
	    }
	})());

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ function(module, exports) {

	/**
	 * Created by nonzar on 16/3/18.
	 */
	/*
	 * 兼容处理raf
	 */
	window.requestAnimationFrame = window.requestAnimationFrame
	    || window.webkitRequestAnimationFrame
	    || window.mozRequestAnimationFrame
	    || window.oRequestAnimationFrame
	    || window.msRequestAnimationFrame
	    || function (callback) {
	        return setTimeout(callback, 1);
	    };

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! jQuery v2.2.1 | (c) jQuery Foundation | jquery.org/license */
	!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=a.document,e=c.slice,f=c.concat,g=c.push,h=c.indexOf,i={},j=i.toString,k=i.hasOwnProperty,l={},m="2.2.1",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return e.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:e.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a){return n.each(this,a)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(e.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:g,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=a&&a.toString();return!n.isArray(a)&&b-parseFloat(b)+1>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!k.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?i[j.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=d.createElement("script"),b.text=a,d.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(s(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):g.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:h.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,g=0,h=[];if(s(a))for(d=a.length;d>g;g++)e=b(a[g],g,c),null!=e&&h.push(e);else for(g in a)e=b(a[g],g,c),null!=e&&h.push(e);return f.apply([],h)},guid:1,proxy:function(a,b){var c,d,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(d=e.call(arguments,2),f=function(){return a.apply(b||this,d.concat(e.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:l}),"function"==typeof Symbol&&(n.fn[Symbol.iterator]=c[Symbol.iterator]),n.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){i["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=!!a&&"length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ga(),z=ga(),A=ga(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+M+"))|)"+L+"*\\]",O=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+N+")*)|.*)\\)|)",P=new RegExp(L+"+","g"),Q=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),R=new RegExp("^"+L+"*,"+L+"*"),S=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),T=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),U=new RegExp(O),V=new RegExp("^"+M+"$"),W={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M+"|[*])"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},X=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,$=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_=/[+~]/,aa=/'|\\/g,ba=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),ca=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},da=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(ea){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fa(a,b,d,e){var f,h,j,k,l,o,r,s,w=b&&b.ownerDocument,x=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==x&&9!==x&&11!==x)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==x&&(o=$.exec(a)))if(f=o[1]){if(9===x){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(w&&(j=w.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(o[2])return H.apply(d,b.getElementsByTagName(a)),d;if((f=o[3])&&c.getElementsByClassName&&b.getElementsByClassName)return H.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==x)w=b,s=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(aa,"\\$&"):b.setAttribute("id",k=u),r=g(a),h=r.length,l=V.test(k)?"#"+k:"[id='"+k+"']";while(h--)r[h]=l+" "+qa(r[h]);s=r.join(","),w=_.test(a)&&oa(b.parentNode)||b}if(s)try{return H.apply(d,w.querySelectorAll(s)),d}catch(y){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(Q,"$1"),b,d,e)}function ga(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ha(a){return a[u]=!0,a}function ia(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ja(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function ka(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function la(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function na(a){return ha(function(b){return b=+b,ha(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function oa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=fa.support={},f=fa.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fa.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ia(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ia(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Z.test(n.getElementsByClassName),c.getById=ia(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Z.test(n.querySelectorAll))&&(ia(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ia(function(a){var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Z.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ia(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",O)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Z.test(o.compareDocumentPosition),t=b||Z.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return ka(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?ka(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},fa.matches=function(a,b){return fa(a,null,null,b)},fa.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(T,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fa(b,n,null,[a]).length>0},fa.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fa.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fa.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fa.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fa.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fa.selectors={cacheLength:50,createPseudo:ha,match:W,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ba,ca),a[3]=(a[3]||a[4]||a[5]||"").replace(ba,ca),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fa.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fa.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return W.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&U.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ba,ca).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fa.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(P," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fa.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ha(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ha(function(a){var b=[],c=[],d=h(a.replace(Q,"$1"));return d[u]?ha(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ha(function(a){return function(b){return fa(a,b).length>0}}),contains:ha(function(a){return a=a.replace(ba,ca),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ha(function(a){return V.test(a||"")||fa.error("unsupported lang: "+a),a=a.replace(ba,ca).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Y.test(a.nodeName)},input:function(a){return X.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:na(function(){return[0]}),last:na(function(a,b){return[b-1]}),eq:na(function(a,b,c){return[0>c?c+b:c]}),even:na(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:na(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:na(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:na(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=la(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=ma(b);function pa(){}pa.prototype=d.filters=d.pseudos,d.setFilters=new pa,g=fa.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=R.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=S.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(Q," ")}),h=h.slice(c.length));for(g in d.filter)!(e=W[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fa.error(a):z(a,i).slice(0)};function qa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ra(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j,k=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(j=b[u]||(b[u]={}),i=j[b.uniqueID]||(j[b.uniqueID]={}),(h=i[d])&&h[0]===w&&h[1]===f)return k[2]=h[2];if(i[d]=k,k[2]=a(b,c,g))return!0}}}function sa(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ta(a,b,c){for(var d=0,e=b.length;e>d;d++)fa(a,b[d],c);return c}function ua(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function va(a,b,c,d,e,f){return d&&!d[u]&&(d=va(d)),e&&!e[u]&&(e=va(e,f)),ha(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ta(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ua(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ua(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ua(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function wa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ra(function(a){return a===b},h,!0),l=ra(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ra(sa(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return va(i>1&&sa(m),i>1&&qa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(Q,"$1"),c,e>i&&wa(a.slice(i,e)),f>e&&wa(a=a.slice(e)),f>e&&qa(a))}m.push(c)}return sa(m)}function xa(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=F.call(i));u=ua(u)}H.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&fa.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ha(f):f}return h=fa.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xa(e,d)),f.selector=a}return f},i=fa.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ba,ca),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=W.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ba,ca),_.test(j[0].type)&&oa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qa(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||_.test(a)&&oa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ia(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ia(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ja("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ia(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ja("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ia(function(a){return null==a.getAttribute("disabled")})||ja(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fa}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.uniqueSort=n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},v=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},w=n.expr.match.needsContext,x=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,y=/^.[^:#\[\.,]*$/;function z(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(y.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return h.call(b,a)>-1!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(z(this,a||[],!1))},not:function(a){return this.pushStack(z(this,a||[],!0))},is:function(a){return!!z(this,"string"==typeof a&&w.test(a)?n(a):a||[],!1).length}});var A,B=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=n.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||A,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:B.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),x.test(e[1])&&n.isPlainObject(b))for(e in b)n.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&f.parentNode&&(this.length=1,this[0]=f),this.context=d,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?void 0!==c.ready?c.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};C.prototype=n.fn,A=n(d);var D=/^(?:parents|prev(?:Until|All))/,E={children:!0,contents:!0,next:!0,prev:!0};n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=w.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?h.call(n(a),this[0]):h.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.uniqueSort(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function F(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return u(a,"parentNode")},parentsUntil:function(a,b,c){return u(a,"parentNode",c)},next:function(a){return F(a,"nextSibling")},prev:function(a){return F(a,"previousSibling")},nextAll:function(a){return u(a,"nextSibling")},prevAll:function(a){return u(a,"previousSibling")},nextUntil:function(a,b,c){return u(a,"nextSibling",c)},prevUntil:function(a,b,c){return u(a,"previousSibling",c)},siblings:function(a){return v((a.parentNode||{}).firstChild,a)},children:function(a){return v(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(E[a]||n.uniqueSort(e),D.test(a)&&e.reverse()),this.pushStack(e)}});var G=/\S+/g;function H(a){var b={};return n.each(a.match(G)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?H(a):n.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){n.each(b,function(b,c){n.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==n.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return n.each(arguments,function(a,b){var c;while((c=n.inArray(b,f,c))>-1)f.splice(c,1),h>=c&&h--}),this},has:function(a){return a?n.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().progress(c.notify).done(c.resolve).fail(c.reject):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=e.call(arguments),d=c.length,f=1!==d||a&&n.isFunction(a.promise)?d:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?e.call(arguments):d,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(d>1)for(i=new Array(d),j=new Array(d),k=new Array(d);d>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().progress(h(b,j,i)).done(h(b,k,c)).fail(g.reject):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(d,[n]),n.fn.triggerHandler&&(n(d).triggerHandler("ready"),n(d).off("ready"))))}});function J(){d.removeEventListener("DOMContentLoaded",J),a.removeEventListener("load",J),n.ready()}n.ready.promise=function(b){return I||(I=n.Deferred(),"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(n.ready):(d.addEventListener("DOMContentLoaded",J),a.addEventListener("load",J))),I.promise(b)},n.ready.promise();var K=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)K(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},L=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function M(){this.expando=n.expando+M.uid++}M.uid=1,M.prototype={register:function(a,b){var c=b||{};return a.nodeType?a[this.expando]=c:Object.defineProperty(a,this.expando,{value:c,writable:!0,configurable:!0}),a[this.expando]},cache:function(a){if(!L(a))return{};var b=a[this.expando];return b||(b={},L(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[b]=c;else for(d in b)e[d]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=a[this.expando];if(void 0!==f){if(void 0===b)this.register(a);else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in f?d=[b,e]:(d=e,d=d in f?[d]:d.match(G)||[])),c=d.length;while(c--)delete f[d[c]]}(void 0===b||n.isEmptyObject(f))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!n.isEmptyObject(b)}};var N=new M,O=new M,P=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Q=/[A-Z]/g;function R(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Q,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:P.test(c)?n.parseJSON(c):c}catch(e){}O.set(a,b,c);
	}else c=void 0;return c}n.extend({hasData:function(a){return O.hasData(a)||N.hasData(a)},data:function(a,b,c){return O.access(a,b,c)},removeData:function(a,b){O.remove(a,b)},_data:function(a,b,c){return N.access(a,b,c)},_removeData:function(a,b){N.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=O.get(f),1===f.nodeType&&!N.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),R(f,d,e[d])));N.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){O.set(this,a)}):K(this,function(b){var c,d;if(f&&void 0===b){if(c=O.get(f,a)||O.get(f,a.replace(Q,"-$&").toLowerCase()),void 0!==c)return c;if(d=n.camelCase(a),c=O.get(f,d),void 0!==c)return c;if(c=R(f,d,void 0),void 0!==c)return c}else d=n.camelCase(a),this.each(function(){var c=O.get(this,d);O.set(this,d,b),a.indexOf("-")>-1&&void 0!==c&&O.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){O.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=N.get(a,b),c&&(!d||n.isArray(c)?d=N.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return N.get(a,c)||N.access(a,c,{empty:n.Callbacks("once memory").add(function(){N.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=N.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var S=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=new RegExp("^(?:([+-])=|)("+S+")([a-z%]*)$","i"),U=["Top","Right","Bottom","Left"],V=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)};function W(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return n.css(a,b,"")},i=h(),j=c&&c[3]||(n.cssNumber[b]?"":"px"),k=(n.cssNumber[b]||"px"!==j&&+i)&&T.exec(n.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,n.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var X=/^(?:checkbox|radio)$/i,Y=/<([\w:-]+)/,Z=/^$|\/(?:java|ecma)script/i,$={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};$.optgroup=$.option,$.tbody=$.tfoot=$.colgroup=$.caption=$.thead,$.th=$.td;function _(a,b){var c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function aa(a,b){for(var c=0,d=a.length;d>c;c++)N.set(a[c],"globalEval",!b||N.get(b[c],"globalEval"))}var ba=/<|&#?\w+;/;function ca(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],o=0,p=a.length;p>o;o++)if(f=a[o],f||0===f)if("object"===n.type(f))n.merge(m,f.nodeType?[f]:f);else if(ba.test(f)){g=g||l.appendChild(b.createElement("div")),h=(Y.exec(f)||["",""])[1].toLowerCase(),i=$[h]||$._default,g.innerHTML=i[1]+n.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;n.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",o=0;while(f=m[o++])if(d&&n.inArray(f,d)>-1)e&&e.push(f);else if(j=n.contains(f.ownerDocument,f),g=_(l.appendChild(f),"script"),j&&aa(g),c){k=0;while(f=g[k++])Z.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var da=/^key/,ea=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,fa=/^([^.]*)(?:\.(.+)|)/;function ga(){return!0}function ha(){return!1}function ia(){try{return d.activeElement}catch(a){}}function ja(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ja(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=ha;else if(!e)return a;return 1===f&&(g=e,e=function(a){return n().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=n.guid++)),a.each(function(){n.event.add(this,b,e,d,c)})}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=N.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return"undefined"!=typeof n&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(G)||[""],j=b.length;while(j--)h=fa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=N.hasData(a)&&N.get(a);if(r&&(i=r.events)){b=(b||"").match(G)||[""],j=b.length;while(j--)if(h=fa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&N.remove(a,"handle events")}},dispatch:function(a){a=n.event.fix(a);var b,c,d,f,g,h=[],i=e.call(arguments),j=(N.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.rnamespace||a.rnamespace.test(g.namespace))&&(a.handleObj=g,a.data=g.data,d=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&("click"!==a.type||isNaN(a.button)||a.button<1))for(;i!==this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>-1:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,e,f,g=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||d,e=c.documentElement,f=c.body,a.pageX=b.clientX+(e&&e.scrollLeft||f&&f.scrollLeft||0)-(e&&e.clientLeft||f&&f.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||f&&f.scrollTop||0)-(e&&e.clientTop||f&&f.clientTop||0)),a.which||void 0===g||(a.which=1&g?1:2&g?3:4&g?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,e,f=a.type,g=a,h=this.fixHooks[f];h||(this.fixHooks[f]=h=ea.test(f)?this.mouseHooks:da.test(f)?this.keyHooks:{}),e=h.props?this.props.concat(h.props):this.props,a=new n.Event(g),b=e.length;while(b--)c=e[b],a[c]=g[c];return a.target||(a.target=d),3===a.target.nodeType&&(a.target=a.target.parentNode),h.filter?h.filter(a,g):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==ia()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===ia()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ga:ha):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={constructor:n.Event,isDefaultPrevented:ha,isPropagationStopped:ha,isImmediatePropagationStopped:ha,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ga,a&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ga,a&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ga,a&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),n.fn.extend({on:function(a,b,c,d){return ja(this,a,b,c,d)},one:function(a,b,c,d){return ja(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=ha),this.each(function(){n.event.remove(this,a,c,b)})}});var ka=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,la=/<script|<style|<link/i,ma=/checked\s*(?:[^=]|=\s*.checked.)/i,na=/^true\/(.*)/,oa=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function pa(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function qa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function ra(a){var b=na.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function sa(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(N.hasData(a)&&(f=N.access(a),g=N.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}O.hasData(a)&&(h=O.access(a),i=n.extend({},h),O.set(b,i))}}function ta(a,b){var c=b.nodeName.toLowerCase();"input"===c&&X.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}function ua(a,b,c,d){b=f.apply([],b);var e,g,h,i,j,k,m=0,o=a.length,p=o-1,q=b[0],r=n.isFunction(q);if(r||o>1&&"string"==typeof q&&!l.checkClone&&ma.test(q))return a.each(function(e){var f=a.eq(e);r&&(b[0]=q.call(this,e,f.html())),ua(f,b,c,d)});if(o&&(e=ca(b,a[0].ownerDocument,!1,a,d),g=e.firstChild,1===e.childNodes.length&&(e=g),g||d)){for(h=n.map(_(e,"script"),qa),i=h.length;o>m;m++)j=e,m!==p&&(j=n.clone(j,!0,!0),i&&n.merge(h,_(j,"script"))),c.call(a[m],j,m);if(i)for(k=h[h.length-1].ownerDocument,n.map(h,ra),m=0;i>m;m++)j=h[m],Z.test(j.type||"")&&!N.access(j,"globalEval")&&n.contains(k,j)&&(j.src?n._evalUrl&&n._evalUrl(j.src):n.globalEval(j.textContent.replace(oa,"")))}return a}function va(a,b,c){for(var d,e=b?n.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||n.cleanData(_(d)),d.parentNode&&(c&&n.contains(d.ownerDocument,d)&&aa(_(d,"script")),d.parentNode.removeChild(d));return a}n.extend({htmlPrefilter:function(a){return a.replace(ka,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=_(h),f=_(a),d=0,e=f.length;e>d;d++)ta(f[d],g[d]);if(b)if(c)for(f=f||_(a),g=g||_(h),d=0,e=f.length;e>d;d++)sa(f[d],g[d]);else sa(a,h);return g=_(h,"script"),g.length>0&&aa(g,!i&&_(a,"script")),h},cleanData:function(a){for(var b,c,d,e=n.event.special,f=0;void 0!==(c=a[f]);f++)if(L(c)){if(b=c[N.expando]){if(b.events)for(d in b.events)e[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);c[N.expando]=void 0}c[O.expando]&&(c[O.expando]=void 0)}}}),n.fn.extend({domManip:ua,detach:function(a){return va(this,a,!0)},remove:function(a){return va(this,a)},text:function(a){return K(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return ua(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=pa(this,a);b.appendChild(a)}})},prepend:function(){return ua(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=pa(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return ua(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return ua(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(_(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return K(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!la.test(a)&&!$[(Y.exec(a)||["",""])[1].toLowerCase()]){a=n.htmlPrefilter(a);try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(_(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return ua(this,arguments,function(b){var c=this.parentNode;n.inArray(this,a)<0&&(n.cleanData(_(this)),c&&c.replaceChild(b,this))},a)}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),f=e.length-1,h=0;f>=h;h++)c=h===f?this:this.clone(!0),n(e[h])[b](c),g.apply(d,c.get());return this.pushStack(d)}});var wa,xa={HTML:"block",BODY:"block"};function ya(a,b){var c=n(b.createElement(a)).appendTo(b.body),d=n.css(c[0],"display");return c.detach(),d}function za(a){var b=d,c=xa[a];return c||(c=ya(a,b),"none"!==c&&c||(wa=(wa||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=wa[0].contentDocument,b.write(),b.close(),c=ya(a,b),wa.detach()),xa[a]=c),c}var Aa=/^margin/,Ba=new RegExp("^("+S+")(?!px)[a-z%]+$","i"),Ca=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)},Da=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e},Ea=d.documentElement;!function(){var b,c,e,f,g=d.createElement("div"),h=d.createElement("div");if(h.style){h.style.backgroundClip="content-box",h.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===h.style.backgroundClip,g.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",g.appendChild(h);function i(){h.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",h.innerHTML="",Ea.appendChild(g);var d=a.getComputedStyle(h);b="1%"!==d.top,f="2px"===d.marginLeft,c="4px"===d.width,h.style.marginRight="50%",e="4px"===d.marginRight,Ea.removeChild(g)}n.extend(l,{pixelPosition:function(){return i(),b},boxSizingReliable:function(){return null==c&&i(),c},pixelMarginRight:function(){return null==c&&i(),e},reliableMarginLeft:function(){return null==c&&i(),f},reliableMarginRight:function(){var b,c=h.appendChild(d.createElement("div"));return c.style.cssText=h.style.cssText="-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",h.style.width="1px",Ea.appendChild(g),b=!parseFloat(a.getComputedStyle(c).marginRight),Ea.removeChild(g),h.removeChild(c),b}})}}();function Fa(a,b,c){var d,e,f,g,h=a.style;return c=c||Ca(a),g=c?c.getPropertyValue(b)||c[b]:void 0,""!==g&&void 0!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),c&&!l.pixelMarginRight()&&Ba.test(g)&&Aa.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f),void 0!==g?g+"":g}function Ga(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Ha=/^(none|table(?!-c[ea]).+)/,Ia={position:"absolute",visibility:"hidden",display:"block"},Ja={letterSpacing:"0",fontWeight:"400"},Ka=["Webkit","O","Moz","ms"],La=d.createElement("div").style;function Ma(a){if(a in La)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ka.length;while(c--)if(a=Ka[c]+b,a in La)return a}function Na(a,b,c){var d=T.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Oa(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+U[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+U[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+U[f]+"Width",!0,e))):(g+=n.css(a,"padding"+U[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+U[f]+"Width",!0,e)));return g}function Pa(b,c,e){var f=!0,g="width"===c?b.offsetWidth:b.offsetHeight,h=Ca(b),i="border-box"===n.css(b,"boxSizing",!1,h);if(d.msFullscreenElement&&a.top!==a&&b.getClientRects().length&&(g=Math.round(100*b.getBoundingClientRect()[c])),0>=g||null==g){if(g=Fa(b,c,h),(0>g||null==g)&&(g=b.style[c]),Ba.test(g))return g;f=i&&(l.boxSizingReliable()||g===b.style[c]),g=parseFloat(g)||0}return g+Oa(b,c,e||(i?"border":"content"),f,h)+"px"}function Qa(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=N.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&V(d)&&(f[g]=N.access(d,"olddisplay",za(d.nodeName)))):(e=V(d),"none"===c&&e||N.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Fa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Ma(h)||h),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=T.exec(c))&&e[1]&&(c=W(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(n.cssNumber[h]?"":"px")),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Ma(h)||h),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Fa(a,b,d)),"normal"===e&&b in Ja&&(e=Ja[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?Ha.test(n.css(a,"display"))&&0===a.offsetWidth?Da(a,Ia,function(){return Pa(a,b,d)}):Pa(a,b,d):void 0},set:function(a,c,d){var e,f=d&&Ca(a),g=d&&Oa(a,b,d,"border-box"===n.css(a,"boxSizing",!1,f),f);return g&&(e=T.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=n.css(a,b)),Na(a,c,g)}}}),n.cssHooks.marginLeft=Ga(l.reliableMarginLeft,function(a,b){return b?(parseFloat(Fa(a,"marginLeft"))||a.getBoundingClientRect().left-Da(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px":void 0}),n.cssHooks.marginRight=Ga(l.reliableMarginRight,function(a,b){return b?Da(a,{display:"inline-block"},Fa,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+U[d]+b]=f[d]||f[d-2]||f[0];return e}},Aa.test(a)||(n.cssHooks[a+b].set=Na)}),n.fn.extend({css:function(a,b){return K(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Ca(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Qa(this,!0)},hide:function(){return Qa(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){V(this)?n(this).show():n(this).hide()})}});function Ra(a,b,c,d,e){return new Ra.prototype.init(a,b,c,d,e)}n.Tween=Ra,Ra.prototype={constructor:Ra,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||n.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Ra.propHooks[this.prop];return a&&a.get?a.get(this):Ra.propHooks._default.get(this)},run:function(a){var b,c=Ra.propHooks[this.prop];return this.options.duration?this.pos=b=n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ra.propHooks._default.set(this),this}},Ra.prototype.init.prototype=Ra.prototype,Ra.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[n.cssProps[a.prop]]&&!n.cssHooks[a.prop]?a.elem[a.prop]=a.now:n.style(a.elem,a.prop,a.now+a.unit)}}},Ra.propHooks.scrollTop=Ra.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},n.fx=Ra.prototype.init,n.fx.step={};var Sa,Ta,Ua=/^(?:toggle|show|hide)$/,Va=/queueHooks$/;function Wa(){return a.setTimeout(function(){Sa=void 0}),Sa=n.now()}function Xa(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=U[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ya(a,b,c){for(var d,e=(_a.tweeners[b]||[]).concat(_a.tweeners["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Za(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&V(a),q=N.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?N.get(a,"olddisplay")||za(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Ua.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?za(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=N.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;N.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ya(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function $a(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function _a(a,b,c){var d,e,f=0,g=_a.prefilters.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Sa||Wa(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{},easing:n.easing._default},c),originalProperties:b,originalOptions:c,startTime:Sa||Wa(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for($a(k,j.opts.specialEasing);g>f;f++)if(d=_a.prefilters[f].call(j,a,k,j.opts))return n.isFunction(d.stop)&&(n._queueHooks(j.elem,j.opts.queue).stop=n.proxy(d.stop,d)),d;return n.map(k,Ya,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(_a,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return W(c.elem,a,T.exec(b),c),c}]},tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.match(G);for(var c,d=0,e=a.length;e>d;d++)c=a[d],_a.tweeners[c]=_a.tweeners[c]||[],_a.tweeners[c].unshift(b)},prefilters:[Za],prefilter:function(a,b){b?_a.prefilters.unshift(a):_a.prefilters.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(V).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=_a(this,n.extend({},a),f);(e||N.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=N.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Va.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=N.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Xa(b,!0),a,d,e)}}),n.each({slideDown:Xa("show"),slideUp:Xa("hide"),slideToggle:Xa("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Sa=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Sa=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Ta||(Ta=a.setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){a.clearInterval(Ta),Ta=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(b,c){return b=n.fx?n.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",l.checkOn=""!==a.value,l.optSelected=c.selected,b.disabled=!0,l.optDisabled=!c.disabled,a=d.createElement("input"),a.value="t",a.type="radio",l.radioValue="t"===a.value}();var ab,bb=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return K(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),e=n.attrHooks[b]||(n.expr.match.bool.test(b)?ab:void 0)),void 0!==c?null===c?void n.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=n.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(G);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)}}),ab={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=bb[b]||n.find.attr;bb[b]=function(a,b,d){var e,f;return d||(f=bb[b],bb[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,bb[b]=f),e}});var cb=/^(?:input|select|textarea|button)$/i,db=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return K(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&n.isXMLDoc(a)||(b=n.propFix[b]||b,
	e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,"tabindex");return b?parseInt(b,10):cb.test(a.nodeName)||db.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var eb=/[\t\r\n\f]/g;function fb(a){return a.getAttribute&&a.getAttribute("class")||""}n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,fb(this)))});if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=fb(c),d=1===c.nodeType&&(" "+e+" ").replace(eb," ")){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,fb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=fb(c),d=1===c.nodeType&&(" "+e+" ").replace(eb," ")){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):n.isFunction(a)?this.each(function(c){n(this).toggleClass(a.call(this,c,fb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=n(this),f=a.match(G)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(void 0===a||"boolean"===c)&&(b=fb(this),b&&N.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":N.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+fb(c)+" ").replace(eb," ").indexOf(b)>-1)return!0;return!1}});var gb=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(gb,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){return n.trim(a.value)}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],(c.selected||i===e)&&(l.optDisabled?!c.disabled:null===c.getAttribute("disabled"))&&(!c.parentNode.disabled||!n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(n.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>-1:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var hb=/^(?:focusinfocus|focusoutblur)$/;n.extend(n.event,{trigger:function(b,c,e,f){var g,h,i,j,l,m,o,p=[e||d],q=k.call(b,"type")?b.type:b,r=k.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!hb.test(q+n.event.triggered)&&(q.indexOf(".")>-1&&(r=q.split("."),q=r.shift(),r.sort()),l=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=r.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},f||!o.trigger||o.trigger.apply(e,c)!==!1)){if(!f&&!o.noBubble&&!n.isWindow(e)){for(j=o.delegateType||q,hb.test(j+q)||(h=h.parentNode);h;h=h.parentNode)p.push(h),i=h;i===(e.ownerDocument||d)&&p.push(i.defaultView||i.parentWindow||a)}g=0;while((h=p[g++])&&!b.isPropagationStopped())b.type=g>1?j:o.bindType||q,m=(N.get(h,"events")||{})[b.type]&&N.get(h,"handle"),m&&m.apply(h,c),m=l&&h[l],m&&m.apply&&L(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=q,f||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!L(e)||l&&n.isFunction(e[q])&&!n.isWindow(e)&&(i=e[l],i&&(e[l]=null),n.event.triggered=q,e[q](),n.event.triggered=void 0,i&&(e[l]=i)),b.result}},simulate:function(a,b,c){var d=n.extend(new n.Event,c,{type:a,isSimulated:!0});n.event.trigger(d,null,b),d.isDefaultPrevented()&&c.preventDefault()}}),n.fn.extend({trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),l.focusin="onfocusin"in a,l.focusin||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a))};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=N.access(d,b);e||d.addEventListener(a,c,!0),N.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=N.access(d,b)-1;e?N.access(d,b,e):(d.removeEventListener(a,c,!0),N.remove(d,b))}}});var ib=a.location,jb=n.now(),kb=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return(!c||c.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+b),c};var lb=/#.*$/,mb=/([?&])_=[^&]*/,nb=/^(.*?):[ \t]*([^\r\n]*)$/gm,ob=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,pb=/^(?:GET|HEAD)$/,qb=/^\/\//,rb={},sb={},tb="*/".concat("*"),ub=d.createElement("a");ub.href=ib.href;function vb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(G)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function wb(a,b,c,d){var e={},f=a===sb;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function xb(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function yb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function zb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:ib.href,type:"GET",isLocal:ob.test(ib.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":tb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?xb(xb(a,n.ajaxSettings),b):xb(n.ajaxSettings,a)},ajaxPrefilter:vb(rb),ajaxTransport:vb(sb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m=n.ajaxSetup({},c),o=m.context||m,p=m.context&&(o.nodeType||o.jquery)?n(o):n.event,q=n.Deferred(),r=n.Callbacks("once memory"),s=m.statusCode||{},t={},u={},v=0,w="canceled",x={readyState:0,getResponseHeader:function(a){var b;if(2===v){if(!h){h={};while(b=nb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===v?g:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return v||(a=u[c]=u[c]||a,t[a]=b),this},overrideMimeType:function(a){return v||(m.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>v)for(b in a)s[b]=[s[b],a[b]];else x.always(a[x.status]);return this},abort:function(a){var b=a||w;return e&&e.abort(b),z(0,b),this}};if(q.promise(x).complete=r.add,x.success=x.done,x.error=x.fail,m.url=((b||m.url||ib.href)+"").replace(lb,"").replace(qb,ib.protocol+"//"),m.type=c.method||c.type||m.method||m.type,m.dataTypes=n.trim(m.dataType||"*").toLowerCase().match(G)||[""],null==m.crossDomain){j=d.createElement("a");try{j.href=m.url,j.href=j.href,m.crossDomain=ub.protocol+"//"+ub.host!=j.protocol+"//"+j.host}catch(y){m.crossDomain=!0}}if(m.data&&m.processData&&"string"!=typeof m.data&&(m.data=n.param(m.data,m.traditional)),wb(rb,m,c,x),2===v)return x;k=n.event&&m.global,k&&0===n.active++&&n.event.trigger("ajaxStart"),m.type=m.type.toUpperCase(),m.hasContent=!pb.test(m.type),f=m.url,m.hasContent||(m.data&&(f=m.url+=(kb.test(f)?"&":"?")+m.data,delete m.data),m.cache===!1&&(m.url=mb.test(f)?f.replace(mb,"$1_="+jb++):f+(kb.test(f)?"&":"?")+"_="+jb++)),m.ifModified&&(n.lastModified[f]&&x.setRequestHeader("If-Modified-Since",n.lastModified[f]),n.etag[f]&&x.setRequestHeader("If-None-Match",n.etag[f])),(m.data&&m.hasContent&&m.contentType!==!1||c.contentType)&&x.setRequestHeader("Content-Type",m.contentType),x.setRequestHeader("Accept",m.dataTypes[0]&&m.accepts[m.dataTypes[0]]?m.accepts[m.dataTypes[0]]+("*"!==m.dataTypes[0]?", "+tb+"; q=0.01":""):m.accepts["*"]);for(l in m.headers)x.setRequestHeader(l,m.headers[l]);if(m.beforeSend&&(m.beforeSend.call(o,x,m)===!1||2===v))return x.abort();w="abort";for(l in{success:1,error:1,complete:1})x[l](m[l]);if(e=wb(sb,m,c,x)){if(x.readyState=1,k&&p.trigger("ajaxSend",[x,m]),2===v)return x;m.async&&m.timeout>0&&(i=a.setTimeout(function(){x.abort("timeout")},m.timeout));try{v=1,e.send(t,z)}catch(y){if(!(2>v))throw y;z(-1,y)}}else z(-1,"No Transport");function z(b,c,d,h){var j,l,t,u,w,y=c;2!==v&&(v=2,i&&a.clearTimeout(i),e=void 0,g=h||"",x.readyState=b>0?4:0,j=b>=200&&300>b||304===b,d&&(u=yb(m,x,d)),u=zb(m,u,x,j),j?(m.ifModified&&(w=x.getResponseHeader("Last-Modified"),w&&(n.lastModified[f]=w),w=x.getResponseHeader("etag"),w&&(n.etag[f]=w)),204===b||"HEAD"===m.type?y="nocontent":304===b?y="notmodified":(y=u.state,l=u.data,t=u.error,j=!t)):(t=y,(b||!y)&&(y="error",0>b&&(b=0))),x.status=b,x.statusText=(c||y)+"",j?q.resolveWith(o,[l,y,x]):q.rejectWith(o,[x,y,t]),x.statusCode(s),s=void 0,k&&p.trigger(j?"ajaxSuccess":"ajaxError",[x,m,j?l:t]),r.fireWith(o,[x,y]),k&&(p.trigger("ajaxComplete",[x,m]),--n.active||n.event.trigger("ajaxStop")))}return x},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax(n.extend({url:a,type:b,dataType:e,data:c,success:d},n.isPlainObject(a)&&a))}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return n.isFunction(a)?this.each(function(b){n(this).wrapInner(a.call(this,b))}):this.each(function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return!n.expr.filters.visible(a)},n.expr.filters.visible=function(a){return a.offsetWidth>0||a.offsetHeight>0||a.getClientRects().length>0};var Ab=/%20/g,Bb=/\[\]$/,Cb=/\r?\n/g,Db=/^(?:submit|button|image|reset|file)$/i,Eb=/^(?:input|select|textarea|keygen)/i;function Fb(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||Bb.test(a)?d(a,e):Fb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Fb(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Fb(c,a[c],b,e);return d.join("&").replace(Ab,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Eb.test(this.nodeName)&&!Db.test(a)&&(this.checked||!X.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(Cb,"\r\n")}}):{name:b.name,value:c.replace(Cb,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Gb={0:200,1223:204},Hb=n.ajaxSettings.xhr();l.cors=!!Hb&&"withCredentials"in Hb,l.ajax=Hb=!!Hb,n.ajaxTransport(function(b){var c,d;return l.cors||Hb&&!b.crossDomain?{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Gb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=n("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Ib=[],Jb=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Ib.pop()||n.expando+"_"+jb++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Jb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Jb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Jb,"$1"+e):b.jsonp!==!1&&(b.url+=(kb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?n(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Ib.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),l.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||(l.createHTMLDocument?d.implementation.createHTMLDocument(""):d);var e=x.exec(a),f=!c&&[];return e?[b.createElement(e[1])]:(e=ca([a],b,f),f&&f.length&&n(f).remove(),n.merge([],e.childNodes))};var Kb=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Kb)return Kb.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(g,f||[a.responseText,b,a])})}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};function Lb(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,n.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(e=d.getBoundingClientRect(),c=Lb(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ea})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;n.fn[a]=function(d){return K(this,function(a,d,e){var f=Lb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=Ga(l.pixelPosition,function(a,c){return c?(c=Fa(a,b),Ba.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return K(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)},size:function(){return this.length}}),n.fn.andSelf=n.fn.addBack,"function"=="function"&&__webpack_require__(30)&&!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return n}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));var Mb=a.jQuery,Nb=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Nb),b&&a.jQuery===n&&(a.jQuery=Mb),n},b||(a.jQuery=a.$=n),n});


/***/ },
/* 30 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 31 */
/***/ function(module, exports) {

	/*
	 * 公共类,用于链式延迟执行函数
	 * 示例:
	 * nzdelay.w(1000).r(fn).w(1500).r(fn2);
	 */
	var nzdelay = (function () {
	    /*
	     * _delay是延时类,用于延时执行函数.
	     */
	    var _delay = function () {
	        this.__state = false;
	        this.__queue = [];
	        return this;
	    }
	    /*
	     * 开始执行队列
	     * @return this
	     */
	    _delay.prototype.__s = function () {
	        if (!this.__state) {
	            this.__state = true;
	            this.__queue.shift()();
	        }
	        return this;
	    }
	    /*
	     * 等待ms秒
	     * @param {number} [ms] 等待的毫秒
	     * @return this
	     */
	    _delay.prototype.w = function (ms) {
	        var my = this;
	        this.__queue.push(function () {
	            setTimeout(function () {
	                if (my.__queue.length) {
	                    my.__queue.shift()();
	                }
	            }, ms);
	        });
	        return this.__s();
	    }
	    /*
	     * 添加函数
	     * @param {function} [fn] 添加的函数
	     * @return this
	     */
	    _delay.prototype.r = function (fn) {
	        var my = this;
	        this.__queue.push(function () {
	            fn();
	            if (my.__queue.length) {
	                my.__queue.shift()();
	            }
	        });
	        return this.__s();
	    }
	    return {
	        w: function (ms) {
	            return (new _delay()).w(ms);
	        },
	        r: function (fn) {
	            return (new _delay()).r(fn);
	        }
	    }
	})();
	module.exports = nzdelay;

/***/ },
/* 32 */
/***/ function(module, exports) {

	/*
	 * 添加nzmask样式表
	 * 建议该段代码放于<head>内执行
	 * 或复制下列css样式
	 .nzmask {
	 background-color: rgba(0, 0, 0, 0.8);
	 width: 100%;
	 height: 100%;
	 z-index: 9999;
	 position: fixed;
	 left: 0px;
	 top: 0px;
	 opacity: 0;
	 pointer-events: none;
	 overflow: hidden;
	 transition: opacity 500ms;
	 }
	 .nzmask-show {
	 pointer-events: auto;
	 opacity: 1;
	 }
	 */

	//var nzmask__setCss = (function () {
	//    //添加样式规则
	//    if (document.styleSheets.length == 0) {
	//        document.head.appendChild(document.createElement("style"));
	//    }
	//    document.styleSheets[0].addRule(".nzmask", "" +
	//        "background-color: rgba(0,0,0,0.8);" +
	//        "width: 100%;" +
	//        "height: 100%;" +
	//        "overflow: hidden;" +
	//        "z-index: 9999;" +
	//        "position: fixed;" +
	//        "left: 0;" +
	//        "top: 0;" +
	//        "opacity: 0;" +
	//        "pointer-events: none;" +
	//        "-webkit-transition: opacity 500ms;" +
	//        "");
	//    document.styleSheets[0].addRule(".nzmask-show", "" +
	//        "pointer-events: auto;" +
	//        "opacity: 1;" +
	//        "");
	//})();
	/*
	 * nzmask是遮罩类,用于显示遮罩层.
	 */
	var nzmask = function () {
	    //选项
	    this.options = {
	        zIndex: 9999
	    }
	    //队列
	    this.queue = {
	        item: {},
	        items: []
	    };
	    //dom元素
	    this.dom = {
	        masks: []
	    };
	    //初始化
	    this.__init();
	    return this;
	}
	/*
	 * 初始化
	 * @return this
	 */
	nzmask.prototype.__init = function () {
	    //获取遮罩层
	    this.dom.masks = document.querySelectorAll(".nzmask");
	    return this;
	}
	/*
	 * 根据id获取遮罩在集合中的序号
	 * @param {string} [id] 遮罩的id
	 * @return number
	 */
	nzmask.prototype.__getIdxById = function (id) {
	    switch (typeof(id)) {
	        case "string":
	            //传入id
	            if (this.dom.masks && this.dom.masks.length) {
	                for (var i = 0; i < this.dom.masks.length; i++) {
	                    if (this.dom.masks[i].id == id) {
	                        return i;
	                    }
	                }
	            }
	            break;
	        case "number":
	            //传入序号
	            return id;
	            break;
	        default:
	            return -1;
	    }
	    return -1;
	}
	/*
	 * 显示遮罩
	 * @param {string|number} [id] 遮罩的序号或者id
	 * @param {number} [mode] 默认:0 显示模式:0替换\1叠加
	 * @return this
	 */
	nzmask.prototype.show = function (id, mode) {
	    if (mode == undefined) {
	        this.hide();
	    }
	    var idx = this.__getIdxById(id);
	    this.dom.masks[idx].style.zIndex = ++this.options.zIndex;
	    this.dom.masks[idx].classList.add("nzmask-show");
	    return this;
	}
	/*
	 * 隐藏遮罩,如传入id则隐藏该id遮罩,否则全部隐藏
	 * @param {string|number} [id] 遮罩的序号或者id
	 * @return this
	 */
	nzmask.prototype.hide = function (id) {
	    if (id != undefined) {
	        var idx = this.__getIdxById(id);
	        this.dom.masks[idx].classList.remove("nzmask-show");
	    } else {
	        for (var i = 0; i < this.dom.masks.length; i++) {
	            this.dom.masks[i].classList.remove("nzmask-show");
	        }
	    }
	    return this;
	}
	module.exports = nzmask;

/***/ },
/* 33 */
/***/ function(module, exports) {

	/*
	 * 游戏控制类
	 * @param {number} [para.speed] 速度
	 * @param {function} [para.onPlay] 回调
	 */
	var game = function (option) {
	    this.option = option || {};
	    this._over = true;
	    this.pause = true;
	    this.speed = this.option.speed || 5;
	    this.e_play = this.option.onPlay;
	    this.fn_play = (function (my) {
	        var total = 0;
	        return function () {
	            if (my._over) {
	                return;
	            }
	            if (my.pause) {
	                window.requestAnimationFrame(my.fn_play);
	                return;
	            }
	            if (++total >= my.speed) {
	                total = 0;
	                if (my.e_play) {
	                    my.e_play();
	                }
	            }
	            if (my._over) {
	                return;
	            }
	            window.requestAnimationFrame(my.fn_play);
	        }
	    })(this);
	}
	/*
	 * 运行
	 * @param {function} [callback] 回调函数
	 * @param {number} [speed] 速度
	 */
	game.prototype.play = function (callback, speed) {
	    this.e_play = callback || this.e_play;
	    this.speed = speed || this.speed;
	    this._over = this.pause = false;
	    window.requestAnimationFrame(this.fn_play);
	    return this;
	}
	/*
	 * 结束
	 */
	game.prototype.over = function () {
	    this.pause = this._over = true;
	    return this;
	}

	module.exports = game;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	//api
	var $ = __webpack_require__(29);
	var lbs = __webpack_require__(35);
	var Api = {
	    /*
	     * 获取矩形4个角的顺时针位置
	     * param {number} [slen] 边长
	     */
	    getRectCorners: (function () {
	        var a = [];
	        return function (slen) {
	            if (!a[slen]) {
	                a[slen] = [0, slen - 1, Math.pow(slen, 2) - 1, Math.pow(slen, 2) - slen];
	            }
	            return a[slen];
	        }
	    })(),
	    /*
	     * 获取矩形第x条边第n个点的序号(顺时针)
	     * @param {number} [x] 第n条边
	     * @param {number} [x2] 第n个点
	     * @param {number} [slen] 边长
	     */
	    getRectPoint: (function () {
	        var a = [];
	        return function (x, x2, slen) {
	            switch (x) {
	                case 0:
	                    return Api.getRectCorners(slen)[x] + x2;
	                    break;
	                case 1:
	                    return Api.getRectCorners(slen)[x] + x2 * slen;
	                    break;
	                case 2:
	                    return Api.getRectCorners(slen)[x] - x2;
	                    break;
	                case 3:
	                    return Api.getRectCorners(slen)[x] - x2 * slen;
	                    break;
	                default:
	                    return -1;
	            }
	        }
	    })(),
	    getPr: function () {
	        var df = document.createDocumentFragment(), df_e1;
	        df_e1 = document.createElement("option");
	        df_e1.appendChild(document.createTextNode("请选择"));
	        df.appendChild(df_e1);
	        for (var pt in lbs[0]) {
	            df_e1 = document.createElement("option");
	            df_e1.appendChild(document.createTextNode(lbs[0][pt]));
	            df.appendChild(df_e1);
	        }
	        return df.childNodes.length == 1 ? document.createDocumentFragment() : df;
	    },
	    getPrPtByPrName: function (name) {
	        for (var pt in lbs[0]) {
	            if (lbs[0][pt] == name) {
	                return pt;
	            }
	        }
	    },
	    getCity: function (prName) {
	        var prpt = Api.getPrPtByPrName(prName);
	        if (!prpt) {
	            return document.createDocumentFragment();
	        }
	        var df = document.createDocumentFragment(), df_e1;
	        df_e1 = document.createElement("option");
	        df_e1.appendChild(document.createTextNode("请选择"));
	        df.appendChild(df_e1);
	        for (var pt in lbs[1]) {
	            if (pt == prpt) {
	                for (var i = 0; i < lbs[1][pt].length; i++) {
	                    df_e1 = document.createElement("option");
	                    df_e1.appendChild(document.createTextNode(lbs[1][pt][i][0]));
	                    df.appendChild(df_e1);
	                }
	            }
	        }
	        return df.childNodes.length == 1 ? document.createDocumentFragment() : df;
	    },
	    getCityPtByCityName: function (name) {
	        for (var pt in lbs[1]) {
	            for (var i = 0; i < lbs[1][pt].length; i++) {

	                if (lbs[1][pt][i][0] == name) {
	                    return lbs[1][pt][i][1];
	                }
	            }
	        }
	    },
	    getDist: function (cityName) {
	        var citypt = Api.getCityPtByCityName(cityName);
	        if (!citypt) {
	            return document.createDocumentFragment();
	        }
	        var df = document.createDocumentFragment(), df_e1;
	        df_e1 = document.createElement("option");
	        df_e1.appendChild(document.createTextNode("请选择"));
	        df.appendChild(df_e1);
	        for (var pt in lbs[2]) {
	            if (pt == citypt) {
	                for (var i2 = 0; i2 < lbs[2][pt].length; i2++) {
	                    df_e1 = document.createElement("option");
	                    df_e1.appendChild(document.createTextNode(lbs[2][pt][i2][0]));
	                    df.appendChild(df_e1);
	                }
	            }
	        }
	        return df.childNodes.length == 1 ? document.createDocumentFragment() : df;
	    },
	    getSeq: (function () {
	        var a = [];
	        return function (slen) {
	            if (!a[slen]) {
	                a[slen] = [];
	                for (var i = 0; i < 4; i++) {
	                    a[slen].push(Api.getRectCorners(slen)[i]);
	                    for (var j = 1; j < slen - 1; j++) {
	                        a[slen].push(Api.getRectPoint(i, j, slen));
	                    }
	                }
	            }
	            return a[slen];
	        }
	    })(),
	    getPrz: (function () {
	        var o, a, l;
	        return function (x) {
	            if (!a) {
	                o = document.querySelectorAll(".panel-game li>*");
	                a = [];
	                l = Math.sqrt(o.length);
	                for (var i = 0; i < Api.getSeq(l).length; i++) {
	                    a.push(o[Api.getSeq(l)[i]]);
	                }
	            }
	            return x != undefined ? a[x] : a;
	        }
	    })(),
	    selPrz: (function () {
	        var i = 0;
	        return function (idx) {
	            if (idx != undefined && idx != i) {
	                Api.getPrz(i).classList.remove("active");
	                i = idx;
	                Api.getPrz(i).classList.add("active");
	            }
	            return i;
	        }
	    })(),
	    createPrz: function (db) {
	        //<span class="cvc">
	        //<img style="width: 1.6rem;height: 1.2rem;" src="upload/p1.png"/>
	        //<b>￥<b>3元</b></b>
	        //</span>
	        var e1 = document.createElement("span"),
	            e2 = document.createElement("img"),
	            e3 = document.createElement("b"),
	            e3_txt1 = document.createTextNode(db.type != 1 ? "￥" : ""),
	            e4 = document.createElement("b"),
	            e4_txt1 = db.type != 1 ? document.createTextNode(db.price + "元") : document.createTextNode(db.name);
	        e1.classList.add("cvc");
	        e2.src = db.imgUrl;
	        e4.appendChild(e4_txt1);
	        e3.appendChild(e3_txt1);
	        e3.appendChild(e4);
	        e1.appendChild(e2);
	        e1.appendChild(e3);
	        return e1;
	    },
	    setMsPrz: (function () {
	        var $pto = $("#msPrize .bg-alert2-5-1 img"),
	            $tit = $("#msPrize .bg-alert2-5-1 p"),
	            $price = $("#msPrize .pay .num"),
	            $txt = $("#msPrize .ctx p"),
	            $btn = $("#msPrize .ui-btn-sty1 b");
	        return function (przConfig) {
	            $pto.attr("src", przConfig.imgUrl);
	            $tit.text(przConfig.name);
	            switch (przConfig.type) {
	                case 1:
	                    //积分
	                    $price.parent().hide();
	                    $txt.html("恭喜你抽中" + przConfig.name + "，\<br/\>奖励积分已发放到你账户请注意查收。");
	                    $btn.text("再来一次");
	                    break;
	                case 2:
	                    //实物
	                    $price.text(przConfig.price).parent().show();
	                    $txt.html("人品大爆发呀~~\<br/\>恭喜你抽中" + przConfig.name + "，\<br/\>赶紧认领抱回家吧！");
	                    $btn.text("立即认领");
	                    break;
	                case 3:
	                    //流量
	                    $price.parent().hide();
	                    $txt.html("恭喜你抽中" + przConfig.name + "，\<br/\>流量将在1-3个工作日发放到你账户请注意查收。");
	                    $btn.text("再来一次");
	                    break;
	                default:
	            }
	        }
	    })(),
	    setWinners: (function () {
	        var $tb = $(".panel-winners tbody");

	        function cutString(str, len, suffix) {
	            if (!str) return "";
	            if (len <= 0) return "";
	            if (!suffix) suffix = "";
	            var templen = 0;
	            for (var i = 0; i < str.length; i++) {
	                if (str.charCodeAt(i) > 255) {
	                    templen += 2;
	                } else {
	                    templen++
	                }
	                if (templen == len) {
	                    return str.substring(0, i + 1) + suffix;
	                } else if (templen > len) {
	                    return str.substring(0, i) + suffix;
	                }
	            }
	            return str;
	        }

	        return function (db) {
	            if (db.length == 0) {
	                return;
	            }
	            $tb.children().remove();
	            var df = document.createDocumentFragment();
	            for (var i = 0; i < db.length; i += 2) {
	                df.appendChild(document.createElement("tr"));
	                df.childNodes[df.childNodes.length - 1].appendChild(document.createElement("td"));
	                df.childNodes[df.childNodes.length - 1].appendChild(document.createElement("td"));
	                df.childNodes[df.childNodes.length - 1].appendChild(document.createElement("td"));
	                df.childNodes[df.childNodes.length - 1].appendChild(document.createElement("td"));
	                df.childNodes[df.childNodes.length - 1].childNodes[0].appendChild(document.createTextNode(db[i].account.substr(0, 3) + "***" + db[i].account.substr(db[i].account.length - 2, 2)));
	                df.childNodes[df.childNodes.length - 1].childNodes[1].appendChild(document.createTextNode(cutString(db[i].awardName, 18, "")));
	                if (i <= db.length - 2) {
	                    df.childNodes[df.childNodes.length - 1].childNodes[2].appendChild(document.createTextNode(db[i + 1].account.substr(0, 3) + "***" + db[i + 1].account.substr(db[i + 1].account.length - 2, 2)));
	                    df.childNodes[df.childNodes.length - 1].childNodes[3].appendChild(document.createTextNode(cutString(db[i + 1].awardName, 18, "")));
	                }
	            }
	            $tb.append(df);
	        }
	    })()
	};
	module.exports = Api;


/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = [{
	    '340000': '安徽省',
	    '110000': '北京市',
	    '500000': '重庆市',
	    '350000': '福建省',
	    '620000': '甘肃省',
	    '440000': '广东省',
	    '450000': '广西壮族自治区',
	    '520000': '贵州省',
	    '130000': '河北省',
	    '410000': '河南省',
	    '230000': '黑龙江省',
	    '420000': '湖北省',
	    '430000': '湖南省',
	    '460000': '海南省',
	    '220000': '吉林省',
	    '360000': '江西省',
	    '320000': '江苏省',
	    '210000': '辽宁省',
	    '640000': '宁夏回族自治区',
	    '150000': '内蒙古自治区',
	    '630000': '青海省',
	    '310000': '上海市',
	    '610000': '陕西省',
	    '370000': '山东省',
	    '140000': '山西省',
	    '510000': '四川省',
	    '120000': '天津市',
	    '650000': '新疆维吾尔自治区',
	    '540000': '西藏自治区',
	    '530000': '云南省',
	    '330000': '浙江省'
	}, {
	    '210000': [['沈阳市', '210100'], ['大连市', '210200'], ['鞍山市', '210300'], ['抚顺市', '210400'], ['本溪市', '210500'], ['丹东市', '210600'], ['锦州市', '210700'], ['营口市', '210800'], ['阜新市', '210900'], ['辽阳市', '211000'], ['盘锦市', '211100'], ['铁岭市', '211200'], ['朝阳市', '211300'], ['葫芦岛市', '211400']],
	    '220000': [['长春市', '220100'], ['吉林市', '220200'], ['四平市', '220300'], ['辽源市', '220400'], ['通化市', '220500'], ['白山市', '220600'], ['松原市', '220700'], ['白城市', '220800'], ['延边朝鲜族自治州', '222400']],
	    '230000': [['哈尔滨市', '230100'], ['齐齐哈尔市', '230200'], ['鸡西市', '230300'], ['鹤岗市', '230400'], ['双鸭山市', '230500'], ['大庆市', '230600'], ['伊春市', '230700'], ['佳木斯市', '230800'], ['七台河市', '230900'], ['牡丹江市', '231000'], ['黑河市', '231100'], ['绥化市', '231200'], ['大兴安岭地区', '232700']],
	    '340000': [['合肥市', '340100'], ['芜湖市', '340200'], ['蚌埠市', '340300'], ['淮南市', '340400'], ['马鞍山市', '340500'], ['淮北市', '340600'], ['铜陵市', '340700'], ['安庆市', '340800'], ['黄山市', '341000'], ['滁州市', '341100'], ['阜阳市', '341200'], ['宿州市', '341300'], ['巢湖市', '341400'], ['六安市', '341500'], ['亳州市', '341600'], ['池州市', '341700'], ['宣城市', '341800']],
	    '350000': [['福州市', '350100'], ['厦门市', '350200'], ['莆田市', '350300'], ['三明市', '350400'], ['泉州市', '350500'], ['漳州市', '350600'], ['南平市', '350700'], ['龙岩市', '350800'], ['宁德市', '350900']],
	    '360000': [['南昌市', '360100'], ['景德镇市', '360200'], ['萍乡市', '360300'], ['九江市', '360400'], ['新余市', '360500'], ['鹰潭市', '360600'], ['赣州市', '360700'], ['吉安市', '360800'], ['宜春市', '360900'], ['抚州市', '361000'], ['上饶市', '361100']],
	    '370000': [['济南市', '370100'], ['青岛市', '370200'], ['淄博市', '370300'], ['枣庄市', '370400'], ['东营市', '370500'], ['烟台市', '370600'], ['潍坊市', '370700'], ['济宁市', '370800'], ['泰安市', '370900'], ['威海市', '371000'], ['日照市', '371100'], ['莱芜市', '371200'], ['临沂市', '371300'], ['德州市', '371400'], ['聊城市', '371500'], ['滨州市', '371600'], ['荷泽市', '371700']],
	    '410000': [['郑州市', '410100'], ['开封市', '410200'], ['洛阳市', '410300'], ['平顶山市', '410400'], ['安阳市', '410500'], ['鹤壁市', '410600'], ['新乡市', '410700'], ['焦作市', '410800'], ['濮阳市', '410900'], ['许昌市', '411000'], ['漯河市', '411100'], ['三门峡市', '411200'], ['南阳市', '411300'], ['商丘市', '411400'], ['信阳市', '411500'], ['周口市', '411600'], ['驻马店市', '411700']],
	    '420000': [['武汉市', '420100'], ['黄石市', '420200'], ['十堰市', '420300'], ['宜昌市', '420500'], ['襄樊市', '420600'], ['鄂州市', '420700'], ['荆门市', '420800'], ['孝感市', '420900'], ['荆州市', '421000'], ['黄冈市', '421100'], ['咸宁市', '421200'], ['随州市', '421300'], ['恩施土家族苗族自治州', '422800'], ['省直辖行政单位', '429000']],
	    '310000': [['市辖区', '310100'], ['县', '310200']],
	    '320000': [['南京市', '320100'], ['无锡市', '320200'], ['徐州市', '320300'], ['常州市', '320400'], ['苏州市', '320500'], ['南通市', '320600'], ['连云港市', '320700'], ['淮安市', '320800'], ['盐城市', '320900'], ['扬州市', '321000'], ['镇江市', '321100'], ['泰州市', '321200'], ['宿迁市', '321300']],
	    '330000': [['杭州市', '330100'], ['宁波市', '330200'], ['温州市', '330300'], ['嘉兴市', '330400'], ['湖州市', '330500'], ['绍兴市', '330600'], ['金华市', '330700'], ['衢州市', '330800'], ['舟山市', '330900'], ['台州市', '331000'], ['丽水市', '331100']],
	    '110000': [['市辖区', '110100'], ['县', '110200']],
	    '120000': [['市辖区', '120100'], ['县', '120200']],
	    '130000': [['石家庄市', '130100'], ['唐山市', '130200'], ['秦皇岛市', '130300'], ['邯郸市', '130400'], ['邢台市', '130500'], ['保定市', '130600'], ['张家口市', '130700'], ['承德市', '130800'], ['沧州市', '130900'], ['廊坊市', '131000'], ['衡水市', '131100']],
	    '140000': [['太原市', '140100'], ['大同市', '140200'], ['阳泉市', '140300'], ['长治市', '140400'], ['晋城市', '140500'], ['朔州市', '140600'], ['晋中市', '140700'], ['运城市', '140800'], ['忻州市', '140900'], ['临汾市', '141000'], ['吕梁地区', '142300']],
	    '150000': [['呼和浩特市', '150100'], ['包头市', '150200'], ['乌海市', '150300'], ['赤峰市', '150400'], ['通辽市', '150500'], ['鄂尔多斯市', '150600'], ['呼伦贝尔市', '150700'], ['兴安盟', '152200'], ['锡林郭勒盟', '152500'], ['乌兰察布盟', '152600'], ['巴彦淖尔盟', '152800'], ['阿拉善盟', '152900']],
	    '520000': [['贵阳市', '520100'], ['六盘水市', '520200'], ['遵义市', '520300'], ['安顺市', '520400'], ['铜仁地区', '522200'], ['黔西南布依族苗族自治州', '522300'], ['毕节地区', '522400'], ['黔东南苗族侗族自治州', '522600'], ['黔南布依族苗族自治州', '522700']],
	    '530000': [['昆明市', '530100'], ['曲靖市', '530300'], ['玉溪市', '530400'], ['保山市', '530500'], ['昭通市', '530600'], ['丽江市', '530700'], ['楚雄彝族自治州', '532300'], ['红河哈尼族彝族自治州', '532500'], ['文山壮族苗族自治州', '532600'], ['思茅地区', '532700'], ['西双版纳傣族自治州', '532800'], ['大理白族自治州', '532900'], ['德宏傣族景颇族自治州', '533100'], ['怒江傈僳族自治州', '533300'], ['迪庆藏族自治州', '533400'], ['临沧地区', '533500']],
	    '540000': [['拉萨市', '540100'], ['昌都地区', '542100'], ['山南地区', '542200'], ['日喀则地区', '542300'], ['那曲地区', '542400'], ['阿里地区', '542500'], ['林芝地区', '542600']],
	    '610000': [['西安市', '610100'], ['铜川市', '610200'], ['宝鸡市', '610300'], ['咸阳市', '610400'], ['渭南市', '610500'], ['延安市', '610600'], ['汉中市', '610700'], ['榆林市', '610800'], ['安康市', '610900'], ['商洛市', '611000']],
	    '620000': [['兰州市', '620100'], ['嘉峪关市', '620200'], ['金昌市', '620300'], ['白银市', '620400'], ['天水市', '620500'], ['武威市', '620600'], ['张掖市', '620700'], ['平凉市', '620800'], ['酒泉市', '620900'], ['庆阳市', '621000'], ['定西市', '621100'], ['陇南地区', '622600'], ['临夏回族自治州', '622900'], ['甘南藏族自治州', '623000']],
	    '630000': [['西宁市', '630100'], ['海东地区', '632100'], ['海北藏族自治州', '632200'], ['黄南藏族自治州', '632300'], ['海南藏族自治州', '632500'], ['果洛藏族自治州', '632600'], ['玉树藏族自治州', '632700'], ['海西蒙古族藏族自治州', '632800']],
	    '640000': [['银川市', '640100'], ['石嘴山市', '640200'], ['吴忠市', '640300'], ['固原市', '640400']],
	    '650000': [['乌鲁木齐市', '650100'], ['克拉玛依市', '650200'], ['吐鲁番地区', '652100'], ['哈密地区', '652200'], ['昌吉回族自治州', '652300'], ['博尔塔拉蒙古自治州', '652700'], ['巴音郭楞蒙古自治州', '652800'], ['阿克苏地区', '652900'], ['克孜勒苏柯尔克孜自治州', '653000'], ['喀什地区', '653100'], ['和田地区', '653200'], ['伊犁哈萨克自治州', '654000'], ['塔城地区', '654200'], ['阿勒泰地区', '654300'], ['省直辖行政单位', '659000']],
	    '430000': [['长沙市', '430100'], ['株洲市', '430200'], ['湘潭市', '430300'], ['衡阳市', '430400'], ['邵阳市', '430500'], ['岳阳市', '430600'], ['常德市', '430700'], ['张家界市', '430800'], ['益阳市', '430900'], ['郴州市', '431000'], ['永州市', '431100'], ['怀化市', '431200'], ['娄底市', '431300'], ['湘西土家族苗族自治州', '433100']],
	    '440000': [['广州市', '440100'], ['韶关市', '440200'], ['深圳市', '440300'], ['珠海市', '440400'], ['汕头市', '440500'], ['佛山市', '440600'], ['江门市', '440700'], ['湛江市', '440800'], ['茂名市', '440900'], ['肇庆市', '441200'], ['惠州市', '441300'], ['梅州市', '441400'], ['汕尾市', '441500'], ['河源市', '441600'], ['阳江市', '441700'], ['清远市', '441800'], ['东莞市', '441900'], ['中山市', '442000'], ['潮州市', '445100'], ['揭阳市', '445200'], ['云浮市', '445300']],
	    '450000': [['南宁市', '450100'], ['柳州市', '450200'], ['桂林市', '450300'], ['梧州市', '450400'], ['北海市', '450500'], ['防城港市', '450600'], ['钦州市', '450700'], ['贵港市', '450800'], ['玉林市', '450900'], ['百色市', '451000'], ['贺州市', '451100'], ['河池市', '451200'], ['来宾市', '451300'], ['崇左市', '451400']],
	    '460000': [['海口市', '460100'], ['三亚市', '460200'], ['省直辖县级行政单位', '469000']],
	    '500000': [['市辖区', '500100'], ['县', '500200'], ['市', '500300']],
	    '510000': [['成都市', '510100'], ['自贡市', '510300'], ['攀枝花市', '510400'], ['泸州市', '510500'], ['德阳市', '510600'], ['绵阳市', '510700'], ['广元市', '510800'], ['遂宁市', '510900'], ['内江市', '511000'], ['乐山市', '511100'], ['南充市', '511300'], ['眉山市', '511400'], ['宜宾市', '511500'], ['广安市', '511600'], ['达州市', '511700'], ['雅安市', '511800'], ['巴中市', '511900'], ['资阳市', '512000'], ['阿坝藏族羌族自治州', '513200'], ['甘孜藏族自治州', '513300'], ['凉山彝族自治州', '513400']]
	}, {
	    '210100': [['市辖区', '210101'], ['和平区', '210102'], ['沈河区', '210103'], ['大东区', '210104'], ['皇姑区', '210105'], ['铁西区', '210106'], ['苏家屯区', '210111'], ['东陵区', '210112'], ['新城子区', '210113'], ['于洪区', '210114'], ['辽中县', '210122'], ['康平县', '210123'], ['法库县', '210124'], ['新民市', '210181']],
	    '210200': [['市辖区', '210201'], ['中山区', '210202'], ['西岗区', '210203'], ['沙河口区', '210204'], ['甘井子区', '210211'], ['旅顺口区', '210212'], ['金州区', '210213'], ['长海县', '210224'], ['瓦房店市', '210281'], ['普兰店市', '210282'], ['庄河市', '210283']],
	    '210300': [['市辖区', '210301'], ['铁东区', '210302'], ['铁西区', '210303'], ['立山区', '210304'], ['千山区', '210311'], ['台安县', '210321'], ['岫岩满族自治县', '210323'], ['海城市', '210381']],
	    '210400': [['市辖区', '210401'], ['新抚区', '210402'], ['东洲区', '210403'], ['望花区', '210404'], ['顺城区', '210411'], ['抚顺县', '210421'], ['新宾满族自治县', '210422'], ['清原满族自治县', '210423']],
	    '210500': [['市辖区', '210501'], ['平山区', '210502'], ['溪湖区', '210503'], ['明山区', '210504'], ['南芬区', '210505'], ['本溪满族自治县', '210521'], ['桓仁满族自治县', '210522']],
	    '210600': [['市辖区', '210601'], ['元宝区', '210602'], ['振兴区', '210603'], ['振安区', '210604'], ['宽甸满族自治县', '210624'], ['东港市', '210681'], ['凤城市', '210682']],
	    '210700': [['市辖区', '210701'], ['古塔区', '210702'], ['凌河区', '210703'], ['太和区', '210711'], ['黑山县', '210726'], ['义县', '210727'], ['凌海市', '210781'], ['北宁市', '210782']],
	    '210800': [['市辖区', '210801'], ['站前区', '210802'], ['西市区', '210803'], ['鲅鱼圈区', '210804'], ['老边区', '210811'], ['盖州市', '210881'], ['大石桥市', '210882']],
	    '210900': [['市辖区', '210901'], ['海州区', '210902'], ['新邱区', '210903'], ['太平区', '210904'], ['清河门区', '210905'], ['细河区', '210911'], ['阜新蒙古族自治县', '210921'], ['彰武县', '210922']],
	    '211000': [['市辖区', '211001'], ['白塔区', '211002'], ['文圣区', '211003'], ['宏伟区', '211004'], ['弓长岭区', '211005'], ['太子河区', '211011'], ['辽阳县', '211021'], ['灯塔市', '211081']],
	    '211100': [['市辖区', '211101'], ['双台子区', '211102'], ['兴隆台区', '211103'], ['大洼县', '211121'], ['盘山县', '211122']],
	    '211200': [['市辖区', '211201'], ['银州区', '211202'], ['清河区', '211204'], ['铁岭县', '211221'], ['西丰县', '211223'], ['昌图县', '211224'], ['调兵山市', '211281'], ['开原市', '211282']],
	    '211300': [['市辖区', '211301'], ['双塔区', '211302'], ['龙城区', '211303'], ['朝阳县', '211321'], ['建平县', '211322'], ['喀喇沁左翼蒙古族自治县', '211324'], ['北票市', '211381'], ['凌源市', '211382']],
	    '211400': [['市辖区', '211401'], ['连山区', '211402'], ['龙港区', '211403'], ['南票区', '211404'], ['绥中县', '211421'], ['建昌县', '211422'], ['兴城市', '211481']],
	    '220100': [['市辖区', '220101'], ['南关区', '220102'], ['宽城区', '220103'], ['朝阳区', '220104'], ['二道区', '220105'], ['绿园区', '220106'], ['双阳区', '220112'], ['农安县', '220122'], ['九台市', '220181'], ['榆树市', '220182'], ['德惠市', '220183']],
	    '220200': [['市辖区', '220201'], ['昌邑区', '220202'], ['龙潭区', '220203'], ['船营区', '220204'], ['丰满区', '220211'], ['永吉县', '220221'], ['蛟河市', '220281'], ['桦甸市', '220282'], ['舒兰市', '220283'], ['磐石市', '220284']],
	    '220300': [['市辖区', '220301'], ['铁西区', '220302'], ['铁东区', '220303'], ['梨树县', '220322'], ['伊通满族自治县', '220323'], ['公主岭市', '220381'], ['双辽市', '220382']],
	    '220400': [['市辖区', '220401'], ['龙山区', '220402'], ['西安区', '220403'], ['东丰县', '220421'], ['东辽县', '220422']],
	    '220500': [['市辖区', '220501'], ['东昌区', '220502'], ['二道江区', '220503'], ['通化县', '220521'], ['辉南县', '220523'], ['柳河县', '220524'], ['梅河口市', '220581'], ['集安市', '220582']],
	    '220600': [['市辖区', '220601'], ['八道江区', '220602'], ['抚松县', '220621'], ['靖宇县', '220622'], ['长白朝鲜族自治县', '220623'], ['江源县', '220625'], ['临江市', '220681']],
	    '220700': [['市辖区', '220701'], ['宁江区', '220702'], ['前郭尔罗斯蒙古族自治县', '220721'], ['长岭县', '220722'], ['乾安县', '220723'], ['扶余县', '220724']],
	    '220800': [['市辖区', '220801'], ['洮北区', '220802'], ['镇赉县', '220821'], ['通榆县', '220822'], ['洮南市', '220881'], ['大安市', '220882']],
	    '222400': [['延吉市', '222401'], ['图们市', '222402'], ['敦化市', '222403'], ['珲春市', '222404'], ['龙井市', '222405'], ['和龙市', '222406'], ['汪清县', '222424'], ['安图县', '222426']],
	    '230100': [['市辖区', '230101'], ['道里区', '230102'], ['南岗区', '230103'], ['道外区', '230104'], ['太平区', '230105'], ['香坊区', '230106'], ['动力区', '230107'], ['平房区', '230108'], ['呼兰县', '230121'], ['依兰县', '230123'], ['方正县', '230124'], ['宾县', '230125'], ['巴彦县', '230126'], ['木兰县', '230127'], ['通河县', '230128'], ['延寿县', '230129'], ['阿城市', '230181'], ['双城市', '230182'], ['尚志市', '230183'], ['五常市', '230184']],
	    '230200': [['市辖区', '230201'], ['龙沙区', '230202'], ['建华区', '230203'], ['铁锋区', '230204'], ['昂昂溪区', '230205'], ['富拉尔基区', '230206'], ['碾子山区', '230207'], ['梅里斯达斡尔族区', '230208'], ['龙江县', '230221'], ['依安县', '230223'], ['泰来县', '230224'], ['甘南县', '230225'], ['富裕县', '230227'], ['克山县', '230229'], ['克东县', '230230'], ['拜泉县', '230231'], ['讷河市', '230281']],
	    '230300': [['市辖区', '230301'], ['鸡冠区', '230302'], ['恒山区', '230303'], ['滴道区', '230304'], ['梨树区', '230305'], ['城子河区', '230306'], ['麻山区', '230307'], ['鸡东县', '230321'], ['虎林市', '230381'], ['密山市', '230382']],
	    '230400': [['市辖区', '230401'], ['向阳区', '230402'], ['工农区', '230403'], ['南山区', '230404'], ['兴安区', '230405'], ['东山区', '230406'], ['兴山区', '230407'], ['萝北县', '230421'], ['绥滨县', '230422']],
	    '230500': [['市辖区', '230501'], ['尖山区', '230502'], ['岭东区', '230503'], ['四方台区', '230505'], ['宝山区', '230506'], ['集贤县', '230521'], ['友谊县', '230522'], ['宝清县', '230523'], ['饶河县', '230524']],
	    '230600': [['市辖区', '230601'], ['萨尔图区', '230602'], ['龙凤区', '230603'], ['让胡路区', '230604'], ['红岗区', '230605'], ['大同区', '230606'], ['肇州县', '230621'], ['肇源县', '230622'], ['林甸县', '230623'], ['杜尔伯特蒙古族自治县', '230624']],
	    '230700': [['市辖区', '230701'], ['伊春区', '230702'], ['南岔区', '230703'], ['友好区', '230704'], ['西林区', '230705'], ['翠峦区', '230706'], ['新青区', '230707'], ['美溪区', '230708'], ['金山屯区', '230709'], ['五营区', '230710'], ['乌马河区', '230711'], ['汤旺河区', '230712'], ['带岭区', '230713'], ['乌伊岭区', '230714'], ['红星区', '230715'], ['上甘岭区', '230716'], ['嘉荫县', '230722'], ['铁力市', '230781']],
	    '230800': [['市辖区', '230801'], ['永红区', '230802'], ['向阳区', '230803'], ['前进区', '230804'], ['东风区', '230805'], ['郊区', '230811'], ['桦南县', '230822'], ['桦川县', '230826'], ['汤原县', '230828'], ['抚远县', '230833'], ['同江市', '230881'], ['富锦市', '230882']],
	    '230900': [['市辖区', '230901'], ['新兴区', '230902'], ['桃山区', '230903'], ['茄子河区', '230904'], ['勃利县', '230921']],
	    '231000': [['市辖区', '231001'], ['东安区', '231002'], ['阳明区', '231003'], ['爱民区', '231004'], ['西安区', '231005'], ['东宁县', '231024'], ['林口县', '231025'], ['绥芬河市', '231081'], ['海林市', '231083'], ['宁安市', '231084'], ['穆棱市', '231085']],
	    '231100': [['市辖区', '231101'], ['爱辉区', '231102'], ['嫩江县', '231121'], ['逊克县', '231123'], ['孙吴县', '231124'], ['北安市', '231181'], ['五大连池市', '231182']],
	    '231200': [['市辖区', '231201'], ['北林区', '231202'], ['望奎县', '231221'], ['兰西县', '231222'], ['青冈县', '231223'], ['庆安县', '231224'], ['明水县', '231225'], ['绥棱县', '231226'], ['安达市', '231281'], ['肇东市', '231282'], ['海伦市', '231283']],
	    '232700': [['呼玛县', '232721'], ['塔河县', '232722'], ['漠河县', '232723']],
	    '340100': [['市辖区', '340101'], ['瑶海区', '340102'], ['庐阳区', '340103'], ['蜀山区', '340104'], ['包河区', '340111'], ['长丰县', '340121'], ['肥东县', '340122'], ['肥西县', '340123']],
	    '340200': [['市辖区', '340201'], ['镜湖区', '340202'], ['马塘区', '340203'], ['新芜区', '340204'], ['鸠江区', '340207'], ['芜湖县', '340221'], ['繁昌县', '340222'], ['南陵县', '340223']],
	    '340300': [['市辖区', '340301'], ['东市区', '340302'], ['中市区', '340303'], ['西市区', '340304'], ['郊区', '340311'], ['怀远县', '340321'], ['五河县', '340322'], ['固镇县', '340323']],
	    '340400': [['市辖区', '340401'], ['大通区', '340402'], ['田家庵区', '340403'], ['谢家集区', '340404'], ['八公山区', '340405'], ['潘集区', '340406'], ['凤台县', '340421']],
	    '340500': [['市辖区', '340501'], ['金家庄区', '340502'], ['花山区', '340503'], ['雨山区', '340504'], ['当涂县', '340521']],
	    '340600': [['市辖区', '340601'], ['杜集区', '340602'], ['相山区', '340603'], ['烈山区', '340604'], ['濉溪县', '340621']],
	    '340700': [['市辖区', '340701'], ['铜官山区', '340702'], ['狮子山区', '340703'], ['郊区', '340711'], ['铜陵县', '340721']],
	    '340800': [['市辖区', '340801'], ['迎江区', '340802'], ['大观区', '340803'], ['郊区', '340811'], ['怀宁县', '340822'], ['枞阳县', '340823'], ['潜山县', '340824'], ['太湖县', '340825'], ['宿松县', '340826'], ['望江县', '340827'], ['岳西县', '340828'], ['桐城市', '340881']],
	    '341000': [['市辖区', '341001'], ['屯溪区', '341002'], ['黄山区', '341003'], ['徽州区', '341004'], ['歙县', '341021'], ['休宁县', '341022'], ['黟县', '341023'], ['祁门县', '341024']],
	    '341100': [['市辖区', '341101'], ['琅琊区', '341102'], ['南谯区', '341103'], ['来安县', '341122'], ['全椒县', '341124'], ['定远县', '341125'], ['凤阳县', '341126'], ['天长市', '341181'], ['明光市', '341182']],
	    '341200': [['市辖区', '341201'], ['颍州区', '341202'], ['颍东区', '341203'], ['颍泉区', '341204'], ['临泉县', '341221'], ['太和县', '341222'], ['阜南县', '341225'], ['颍上县', '341226'], ['界首市', '341282']],
	    '341300': [['市辖区', '341301'], ['墉桥区', '341302'], ['砀山县', '341321'], ['萧县', '341322'], ['灵璧县', '341323'], ['泗县', '341324']],
	    '341400': [['市辖区', '341401'], ['居巢区', '341402'], ['庐江县', '341421'], ['无为县', '341422'], ['含山县', '341423'], ['和县', '341424']],
	    '341500': [['市辖区', '341501'], ['金安区', '341502'], ['裕安区', '341503'], ['寿县', '341521'], ['霍邱县', '341522'], ['舒城县', '341523'], ['金寨县', '341524'], ['霍山县', '341525']],
	    '341600': [['市辖区', '341601'], ['谯城区', '341602'], ['涡阳县', '341621'], ['蒙城县', '341622'], ['利辛县', '341623']],
	    '341700': [['市辖区', '341701'], ['贵池区', '341702'], ['东至县', '341721'], ['石台县', '341722'], ['青阳县', '341723']],
	    '341800': [['市辖区', '341801'], ['宣州区', '341802'], ['郎溪县', '341821'], ['广德县', '341822'], ['泾县', '341823'], ['绩溪县', '341824'], ['旌德县', '341825'], ['宁国市', '341881']],
	    '350100': [['市辖区', '350101'], ['鼓楼区', '350102'], ['台江区', '350103'], ['仓山区', '350104'], ['马尾区', '350105'], ['晋安区', '350111'], ['闽侯县', '350121'], ['连江县', '350122'], ['罗源县', '350123'], ['闽清县', '350124'], ['永泰县', '350125'], ['平潭县', '350128'], ['福清市', '350181'], ['长乐市', '350182']],
	    '350200': [['市辖区', '350201'], ['思明区', '350203'], ['海沧区', '350205'], ['湖里区', '350206'], ['集美区', '350211'], ['同安区', '350212'], ['翔安区', '350213']],
	    '350300': [['市辖区', '350301'], ['城厢区', '350302'], ['涵江区', '350303'], ['荔城区', '350304'], ['秀屿区', '350305'], ['仙游县', '350322']],
	    '350400': [['市辖区', '350401'], ['梅列区', '350402'], ['三元区', '350403'], ['明溪县', '350421'], ['清流县', '350423'], ['宁化县', '350424'], ['大田县', '350425'], ['尤溪县', '350426'], ['沙县', '350427'], ['将乐县', '350428'], ['泰宁县', '350429'], ['建宁县', '350430'], ['永安市', '350481']],
	    '350500': [['市辖区', '350501'], ['鲤城区', '350502'], ['丰泽区', '350503'], ['洛江区', '350504'], ['泉港区', '350505'], ['惠安县', '350521'], ['安溪县', '350524'], ['永春县', '350525'], ['德化县', '350526'], ['金门县', '350527'], ['石狮市', '350581'], ['晋江市', '350582'], ['南安市', '350583']],
	    '350600': [['市辖区', '350601'], ['芗城区', '350602'], ['龙文区', '350603'], ['云霄县', '350622'], ['漳浦县', '350623'], ['诏安县', '350624'], ['长泰县', '350625'], ['东山县', '350626'], ['南靖县', '350627'], ['平和县', '350628'], ['华安县', '350629'], ['龙海市', '350681']],
	    '350700': [['市辖区', '350701'], ['延平区', '350702'], ['顺昌县', '350721'], ['浦城县', '350722'], ['光泽县', '350723'], ['松溪县', '350724'], ['政和县', '350725'], ['邵武市', '350781'], ['武夷山市', '350782'], ['建瓯市', '350783'], ['建阳市', '350784']],
	    '350800': [['市辖区', '350801'], ['新罗区', '350802'], ['长汀县', '350821'], ['永定县', '350822'], ['上杭县', '350823'], ['武平县', '350824'], ['连城县', '350825'], ['漳平市', '350881']],
	    '350900': [['市辖区', '350901'], ['蕉城区', '350902'], ['霞浦县', '350921'], ['古田县', '350922'], ['屏南县', '350923'], ['寿宁县', '350924'], ['周宁县', '350925'], ['柘荣县', '350926'], ['福安市', '350981'], ['福鼎市', '350982']],
	    '360100': [['市辖区', '360101'], ['东湖区', '360102'], ['西湖区', '360103'], ['青云谱区', '360104'], ['湾里区', '360105'], ['青山湖区', '360111'], ['南昌县', '360121'], ['新建县', '360122'], ['安义县', '360123'], ['进贤县', '360124']],
	    '360200': [['市辖区', '360201'], ['昌江区', '360202'], ['珠山区', '360203'], ['浮梁县', '360222'], ['乐平市', '360281']],
	    '360300': [['市辖区', '360301'], ['安源区', '360302'], ['湘东区', '360313'], ['莲花县', '360321'], ['上栗县', '360322'], ['芦溪县', '360323']],
	    '360400': [['市辖区', '360401'], ['庐山区', '360402'], ['浔阳区', '360403'], ['九江县', '360421'], ['武宁县', '360423'], ['修水县', '360424'], ['永修县', '360425'], ['德安县', '360426'], ['星子县', '360427'], ['都昌县', '360428'], ['湖口县', '360429'], ['彭泽县', '360430'], ['瑞昌市', '360481']],
	    '360500': [['市辖区', '360501'], ['渝水区', '360502'], ['分宜县', '360521']],
	    '360600': [['市辖区', '360601'], ['月湖区', '360602'], ['余江县', '360622'], ['贵溪市', '360681']],
	    '360700': [['市辖区', '360701'], ['章贡区', '360702'], ['赣县', '360721'], ['信丰县', '360722'], ['大余县', '360723'], ['上犹县', '360724'], ['崇义县', '360725'], ['安远县', '360726'], ['龙南县', '360727'], ['定南县', '360728'], ['全南县', '360729'], ['宁都县', '360730'], ['于都县', '360731'], ['兴国县', '360732'], ['会昌县', '360733'], ['寻乌县', '360734'], ['石城县', '360735'], ['瑞金市', '360781'], ['南康市', '360782']],
	    '360800': [['市辖区', '360801'], ['吉州区', '360802'], ['青原区', '360803'], ['吉安县', '360821'], ['吉水县', '360822'], ['峡江县', '360823'], ['新干县', '360824'], ['永丰县', '360825'], ['泰和县', '360826'], ['遂川县', '360827'], ['万安县', '360828'], ['安福县', '360829'], ['永新县', '360830'], ['井冈山市', '360881']],
	    '360900': [['市辖区', '360901'], ['袁州区', '360902'], ['奉新县', '360921'], ['万载县', '360922'], ['上高县', '360923'], ['宜丰县', '360924'], ['靖安县', '360925'], ['铜鼓县', '360926'], ['丰城市', '360981'], ['樟树市', '360982'], ['高安市', '360983']],
	    '361000': [['市辖区', '361001'], ['临川区', '361002'], ['南城县', '361021'], ['黎川县', '361022'], ['南丰县', '361023'], ['崇仁县', '361024'], ['乐安县', '361025'], ['宜黄县', '361026'], ['金溪县', '361027'], ['资溪县', '361028'], ['东乡县', '361029'], ['广昌县', '361030']],
	    '361100': [['市辖区', '361101'], ['信州区', '361102'], ['上饶县', '361121'], ['广丰县', '361122'], ['玉山县', '361123'], ['铅山县', '361124'], ['横峰县', '361125'], ['弋阳县', '361126'], ['余干县', '361127'], ['波阳县', '361128'], ['万年县', '361129'], ['婺源县', '361130'], ['德兴市', '361181']],
	    '370100': [['市辖区', '370101'], ['历下区', '370102'], ['市中区', '370103'], ['槐荫区', '370104'], ['天桥区', '370105'], ['历城区', '370112'], ['长清区', '370113'], ['平阴县', '370124'], ['济阳县', '370125'], ['商河县', '370126'], ['章丘市', '370181']],
	    '370200': [['市辖区', '370201'], ['市南区', '370202'], ['市北区', '370203'], ['四方区', '370205'], ['黄岛区', '370211'], ['崂山区', '370212'], ['李沧区', '370213'], ['城阳区', '370214'], ['胶州市', '370281'], ['即墨市', '370282'], ['平度市', '370283'], ['胶南市', '370284'], ['莱西市', '370285']],
	    '370300': [['市辖区', '370301'], ['淄川区', '370302'], ['张店区', '370303'], ['博山区', '370304'], ['临淄区', '370305'], ['周村区', '370306'], ['桓台县', '370321'], ['高青县', '370322'], ['沂源县', '370323']],
	    '370400': [['市辖区', '370401'], ['市中区', '370402'], ['薛城区', '370403'], ['峄城区', '370404'], ['台儿庄区', '370405'], ['山亭区', '370406'], ['滕州市', '370481']],
	    '370500': [['市辖区', '370501'], ['东营区', '370502'], ['河口区', '370503'], ['垦利县', '370521'], ['利津县', '370522'], ['广饶县', '370523']],
	    '370600': [['市辖区', '370601'], ['芝罘区', '370602'], ['福山区', '370611'], ['牟平区', '370612'], ['莱山区', '370613'], ['长岛县', '370634'], ['龙口市', '370681'], ['莱阳市', '370682'], ['莱州市', '370683'], ['蓬莱市', '370684'], ['招远市', '370685'], ['栖霞市', '370686'], ['海阳市', '370687']],
	    '370700': [['市辖区', '370701'], ['潍城区', '370702'], ['寒亭区', '370703'], ['坊子区', '370704'], ['奎文区', '370705'], ['临朐县', '370724'], ['昌乐县', '370725'], ['青州市', '370781'], ['诸城市', '370782'], ['寿光市', '370783'], ['安丘市', '370784'], ['高密市', '370785'], ['昌邑市', '370786']],
	    '370800': [['市辖区', '370801'], ['市中区', '370802'], ['任城区', '370811'], ['微山县', '370826'], ['鱼台县', '370827'], ['金乡县', '370828'], ['嘉祥县', '370829'], ['汶上县', '370830'], ['泗水县', '370831'], ['梁山县', '370832'], ['曲阜市', '370881'], ['兖州市', '370882'], ['邹城市', '370883']],
	    '370900': [['市辖区', '370901'], ['泰山区', '370902'], ['岱岳区', '370903'], ['宁阳县', '370921'], ['东平县', '370923'], ['新泰市', '370982'], ['肥城市', '370983']],
	    '371000': [['市辖区', '371001'], ['环翠区', '371002'], ['文登市', '371081'], ['荣成市', '371082'], ['乳山市', '371083']],
	    '371100': [['市辖区', '371101'], ['东港区', '371102'], ['五莲县', '371121'], ['莒县', '371122']],
	    '371200': [['市辖区', '371201'], ['莱城区', '371202'], ['钢城区', '371203']],
	    '371300': [['市辖区', '371301'], ['兰山区', '371302'], ['罗庄区', '371311'], ['河东区', '371312'], ['沂南县', '371321'], ['郯城县', '371322'], ['沂水县', '371323'], ['苍山县', '371324'], ['费县', '371325'], ['平邑县', '371326'], ['莒南县', '371327'], ['蒙阴县', '371328'], ['临沭县', '371329']],
	    '371400': [['市辖区', '371401'], ['德城区', '371402'], ['陵县', '371421'], ['宁津县', '371422'], ['庆云县', '371423'], ['临邑县', '371424'], ['齐河县', '371425'], ['平原县', '371426'], ['夏津县', '371427'], ['武城县', '371428'], ['乐陵市', '371481'], ['禹城市', '371482']],
	    '371500': [['市辖区', '371501'], ['东昌府区', '371502'], ['阳谷县', '371521'], ['莘县', '371522'], ['茌平县', '371523'], ['东阿县', '371524'], ['冠县', '371525'], ['高唐县', '371526'], ['临清市', '371581']],
	    '371600': [['市辖区', '371601'], ['滨城区', '371602'], ['惠民县', '371621'], ['阳信县', '371622'], ['无棣县', '371623'], ['沾化县', '371624'], ['博兴县', '371625'], ['邹平县', '371626']],
	    '371700': [['市辖区', '371701'], ['牡丹区', '371702'], ['曹县', '371721'], ['单县', '371722'], ['成武县', '371723'], ['巨野县', '371724'], ['郓城县', '371725'], ['鄄城县', '371726'], ['定陶县', '371727'], ['东明县', '371728']],
	    '410100': [['市辖区', '410101'], ['中原区', '410102'], ['二七区', '410103'], ['管城回族区', '410104'], ['金水区', '410105'], ['上街区', '410106'], ['邙山区', '410108'], ['中牟县', '410122'], ['巩义市', '410181'], ['荥阳市', '410182'], ['新密市', '410183'], ['新郑市', '410184'], ['登封市', '410185']],
	    '410200': [['市辖区', '410201'], ['龙亭区', '410202'], ['顺河回族区', '410203'], ['鼓楼区', '410204'], ['南关区', '410205'], ['郊区', '410211'], ['杞县', '410221'], ['通许县', '410222'], ['尉氏县', '410223'], ['开封县', '410224'], ['兰考县', '410225']],
	    '410300': [['市辖区', '410301'], ['老城区', '410302'], ['西工区', '410303'], ['廛河回族区', '410304'], ['涧西区', '410305'], ['吉利区', '410306'], ['洛龙区', '410307'], ['孟津县', '410322'], ['新安县', '410323'], ['栾川县', '410324'], ['嵩县', '410325'], ['汝阳县', '410326'], ['宜阳县', '410327'], ['洛宁县', '410328'], ['伊川县', '410329'], ['偃师市', '410381']],
	    '410400': [['市辖区', '410401'], ['新华区', '410402'], ['卫东区', '410403'], ['石龙区', '410404'], ['湛河区', '410411'], ['宝丰县', '410421'], ['叶县', '410422'], ['鲁山县', '410423'], ['郏县', '410425'], ['舞钢市', '410481'], ['汝州市', '410482']],
	    '410500': [['市辖区', '410501'], ['文峰区', '410502'], ['北关区', '410503'], ['殷都区', '410505'], ['龙安区', '410506'], ['安阳县', '410522'], ['汤阴县', '410523'], ['滑县', '410526'], ['内黄县', '410527'], ['林州市', '410581']],
	    '410600': [['市辖区', '410601'], ['鹤山区', '410602'], ['山城区', '410603'], ['淇滨区', '410611'], ['浚县', '410621'], ['淇县', '410622']],
	    '410700': [['市辖区', '410701'], ['红旗区', '410702'], ['新华区', '410703'], ['北站区', '410704'], ['郊区', '410711'], ['新乡县', '410721'], ['获嘉县', '410724'], ['原阳县', '410725'], ['延津县', '410726'], ['封丘县', '410727'], ['长垣县', '410728'], ['卫辉市', '410781'], ['辉县市', '410782']],
	    '410800': [['市辖区', '410801'], ['解放区', '410802'], ['中站区', '410803'], ['马村区', '410804'], ['山阳区', '410811'], ['修武县', '410821'], ['博爱县', '410822'], ['武陟县', '410823'], ['温县', '410825'], ['济源市', '410881'], ['沁阳市', '410882'], ['孟州市', '410883']],
	    '410900': [['市辖区', '410901'], ['华龙区', '410902'], ['清丰县', '410922'], ['南乐县', '410923'], ['范县', '410926'], ['台前县', '410927'], ['濮阳县', '410928']],
	    '411000': [['市辖区', '411001'], ['魏都区', '411002'], ['许昌县', '411023'], ['鄢陵县', '411024'], ['襄城县', '411025'], ['禹州市', '411081'], ['长葛市', '411082']],
	    '411100': [['市辖区', '411101'], ['源汇区', '411102'], ['舞阳县', '411121'], ['临颍县', '411122'], ['郾城县', '411123']],
	    '411200': [['市辖区', '411201'], ['湖滨区', '411202'], ['渑池县', '411221'], ['陕县', '411222'], ['卢氏县', '411224'], ['义马市', '411281'], ['灵宝市', '411282']],
	    '411300': [['市辖区', '411301'], ['宛城区', '411302'], ['卧龙区', '411303'], ['南召县', '411321'], ['方城县', '411322'], ['西峡县', '411323'], ['镇平县', '411324'], ['内乡县', '411325'], ['淅川县', '411326'], ['社旗县', '411327'], ['唐河县', '411328'], ['新野县', '411329'], ['桐柏县', '411330'], ['邓州市', '411381']],
	    '411400': [['市辖区', '411401'], ['梁园区', '411402'], ['睢阳区', '411403'], ['民权县', '411421'], ['睢县', '411422'], ['宁陵县', '411423'], ['柘城县', '411424'], ['虞城县', '411425'], ['夏邑县', '411426'], ['永城市', '411481']],
	    '411500': [['市辖区', '411501'], ['师河区', '411502'], ['平桥区', '411503'], ['罗山县', '411521'], ['光山县', '411522'], ['新县', '411523'], ['商城县', '411524'], ['固始县', '411525'], ['潢川县', '411526'], ['淮滨县', '411527'], ['息县', '411528']],
	    '411600': [['市辖区', '411601'], ['川汇区', '411602'], ['扶沟县', '411621'], ['西华县', '411622'], ['商水县', '411623'], ['沈丘县', '411624'], ['郸城县', '411625'], ['淮阳县', '411626'], ['太康县', '411627'], ['鹿邑县', '411628'], ['项城市', '411681']],
	    '411700': [['市辖区', '411701'], ['驿城区', '411702'], ['西平县', '411721'], ['上蔡县', '411722'], ['平舆县', '411723'], ['正阳县', '411724'], ['确山县', '411725'], ['泌阳县', '411726'], ['汝南县', '411727'], ['遂平县', '411728'], ['新蔡县', '411729']],
	    '420100': [['市辖区', '420101'], ['江岸区', '420102'], ['江汉区', '420103'], ['乔口区', '420104'], ['汉阳区', '420105'], ['武昌区', '420106'], ['青山区', '420107'], ['洪山区', '420111'], ['东西湖区', '420112'], ['汉南区', '420113'], ['蔡甸区', '420114'], ['江夏区', '420115'], ['黄陂区', '420116'], ['新洲区', '420117']],
	    '420200': [['市辖区', '420201'], ['黄石港区', '420202'], ['西塞山区', '420203'], ['下陆区', '420204'], ['铁山区', '420205'], ['阳新县', '420222'], ['大冶市', '420281']],
	    '420300': [['市辖区', '420301'], ['茅箭区', '420302'], ['张湾区', '420303'], ['郧县', '420321'], ['郧西县', '420322'], ['竹山县', '420323'], ['竹溪县', '420324'], ['房县', '420325'], ['丹江口市', '420381']],
	    '420500': [['市辖区', '420501'], ['西陵区', '420502'], ['伍家岗区', '420503'], ['点军区', '420504'], ['虎亭区', '420505'], ['夷陵区', '420506'], ['远安县', '420525'], ['兴山县', '420526'], ['秭归县', '420527'], ['长阳土家族自治县', '420528'], ['五峰土家族自治县', '420529'], ['宜都市', '420581'], ['当阳市', '420582'], ['枝江市', '420583']],
	    '420600': [['市辖区', '420601'], ['襄城区', '420602'], ['樊城区', '420606'], ['襄阳区', '420607'], ['南漳县', '420624'], ['谷城县', '420625'], ['保康县', '420626'], ['老河口市', '420682'], ['枣阳市', '420683'], ['宜城市', '420684']],
	    '420700': [['市辖区', '420701'], ['梁子湖区', '420702'], ['华容区', '420703'], ['鄂城区', '420704']],
	    '420800': [['市辖区', '420801'], ['东宝区', '420802'], ['掇刀区', '420804'], ['京山县', '420821'], ['沙洋县', '420822'], ['钟祥市', '420881']],
	    '420900': [['市辖区', '420901'], ['孝南区', '420902'], ['孝昌县', '420921'], ['大悟县', '420922'], ['云梦县', '420923'], ['应城市', '420981'], ['安陆市', '420982'], ['汉川市', '420984']],
	    '421000': [['市辖区', '421001'], ['沙市区', '421002'], ['荆州区', '421003'], ['公安县', '421022'], ['监利县', '421023'], ['江陵县', '421024'], ['石首市', '421081'], ['洪湖市', '421083'], ['松滋市', '421087']],
	    '421100': [['市辖区', '421101'], ['黄州区', '421102'], ['团风县', '421121'], ['红安县', '421122'], ['罗田县', '421123'], ['英山县', '421124'], ['浠水县', '421125'], ['蕲春县', '421126'], ['黄梅县', '421127'], ['麻城市', '421181'], ['武穴市', '421182']],
	    '421200': [['市辖区', '421201'], ['咸安区', '421202'], ['嘉鱼县', '421221'], ['通城县', '421222'], ['崇阳县', '421223'], ['通山县', '421224'], ['赤壁市', '421281']],
	    '421300': [['市辖区', '421301'], ['曾都区', '421302'], ['广水市', '421381']],
	    '422800': [['恩施市', '422801'], ['利川市', '422802'], ['建始县', '422822'], ['巴东县', '422823'], ['宣恩县', '422825'], ['咸丰县', '422826'], ['来凤县', '422827'], ['鹤峰县', '422828']],
	    '429000': [['仙桃市', '429004'], ['潜江市', '429005'], ['天门市', '429006'], ['神农架林区', '429021']],
	    '310100': [['市辖区', '310100'], ['黄浦区', '310101'], ['徐汇区', '310104'], ['长宁区', '310105'], ['静安区', '310106'], ['普陀区', '310107'], ['闸北区', '310108'], ['虹口区', '310109'], ['杨浦区', '310110'], ['闵行区', '310112'], ['宝山区', '310113'], ['嘉定区', '310114'], ['浦东新区', '310115'], ['金山区', '310116'], ['松江区', '310117'], ['青浦区', '310118'], ['奉贤区', '310120']],
	    '310200': [['县', '310200'], ['崇明县', '310230']],
	    '320100': [['市辖区', '320101'], ['玄武区', '320102'], ['白下区', '320103'], ['秦淮区', '320104'], ['建邺区', '320105'], ['鼓楼区', '320106'], ['下关区', '320107'], ['浦口区', '320111'], ['栖霞区', '320113'], ['雨花台区', '320114'], ['江宁区', '320115'], ['六合区', '320116'], ['溧水县', '320124'], ['高淳县', '320125']],
	    '320200': [['市辖区', '320201'], ['崇安区', '320202'], ['南长区', '320203'], ['北塘区', '320204'], ['锡山区', '320205'], ['惠山区', '320206'], ['滨湖区', '320211'], ['江阴市', '320281'], ['宜兴市', '320282']],
	    '320300': [['市辖区', '320301'], ['鼓楼区', '320302'], ['云龙区', '320303'], ['九里区', '320304'], ['贾汪区', '320305'], ['泉山区', '320311'], ['丰县', '320321'], ['沛县', '320322'], ['铜山县', '320323'], ['睢宁县', '320324'], ['新沂市', '320381'], ['邳州市', '320382']],
	    '320400': [['市辖区', '320401'], ['天宁区', '320402'], ['钟楼区', '320404'], ['戚墅堰区', '320405'], ['新北区', '320411'], ['武进区', '320412'], ['溧阳市', '320481'], ['金坛市', '320482']],
	    '320500': [['市辖区', '320501'], ['沧浪区', '320502'], ['平江区', '320503'], ['金阊区', '320504'], ['虎丘区', '320505'], ['吴中区', '320506'], ['相城区', '320507'], ['常熟市', '320581'], ['张家港市', '320582'], ['昆山市', '320583'], ['吴江市', '320584'], ['太仓市', '320585']],
	    '320600': [['市辖区', '320601'], ['崇川区', '320602'], ['港闸区', '320611'], ['海安县', '320621'], ['如东县', '320623'], ['启东市', '320681'], ['如皋市', '320682'], ['通州市', '320683'], ['海门市', '320684']],
	    '320700': [['市辖区', '320701'], ['连云区', '320703'], ['新浦区', '320705'], ['海州区', '320706'], ['赣榆县', '320721'], ['东海县', '320722'], ['灌云县', '320723'], ['灌南县', '320724']],
	    '320800': [['市辖区', '320801'], ['清河区', '320802'], ['楚州区', '320803'], ['淮阴区', '320804'], ['清浦区', '320811'], ['涟水县', '320826'], ['洪泽县', '320829'], ['盱眙县', '320830'], ['金湖县', '320831']],
	    '320900': [['市辖区', '320901'], ['城区', '320902'], ['响水县', '320921'], ['滨海县', '320922'], ['阜宁县', '320923'], ['射阳县', '320924'], ['建湖县', '320925'], ['盐都县', '320928'], ['东台市', '320981'], ['大丰市', '320982']],
	    '321000': [['市辖区', '321001'], ['广陵区', '321002'], ['邗江区', '321003'], ['郊区', '321011'], ['宝应县', '321023'], ['仪征市', '321081'], ['高邮市', '321084'], ['江都市', '321088']],
	    '321100': [['市辖区', '321101'], ['京口区', '321102'], ['润州区', '321111'], ['丹徒区', '321112'], ['丹阳市', '321181'], ['扬中市', '321182'], ['句容市', '321183']],
	    '321200': [['市辖区', '321201'], ['海陵区', '321202'], ['高港区', '321203'], ['兴化市', '321281'], ['靖江市', '321282'], ['泰兴市', '321283'], ['姜堰市', '321284']],
	    '321300': [['市辖区', '321301'], ['宿城区', '321302'], ['宿豫县', '321321'], ['沭阳县', '321322'], ['泗阳县', '321323'], ['泗洪县', '321324']],
	    '330100': [['市辖区', '330101'], ['上城区', '330102'], ['下城区', '330103'], ['江干区', '330104'], ['拱墅区', '330105'], ['西湖区', '330106'], ['滨江区', '330108'], ['萧山区', '330109'], ['余杭区', '330110'], ['桐庐县', '330122'], ['淳安县', '330127'], ['建德市', '330182'], ['富阳市', '330183'], ['临安市', '330185']],
	    '330200': [['市辖区', '330201'], ['海曙区', '330203'], ['江东区', '330204'], ['江北区', '330205'], ['北仑区', '330206'], ['镇海区', '330211'], ['鄞州区', '330212'], ['象山县', '330225'], ['宁海县', '330226'], ['余姚市', '330281'], ['慈溪市', '330282'], ['奉化市', '330283']],
	    '330300': [['市辖区', '330301'], ['鹿城区', '330302'], ['龙湾区', '330303'], ['瓯海区', '330304'], ['洞头县', '330322'], ['永嘉县', '330324'], ['平阳县', '330326'], ['苍南县', '330327'], ['文成县', '330328'], ['泰顺县', '330329'], ['瑞安市', '330381'], ['乐清市', '330382']],
	    '330400': [['市辖区', '330401'], ['秀城区', '330402'], ['秀洲区', '330411'], ['嘉善县', '330421'], ['海盐县', '330424'], ['海宁市', '330481'], ['平湖市', '330482'], ['桐乡市', '330483']],
	    '330500': [['市辖区', '330501'], ['吴兴区', '330502'], ['南浔区', '330503'], ['德清县', '330521'], ['长兴县', '330522'], ['安吉县', '330523']],
	    '330600': [['市辖区', '330601'], ['越城区', '330602'], ['绍兴县', '330621'], ['新昌县', '330624'], ['诸暨市', '330681'], ['上虞市', '330682'], ['嵊州市', '330683']],
	    '330700': [['市辖区', '330701'], ['婺城区', '330702'], ['金东区', '330703'], ['武义县', '330723'], ['浦江县', '330726'], ['磐安县', '330727'], ['兰溪市', '330781'], ['义乌市', '330782'], ['东阳市', '330783'], ['永康市', '330784']],
	    '330800': [['市辖区', '330801'], ['柯城区', '330802'], ['衢江区', '330803'], ['常山县', '330822'], ['开化县', '330824'], ['龙游县', '330825'], ['江山市', '330881']],
	    '330900': [['市辖区', '330901'], ['定海区', '330902'], ['普陀区', '330903'], ['岱山县', '330921'], ['嵊泗县', '330922']],
	    '331000': [['市辖区', '331001'], ['椒江区', '331002'], ['黄岩区', '331003'], ['路桥区', '331004'], ['玉环县', '331021'], ['三门县', '331022'], ['天台县', '331023'], ['仙居县', '331024'], ['温岭市', '331081'], ['临海市', '331082']],
	    '331100': [['市辖区', '331101'], ['莲都区', '331102'], ['青田县', '331121'], ['缙云县', '331122'], ['遂昌县', '331123'], ['松阳县', '331124'], ['云和县', '331125'], ['庆元县', '331126'], ['景宁畲族自治县', '331127'], ['龙泉市', '331181']],
	    '110100': [['市辖区', '110100'], ['东城区', '110101'], ['西城区', '110102'], ['崇文区', '110103'], ['宣武区', '110104'], ['朝阳区', '110105'], ['丰台区', '110106'], ['石景山区', '110107'], ['海淀区', '110108'], ['门头沟区', '110109'], ['房山区', '110111'], ['通州区', '110112'], ['顺义区', '110113'], ['昌平区', '110114'], ['大兴区', '110115'], ['怀柔区', '110116'], ['平谷区', '110117']],
	    '110200': [['县', '110200'], ['密云县', '110228'], ['延庆县', '110229']],
	    '120100': [['市辖区', '120100'], ['和平区', '120101'], ['河东区', '120102'], ['河西区', '120103'], ['南开区', '120104'], ['河北区', '120105'], ['红桥区', '120106'], ['塘沽区', '120107'], ['汉沽区', '120108'], ['大港区', '120109'], ['东丽区', '120110'], ['西青区', '120111'], ['津南区', '120112'], ['北辰区', '120113'], ['武清区', '120114'], ['宝坻区', '120115']],
	    '120200': [['县', '120200'], ['宁河县', '120221'], ['静海县', '120223'], ['蓟县', '120225']],
	    '130100': [['市辖区', '130101'], ['长安区', '130102'], ['桥东区', '130103'], ['桥西区', '130104'], ['新华区', '130105'], ['井陉矿区', '130107'], ['裕华区', '130108'], ['井陉县', '130121'], ['正定县', '130123'], ['栾城县', '130124'], ['行唐县', '130125'], ['灵寿县', '130126'], ['高邑县', '130127'], ['深泽县', '130128'], ['赞皇县', '130129'], ['无极县', '130130'], ['平山县', '130131'], ['元氏县', '130132'], ['赵县', '130133'], ['辛集市', '130181'], ['藁城市', '130182'], ['晋州市', '130183'], ['新乐市', '130184'], ['鹿泉市', '130185']],
	    '130200': [['市辖区', '130201'], ['路南区', '130202'], ['路北区', '130203'], ['古冶区', '130204'], ['开平区', '130205'], ['丰南区', '130207'], ['丰润区', '130208'], ['滦县', '130223'], ['滦南县', '130224'], ['乐亭县', '130225'], ['迁西县', '130227'], ['玉田县', '130229'], ['唐海县', '130230'], ['遵化市', '130281'], ['迁安市', '130283']],
	    '130300': [['市辖区', '130301'], ['海港区', '130302'], ['山海关区', '130303'], ['北戴河区', '130304'], ['青龙满族自治县', '130321'], ['昌黎县', '130322'], ['抚宁县', '130323'], ['卢龙县', '130324']],
	    '130400': [['市辖区', '130401'], ['邯山区', '130402'], ['丛台区', '130403'], ['复兴区', '130404'], ['峰峰矿区', '130406'], ['邯郸县', '130421'], ['临漳县', '130423'], ['成安县', '130424'], ['大名县', '130425'], ['涉县', '130426'], ['磁县', '130427'], ['肥乡县', '130428'], ['永年县', '130429'], ['邱县', '130430'], ['鸡泽县', '130431'], ['广平县', '130432'], ['馆陶县', '130433'], ['魏县', '130434'], ['曲周县', '130435'], ['武安市', '130481']],
	    '130500': [['市辖区', '130501'], ['桥东区', '130502'], ['桥西区', '130503'], ['邢台县', '130521'], ['临城县', '130522'], ['内丘县', '130523'], ['柏乡县', '130524'], ['隆尧县', '130525'], ['任县', '130526'], ['南和县', '130527'], ['宁晋县', '130528'], ['巨鹿县', '130529'], ['新河县', '130530'], ['广宗县', '130531'], ['平乡县', '130532'], ['威县', '130533'], ['清河县', '130534'], ['临西县', '130535'], ['南宫市', '130581'], ['沙河市', '130582']],
	    '130600': [['市辖区', '130601'], ['新市区', '130602'], ['北市区', '130603'], ['南市区', '130604'], ['满城县', '130621'], ['清苑县', '130622'], ['涞水县', '130623'], ['阜平县', '130624'], ['徐水县', '130625'], ['定兴县', '130626'], ['唐县', '130627'], ['高阳县', '130628'], ['容城县', '130629'], ['涞源县', '130630'], ['望都县', '130631'], ['安新县', '130632'], ['易县', '130633'], ['曲阳县', '130634'], ['蠡县', '130635'], ['顺平县', '130636'], ['博野县', '130637'], ['雄县', '130638'], ['涿州市', '130681'], ['定州市', '130682'], ['安国市', '130683'], ['高碑店市', '130684']],
	    '130700': [['市辖区', '130701'], ['桥东区', '130702'], ['桥西区', '130703'], ['宣化区', '130705'], ['下花园区', '130706'], ['宣化县', '130721'], ['张北县', '130722'], ['康保县', '130723'], ['沽源县', '130724'], ['尚义县', '130725'], ['蔚县', '130726'], ['阳原县', '130727'], ['怀安县', '130728'], ['万全县', '130729'], ['怀来县', '130730'], ['涿鹿县', '130731'], ['赤城县', '130732'], ['崇礼县', '130733']],
	    '130800': [['市辖区', '130801'], ['双桥区', '130802'], ['双滦区', '130803'], ['鹰手营子矿区', '130804'], ['承德县', '130821'], ['兴隆县', '130822'], ['平泉县', '130823'], ['滦平县', '130824'], ['隆化县', '130825'], ['丰宁满族自治县', '130826'], ['宽城满族自治县', '130827'], ['围场满族蒙古族自治县', '130828']],
	    '130900': [['市辖区', '130901'], ['新华区', '130902'], ['运河区', '130903'], ['沧县', '130921'], ['青县', '130922'], ['东光县', '130923'], ['海兴县', '130924'], ['盐山县', '130925'], ['肃宁县', '130926'], ['南皮县', '130927'], ['吴桥县', '130928'], ['献县', '130929'], ['孟村回族自治县', '130930'], ['泊头市', '130981'], ['任丘市', '130982'], ['黄骅市', '130983'], ['河间市', '130984']],
	    '131000': [['市辖区', '131001'], ['安次区', '131002'], ['广阳区', '131003'], ['固安县', '131022'], ['永清县', '131023'], ['香河县', '131024'], ['大城县', '131025'], ['文安县', '131026'], ['大厂回族自治县', '131028'], ['霸州市', '131081'], ['三河市', '131082']],
	    '131100': [['市辖区', '131101'], ['桃城区', '131102'], ['枣强县', '131121'], ['武邑县', '131122'], ['武强县', '131123'], ['饶阳县', '131124'], ['安平县', '131125'], ['故城县', '131126'], ['景县', '131127'], ['阜城县', '131128'], ['冀州市', '131181'], ['深州市', '131182']],
	    '140100': [['市辖区', '140101'], ['小店区', '140105'], ['迎泽区', '140106'], ['杏花岭区', '140107'], ['尖草坪区', '140108'], ['万柏林区', '140109'], ['晋源区', '140110'], ['清徐县', '140121'], ['阳曲县', '140122'], ['娄烦县', '140123'], ['古交市', '140181']],
	    '140200': [['市辖区', '140201'], ['城区', '140202'], ['矿区', '140203'], ['南郊区', '140211'], ['新荣区', '140212'], ['阳高县', '140221'], ['天镇县', '140222'], ['广灵县', '140223'], ['灵丘县', '140224'], ['浑源县', '140225'], ['左云县', '140226'], ['大同县', '140227']],
	    '140300': [['市辖区', '140301'], ['城区', '140302'], ['矿区', '140303'], ['郊区', '140311'], ['平定县', '140321'], ['盂县', '140322']],
	    '140400': [['市辖区', '140401'], ['城区', '140402'], ['郊区', '140411'], ['长治县', '140421'], ['襄垣县', '140423'], ['屯留县', '140424'], ['平顺县', '140425'], ['黎城县', '140426'], ['壶关县', '140427'], ['长子县', '140428'], ['武乡县', '140429'], ['沁县', '140430'], ['沁源县', '140431'], ['潞城市', '140481']],
	    '140500': [['市辖区', '140501'], ['城区', '140502'], ['沁水县', '140521'], ['阳城县', '140522'], ['陵川县', '140524'], ['泽州县', '140525'], ['高平市', '140581']],
	    '140600': [['市辖区', '140601'], ['朔城区', '140602'], ['平鲁区', '140603'], ['山阴县', '140621'], ['应县', '140622'], ['右玉县', '140623'], ['怀仁县', '140624']],
	    '140700': [['市辖区', '140701'], ['榆次区', '140702'], ['榆社县', '140721'], ['左权县', '140722'], ['和顺县', '140723'], ['昔阳县', '140724'], ['寿阳县', '140725'], ['太谷县', '140726'], ['祁县', '140727'], ['平遥县', '140728'], ['灵石县', '140729'], ['介休市', '140781']],
	    '140800': [['市辖区', '140801'], ['盐湖区', '140802'], ['临猗县', '140821'], ['万荣县', '140822'], ['闻喜县', '140823'], ['稷山县', '140824'], ['新绛县', '140825'], ['绛县', '140826'], ['垣曲县', '140827'], ['夏县', '140828'], ['平陆县', '140829'], ['芮城县', '140830'], ['永济市', '140881'], ['河津市', '140882']],
	    '140900': [['市辖区', '140901'], ['忻府区', '140902'], ['定襄县', '140921'], ['五台县', '140922'], ['代县', '140923'], ['繁峙县', '140924'], ['宁武县', '140925'], ['静乐县', '140926'], ['神池县', '140927'], ['五寨县', '140928'], ['岢岚县', '140929'], ['河曲县', '140930'], ['保德县', '140931'], ['偏关县', '140932'], ['原平市', '140981']],
	    '141000': [['市辖区', '141001'], ['尧都区', '141002'], ['曲沃县', '141021'], ['翼城县', '141022'], ['襄汾县', '141023'], ['洪洞县', '141024'], ['古县', '141025'], ['安泽县', '141026'], ['浮山县', '141027'], ['吉县', '141028'], ['乡宁县', '141029'], ['大宁县', '141030'], ['隰县', '141031'], ['永和县', '141032'], ['蒲县', '141033'], ['汾西县', '141034'], ['侯马市', '141081'], ['霍州市', '141082']],
	    '142300': [['孝义市', '142301'], ['离石市', '142302'], ['汾阳市', '142303'], ['文水县', '142322'], ['交城县', '142323'], ['兴县', '142325'], ['临县', '142326'], ['柳林县', '142327'], ['石楼县', '142328'], ['岚县', '142329'], ['方山县', '142330'], ['中阳县', '142332'], ['交口县', '142333']],
	    '150100': [['市辖区', '150101'], ['新城区', '150102'], ['回民区', '150103'], ['玉泉区', '150104'], ['赛罕区', '150105'], ['土默特左旗', '150121'], ['托克托县', '150122'], ['和林格尔县', '150123'], ['清水河县', '150124'], ['武川县', '150125']],
	    '150200': [['市辖区', '150201'], ['东河区', '150202'], ['昆都仑区', '150203'], ['青山区', '150204'], ['石拐区', '150205'], ['白云矿区', '150206'], ['九原区', '150207'], ['土默特右旗', '150221'], ['固阳县', '150222'], ['达尔罕茂明安联合旗', '150223']],
	    '150300': [['市辖区', '150301'], ['海勃湾区', '150302'], ['海南区', '150303'], ['乌达区', '150304']],
	    '150400': [['市辖区', '150401'], ['红山区', '150402'], ['元宝山区', '150403'], ['松山区', '150404'], ['阿鲁科尔沁旗', '150421'], ['巴林左旗', '150422'], ['巴林右旗', '150423'], ['林西县', '150424'], ['克什克腾旗', '150425'], ['翁牛特旗', '150426'], ['喀喇沁旗', '150428'], ['宁城县', '150429'], ['敖汉旗', '150430']],
	    '150500': [['市辖区', '150501'], ['科尔沁区', '150502'], ['科尔沁左翼中旗', '150521'], ['科尔沁左翼后旗', '150522'], ['开鲁县', '150523'], ['库伦旗', '150524'], ['奈曼旗', '150525'], ['扎鲁特旗', '150526'], ['霍林郭勒市', '150581']],
	    '150600': [['东胜区', '150602'], ['达拉特旗', '150621'], ['准格尔旗', '150622'], ['鄂托克前旗', '150623'], ['鄂托克旗', '150624'], ['杭锦旗', '150625'], ['乌审旗', '150626'], ['伊金霍洛旗', '150627']],
	    '150700': [['市辖区', '150701'], ['海拉尔区', '150702'], ['阿荣旗', '150721'], ['莫力达瓦达斡尔族自治旗', '150722'], ['鄂伦春自治旗', '150723'], ['鄂温克族自治旗', '150724'], ['陈巴尔虎旗', '150725'], ['新巴尔虎左旗', '150726'], ['新巴尔虎右旗', '150727'], ['满洲里市', '150781'], ['牙克石市', '150782'], ['扎兰屯市', '150783'], ['额尔古纳市', '150784'], ['根河市', '150785']],
	    '152200': [['乌兰浩特市', '152201'], ['阿尔山市', '152202'], ['科尔沁右翼前旗', '152221'], ['科尔沁右翼中旗', '152222'], ['扎赉特旗', '152223'], ['突泉县', '152224']],
	    '152500': [['二连浩特市', '152501'], ['锡林浩特市', '152502'], ['阿巴嘎旗', '152522'], ['苏尼特左旗', '152523'], ['苏尼特右旗', '152524'], ['东乌珠穆沁旗', '152525'], ['西乌珠穆沁旗', '152526'], ['太仆寺旗', '152527'], ['镶黄旗', '152528'], ['正镶白旗', '152529'], ['正蓝旗', '152530'], ['多伦县', '152531']],
	    '152600': [['集宁市', '152601'], ['丰镇市', '152602'], ['卓资县', '152624'], ['化德县', '152625'], ['商都县', '152626'], ['兴和县', '152627'], ['凉城县', '152629'], ['察哈尔右翼前旗', '152630'], ['察哈尔右翼中旗', '152631'], ['察哈尔右翼后旗', '152632'], ['四子王旗', '152634']],
	    '152800': [['临河市', '152801'], ['五原县', '152822'], ['磴口县', '152823'], ['乌拉特前旗', '152824'], ['乌拉特中旗', '152825'], ['乌拉特后旗', '152826'], ['杭锦后旗', '152827']],
	    '152900': [['阿拉善左旗', '152921'], ['阿拉善右旗', '152922'], ['额济纳旗', '152923']],
	    '520100': [['市辖区', '520101'], ['南明区', '520102'], ['云岩区', '520103'], ['花溪区', '520111'], ['乌当区', '520112'], ['白云区', '520113'], ['小河区', '520114'], ['开阳县', '520121'], ['息烽县', '520122'], ['修文县', '520123'], ['清镇市', '520181']],
	    '520200': [['钟山区', '520201'], ['六枝特区', '520203'], ['水城县', '520221'], ['盘县', '520222']],
	    '520300': [['市辖区', '520301'], ['红花岗区', '520302'], ['遵义县', '520321'], ['桐梓县', '520322'], ['绥阳县', '520323'], ['正安县', '520324'], ['道真仡佬族苗族自治县', '520325'], ['务川仡佬族苗族自治县', '520326'], ['凤冈县', '520327'], ['湄潭县', '520328'], ['余庆县', '520329'], ['习水县', '520330'], ['赤水市', '520381'], ['仁怀市', '520382']],
	    '520400': [['市辖区', '520401'], ['西秀区', '520402'], ['平坝县', '520421'], ['普定县', '520422'], ['镇宁布依族苗族自治县', '520423'], ['关岭布依族苗族自治县', '520424'], ['紫云苗族布依族自治县', '520425']],
	    '522200': [['铜仁市', '522201'], ['江口县', '522222'], ['玉屏侗族自治县', '522223'], ['石阡县', '522224'], ['思南县', '522225'], ['印江土家族苗族自治县', '522226'], ['德江县', '522227'], ['沿河土家族自治县', '522228'], ['松桃苗族自治县', '522229'], ['万山特区', '522230']],
	    '522300': [['兴义市', '522301'], ['兴仁县', '522322'], ['普安县', '522323'], ['晴隆县', '522324'], ['贞丰县', '522325'], ['望谟县', '522326'], ['册亨县', '522327'], ['安龙县', '522328']],
	    '522400': [['毕节市', '522401'], ['大方县', '522422'], ['黔西县', '522423'], ['金沙县', '522424'], ['织金县', '522425'], ['纳雍县', '522426'], ['威宁彝族回族苗族自治县', '522427'], ['赫章县', '522428']],
	    '522600': [['凯里市', '522601'], ['黄平县', '522622'], ['施秉县', '522623'], ['三穗县', '522624'], ['镇远县', '522625'], ['岑巩县', '522626'], ['天柱县', '522627'], ['锦屏县', '522628'], ['剑河县', '522629'], ['台江县', '522630'], ['黎平县', '522631'], ['榕江县', '522632'], ['从江县', '522633'], ['雷山县', '522634'], ['麻江县', '522635'], ['丹寨县', '522636']],
	    '522700': [['都匀市', '522701'], ['福泉市', '522702'], ['荔波县', '522722'], ['贵定县', '522723'], ['瓮安县', '522725'], ['独山县', '522726'], ['平塘县', '522727'], ['罗甸县', '522728'], ['长顺县', '522729'], ['龙里县', '522730'], ['惠水县', '522731'], ['三都水族自治县', '522732']],
	    '530100': [['市辖区', '530101'], ['五华区', '530102'], ['盘龙区', '530103'], ['官渡区', '530111'], ['西山区', '530112'], ['东川区', '530113'], ['呈贡县', '530121'], ['晋宁县', '530122'], ['富民县', '530124'], ['宜良县', '530125'], ['石林彝族自治县', '530126'], ['嵩明县', '530127'], ['禄劝彝族苗族自治县', '530128'], ['寻甸回族彝族自治县', '530129'], ['安宁市', '530181']],
	    '530300': [['市辖区', '530301'], ['麒麟区', '530302'], ['马龙县', '530321'], ['陆良县', '530322'], ['师宗县', '530323'], ['罗平县', '530324'], ['富源县', '530325'], ['会泽县', '530326'], ['沾益县', '530328'], ['宣威市', '530381']],
	    '530400': [['市辖区', '530401'], ['红塔区', '530402'], ['江川县', '530421'], ['澄江县', '530422'], ['通海县', '530423'], ['华宁县', '530424'], ['易门县', '530425'], ['峨山彝族自治县', '530426'], ['新平彝族傣族自治县', '530427'], ['元江哈尼族彝族傣族自治县', '530428']],
	    '530500': [['市辖区', '530501'], ['隆阳区', '530502'], ['施甸县', '530521'], ['腾冲县', '530522'], ['龙陵县', '530523'], ['昌宁县', '530524']],
	    '530600': [['市辖区', '530601'], ['昭阳区', '530602'], ['鲁甸县', '530621'], ['巧家县', '530622'], ['盐津县', '530623'], ['大关县', '530624'], ['永善县', '530625'], ['绥江县', '530626'], ['镇雄县', '530627'], ['彝良县', '530628'], ['威信县', '530629'], ['水富县', '530630']],
	    '530700': [['市辖区', '530701'], ['古城区', '530702'], ['玉龙纳西族自治县', '530721'], ['永胜县', '530722'], ['华坪县', '530723'], ['宁蒗彝族自治县', '530724']],
	    '532300': [['楚雄市', '532301'], ['双柏县', '532322'], ['牟定县', '532323'], ['南华县', '532324'], ['姚安县', '532325'], ['大姚县', '532326'], ['永仁县', '532327'], ['元谋县', '532328'], ['武定县', '532329'], ['禄丰县', '532331']],
	    '532500': [['个旧市', '532501'], ['开远市', '532502'], ['蒙自县', '532522'], ['屏边苗族自治县', '532523'], ['建水县', '532524'], ['石屏县', '532525'], ['弥勒县', '532526'], ['泸西县', '532527'], ['元阳县', '532528'], ['红河县', '532529'], ['金平苗族瑶族傣族自治县', '532530'], ['绿春县', '532531'], ['河口瑶族自治县', '532532']],
	    '532600': [['文山县', '532621'], ['砚山县', '532622'], ['西畴县', '532623'], ['麻栗坡县', '532624'], ['马关县', '532625'], ['丘北县', '532626'], ['广南县', '532627'], ['富宁县', '532628']],
	    '532700': [['思茅市', '532701'], ['普洱哈尼族彝族自治县', '532722'], ['墨江哈尼族自治县', '532723'], ['景东彝族自治县', '532724'], ['景谷傣族彝族自治县', '532725'], ['镇沅彝族哈尼族拉祜族自治县', '532726'], ['江城哈尼族彝族自治县', '532727'], ['孟连傣族拉祜族佤族自治县', '532728'], ['澜沧拉祜族自治县', '532729'], ['西盟佤族自治县', '532730']],
	    '532800': [['景洪市', '532801'], ['勐海县', '532822'], ['勐腊县', '532823']],
	    '532900': [['大理市', '532901'], ['漾濞彝族自治县', '532922'], ['祥云县', '532923'], ['宾川县', '532924'], ['弥渡县', '532925'], ['南涧彝族自治县', '532926'], ['巍山彝族回族自治县', '532927'], ['永平县', '532928'], ['云龙县', '532929'], ['洱源县', '532930'], ['剑川县', '532931'], ['鹤庆县', '532932']],
	    '533100': [['瑞丽市', '533102'], ['潞西市', '533103'], ['梁河县', '533122'], ['盈江县', '533123'], ['陇川县', '533124']],
	    '533300': [['泸水县', '533321'], ['福贡县', '533323'], ['贡山独龙族怒族自治县', '533324'], ['兰坪白族普米族自治县', '533325']],
	    '533400': [['香格里拉县', '533421'], ['德钦县', '533422'], ['维西傈僳族自治县', '533423']],
	    '533500': [['临沧县', '533521'], ['凤庆县', '533522'], ['云县', '533523'], ['永德县', '533524'], ['镇康县', '533525'], ['双江拉祜族佤族布朗族傣族自治县', '533526'], ['耿马傣族佤族自治县', '533527'], ['沧源佤族自治县', '533528']],
	    '540100': [['市辖区', '540101'], ['城关区', '540102'], ['林周县', '540121'], ['当雄县', '540122'], ['尼木县', '540123'], ['曲水县', '540124'], ['堆龙德庆县', '540125'], ['达孜县', '540126'], ['墨竹工卡县', '540127']],
	    '542100': [['昌都县', '542121'], ['江达县', '542122'], ['贡觉县', '542123'], ['类乌齐县', '542124'], ['丁青县', '542125'], ['察雅县', '542126'], ['八宿县', '542127'], ['左贡县', '542128'], ['芒康县', '542129'], ['洛隆县', '542132'], ['边坝县', '542133']],
	    '542200': [['乃东县', '542221'], ['扎囊县', '542222'], ['贡嘎县', '542223'], ['桑日县', '542224'], ['琼结县', '542225'], ['曲松县', '542226'], ['措美县', '542227'], ['洛扎县', '542228'], ['加查县', '542229'], ['隆子县', '542231'], ['错那县', '542232'], ['浪卡子县', '542233']],
	    '542300': [['日喀则市', '542301'], ['南木林县', '542322'], ['江孜县', '542323'], ['定日县', '542324'], ['萨迦县', '542325'], ['拉孜县', '542326'], ['昂仁县', '542327'], ['谢通门县', '542328'], ['白朗县', '542329'], ['仁布县', '542330'], ['康马县', '542331'], ['定结县', '542332'], ['仲巴县', '542333'], ['亚东县', '542334'], ['吉隆县', '542335'], ['聂拉木县', '542336'], ['萨嘎县', '542337'], ['岗巴县', '542338']],
	    '542400': [['那曲县', '542421'], ['嘉黎县', '542422'], ['比如县', '542423'], ['聂荣县', '542424'], ['安多县', '542425'], ['申扎县', '542426'], ['索县', '542427'], ['班戈县', '542428'], ['巴青县', '542429'], ['尼玛县', '542430']],
	    '542500': [['普兰县', '542521'], ['札达县', '542522'], ['噶尔县', '542523'], ['日土县', '542524'], ['革吉县', '542525'], ['改则县', '542526'], ['措勤县', '542527']],
	    '542600': [['林芝县', '542621'], ['工布江达县', '542622'], ['米林县', '542623'], ['墨脱县', '542624'], ['波密县', '542625'], ['察隅县', '542626'], ['朗县', '542627']],
	    '610100': [['市辖区', '610101'], ['新城区', '610102'], ['碑林区', '610103'], ['莲湖区', '610104'], ['灞桥区', '610111'], ['未央区', '610112'], ['雁塔区', '610113'], ['阎良区', '610114'], ['临潼区', '610115'], ['长安区', '610116'], ['蓝田县', '610122'], ['周至县', '610124'], ['户县', '610125'], ['高陵县', '610126']],
	    '610200': [['市辖区', '610201'], ['王益区', '610202'], ['印台区', '610203'], ['耀州区', '610204'], ['宜君县', '610222']],
	    '610300': [['市辖区', '610301'], ['渭滨区', '610302'], ['金台区', '610303'], ['陈仓区', '610304'], ['凤翔县', '610322'], ['岐山县', '610323'], ['扶风县', '610324'], ['眉县', '610326'], ['陇县', '610327'], ['千阳县', '610328'], ['麟游县', '610329'], ['凤县', '610330'], ['太白县', '610331']],
	    '610400': [['市辖区', '610401'], ['秦都区', '610402'], ['杨凌区', '610403'], ['渭城区', '610404'], ['三原县', '610422'], ['泾阳县', '610423'], ['乾县', '610424'], ['礼泉县', '610425'], ['永寿县', '610426'], ['彬县', '610427'], ['长武县', '610428'], ['旬邑县', '610429'], ['淳化县', '610430'], ['武功县', '610431'], ['兴平市', '610481']],
	    '610500': [['市辖区', '610501'], ['临渭区', '610502'], ['华县', '610521'], ['潼关县', '610522'], ['大荔县', '610523'], ['合阳县', '610524'], ['澄城县', '610525'], ['蒲城县', '610526'], ['白水县', '610527'], ['富平县', '610528'], ['韩城市', '610581'], ['华阴市', '610582']],
	    '610600': [['市辖区', '610601'], ['宝塔区', '610602'], ['延长县', '610621'], ['延川县', '610622'], ['子长县', '610623'], ['安塞县', '610624'], ['志丹县', '610625'], ['吴旗县', '610626'], ['甘泉县', '610627'], ['富县', '610628'], ['洛川县', '610629'], ['宜川县', '610630'], ['黄龙县', '610631'], ['黄陵县', '610632']],
	    '610700': [['市辖区', '610701'], ['汉台区', '610702'], ['南郑县', '610721'], ['城固县', '610722'], ['洋县', '610723'], ['西乡县', '610724'], ['勉县', '610725'], ['宁强县', '610726'], ['略阳县', '610727'], ['镇巴县', '610728'], ['留坝县', '610729'], ['佛坪县', '610730']],
	    '610800': [['市辖区', '610801'], ['榆阳区', '610802'], ['神木县', '610821'], ['府谷县', '610822'], ['横山县', '610823'], ['靖边县', '610824'], ['定边县', '610825'], ['绥德县', '610826'], ['米脂县', '610827'], ['佳县', '610828'], ['吴堡县', '610829'], ['清涧县', '610830'], ['子洲县', '610831']],
	    '610900': [['市辖区', '610901'], ['汉滨区', '610902'], ['汉阴县', '610921'], ['石泉县', '610922'], ['宁陕县', '610923'], ['紫阳县', '610924'], ['岚皋县', '610925'], ['平利县', '610926'], ['镇坪县', '610927'], ['旬阳县', '610928'], ['白河县', '610929']],
	    '611000': [['市辖区', '611001'], ['商州区', '611002'], ['洛南县', '611021'], ['丹凤县', '611022'], ['商南县', '611023'], ['山阳县', '611024'], ['镇安县', '611025'], ['柞水县', '611026']],
	    '620100': [['市辖区', '620101'], ['城关区', '620102'], ['七里河区', '620103'], ['西固区', '620104'], ['安宁区', '620105'], ['红古区', '620111'], ['永登县', '620121'], ['皋兰县', '620122'], ['榆中县', '620123']],
	    '620200': [['市辖区', '620201']],
	    '620300': [['市辖区', '620301'], ['金川区', '620302'], ['永昌县', '620321']],
	    '620400': [['市辖区', '620401'], ['白银区', '620402'], ['平川区', '620403'], ['靖远县', '620421'], ['会宁县', '620422'], ['景泰县', '620423']],
	    '620500': [['市辖区', '620501'], ['秦城区', '620502'], ['北道区', '620503'], ['清水县', '620521'], ['秦安县', '620522'], ['甘谷县', '620523'], ['武山县', '620524'], ['张家川回族自治县', '620525']],
	    '620600': [['市辖区', '620601'], ['凉州区', '620602'], ['民勤县', '620621'], ['古浪县', '620622'], ['天祝藏族自治县', '620623']],
	    '620700': [['市辖区', '620701'], ['甘州区', '620702'], ['肃南裕固族自治县', '620721'], ['民乐县', '620722'], ['临泽县', '620723'], ['高台县', '620724'], ['山丹县', '620725']],
	    '620800': [['市辖区', '620801'], ['崆峒区', '620802'], ['泾川县', '620821'], ['灵台县', '620822'], ['崇信县', '620823'], ['华亭县', '620824'], ['庄浪县', '620825'], ['静宁县', '620826']],
	    '620900': [['市辖区', '620901'], ['肃州区', '620902'], ['金塔县', '620921'], ['安西县', '620922'], ['肃北蒙古族自治县', '620923'], ['阿克塞哈萨克族自治县', '620924'], ['玉门市', '620981'], ['敦煌市', '620982']],
	    '621000': [['市辖区', '621001'], ['西峰区', '621002'], ['庆城县', '621021'], ['环县', '621022'], ['华池县', '621023'], ['合水县', '621024'], ['正宁县', '621025'], ['宁县', '621026'], ['镇原县', '621027']],
	    '621100': [['市辖区', '621101'], ['安定区', '621102'], ['通渭县', '621121'], ['陇西县', '621122'], ['渭源县', '621123'], ['临洮县', '621124'], ['漳县', '621125'], ['岷县', '621126']],
	    '622600': [['武都县', '622621'], ['宕昌县', '622623'], ['成县', '622624'], ['康县', '622625'], ['文县', '622626'], ['西和县', '622627'], ['礼县', '622628'], ['两当县', '622629'], ['徽县', '622630']],
	    '622900': [['临夏市', '622901'], ['临夏县', '622921'], ['康乐县', '622922'], ['永靖县', '622923'], ['广河县', '622924'], ['和政县', '622925'], ['东乡族自治县', '622926'], ['积石山保安族东乡族撒拉族自治县', '622927']],
	    '623000': [['合作市', '623001'], ['临潭县', '623021'], ['卓尼县', '623022'], ['舟曲县', '623023'], ['迭部县', '623024'], ['玛曲县', '623025'], ['碌曲县', '623026'], ['夏河县', '623027']],
	    '630100': [['市辖区', '630101'], ['城东区', '630102'], ['城中区', '630103'], ['城西区', '630104'], ['城北区', '630105'], ['大通回族土族自治县', '630121'], ['湟中县', '630122'], ['湟源县', '630123']],
	    '632100': [['平安县', '632121'], ['民和回族土族自治县', '632122'], ['乐都县', '632123'], ['互助土族自治县', '632126'], ['化隆回族自治县', '632127'], ['循化撒拉族自治县', '632128']],
	    '632200': [['门源回族自治县', '632221'], ['祁连县', '632222'], ['海晏县', '632223'], ['刚察县', '632224']],
	    '632300': [['同仁县', '632321'], ['尖扎县', '632322'], ['泽库县', '632323'], ['河南蒙古族自治县', '632324']],
	    '632500': [['共和县', '632521'], ['同德县', '632522'], ['贵德县', '632523'], ['兴海县', '632524'], ['贵南县', '632525']],
	    '632600': [['玛沁县', '632621'], ['班玛县', '632622'], ['甘德县', '632623'], ['达日县', '632624'], ['久治县', '632625'], ['玛多县', '632626']],
	    '632700': [['玉树县', '632721'], ['杂多县', '632722'], ['称多县', '632723'], ['治多县', '632724'], ['囊谦县', '632725'], ['曲麻莱县', '632726']],
	    '632800': [['格尔木市', '632801'], ['德令哈市', '632802'], ['乌兰县', '632821'], ['都兰县', '632822'], ['天峻县', '632823']],
	    '640100': [['市辖区', '640101'], ['兴庆区', '640104'], ['西夏区', '640105'], ['金凤区', '640106'], ['永宁县', '640121'], ['贺兰县', '640122'], ['灵武市', '640181']],
	    '640200': [['市辖区', '640201'], ['大武口区', '640202'], ['石嘴山区', '640203'], ['平罗县', '640221'], ['陶乐县', '640222'], ['惠农县', '640223']],
	    '640300': [['市辖区', '640301'], ['利通区', '640302'], ['中卫县', '640321'], ['中宁县', '640322'], ['盐池县', '640323'], ['同心县', '640324'], ['青铜峡市', '640381']],
	    '640400': [['市辖区', '640401'], ['原州区', '640402'], ['海原县', '640421'], ['西吉县', '640422'], ['隆德县', '640423'], ['泾源县', '640424'], ['彭阳县', '640425']],
	    '650100': [['市辖区', '650101'], ['天山区', '650102'], ['沙依巴克区', '650103'], ['新市区', '650104'], ['水磨沟区', '650105'], ['头屯河区', '650106'], ['达坂城区', '650107'], ['东山区', '650108'], ['乌鲁木齐县', '650121']],
	    '650200': [['市辖区', '650201'], ['独山子区', '650202'], ['克拉玛依区', '650203'], ['白碱滩区', '650204'], ['乌尔禾区', '650205']],
	    '652100': [['吐鲁番市', '652101'], ['鄯善县', '652122'], ['托克逊县', '652123']],
	    '652200': [['哈密市', '652201'], ['巴里坤哈萨克自治县', '652222'], ['伊吾县', '652223']],
	    '652300': [['昌吉市', '652301'], ['阜康市', '652302'], ['米泉市', '652303'], ['呼图壁县', '652323'], ['玛纳斯县', '652324'], ['奇台县', '652325'], ['吉木萨尔县', '652327'], ['木垒哈萨克自治县', '652328']],
	    '652700': [['博乐市', '652701'], ['精河县', '652722'], ['温泉县', '652723']],
	    '652800': [['库尔勒市', '652801'], ['轮台县', '652822'], ['尉犁县', '652823'], ['若羌县', '652824'], ['且末县', '652825'], ['焉耆回族自治县', '652826'], ['和静县', '652827'], ['和硕县', '652828'], ['博湖县', '652829']],
	    '652900': [['阿克苏市', '652901'], ['温宿县', '652922'], ['库车县', '652923'], ['沙雅县', '652924'], ['新和县', '652925'], ['拜城县', '652926'], ['乌什县', '652927'], ['阿瓦提县', '652928'], ['柯坪县', '652929']],
	    '653000': [['阿图什市', '653001'], ['阿克陶县', '653022'], ['阿合奇县', '653023'], ['乌恰县', '653024']],
	    '653100': [['喀什市', '653101'], ['疏附县', '653121'], ['疏勒县', '653122'], ['英吉沙县', '653123'], ['泽普县', '653124'], ['莎车县', '653125'], ['叶城县', '653126'], ['麦盖提县', '653127'], ['岳普湖县', '653128'], ['伽师县', '653129'], ['巴楚县', '653130'], ['塔什库尔干塔吉克自治县', '653131']],
	    '653200': [['和田市', '653201'], ['和田县', '653221'], ['墨玉县', '653222'], ['皮山县', '653223'], ['洛浦县', '653224'], ['策勒县', '653225'], ['于田县', '653226'], ['民丰县', '653227']],
	    '654000': [['伊宁市', '654002'], ['奎屯市', '654003'], ['伊宁县', '654021'], ['察布查尔锡伯自治县', '654022'], ['霍城县', '654023'], ['巩留县', '654024'], ['新源县', '654025'], ['昭苏县', '654026'], ['特克斯县', '654027'], ['尼勒克县', '654028']],
	    '654200': [['塔城市', '654201'], ['乌苏市', '654202'], ['额敏县', '654221'], ['沙湾县', '654223'], ['托里县', '654224'], ['裕民县', '654225'], ['和布克赛尔蒙古自治县', '654226']],
	    '654300': [['阿勒泰市', '654301'], ['布尔津县', '654321'], ['富蕴县', '654322'], ['福海县', '654323'], ['哈巴河县', '654324'], ['青河县', '654325'], ['吉木乃县', '654326']],
	    '659000': [['石河子市', '659001'], ['阿拉尔市', '659002'], ['图木舒克市', '659003'], ['五家渠市', '659004']],
	    '430100': [['市辖区', '430101'], ['芙蓉区', '430102'], ['天心区', '430103'], ['岳麓区', '430104'], ['开福区', '430105'], ['雨花区', '430111'], ['长沙县', '430121'], ['望城县', '430122'], ['宁乡县', '430124'], ['浏阳市', '430181']],
	    '430200': [['市辖区', '430201'], ['荷塘区', '430202'], ['芦淞区', '430203'], ['石峰区', '430204'], ['天元区', '430211'], ['株洲县', '430221'], ['攸县', '430223'], ['茶陵县', '430224'], ['炎陵县', '430225'], ['醴陵市', '430281']],
	    '430300': [['市辖区', '430301'], ['雨湖区', '430302'], ['岳塘区', '430304'], ['湘潭县', '430321'], ['湘乡市', '430381'], ['韶山市', '430382']],
	    '430400': [['市辖区', '430401'], ['珠晖区', '430405'], ['雁峰区', '430406'], ['石鼓区', '430407'], ['蒸湘区', '430408'], ['南岳区', '430412'], ['衡阳县', '430421'], ['衡南县', '430422'], ['衡山县', '430423'], ['衡东县', '430424'], ['祁东县', '430426'], ['耒阳市', '430481'], ['常宁市', '430482']],
	    '430500': [['市辖区', '430501'], ['双清区', '430502'], ['大祥区', '430503'], ['北塔区', '430511'], ['邵东县', '430521'], ['新邵县', '430522'], ['邵阳县', '430523'], ['隆回县', '430524'], ['洞口县', '430525'], ['绥宁县', '430527'], ['新宁县', '430528'], ['城步苗族自治县', '430529'], ['武冈市', '430581']],
	    '430600': [['市辖区', '430601'], ['岳阳楼区', '430602'], ['云溪区', '430603'], ['君山区', '430611'], ['岳阳县', '430621'], ['华容县', '430623'], ['湘阴县', '430624'], ['平江县', '430626'], ['汨罗市', '430681'], ['临湘市', '430682']],
	    '430700': [['市辖区', '430701'], ['武陵区', '430702'], ['鼎城区', '430703'], ['安乡县', '430721'], ['汉寿县', '430722'], ['澧县', '430723'], ['临澧县', '430724'], ['桃源县', '430725'], ['石门县', '430726'], ['津市市', '430781']],
	    '430800': [['市辖区', '430801'], ['永定区', '430802'], ['武陵源区', '430811'], ['慈利县', '430821'], ['桑植县', '430822']],
	    '430900': [['市辖区', '430901'], ['资阳区', '430902'], ['赫山区', '430903'], ['南县', '430921'], ['桃江县', '430922'], ['安化县', '430923'], ['沅江市', '430981']],
	    '431000': [['市辖区', '431001'], ['北湖区', '431002'], ['苏仙区', '431003'], ['桂阳县', '431021'], ['宜章县', '431022'], ['永兴县', '431023'], ['嘉禾县', '431024'], ['临武县', '431025'], ['汝城县', '431026'], ['桂东县', '431027'], ['安仁县', '431028'], ['资兴市', '431081']],
	    '431100': [['市辖区', '431101'], ['芝山区', '431102'], ['冷水滩区', '431103'], ['祁阳县', '431121'], ['东安县', '431122'], ['双牌县', '431123'], ['道县', '431124'], ['江永县', '431125'], ['宁远县', '431126'], ['蓝山县', '431127'], ['新田县', '431128'], ['江华瑶族自治县', '431129']],
	    '431200': [['市辖区', '431201'], ['鹤城区', '431202'], ['中方县', '431221'], ['沅陵县', '431222'], ['辰溪县', '431223'], ['溆浦县', '431224'], ['会同县', '431225'], ['麻阳苗族自治县', '431226'], ['新晃侗族自治县', '431227'], ['芷江侗族自治县', '431228'], ['靖州苗族侗族自治县', '431229'], ['通道侗族自治县', '431230'], ['洪江市', '431281']],
	    '431300': [['市辖区', '431301'], ['娄星区', '431302'], ['双峰县', '431321'], ['新化县', '431322'], ['冷水江市', '431381'], ['涟源市', '431382']],
	    '433100': [['吉首市', '433101'], ['泸溪县', '433122'], ['凤凰县', '433123'], ['花垣县', '433124'], ['保靖县', '433125'], ['古丈县', '433126'], ['永顺县', '433127'], ['龙山县', '433130']],
	    '440100': [['市辖区', '440101'], ['荔湾区', '440103'], ['越秀区', '440104'], ['海珠区', '440105'], ['天河区', '440106'], ['白云区', '440111'], ['黄埔区', '440112'], ['番禺区', '440113'], ['花都区', '440114'], ['增城区', '440183'], ['从化区', '440184'], ['南沙区', '440185']],
	    '440200': [['市辖区', '440201'], ['北江区', '440202'], ['武江区', '440203'], ['浈江区', '440204'], ['曲江县', '440221'], ['始兴县', '440222'], ['仁化县', '440224'], ['翁源县', '440229'], ['乳源瑶族自治县', '440232'], ['新丰县', '440233'], ['乐昌市', '440281'], ['南雄市', '440282']],
	    '440300': [['市辖区', '440301'], ['罗湖区', '440303'], ['福田区', '440304'], ['南山区', '440305'], ['宝安区', '440306'], ['龙岗区', '440307'], ['盐田区', '440308']],
	    '440400': [['市辖区', '440401'], ['香洲区', '440402'], ['斗门区', '440403'], ['金湾区', '440404']],
	    '440500': [['市辖区', '440501'], ['龙湖区', '440507'], ['金平区', '440511'], ['濠江区', '440512'], ['潮阳区', '440513'], ['潮南区', '440514'], ['澄海区', '440515'], ['南澳县', '440523']],
	    '440600': [['市辖区', '440601'], ['禅城区', '440604'], ['南海区', '440605'], ['顺德区', '440606'], ['三水区', '440607'], ['高明区', '440608']],
	    '440700': [['市辖区', '440701'], ['蓬江区', '440703'], ['江海区', '440704'], ['新会区', '440705'], ['台山市', '440781'], ['开平市', '440783'], ['鹤山市', '440784'], ['恩平市', '440785']],
	    '440800': [['市辖区', '440801'], ['赤坎区', '440802'], ['霞山区', '440803'], ['坡头区', '440804'], ['麻章区', '440811'], ['遂溪县', '440823'], ['徐闻县', '440825'], ['廉江市', '440881'], ['雷州市', '440882'], ['吴川市', '440883']],
	    '440900': [['市辖区', '440901'], ['茂南区', '440902'], ['茂港区', '440903'], ['电白县', '440923'], ['高州市', '440981'], ['化州市', '440982'], ['信宜市', '440983']],
	    '441200': [['市辖区', '441201'], ['端州区', '441202'], ['鼎湖区', '441203'], ['广宁县', '441223'], ['怀集县', '441224'], ['封开县', '441225'], ['德庆县', '441226'], ['高要市', '441283'], ['四会市', '441284']],
	    '441300': [['市辖区', '441301'], ['惠城区', '441302'], ['惠阳区', '441303'], ['博罗县', '441322'], ['惠东县', '441323'], ['龙门县', '441324']],
	    '441400': [['市辖区', '441401'], ['梅江区', '441402'], ['梅县', '441421'], ['大埔县', '441422'], ['丰顺县', '441423'], ['五华县', '441424'], ['平远县', '441426'], ['蕉岭县', '441427'], ['兴宁市', '441481']],
	    '441500': [['市辖区', '441501'], ['城区', '441502'], ['海丰县', '441521'], ['陆河县', '441523'], ['陆丰市', '441581']],
	    '441600': [['市辖区', '441601'], ['源城区', '441602'], ['紫金县', '441621'], ['龙川县', '441622'], ['连平县', '441623'], ['和平县', '441624'], ['东源县', '441625']],
	    '441700': [['市辖区', '441701'], ['江城区', '441702'], ['阳西县', '441721'], ['阳东县', '441723'], ['阳春市', '441781']],
	    '441800': [['市辖区', '441801'], ['清城区', '441802'], ['佛冈县', '441821'], ['阳山县', '441823'], ['连山壮族瑶族自治县', '441825'], ['连南瑶族自治县', '441826'], ['清新县', '441827'], ['英德市', '441881'], ['连州市', '441882']],
	    '441900': [['市辖区', '441900']],
	    '442000': [['市辖区', '442000']],
	    '445100': [['市辖区', '445101'], ['湘桥区', '445102'], ['潮安县', '445121'], ['饶平县', '445122']],
	    '445200': [['市辖区', '445201'], ['榕城区', '445202'], ['揭东县', '445221'], ['揭西县', '445222'], ['惠来县', '445224'], ['普宁市', '445281']],
	    '445300': [['市辖区', '445301'], ['云城区', '445302'], ['新兴县', '445321'], ['郁南县', '445322'], ['云安县', '445323'], ['罗定市', '445381']],
	    '450100': [['市辖区', '450101'], ['兴宁区', '450102'], ['新城区', '450103'], ['城北区', '450104'], ['江南区', '450105'], ['永新区', '450106'], ['邕宁县', '450121'], ['武鸣县', '450122'], ['隆安县', '450123'], ['马山县', '450124'], ['上林县', '450125'], ['宾阳县', '450126'], ['横县', '450127']],
	    '450200': [['市辖区', '450201'], ['城中区', '450202'], ['鱼峰区', '450203'], ['柳南区', '450204'], ['柳北区', '450205'], ['柳江县', '450221'], ['柳城县', '450222'], ['鹿寨县', '450223'], ['融安县', '450224'], ['融水苗族自治县', '450225'], ['三江侗族自治县', '450226']],
	    '450300': [['市辖区', '450301'], ['秀峰区', '450302'], ['叠彩区', '450303'], ['象山区', '450304'], ['七星区', '450305'], ['雁山区', '450311'], ['阳朔县', '450321'], ['临桂县', '450322'], ['灵川县', '450323'], ['全州县', '450324'], ['兴安县', '450325'], ['永福县', '450326'], ['灌阳县', '450327'], ['龙胜各族自治县', '450328'], ['资源县', '450329'], ['平乐县', '450330'], ['荔蒲县', '450331'], ['恭城瑶族自治县', '450332']],
	    '450400': [['市辖区', '450401'], ['万秀区', '450403'], ['蝶山区', '450404'], ['长洲区', '450405'], ['苍梧县', '450421'], ['藤县', '450422'], ['蒙山县', '450423'], ['岑溪市', '450481']],
	    '450500': [['市辖区', '450501'], ['海城区', '450502'], ['银海区', '450503'], ['铁山港区', '450512'], ['合浦县', '450521']],
	    '450600': [['市辖区', '450601'], ['港口区', '450602'], ['防城区', '450603'], ['上思县', '450621'], ['东兴市', '450681']],
	    '450700': [['市辖区', '450701'], ['钦南区', '450702'], ['钦北区', '450703'], ['灵山县', '450721'], ['浦北县', '450722']],
	    '450800': [['市辖区', '450801'], ['港北区', '450802'], ['港南区', '450803'], ['覃塘区', '450804'], ['平南县', '450821'], ['桂平市', '450881']],
	    '450900': [['市辖区', '450901'], ['玉州区', '450902'], ['容县', '450921'], ['陆川县', '450922'], ['博白县', '450923'], ['兴业县', '450924'], ['北流市', '450981']],
	    '451000': [['市辖区', '451001'], ['右江区', '451002'], ['田阳县', '451021'], ['田东县', '451022'], ['平果县', '451023'], ['德保县', '451024'], ['靖西县', '451025'], ['那坡县', '451026'], ['凌云县', '451027'], ['乐业县', '451028'], ['田林县', '451029'], ['西林县', '451030'], ['隆林各族自治县', '451031']],
	    '451100': [['市辖区', '451101'], ['八步区', '451102'], ['昭平县', '451121'], ['钟山县', '451122'], ['富川瑶族自治县', '451123']],
	    '451200': [['市辖区', '451201'], ['金城江区', '451202'], ['南丹县', '451221'], ['天峨县', '451222'], ['凤山县', '451223'], ['东兰县', '451224'], ['罗城仫佬族自治县', '451225'], ['环江毛南族自治县', '451226'], ['巴马瑶族自治县', '451227'], ['都安瑶族自治县', '451228'], ['大化瑶族自治县', '451229'], ['宜州市', '451281']],
	    '451300': [['市辖区', '451301'], ['兴宾区', '451302'], ['忻城县', '451321'], ['象州县', '451322'], ['武宣县', '451323'], ['金秀瑶族自治县', '451324'], ['合山市', '451381']],
	    '451400': [['市辖区', '451401'], ['江洲区', '451402'], ['扶绥县', '451421'], ['宁明县', '451422'], ['龙州县', '451423'], ['大新县', '451424'], ['天等县', '451425'], ['凭祥市', '451481']],
	    '460100': [['市辖区', '460101'], ['秀英区', '460105'], ['龙华区', '460106'], ['琼山区', '460107'], ['美兰区', '460108']],
	    '460200': [['市辖区', '460201']],
	    '469000': [['五指山市', '469001'], ['琼海市', '469002'], ['儋州市', '469003'], ['文昌市', '469005'], ['万宁市', '469006'], ['东方市', '469007'], ['定安县', '469025'], ['屯昌县', '469026'], ['澄迈县', '469027'], ['临高县', '469028'], ['白沙黎族自治县', '469030'], ['昌江黎族自治县', '469031'], ['乐东黎族自治县', '469033'], ['陵水黎族自治县', '469034'], ['保亭黎族苗族自治县', '469035'], ['琼中黎族苗族自治县', '469036'], ['西沙群岛', '469037'], ['南沙群岛', '469038'], ['中沙群岛的岛礁及其海域', '469039']],
	    '500100': [['市辖区', '500100'], ['万州区', '500101'], ['涪陵区', '500102'], ['渝中区', '500103'], ['大渡口区', '500104'], ['江北区', '500105'], ['沙坪坝区', '500106'], ['九龙坡区', '500107'], ['南岸区', '500108'], ['北碚区', '500109'], ['万盛区', '500110'], ['双桥区', '500111'], ['渝北区', '500112'], ['巴南区', '500113'], ['黔江区', '500114'], ['长寿区', '500115']],
	    '500200': [['县', '500200'], ['綦江县', '500222'], ['潼南县', '500223'], ['铜梁县', '500224'], ['大足县', '500225'], ['荣昌县', '500226'], ['璧山县', '500227'], ['梁平县', '500228'], ['城口县', '500229'], ['丰都县', '500230'], ['垫江县', '500231'], ['武隆县', '500232'], ['忠县', '500233'], ['开县', '500234'], ['云阳县', '500235'], ['奉节县', '500236'], ['巫山县', '500237'], ['巫溪县', '500238'], ['石柱土家族自治县', '500240'], ['秀山土家族苗族自治县', '500241'], ['酉阳土家族苗族自治县', '500242'], ['彭水苗族土家族自治县', '500243']],
	    '500300': [['市', '500300'], ['江津市', '500381'], ['合川市', '500382'], ['永川市', '500383'], ['南川市', '500384']],
	    '510100': [['市辖区', '510101'], ['锦江区', '510104'], ['青羊区', '510105'], ['金牛区', '510106'], ['武侯区', '510107'], ['成华区', '510108'], ['龙泉驿区', '510112'], ['青白江区', '510113'], ['新都区', '510114'], ['金堂县', '510121'], ['双流县', '510122'], ['温江县', '510123'], ['郫县', '510124'], ['大邑县', '510129'], ['蒲江县', '510131'], ['新津县', '510132'], ['都江堰市', '510181'], ['彭州市', '510182'], ['邛崃市', '510183'], ['崇州市', '510184']],
	    '510300': [['市辖区', '510301'], ['自流井区', '510302'], ['贡井区', '510303'], ['大安区', '510304'], ['沿滩区', '510311'], ['荣县', '510321'], ['富顺县', '510322']],
	    '510400': [['市辖区', '510401'], ['东区', '510402'], ['西区', '510403'], ['仁和区', '510411'], ['米易县', '510421'], ['盐边县', '510422']],
	    '510500': [['市辖区', '510501'], ['江阳区', '510502'], ['纳溪区', '510503'], ['龙马潭区', '510504'], ['泸县', '510521'], ['合江县', '510522'], ['叙永县', '510524'], ['古蔺县', '510525']],
	    '510600': [['市辖区', '510601'], ['旌阳区', '510603'], ['中江县', '510623'], ['罗江县', '510626'], ['广汉市', '510681'], ['什邡市', '510682'], ['绵竹市', '510683']],
	    '510700': [['市辖区', '510701'], ['涪城区', '510703'], ['游仙区', '510704'], ['三台县', '510722'], ['盐亭县', '510723'], ['安县', '510724'], ['梓潼县', '510725'], ['北川县', '510726'], ['平武县', '510727'], ['江油市', '510781']],
	    '510800': [['市辖区', '510801'], ['市中区', '510802'], ['元坝区', '510811'], ['朝天区', '510812'], ['旺苍县', '510821'], ['青川县', '510822'], ['剑阁县', '510823'], ['苍溪县', '510824']],
	    '510900': [['市辖区', '510901'], ['市中区', '510902'], ['蓬溪县', '510921'], ['射洪县', '510922'], ['大英县', '510923']],
	    '511000': [['市辖区', '511001'], ['市中区', '511002'], ['东兴区', '511011'], ['威远县', '511024'], ['资中县', '511025'], ['隆昌县', '511028']],
	    '511100': [['市辖区', '511101'], ['市中区', '511102'], ['沙湾区', '511111'], ['五通桥区', '511112'], ['金口河区', '511113'], ['犍为县', '511123'], ['井研县', '511124'], ['夹江县', '511126'], ['沐川县', '511129'], ['峨边彝族自治县', '511132'], ['马边彝族自治县', '511133'], ['峨眉山市', '511181']],
	    '511300': [['市辖区', '511301'], ['顺庆区', '511302'], ['高坪区', '511303'], ['嘉陵区', '511304'], ['南部县', '511321'], ['营山县', '511322'], ['蓬安县', '511323'], ['仪陇县', '511324'], ['西充县', '511325'], ['阆中市', '511381']],
	    '511400': [['市辖区', '511401'], ['东坡区', '511402'], ['仁寿县', '511421'], ['彭山县', '511422'], ['洪雅县', '511423'], ['丹棱县', '511424'], ['青神县', '511425']],
	    '511500': [['市辖区', '511501'], ['翠屏区', '511502'], ['宜宾县', '511521'], ['南溪县', '511522'], ['江安县', '511523'], ['长宁县', '511524'], ['高县', '511525'], ['珙县', '511526'], ['筠连县', '511527'], ['兴文县', '511528'], ['屏山县', '511529']],
	    '511600': [['市辖区', '511601'], ['广安区', '511602'], ['岳池县', '511621'], ['武胜县', '511622'], ['邻水县', '511623'], ['华莹市', '511681']],
	    '511700': [['市辖区', '511701'], ['通川区', '511702'], ['达县', '511721'], ['宣汉县', '511722'], ['开江县', '511723'], ['大竹县', '511724'], ['渠县', '511725'], ['万源市', '511781']],
	    '511800': [['市辖区', '511801'], ['雨城区', '511802'], ['名山县', '511821'], ['荥经县', '511822'], ['汉源县', '511823'], ['石棉县', '511824'], ['天全县', '511825'], ['芦山县', '511826'], ['宝兴县', '511827']],
	    '511900': [['市辖区', '511901'], ['巴州区', '511902'], ['通江县', '511921'], ['南江县', '511922'], ['平昌县', '511923']],
	    '512000': [['市辖区', '512001'], ['雁江区', '512002'], ['安岳县', '512021'], ['乐至县', '512022'], ['简阳市', '512081']],
	    '513200': [['汶川县', '513221'], ['理县', '513222'], ['茂县', '513223'], ['松潘县', '513224'], ['九寨沟县', '513225'], ['金川县', '513226'], ['小金县', '513227'], ['黑水县', '513228'], ['马尔康县', '513229'], ['壤塘县', '513230'], ['阿坝县', '513231'], ['若尔盖县', '513232'], ['红原县', '513233']],
	    '513300': [['康定县', '513321'], ['泸定县', '513322'], ['丹巴县', '513323'], ['九龙县', '513324'], ['雅江县', '513325'], ['道孚县', '513326'], ['炉霍县', '513327'], ['甘孜县', '513328'], ['新龙县', '513329'], ['德格县', '513330'], ['白玉县', '513331'], ['石渠县', '513332'], ['色达县', '513333'], ['理塘县', '513334'], ['巴塘县', '513335'], ['乡城县', '513336'], ['稻城县', '513337'], ['得荣县', '513338']],
	    '513400': [['西昌市', '513401'], ['木里藏族自治县', '513422'], ['盐源县', '513423'], ['德昌县', '513424'], ['会理县', '513425'], ['会东县', '513426'], ['宁南县', '513427'], ['普格县', '513428'], ['布拖县', '513429'], ['金阳县', '513430'], ['昭觉县', '513431'], ['喜德县', '513432'], ['冕宁县', '513433'], ['越西县', '513434'], ['甘洛县', '513435'], ['美姑县', '513436']]
	}];

/***/ },
/* 36 */
/***/ function(module, exports) {

	//接口数据转换
	var BaseDataConvert = {
	    toUserInfo: function (db) {
	        this.postcode = db.postcode;
	        this.name = db.name;
	        this.phone = db.phone;
	        this.addr = db.addr;
	        return true;
	    },
	    toUserScore: function (db) {
	        this.integral = db.score;
	        return true;
	    },
	    toAwardConfig: function (db) {
	        this.length = 0;
	        for (var i = 0; i < db.length; i++) {
	            this.push({
	                type: db[i].awardType,
	                imgUrl: db[i].picUrl,
	                price: db[i].prize,
	                name: db[i].awardName,
	                id: db[i].configId
	            });
	        }
	        return true;
	    }
	}
	module.exports = BaseDataConvert;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	//数据接口
	var $ = __webpack_require__(29),
	    Api = __webpack_require__(34);
	var Interface = {
	    url: "http://games.yqhapp.com/online160324/",
	    account: window.__a__ && window.__a__.getAccount(),
	    key: window.__a__ && window.__a__.getUserKey(),
	    getAwardConfig: function (cb1, cb2) {
	        // $.ajax({
	        //     type: 'GET',
	        //     url: Interface.url + "action/getAwardConfig.jsp",
	        //     data: {},
	        //     dataType: 'jsonp',
	        //     success: function (data) {
	        //         if (cb1) {
	        //             cb1(data);
	        //         }
	        //     },
	        //     error: function (xhr, type) {
	        //         if (cb2) {
	        //             cb2(xhr, type);
	        //         }
	        //     }
	        // });
	        cb1.call(this, JSON.parse("{\"configs\":[{\"awardType\":1,\"picUrl\":\"http://www1.pclady.com.cn/zt/20160303/yqh/upload/5coin.png\",\"prize\":5,\"awardName\":\"5积分\",\"configId\":1},{\"awardType\":2,\"picUrl\":\"http://www1.pclady.com.cn/zt/20160303/yqh/upload/baozhen_1.png\",\"prize\":10,\"awardName\":\"时尚抱枕\",\"configId\":2},{\"awardType\":1,\"picUrl\":\"http://www1.pclady.com.cn/zt/20160303/yqh/upload/10coin.png\",\"prize\":10,\"awardName\":\"10积分\",\"configId\":3},{\"awardType\":2,\"picUrl\":\"http://www1.pclady.com.cn/zt/20160303/yqh/upload/cup.png\",\"prize\":15,\"awardName\":\"炫彩磨砂太空水杯\",\"configId\":4},{\"awardType\":1,\"picUrl\":\"http://www1.pclady.com.cn/zt/20160303/yqh/upload/100coin.png\",\"prize\":100,\"awardName\":\"100积分\",\"configId\":5},{\"awardType\":2,\"picUrl\":\"http://www1.pclady.com.cn/zt/20160303/yqh/upload/shubiao.png\",\"prize\":50,\"awardName\":\"便携式无线折叠鼠标\",\"configId\":6},{\"awardType\":1,\"picUrl\":\"http://www1.pclady.com.cn/zt/20160303/yqh/upload/10coin.png\",\"prize\":50,\"awardName\":\"50积分\",\"configId\":7},{\"awardType\":2,\"picUrl\":\"http://www1.pclady.com.cn/zt/20160303/yqh/upload/shouhuan.png\",\"prize\":100,\"awardName\":\"小米手环【光感版】\",\"configId\":8}],\"code\":\"1\",\"msg\":\"获取奖品配置成功\"}"));
	    },
	    getUserInfo: function (cb1, cb2) {
	        // $.ajax({
	        //     type: 'GET',
	        //     url: Interface.url + "action/getUserInfo.jsp",
	        //     data: {
	        //         account: Interface.account,
	        //         key: Interface.key
	        //     },
	        //     dataType: 'jsonp',
	        //     success: function (data) {
	        //         if (cb1) {
	        //             cb1(data);
	        //         }
	        //     },
	        //     error: function (xhr, type) {
	        //         if (cb2) {
	        //             cb2(xhr, type);
	        //         }
	        //     }
	        // });
	        cb1.call(this, JSON.parse("{\"code\":\"1\",\"msg\":\"获取用户信息成功\",\"phone\":\"18666524732\",\"name\":\"添少\",\"addr\":\"广东省-广州市-天河区-太平洋网络\",\"postcode\":\"510000\"}"));
	    },
	    getWinner: function (cb1, cb2) {
	        // $.ajax({
	        //     type: 'GET',
	        //     url: Interface.url + "action/getLottery.jsp",
	        //     data: {},
	        //     dataType: 'jsonp',
	        //     success: function (data) {
	        //         if (cb1) {
	        //             cb1(data);
	        //         }
	        //     },
	        //     error: function (xhr, type) {
	        //         if (cb2) {
	        //             cb2(xhr, type);
	        //         }
	        //     }
	        // });
	        cb1.call(this, JSON.parse("{\"code\":\"1\",\"lotterys\":[{\"account\":\"13598109834\",\"awardName\":\"时尚抱枕\"},{\"account\":\"18338920118\",\"awardName\":\"100积分\"},{\"account\":\"13835773428\",\"awardName\":\"100积分\"},{\"account\":\"13835773428\",\"awardName\":\"炫彩磨砂太空水杯\"},{\"account\":\"13598109834\",\"awardName\":\"炫彩磨砂太空水杯\"},{\"account\":\"15815218761\",\"awardName\":\"时尚抱枕\"},{\"account\":\"13453254391\",\"awardName\":\"100积分\"},{\"account\":\"15730443414\",\"awardName\":\"100积分\"},{\"account\":\"13453254391\",\"awardName\":\"时尚抱枕\"},{\"account\":\"18845858399\",\"awardName\":\"100积分\"},{\"account\":\"18338971213\",\"awardName\":\"100积分\"},{\"account\":\"15946224300\",\"awardName\":\"100积分\"},{\"account\":\"13834355796\",\"awardName\":\"100积分\"},{\"account\":\"13834355796\",\"awardName\":\"100积分\"},{\"account\":\"13834355796\",\"awardName\":\"炫彩磨砂太空水杯\"},{\"account\":\"13834355796\",\"awardName\":\"100积分\"},{\"account\":\"13834355796\",\"awardName\":\"100积分\"},{\"account\":\"13834355796\",\"awardName\":\"100积分\"},{\"account\":\"13834355796\",\"awardName\":\"100积分\"},{\"account\":\"13834355796\",\"awardName\":\"100积分\"},{\"account\":\"13686778486\",\"awardName\":\"100积分\"},{\"account\":\"15843346625\",\"awardName\":\"炫彩磨砂太空水杯\"},{\"account\":\"13357997671\",\"awardName\":\"100积分\"},{\"account\":\"13598109834\",\"awardName\":\"时尚抱枕\"},{\"account\":\"13453814986\",\"awardName\":\"100积分\"},{\"account\":\"15934011871\",\"awardName\":\"100积分\"},{\"account\":\"15934011871\",\"awardName\":\"100积分\"},{\"account\":\"15934011871\",\"awardName\":\"100积分\"},{\"account\":\"18977385526\",\"awardName\":\"100积分\"},{\"account\":\"13833211863\",\"awardName\":\"100积分\"},{\"account\":\"13526175857\",\"awardName\":\"100积分\"},{\"account\":\"13233362813\",\"awardName\":\"100积分\"},{\"account\":\"13835773428\",\"awardName\":\"100积分\"},{\"account\":\"15947125162\",\"awardName\":\"100积分\"},{\"account\":\"15893513067\",\"awardName\":\"100积分\"},{\"account\":\"13935740838\",\"awardName\":\"100积分\"},{\"account\":\"13593212968\",\"awardName\":\"100积分\"},{\"account\":\"15535697581\",\"awardName\":\"100积分\"},{\"account\":\"15535697581\",\"awardName\":\"100积分\"},{\"account\":\"13731243275\",\"awardName\":\"100积分\"}],\"msg\":\"获取名单成功\"}"));
	    },
	    lottery: function (cb1, cb2) {
	        // $.ajax({
	        //     type: 'GET',
	        //     url: Interface.url + "action/lottery.jsp",
	        //     data: {
	        //         account: Interface.account,
	        //         key: Interface.key
	        //     },
	        //     dataType: 'jsonp',
	        //     success: function (data) {
	        //         if (cb1) {
	        //             cb1(data);
	        //         }
	        //     },
	        //     error: function (xhr, type) {
	        //         if (cb2) {
	        //             cb2(xhr, type);
	        //         }
	        //     }
	        // });
	        cb1.call(this, JSON.parse("{\"code\":\"1\",\"msg\":\"抽奖成功\",\"configId\":" + Math.floor((Math.random() * 8 + 1)) + "}"));
	    },
	    submitInfo: (function () {
	        var o = $("#msReg .ui-alert2");
	        return function (info, cb1, cb2) {
	            if (info.name.length == 0) {
	                o.loading({txt: "请填写收件人", fs: "0.5rem"});
	                setTimeout(function () {
	                    o.loading();
	                }, 1000);
	                return;
	            }
	            if (info.tel.length != 11) {
	                o.loading({txt: "请填写联系方式", fs: "0.5rem"});
	                setTimeout(function () {
	                    o.loading();
	                }, 1000);
	                return;
	            }
	            if (info.postCode.length != 6) {
	                o.loading({txt: "请填写邮编", fs: "0.5rem"});
	                setTimeout(function () {
	                    o.loading();
	                }, 1000);
	                return;
	            }
	            var addrs = info.addr.split("-");
	            if (addrs[0].length == 0 || addrs[1].length == 0 || addrs[2].length == 0 || addrs[3].length == 0) {
	                o.loading({txt: "请填写地址", fs: "0.5rem"});
	                setTimeout(function () {
	                    o.loading();
	                }, 1000);
	                return;
	            }
	            // $.ajax({
	            //     type: 'GET',
	            //     url: Interface.url + "action/submitInfo.jsp",
	            //     data: {
	            //         account: Interface.account,
	            //         key: Interface.key,
	            //         realName: info.name,
	            //         phone: info.tel,
	            //         postCode: info.postCode,
	            //         addr: info.addr
	            //     },
	            //     dataType: 'jsonp',
	            //     success: function (data) {
	            //         if (cb1) {
	            //             cb1(data);
	            //         }
	            //     },
	            //     error: function (xhr, type) {
	            //         if (cb2) {
	            //             cb2(xhr, type);
	            //         }
	            //     }
	            // });
	            cb1.call(this, JSON.parse("{\"code\":\"1\",\"msg\":\"修改用户信息成功\"}"));
	        }
	    })()
	}
	module.exports = Interface;

/***/ }
/******/ ]);