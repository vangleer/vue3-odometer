<template>
  <span ref="numRef"></span>
</template>

<script setup lang='ts'>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { isFunction } from '../utils'
import Odometer from 'odometer'

const props = defineProps({
  value: {
    type: Number,
    required: false,
    default: 0
  },
  format: {
    type: String,
    required: false
  },
  theme: {
    type: String,
    required: false,
    default: 'default'
  },
  duration: {
    type: Number,
    required: false
  },
  animation: {
    type: String,
    required: false
  },
  formatFunction: {
    type: Function,
    required: false
  }
})

const emit = defineEmits(['ready'])

const instance = ref(null)
const numRef = ref(null)
watch(() => props.value, (value) => {
  if (instance.value && isFunction(instance.value.update)) {
    instance.value.update(value)
  }
}, {
  deep: false
})

function auto() {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.odometerOptions) {
    window.odometerOptions['auto'] = false;
  } else {
    window.odometerOptions = {
      auto: false
    };
  }
}

function init() {
  if (instance.value) {
    return;
  }

  auto();

  const current = new Odometer({
    el: numRef.value,
    value: props.value,
    format: props.format,
    theme: props.theme,
    duration: props.duration,
    animation: props.animation,
    formatFunction: props.formatFunction
  });

  current.render();
  emit('ready', current, Odometer);
  instance.value = current;
}

function uninit() {
  instance.value = null;
}

function renderInside() {
  if (instance.value && isFunction(instance.value.renderInside)) {
    instance.value.renderInside();
  }
}

function watchForMutations() {
  if (instance.value && isFunction(instance.value.watchForMutations)) {
    instance.value.watchForMutations();
  }
}

function startWatchingMutations() {
  if (instance.value && isFunction(instance.value.startWatchingMutations)) {
    instance.value.startWatchingMutations();
  }
}

function stopWatchingMutations() {
  if (instance.value && isFunction(instance.value.stopWatchingMutations)) {
    instance.value.stopWatchingMutations();
  }
}

function cleanValue(val) {
  if (instance.value && isFunction(instance.value.cleanValue)) {
    instance.value.cleanValue(val);
  }
}

function bindTransitionEnd() {
  if (instance.value && isFunction(instance.value.bindTransitionEnd)) {
    instance.value.bindTransitionEnd();
  }
}

function resetFormat() {
  if (instance.value && isFunction(instance.value.resetFormat)) {
    instance.value.resetFormat();
  }
}
function renderDigit() {
  if (instance.value && isFunction(instance.value.renderDigit)) {
    instance.value.renderDigit();
  }
}
function formatDigits(value) {
  if (instance.value && isFunction(instance.value.formatDigits)) {
    instance.value.formatDigits(value);
  }
}
function insertDigit(digit, before) {
  if (instance.value && isFunction(instance.value.insertDigit)) {
    instance.value.insertDigit(digit, before);
  }
}
function addDigit(value, repeating) {
  if (instance.value && isFunction(instance.value.addDigit)) {
    instance.value.addDigit(value, repeating);
  }
}
function addSpacer(chr, before, extraClasses) {
  if (instance.value && isFunction(instance.value.addSpacer)) {
    instance.value.addSpacer(chr, before, extraClasses);
  }
}
function animate(newValue) {
  if (instance.value && isFunction(instance.value.animate)) {
    instance.value.animate(newValue);
  }
}
function animateCount(newValue) {
  if (instance.value && isFunction(instance.value.animateCount)) {
    instance.value.animateCount(newValue);
  }
}
function getDigitCount() {
  if (instance.value && isFunction(instance.value.getDigitCount)) {
    instance.value.getDigitCount();
  }
}
function getFractionalDigitCount() {
  if (instance.value && isFunction(instance.value.getFractionalDigitCount)) {
    instance.value.getFractionalDigitCount();
  }
}
function resetDigits() {
  if (instance.value && isFunction(instance.value.resetDigits)) {
    instance.value.resetDigits();
  }
}
function animateSlide(value) {
  if (instance.value && isFunction(instance.value.animateSlide)) {
    instance.value.animateSlide(value);
  }
}
function render(value) {
  if (instance.value && isFunction(instance.value.render)) {
    instance.value.render(value);
  }
}
function update(newVal) {
  if (instance.value && isFunction(instance.value.update)) {
    instance.value.update(newVal);
  }
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  uninit()
})

defineExpose({
  instance,
  init,
  uninit,
  renderInside,
  watchForMutations,
  startWatchingMutations,
  stopWatchingMutations,
  cleanValue,
  bindTransitionEnd,
  resetFormat,
  renderDigit,
  formatDigits,
  insertDigit,
  addDigit,
  addSpacer,
  animate,
  animateCount,
  getDigitCount,
  getFractionalDigitCount,
  resetDigits,
  animateSlide,
  render,
  update
})

</script>
