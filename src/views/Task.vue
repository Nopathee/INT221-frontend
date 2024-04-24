<script setup>
import Table from '@/components/Table.vue'
import { onMounted, ref } from 'vue'
// import getItems from '@/libs/fetchUtils.js'

const fetchedTasks = ref([])

onMounted(async () => {
  try {
    const response = await getItems(`${import.meta.env.VITE_API_URL}/v1/tasks`)
    fetchedTasks.value = response
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
})
</script>

<template>
  <div>
    <Table tasks="fetchedTasks" />
  </div>
</template>

<style scoped></style>
