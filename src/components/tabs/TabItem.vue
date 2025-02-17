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
    <li @click="handlePress" class="px-[14px] cursor-pointer pt-[14px] grow hover:bg-light">
        <div class="text-center relative font-semibold">
            <p class="relative whitespace-nowrap text-[15px] w-min mx-auto leading-5 pb-[13px]" :class="props.active ? 'text-title' : 'text-muted'">
                {{ props.title }}
                <span v-show="props.active" class="bg-primary absolute w-full left-0 bottom-0 h-[4px] rounded-[30px]"></span>
            </p>
        </div>
    </li>
</template>