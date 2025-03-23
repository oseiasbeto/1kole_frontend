<script setup>
import { useStore } from 'vuex';

const store = useStore()

const openCreateReplyModal = () => {
    store.dispatch("setModal", {
        show: true,
        name: "create kool",
        data: {
            isReply: false
        }
    })
}
</script>

<template>
    <button @click="openCreateReplyModal"
        class="bg-verified z-50 fixed lg:right-14 right-4 shadow-lg w-14 h-14 lg:w-16 lg:h-16 bottom-20 lg:bottom-14 text-white rounded-full  flex justify-center hover:opacity-80 items-center">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" width="29" height="29" class="r-jwli3a">
            <path
                d="M 20 9 L 20 16 C 20 18.209 18.209 20 16 20 L 8 20 C 5.791 20 4 18.209 4 16 L 4 8 C 4 5.791 5.791 4 8 4 L 15 4"
                stroke-width="1.5"></path>
            <line stroke-linecap="round" x1="10" y1="14" x2="18.5" y2="5.5" stroke-width="2.25"></line>
            <line stroke-linecap="round" x1="20.5" y1="3.5" x2="21" y2="3" stroke-width="2.25"></line>
        </svg>
    </button>
</template>