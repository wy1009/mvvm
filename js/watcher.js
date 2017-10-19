let uid = 0

function Watcher (expOrFn, vm) {
    this.uid = uid ++
    this.vm = vm
    this.getter = typeof expOrFn === 'function' ? expOrFn : this.parseGetter(expOrFn)
    this.get()
}

Watcher.prototype = {
    get () {
        Dep.watcher = this
        this.getter(this.vm)
        Dep.watcher = null
    },
    parseGetter (exp) {
        return (obj) => {
            let exps = exp.split('.')

            exps.forEach((key) => {
                obj = obj[key]
                if (typeof obj !== 'object') {
                    return
                }
            })

            return obj // 此时返回的是一个最终值，不一定是Object类型
        }
    }
}