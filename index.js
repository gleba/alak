"use strict";
exports.A = {
    AStart: function (value, mixer) {
        var listeners = [];
        var streamFn = function (v) {
            var updateValue = function (v) {
                if (mixer)
                    v = mixer(v);
                streamFn.value = v;
                listeners.forEach(function (f) { return f(v); });
            };
            if (v) {
                if (v.then)
                    v.then(updateValue);
                else
                    updateValue(v);
            }
            return streamFn.value;
        };
        Object.assign(streamFn, {
            on: function (fn) { return listeners.push(fn); },
            silent: function (fn) { return streamFn.value = fn(streamFn.value); },
            promise: function () { return new Promise(function (done) { return streamFn.on(done); }); },
            end: function () {
                streamFn.value = null;
                listeners = null;
            }
        });
        if (value)
            streamFn(value);
        return streamFn;
    }
};
//# sourceMappingURL=index.js.map