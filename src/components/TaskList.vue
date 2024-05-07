<script setup>
import { onMounted, ref } from 'vue'
import Table from './Table.vue'
import TaskDetail from './TaskDetail.vue'
import ConfirmDelete from './ConfirmDelete.vue'
import TaskModal from './TaskModal.vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem
} from '@/libs/fetchUtils.js'
import { TaskManagement } from '../libs/TaskManagement.js'
import router from '@/router'
console.log(`${import.meta.env.VITE_API_ENDPOINT}/tasks`)
const allTask = ref(new TaskManagement())

onMounted(async () => {
  const items = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/tasks`)
  allTask.value.addDtoTasks(items)
  console.log(allTask.value.getTasks())
})

const showModal = ref(false)

const confirmDelete = ref(false)

const clearModal = (flagModal) => {
  task.value = {
    id: undefined,
    title: '',
    description: null,
    assignees: null,
    status: 'NO_STATUS',
  }
  showModal.value = flagModal
  router.push('/task')
}

const showInsert = (flagModal) => {
  showModal.value = flagModal
  router.push('/task/add')
}

const saveTask = async (task) => {
  console.log(task)
  if (task.id === undefined) {
    const newTask = await addItem(
      `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
      {
        title: task.title,
        description: task.description,
        assignees: task.assignees,
        status: task.status,
      }
    )
    console.log(newTask)
    allTask.value.addNewTask(
      newTask.id,
      newTask.title,
      newTask.description,
      newTask.assignees,
      newTask.status
    )
    
    

    showModal.value = false

    task.value = {
      id: undefined,
      title: '',
      description: null,
      assignees: null,
      status: 'NO_STATUS',
    }
    router.push('/task')
  } else {
    const updatedTask = await editItem(
      `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
      task.id,
      {
        title: task.title,
        description: task.description,
        assignees: task.assignees,
        status: task.status,
      }
    )
    console.log(updatedTask)
    allTask.value.updateTask(
      updatedTask.id,
      updatedTask.title,
      updatedTask.description,
      updatedTask.assignees,
      updatedTask.status
    )

    showModal.value = false

    task.value = {
      id: undefined,
      title: '',
      description: null,
      assignees: null,
      status: 'NO_STATUS',
    }

    router.push('/task')
  }
}

const task = ref({
  id: undefined,
  title: '',
  description: null,
  assignees: null,
  status: 'NO_STATUS',
})

const taskDetail = ref({
  id: '',
  title: '',
  description: null,
  assignees: null,
  status: 'NO_STATUS',
  createdOn: '',
  updatedOn: '',
})

const showModalDetail = ref(false)

const showDetail = async (id) => {
  console.log(id)

  const detail = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
    id
  )
  console.log(detail.status)
  if (detail.status === 404) {
    alert('The requested task does not exist')
    router.push('/task')
  } else {
    taskDetail.value = await detail.item
    showModalDetail.value = true
    router.push(`/task/${id}`)
  }
}

// const showDetail = async (id) => {
//   console.log(id)

//   try {
//     const detail = await getItemById(
//       `${import.meta.env.VITE_API_ENDPOINT}/tasks/${id}`
//     );

//     // If the request is successful but the detail is null, it means the resource does not exist
//     if (!detail) {
//       alert('The requested task does not exist');
//       router.push("/task");
//       return;
//     }

//     taskDetail.value = detail;
//     showModalDetail.value = true;
//     router.push(`/task/${id}`);
//   } catch (error) {
//     if (error.response && error.response.status === 404) {
//       alert('The requested task does not exist');
//       router.push("/task");
//     } else {
//       console.error("Error fetching task detail:", error);
//     }
//   }
// }

// const showDetail = async (id) => {
//
//       const response = await getItemById(
//         `${import.meta.env.VITE_BASE_URL}/v1/tasks/${id}`
//       )
//       if (response.ok) {
//         const data = await response.json()
//         taskDetail.value = data
//       } else if (response.status === 404) {
//         alert("The requested task does not exist")
//         router.push("/task")
// }

const deleteTask = ref('')

const showDelete = async (id) => {
  deleteTask.value = await id
  confirmDelete.value = true
  console.log(deleteTask.value)
}

const closeDelete = () => {
  confirmDelete.value = false
}

const closeDetail = () => {
  showModalDetail.value = false
  router.push('/task')
}

const confDelete = async (id) => {
  const status = await deleteItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
    id
  )

  if (status === 200) {
    allTask.value.removeTask(id)
    confirmDelete.value = false
  }
}

const showEdit = async (id) => {
  const detail = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
    id
  )
  task.value = await detail.item
  showModal.value = true
  router.push(`/task/${id}/edit`)
}

</script>

<template>
  <div>
    <Table
      :tasks="allTask.getTasks()"
      @openModal="showInsert"
      @showDetail="showDetail"
      @deleteTask="showDelete"
      @editTask="showEdit"
    />
    <Teleport to="#modal">
      <div v-show="showModal">
        <TaskModal @cancelTask="clearModal" @saveTask="saveTask" :task="task" />
      </div>
    </Teleport>
    <Teleport to="#modal">
      <div v-if="confirmDelete">
        <ConfirmDelete
          @close="closeDelete"
          @confirm="confDelete"
          :id="deleteTask"
        />
      </div>
    </Teleport>
    <Teleport to="#modal">
      <div v-if="showModalDetail">
        <TaskDetail @close="closeDetail" :task="taskDetail" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped></style>
