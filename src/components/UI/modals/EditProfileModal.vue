<script setup>
// Importe os pacotes necessários para o bom funcionamento deste componente.
import { useStore } from "vuex"
import { computed, onMounted } from "vue"
import { ref } from "vue";
import {
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild
} from '@headlessui/vue'
import { useUser } from "@/repositories/user-repository";
import { toast } from "vue3-toastify";

const { updateProfile, loading } = useUser()

// Importe as referências necessários para o bom funcionamento deste componente.
const store = useStore()

// Esta função computada tem como finalidade retornar os dados da caixa de diálogo aberta.
const modal = computed(() => {
    return store.getters.modal
})

const user = computed(() => store.getters.user)


// Estados do formulário
const name = ref("");
const bio = ref("");
const avatar = ref(null);
const cover = ref(null);
const avatarPreview = ref(null);
const coverPreview = ref(null);
const errors = ref({
    avatar: "",
    cover: "",
});

// Carregar informações do perfil ao montar
onMounted(() => {
    name.value = user?.value.name
    bio.value = user?.value.bio;
    avatarPreview.value = user?.value.profileImage?.url;
    coverPreview.value = user?.value.coverPhoto?.url;
});

// Função para lidar com upload de imagem
const handleFileChange = (event, type) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validação: Apenas imagens e até 2MB
    if (!file.type.startsWith("image/")) {
        errors.value[type] = "O arquivo precisa ser uma imagem!";
        return;
    }
    if (file.size > 4 * 1024 * 1024) {
        errors.value[type] = "O arquivo não pode ser maior que 4MB!";
        return;
    }

    // Limpa erro e atualiza preview
    errors.value[type] = "";
    const reader = new FileReader();
    reader.onload = () => {
        if (type === "avatar") {
            avatarPreview.value = reader.result;
            avatar.value = file;
        } else {
            coverPreview.value = reader.result;
            cover.value = file;
        }
    };
    reader.readAsDataURL(file);
};

// Remover imagem selecionada
const removeImage = (type) => {
    if (type === "avatar") {
        avatarPreview.value = user.value.profileImage.url; // Voltar imagem original
        avatar.value = null;
    } else {
        coverPreview.value = null; // Remover imagem da capa
        cover.value = null;
    }
};

// Função para enviar os dados para API
const submitForm = async () => {
    if (!name.value.trim()) {
        alert("O nome é obrigatório!");
        return;
    }
    
    if(loading.value) return

    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("bio", bio.value);

    if (avatar.value) formData.append("profileImage", avatar.value);
    if (cover.value) formData.append("coverPhoto", cover.value);

    // Simulação de envio para API (substituir pelo fetch/axios)

    await updateProfile(formData)
        .then(() => {
            toast("Alterações salvas com sucesso.", {
                show: true,
                theme: "colored",
                position: "bottom-center",
                type: "info",
                hideProgressBar: true
            })
            
        })
        .finally(() => {
            close()
        })
        .catch(() => {
            toast("Erro ao tentar editar o perfil!", {
                show: true,
                theme: "colored",
                position: "bottom-center",
                type: "info",
                hideProgressBar: true
            })
        })
};

// Esta função tem como finalidade fechar a caixa de diálogo aberta.
const close = () => {
    name.value = user?.value.name;
    bio.value = user?.value.bio;
    avatar.value = null;
    cover.value = null;
    avatarPreview.value = user?.value.profileImage.url;
    coverPreview.value = user?.value.coverPhoto.url;

    store.dispatch("setModal", {
        show: false,
        name: modal.value.name,
        data: modal.value.data
    })
}
</script>

<template>
    <TransitionRoot appear :show="modal.show && modal.name == 'edit profile'" as="div">
        <Dialog as="div" class="relative z-[111]">
            <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-30"></div>
            </TransitionChild>

            <!--start body-->
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex lg:items-center lg:justify-center min-h-full text-center">
                    <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <!--start body content-->
                        <DialogPanel
                            class="w-full lg:rounded-[16px] overflow-hidden text-left align-middle transition-all transform">
                            <div class="bg-white w-screen lg:w-[500px] lg:mx-w-[600px] shadow-lg flex flex-col ">
                                <!--start header body-->
                                <div class="px-4 py-2 flex justify-between items-center">
                                    <div class="flex gap-1 items-center">
                                        <button @click="close(modal.name)"
                                            class="flex items-center justify-center p-2 bg-white rounded-full hover:bg-gray-100 focus:outline-none transition-colors">
                                            <svg viewBox="0 0 24 24" aria-hidden="true" class="w-5 h-5 text-gray-800">
                                                <g>
                                                    <path
                                                        d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </button>

                                        <h1 class="text-base font-bold text-title">Editar perfil</h1>
                                    </div>
                                </div>
                                <!--end header body-->

                                <!--start content body-->
                                <div>
                                    <div
                                        class="max-w-2xl overflow-y-auto mx-auto bg-white lg:shadow-lg h-screen lg:h-auto lg:max-h-[80vh] rounded-md p-6">
                                        <!-- Upload da Capa -->
                                        <div
                                            class="relative w-full h-48 bg-[#cfd9de] rounded-md overflow-hidden flex items-center justify-center">
                                            <template v-if="coverPreview">
                                                <img :src="coverPreview"
                                                    class="absolute inset-0 w-full h-full object-cover" />
                                                <button @click="removeImage('cover')"
                                                    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white px-4 py-2 rounded">
                                                    Remover Capa
                                                </button>
                                            </template>
                                            <template v-else>
                                                <label
                                                    class="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-600 cursor-pointer">
                                                    <input type="file" class="hidden"
                                                        @change="(e) => handleFileChange(e, 'cover')"
                                                        accept="image/*" />
                                                    Adicionar Capa
                                                </label>
                                            </template>
                                        </div>
                                        <p v-if="errors.cover" class="text-red-500 text-sm mt-1 text-center">{{
                                            errors.cover }}</p>

                                        <!-- Avatar -->
                                        <div
                                            class="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white -mt-14 mx-auto">
                                            <img v-if="avatarPreview" :src="avatarPreview"
                                                class="w-full h-full object-cover" />
                                            <button @click="removeImage('avatar')"
                                                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full">
                                                Remover
                                            </button>
                                            <label
                                                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 text-white cursor-pointer rounded-full">
                                                <input type="file" class="hidden"
                                                    @change="(e) => handleFileChange(e, 'avatar')" accept="image/*" />
                                            </label>
                                        </div>
                                        <p v-if="errors.avatar" class="text-red-500 text-sm text-center mt-1">{{
                                            errors.avatar }}</p>

                                        <!-- Formulário -->
                                        <form class="mt-6 space-y-4" @submit.prevent="submitForm">
                                            <div>
                                                <label class="block mb-3 text-gray-700 font-medium">Nome</label>
                                                <input v-model="name" type="text"
                                                    class="w-full px-4 outline-none py-2 border rounded-md focus:ring focus:border-primary"
                                                    required />
                                            </div>
                                            <div>
                                                <label class="block mb-3 text-gray-700 font-medium">Biografia</label>
                                                <textarea :maxlength="160" v-model="bio"
                                                    class="w-full outline-none resize-none px-4 py-2 border rounded-md focus:ring focus:border-primary"></textarea>
                                            </div>
                                            <button type="submit"
                                                class="w-full bg-primary hover:opacity-80 text-white py-2 rounded-md transition">

                                                {{ loading ? 'Carregando' : 'Salvar Alterações' }}
                                               
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <!--end content body-->
                            </div>
                        </DialogPanel>
                        <!--end body content-->
                    </TransitionChild>
                </div>
            </div>
            <!--end body-->
        </Dialog>
    </TransitionRoot>
</template>
