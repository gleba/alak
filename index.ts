export const A = {
     AStart(value?, mixer?:Function) {
        let listeners = [];
        const streamFn: AStream<typeof value> = <typeof value>function (v) {
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
            on: fn=> listeners.push(fn),
            silent: fn=>streamFn.value = fn(streamFn.value),
            promise: ()=>new Promise((done)=>streamFn.on(done)),
            end: ()=> {
                streamFn.value = null
                listeners = null
            }
        })

        if (value) streamFn(value)
        return streamFn;
    }
}