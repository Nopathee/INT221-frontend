

async function login(url, user) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    if (response.status === 401) {
      console.error('Unauthorized, redirecting to login');
      router.push('/login');
      return { status: 401, error: 'Unauthorized' }; 
    }
    const data = await response.json()
    return {
      status: response.status,
      token: data.access_token,
      refreshToken:data.refresh_token,
    }
  } catch (error) {
    console.error('Error during login:', error)
    return { status: 500, error: 'Internal Server Error' }
  }
}

async function getUserBoard(url, token) {
  try {
    const options = token
    ? {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    : {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }

  const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    if (data && data.id) {
      return {
        status: response.status,
        board: data,
      }
    } else {
      console.error('Fetched data does not contain board ID.');
    return {
      status: response.status,
      board: data,
    }
    }
  } catch (error) {
    console.error('Error fetching user board:', error)
    return { status: 500, error: 'Internal Server Error' }
  }
}

async function createNewBoard(url, token, boardName) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ name: boardName }), 
      })
  
   

   
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data = await response.json() 
      console.log('Created board:', data)
      return {
        status: response.status,
        board: data, 
      }
    } catch (error) {
      console.error('Error creating board:', error)
      return { status: 500, error: 'Internal Server Error' }
    }
 
}

async function changeVisi(url, token , visibility) {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({visibility:visibility}), 
    })

    if (!response.ok) {
      return {
        status: response.status,
        board: null, // กรณีที่เกิดข้อผิดพลาดจะไม่มีข้อมูลเพิ่มเติม
      };
    }
    const data = await response.json() 
    console.log('Changed visibility:', data)

    return {
      status: response.status,
      board: data, 
    }
  } catch (error) {
    console.error('Error changing visibility:', error)
  }

}


async function getAllUsers(url, token) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
    })
    const data = await response.json() 
    return {
      status: response.status,
      user: data, 
    }
  } catch (error) {
    console.error('Error getting user:', error)
  }
}

async function addCollab(url, items) {
  let token = localStorage.getItem('accessToken')

  if(token){
    try {
      let res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(items),
      })

      
      if(res.status === 401){
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
          }
        })
        if(response.ok){
          const newacccessToken = await response.json()
          const newToken = newacccessToken.access_token
          localStorage.setItem('accessToken', newToken);
          token = newToken;
          res = await fetch(url, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(items),
          })
        } else {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          router.push('/login')
        }

      }     
      const data = await res.json() 
      return {
        status: res.status,
        collab: data, 
      }
    } catch (error) {
      console.log(`error: ${error}`)
    }
  }

}

async function getCollabs (url, token) {
  try {
    const options = token
    ? {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    : {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }

    const response = await fetch(url, options);
    const data = await response.json();
    return data; // Return the list of collaborators
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return [];
  }
};

async function changeAccessRight(url , newCollab) {
  let token  = localStorage.getItem('accessToken')
  try {
    let res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({accessRight:newCollab.accessRight}), 
    })

    if(res.status === 401){
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`, 
        },
      })
      if(response.ok){
        const newacccessToken = await response.json()
        const newToken = newacccessToken.access_token
        localStorage.setItem('accessToken', newToken);
        token = newToken;
        res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({accessRight:newCollab.accessRight}), 
        })
      } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push('/login')
      }

    }
    const data = await res.json() 
    console.log('Changed accessRight:', data)
    return {
      status: res.status,
      accessRight: data, 
    }
  } catch (error) {
    console.error('Error changing accessRight:', error)
  }

}

export { login, getUserBoard , createNewBoard , changeVisi , getAllUsers,  addCollab , getCollabs ,changeAccessRight}


