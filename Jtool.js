String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,
    function (m, i) {
        return args[i];
    });
};
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    };
    return format;
};
var Class = {
    create: function () {
        return function () {
            this.initialize.apply(this, arguments)
        }
    }
};
Object.extend = function (a, b) {
    for (property in b) {
        a[property] = b[property]
    }
    return a
};
var base = Class.create();
Object.extend(base.prototype, {
    initialize: function () { }
});
Function.prototype.bind = function () {
    var b = this,
        c = arguments[0],
        a = Array.prototype.slice.call(arguments, 1);
    return function () {
        return b.apply(c, a)
    }
};
Array.prototype.del = function (a) {
    if (a < 0) {
        return this
    }
    return this.slice(0, a).concat(this.slice(a + 1, this.length))
};
var jtool = new base();
Object.extend(jtool, {
    initialize: function () {
        var a = this
    },
    $id: function (a) {
        return typeof (a) == "string" ? document.getElementById(a) : a
    },
    $class: function (a) {
        var classElements = [],allElements = document.getElementsByTagName('*');
        for (var i=0; i< allElements.length; i++ ){
                if (allElements[i].className == a ) {
                   classElements[classElements.length] = allElements[i];
                }
            }
        return classElements;
    },
    getJsonp: function (src, callback, arg) {
        var r = this.jsonp,
            i = arg,
            s = document.getElementsByTagName("head")[0],
            o = document.createElement("script");
        o.setAttribute("charset", "utf-8"), o.setAttribute("type", "text/javascript");
        var u = !1;
        window[i] = function(e) {
            u = !0, callback(e, r);
            try {
                delete window[i]
            } catch (n) {
                window[i] = null
            }
            o.parentNode.removeChild(o)
        }, o.setAttribute("src", src), s.appendChild(o);
        var a = 15e3;
        a && setTimeout(function () {
            if (u) return;
            try {
                delete window[i]
            } catch (e) {
                window[i] = null
            }
            o && o.parentNode.removeChild(o)
        }, a)
    },
    postJsonp: function (URL, data, callback) {
        var temp = document.createElement("form");
        temp.action = URL;
        temp.method = "post";
        temp.style.display = "none";
        for (var x in data) {
            var opt = document.createElement("textarea");
            opt.name = x;
            opt.value = data[x];
            temp.appendChild(opt);
        }
        var ifm = document.createElement("iframe");
        ifm.name = "post" + Math.floor(Math.random() * 10000);
        ifm.style.display = "none";
        temp.target = ifm.name;
        document.body.appendChild(ifm);
        document.body.appendChild(temp);
        temp.submit();
        ifm.onload = function () {
            try {
                var data = ifm.contentWindow.document.body.innerHTML;
            }
            catch (e) {
                var data = "同域原则限制，无法访问数据。或是您的浏览器版本较低，请更新浏览器！" + e;
            }
            callback(data);
            document.body.removeChild(temp);
            document.body.removeChild(ifm);
            ifm.src = "about:blank";
            ifm.onload = null;
        }
    },
    ajax: function (type, url, callback, data) {
        function createXMLHTTPRequest () {
            var xmlHttpRequest;
            if (window.XMLHttpRequest) {
                xmlHttpRequest = new XMLHttpRequest();
                if (xmlHttpRequest.overrideMimeType) {
                    xmlHttpRequest.overrideMimeType("text/xml");
                }
            } else if (window.ActiveXObject) {
                var activexName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
                for (var i = 0; i < activexName.length; i++) {
                    try { 
                        xmlHttpRequest = new ActiveXObject(activexName[i]);
                        if (xmlHttpRequest) {
                            break;
                        }
                    } catch (e) {alert(e)}
                }
            }
            return xmlHttpRequest;
        }
        type.match(/post/gi) != null ? type = "POST" : type = "GET";
        var req = createXMLHTTPRequest();
        if (req) {
            req.open(type, url, true);
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8;");
            req.send(data);
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        var retext = req.responseText;
                        callback(retext);
                    } else {alert("error");}
                }
            }
        }
    },
    $tag: function (c, b) {
        var a = b || document;
        return typeof (c) == "string" ? a.getElementsByTagName(c) : c
    },
    $create: function (a) {
        return document.createElement(a)
    },
    $parent: function (b, a) {
        while (b.tagName.toLowerCase() != a) {
            b = b.parentNode
        }
        return b
    },
    extend: function (a, d, b) {
        if (b === undefined) {
            b = true
        }
        for (var c in d) {
            if (b || !(c in a)) {
                a[c] = d[c]
            }
        }
        return a
    },
    deepExtend: function (a, c) {
        for (var b in c) {
            var d = c[b];
            if (a === d) {
                continue
            }
            if (typeof d === "object") {
                a[b] = arguments.callee(a[b] || {}, d)
            } else {
                a[b] = d
            }
        }
        return a
    },
    browser: function () {
        var e = window.navigator.userAgent.toLowerCase();
        var c = {
            msie: /msie/.test(e) && !/opera/.test(e),
            opera: /opera/.test(e),
            safari: /webkit/.test(e) && !/chrome/.test(e),
            firefox: /firefox/.test(e),
            chrome: /chrome/.test(e)
        };
        var a = "";
        for (var d in c) {
            if (c[d]) {
                a = "safari" == d ? "version" : d;
                break
            }
        }
        c.version = a && RegExp("(?:" + a + ")[\\/: ]([\\d.]+)").test(e) ? RegExp.$1 : "0";
        c.ie = c.msie;
        c.ie6 = c.msie && parseInt(c.version, 10) == 6;
        c.ie7 = c.msie && parseInt(c.version, 10) == 7;
        c.ie8 = c.msie && parseInt(c.version, 10) == 8;
        return c
    },
    isArray: function (a) {
        return Object.prototype.toString.call(a) === "[object Array]"
    },
    indexOf: function (d, b, c) {
        if (d.indexOf) {
            return isNaN(c) ? d.indexOf(b) : d.indexOf(b, c)
        } else {
            var a = d.length;
            c = isNaN(c) ? 0 : c < 0 ? Math.ceil(c) + a : Math.floor(c);
            for (; c < a; c++) {
                if (d[c] === b) {
                    return c
                }
            }
            return -1
        }
    },
    lastIndexOf: function (d, b, c) {
        if (d.lastIndexOf) {
            return isNaN(c) ? d.lastIndexOf(b) : d.lastIndexOf(b, c)
        } else {
            var a = d.length;
            c = isNaN(c) || c >= a - 1 ? a - 1 : c < 0 ? Math.ceil(c) + a : Math.floor(c);
            for (; c > -1; c--) {
                if (d[c] === b) {
                    return c
                }
            }
            return -1
        }
    },
    getScrollTop: function (a) {
        var b = a ? a.ownerDocument : document;
        return b.documentElement.scrollTop || b.body.scrollTop
    },
    getScrollLeft: function (a) {
        var b = a ? a.ownerDocument : document;
        return b.documentElement.scrollLeft || b.body.scrollLeft
    },
    contains: document.defaultView ? function (d, c) {
        return !!(d.compareDocumentPosition(c) & 16)
    } : function (d, c) {
        return d != c && d.contains(c)
    },
    rect: function (f) {
        var e = 0,
            h = 0,
            i = 0,
            b = 0,
            c = this.browser,
            a = this;
        if (!f.getBoundingClientRect || c.ie8) {
            var d = f;
            while (d) {
                e += d.offsetLeft, h += d.offsetTop;
                d = d.offsetParent
            }
            i = e + f.offsetWidth;
            b = h + f.offsetHeight
        } else {
            var g = f.getBoundingClientRect();
            e = i = a.getScrollLeft(f);
            h = b = a.getScrollTop(f);
            e += g.left;
            i += g.right;
            h += g.top;
            b += g.bottom
        }
        return {
            left: e,
            top: h,
            right: i,
            bottom: b
        }
    },
    clientRect: function (d) {
        var c = this.rect(d),
            b = this.getScrollLeft(d),
            a = this.getScrollTop(d);
        c.left -= b;
        c.right -= b;
        c.top -= a;
        c.bottom -= a;
        return c
    },
    curStyle: document.defaultView ? function (a) {
        return document.defaultView.getComputedStyle(a, null)
    } : function (a) {
        return a.currentStyle
    },
    getStyle: document.defaultView ? function (c, a) {
        var b = document.defaultView.getComputedStyle(c, null);
        return a in b ? b[a] : b.getPropertyValue(a)
    } : function (e, b) {
        var a = e.style,
            h = e.currentStyle;
        if (b == "opacity") {
            if (/alpha\(opacity=(.*)\)/i.test(h.filter)) {
                var g = parseFloat(RegExp.$1);
                return g ? g / 100 : 0
            }
            return 1
        } else {
            if (b == "float") {
                b = "styleFloat"
            }
        }
        var i = this.curStyle[b] || this.curStyle[this.camelize(b)];
        if (!/^-?\d+(?:px)?$/i.test(i) && /^\-?\d/.test(i)) {
            var d = a.left,
                c = e.runtimeStyle,
                f = c.left;
            c.left = h.left;
            a.left = i || 0;
            i = a.pixelLeft + "px";
            a.left = d;
            c.left = f
        }
        return i
    },
    setStyle: function (a, c, d) {
        if (!a.length) {
            a = [a]
        }
        if (typeof c == "string") {
            var b = c;
            c = {};
            c[b] = d
        }
        A.forEach(a, function (f) {
            for (var e in c) {
                var g = c[e];
                if (e == "opacity" && B.ie) {
                    f.style.filter = (f.currentStyle.filter || "").replace(/alpha\([^)]*\)/, "") + "alpha(opacity=" + g * 100 + ")"
                } else {
                    if (e == "float") {
                        f.style[B.ie ? "styleFloat" : "cssFloat"] = g
                    } else {
                        f.style[S.camelize(e)] = g
                    }
                }
            }
        })
    },
    hasClass: function (a, c) {
        var b = new RegExp("(\\s|^)" + c + "(\\s|$)");
        return a.className.match(b)
    },
    addClass: function (a, b) {
        if (!this.hasClass(a, b)) {
            a.className += " " + b
        }
    },
    removeClass: function (a, c) {
        if (this.hasClass(a, c)) {
            var b = new RegExp("(\\s|^)" + c + "(\\s|$)");
            a.className = a.className.replace(b, " ")
        }
    },
    camelize: function (a) {
        return a.replace(/-([a-z])/ig, function (b, c) {
            return c.toUpperCase()
        })
    },
    loadJs: function (b, c) {
        var a = document.createElement("script");
        var e = this;
        var d = {
            charset: null,
            callback: function () { },
            remove: true
        };
        e.extend(d, c || {});
        if (!(d.charset == null || d.charset == "")) {
            a.setAttribute("charset", d.charset)
        }
        a.setAttribute("type", "text/javascript");
        a.setAttribute("src", b);
        this.$tag("head")[0].appendChild(a);
        a.onload = a.onreadystatechange = function () {
            if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                d.callback(a);
                if (d.remove == true) {
                    e.removeJs(a)
                }
            }
        }
    },
    removeJs: function (c) {
        var a = (typeof c == "string") ? this.$(c) : c;
        a.onload = a.onreadystatechange = null;
        try {
            a.parentNode.removeChild(a)
        } catch (b) { }
    },
    loadCss: function (a) {
        var b = this.$create("link");
        b.rel = "", b.rel = "stylesheet", b.type = "text/css", b.href = a;
        this.$tag("head")[0].appendChild(b)
    },
    appendCss: function (a) {
        var b = this.$create("style");
        this.$tag("head")[0].appendChild(b);
        b.type = "text/css";
        if (b.styleSheet) {
            b.styleSheet.cssText = a
        } else {
            var c = document.createTextNode(a);
            b.appendChild(c)
        }
    },
    getNodePos: function (b) {
        var a = 0;
        while (b = b.previousSibling) {
            if (b.nodeType == 1) {
                a++
            }
        }
        return a
    },
    getPrevNode: function (b, a) {
        while (b = b.previousSibling) {
            if (b.nodeType == 1 && b.tagName.toLowerCase() == a) {
                break
            }
        }
        return b
    },
    getNextNode: function (b, a) {
        while (b = b.nextSibling) {
            if (b.nodeType == 1 && b.tagName.toLowerCase() == a) {
                break
            }
        }
        return b
    },
    setCookie: function (e, c, b) {
        var a;
        var d = new Date();
        b = b || 0;
        d.setTime(d.getTime() + b * 60 * 60 * 1000);
        a = e + "=" + escape(c) + ";path=/;expires=" + d.toGMTString();
        document.cookie = a
    },
    getCookie: function (c) {
        var a = document.cookie.lastIndexOf(c + "=");
        if (a == -1) {
            return null
        }
        var d = document.cookie.substring(a + c.length + 1);
        var b = d.indexOf(";");
        if (b == -1) {
            b = d.length
        }
        d = d.substring(0, b);
        d = unescape(d);
        return d
    },
    delCookie: function (b) {
        var a = new Date();
        document.cookie = b + "=;path=/;expires=" + a.toGMTString()
    },
    addEvent: function (e, b, c, a) {
        if (e.addEventListener) {
            e.addEventListener(b, c, a);
            return true
        } else {
            if (e.attachEvent) {
                var d = e.attachEvent("on" + b, c);
                return d
            } else {
                e["on" + b] = c
            }
        }
    },
    addEvent: function (elm, evType, fn, useCapture) {
        if (elm.addEventListener) {
            elm.addEventListener(evType, fn, useCapture);
            return true
        } else {
            if (elm.attachEvent) {
                var d = elm.attachEvent("on" + evType, fn);
                return d
            } else {
                eelm["on" + evType] = fn
            }
        }
    },
    delEvent: function (e, b, c, a) {
        if (e.removeEventListener) {
            e.removeEventListener(b, c, a);
            return true
        } else {
            if (e.detachEvent) {
                var d = e.detachEvent("on" + b, c);
                return d
            } else {
                e["on" + b] = null;
                return
            }
        }
    },
    fixEvent: function (b) {
        if (b) {
            return b
        }
        b = window.event;
        var c = this;
        b.pageX = b.clientX + c.getScrollLeft(b.srcElement);
        b.pageY = b.clientY + c.getScrollTop(b.srcElement);
        b.target = b.srcElement;
        b.stopPropagation = stopPropagation;
        b.preventDefault = preventDefault;
        var a = {
            mouseout: b.toElement,
            mouseover: b.fromElement
        }[b.type];
        if (a) {
            b.relatedTarget = a
        }
        return b
    },
    getParam: function (b) {
        var a = window.location.search.match(new RegExp("(\\?|&)" + b + "=([^&]*)(&|$)"));
        if (a != null) {
            return unescape(a[2])
        }
        return null
    },
    loseHtml: function (a) {
        return a.replace(/<[^>]*?>/gi, "")
    },
    trimLeft: function (a) {
        return a.replace(/^(\u3000|\s|\t)*/gi, "")
    },
    trimRight: function (a) {
        return a.replace(/(\u3000|\s|\t)*$/gi, "")
    },
    trim: function (a) {
        return this.trimRight(this.trimLeft(a))
    },
    toInt: function (a) {
        return parseInt(a)
    },
    toArray: function (a) {
        if (a) {
            return this.split(a)
        } else {
            return this.split("")
        }
    },
    subTo: function (a, b) {
        return a.substring(0, b)
    },
    getInnerText: function (b) {
        var a = b.innerHTML.replace(/<[^>].*?>/ig, "");
        a = this.trim(a);
        return a
    },
    reUrl: function (a) {
        a = a.replace(/(\&|\\?)rt=([^\&]+)/ig, "");
        a += (a.indexOf("?") >= -1) ? "&rt=" + new Date().getTime() : "?rt=" + new Date().getTime();
        return a
    },
    repairAstyle: function () {
        var c = this.browser;
        if (c.ie) {
            var d = document.getElementsByTagName("a");
            for (var f = 0, e = d.length; f < e; f++) {
                d[f].onfocus = function () {
                    this.blur()
                }
            }
        }
    },
    merge: function (a, c) {
        for (var b in c) a[b] = c[b];
        return a
    },
    parseQueryString: function (url) {
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
            reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
            arr_url = reg_url.exec(url),
            ret = {};
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1], result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        };
        return ret;
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    stopEventBubble: function (event) {
        var e = event || window.event;
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            e.cancelBubble = true;
        };
        return false;
    },
    parsePercentToDecimal: function (percent) {
        return Number(percent.replace('%', '')) / 100;
    }
});