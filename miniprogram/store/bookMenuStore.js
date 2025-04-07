import {HYEventStore} from 'hy-event-store'
import {bookMenuCollection} from '../database/index.js'
 
// const db = wx.cloud.database()
// const bookCol = db.collection("book-menu")

export const bookMenuStore = new HYEventStore({
  state: {
    bookMenu: [], // 书单数组
  },
  actions: {
    async getBookMenu(ctx){
      const res = await bookMenuCollection.query(0,3,{})
      // const res = await bookCol.get()
      // console.log(res.data)
      ctx.bookMenu = res.data
    }
  }
})

bookMenuStore.dispatch("getBookMenu")