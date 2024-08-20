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

    const loginStatus = response.status
    return loginStatus
  } catch (error) {
    console.error('Error during login:', error)
  }
}

export {login}
