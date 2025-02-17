<script setup>
import Avatar from '@/components/UI/Avatar.vue';
import Construction from '@/components/UI/Construction.vue';
import EmptyNotifications from '@/components/UI/EmptyNotifications.vue';
import Navbar from '@/components/UI/Navbar.vue';
import SpinnerNormal from '@/components/UI/spinners/SpinnerNormal.vue';
import { useNotifications } from '@/repositories/notification-repository';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const { getNotifications, loading } = useNotifications()

const store = useStore()

const user = computed(() => store.getters.user)
const notifications = computed(() => store.getters.notifications)

onMounted(async () => {
    await getNotifications({
        page: 1,
        limit: 10,
        user: user._id,
        populate: "relatedUsers"
    }).then(res => {
        console.log(res)
    })
})
</script>

<template>
    <div v-if="!loading">
        <Navbar title="Notificações" />

        <ul v-if="notifications.data.length">
            <li v-for="notification in notifications.data" :key="notification.id"
                class="flex gap-3 p-3 border-b border-border hover:bg-gray-100">
                <div>
                    <svg v-if="notification.type == 'follow'" fill="none" viewBox="0 0 24 24" width="28" height="28"
                        style="color: rgb(16, 131, 254);">
                        <path fill="hsl(211, 99%, 53%)" fill-rule="evenodd" clip-rule="evenodd"
                            d="M7.5 6.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM12 12c-4.758 0-8.083 3.521-8.496 7.906A1 1 0 0 0 4.5 21H15a3 3 0 1 1 0-6c0-.824.332-1.571.87-2.113C14.739 12.32 13.435 12 12 12Zm6 2a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1Z">
                        </path>
                    </svg>
                    <svg v-if="notification.type == 'like'" fill="none" viewBox="0 0 24 24" width="28" height="28"
                        class="r-84gixx">
                        <path fill="#ec4899" fill-rule="evenodd" clip-rule="evenodd"
                            d="M12.489 21.372c8.528-4.78 10.626-10.47 9.022-14.47-.779-1.941-2.414-3.333-4.342-3.763-1.697-.378-3.552.003-5.169 1.287-1.617-1.284-3.472-1.665-5.17-1.287-1.927.43-3.562 1.822-4.34 3.764-1.605 4 .493 9.69 9.021 14.47a1 1 0 0 0 .978 0Z">
                        </path>
                    </svg>
                    <svg v-if="notification.type == 'reply'" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" width="28px" height="28px"
                        viewBox="0 0 32 32" version="1.1">

                        <title>comment 2</title>
                        <desc>Created with Sketch Beta.</desc>
                        <defs>

                        </defs>
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
                            sketch:type="MSPage">
                            <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                transform="translate(-154.000000, -257.000000)" fill="#1d9bf0">
                                <path
                                    d="M177,270 L163,270 C162.448,270 162,269.553 162,269 C162,268.448 162.448,268 163,268 L177,268 C177.552,268 178,268.448 178,269 C178,269.553 177.552,270 177,270 L177,270 Z M175,276 L165,276 C164.448,276 164,275.553 164,275 C164,274.447 164.448,274 165,274 L175,274 C175.552,274 176,274.447 176,275 C176,275.553 175.552,276 175,276 L175,276 Z M170,257 C161.164,257 154,263.269 154,271 C154,275.419 156.345,279.354 160,281.919 L160,289 L167.009,284.747 C167.979,284.907 168.977,285 170,285 C178.836,285 186,278.732 186,271 C186,263.269 178.836,257 170,257 L170,257 Z"
                                    id="comment-2" sketch:type="MSShapeGroup">

                                </path>
                            </g>
                        </g>
                    </svg>
                </div>
                <span class="text-gray-800">
                    <Avatar :url="notification.relatedUsers[0].profileImage.url" />
                    {{ notification.message }}
                </span>
            </li>
        </ul>
        <EmptyNotifications v-else/>
    </div>
    <div v-else class="flex justify-center items-center h-screen">
        <SpinnerNormal />
    </div>

</template>