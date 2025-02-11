<script setup>
import { computed, ref, watch } from 'vue';
import Input from '../components/UI/inputs/Input.vue';
import { useStore } from 'vuex';

const emit = defineEmits();

const form = ref({
    email: "",
    password: ""
})

const errors = ref({
    email: {
        show: false,
        message: ""
    }
})

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    }
})


const store = useStore()

const isFormComplete = computed(() => {
    // Verificar se todos os campos do formulário estão preenchidos
    return form.value.email !== ""
});

watch(isFormComplete, (isValid) => {
    console.log(isValid)
    emit('formValid', isValid);

    if (isValid) {
        store.dispatch("setUser", form.value)
    }
});

</script>

<template>
    <div>
        <div class="mx-20 py-3">
            <div class="h-[50vh]">
                <div>
                    <div class="mb-8">
                        <h1 class="text-3xl mb-3 font-bold">Esqueci a Senha</h1>

                        <p class="text-gray-500 leading-tight text-sm">Digite o e-mail que você usou para criar a sua conta. Nós lhe enviaremos um "código de redefinição" para que você possa definir uma nova senha.</p>
                    </div>

                    <div>
                        <div class="w-full flex flex-col gap-4">
                            <div>
                                <Input v-model="form.email"
                                    :error="{ show: errors.email.show, message: errors.email.message }"
                                    title="Digite o seu e-mail " label="email" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>