<script setup>
const emit = defineEmits([
  'taskDetail',
  
])
const props = defineProps({
  userName: String,
  passWord: String,
})

</script>
 
<template>
    <section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center p-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <p class="text-2xl font-bold  text-gray-900  dark:text-white text-center">
                Login
              </p>
              <form class="md:p-1">
                <label
                for="username"
                class="block mb-2 text-lg font-medium text-gray-900 dark:text-white itbkk-username" 
                >Username</label> 
              <input type="text" class="rounded-lg w-full h-10 text-base pl-2" required="">
              <label
                for="password"
                class="block mb-2 text-lg font-medium text-gray-900 dark:text-white itbkk-password"
                >Password</label>
                <div class="relative">
              <input type="password" id="password" class="rounded-lg w-full h-10 text-base pl-2 disabled:opacity-50 disabled:pointer-events-none" required="">
            </div>
              <div class="pt-6">
                <button type="submit" class="w-full  text-gray-900 dark:text-white bg-slate-900 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-6  text-center itbkk-button-signin"><RouterLink to="/task" @click="$emit='taskDetail'" >Sign in</RouterLink></button>
              </div>
                  
                  
              </form>
          </div>
      </div>
  </div>
</section>


</template>
 
<style scoped>

</style>