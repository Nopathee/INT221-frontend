<script setup>
const props = defineProps({
  taskDelete: String,
  statusDelete: String,
})



defineEmits(['closeToast'])

</script>

<template>
  <div>
    <div class="flex justify-center">
      <div
        class="w-2/3 bg-red-100 border-2 border-dashed border-red-500 rounded-lg h-20 relative"
      >
        <div class="absolute right-0 m-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            class="fill-red-500 cursor-pointer"
            @click="$emit('closeToast')"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </div>
        <div class="m-2">
          <h2 class="text-lg text-red-500 font-bold">Deleted</h2>
          <p class="text-red-800">
            {{ props.taskDelete ? "Task" : "Status"}} {{ props.taskDelete ? props.taskDelete : props.statusDelete }} has been deleted
          </p>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped></style>
