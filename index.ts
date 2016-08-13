const A = {
    start(value?, mixer?: Function) {
        let listeners = [];
        const streamFn: _AStream<typeof value> = <typeof value>function (v) {
            const updateValue = (v)=> {
                if (mixer) v = mixer(v)
                streamFn.value = v;
                listeners.forEach(f=>f(v));
            }
            if (v) {
                if (v.then) v.then(updateValue)
                else updateValue(v)
            }
            return streamFn.value;
        };

        Object.assign(streamFn, {
            on: fn=> {
                listeners.push(fn)
                if (streamFn.value) {
                    fn(streamFn.value)
                }
            },
            silent: fn=>streamFn.value = fn(streamFn.value),
            promise: ()=>new Promise((done)=>streamFn.on(done)),
            end: ()=> {
                streamFn.value = null
                listeners = null
            }
        })

        if (value) streamFn(value)
        return streamFn;
    },
    mix(...ar){
        let newStream = A.start()
        let active = new Map()
        const emit = () => {
            if (active.size == ar.length)
                newStream(Array.from(active))
        }

        ar.forEach(
            stream=> {
                stream.on(
                    data=> {
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
    "default": ""
}

A.default = A
export = A