# vue3-odometer

> Vue.js(v3.2+) component wrap for Odometer.js

> see https://github.com/xlsdg/vue-odometer for vue.js(v2)

## Installation

``` bash
npm install --save odometer vue3-odometer
```

## Usage
``` vue
<template>
  <Vue3Odometer class="o-text" :value="number" />
  <el-button @click="update">update number</el-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Vue3Odometer from 'vue3-odometer'
import 'odometer/themes/odometer-theme-default.css'
const number = ref(100)

function update() {
  number.value = Math.floor(Math.random() * 1000)
}
</script>

<style>
.o-text {
  color: red;
}
</style>
```

## Properties

* `value` **[Number]**

  Optional; `0` by defualt.

* `format` **[String]**

  Optional;

* `theme` **[String]**

  Optional; `default` by defualt.

* `duration` **[Number]**

  Optional;

* `animation` **[String]**

  Optional;

* `formatFunction` **[Function]**

  Optional;

See more [Odometer.js](http://github.hubspot.com/odometer/)

## Methods

* `renderInside`
* `watchForMutations`
* `startWatchingMutations`
* `stopWatchingMutations`
* `cleanValue`
* `bindTransitionEnd`
* `resetFormat`
* `renderDigit`
* `formatDigits`
* `insertDigit`
* `addDigit`
* `addSpacer`
* `animate`
* `animateCount`
* `getDigitCount`
* `getFractionalDigitCount`
* `resetDigits`
* `animateSlide`
* `render`
* `update`

Learn more [Odometer.js](http://github.hubspot.com/odometer/)


# License

MIT