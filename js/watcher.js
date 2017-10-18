function Watcher (expOrFn) {
    this.getter = typeof expOrFn === 'function' ? expOrFn : this.parseGetter(expOrFn)

    
}

Watcher.prototype = {
    parseGetter (exp) {
        return (obj) => {
            let exps = exp.split('.')

            exps.forEach((key) => {
                if (typeof obj !== 'object') {
                    return
                }
                obj = obj[key]
            })

            return obj // 此时返回的是一个最终值，不一定是Object类型
        }
    }
}