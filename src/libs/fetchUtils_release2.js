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

    return {
      status: response.status, 
      token: data.token, 
      fullname: data.fullname 
    }
  } catch (error) {
    console.error('Error during login:', error)
    return { status: 500, error: 'Internal Server Error' } 
  }
}

export { login }
