<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
    kool: {
        type: Object,
        required: true
    }
})

const store = useStore()

const user = computed(() => {
   return store.getters.user
})

const openCreateReplyModal = () => {
    store.dispatch("setModal", {
        show: true,
        name: "create kool",
        data: {
            parentKool: props.kool
        }
    })
}

const isOwnKool = computed(() => {
    return props.kool && props.kool.author && props.kool.author._id
        ? props.kool.author._id === user.value?._id
        : false;
}); // Verifica se o post é do usuário logado

</script>

<template>
    <div @click="openCreateReplyModal" class="py-2 px-3 cursor-pointer select-none text-sm rounded-full w-full bg-gray-100 text-gray-500">
        <p>Responder {{ isOwnKool ? 'a si mesmo' : `ao: @${kool.author.username}`}}</p>
    </div>
</template>