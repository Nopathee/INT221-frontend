import { createRouter, createWebHistory } from 'vue-router'
import Task from '../views/Task.vue'
import Detail from '@/views/Detail.vue'

const history = createWebHistory()

const routes = [
  { path: '/task', name: 'task', component: Task },
  { path: '/', name: 'home', redirect: '/task' },
  {path: "/task/:id" , name : "taskDetail" , component: Task},
  {path: "/task/add", name: "taskAdd", component: Task}
]

const router = createRouter({
  history,
  routes,
})

export default router
