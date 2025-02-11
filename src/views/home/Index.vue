<script setup>
import { useKool } from '@/repositories/kool-repository';
import CreateKoolBox from './components/kools/CreateKoolBox.vue';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import KoolList from './components/kools/KoolList.vue';
const { getKools, loading } = useKool()

const store = useStore()

const kools = computed(() => {
    return store.getters.kools
})

onMounted(async () => {
    if (!kools.value.data.length) {
        await getKools({
            page: 1,
            limit: 10,
            populate: 'author',
            'parentKool[exists]': false
        })
    } else return
})
</script>

<template>
    <!--start content home page area-->

    <!--start create a post box area-->
    <CreateKoolBox />
    <!--end create a post box area-->

    <!--start timeline area-->
    <KoolList :kools="kools.data" :loading="loading" />
    <!--end timeline area-->

    <!--end content home page area-->
</template>