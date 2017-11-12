// import {AStream} from "./index";


function assign(target, source) {
    Object.keys(source).forEach(k => target[k] = source[k])
}


function remove(target, value) {
    let idx = target.indexOf(value);
    if (idx != -1) {
        // Второй параметр - число элементов, которые необходимо удалить
        return target.splice(idx, 1);
    }
    return false;
}

const vnorm = (v) => {
    // console.log("vnorm", v, v.length > 2, v.length)
    if (Array.isArray(v) && v.length > 1) {
        return v
    } else if (Array.isArray(v) && v.length == 1) {
        // console.log("xx", v[0])
        return v[0]
    } else if (Array.isArray(v) && v.length == 0) {
        return null
    } else {
        return v
    }
}
const vfn = (fn, v) => {
    if (v != null) {
        if (Array.isArray(v))
            fn(...v)
        else fn(v)
    }
}


const deleteParams = o => {
    Object.keys(o).forEach(k => {
        if (o[k]) o[k] = null
        delete o[k]
    })
}

function start(...value) {

    let listeners = [];
    let onceListiners = []
    let runFN = (...v) => {
        const updateValue = (v) => {
            proxy.value = vnorm(v)
            listeners.forEach(f => vfn(f, v))
            if (onceListiners.length > 0)
                while (onceListiners.length)
                    vfn(onceListiners.shift(), v)
        }
        if (v != null && v.length > 0) {
            if (v.then != null) v.then(updateValue) // Promise support
            else updateValue(v)
        }
        return proxy.value;
    };
    let proxy: any = (...v) => {
        if (!runFN) {
            console.error("call ended stream", ...v)
            return "THE END OF STREAM"
        }
        return runFN(...v)
    };

    const end = () => {
        deleteParams(runFN)
        deleteParams(proxy)
        listeners = null
        onceListiners = null
        runFN = null
        proxy = null
    }

    assign(proxy, {
        branch: fn => {
            let s = start()
            listeners.push(f =>
                s(fn(f))
            )
            return s
        },
        on: fn => {
            listeners.push(fn)
            vfn(fn, proxy.value)
        },
        matchIn(inVar) {
            return (...pattern) => {
                let keys = []
                let fn = []
                for (let i = 0; i < pattern.length; i++) {
                    keys.push(pattern[i])
                    i++
                    fn.push(pattern[i])
                    if (!pattern[i]) {
                        throw "A.match " + keys[i - 1] + " function is null" + this
                    }
                }

                // console.log(keys,fn)
                let isMatch = (v) => (element, index, array) => {
                    if (element == v[inVar]) {
                        fn[index](v)
                        return true
                    }
                    return false
                }
                listeners.push((v) => {
                    if (!keys.some(isMatch(v))) {
                        if (keys.indexOf("*") >= 0) {
                            fn[keys.indexOf("*")](v)
                        }
                    }
                })
            }
        },
        match: (...pattern) => {
            let keys = []
            let fn = []
            for (let i = 0; i < pattern.length; i++) {
                keys.push(pattern[i])
                i++
                fn.push(pattern[i])

                if (!pattern[i]) {
                    throw "A.match " + keys[i - 1] + " function is null" + this
                }
            }

            // console.log(keys,fn)
            let isMatch = (v) => (element, index, array) => {
                if (element == v) {
                    fn[index](v)
                    return true
                }
                return false
            }
            let mfn = (v) => {
                if (!keys.some(isMatch(v))) {
                    if (keys.indexOf("*") >= 0) {
                        fn[keys.indexOf("*")](v)
                    }
                }
            }
            listeners.push(mfn)
            if (proxy.value) vfn(mfn, proxy.value)
        },
        once: fn => {
            if (proxy.value != null) {
                fn(proxy.value)
            } else {
                onceListiners.push(fn)
            }
        },
        silent: fn => proxy.value = fn(proxy.value),
        end,
        stop: (fn) => {
            remove(listeners, fn)
        }
    })

    // console.log(value)

    if (value != null && value.length > 0) proxy(...value)
    return proxy;
}

export const A = {
    once(come: Function) {
        let wave = start()
        come((v) => {
            wave(v)
            wave.end()
        })
        return wave
    },
    start: start,
    mix(...ar) {
        let newStream = A.start()
        let active = new Map()
        const emit = () => {
            if (active.size == ar.length)
                newStream(Array.from(active.values()))
        }

        ar.forEach(
            stream => {
                stream.on(
                    data => {
                        active.set(stream, data)
                        emit()
                    }
                )
            }
        )
        return newStream
    },

    match(value, pattern, data): void {
        let resp = value
        if (data) resp = data
        for (let key of Object.keys(pattern)) {
            if (value == key) {
                pattern[key](resp)
                return
            }
        }
        if (pattern["*"]) {
            pattern["*"](resp)
        }
    },
    matchFn(...pattern) {
        return (values) => {
            let anyFn
            let vs = values.toString()
            pattern.some(v => {
                let pvs = v[0].toString()
                if (vs == pvs) {
                    v[1](values)
                    return true
                }
                if (v[0] == "*") anyFn = v[1]
                return false
            })
            if (anyFn) anyFn(values)
        }
    },
    assign: assign,
    "default": ""
}


// A.default = A
export default A
// export default A