// import {AStream} from "./index";
"use strict";
function assign(target, source) {
    Object.keys(source).forEach(function (k) { return target[k] = source[k]; });
}
function start(value, mixer) {
    var _this = this;
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
        match: function () {
            var patertn = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                patertn[_i - 0] = arguments[_i];
            }
            var keys = [];
            var fn = [];
            for (var i = 0; i < patertn.length; i++) {
                keys.push(patertn[i]);
                i++;
                fn.push(patertn[i]);
                if (!patertn[i]) {
                    throw "A.match " + keys[i - 1] + " function is null" + _this;
                }
            }
            // console.log(keys,fn)
            var isMatch = function (v) { return function (element, index, array) {
                if (element == v) {
                    fn[index](v);
                    return true;
                }
                return false;
            }; };
            listeners.push(function (v) {
                if (!keys.some(isMatch(v))) {
                    if (keys.indexOf("*") >= 0) {
                        fn[keys.indexOf("*")](v);
                    }
                }
            });
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
    matchFn: function () {
        var pattern = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pattern[_i - 0] = arguments[_i];
        }
        return function (values) {
            var anyFn;
            var vs = values.toString();
            pattern.some(function (v) {
                var pvs = v[0].toString();
                if (vs == pvs) {
                    v[1](values);
                    return true;
                }
                if (v[0] == "*")
                    anyFn = v[1];
                return false;
            });
            if (anyFn)
                anyFn(values);
        };
    },
    // return: (value, pattern, data) => {
    //     console.log("x")
    //
    // },
    assign: assign,
    "default": ""
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.A;
// export default A 
//# sourceMappingURL=index.js.map