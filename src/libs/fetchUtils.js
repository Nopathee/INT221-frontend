import router from "@/router";
async function getItems(url) {
  const token = localStorage.getItem('accessToken')
  try {
    const data = await fetch(url,{
      method: "GET",
      headers:{
        'Authorization': `Bearer ${token}`
      }
    })
    if(data.status === 200){
      const items = await data.json()
      console.log('Task data:', items);
      return items
    } else if (data.status === 401) {
      localStorage.removeItem('accessToken');
      router.push('/login');
    } else {
      console.error(`Error: Received status code ${data.status}`);
    }
  } catch (error) {
    console.log(`error: ${error}`)
  }
}
async function getItemById(url, id) {
  const token = localStorage.getItem('accessToken')
  try {
    const data = await fetch(`${url}/${id}`,{
      method: "GET",
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    const item = await data.json()
    console.log(`item: ${item}`)
    return {item:item , status: data.status}
  } catch (error) {
    console.log(`error: ${error}`)
    
  }
}



async function addItem(url, newItem) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...newItem,
      }),
    })
    const addedItem = await res.json()
    return addedItem
  } catch (error) {
    console.log(`error: ${error}`)
    
  }
}

async function deleteItemById(url, id) {
  console.log(`${url}/${id}`)

  try {
    const res = await fetch(`${url}/${id}`, {
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

async function transferItem(url, id , newId) {
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
