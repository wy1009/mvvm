function Compile (el, vm) {
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el)
        this.init()
    }
}

Compile.prototype = {
    init () {
        this.compile(this.$fragment)
    },
    compile (el) {
        let reg = /\{\{(.*)\}\}/;
        [].slice.call(el.childNodes).forEach((node) => {
            if (this.isElementNode(node)) {
                this.compile(node)
            } else if (this.isElementText(node) && reg.test(node.textContent)) {
                // RegExp.$1为匹配成功后，匹配成功结果的第一个
                this.compileText(RegExp.$1)
            }
        })
    },
    compileText (exp) {
        compileUtil.text(exp, this.vm)
    },
    node2Fragment (node) {
        let fragment = document.createDocumentFragment()
        fragment.appendChild(node)

        return fragment
    },
    isElementNode (node) {
        return node.nodeType === 1
    },
    isElementText (node) {
        return node.nodeType === 3
    }
}

// 指令处理集合
let compileUtil = {
    text (exp, vm) {
        this.bind('text', exp, vm)
    },
    bind (dir, exp, vm) {
        new Watcher(exp, vm)
    }
}