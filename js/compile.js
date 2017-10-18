function Compile (el) {
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
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
                this.compileText(node, RegExp.$1)
            }
        })
    },
    compileText (node, exp) {

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