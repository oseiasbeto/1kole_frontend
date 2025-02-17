<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    showSubtitle: {
        type: Boolean,
        default: false
    },
    showGoBackBtn: {
        type: Boolean,
        default: true
    },
    subtitle: {
        type: String,
        default: ""
    }
})
const router = useRouter()

const goBack = () => {
    router.back()
}
</script>

<template>
    <header class="bg-white z-10 sticky top-0 flex items-center px-5 py-1 min-h-[52px] border-b border-light-border">
        <div class="flex gap-3 items-center flex-shrink-0">
            <button @click="goBack" v-if="props.showGoBackBtn" class="w-8 h-8 rounded-full flex justify-center items-center hover:bg-light">
                <svg fill="none" width="24px" viewBox="0 0 24 24" height="24px">
                    <path fill="hsl(211, 24%, 43.6%)" fill-rule="evenodd" clip-rule="evenodd"
                        d="M3 12a1 1 0 0 1 .293-.707l6-6a1 1 0 0 1 1.414 1.414L6.414 11H20a1 1 0 1 1 0 2H6.414l4.293 4.293a1 1 0 0 1-1.414 1.414l-6-6A1 1 0 0 1 3 12Z">
                    </path>
                </svg>
            </button>
            <div class="flex flex-col">
                <h1 class="text-xl text-title font-bold">{{ props.title }}</h1>
                <p v-if="props.showSubtitle">{{ props.subtitle }}</p>
            </div>
        </div>
    </header>
</template>