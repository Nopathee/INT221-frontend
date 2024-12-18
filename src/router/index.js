import { createRouter, createWebHistory } from 'vue-router'
import Task from '../views/Task.vue'
import { getItemById, getItems } from '@/libs/fetchUtils.js'
import StatusList from '@/components/StatusList.vue'
import Login from '../components/release_2/Login.vue'
import EmptyBoard from '@/components/release_2/EmptyBoard.vue'
import StatusBoard from '@/components/release_2/StatusBoard.vue'
import CollabBoard from '@/components/release_2/collabBoard.vue'
import BoardList from '@/components/release_2/BoardList.vue'
import AccessDenied from '@/views/AccessDenied.vue'


const history = createWebHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history,
  routes: [
    { path: '/task', name: 'task', component: Task },
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
          to.params.notFound = true
          return
        }
        to.params.item = item
      },
    },
    { path: '/', name: 'home', component: Login },
    {
      path: '/access-denied',
      name: 'accessDenied',
      component:AccessDenied 
    },
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
      meta: { requiresAuth: true },
    },
    {
      path: '/board/:boardId/task/add',
      name: 'addTaskBoard',
      component: EmptyBoard,
      props: true,
      meta: { requiresAuth: true },
      async beforeEnter(to, from, next) {
        const boardId = to.params.boardId;
        const token = localStorage.getItem('accessToken');
      
        if (token) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            const data = await response.json();
           if (data.accessRight === 'READ' || response.status === 403 ) {
              next('/access-denied');
            } else if (response.status === 200 || data.accessRight === 'WRITE') {
              next();
            }  else {
              next('/login');
            }
          } catch (error) {
            next('/login');
          }
        } else {
          next('/access-denied');
        }
      }
    },
    {
      path: '/board/:boardId/task/:id/edit',
      name: 'editTaskBoard',
      component: EmptyBoard,
      props: true,
      async beforeEnter(to, from, next) {
        const boardId = to.params.boardId;
        const token = localStorage.getItem('accessToken');
      
        if (token) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            const data = await response.json();
            
            if (data.accessRight === 'READ' || response.status === 403) {
              next('/access-denied');
            } else if (response.status === 200 || data.accessRight === 'WRITE') {
              next();
            } else {
              next('/login');
            }
          } catch (error) {
            next('/login');
          }
        } else {
          next('/access-denied');
        }
      }
      ,
      meta: { requiresAuth: true },
    },
    {
      path: '/board/:boardId/task/:id',
      name: 'TaskBoard',
      component: EmptyBoard,
      props: true,
      async beforeEnter(to, from, next) {
        const boardId = to.params.boardId;
        const token = localStorage.getItem('accessToken');
      
        if (token) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
 
            
            if (response.status === 403) {
              next('/access-denied');
              return;
            }
            const data = await response.json();

            
            if(data.visibility === 'PUBLIC' || data.accessRight === 'OWNER' || data.accessRight === 'READ' ){
              next()
            } else if (response.status === 404 || response.status == 401) {
              localStorage.removeItem('accessToken')
              next('/login')
            } else {
              next('/login')
            }
          } catch (error) {
            next('/login');
          }
        } else {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            const data = await response.json();
            
            if (data.visibility === 'PUBLIC') {
              next();
            } else {
              next('/access-denied');
            }
          } catch (error) {
            next('/access-denied');
          }
        }
      }
      ,
      meta: { requiresAuth: true },
    },
    { path: '/status', name: 'status', component: StatusList },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/board',
      name: 'board',
      component: BoardList,
      meta: { requiresAuth: true },
      async beforeEnter(to, from, next){
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards` , {
              headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
      
          const data = await response.json()         
          if(data.personalBoards.length > 0 && data.collabBoards.length > 0){
            next()
          } else if(data.personalBoards.length > 0 && data.collabBoards.length === 0 ) {
            next(`/board/${data.personalBoards[0].id}`)
          } else if (data.personalBoards.length === 0 && data.collabBoards.length > 0) {
            next()
          }else {
            next()
          }
          } catch (error) {
          console.error("Error fetching boards:", error);
          }
        } else {
          next('/login'); 
        }
      },
    },


    {
      path: '/board/:boardId',
      name: 'emptyboard',
      component: EmptyBoard,
      props: true,
      meta: { requiresAuth: false },
      async beforeEnter(to, from, next) {
        const boardId = to.params.boardId;
        const token = localStorage.getItem('accessToken');
        try {
          const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              "Content-Type": "application/json",
            },
          });
          if (response.status === 403) {
            next('/access-denied');
            return;
          }
          const boardData = await response.json();
          if (boardData.visibility === 'PUBLIC') {
            next();
          } else if (response.status === 404 || response.status == 401) {
            localStorage.removeItem('accessToken');
            next('/login');
          } else {
            next();
          }
        } catch (error) {
          next('/login');
        }
      }
    },

    {
      path: '/board/:boardId/status',
      name: 'statusBoard',
      component: StatusBoard,
      props: true,
      meta: { requiresAuth: false },
      async beforeEnter(to , from , next) {
        const boardId = to.params.boardId
        const token = localStorage.getItem('accessToken')
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}/statuses`, {
              headers: {
                Authorization: token ? `Bearer ${token}`: '',
                "Content-Type": "application/json",
              },
            });

            if (response.status === 403) {
              next('/access-denied');
              return;
            }
            if (response.status === 404 || response.status == 401) {
              localStorage.removeItem('accessToken')
              next('/login')
            } else {
              next()
            }
          } catch (error) {
            next('/login')
          }
        } 
    },
    {
      path: '/board/:boardId/status/:statusId/edit',
      name: 'editStatusBoard',
      component: StatusBoard,
      props: true,
      meta: { requiresAuth: true },
      async beforeEnter(to, from, next) {
        const boardId = to.params.boardId;
        const token = localStorage.getItem('accessToken');
      
        if (token) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            const data = await response.json();
            if (data.accessRight === 'READ' || response.status === 403) {
              next('/access-denied');
            } else if (response.status === 200 || data.accessRight === 'WRITE') {
              next();
            } else {
              next('/login');
            }
          } catch (error) {
            next('/login');
          }
        } else {
          next('/access-denied');
        }
      }
    },
    {
      path: '/board/:boardId/status/add',
      name: 'addStatusBoard',
      component: EmptyBoard,
      props: true,
      meta: { requiresAuth: true },
      async beforeEnter(to, from, next) {
        const boardId = to.params.boardId;
        const token = localStorage.getItem('accessToken');
      
        if (token) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            const data = await response.json();
            if (data.accessRight === 'READ' || response.status === 403) {
              next('/access-denied');
            } else if (response.status === 200 || data.accessRight === 'WRITE') {
              next();
            } else {
              next('/login');
            }
          } catch (error) {
            next('/login');
          }
        } else {
          next('/access-denied');
        }
      }
    },
    {
      path: '/board/:boardId/collab',
      name: 'collabBoard',
      component: CollabBoard,
      props: true,
      meta: { requiresAuth: false },
      async beforeEnter(to , from , next) {
        const boardId = to.params.boardId
        const token = localStorage.getItem('accessToken')
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`, {
              headers: {
                Authorization: token ? `Bearer ${token}`: '',
                "Content-Type": "application/json",
              },
            });

            if (response.status === 403) {
              next('/access-denied');
              return;
            }
            const boardData = await response.json();          
            if (response.status === 404 || response.status == 401) {
              localStorage.removeItem('accessToken')
              next('/login')
            } else {
              next()
            }
          } catch (error) {
            next('/login')
        } 
      }
      
    },
  ],
})


export default router
