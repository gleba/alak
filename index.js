"use strict";
function assign(target, source) {
    Object.keys(source).forEach(function (k) { return target[k] = source[k]; });
}
function start(value, mixer) {
    var listeners = [];
    var onceListiners = [];
    var streamFn = function (v) {
        var updateValue = function (v) {
            if (mixer)
                v = mixer(v);
            streamFn.value = v;
            listeners.forEach(function (f) { return f(v); });
            if (onceListiners.length > 0)
                while (onceListiners.length)
                    onceListiners.shift()(v);
        };
        if (v != null) {
            if (v.then != null)
                v.then(updateValue);
            else
                updateValue(v);
        }
        return streamFn.value;
    };
    assign(streamFn, {
        on: function (fn) {
            listeners.push(fn);
            if (streamFn.value != null) {
                fn(streamFn.value);
            }
        },
        once: function (fn) {
            if (streamFn.value != null) {
                fn(streamFn.value);
            }
            else {
                onceListiners.push(fn);
            }
        },
        silent: function (fn) { return streamFn.value = fn(streamFn.value); },
        end: function () {
            streamFn.value = null;
            listeners = null;
            streamFn = null;
        }
    });
    if (value != null)
        streamFn(value);
    return streamFn;
}
exports.A = {
    once: function (come) {
        var wave = start();
        come(function (v) {
            wave(v);
            wave.end();
        });
        return wave;
    },
    start: start,
    mix: function () {
        var ar = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ar[_i - 0] = arguments[_i];
        }
        var newStream = exports.A.start();
        var active = new Map();
        var emit = function () {
            if (active.size == ar.length)
                newStream(Array.from(active.values()));
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
    assign: assign,
    "default": ""
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.A;
// export default A 
//# sourceMappingURL=index.js.map