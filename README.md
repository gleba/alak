# Alak is Flow Functor  

[![npm version](https://badge.fury.io/js/alak.svg)](https://badge.fury.io/js/alak)  
[![travis status](https://travis-ci.org/gleba/alak.svg?branch=master)](https://travis-ci.org/gleba/alak)  
[![dependencies](https://david-dm.org/gleba/alak.svg)](https://david-dm.org/gleba/alak)  
[![Downloads](https://img.shields.io/npm/dt/alak.svg)](https://www.npmjs.com/package/alak)  

Functor is a function containing data that can transfer its data to any other functions when changing data. 
Data is changed by passing data to the functor as an argument.  
  
* Zero-dependency  
* [Atomic updates](https://github.com/gleba/alak/blob/master/tests/1_base.ts#L31)  
* [Pattern Matching](https://github.com/gleba/alak/blob/master/tests/3_pattern_maching.ts)  
* Two type of compute strategy [quantum](https://github.com/gleba/alak/blob/master/tests/2_mutate_from.ts#L24) and [holistic](https://github.com/gleba/alak/blob/master/tests/2_mutate_from.ts#L39)   
* [Meta values](https://github.com/gleba/alak/blob/master/tests/5_meta.ts)  
* Promise [async/await support](https://github.com/gleba/alak/blob/master/tests/6_warp_events.ts#L23)  
  
  
  
This Ideas of the future is prefect for state machines. Maybe the best alternative to 'event buses' and RxJs, etc...   
  
[See tests as examples](https://github.com/gleba/alak/blob/master/tests/)  
  
[See interface as docs](https://github.com/gleba/alak/blob/master/index.d.ts)
