import { createRouter, createWebHistory } from 'vue-router'
import Task from '../views/Task.vue'


const history = createWebHistory()

const routes = [
  {path: "/task" , name : "task" , component: Task}
]

const router = createRouter({
  history,
  routes
})

export default router
