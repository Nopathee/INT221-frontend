import { createRouter, createWebHistory } from 'vue-router'
import Task from '../views/Task.vue'
import { getItemById } from '@/libs/fetchUtils.js'
import StatusList from '@/components/StatusList.vue'
import Login from '../components/release_2/Login.vue'
import Board from '@/components/release_2/Board.vue'
import EmptyBoard from '@/components/release_2/EmptyBoard.vue'



const history = createWebHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history,
  routes: [
    { path: '/board/:id', name: 'board', component: EmptyBoard , meta: { requiresAuth: true } },
    { path: '/', name: 'home', component: Login },
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
      meta: { requiresAuth: true } 
    },
    { path: '/board/:boardId/task/add', name: 'addTaskBoard', component: EmptyBoard , props:true,  meta: { requiresAuth: true } },
    {
      path: '/board/:boardId/task/:id/edit',
      name: 'editTaskBoard',
      component: Task,
      props: true,
      async beforeEnter(to) {
        const id = to.params.id
        const url = `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/:boardId/tasks`
        const { item, status } = await getItemById(url, id)
        if (status === 404) {
          alert('Task not found')
          return { name: 'task' }
        }
        to.params.item = item
      },
      meta: { requiresAuth: true } 
    },
    { path: '/status', name: 'status', component: StatusList },
    {
      path: '/board/:id/status/:status-id/edit',
      component: StatusList,
      props: true,
      async beforeEnter(to) {
        const id = to.params.id
        const url = `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/:boardId/statuses`
        const { item, status } = await getItemById(url, id)
        if (status === 404) {
          to.params.notFound = true
          return
        }
        to.params.item = item
      },
      meta: { requiresAuth: true } 
    },
    { path: '/login', name: 'login', component: Login },
    { path: '/board', name: 'board', component: Board , meta: { requiresAuth: true } },
    
    { path: '/board/:boardId', name: 'emptyboard', component: EmptyBoard , props:true,  meta: { requiresAuth: true } },
    
    
    { path: '/board/:boardId/status', name: 'statusBoard', component: EmptyBoard , props:true,  meta: { requiresAuth: true } },
    { path: '/board/:id/status/add', name: 'addStatusBoard', component: EmptyBoard , props:true,  meta: { requiresAuth: true } },
   
]})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  if (to.path !== '/login'){
    if(token){
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
});

export default router
