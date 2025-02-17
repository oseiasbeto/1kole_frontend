<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const keywords = ref("")
const router = useRouter()

const goToSearch = () => {
    router.push({ path: '/search', query: { s: keywords.value } });
}

const clear = () => {
    keywords.value = ""
    router.replace("/search")
}
</script>

<template>
    <div class="w-full pointer-events-none">
        <div
            class="bg-light-bg-light h-10 text-light-text-placeholder focus-within:border-primary focus-within:text-primary w-full border border-border relative px-[10px] flex items-center gap-1 rounded-full">
            <div class="text-inherit pointer-events-none">
                <svg fill="none" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                        d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-8 6a8 8 0 1 1 14.32 4.906l3.387 3.387a1 1 0 0 1-1.414 1.414l-3.387-3.387A8 8 0 0 1 3 11Z">
                    </path>
                </svg>
            </div>
            <input @input="handleSearch" @keyup.enter="goToSearch" v-model="keywords"
                class="px-1 pt-[10px] pb-[11px] text-[15px] bg-transparent outline-none placeholder:text-muted text-title"
                :class="keywords.length ? 'w-[80%]' : 'w-full'" autocomplete="off" autocorrect="off"
                placeholder="Pesquisar" type="text">

            <button v-if="keywords.length" @click="clear()"
                class="w-[22px] absolute right-3 transition-colors hover:bg-transparent h-[22px] flex justify-center items-center bg-light-bg rounded-full border border-light-border">
                <svg fill="none" width="12" viewBox="0 0 24 24" height="12">
                    <path fill="#536471" fill-rule="evenodd" clip-rule="evenodd"
                        d="M4.293 4.293a1 1 0 0 1 1.414 0L12 10.586l6.293-6.293a1 1 0 1 1 1.414 1.414L13.414 12l6.293 6.293a1 1 0 0 1-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L10.586 12 4.293 5.707a1 1 0 0 1 0-1.414Z">
                    </path>
                </svg>
            </button>
        </div>

    </div>

</template>