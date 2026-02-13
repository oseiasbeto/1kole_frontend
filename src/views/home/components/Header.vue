<template>
    <div class="w-full right-0 left-0 z-[100] fixed top-0">
        <div class="h-11 bg-primary-500 w-full flex justify-between items-center">
            <router-link to="/search" class="text-white gap-1 px-1 ml-2 h-9 flex items-center">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm10.45 2.95L16 16l4.95 4.95Z"
                        class="icon_svg-stroke" stroke="currentColor" stroke-width="1.5" fill="none"
                        stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="text-sm font-medium">Pesquisar</span>
            </router-link>

            <router-link to="/composer" class="text-white gap-1 px-1 mr-2 h-9 flex items-center">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g class="icon_svg-stroke" stroke="currentColor" stroke-width="1.5" fill="none" fill-rule="evenodd">
                        <path d="M12 7v10m-5-5h10" stroke-linecap="round"></path>
                        <circle cx="12" cy="12" r="9"></circle>
                    </g>
                </svg>
                <span class="text-sm font-medium">Novo post</span>
            </router-link>
        </div>
        <div>
            <ul
                class="flex shadow-[0_1px_1px_rgba(0,0,0,0.04)] border-b border-border-light flex-row w-full">
                <li class="bg-secondary-500 text-text-secondary border-r border-border-light flex-1">
                    <router-link :class="{'text-primary-500': route.path == '/'}" class="flex p-2 px-[8px] justify-center items-center grow h-11 lg:hover:bg-light"
                        to="/">

                        <svg class="w-6 h-6 lg:w-7 lg:h-7 shrink-0" v-if="route.path == '/'" fill="currentColor"
                            viewBox="0 0 24 24" aria-hidden="true">
                            <g>
                                <path
                                    d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z">
                                </path>
                            </g>
                        </svg>
                        <svg v-else fill="currentColor" class="w-6 h-6 lg:w-7 lg:h-7 shrink-0" viewBox="0 0 24 24"
                            aria-hidden="true">
                            <g>
                                <path
                                    d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z">
                                </path>
                            </g>
                        </svg>
                    </router-link>
                </li>
                <li class="bg-secondary-500 text-text-secondary border-r border-border-light flex-1">
                    <router-link class="flex p-2 px-[8px] justify-center items-center grow h-11 lg:hover:bg-light"
                        to="/search">
                        <svg v-if="route.path == '/search'" fill="none" class="w-6 h-6 lg:w-7 lg:h-7 shrink-0"
                            viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M5 11a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm6-8a8 8 0 1 0 4.906 14.32l3.387 3.387a1 1 0 0 0 1.414-1.414l-3.387-3.387A8 8 0 0 0 11 3Zm4 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z">
                            </path>
                        </svg>
                        <svg v-else fill="none" class="w-6 h-6 lg:w-7 lg:h-7 shrink-0" viewBox="0 0 24 24"
                            aria-hidden="true">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-8 6a8 8 0 1 1 14.32 4.906l3.387 3.387a1 1 0 0 1-1.414 1.414l-3.387-3.387A8 8 0 0 1 3 11Z">
                            </path>
                        </svg>
                    </router-link>
                </li>
                <li class="bg-secondary-500 text-text-secondary border-r border-border-light flex-1">
                    <router-link class="flex p-2 px-[8px] justify-center items-center grow h-11 lg:hover:bg-light"
                        to="/notifications">
                        <svg v-if="route.path == '/notifications'" fill="none" class="w-6 h-6 lg:w-7 lg:h-7 shrink-0"
                            viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 2a7.853 7.853 0 0 0-7.784 6.815l-1.207 9.053A1 1 0 0 0 4 19h3.354c.904 1.748 2.607 3 4.646 3 2.039 0 3.742-1.252 4.646-3H20a1 1 0 0 0 .991-1.132l-1.207-9.053A7.853 7.853 0 0 0 12 2Zm2.222 17H9.778c.61.637 1.399 1 2.222 1s1.613-.363 2.222-1Z">
                            </path>
                        </svg>
                        <svg v-else fill="none" class="w-6 h-6 lg:w-7 lg:h-7 shrink-0" viewBox="0 0 24 24"
                            aria-hidden="true">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M4.216 8.815a7.853 7.853 0 0 1 15.568 0l1.207 9.053A1 1 0 0 1 20 19h-3.354c-.904 1.748-2.607 3-4.646 3-2.039 0-3.742-1.252-4.646-3H4a1 1 0 0 1-.991-1.132l1.207-9.053ZM9.778 19c.61.637 1.399 1 2.222 1s1.613-.363 2.222-1H9.778ZM12 4a5.853 5.853 0 0 0-5.802 5.08L5.142 17h13.716l-1.056-7.92A5.853 5.853 0 0 0 12 4Z">
                            </path>
                        </svg>
                    </router-link>
                </li>
                <li class="bg-secondary-500 text-text-secondary border-r border-border-light flex-1">
                    <router-link class="flex p-2 px-[8px] justify-center items-center grow h-11 lg:hover:bg-light"
                        to="/messages">
                        <svg v-if="route.path == '/messages'" fill="none" class="w-6 h-6 lg:w-7 lg:h-7 shrink-0"
                            viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.968 9.968 0 0 1-4.136-.893l-4.68.876a1 1 0 0 1-1.164-1.184l.931-4.537A9.965 9.965 0 0 1 2 12Zm4.25 0a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0Zm4.5 0a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0Zm5.75 1.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z">
                            </path>
                        </svg>
                        <svg v-else fill="none" class="w-6 h-6 lg:w-7 lg:h-7 shrink-0" viewBox="0 0 24 24"
                            aria-hidden="true">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M4 12a8 8 0 1 1 4.445 7.169 1 1 0 0 0-.629-.088l-3.537.662.7-3.415a1 1 0 0 0-.09-.66A7.961 7.961 0 0 1 4 12Zm8-10C6.477 2 2 6.477 2 12c0 1.523.341 2.968.951 4.262l-.93 4.537a1 1 0 0 0 1.163 1.184l4.68-.876A9.968 9.968 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2ZM7.5 13.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4.5 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4.5 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z">
                            </path>
                        </svg>
                    </router-link>
                </li>
                <li
                    class="hidden lg:block bg-secondary-500 text-text-secondary border-r border-border-light flex-1">
                    <router-link class="flex p-2 px-[8px] justify-center items-center grow h-11 lg:hover:bg-light"
                        to="/feeds">
                        <svg v-if="route.path == '/feeds'" fill="none" class="w-6 h-6 lg:w-7 lg:h-7 shrink-0"
                            viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M9.186 2.512a1.5 1.5 0 0 0-1.674 1.302L7.176 6.5H4a1.5 1.5 0 1 0 0 3h2.8l-.624 5H4a1.5 1.5 0 0 0 0 3h1.8l-.288 2.314a1.5 1.5 0 1 0 2.976.372l.336-2.686h4.977l-.29 2.314a1.5 1.5 0 1 0 2.977.372l.336-2.686H20a1.5 1.5 0 0 0 0-3h-2.8l.624-5H20a1.5 1.5 0 0 0 0-3h-1.8l.288-2.314a1.5 1.5 0 1 0-2.976-.372L15.176 6.5h-4.977l.29-2.314a1.5 1.5 0 0 0-1.303-1.674ZM9.2 14.5l.625-5h4.977l-.625 5H9.199Z">
                            </path>
                        </svg>
                        <svg v-else fill="none" class="w-6 h-6 lg:w-7 lg:h-7 shrink-0" viewBox="0 0 24 24"
                            aria-hidden="true">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M9.124 3.008a1 1 0 0 1 .868 1.116L9.632 7h5.985l.39-3.124a1 1 0 0 1 1.985.248L17.632 7H20a1 1 0 1 1 0 2h-2.617l-.75 6H20a1 1 0 1 1 0 2h-3.617l-.39 3.124a1 1 0 1 1-1.985-.248l.36-2.876H8.382l-.39 3.124a1 1 0 1 1-1.985-.248L6.368 17H4a1 1 0 1 1 0-2h2.617l.75-6H4a1 1 0 1 1 0-2h3.617l.39-3.124a1 1 0 0 1 1.117-.868ZM9.383 9l-.75 6h5.984l.75-6H9.383Z">
                            </path>
                        </svg>
                    </router-link>
                </li>
               
                <li class="bg-secondary-500 text-text-secondary border-r border-border-light flex-1">
                    <router-link class="flex p-2 px-[8px] justify-center items-center grow h-11 lg:hover:bg-light"
                        :to="'/' + user?.username">
                        <div class="flex-shrink-0">
                           <Avatar custom="h-6 w-6" :url="user?.profileImage?.url || user?.profileImage?.low"/>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import Avatar from '@/components/UI/Avatar.vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';


const route = useRoute()
const router = useRouter()
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
const user = computed(() => store?.getters?.user)
</script>