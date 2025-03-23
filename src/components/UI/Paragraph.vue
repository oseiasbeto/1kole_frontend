<script setup>
import convertTextToLinks from "@/utils/convertTextToLinks.js";

const props = defineProps({
    txt: {
        type: String,
        required: true
    },
    custom: {
        type: String,
        default: "text-base leading-[21px] select-none"
    }
})

</script>

<template>
    <div :class="custom" class="text-title max-w-full flex w-full overflow-hidden whitespace-pre-wrap break-words" v-html="props.txt">
    </div>
</template>