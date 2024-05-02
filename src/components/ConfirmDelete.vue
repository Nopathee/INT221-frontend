<script setup>
defineEmits(['close'])

const props = defineProps({
  id: String,
})

console.log(props.id)
</script>

<template>
  <div>
    <div class="fixed inset-0 items-center flex justify-center">
      <div class="bg-white w-52 h-48 drop-shadow-xl border rounded-lg">
        <div class="flex justify-center mt-3">
          <img src="../components/icon/remove.svg" alt="" />
        </div>
        <h1 class="flex justify-center font-bold">Are You Sure?</h1>
        <div class="flex justify-center gap-2 mt-3">
          <button
            class="btn btn-sm w-16 bg-red-500 text-white hover:bg-red-700"
            @click=""
          >
            Delete
          </button>
          <button
            class="btn btn-sm w-16 bg-slate-400 hover:bg-slate-600 text-white"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
