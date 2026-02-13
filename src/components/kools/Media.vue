<script setup>
import { defineProps } from 'vue';
import PlayerVideo from '../UI/PlayerVideo.vue';

const props = defineProps({
  media: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="mt-1.5 bg-secondary-500 overflow-hidden">
    <div v-if="media.type === 'image'" class="w-full max-h-96 overflow-hidden">
      <img v-lazy="media.url" alt="Kool media" class="w-full h-full m-0 object-cover">
    </div>
    <PlayerVideo v-if="media.type === 'video'" :video="media" />
  </div>

</template>
