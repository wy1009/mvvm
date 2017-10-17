function MVVM (options) {
    this.options = options
    this.data = options.data

    Object.keys(this.data).forEach((key) => {
        this.proxyData(key)
    })

    this.initComputed()

    observe(this.data)
}

MVVM.prototype = {
    proxyData (key) {
        Object.defineProperty(this, key, {
            get: () => {
                return this.data[key]
            },
            set: (val) => {
                this.data[key] = val
            }
        })
    },
    initComputed () {
        let computed = this.options.computed
        Object.keys(computed).forEach((key) => {
            Object.defineProperty(this, key, {
                get: typeof computed[key] === 'function' ? computed[key] : computed[key].get
            })
        })
    }
}