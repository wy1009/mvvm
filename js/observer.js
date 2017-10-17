function Observer (data) {
    this.data = data
    Object.keys(data).forEach((key) => {
        this.defineReactive(key, data[key])
    })
}

Observer.prototype = {
    defineReactive (key, val) {
        observe(val)
        Object.defineProperty(this.data, key, {
            get: () => {
                console.log(`get ${key}, it's value is ${val}`)
                return val
            },
            set: (newVal) => {
                if (newVal !== val) {
                    console.log(`set ${key}, old value is ${val}, new value is ${newVal}`)
                    val = newVal
                    observe(newVal)
                }
            }
        })
    }
}

function observe (data) {
    if (typeof data !== 'object') {
        return
    }

    new Observer(data)
}