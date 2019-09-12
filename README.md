# Alak Functor  
[![npm version](https://badge.fury.io/js/alak.svg)](https://badge.fury.io/js/alak)[![travis status](https://travis-ci.org/gleba/alak.svg?branch=master)](https://travis-ci.org/gleba/alak)
[![dependencies](https://david-dm.org/gleba/alak.svg)](https://david-dm.org/gleba/alak)
[![Downloads](https://img.shields.io/npm/dt/alak.svg)](https://www.npmjs.com/package/alak)

### flow/stream   
[Functor](https://en.wikipedia.org/wiki/Function_object#In_JavaScript) is a function object containing data. Alak can transfer data to any other functions or functors when data change. 
Data is changed by passing data to the functor as argument.  
  
### inspired flyd & fantasy land
Basic functional of this library - is the one subscribe feature from [Flyd](https://github.com/paldepind/flyd#flydonfn-s) with more simplest api and sugar for [Finite State Machines](https://en.wikipedia.org/wiki/Finite-state_machine), 
where can be best alternative to 'event buses', RxJs, [kefir](https://github.com/kefirjs/kefir), etc...   
    
* Zero-dependency  
* [Atomic updates](https://github.com/gleba/alak/blob/master/tests/1_base.ts#L28)  
* [Pattern Matching](https://github.com/gleba/alak/blob/master/tests/3_pattern_maching.ts)  
* Two type of compute strategy [quantum](https://github.com/gleba/alak/blob/master/tests/2_mutate_from.ts#L24) and [holistic](https://github.com/gleba/alak/blob/master/tests/2_mutate_from.ts#L39)   
* [Meta values](https://github.com/gleba/alak/blob/master/tests/5_meta.ts)  
* Promise [async/await support](https://github.com/gleba/alak/blob/master/tests/6_warp_events.ts#L23)    
  
[See tests as examples](https://github.com/gleba/alak/blob/master/tests/)  
  
[See interface as docs](https://github.com/gleba/alak/blob/master/index.d.ts)
