import { createRouter, createWebHistory } from 'vue-router'
import Task from '../views/Task.vue'
import Popup from '@/components/Popup.vue'

const history = createWebHistory()

const routes = [
  { path: '/task', name: 'task', component: Task },
  { path: '/', name: 'home', redirect: '/task' },
  // {path: "/task/:id" , name : "taskDetail" , component: Popup},
]

const router = createRouter({
  history,
  routes,
})

export default router
