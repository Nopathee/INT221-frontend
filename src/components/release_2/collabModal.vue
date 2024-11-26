<script setup>
import { computed, defineProps, ref, watch } from 'vue'
const props = defineProps({
  email: String,
  userEmail: Array
})
const newcollabEmail = ref('')
const newAccess = ref('READ')
const newCollab = computed(() => ({
  email: newcollabEmail.value,
  accessRight: newAccess.value
  
}))

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log(props.userEmail);
console.log(props.email);

const notvalidEmail = computed(() => {
  if (!newcollabEmail.value) {
    return "Email cannot be empty";
  } else if (newcollabEmail.value === props.email) {
    return "Board owner cannot be collaborator of his/her own board";
  } else if (!emailPattern.test(newcollabEmail.value)) {
    return "Email does not match any valid user emails";
  } 
  return null; // No reason, enable the button
});


console.log(newCollab);


defineEmits(['addCollab', 'closeModal'])
</script>

<template>
  <div>
    <div>
      <div class="fixed inset-0 flex items-center justify-center z-50">
        <div
          class="bg-white rounded-lg p-8 w-3/5 shadow-2xl dark:bg-gray-700 itbkk-modal-alert"
        >
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Add Collaborator
            </h2>
          </div>
          <form class="p-4 md:p-5">
            <div class="grid gap-4 mb-4">
              <div class="col-span-2">
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Collaborator e-mail</label>
                  <p
                  v-if="notvalidEmail"
                  class="text-red-500 text-sm mt-2"
                  >
                  {{ notvalidEmail }}
                </p>
                <div class="flex gap-2">
                  <input
                    id="email"
                    v-model.trim="newcollabEmail"
                    required
                    maxlength="50"
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-collaborator-email"
                  />
                </div>
              </div>
              <div class="col-span-2 itbkk-access-right">
                <label for="accessRight" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Access Right</label>
                    <select 
                    id="accessRight" 
                    v-model="newAccess" 
                    class="dropdown bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-access-rihgt">
                    <option value="READ">READ</option>
                    <option value="WRITE">WRITE</option>
                    </select>
              </div>
            </div>
          </form>
          <div class="flex justify-end">
            <button
              @click="$emit('addCollab', newCollab)"
              :disabled="notvalidEmail"
              class="px-4 py-2 bg-green-500 text-white rounded-md mr-2 disabled:opacity-50 itbkk-button-confirm"
            >
              Add
            </button>

            <button
              @click="$emit('closeModal')"
              class="px-4 py-2 bg-red-500 text-white rounded-md itbkk-button-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
