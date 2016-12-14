// import {AStream} from "./index";



function assign(target, source) {
    Object.keys(source).forEach(k => target[k] = source[k])
}

function start(value?, mixer?: Function) {
    let listeners = [];
    let onceListiners = []
    let streamFn: any = (v) => {
        const updateValue = (v) => {
            if (mixer) v = mixer(v)
            streamFn.value = v
            listeners.forEach(f => f(v))
            if (onceListiners.length > 0)
                while (onceListiners.length)
                    onceListiners.shift()(v)
        }
        if (v != null) {
            if (v.then != null) v.then(updateValue)
            else updateValue(v)
        }
        return streamFn.value;
    };

    assign(streamFn, {
        on: fn => {
            listeners.push(fn)
            if (streamFn.value != null) {
                fn(streamFn.value)
            }
        },
        match: (...patertn) => {
            let keys = []
            let fn = []
            for (let i = 0; i < patertn.length; i++) {
                keys.push(patertn[i])
                i++
                fn.push(patertn[i])

                if (!patertn[i]) {
                    throw "A.match "+ keys[i-1] + " function is null" + this
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
            listeners.push((v) => {
                if (!keys.some(isMatch(v))) {
                    if (keys.indexOf("*")>=0) {
                        fn[keys.indexOf("*")](v)
                    }
                }
            })
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
            listeners = null
            streamFn = null
        }
    })

    if (value != null) streamFn(value)
    return streamFn;
}

export const A = {
    once(come: Function){
        let wave = start()
        come((v) => {
            wave(v)
            wave.end()
        })
        return wave
    },
    start: start,
    mix(...ar){
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
    matchFn(...pattern){
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
    // return: (value, pattern, data) => {
    //     console.log("x")
    //
    // },
    assign: assign,
    "default": ""
}


// A.default = A
export default A
// export default A