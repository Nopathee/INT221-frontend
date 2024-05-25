import { createRouter, createWebHistory } from 'vue-router'
import Task from '../views/Task.vue'
import { getItemById } from '@/libs/fetchUtils.js'
import StatusList from '@/components/StatusList.vue'
import { createApp , h } from 'vue';
import Error from '@/components/Error.vue';
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
    { path: '/status', name: 'status', component: StatusList },
    {
      path: '/status/:id/edit',
      name: 'statusEdit',
      component: StatusList,
      props: true,
      async beforeEnter(to) {
        const id = to.params.id
        const url = `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`
        const { item, status } = await getItemById(url, id)
        if (status === 404) {
          const divEle = document.createElement('div')
          document.body.appendChild(divEle)
          const app = createApp({
            render() {
              return h(Error, {
                status: true,
                notFound: true,
                onCloseToast: () => {
                  app.unmount()
                  document.body.removeChild(divEle)
                },
              })
            },
          })
          app.mount(divEle)
          setTimeout(() => {
            app.unmount();
            document.body.removeChild(divEle);
          }, 3000);
          return { name: 'status' }
        }
        to.params.item = item
      },
    },
  ],
})

export default router
