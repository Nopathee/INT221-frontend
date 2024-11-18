<script setup>
import { login } from '@/libs/fetchUtils_release2'
import { computed, ref, defineProps } from 'vue'
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
    userName: userName.value,
    password: password.value
  }
  console.log(user)
  const url = `${import.meta.env.VITE_API_ENDPOINT}/login`
  const res = await login(url, user)
  const token = res.token
  const refreshToken = res.refreshToken
  console.log(refreshToken);
  console.log(res.token)
  if (res.status === 200) {
    localStorage.setItem('accessToken', token)
    localStorage.setItem('refreshToken', refreshToken)
    console.log(localStorage.getItem('accessToken'))
    console.log(`${token}`)
    console.log(`login success`)
    router.push('/board')

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
  <section class="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen flex items-center justify-center">
    <div v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 shadow-lg transition-opacity duration-500"
      role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">Username or Password is incorrect.</span>
      <button @click="error = false" class="absolute top-0 right-0 p-2 text-red-500">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div
      class="w-full max-w-md p-8 space-y-8 bg-white rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500">
      <h2 class="text-4xl font-extrabold text-center text-gray-900 mb-4">Login</h2>
      <form class="space-y-6">
        <div>
          <label for="username" class="block text-lg font-semibold text-gray-700 mb-2">Username</label>
          <div class="relative">
            <span class="absolute left-3 top-3 text-gray-400">
              <i class="fas fa-user"></i>
            </span>
            <input type="text" id="username" v-model="userName" placeholder="Enter your username"
              class="pl-10 w-full h-12 text-base border rounded-lg shadow-inner bg-gradient-to-r from-gray-100 to-gray-200 hover:shadow-lg transform hover:-translate-y-1 focus:ring-2 focus:ring-blue-300 transition duration-300"
              required />
          </div>
        </div>
        <div>
          <label for="password" class="block text-lg font-semibold text-gray-700 mb-2">Password</label>
          <div class="relative">
            <span class="absolute left-3 top-3 text-gray-400">
              <i class="fas fa-lock"></i>
            </span>
            <input type="password" id="password" v-model="password" placeholder="Enter your password"
              class="pl-10 w-full h-12 text-base border rounded-lg shadow-inner bg-gradient-to-r from-gray-100 to-gray-200 hover:shadow-lg transform hover:-translate-y-1 focus:ring-2 focus:ring-blue-300 transition duration-300"
              required />
          </div>
        </div>
        <button :disabled="isLoginDisabled" @click.prevent="handlerLogin"
          class="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 disabled:opacity-50">
          Sign in
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped></style>
