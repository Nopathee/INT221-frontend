<script setup>

import { ref } from 'vue';
defineEmits(['saveLimit', 'cancleLimit', 'comfirmModal'])

const limitStatus = ref(false)

const props = defineProps({
  tasks: Array,
  statuses: Array,
})
// const limit = (limitNumber) => {
//  if(limitStatus === true){
//   confirmModal.value = true

//  }


// }
const isLimitDisabled = ref(false)

const limitNumber = ref(0)

</script>

<template>
    <div>
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div
        class="bg-white rounded-lg p-8 max-w-md shadow-2xl dark:bg-gray-700"
      >
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Limit task in status
          </h2>
        </div>
        <div class="flex"> 
            <h1>The user can enable/disable a maximum limit of 10 tasks except "No status" and "Done"</h1>
            <input @click="isLimitDisabled = !isLimitDisabled , limitStatus = !limitStatus , $emit('confirmToast')" type="checkbox" class="toggle" /> 

        </div>
        <div class="flex justify-between p-4" v-show="isLimitDisabled"> 
             <h1>maximum task</h1>
             <input type="number" min="0" max="10" class="rounded-lg text-center" v-model="limitNumber"/>
             
             </div>
        <div class="flex justify-end">
          
          <button
            @click="$emit('saveLimit', limitNumber)"
            class="px-4 py-2 bg-green-500 text-white rounded-md mr-2 disabled:opacity-50"
            
          >
            Save
          </button>
          <button
            @click="$emit('cancelLimit')"
            class="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped></style>
