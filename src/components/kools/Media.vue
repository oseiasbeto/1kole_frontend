<script setup>
import { defineProps, onMounted } from 'vue'
import PlayerVideo from '../UI/PlayerVideo.vue'
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.css'

const props = defineProps({
  media: {
    type: Object,
    required: true
  }
})

let lightbox = null

onMounted(() => {
  lightbox = GLightbox({
    selector: '.glightbox', // seleciona elementos com esta classe
    loop: true
  })
})
</script>

<template>
  <div class="mt-1.5 bg-secondary-500 overflow-hidden">
    
    <!-- Imagem com lightbox -->
    <div v-if="media.type === 'image'" class="w-full max-h-96 overflow-hidden">
      <a :href="media.url" class="glightbox">
        <img v-lazy="media.url" alt="Kool media" class="w-full h-full m-0 object-cover" />
      </a>
    </div>

    <!-- Vídeo: mantém PlayerVideo -->
    <PlayerVideo v-if="media.type === 'video'" :video="media" />
  </div>
</template>