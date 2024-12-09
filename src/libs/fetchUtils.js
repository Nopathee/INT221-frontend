import router from "@/router";
async function getItems(url) {
  const token = localStorage.getItem('accessToken')
  try {
    const data = await fetch(url,{
      method: "GET",
      headers:{
        Authorization: token ? `Bearer ${token}`: ''
      }
    })
    if(data.status === 200){
      const items = await data.json()
      console.log('Task data:', items);
      return items
    } else if (data.status === 401) {
      localStorage.removeItem('accessToken');
      router.push('/login');
    } else if (data.status === 404) {
      console.error('Error 404: Item not found.');
    } else {
      console.error(`Error: Received status code ${data.status}`);
    }
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function getItemById(url, id) {
  console.log(url)
  const token = localStorage.getItem('accessToken')
  try {
    const data = await fetch(`${url}/${id}`,{
      method: "GET",
      headers:{
        Authorization: token ? `Bearer ${token}`: ''

      }
    })
    const item = await data.json()
    console.log(`item: ${item}`)
    return {item:item , status: data.status}
  } catch (error) {
    console.log(`error: ${error}`)
    
  }
}

async function addItem(url, item) {
  console.log(url)
  let token = localStorage.getItem('accessToken')
  console.log(token)
  if(token){
    try {
      let res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      })
      console.log(res);
      
      if(res.status === 401){
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
          }
        })
        console.log(response);
        if(response.ok){
          const newacccessToken = await response.json()
          const newToken = newacccessToken.access_token
          console.log(newToken);
          localStorage.setItem('accessToken', newToken);
          token = newToken;
          console.log(token)

          res = await fetch(url, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(item),
          })
        } else {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          router.push('/login')
        }

      }
      console.log(res)
      console.log(JSON.stringify(item));
      
      const addedItem = await res.json()
      return addedItem
    } catch (error) {
      console.log(`error: ${error}`)
    }
  }

}

async function deleteItemById(url, id) {
  console.log(`${url}/${id}`)
  let token = localStorage.getItem('accessToken')
  try {
    let res = await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if(res.status === 401){
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
        }
      })
      console.log('Delete collab response:', response)
      if(response.ok){
        const newacccessToken = await response.json()
        const newToken = newacccessToken.access_token
        console.log(newToken);
        localStorage.setItem('accessToken', newToken);
        token = newToken;
        console.log(token)

        res = await fetch(`${url}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push('/login')
      }

    }
    return res.status
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function transferItem(url, id , newId) {
  const token = localStorage.getItem('accessToken')
  try {
    const res = await fetch(`${url}/${id}/${newId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return res.status
    
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function editItem(url, id, editItem) {
  const token = localStorage.getItem('accessToken')
  try {
    const res = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...editItem,
      }),
    })
    const editedItem = await res.json()
    return editedItem
  } catch (error) {
    console.log(`error: ${error}`)
  }
}


export { getItems, getItemById, addItem, deleteItemById, editItem , transferItem}
