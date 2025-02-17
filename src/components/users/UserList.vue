<script setup>
import { ref } from 'vue';
import User from './User.vue';

const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  metadata: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <div v-if="users.length > 0" class="w-full mx-auto">
    <div v-for="user in users" :key="user.id"
      class="flex items-center justify-between py-3 px-4 border-b border-gray-300">
      <User :user="user"/>
    </div>
  </div>
</template>