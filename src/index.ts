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

function start(...value) {
    let listeners = [];
    let onceListiners = []
    // console.log("A.start")
    let streamFn: any = (...v) => {
        // console.log("A.streamFn.in.v:", v)
        const updateValue = (v) => {
            // console.log(v, vnorm(v))

            streamFn.value = vnorm(v)
            // console.log("A.streamFn.in.updateValue",v)
            listeners.forEach(f => vfn(f, v))
            if (onceListiners.length > 0)
                while (onceListiners.length)
                    vfn(onceListiners.shift(), v)
        }
        if (v != null && v.length > 0) {
            // console.log('change')
            if (v.then != null) v.then(updateValue) // Promise support
            else updateValue(v)
        }


        return streamFn.value;
    };

    assign(streamFn, {
        branch: fn => {
            let s = start()
            listeners.push(f =>
                s(fn(f))
            )
            return s
        },
        on: fn => {
            listeners.push(fn)
            vfn(fn, streamFn.value)
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
            if (streamFn.value) vfn(mfn, streamFn.value)
        },
        once: fn => {
            if (streamFn.value != null) {
                fn(streamFn.value)
            } else {
                onceListiners.push(fn)
            }
        },
        silent: fn => streamFn.value = fn(streamFn.value),
        end: () => {
            streamFn.value = null
            console.log(listeners)
            listeners = null
            streamFn = null
        },
        stop: (fn) => {
            remove(listeners, fn)
        }
    })

    // console.log(value)

    if (value != null && value.length > 0) streamFn(...value)
    return streamFn;
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