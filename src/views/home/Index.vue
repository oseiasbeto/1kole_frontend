<script setup>
import { useKool } from '@/repositories/kool-repository';
import CreateKoolBox from '@/components/kools/CreateKoolBox.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import KoolList from '@/components/kools/KoolList.vue';
import Tabs from '@/components/tabs/Tabs.vue';
import TabItem from '@/components/tabs/TabItem.vue';
import CreateKoolBtn from '@/components/UI/buttons/CreateKoolBtn.vue';
import SpinnerNormal from '@/components/UI/spinners/SpinnerNormal.vue';
import EmptyKools from '@/components/kools/EmptyKools.vue';
const { getKools, loading } = useKool()
const { loadMore, loading: loadMoreLoading } = useKool()

const store = useStore()
const tabView = ref('foryou')
const filter = ref({
    page: 1,
    limit: 10,
    populate: 'author, parentKool, media',
    isReply: false
})

const kools = computed(() => {
    return store.getters.kools
})
const user = computed(() => {
    return store.getters.user
})

onMounted(async () => {
    if (!kools.value.data.length) {
        await getKools({
            page: 1,
            limit: 10,
            populate: 'author, parentKool, media',
            isReply: false
        })
    } else return
})

watch(tabView, async (newVal, oldVal) => {
    // Remove filtros anteriores que podem ter sido adicionados
    delete filter.value['author'];

    if (newVal === "following") {
        console.log("aki");

        if (user.value.following.length === 0) {
            store.commit("RESET_KOOLS")
        } else {
            filter.value['author'] = user.value.following;
            console.log(filter.value)
            await getKools(filter.value);
        }
    } else {
        // Chama a API com os filtros atualizados
        await getKools(filter.value);
    }

});

const onLoadMore = async (page) => {
    filter.value.page = page
    await loadMore({
        filter: filter.value,
        isReplies: false
    })
}
</script>

<template>
    <div>
        <!--start content home page area-->

        <!--start tabs area-->
        <Tabs v-if="!loading">
            <TabItem title="Para voce" @onpress="tabView = 'foryou'" :active="tabView == 'foryou'" />
            <TabItem title="Seguindo" @onpress="tabView = 'following'" :active="tabView == 'following'" />
        </Tabs>

        <!--end tabs area-->

        <!--start timeline area-->
        <div class="h-full" v-if="!loading">
            <KoolList v-if="kools.data.length" :load-more-loading="loadMoreLoading" :kools="kools.data" :is-replies="false"
                :metadata="kools.metadata" @load-more="onLoadMore" />
            <div class="h-[40vh]" v-else>
                <EmptyKools />
            </div>
        </div>
        <div v-else class="flex justify-center items-center h-screen">
            <SpinnerNormal />
        </div>
        <!--end timeline area-->

        <CreateKoolBtn />

        <!--end content home page area-->
    </div>

</template>