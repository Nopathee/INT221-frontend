<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  status: Object,

  statuses: Array,
})

console.log(props.status.item)

const allStatuses = ref(props.statuses)

console.log(allStatuses.value)

const anotherStatus = allStatuses.value.filter(
  (status) => status.id !== props.status.item.id
)

const selectedId = ref('')

console.log(anotherStatus)

defineEmits(['deleteStatus', 'closeDeleteModal'])
</script>

<template>
  <div class="fixed inset-0 items-center flex justify-center">
    <div class="bg-white items-center drop-shadow-xl border rounded-lg">
      <div class="flex justify-center mt-6">
        <img src="../components/icon/remove.svg" alt="" />
      </div>
      <h1 class="flex text-xl justify-center font-bold itbkk-message">
        Transfer a Status
      </h1>
      <h2 class="flex justify-center itbkk-message mx-6">
        There is some task associated with the
        <span class="font-semibold italic text-red-800">
          &nbsp;{{ props.status.item.name }}&nbsp;
        </span>
        status.
      </h2>
      <h2 class="flex justify-center items-center">
        Transfer to &nbsp;
        <select class="select select-sm select-bordered" v-model="selectedId">
          <option value="" disabled>Select Status</option>
          <option
            v-for="status in anotherStatus"
            :key="status.id"
            :value="status.id"
          >
            {{ status.name }}
          </option>
        </select>
      </h2>

      <div class="flex justify-center gap-2 mt-3 mb-6">
        <button
          class="btn btn-sm w-16 bg-red-500 text-white hover:bg-red-700 itbkk-button-confirm"
          @click="$emit('deleteStatus', props.status.item.id , selectedId)"
        >
          Delete
        </button>
        <button
          class="btn btn-sm w-16 bg-slate-400 hover:bg-slate-600 text-white itbkk-button-cancel"
          @click="$emit('closeDeleteModal')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
