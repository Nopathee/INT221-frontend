<script setup>

const props = defineProps({
  taskEdit: String,
  statusEdit:String,
})

defineEmits(['closeToast'])


</script>

<template>
  <div v-if="taskEdit">
    <div class="flex justify-center">
      <div
        class="w-2/3 bg-green-100 border-2 border-dashed border-green-500 rounded-lg h-20 relative"
      >
        <div class="absolute right-0 m-2">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              class=" fill-green-500 cursor-pointer"
              @click="$emit('closeToast')"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
        </div>
        <div class="m-2">
          <h2 class="text-lg text-green-500 font-bold">Success</h2>
          <p class="text-green-800">Task {{ props.taskEdit }} has been edited</p>
        </div>
      </div>
    </div>
  </div>

  <div v-if="statusEdit">
    <div class="flex justify-center">
      <div
        class="w-2/3 bg-green-100 border-2 border-dashed border-green-500 rounded-lg h-20 relative"
      >
        <div class="absolute right-0 m-2">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              class=" fill-green-500 cursor-pointer"
              @click="$emit('closeToast')"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
        </div>
        <div class="m-2">
          <h2 class="text-lg text-green-500 font-bold">Success</h2>
          <p class="text-green-800">Status {{ props.statusEdit }} has been edited</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
