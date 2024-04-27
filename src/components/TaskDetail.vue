<script setup>
import { TaskManagement } from '@/libs/TaskManagement'
import { getItemById } from '@/libs/fetchUtils'
import router from '@/router'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const { params } = useRoute()

const task = ref(new TaskManagement())

onMounted(async () => {
  const items = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
    params.id
  )

  if (items.status === 404) {
    alert('Path not found')
    router.go('/task')
  } else {
    const formattedCreateOn = new Date(items.createdOn).toLocaleString('en-GB')
    const formattedUpdatedOn = new Date(items.updatedOn).toLocaleString('en-GB')
    task.value.addTask(
      items.id,
      items.title,
      items.description,
      items.assignees,
      items.status,
      formattedCreateOn,
      formattedUpdatedOn
    )
    console.log(task.value.getTasks())
    getTimezone()
  }
})

const showTime = ref({
  timezone: '',
})

const getTimezone = () => {
  showTime.value.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
}
</script>

<template>
  <div class="w-full flex justify-center p-10" v-for="t in task.getTasks()">
    <div class="bg-amber-800 w-3/4 flex flex-col p-2 gap-5 rounded-xl">
      <div class="font-semibold text-2xl text-white">
        <h1 class="itbkk-title">{{ t.title }}</h1>
      </div>
      <hr />
      <div class="flex gap-2 ">
        <div class="ml-2 w-2/3">
          <p class="text-sm text-white">Description</p>
          <textarea
            class="border-2 border-white h-72 w-full itbkk-description rounded-md"
            :style="{ fontStyle: t.description ? 'normal' : 'italic' }"
            >{{
              t.description ? t.description : 'No Description Provided'
            }}</textarea
          >
        </div>
        <div class="flex flex-col gap-3 w-1/3">
          <div class="ml-1">
            <p class="text-sm text-white">Assignees</p>
            <textarea class="border-2 h-24 w-full itbkk-assignees rounded-md">{{
              t.assignees
            }}</textarea>
          </div>
          <div class="ml-1">
            <p class="text-sm text-white">Status</p>
            <select
              class="border-2 h-7 w-full itbkk-status rounded-md"
              v-model="t.status"
            >
              <option value="No Status">No Status</option>
              <option value="To Do">To Do</option>
              <option value="Doing">Doing</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div class="m-1 flex">
            <p class="text-sm text-white">
              TimeZone:
              <label
                class="itbkk-timezone bg-slate-100 p-1 px-10 mx-2 text-black rounded-lg"
              >
                {{ showTime.timezone }}</label
              >
            </p>
          </div>
          <div class="m-1 flex">
            <p class="text-sm text-white">
              CreateOn:
              <label
                class="itbkk-created-on bg-slate-100 p-1 px-5 mx-2 text-black rounded-lg"
              >
                {{ t.createdOn }}</label
              >
            </p>
          </div>
          <div class="m-1 flex">
            <p class="text-sm text-white">
              UpdatedOn:
              <label
                class="itbkk-updated-on bg-slate-100 p-1 px-3 mx-2 text-black rounded-lg"
              >
                {{ t.updatedOn }}</label
              >
            </p>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
