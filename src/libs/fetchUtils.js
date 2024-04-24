async function getItems(url) {
  try {
    const data = await fetch(url)
    const items = await data.json().then((response) => {
      return response
    })
    return items
  } catch (error) {
    console.log(`error: ${error}`)
  }
}
