[My project title](../README.md) > ["index"](../modules/_index_.md)



# External module: "index"

## Index

### Classes

* [DInjectableFlow](../classes/_index_.dinjectableflow.md)


### Interfaces

* [DChannel](../interfaces/_index_.dchannel.md)


### Type aliases

* [Listener](_index_.md#listener)
* [TypeFN](_index_.md#typefn)


### Functions

* [DFlow](_index_.md#dflow)


### Object literals

* [A](_index_.md#a)



---
## Type aliases
<a id="listener"></a>

###  Listener

**Τ Listener**:  *`function`* 

**


#### Type declaration
►(...a: *`T`[]*): `any`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| a | `T`[]   |  - |





**Returns:** `any`






___

<a id="typefn"></a>

###  TypeFN

**Τ TypeFN**:  *`function`* 

**


#### Type declaration
►(...a: *`any`[]*): `T`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| a | `any`[]   |  - |





**Returns:** `T`






___


## Functions
<a id="dflow"></a>

###  DFlow

► **DFlow**T(...a: *`T`[]*): [DChannel](../interfaces/_index_.dchannel.md)`T`



**



Create new channel


**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| a | `T`[]   |  - |





**Returns:** [DChannel](../interfaces/_index_.dchannel.md)`T`





___


<a id="a"></a>

## Object literal: A


<a id="a.match"></a>

###  match

**●  match**:  *`patternMatch`*  =  patternMatch

**





___
<a id="a.start"></a>

###  start

**●  start**:  *[DFlow](_index_.md#dflow)*  =  DFlow

**





___
<a id="a.mix"></a>

###  mix

► **mix**(...ar: *`any`[]*): [DChannel](../interfaces/_index_.dchannel.md)`Object`



**



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ar | `any`[]   |  - |





**Returns:** [DChannel](../interfaces/_index_.dchannel.md)`Object`





___


