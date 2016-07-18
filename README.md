## Install
```
npm install vue-lazy --save

```

## Usage

```js
'use strict'
import lazy from 'vue-lazy'

Vue.use(lazy,{
	error: 'error.jpg',
	loading: 'loading.gif'
});

---------------

Vue.use(lazy);


```

```html
<img v-lazy="http://img.haimi.com/FlvVOYJrTN10reDkx9ut_kmoiwxW">
```