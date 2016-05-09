/*
 * 选择类
 */
var NZSelect = (function () {
    var nzselect = function (opations) {
        this.queue = [];
        this.state = 0;//0:lock;1:runing;2:ok;
        this.nextIdx = -1;
        this.nowIdx = -1;
        this.lists = [];
        this.events = {};
        this.doms = {
            parent: document.createElement("div"),
            body: document.createElement("div"),
            title: document.createElement("h4")
        };
        this.on("hide", function () {
            if (this.nextIdx != -1) {
                this.lists[this.nowIdx].box.classList.remove("show");
                this.nowIdx = -1;
                this.show(this.nextIdx);
            }
        });
        //生成html结构
        /* <div class="nzselect"><div><h4></h4><ul><li></li></ul></div></div>*/
        this.doms.parent.classList.add("nzselect");
        this.doms.body.appendChild(this.doms.title);
        this.doms.parent.appendChild(this.doms.body);
        this.doms.parent.addEventListener("webkitTransitionEnd", function () {
            if (!this.doms.parent.classList.contains("show")) {
                //隐藏触发
                this.doms.body.classList.remove("show");
                this.__triggerEvent("hide");
            }
        }.bind(this), false);
        this.doms.body.addEventListener("webkitTransitionEnd", function (e) {
            if (e.target != this.doms.body) return;
            if (this.doms.body.classList.contains("show")) {
                this.__triggerEvent("show");
            } else {
                this.__triggerEvent("hide");
            }
        }.bind(this), false);
        //配置参数
        if (opations) {
            this.on("show", opations["onShow"]);
            this.on("hide", opations["onHide"]);
            this.on("close", opations["onClose"]);
        }
        document.body.appendChild(this.doms.parent);
        return this;
    }
    nzselect.prototype.on = function (event, listener) {
        if (!event || !listener) return this;
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return this;
    }
    nzselect.prototype.__triggerEvent = function (event) {
        if (this.events[event]) {
            for (var i = 0; i < this.events[event].length; i++) {
                this.events[event][i].bind(this).apply();
            }
        }
        return this;
    }
    nzselect.prototype.push = function (opations) {
        if (!opations) return this;
        this.lists.push({
            id: opations.id,
            show: opations.show,
            title: opations.title,
            items: opations.items,
            box: document.createElement("ul")
        });
        var df = document.createDocumentFragment(), lastIdx = this.lists.length - 1;
        this.lists[lastIdx].box.setAttribute("id", this.lists[lastIdx].id);
        for (var i = 0; i < this.lists[lastIdx].items.length; i++) {
            df.appendChild(document.createElement("li"));
            df.lastChild.appendChild(document.createTextNode(this.lists[lastIdx].items[i]));
        }
        this.lists[lastIdx].box.appendChild(df);
        this.doms.body.appendChild(this.lists[lastIdx].box);
        return this;
    }
    nzselect.prototype.getIdx = function (id) {
        if (typeof(id) != "string") return -1;
        if (this.lists && this.lists.length) {
            for (var i = 0; i < this.lists.length; i++) {
                if (this.lists[i].id == id) {
                    return i;
                }
            }
        }
        return -1;
    }
    nzselect.prototype.show = function (id) {
        if (this.nextIdx == -1) {
            if (typeof(id) == "string") {
                this.nextIdx = this.getIdx(id);
            } else {
                this.nextIdx = parseInt(id);
            }
            if (isNaN(this.nextIdx) ||
                this.nextIdx < 0 ||
                this.nextIdx >= this.lists.length ||
                this.nextIdx == this.nowIdx) {
                this.nextIdx = -1;
                return this
            }
        }
        if (this.nowIdx != -1) {
            this.doms.body.classList.remove("show");
        } else {
            this.doms.title.innerHTML = this.lists[this.nextIdx].title;
            this.doms.parent.classList.add("show");
            this.doms.body.classList.add("show");
            this.lists[this.nextIdx].box.classList.add("show");
            this.nowIdx = this.nextIdx;
            this.nextIdx = -1;
        }
        return this;
    }
    nzselect.prototype.close = function () {
        //是否已显示列表
        if (this.nowIdx != -1) {
            this.doms.parent.classList.remove("show");
        }
        this.nowIdx = -1;
        return this;
    }
    return nzselect;
})();