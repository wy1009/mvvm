function MVVM (options) {
    this.options = options
    this.data = options.data

    // Object.keys()可以只遍历该对象的属性，而for...in则会将对象原型链上的自定义添加属性也遍历出来
    Object.keys(this.data).forEach((key) => {
        this.proxyData(key)
    })

    this.initComputed()

    observe(this.data)

    new Compile(options.el, this)
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