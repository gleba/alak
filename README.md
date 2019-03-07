
# A Proxy Functor
### Fantasy DataFlow 
[![npm version](https://badge.fury.io/js/alak.svg)](https://badge.fury.io/js/alak)
[![travis status](https://travis-ci.org/gleba/alak.svg?branch=master)](https://travis-ci.org/gleba/alak)
[![dependencies](https://david-dm.org/gleba/alak.svg)](https://david-dm.org/gleba/alak)
[![Downloads](https://img.shields.io/npm/dt/alak.svg)](https://www.npmjs.com/package/alak)

Atomic updates.
Pattern Matching.
Zero-dependency.
Prefect for state machines.
Easy and fast.

[examples](https://github.com/gleba/alak/blob/master/tests/)

```javascript
  (...a: T[]): T;
```

-  Witch arguments:,
-  set flow value and notify child listiners,
-  Without arguments :,
-  return current flow value
```javascript
  v: T;
```

-  Get Value,
-  get current flow value
```javascript
  imv: T;
```

-  Immutable,
-  get value clone
```javascript
  id: any;
```

-  Get id,
-  only if `setId` has been inited
```javascript
  o: any;
```

-  Meta object data
```javascript
  data: T[];
```

-  Get value flow as array arguments
```javascript
  immutable: T;
```

-  Make created flow always immutable
```javascript
  meta(...meta: string[]): AFlow<T>;
```

-  ...maybe depricated,
-  Set flow meta name,
-  just call if need enable it,
```javascript
  isMeta(metaName: string): Boolean;
```

-  Check flow meta name,
```javascript
  isFlow(key?: any): Boolean;
```

-  Check object is flow,
```javascript
  isValue(value?: any): Boolean;
```

-  Check Value,
-  same as flow.v === value,
```javascript
  on(fn: Listener<T>): AFlow<T>;
```

-  Add edge,
-  subscribe listener,
-  call function on every flow date update,
-  `f.on(v=>...)`,
```javascript
  im(fn: Listener<T>): AFlow<T>;
```

-  Add Immutable edge,
-  subscribe listener,
-  call function on every flow date update,
-  with clone value,
```javascript
  off(fn: Listener<T>): AFlow<T>;
```

-  Remove edge,
-  unsubscribe listener,
-  same as `stop`,
```javascript
  stop(fn: any): void;
```

-  Remove edge,
-  unsubscribe listener,
-  same as `off`,
```javascript
  stateless(v?: boolean): AFlow<T>;
```

-  Make flow as eventbus,
-  do not save values and data in flow,
-  set true if need enable it,
```javascript
  emitter(v?: boolean): AFlow<T>;
```

-  Make flow as dispatcher,
-  notify all edges/listeners when call flow() without arguments,
-  set true if need enable it,
```javascript
  end(): void;
```

-  Destroy flow,
-  remove all data,
-  kill object
```javascript
  emit(): void;
```

-  Notify all edges/listeners with empty data value
```javascript
  silent(...a: T[]): T;
```

-  Updtate data without notify edges/listeners,
```javascript
  match(...pattern: any[]): any;
```

-  Patterm maching,
  ```,
  flow.match(,
     1, ()=>oneFunction(),,
     2, v => v===2 ,,
     v=>elseFuntion(),
  ),
  ```,
  
```javascript
  mutate(fn: Listener<T>): T;
```

-  Mutate data value,
-  and notify edges/listeners, 
  ```,
  flow.mutate(v=>v+1),
  ```,
```javascript
  branch<U>(fn: (...a: any[]) => U[]): AFlow<any>;
```

-  Create new flow edged on current,
```javascript
  drop(): void;
```

-  Remove all injections
```javascript
  inject(obj: any, key?: string): void;
```

-  Bind key in object to flow data value,
```javascript
  reject(obj: any): void;
```

-  Unbind injected object,
```javascript
  setId(name: string): void;
```

-  set id param to flow,
```javascript
  setMetaObj(obj: any): void;
```

-  set any meta data as object in flow,
