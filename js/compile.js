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
                this.compileElement(node)
                this.compile(node)
            } else if (this.isElementText(node) && reg.test(node.textContent)) {
                // RegExp.$1为匹配成功后，匹配成功结果的第一个
                this.compileText(node, RegExp.$1)
            }
        })
    },
    compileElement (node) {
        let attrs = node.attributes;
        [].slice.call(attrs).forEach((attr) => {
            let attrName = attr.name,
                dir = attrName.slice(2),
                exp = attr.value
            if (this.isDirective(attrName)) {
                if (this.isEventDirective(attrName)) {
                    compileUtil.event(node, dir, exp, this.vm)
                } else {
                    compileUtil[dir](node, exp, this.vm)
                }
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
    },
    isDirective (attr) {
        return attr.indexOf('v-') !== -1
    },
    isEventDirective (attr) {
        return attr.indexOf('v-on') !== -1
    }
}

// 指令处理集合
let compileUtil = {
    text (node, exp, vm) {
        this.bind('text', node, exp, vm)
    },
    html (node, exp, vm) {
        this.bind('html', node, exp, vm)
    },
    model (node, exp, vm) {
        node.addEventListener('input', (e) => {
            this._setVal(vm, exp, e.target.value)
        })
    },
    event (node, dir, exp, vm) {
        let eventName = dir.split(':')[1]

        node.addEventListener(eventName, (e) => {
            vm.options.methods && vm.options.methods[exp].call(vm, e)
        })
    },
    bind (dir, node, exp, vm) {
        let updateFn = updater[`${dir}Updater`]

        new Watcher(exp, vm, (val) => {
            updateFn && updateFn(node, val)
        })
    },
    _setVal (vm, exp, val) {
        let exps = exp.split('.'),
            obj = vm

        exps.forEach((key, i) => {
            if (i === exps.length - 1) {
                obj[key] = val
            } else {
                obj = obj[key]
            }
        })
    }
}

let updater = {
    textUpdater (node, val) {
        node.textContent = typeof val === 'undefined' ? '' : val
    },
    htmlUpdater (node, val) {
        node.innerHTML = typeof val === 'undefined' ? '' : val
    }
}