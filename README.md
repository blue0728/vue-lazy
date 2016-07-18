## Install
```
npm install vue-lazy --save

```

## Usage

```js
'use strict'
import lazy from 'vue-lazy'

----------------

Vue.use(lazy,{
	error: 'error.jpg',
	loading: 'loading.gif'
});

---------------

Vue.use(lazy);


```

```html

<img v-for="item in src" v-lazy="item">

```

```js

new Vue({
	el: '#app',
	data: {
		src: [
			'http://img.haimi.com/FlvVOYJrTN10reDkx9ut_kmoiwxW',
			'http://img.haimi.com/FlgifiFboMtKJwF7-6KWLzE-Mfwk',
			'http://img.haimi.com/FlIIW2OJTqolOt7915AEdhoZNumP',
			'http://img.haimi.com/FtJ770r8WWDPV_EXWLHlEaN4bcoY'
		]
	}
})	

```