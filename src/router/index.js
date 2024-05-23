import { createRouter, createWebHistory } from 'vue-router'
import Task from '../views/Task.vue'
import { getItemById } from '@/libs/fetchUtils.js'
import StatusList from '@/components/StatusList.vue'
const history = createWebHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history,
  routes: [
    { path: '/task', name: 'task', component: Task },
    { path: '/', name: 'home', redirect: '/task' },
    {
      path: '/task/:id',
      name: 'taskDetail',
      component: Task,
      props: true,
      async beforeEnter(to) {
        const id = to.params.id
        const url = `${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`
        const { item, status } = await getItemById(url, id)
        if (status === 404) {
          alert('Task not found')
          return { name: 'task' }
        }
        to.params.item = item
      },
    },
    { path: '/task/add', name: 'taskAdd', component: Task },
    {
      path: '/task/:id/edit',
      name: 'taskEdit',
      component: Task,
      props: true,
      async beforeEnter(to) {
        const id = to.params.id
        const url = `${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`
        const { item, status } = await getItemById(url, id)
        if (status === 404) {
          alert('Task not found')
          return { name: 'task' }
        }
        to.params.item = item
      },
    },
    { path: '/statuses', name: 'status', component: StatusList },
    {
      path: '/statuses/:id/edit',
      name: 'statusEdit',
      component: StatusList,
      props: true,
      async beforeEnter(to) {
        const id = to.params.id
        const url = `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`
        const { item, status } = await getItemById(url, id)
        if (status === 404) {
          alert('An error has occurred, the status does not exist')
          return { name: 'status' }
        }
        to.params.item = item
      },
    },
    {
      path: '/statuses/:id',
      name: 'statusList',
      component: StatusList,
      props: true,
      async beforeEnter(to) {
        const id = to.params.id
        const url = `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`
        const { item, status } = await getItemById(url, id)
        if (status === 404) {
          alert('An error has occurred, the status does not exist')
          return { name: 'status' }
        }
        to.params.item = item
      },
    },
  ],
})

export default router
