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
                return val
            },
            set: (newVal) => {
                if (newVal !== val) {
                    val = newVal
                    dep.notify()
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
    notify () {
        this.watchers.forEach((watcher) => {
            watcher.update()
        })
    }
}