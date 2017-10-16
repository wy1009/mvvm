function MVVM (options) {
    this.options = options
    this.data = options.data

    Object.keys(this.data).forEach((key) => {
        this.proxyData(key)
    })
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
    }
}