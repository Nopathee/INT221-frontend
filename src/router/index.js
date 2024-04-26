import { createRouter, createWebHistory } from 'vue-router'
import Task from '../views/Task.vue'
import Popup from '@/components/Popup.vue'


const history = createWebHistory()

const routes = [
  {path: "/task" , name : "task" , component: Popup},
  {path: "/" , name : "home" , redirect: "/task"},
  {path: "/task/:id" , name : "task-detail" , component: Task},
]

const router = createRouter({
  history,
  routes
})

export default router
