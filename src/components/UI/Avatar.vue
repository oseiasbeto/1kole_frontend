<script setup>
const props = defineProps({
    url: String,
    custom: {
        type: String,
        default: "w-10 h-10"
    },
    name: String
})
</script>

<template>
    <div class="bg-light-bg-light overflow-hidden border-[0.5px] flex justify-center items-center border-light-border rounded-full"
        :class="custom">
        <img class="w-full h-full object-cover" v-if="url" v-lazy="url" :alt="name || 'Avatar'">
    </div>
</template>