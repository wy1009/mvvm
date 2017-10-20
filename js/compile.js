function Compile (el, vm) {
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el)
        this.init()
        this.$el.appendChild(this.$fragment)
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
                this.compileText(node, RegExp.$1)
            }
        })
    },
    compileText (node, exp) {
        compileUtil.text(node, exp, this.vm)
    },
    node2Fragment (el) {
        let fragment = document.createDocumentFragment();

        [].slice.call(el.childNodes).forEach((node) => {
            fragment.appendChild(node)
        })

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
    text (node, exp, vm) {
        this.bind('text', node, exp, vm)
    },
    bind (dir, node, exp, vm) {
        let updateFn = updater[`${dir}Updater`]

        new Watcher(exp, vm, (val) => {
            updateFn && updateFn(node, val)
        })
    }
}

let updater = {
    textUpdater (node, val) {
        node.textContent = typeof val === 'undefined' ? '' : val
    }
}