<<<<<<< Updated upstream
import { createRouter, createWebHistory } from 'vue-router'
import Task from '../views/Task.vue'
=======
import { createRouter, createWebHistory } from 'vue-router';
import Task from '../views/Task.vue';
import { getItemById } from '@/libs/fetchUtils.js'; 
import StatusList from '@/components/StatusList.vue';
>>>>>>> Stashed changes


const history = createWebHistory()

const routes = [
  { path: '/task', name: 'task', component: Task },
  { path: '/', name: 'home', redirect: '/task' },
  {path: "/task/:id" , name : "taskDetail" , component: Task},
  {path: "/task/add", name: "taskAdd", component: Task}
]

const router = createRouter({
  history,
<<<<<<< Updated upstream
  routes,
})
=======
  routes: [
    { path: '/task', name: 'task', component: Task },
    { path: '/', name: 'home', redirect: '/task'  },
    { path: '/task/:id', name: 'taskDetail', component: Task, props: true, async beforeEnter(to, from) {
      const id = to.params.id
      const url = `http://localhost:8080/v1/tasks`
      const {item, status} = await getItemById(url, id)
      if (status === 404) {
        alert('Task not found')
        return {name: 'task'}
      }
      to.params.item = item
    }
  },
    { path: '/task/add', name: 'taskAdd', component: Task },
    {path: '/task/:id/edit', name: 'taskEdit', component: Task, props: true, async beforeEnter(to, from) {
      const id = to.params.id
      const url = `http://localhost:8080/v1/tasks`
      const {item, status} = await getItemById(url, id)
      if (status === 404) {
        alert('Task not found')
        return {name: 'task'}
      }
      to.params.item = item
    }
  },
  { path: '/task/statusDetail', component: StatusList },
  ]
})
;
>>>>>>> Stashed changes

export default router
