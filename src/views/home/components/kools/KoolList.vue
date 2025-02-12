<script setup>
import { defineProps } from 'vue';
import Kool from './Kool.vue';

const props = defineProps({
    kools: {
        type: Array,
        required: true
    },
    isReplies: {
        type: Boolean,
        required: true
    },
    loading: {
        type: Boolean,
        default: true
    }
});
</script>

<template>
    <div v-if="!loading" class="space-y-4">
        <div v-if="props.kools.length">
            <Kool v-for='kool in props.kools' :isReply="props.isReplies" :key='kool.id' :kool='kool'/>
        </div>
    </div>
    <div v-else>
        <p>Processando a lista</p>
    </div>
</template>