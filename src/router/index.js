import { createRouter, createWebHistory } from 'vue-router'
import Task from '../views/Task.vue'
import { getItemById, getItems } from '@/libs/fetchUtils.js'
import StatusList from '@/components/StatusList.vue'
import Login from '../components/release_2/Login.vue'
import Board from '@/components/release_2/Board.vue'
import EmptyBoard from '@/components/release_2/EmptyBoard.vue'
import StatusBoard from '@/components/release_2/StatusBoard.vue'
import { getNewAccessToken } from '@/libs/fetchUtils_release2'
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
    },
    {
      path: '/board/:boardId/task/:id/edit',
      name: 'editTaskBoard',
      component: EmptyBoard,
      props: true,
      async beforeEnter(to , from , next) {
        const boardId = to.params.boardId
        const taskId = to.params.id
        const token = localStorage.getItem('accessToken')
        if (token) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}/tasks/${taskId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            console.log('Response status:', response.status);
            if (response.status === 404 || response.status == 401) {
              localStorage.removeItem('accessToken')
              next('/login')
            } else {
              next()
            }
          } catch (error) {
            next('/login')
          }
        } else {
          next('/login')
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
      component: Board,
      meta: { requiresAuth: true },
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
        const refreshToken = localStorage.getItem('refreshToken');
        const url = `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`
        try {
          const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              "Content-Type": "application/json",
            },
          });
          if (response.status === 200) {
            const boardData = await response.json();
            console.log(boardData.visibility);
            if (boardData.visibility === 'PUBLIC') {
              next()
            } else {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              next('/login')
            }
          } else if (response.status === 401 && refreshToken) {
            // ถ้า access token หมดอายุและมี refresh token
            const newAccessToken = await getNewAccessToken(url,refreshToken);
    
            if (newAccessToken) {
              // ถ้าได้รับ access token ใหม่สำเร็จ
              localStorage.setItem('accessToken', newAccessToken); // เก็บ access token ใหม่
    
              // เรียก request API อีกครั้งด้วย access token ใหม่
              const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}`, {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                  "Content-Type": "application/json",
                },
              });
    
              if (response.status === 200) {
                const boardData = await response.json();
                if (boardData.visibility === 'PUBLIC') {
                  next(); // ผ่านเข้าไปได้
                } else {
                  next('/login'); // ไม่ใช่ public board ให้ redirect ไป login
                }
              } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                next('/login'); // ไม่สำเร็จให้ redirect ไป login
              }
            } else {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              next('/login'); // ไม่สามารถรับ access token ใหม่ได้ ให้ redirect ไป login
            }
          } else if (response.status === 404) {
            localStorage.removeItem('accessToken');
            next('/login'); // กรณีไม่พบกระดาน ให้ redirect ไป login
          } else if (response.status === 403) {
            alert('Access denied, you do not have permission to view this page.');
            next('/login'); // กรณีสิทธิ์ไม่พอ
          } else {
            next('/login'); // ค่าอื่นๆ ที่ไม่ใช่ 200 ก็ให้ redirect ไป login
          }
        } catch (error) {
          console.error('Error fetching board data:', error);
          next('/login'); // ในกรณีที่เกิดข้อผิดพลาด
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
            console.log('Response status:', response.status);
            if (response.status === 404 || response.status == 401) {
              localStorage.removeItem('accessToken')
              next('/login')
            } if (response.status === 403) {
              alert('Access denied, you do not have permission to view this page.')
              next(false)
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
      async beforeEnter(to , from , next) {
        const boardId = to.params.boardId
        const statusId = to.params.statusId
        const token = localStorage.getItem('accessToken')
        if (token) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}/statuses/${statusId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            console.log('Response status:', response.status);
            if (response.status === 404 || response.status == 401) {
              localStorage.removeItem('accessToken')
              next('/login')
            } else {
              next()
            }
          } catch (error) {
            next('/login')
          }
        } else {
          next('/login')
        }
      }
    },
    {
      path: '/board/:id/status/add',
      name: 'addStatusBoard',
      component: EmptyBoard,
      props: true,
      meta: { requiresAuth: true },
      async beforeEnter(to , from , next) {
        const boardId = to.params.boardId
        const statusId = to.params.statusId
        const token = localStorage.getItem('accessToken')
        if (token) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}/statuses/${statusId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            console.log('Response status:', response.status);
            if (response.status === 404 || response.status == 401) {
              localStorage.removeItem('accessToken')
              next('/login')
            } else {
              next()
            }
          } catch (error) {
            next('/login')
          }
        } else {
          next('/login')
        }
      }
    },
  ],
})



export default router
