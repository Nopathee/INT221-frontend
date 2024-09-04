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

    return {
      status: response.status,
      board: data,
    }
  } catch (error) {
    console.error('Error fetching user board:', error)
    return { status: 500, error: 'Internal Server Error' }
  }
}

export { login, getUserBoard }


