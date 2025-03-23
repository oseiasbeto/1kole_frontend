<script setup>
const emit = defineEmits(['onpress'])

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
})

const handlePress = () => {
    emit("onpress")
}
</script>

<template>
    <li @click="handlePress"
        class="flex relative cursor-pointer flex-1 items-center justify-center gap-x-1 whitespace-nowrap px-4 py-2 pt-3 text-center text-sm font-medium hover:text-title dark:text-gray-600 dark:hover:text-gray-50 text-gray-900 dark:text-gray-100"
        :class="props.active ? 'text-title' : 'text-gray'">
        {{ props.title }}

        <div v-show="props.active" class="absolute bottom-[-3px] z-[2] h-[3px] bg-primary transition-all duration-200 dark:bg-primary-400 w-full"></div>
    </li>
</template>