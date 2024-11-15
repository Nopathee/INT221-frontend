

async function login(url, user) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    console.log(JSON.stringify(user))
    console.log(response)

    if (response.status === 401) {
      console.error('Unauthorized, redirecting to login');
      router.push('/login'); // Redirect to login if unauthorized
      return { status: 401, error: 'Unauthorized' }; // Return 401 status
    }
    const data = await response.json()
    console.log(data)
    console.log(data.refresh_token)
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
    console.log('Fetched user board:', data)
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
  
      console.log('Create board response:', response)

   
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
    console.log('Change Visibility response:', response)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json() 
    console.log('Changed visibility:', data)

    return {
      status: response.status,
      board: data, 
    }
  } catch (error) {
    console.error('Error changing visibility:', error)
    return { status: 500, error: 'Internal Server Error' }
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
    return { status: 500, error: 'Internal Server Error' }
  }
}

async function addCollab(url, token, items) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(items), 
    })

    console.log('Create board response:', response)

 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() 
    console.log('Add Collab:', data)

    return {
      status: response.status,
      collab: data, 
    }
  } catch (error) {
    console.error('Error creating board:', error)
    return { status: 500, error: 'Internal Server Error' }
  }

}

async function getCollabs (url, token) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data; // Return the list of collaborators
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return [];
  }
};

export { login, getUserBoard , createNewBoard , changeVisi , getAllUsers,  addCollab , getCollabs}


