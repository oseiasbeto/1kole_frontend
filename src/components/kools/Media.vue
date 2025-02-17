<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  media: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div v-if="media.type === 'image'" class="mt-2 bg-light">
    <img v-lazy="media.url" alt="Kool media" class="w-full border border-border max-h-96 object-cover rounded-lg">
  </div>
</template>
