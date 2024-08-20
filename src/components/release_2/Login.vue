<script setup>
 import { login } from '@/libs/fetchUtils_release2';
import { computed, ref } from 'vue';

const username = ref('')
const password = ref('')

const isLoginDisabled = computed(() => {
    return username.value.length === 0 || password.value.length === 0
})

const handlerLogin = async () => {
  const user = {
    username: username.value,
    password: password.value
  }

  console.log(user)

  const url = `${import.meta.env.VITE_API_ENDPOINT}/login/user`
  const res = await login(url,user)
  console.log(res)
  if(res === 200){
    console.log(`login success`)
  } else{
    console.log(`login fail`)
  }
}

  
 



</script>
 
<template>
    <section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center p-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <p class="text-2xl font-bold  text-gray-900  dark:text-white text-center">
                Login
              </p>
              <form  class="md:p-1">
                <label
                for="username"
                class="block mb-2 text-lg font-medium text-gray-900 dark:text-white itbkk-username" 
                >Username</label> 
              <input 
                type="text" 
                id="username"
                v-model="username"
                class="rounded-lg w-full h-10 text-base pl-2 border"
                maxlength="50"
                >
              <label
                for="password"
                class="block mb-2 text-lg font-medium text-gray-900 dark:text-white itbkk-password "
                >Password</label>
                <div class="relative">
              <input 
              type="password" 
              id="password"
              v-model="password"
              class="rounded-lg w-full h-10 text-base pl-2 disabled:opacity-50 disabled:pointer-events-none border" 
              maxlength="14"
              >
            </div>
              
                  
                  
              </form>
              <div class="pt-6">
                <button :disabled="isLoginDisabled" @click="handlerLogin" class="w-full disabled:opacity-50 bg-green-600 text-gray-900 dark:text-white   font-medium rounded-lg text-sm px-5 py-6  text-center itbkk-button-signin">
                 Sign in </button>
              </div>
          </div>
      </div>
  </div>
</section>


</template>
 
<style scoped>

</style>