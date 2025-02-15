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
    <div class="fixed sm:hidden md:block top-0 lg:min-w-[80px] xl:min-w-[250px] overflow-y-auto h-screen px-0 lg:px-5">
        <ul class="w-full">
            <li>
                <router-link to="/">Pagina inicial</router-link>
            </li>
            <li>
                <button @click="openCreateReplyModal">+ Kool</button>
            </li>
        </ul>
    </div>
</template>