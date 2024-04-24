async function getItems(url){
    try {
        const data = await fetch(url)
        const items = await data.json()
        return items
      } catch (error) {
        console.log(`error: ${error}`)
      }
    }
    async function getItemById(url, id) {
      try {
        const data = await fetch(`${url}/${id}`)
        const item = await data.json()
        return item
      } catch (error) {
        console.log(`error: ${error}`)
      }
    }
    



    export { getItems, getItemById}