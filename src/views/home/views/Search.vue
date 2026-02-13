<script setup>
import Avatar from '@/components/UI/Avatar.vue';
import SearchAutocomplite from '@/components/UI/SearchAutocomplite.vue';
import UserList from '@/components/users/UserList.vue';
import { useUser } from '@/repositories/user-repository';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const { getUsers, loading: getUsersLoading } = useUser()

const route = useRoute()

const store = useStore()
const user = computed(() => store.getters.user)
const users = computed(() => store.getters.users)

const filter = ref({
    page: 1,
    limit: 25,
    following: { nin: [user.value._id] },  // Filtra pessoas que não seguem o usuário atual
    _id: { ne: user.value._id },  // Exclui o usuário atual da consulta,
    status: "active"
})

const keywords = ref("")

onMounted(async () => {
    await getUsers(filter.value)
})

</script>

<template>
    <div>
        <div>
            <div class="sticky top-0 px-3 py-2">
                <div class="flex items-center gap-2">
                    <div class=" shrink-0">
                        <Avatar custom="w-[31px] h-[31px]" :url="user.profileImage.url" />
                    </div>

                    <SearchAutocomplite />
                </div>
            </div>

            <div v-if="!keywords.length">
                <div v-if="users?.data.length" class="border-b border-border">
                    <div class="py-2 pb-4 px-4">
                        <h1 class="flex gap-1 items-center">
                            <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"
                                viewBox="0 0 16 16" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M3.54944 12L3.21611 15H5.22841L5.56175 12H9.54944L9.21611 15H11.2284L11.5617 12H14.5552L14.7774 10H11.784L12.2284 6H15.2218L15.4441 4H12.4506L12.784 1H10.7717L10.4383 4H6.45064L6.78397 1H4.77166L4.43833 4H1.44431L1.22209 6H4.21611L3.77166 10H0.777642L0.55542 12H3.54944ZM5.78397 10H9.77166L10.2161 6H6.22841L5.78397 10Z"
                                    fill="currentColor" />
                            </svg>
                            <p class="text-title text-[20px] font-bold">Recomendados</p>
                        </h1>
                        <p class=" text-sm text-muted">Pessoas que achamos que você pode seguir.</p>
                    </div>
                </div>
                <div v-if="users?.data.length">
                    <UserList :users="users.data" :metadata="users.metadata" />
                </div>
            </div>
        </div>
    </div>


</template>