(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = global || self, global.A = factory());
}(this, (function () { 'use strict';

  function unwrapExports (x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var state = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FState = {
      AWAIT: 'await',
      EMPTY: 'empty',
    };
    function notifyStateListeners(atom, state, ...value) {
      if (atom.stateListeners && atom.stateListeners.has(state)) {
        atom.stateListeners.get(state).forEach(f => f.apply(f, value));
      }
    }
    exports.notifyStateListeners = notifyStateListeners;
    function addStateEventListener(atom, state, fun) {
      if (!atom.stateListeners)
        atom.stateListeners = new Map();
      if (!atom.stateListeners.has(state)) {
        let set = new Set();
        set.add(fun);
        atom.stateListeners.set(state, set);
      }
      else
        atom.stateListeners.get(state).add(fun);
    }
    exports.addStateEventListener = addStateEventListener;
    function removeStateEventListener(atom, state, fun) {
      if (atom.stateListeners && atom.stateListeners.has(state)) {
        let ase = atom.stateListeners.get(state);
        if (ase.has(fun))
          ase.delete(fun);
      }
    }
    exports.removeStateEventListener = removeStateEventListener;
  });

  unwrapExports(state);
  var state_1 = state.FState;
  var state_2 = state.notifyStateListeners;
  var state_3 = state.addStateEventListener;
  var state_4 = state.removeStateEventListener;

  var utils = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.alive = v => (v !== undefined && v !== null);
    exports.isTruth = v => !!v;
    exports.noneFilter = f => v => (!exports.alive(v) ? f(v) : null);
    exports.someFilter = f => v => (exports.alive(v) ? f(v) : null);
    exports.trueFilter = f => v => (exports.isTruth(v) ? f(v) : null);
    exports.someFalseFilter = f => v => ((exports.alive(v) && !exports.isTruth(v)) ? f(v) : null);
    exports.falseFilter = f => v => (!exports.isTruth(v) ? f(v) : null);
    exports.DECAY_ATOM_ERROR = "Attempt to pass into the decayed atom";
    exports.PROPERTY_ATOM_ERROR = "undefined atom property";
    exports.deleteParams = o => {
      Object.keys(o).forEach(k => {
        if (o[k])
          o[k] = null;
        delete o[k];
      });
    };
    function isPromise(obj) {
      return (!!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function');
    }
    exports.isPromise = isPromise;
  });

  unwrapExports(utils);
  var utils_1 = utils.alive;
  var utils_2 = utils.isTruth;
  var utils_3 = utils.noneFilter;
  var utils_4 = utils.someFilter;
  var utils_5 = utils.trueFilter;
  var utils_6 = utils.someFalseFilter;
  var utils_7 = utils.falseFilter;
  var utils_8 = utils.DECAY_ATOM_ERROR;
  var utils_9 = utils.PROPERTY_ATOM_ERROR;
  var utils_10 = utils.deleteParams;
  var utils_11 = utils.isPromise;

  var atom = createCommonjsModule(function (module, exports) {
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });


    function setAtomValue(atom, ...a) {
      let [value, context] = a;
      const setValue = finalValue => {
        if (atom.wrapperFn) {
          let wrappedValue = atom.wrapperFn(finalValue, atom.value[0]);
          if (wrappedValue.then)
            return setAsyncValue(atom, wrappedValue);
          finalValue = wrappedValue;
        }
        atom.value = [finalValue];
        notifyChildes(atom);
        return finalValue;
      };
      if (value && value.then) {
        return setAsyncValue(atom, value);
      }
      return setValue(value);
    }
    exports.setAtomValue = setAtomValue;
    function setAsyncValue(atom, promise) {
      return __awaiter(this, void 0, void 0, function* () {
        state.notifyStateListeners(atom, state.FState.AWAIT, true);
        atom._isAwaiting = promise;
        atom._isAsync = true;
        let v = yield promise;
        atom.value = [v];
        atom._isAwaiting = false;
        state.notifyStateListeners(atom, state.FState.AWAIT, false);
        // if (dev.debug) dev.updatingFinished(atom.uid, v)
        notifyChildes(atom);
        return v;
      });
    }
    function notifyChildes(atom) {
      const v = atom.value[0];
      atom.children.size > 0 && atom.children.forEach(f => f.call(atom.proxy, v));
      atom.grandChildren && atom.grandChildren.size > 0
      && atom.grandChildren.forEach((f, k) => {
        f(v);
      });
    }
    exports.notifyChildes = notifyChildes;
    function grandUpFn(atom, keyFun, grandFun) {
      if (!atom.grandChildren)
        atom.grandChildren = new Map();
      const grandUpFun = grandFun(keyFun.bind(atom.proxy));
      atom.grandChildren.set(keyFun, grandUpFun);
      const [v] = atom.value;
      v && grandUpFun(v);
    }
    exports.grandUpFn = grandUpFn;
    exports.createAtom = (...a) => {
      const atom = function () {
        if (!atom.children) {
          throw utils.DECAY_ATOM_ERROR;
        }
        if (arguments.length) {
          return setAtomValue(atom, ...arguments);
        }
        else {
          if (atom._isAwaiting) {
            return atom._isAwaiting;
          }
          if (atom.getterFn) {
            return setAtomValue(atom, atom.getterFn(), 'getter');
          }
          let v = atom.value;
          return v && v.length ? v[0] : undefined;
        }
      };
      atom.children = new Set();
      // atom.grandChildren = new Map<AnyFunction, AnyFunction>()
      // atom.stateListeners = new Map<string, Set<AnyFunction>>()
      atom.value = [];
      if (a.length) {
        atom(...a);
      }
      return atom;
    };
  });

  unwrapExports(atom);
  var atom_1 = atom.setAtomValue;
  var atom_2 = atom.notifyChildes;
  var atom_3 = atom.grandUpFn;
  var atom_4 = atom.createAtom;

  var handlers = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });



    exports.properties = {
      value() {
        return this.value.length ? this.value[0] : undefined;
      },
      isEmpty() {
        return !this.value.length;
      },
      name() {
        return this.flowName;
      },
      uid() {
        return this.uid;
      },
      id() {
        if (this.id)
          return this.id;
        else
          return this.uid;
      },
      isAsync() {
        return this._isAsync;
      },
      isComposite() {
        return !!this.getterFn;
      },
      isAwaiting() {
        return !!this._isAwaiting;
      },
    };
    exports.objectHandlers = {
      up(f) {
        this.children.add(f);
        if (this.value && this.value.length)
          f.apply(this.proxy, this.value);
        return this.proxy;
      },
      down(f) {
        if (this.children.has(f))
          this.children.delete(f);
        else if (this.grandChildren && this.grandChildren.has(f))
          this.grandChildren.delete(f);
        return this.proxy;
      },
      clear() {
        this.value = [];
        this.children.clear();
        this.grandChildren && this.grandChildren.clear();
        this.stateListeners && this.stateListeners.clear();
        this.haveFrom && delete this.haveFrom;
        return this.proxy;
      },
      decay() {
        this.proxy.clear();
        utils.deleteParams(this);
      },
    };
    exports.allHandlers = {
      clearValue() {
        state.notifyStateListeners(this, 'empty');
        this.value = [];
        return this.proxy;
      },
      onAwait(fun) {
        state.addStateEventListener(this, state.FState.AWAIT, fun);
      },
      offAwait(fun) {
        state.removeStateEventListener(this, state.FState.AWAIT, fun);
      },
      resend() {
        atom.notifyChildes(this);
        return this.proxy;
      },
      next(f) {
        this.children.add(f);
        return this.proxy;
      },
      once(f) {
        if (this.value && this.value.length)
          f.apply(this.proxy, this.value);
        else {
          const once = v => {
            f.apply(f, this.value);
            this.children.delete(once);
          };
          this.children.add(once);
        }
        return this.proxy;
      },
      is(value) {
        if (this.value && this.value.length) {
          return this.value[0] === value;
        }
        else {
          return value === undefined;
        }
      },
      upSome(fun) {
        atom.grandUpFn(this, fun, utils.someFilter);
        return this.proxy;
      },
      upTrue(fun) {
        atom.grandUpFn(this, fun, utils.trueFilter);
        return this.proxy;
      },
      upFalse(fun) {
        atom.grandUpFn(this, fun, utils.falseFilter);
        return this.proxy;
      },
      upSomeFalse(fun) {
        atom.grandUpFn(this, fun, utils.someFalseFilter);
        return this.proxy;
      },
      upNone(fun) {
        atom.grandUpFn(this, fun, utils.noneFilter);
        return this.proxy;
      },
      setId(id) {
        this.id = id;
        return this.proxy;
      },
      setName(name) {
        this.flowName = name;
        return this.proxy;
      },
      // apply(context, v) {
      //   this.bind(context)
      //   setAtomValue(this, v[0])
      // },
      addMeta(metaName, value) {
        if (!this.metaMap)
          this.metaMap = new Map();
        this.metaMap.set(metaName, value ? value : null);
        return this.proxy;
      },
      hasMeta(metaName) {
        if (!this.metaMap)
          return false;
        return this.metaMap.has(metaName);
      },
      getMeta(metaName) {
        if (!this.metaMap)
          return null;
        return this.metaMap.get(metaName);
      },
      // on(stateEvent, fn) {
      //   addStateEventListener(this, stateEvent, fn)
      //   return this.proxy
      // },
      // off(stateEvent, fn) {
      //   removeStateEventListener(this, stateEvent, fn)
      //   return this.proxy
      // },
      useGetter(getterFunction, isAsync) {
        this.getterFn = getterFunction;
        this._isAsync = isAsync;
        return this.proxy;
      },
      useOnceGet(getterFunction, isAsync) {
        this.getterFn = () => {
          delete this.getterFn;
          delete this._isAsync;
          return getterFunction();
        };
        this._isAsync = isAsync;
        return this.proxy;
      },
      useWrapper(wrapperFunction, isAsync) {
        this.wrapperFn = wrapperFunction;
        this._isAsync = isAsync;
        return this.proxy;
      },
      fmap(fun) {
        atom.setAtomValue(this, fun(...this.value));
        return this.proxy;
      },
      injectOnce(o, key) {
        if (!key) {
          key = this.flowName ? this.flowName : this.id ? this.id : this.uid;
        }
        if (!o)
          throw 'trying inject atom to null object';
        o[key] = this.value[0];
        return this.proxy;
      },
      cloneValue() {
        return this.value.length ? JSON.parse(JSON.stringify(this.value[0])) : undefined;
      },
    };
  });

  unwrapExports(handlers);
  var handlers_1 = handlers.properties;
  var handlers_2 = handlers.objectHandlers;
  var handlers_3 = handlers.allHandlers;

  var create = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });



    const handlers$1 = Object.assign(handlers.objectHandlers, handlers.allHandlers);
    /**
     * Установить расширения атома
     * @param options - {@link ExtensionOptions}
     */
    function installExtension(options) {
      options.handlers && Object.assign(handlers$1, options.handlers);
      options.properties && Object.assign(handlers.properties, options.properties);
    }
    exports.installExtension = installExtension;
    function get(atom, prop, receiver) {
      if (!atom.children) {
        throw utils.DECAY_ATOM_ERROR;
      }
      let keyFn = handlers$1[prop];
      if (keyFn)
        return keyFn.bind(atom);
      keyFn = handlers.properties[prop];
      if (keyFn)
        return keyFn.call(atom);
      throw utils.PROPERTY_ATOM_ERROR;
    }
    exports.proxyHandler = { get };
    function createObjectAtom(value) {
      const atom$1 = atom.createAtom(...arguments);
      const flow = Object.assign(atom$1, handlers.objectHandlers);
      atom$1.proxy = flow;
      atom$1.alive = true;
      return flow;
    }
    exports.createObjectAtom = createObjectAtom;
    function createProxyFlow(value) {
      const atom$1 = atom.createAtom(...arguments);
      const flow = new Proxy(atom$1, exports.proxyHandler);
      atom$1.proxy = flow;
      atom$1.uid = Math.random();
      atom$1.alive = true;
      return flow;
    }
    exports.createProxyFlow = createProxyFlow;
  });

  unwrapExports(create);
  var create_1 = create.installExtension;
  var create_2 = create.proxyHandler;
  var create_3 = create.createObjectAtom;
  var create_4 = create.createProxyFlow;

  var core = createCommonjsModule(function (module, exports) {
    /**
     * Ядро атома
     * @remarks
     * Атом - это функция-контейнер, предназначенная для множественной доставки значения контейнера
     * в дочерние функции-получатели.
     *
     * - Передача значения в функцию-атом установит значение контейнера и
     * доставит значение в функции-получатели.
     *
     * - Вызов функции-атома без аргументов - вернёт текущее
     * значение контейнера если оно есть.
     * @packageDocumentation
     */
    Object.defineProperty(exports, "__esModule", { value: true });

    var create_2 = create;
    exports.installExtension = create_2.installExtension;
    /** {@link AtomCreator} */
    exports.AC = Object.assign(create.createProxyFlow, {
      proxy: create.createProxyFlow,
      object: create.createObjectAtom,
    });
  });

  unwrapExports(core);
  var core_1 = core.installExtension;
  var core_2 = core.AC;

  var extComputed = createCommonjsModule(function (module, exports) {
    /**
     * Расширение вычисления множеств
     * @remarks
     * импорт модуля расширяет интерфейс `ProxyAtom`
     * ```typescript
     * declare module 'alak/core' {
     *   interface ProxyAtom<T> {
     *     from<A extends ProxyAtom<any>[]>(...a: A): ComputeStrategy<T, A>
     *   }
     * }
     * ```
     * Алгоритм использования:
     *
     * - аргументами функции задаются атомы-источники вычисления
     *
     * - выбирается стратегия вычисления
     *
     * - задаётся функция-вычислитель, принимающая значения атомов-источников
     *
     * - вычисленное значение функции-вычислителя устанавливается в атом контекста
     * @example
     * ```javascript
     * const a1 = A(1)
     * const a2 = A(2)
     * const computedAtom = A()
     * computedAtom.from(a1, a2).some((v1, v2) => v1 + v2)
     * console.log(computedAtom()) //output:3
     * ```
     * @public
     * @packageDocumentation
     */
    Object.defineProperty(exports, "__esModule", { value: true });



    /** Установить расширение вычисления множеств прокси-атома*/
    function installComputedExtension() {
      core.installExtension({
        handlers: {
          from,
        },
      });
    }
    exports.installComputedExtension = installComputedExtension;
    /** @internal */
    function from(...fromAtoms) {
      const atom$1 = this;
      if (atom$1.haveFrom) {
        throw `from atoms already has a assigned`;
      }
      else {
        atom$1.haveFrom = true;
      }
      let someoneIsWaiting = [];
      const addWaiter = () => new Promise(_ => someoneIsWaiting.push(_));
      const freeWaiters = v => {
        while (someoneIsWaiting.length)
          someoneIsWaiting.pop()(v);
      };
      function applyValue(mixedValue) {
        if (utils.isPromise(mixedValue)) {
          mixedValue.then(v => {
            freeWaiters(v);
            atom.setAtomValue(atom$1, v);
          });
        }
        else {
          freeWaiters(mixedValue);
          atom.setAtomValue(atom$1, mixedValue);
        }
        atom$1._isAwaiting && delete atom$1._isAwaiting;
        return mixedValue;
      }
      const makeMix = mixFn => {
        const inAwaiting = [];
        const { strong, some } = mixFn;
        const needFull = strong || some;
        let values = fromAtoms.map(a => {
          if (a.isAwaiting) {
            inAwaiting.push(a);
          }
          else if (needFull && !utils.alive(a.value)) {
            inAwaiting.push(a);
          }
          return a.value;
        });
        if (inAwaiting.length > 0) {
          atom$1.getterFn = addWaiter;
          return (atom$1._isAwaiting = addWaiter());
        }
        atom$1.getterFn = () => mixFn(...values);
        return applyValue(mixFn(...values));
      };
      const linkedValues = {};
      function weak(mixFn) {
        function mixer(v) {
          const linkedValue = linkedValues[this.id];
          if (v !== linkedValue) {
            makeMix(mixFn);
            linkedValues[this.id] = v;
          }
        }
        fromAtoms.forEach(a => {
          if (a !== atom$1.proxy) {
            linkedValues[a.id] = a.value;
            a.next(mixer);
          }
        });
        makeMix(mixFn);
        return atom$1.proxy;
      }
      function some(mixFn) {
        mixFn.some = true;
        return weak(mixFn);
      }
      function strong(mixFn) {
        let firstRun = true;
        let getting = {};
        function getterFn() {
          // console.log('---------')
          // console.log("getting", getting)
          const waiters = [];
          const values = fromAtoms.map(a => {
            let v = getting[a.id];
            if (v)
              return v;
            else
              v = a();
            if (utils.isPromise(v)) {
              waiters.push(a);
              // console.log(a.id, 'is promise')
              v.then(v => {
                getting[a.id] = v;
                linkedValues[a.id] = v;
                // console.log('resolve promise', v)
                const deepValue = getterFn();
                if (!utils.isPromise(deepValue) && firstRun) {
                  applyValue(deepValue);
                  firstRun = false;
                }
                else {
                  freeWaiters(deepValue);
                }
              });
            }
            else {
              linkedValues[a.id] = v;
            }
            return v;
          });
          // console.log("waiters", waiters.length)
          if (waiters.length > 0) {
            atom$1.getterFn = addWaiter;
            return (atom$1._isAwaiting = addWaiter());
          }
          atom$1.getterFn = getterFn;
          getting = {};
          return mixFn(...values);
        }
        function mixer(v) {
          const linkedValue = linkedValues[this.id];
          if (v !== linkedValue) {
            linkedValues[this.id] = v;
          }
        }
        fromAtoms.forEach(a => {
          if (a !== atom$1.proxy) {
            a.next(mixer);
          }
        });
        const firstValue = getterFn();
        if (!utils.isPromise(firstValue)) {
          // firstValue.then(v=>{
          //   // console.log("first value")
          //   // applyValue(v)
          // })
          // } else {
          applyValue(firstValue);
        }
        return atom$1.proxy;
      }
      return {
        some,
        weak,
        strong,
      };
    }
    exports.from = from;
  });

  unwrapExports(extComputed);
  var extComputed_1 = extComputed.installComputedExtension;

  var extMatching = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function installMatchingExtension() {
      create.installExtension({
        handlers: {
          match,
        },
      });
    }
    exports.installMatchingExtension = installMatchingExtension;
    function isFunction(functionToCheck) {
      return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
    function parsePattern(pattern) {
      let o = { else: null, map: new Map(), json: {}, fn: [] };
      let pair = {};
      pattern.forEach((part, i) => {
        // console.log(i, part, typeof part)
        if (!(i % 2)) {
          switch (typeof part) {
            case 'function':
              if (pattern.length - 1 == i) {
                o.else = part;
              }
              else
                pair = { type: 'fun', part };
              break;
            case 'object':
              pair = { type: 'json', part, json: JSON.stringify(part) };
              break;
            default:
              pair = { type: 'key', part };
          }
        }
        else {
          switch (pair.type) {
            case 'fun':
              o.fn.push([pair.part, part]);
              break;
            case 'json':
              o.json[pair.json] = part;
              o.map.set(pair.part, part);
            case 'key':
              o.map.set(pair.part, part);
          }
        }
      });
      return o;
    }
    function match(...pattern) {
      const matcher = matching(...pattern);
      this.proxy.up(matcher);
    }
    exports.match = match;
    function matching(...args) {
      if (args.length >= 2) {
        let pattern = parsePattern(args);
        return (...value) => {
          let v = value[0];
          let matchFn;
          if (pattern.map.has(v)) {
            matchFn = pattern.map.get(v);
          }
          if (!matchFn)
            pattern.fn.forEach(([f, mf]) => {
              if (f(v))
                matchFn = mf;
            });
          if (!matchFn && typeof v === 'object') {
            matchFn = pattern.json[JSON.stringify(v)];
          }
          if (!matchFn && pattern.else)
            matchFn = pattern.else;
          if (matchFn)
            matchFn.apply(matchFn, value);
        };
      }
      else {
        const a = args[0];
        if (isFunction(a)) {
          let fn = a;
          return (...value) => {
            let pattern = fn.apply(fn, value);
            let runFns = [];
            pattern.forEach((v, i) => {
              let lastPattern = pattern[i - 1];
              if (isFunction(v) && lastPattern && !isFunction(lastPattern))
                runFns.push(v);
            });
            if (runFns.length == 0) {
              let l = pattern.length;
              if (isFunction(pattern[l - 1]) && isFunction(pattern[l - 2])) {
                runFns.push(pattern[l - 1]);
              }
            }
            runFns.forEach(f => f.apply(fn, value));
          };
        }
      }
    }
  });

  unwrapExports(extMatching);
  var extMatching_1 = extMatching.installMatchingExtension;
  var extMatching_2 = extMatching.match;

  var facade = createCommonjsModule(function (module, exports) {
    /**
     * Корневой модуль библиотеки.
     * @remarks
     * Сборка всех частей библиотеки в {@link AConstant| A} константе.
     *
     * Импорт модуля устанавливает все модули-расширения библиотеки.
     * @public
     * @packageDocumentation
     */
    Object.defineProperty(exports, "__esModule", { value: true });




    extComputed.installComputedExtension();
    extMatching.installMatchingExtension();
    /**{@link AConstant}*/
    exports.A = Object.assign(core.AC, {
      getOnce(getterFun) {
        return exports.A().useOnceGet(getterFun);
      },
      getter(getterFun) {
        const a = exports.A();
        a.useGetter(getterFun);
        return a;
      },
      wrap(wrapperFun) {
        return exports.A().useWrapper(wrapperFun);
      },
      from(...atoms) {
        const a = exports.A();
        return a.from(...atoms);
      },
      id(id, v) {
        const a = exports.A().setId(id);
        utils.alive(v) && a(v);
        return a;
      }
    });
    exports.default = exports.A;
  });

  unwrapExports(facade);
  var facade_1 = facade.A;

  var umd = createCommonjsModule(function (module, exports) {
    // import A from '../facade'
    // import { installExtension } from '../core'
    //
    // // export const id = A.id
    // // export const wrap = A.wrap
    // // export const from = A.from
    // // export const getOnce = A.getOnce
    // // export const getter = A.getter
    // // export const object = A.object
    // // export const call = A.call
    // // export const proxy = A.proxy
    //
    // // export const installAtomExtension = installExtension
    //
    //
    //
    // function fx() {
    //   return "fun"
    // }
    //
    // fx.ok = "ok"
    //
    //
    // const ff = Object.assign(fx, {
    //   mx:"mx"
    // })
    // export default ff
    var __importDefault = (this && this.__importDefault) || function (mod) {
      return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    const facade_1 = __importDefault(facade);
    exports.default = facade_1.default;
  });

  var index = unwrapExports(umd);

  return index;

})));
