"use strict";
var A = {
    start: function (value, mixer) {
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
            on: function (fn) {
                listeners.push(fn);
                if (streamFn.value) {
                    fn(streamFn.value);
                }
            },
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
    },
    mix: function () {
        var ar = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ar[_i - 0] = arguments[_i];
        }
        var newStream = A.start();
        var active = new Map();
        var emit = function () {
            if (active.size == ar.length)
                newStream(Array.from(active));
        };
        ar.forEach(function (stream) {
            stream.on(function (data) {
                active.set(stream, data);
                emit();
            });
        });
        return newStream;
    },
    match: function (value, pattern, data) {
        var resp = value;
        if (data)
            resp = data;
        for (var _i = 0, _a = Object.keys(pattern); _i < _a.length; _i++) {
            var key = _a[_i];
            if (value == key) {
                pattern[key](resp);
                return;
            }
        }
        if (pattern["*"]) {
            pattern["*"](resp);
        }
    },
    "default": ""
};
A.default = A;
module.exports = A;
//# sourceMappingURL=index.js.map