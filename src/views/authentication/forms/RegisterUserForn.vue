<script setup>
import { computed, ref, watch } from 'vue';
import Input from '@/components/UI/inputs/Input.vue';
import SelectInput from '@/components/UI/inputs/SelectInput.vue';
import { useStore } from 'vuex';
import SmallSpinner from "@/components/UI/spinners/SmallSpinner.vue";
import { useAuth } from '@/repositories/auth-repository';


const { checkEmail, loading: checkEmailLoading } = useAuth()
const { checkUsername, loading: checkUsernameLoading } = useAuth()

const emit = defineEmits();

const form = ref({
    name: "",
    email: "",
    username: "",
    birthDate: {
        month: null,
        day: null,
        year: null
    },
    password: ""
})

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    }
})

const store = useStore()

const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
]

const errors = ref({
    email: {
        show: false,
        message: ""
    },
    name: {
        show: false,
        message: ""
    },
    username: {
        show: false,
        message: ""
    },
    password: {
        show: false,
        message: ""
    }
})

const generateDays = computed(() => {
    // Definir o mês atual caso o selectedMonth não tenha valor
    const currentMonth = form.value.birthDate.month || new Date().getMonth() + 1 // getMonth retorna o mês de 0 a 11

    // Obter o ano atual
    const currentYear = new Date().getFullYear()

    // Obter o número de dias no mês selecionado
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate()

    // Gerar os dias do mês
    const days = []
    for (let day = 1; day <= lastDayOfMonth; day++) {
        days.push({ value: day, label: `${day}` }) // Formato { value, label }
    }

    return days
})


const generateYears = computed(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
        value: currentYear - i,
        label: `${currentYear - i}`
    }));
});

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
        errors.value.email.show = true;
        errors.value.email.message = "Insira um e-mail válido.";
    } else {
        if (email.length) {
            checkEmail(email).then(() => {
                errors.value.email.show = false;
                errors.value.email.message = "";
            }).catch((err) => {
                errors.value.email.show = true;
                errors.value.email.message = err.response.data.message;
            })
        } else {
            errors.value.email.show = false;
            errors.value.email.message = "";
        }
    }
};

const validateName = (name) => {
    if (name == '') {
        errors.value.name.show = true;
        errors.value.name.message = "Qual é o seu nome?";
    } else {
        errors.value.name.show = false;
        errors.value.name.message = "";
    }
};

const validateUsername = (username) => {
    const usernameRegex = /^(?!.*[_.]{2})^(?![_.])[\w.]{3,20}(?<![_.])$/;
    if (username && !usernameRegex.test(username)) {
        errors.value.username.show = true;
        errors.value.username.message = "Deve ter 3 a 20 caracteres, sem espaços ou símbolos inválidos..";
    } else {
        if (username.length) {
            checkUsername(username).then(() => {
                errors.value.username.show = false;
                errors.value.username.message = "";
            }).catch((err) => {
                errors.value.username.show = true;
                errors.value.username.message = err.response.data.message;
            })
        } else {
            errors.value.username.show = false;
            errors.value.username.message = "";
        }
    }
};

const validatePassword = (password) => {
    const passwordRegex = /(?=.*[A-Z])(?=.*\d)/;
    if (password && password.length < 6 || !passwordRegex.test(password)) {
        errors.value.password.show = true;
        errors.value.password.message = "Deve ter 6 a 30 caracteres, incluindo pelo menos uma letra e um número.";
    } else {
        errors.value.password.show = false;
        errors.value.password.message = "";
    }
};


const isFormComplete = computed(() => {
    // Verificar se todos os campos do formulário estão preenchidos
    return form.value.name !== "" && !errors.value.name.show &&
        form.value.email !== "" && !errors.value.email.show &&
        form.value.username !== "" && !errors.value.username.show &&
        form.value.password !== "" && !errors.value.password.show &&
        form.value.birthDate.month !== null &&
        form.value.birthDate.day !== null &&
        form.value.birthDate.year !== null &&
        !checkEmailLoading.value &&
        !checkUsernameLoading.value 
});

watch(isFormComplete, (isValid) => {
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
                <div class="mb-8">
                    <h1 class="text-3xl font-bold">Criar sua conta</h1>
                </div>

                <div class="mb-10">
                    <div class="w-full flex flex-col gap-4">
                        <div>
                            <Input @input="validateName(form.name)" v-model="form.name"
                                :error="{ show: errors.name.show, message: errors.name.message }" title="Nome"
                                label="name" />
                        </div>
                        <div>
                            <Input @input="validateEmail(form.email)" v-model="form.email"
                                :error="{ show: errors.email.show, message: errors.email.message }" title="E-mail"
                                label="email" />
                        </div>

                        <div>
                            <h5 class="text-sm font-bold mb-1.5 text-gray-700">Data de nascimento</h5>
                            <p class="text-sm text-gray-500 leading-tight">Isso não será exibido publicamente. Confirme
                                sua
                                própria idade, mesmo se esta conta for de empresa, de um animal de estimação ou outros.
                            </p>
                        </div>

                        <ul class="flex items-center gap-3">
                            <li class="grow-[2]">
                                <SelectInput title="Mês" label="month" :options="months" v-model="form.birthDate.month"
                                    :error="{ show: false, message: 'Selecione uma opção válida' }" />
                            </li>
                            <li class="grow">
                                <SelectInput title="Dia" label="day" :options="generateDays"
                                    v-model="form.birthDate.day"
                                    :error="{ show: false, message: 'Selecione uma opção válida' }" />
                            </li>
                            <li class="grow">
                                <SelectInput title="Ano" label="year" :options="generateYears"
                                    v-model="form.birthDate.year"
                                    :error="{ show: false, message: 'Selecione uma opção válida' }" />
                            </li>

                        </ul>

                        <div>
                            <Input @input="validateUsername(form.username)" v-model="form.username"
                                :error="{ show: errors.username.show, message: errors.username.message }"
                                title="@nomedeusuario" label="username" />
                        </div>

                        <div>
                            <Input @input="validatePassword(form.password)" v-model="form.password" type="password"
                                :error="{ show: errors.password.show, message: errors.password.message }" title="Senha"
                                label="password" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>