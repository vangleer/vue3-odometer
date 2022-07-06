<template>
  <h1>
    <Odometer :value="num" />
    <button @click="num = 66">修改num</button>
  </h1>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Odometer from '../dist/vue3-odometer.es.js'
const num = ref(100)
</script>

