<template>
  <div :class="[
    'fixed inset-0 z-[9999]',
    isOpen ? 'block bg-opacity-50' : 'hidden bg-opacity-0 pointer-events-none',
    overlayClass,
  ]" @click.self="close">
    <div ref="DrawerRef" :class="[
      'absolute bottom-0 left-0 right-0 bg-surface-0 dark:bg-surface-900 rounded-tr-2xl rounded-tl-2xl shadow-2xl',
      costumClass,
      isOpen ? 'animate-slide-up' : 'animate-slide-down fade-out',
    ]" :style="{
        transform: `translateY(${translateY}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        opacity: isOpen ? 1 : 0
      }" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
      <!-- Barra de arrastar -->
      <div class="flex justify-center pt-3 pb-2">
        <div class="w-12 h-1.5 bg-surface-300 dark:bg-surface-600 rounded-full"></div>
      </div>

      <!-- Título (aparece apenas se prop title for passada) -->
      <div v-if="title" class="px-6 py-4 border-b border-border-light dark:border-border-dark">
        <h3 class="text-lg font-semibold text-text-primary dark:text-text-inverse text-center">
          {{ title }}
        </h3>
      </div>

      <!-- Conteúdo -->
      <div class="relative">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  overlayClass: {
    type: String,
    default: "bg-black transition-bg-opacity duration-300"
  },
  costumClass: String,
  title: {          // ← Nova prop opcional
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const DrawerRef = ref(null)
const isDragging = ref(false)
const startY = ref(0)
const translateY = ref(0)
const maxTranslateY = ref(0)

const handleTouchStart = (e) => {
  isDragging.value = true
  startY.value = e.touches[0].clientY
  maxTranslateY.value = DrawerRef.value.offsetHeight
}

const handleTouchMove = (e) => {
  if (isDragging.value) {
    const deltaY = e.touches[0].clientY - startY.value
    translateY.value = Math.max(0, Math.min(deltaY, maxTranslateY.value))
  }
}

const handleTouchEnd = (e) => {
  isDragging.value = false
  if (translateY.value > maxTranslateY.value / 2) {
    close()
  } else {
    translateY.value = 0
  }
}

const close = () => {
  emit('close')
  translateY.value = 0
}
</script>

<style>
.animate-slide-up {
  animation: slide-up 0.3s ease-in-out;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-in-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }
}
</style>
