function Observer (data) {
    this.data = data
    Object.keys(data).forEach((key) => {
        this.defineReactive(key, data[key])
    })
}

Observer.prototype = {
    defineReactive (key, val) {
        observe(val)
        let dep = new Dep()
        Object.defineProperty(this.data, key, {
            get: () => {
                if (Dep.watcher) {
                    dep.addWatcher(Dep.watcher)
                }
                dep.consoleWatcher()
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

function Dep () {
    this.watchers = []
}

Dep.prototype = {
    addWatcher (dep) {
        this.watchers.push(dep)
    },
    consoleWatcher () {
        console.log(this.watchers, 'watcher')
    }
}