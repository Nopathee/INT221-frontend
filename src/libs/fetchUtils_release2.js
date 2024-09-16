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

    const data = await response.json()
    console.log(data)

    return {
      status: response.status,
      token: data.access_token
    }
  } catch (error) {
    console.error('Error during login:', error)
    return { status: 500, error: 'Internal Server Error' }
  }
}

async function getUserBoard(url, token) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

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

    if (response.status === 201 && response.board) {
      const newBoard = response.board
      console.log('New board:', newBoard)
      if (newBoard && newBoard.id) {
        router.push(`/board/${newBoard.id}`);
      } else {
        console.error('New board created, but no ID was returned:', newBoard);
        // จัดการกรณีที่ไม่มี ID
      }
    } else {
      console.error('Unexpected response:', response);
      // จัดการข้อผิดพลาด
    }

    return {
      status: response.status,
      board: data, 
    }
  } catch (error) {
    console.error('Error creating board:', error)
    return { status: 500, error: 'Internal Server Error' }
  }
}

export { login, getUserBoard , createNewBoard}


