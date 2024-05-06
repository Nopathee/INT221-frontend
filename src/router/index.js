import { createRouter, createWebHistory } from 'vue-router';
import Task from '../views/Task.vue';
import { getItemById } from '@/libs/fetchUtils.js'; 

const history = createWebHistory();

const router = createRouter({
  history,
  routes: [
    { path: '/task', name: 'task', component: Task },
    { path: '/', name: 'home', redirect: '/task'  },
    { path: '/task/:id', name: 'taskDetail', component: Task, props: true,
      beforeEnter: async (to , next) => {
        try {
          const detail = await getItemById(`/tasks/${to.params.id}`)
          if (detail) {
            next(`/task/${id}`)
          } else {
            alert('The requested task does not exist');
            next('/task')
          }
        } catch (error) {
          console.error('Error fetching task detail:', error);
          
        }
      }
    },
    { path: '/task/add', name: 'taskAdd', component: Task },
  ]
});

export default router;
