(function (window) {
    /* ====== global variable ====== */
    var ARRAY = [];

    /* ====== tools ====== */
    // isArrayLike
    function isArrayLike(obj) {
        return obj &&
            typeof obj === "object" &&
            isFinite(obj.length) &&
            obj.length >= 0 &&
            obj.length === Math.floor(obj.length) &&
            obj.length < Math.pow(2, 23);
    }

    // sibling
    function sibling(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);

        return cur;
    }

    // siblings
    function siblings(cur, dir) {
        var matched = [];

        while (cur = cur[dir]) {
            if (cur.nodeType === 1) {
                matched.push(cur);
            }
        }

        return matched;
    }

    // set & get
    function content(method, para) {
        if (para) {
            return this.each(function () {
                this[method] = para;
            });
        } else {
            return this[0][method];
        }
    }

    // htmlStr --> dom
    function parseHTML(str) {
        var ret = [],
            node = document.createElement("div");
        node.innerHTML = str;
        ret.push.apply(ret, node.childNodes);
        return ret;
    }

    /* ====== constructor ====== */
    function Dog(selector) {
        return new Dog.fn.init(selector);
    }

    Dog.fn = Dog.prototype = {
        constructor: Dog,
        length: 0,
        init: function (selector) {
            // 如果是undefined，null，返回当前对象
            if (!selector) {
                return this;
            }

            // 字符串
            if (typeof selector === "string") {
                // 标签
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" &&
                    selector.length >= 3) {
                    ARRAY.push.apply(this, parseHTML(selector));
                    return this;
                } else {    // 选择器
                    ARRAY.push.apply(this, document.querySelectorAll(selector));
                    return this;
                }
            }

            // dom对象
            if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
                return this;
            }

            // Dog对象
            if (selector.constructor === "Dog") {
                return selector;
            }

            // function
            if (typeof selector === "function") {
                // 1. addEventListener
                // window.addEventListener("click", selector);

                // 2. 函数技巧
                if (typeof window.onload === "function") {
                    var fn = window.onload;
                    window.onload = function () {
                        fn();
                        selector();
                    }
                } else {
                    window.onload = selector;
                }

                // 3. 数组技巧
                // loads.push(selector);
            }

            // 其他情况当作数组来处理
            if (isArrayLike(selector)) {
                ARRAY.push.apply(this, selector);
                return this;
            } else {    // ??? 为什么捏？???
                this[0] = selector;
                this.length = 1;
                return this;
            }
        }
    };

    Dog.fn.init.prototype = Dog.fn;

    // Core methods
    Dog.extend = Dog.fn.extend = function (obj) {
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                this[key] = obj[key];
            }
        }
        return this;
    };

    Dog.extend({
        each: function (obj, callback) {
            var i, len;
            if (isArrayLike(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        if (callback.call(obj[i], i, obj[i]) === false) {
                            break;
                        }
                    }
                }
            }
            return obj;
        },
        map: function (obj, callback) {
            var i, len,
                result,
                ret = [];
            if (isArrayLike(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    result = callback(obj[i], i);
                    if (result != null) {
                        ret.push(result);
                    }
                }
            } else {
                for (i in obj) {
                    result = callback(obj[i], i);
                    if (result != null) {
                        ret.push(result);
                    }
                }
            }
            return ret;
        }
    });
    Dog.fn.extend({
        /* tools */
        each: function (callback) {
            return Dog.each(this, callback);
        },
        map: function (callback) {
            return Dog.map(this, callback);
        },
        pushStack: function (obj) {
            var ret = Dog(obj);
            ret.prevObj = this;
            return ret;
        },
        toArray: function () {
            return ARRAY.slice.call(this);
        },
        get: function (index) {
            return index != null ?
                (index < 0 ? this[this.length + index] : this[index]) : // 处理index为数字的情况
                ARRAY.slice.call(this);    // index为null/undefined，返回整个数组
        },
        eq: function (index) {
            return this.pushStack(this.get(index));
        },
        index: function () {
            var i = 0,
                index = 0;
            while (this[0].parentNode.childNodes[i] !== this[0]) {
                if (this[0].parentNode.childNodes[i].nodeType === 1) {
                    index++;
                }
                i++;
            }
            return index;
        },
        end: function () {
            return this.prevObj || this.constructor();
        },
        find: function (selector) {
            var ret = [];
            this.each(function () {
                ret.push.apply(ret, this.querySelectorAll(selector));
            });
            return this.pushStack(ret);
        },
        unique: function () {
            var i, len,
                ret = [],
                oriArr = this.toArray();
            for (i = 0, len = oriArr.length; i < len; i++) {
                if (ret.indexOf(oriArr[i]) === -1) {
                    ret.push(oriArr[i]);
                }
            }
            return this.pushStack(ret);
        },
        filter: function (selector) {
            var i, len,
                ret = [];
            for (i = 0, len = this.length; i < len; i++) {
                if (D(selector).toArray().indexOf(this[i]) > -1) {
                    ret.push(this[i]);
                }
            }
            return this.pushStack(ret);
        },
        /* dom */
        append: function (selector) {   // selector --> this
            D(selector).appendTo(this);
            return this;
        },
        appendTo: function (selector) { // this --> selector
            var i, j, iLen, jLen,
                tmp,
                ret = [];
            for (i = 0, iLen = this.length; i < iLen; i++) {
                for (j = 0, jLen = selector.length; j < jLen; j++) {
                    tmp = j < jLen - 1 ? this[i].cloneNode(true) : this[0];
                    D(selector)[j].appendChild(tmp);
                    ret.push(tmp);
                }
            }
            return this.pushStack(ret);
        },
        prepend: function (selector) {
            D(selector).prependTo(this);
            return this;
        },
        prependTo: function (selector) {
            var i, j, tmp, iLen, jLen,
                ret = [];
            for (i = 0, iLen = this.length; i < iLen; i++) {
                for (j = 0, jLen = selector.length; j < jLen; j++) {
                    tmp = j < jLen - 1 ? this[i].cloneNode(true) : this[0];
                    D(selector)[j].insertBefore(tmp, D(selector)[j].firstChild);
                    ret.push(tmp);
                }
            }
            return this.pushStack(ret);
        },
        remove: function () {
            this.each(function () {
                this.parentNode.removeChild(this);
            });
        },

        parent: function () {
            var parent = this[0].parentNode;
            return this.pushStack(Dog(parent && parent.nodeType !== 11 ? parent : null));    // Node.DOCUMENT_FRAGMENT_NODE(11)
        },
        children: function (selector) {
            var i, len,
                tmp = [];
            this.each(function () {
                for (i = 0, len = this.childNodes.length; i < len; i++) {
                    if (this.childNodes[i].nodeType === 1) {
                        tmp.push(this.childNodes[i]);
                    }
                }
            });
            return this.pushStack(D(tmp).filter(selector));
        },
        siblings: function () {
            var ret = [];
            ret.push.apply(ret, this.prevAll());
            ret.reverse();
            ret.push.apply(ret, this.nextAll());
            return this.pushStack(ret);
        },

        next: function () {
            return this.pushStack(Dog(sibling(this[0], "nextSibling")));
        },
        nextAll: function () {
            return this.pushStack(Dog(siblings(this[0], "nextSibling")));
        },
        prev: function () {
            return this.pushStack(Dog(sibling(this[0], "previousSibling")));
        },
        prevAll: function () {
            return this.pushStack(Dog(siblings(this[this.length - 1], "previousSibling")));
        },
        /* events */
        on: function (types, eventFn, flag) {
            var self;
            flag = flag || false;
            return this.each(function () {
                self = this;
                types.split(" ").forEach(function (item, index) {
                    self.addEventListener(item, eventFn, flag);
                });
            });
        },
        /* css */
        css: function () {
            var argus = arguments;

            if (argus.length === 1) {   // 长度为1
                if (typeof argus[0] === "object") {     // json
                    var key;
                    return this.each(function () {
                        for (key in argus[0]) {
                            if (argus[0].hasOwnProperty(key)) {
                                this.style[key] = argus[0][key];
                            }
                        }
                    });
                } else if (typeof argus[0] === "string") {    // string
                    return this.get(0).style[argus[0]] ||
                        window.getComputedStyle(this.get(0))[argus[0]];
                }
            } else if (argus.length === 2) {    // 长度为2
                return this.each(function () {
                    this.style[argus[0]] = argus[1];
                });
            }
        },
        /* class */
        /* ================================================================= */
        hasClass: function (className) {
            var has = true,
                itemClassArr = [];

            this.each(function () {
                has = true;
                itemClassArr = this.className.trim().split(" ");
                className.trim().split(" ").forEach(function (item) {
                    if (itemClassArr.indexOf(item) === -1) {
                        has = false;
                    }
                });
                if (has) {
                    return false;
                }
            });

            return has;
        },
        addClass: function (className) {
            return this.each(function () {
                var self = this,
                    addClassArr = className.trim().split(" ");

                addClassArr.forEach(function (item) {
                    if (self.className.trim().split(" ").indexOf(item) == -1) {  // 未找到
                        self.className += " " + item;
                    }
                });
            });
        },
        removeClass: function (className) {
            return this.each(function () {
                var self = this,
                    selfClassArr = this.className.trim().split(" "),
                    rmvIndex;

                className.trim().split(" ").forEach(function (item) {
                    while (true) {
                        rmvIndex = selfClassArr.indexOf(item);
                        if (rmvIndex > -1) {
                            selfClassArr.splice(rmvIndex, 1);
                        } else {
                            break;
                        }
                    }
                    self.className = selfClassArr.join(" ");
                });
            });
        },
        /* ================================================================= */
        toggleClass: function (className) {
            this.each(function () {
                D(this).hasClass(className) ? D(this).removeClass(className) : D(this).addClass(className);
            });
            return this;
        },
        /* property operate */
        attr: function () {
            var argus = arguments;

            if (argus.length === 1) {   // 长度为1
                if (typeof argus[0] === "object") {     // json
                    var key;
                    return this.each(function () {
                        for (key in argus[0]) {
                            if (argus[0].hasOwnProperty(key)) {
                                this.setAttribute(key, argus[0][key]);
                            }
                        }
                    });
                } else if (typeof argus[0] === "string") {    // string
                    return this[0].getAttribute(argus[0]);
                }
            } else if (argus.length === 2) {    // 长度为2
                return this.each(function () {
                    this.setAttribute(argus[0], argus[1]);
                });
            }
        },
        prop: function (name, value) {
            if (value !== undefined) {
                return this.each(function () {
                    this[name] = value;
                });
            } else {
                return this[0][name];
            }
        }
    });

    /* add events property */
    (function (document) {
        var key,
            events = [],
            oDiv = document.createElement("div");

        for (key in oDiv) {
            if (key.slice(0, 2) === "on") {
                events.push(key.slice(2));
            }
        }

        events.forEach(function (item) {
            Dog.fn[item] = function (eventFn) {
                return this.on(item, eventFn);
            };
        });
    })(document);

    /* html, text, val method */
    (function () {
        var obj = {
            html: "innerHTML",
            text: "innerText",
            val: "value"
        };
        Dog.each(obj, function (index, item) {
            Dog.fn[index] = function (value) {
                if (value) {
                    return this.each(function () {
                        this[item] = value;
                    });
                } else {
                    return this[0][item];
                }
            };
        });
    })();

    /* onload */
    /*var loads = [];
     window.onload = function () {
     Dog.each(function () {
     this();
     });
     };*/

    /* Expose Dog and D identifiers */
    window.Dog = window.D = Dog;
})(window);
