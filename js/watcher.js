function Watcher (expOrFn, vm, updateFn) {
    this.vm = vm
    this.getter = typeof expOrFn === 'function' ? expOrFn : this.parseGetter(expOrFn)
    this.updateFn = updateFn
    this.value = this.get()
    this.update()
}

Watcher.prototype = {
    get () {
        Dep.watcher = this
        let val = this.getter(this.vm)
        Dep.watcher = null
        return val
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
    },
    update () {
        let newVal = this.getter(this.vm)
        this.updateFn(newVal, this.value)
        this.value = newVal
    }
}