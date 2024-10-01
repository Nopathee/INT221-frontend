@ -0,0 +1,42 @@
<script setup>
import { ref } from 'vue'

const props = defineProps({
  newMode: String,
})

// กำหนด event สำหรับปุ่ม confirm และ close
const emit = defineEmits(['confirm', 'close'])
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <!-- หัวข้อ -->
      <h1 class="text-lg font-bold text-center mb-4">
        Do you want to change board visibility to "<span
          class="text-blue-500"
          >{{ props.newMode }}</span
        >"?
      </h1>

      <!-- ปุ่ม Confirm และ Cancel -->
      <div class="flex justify-center gap-4 mt-6">
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          @click="$emit('confirm')"
        >
          Confirm
        </button>
        <button
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          @click="$emit('close')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* คุณสามารถเพิ่มสไตล์เพิ่มเติมตามความต้องการ */
</style>
