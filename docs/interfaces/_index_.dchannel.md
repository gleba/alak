[My project title](../README.md) > ["index"](../modules/_index_.md) > [DChannel](../interfaces/_index_.dchannel.md)



# Interface: DChannel

## Type parameters
#### T :  `any`
## Callable
► **__call**(...a: *`T`[]*): `T`



**



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| a | `T`[]   |  - |





**Returns:** `T`





## Properties
<a id="data"></a>

###  data

**●  data**:  *`T`[]* 

**





___

<a id="v"></a>

###  v

**●  v**:  *`T`* 

**





___


## Methods
<a id="branch"></a>

###  branch

► **branch**U(fn: *`function`*): [DChannel](_index_.dchannel.md)`U`



**



**Type parameters:**

#### U 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fn | `function`   |  - |





**Returns:** [DChannel](_index_.dchannel.md)`U`





___

<a id="drop"></a>

###  drop

► **drop**(): `void`



**





**Returns:** `void`





___

<a id="end"></a>

###  end

► **end**(): `void`



**





**Returns:** `void`





___

<a id="inject"></a>

###  inject

► **inject**(obj: *`any`*, key?: *`string`*): `void`



**



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| obj | `any`   |  - |
| key | `string`   |  - |





**Returns:** `void`





___

<a id="match"></a>

###  match

► **match**(...pattern: *`any`[]*): `any`



**



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| pattern | `any`[]   |  - |





**Returns:** `any`





___

<a id="mutate"></a>

###  mutate

► **mutate**(fn: *[Listener](../modules/_index_.md#listener)`T`*): `T`



**



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fn | [Listener](../modules/_index_.md#listener)`T`   |  - |





**Returns:** `T`





___

<a id="on"></a>

###  on

► **on**(fn: *[Listener](../modules/_index_.md#listener)`T`*): [DChannel](_index_.dchannel.md)`T`



**



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fn | [Listener](../modules/_index_.md#listener)`T`   |  - |





**Returns:** [DChannel](_index_.dchannel.md)`T`





___

<a id="reject"></a>

###  reject

► **reject**(obj: *`any`*): `void`



**



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| obj | `any`   |  - |





**Returns:** `void`





___

<a id="stop"></a>

###  stop

► **stop**(fn: *`any`*): `void`



**



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fn | `any`   |  - |





**Returns:** `void`





___


