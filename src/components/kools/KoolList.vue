<script setup>
import { computed, onMounted, ref } from 'vue';
import Kool from './Kool.vue';
import { useIntersectionObserver } from "@vueuse/core";
import SpinnerNormal from '../UI/spinners/SpinnerNormal.vue';
import { useKool } from '@/repositories/kool-repository';
import { useStore } from 'vuex';
const { getKools } = useKool()

const props = defineProps({
    kools: {
        type: Array,
        required: true
    },
    metadata: {
        type: Object
    },
    loadMoreLoading: {
        type: Boolean,
        default: false
    },
    isReplies: {
        type: Boolean,
        required: true
    }
});

const currentPage = computed(() => props?.metadata?.currentPage || 1);
const totalPages = computed(() => props?.metadata?.totalPages || 1);
const loadTrigger = ref(null); // Elemento que acionará a API

const emit = defineEmits(["loadMore"]);

const loadMoreKools = async () => {
    console.log(currentPage.value + ' : ' + totalPages.value)
    if (props.loadMoreLoading || currentPage.value >= totalPages.value) return;
    else {
        const newPage = currentPage.value + 1
        emit("loadMore", newPage)
    }
};

// Observa o último elemento da lista
useIntersectionObserver(
    loadTrigger,
    ([{ isIntersecting }]) => {
        if (isIntersecting) {
            loadMoreKools();
        }
    }
);
</script>

<template>
    <div ref="containerRef" class="w-full overflow-hidden" v-if="props.kools?.length">
        <Kool v-for='kool in props.kools' :isReply="props.isReplies" :key='kool.id' :kool='kool' />
        <!-- O elemento que dispara o carregamento -->
        <div v-if="currentPage < totalPages" ref="loadTrigger" class="flex justify-center my-8">
            <SpinnerNormal />
        </div>
    </div>
</template>