<script setup>
import { login } from '@/libs/fetchUtils_release2'
import { computed, ref , defineProps} from 'vue'
import { useRouter } from 'vue-router'

const userName = ref('')
const password = ref('')
const error = ref(false)
const isLoginDisabled = computed(() => {
  return userName.value.length === 0 || password.value.length === 0
})

const props = defineProps({
  boardId: String,
})


const router = useRouter()

const handlerLogin = async () => {
  const user = {
    userName :userName.value,
    password : password.value
  }
  console.log(user)
  const url = `${import.meta.env.VITE_API_ENDPOINT}/login`
  const res = await login(url, user)
  const token = res.token
  console.log(res.token)
  if (res.status === 200) {
    localStorage.setItem('accessToken',token)
    console.log(localStorage.getItem('accessToken'))
    console.log(`"${token}"`)
    console.log(`login success`)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards` , {
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json()
    
    if(data && data.length > 0){
      console.log(data)
      router.push(`/board/${data[0].id}`);
    } else {
      router.push('/board')
    }
    } catch (error) {
    console.error("Error fetching boards:", error);
    }

  } else {
    error.value = true
    setTimeout(() => {
      error.value = false
    }, 3000)
    console.log(`login fail`)
  }
}


</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center p-8 mx-auto md:h-screen lg:py-0"
    >
      <div
        v-if="error"
        class="flex flex-col m-5 bg-red-100 border border-red-400 text-red-700 px-4 rounded relative"
        role="alert"
      >
        <div class="absolute right-0 m-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            class="fill-red-500 cursor-pointer"
            @click="$emit('close-error')"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </div>
        <strong class="font-bold pt-3">Error</strong>
        <span class="block sm:inline pb-3 itbkk-message"
          >Username or Password is incorrect.</span
        >
      </div>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <p
            class="text-2xl font-bold text-gray-900 dark:text-white text-center"
          >
            Login
          </p>
          <form class="md:p-1">
            <label
              for="username"
              class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
              >Username
            </label>
            <input
              type="text"
              id="username"
              v-model="userName"
              class="rounded-lg w-full h-10 text-base pl-2 border itbkk-username"
              maxlength="50"
              required
            />
            <label
              for="password"
              class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
              >Password
            </label>
            <div class="relative">
              <input
                type="password"
                id="password"
                v-model="password"
                class="rounded-lg w-full h-10 text-base pl-2 border itbkk-password"
                maxlength="14"
                required
              />
            </div>
          </form>
          <div class="pt-6">
            <button
              :disabled="isLoginDisabled"
              @click="handlerLogin"
              class="w-full disabled:opacity-50 bg-green-600 text-white font-bold dark:text-white rounded-lg text-sm px-5 py-6 text-center itbkk-button-signin"
              :class="{'disabled' : isLoginDisabled}"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
