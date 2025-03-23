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
  <div class="rounded-lg border mt-2 bg-light border-border overflow-hidden">
    <div v-if="media.type === 'image'" class="w-auto">
      <img v-lazy="media.url" alt="Kool media" class="w-full max-h-96 object-cover">
    </div>
    <PlayerVideo v-if="media.type === 'video'" :video="media" />
  </div>

</template>
