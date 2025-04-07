// pages/book-menu/book-menu.js
// import {bookMenuCollection} from '../../database/index.js'
import {bookMenuStore} from '../../store/bookMenuStore.js'

Page({
  data:{
    bookIndex: 0, // 选择书单的索引
    bookMenu: [],
    currentBook: {},
    // percentWord: 0
  },

  onLoad(){
    bookMenuStore.onState("bookMenu",this.handleBookMenu)
  },
  onShow(){
    const currentBook = wx.getStorageSync('currentBook')
    if(currentBook){
      this.setData({
        bookIndex: currentBook.bookIndex,
        // percentWord: (( currentBook.studyWords / currentBook.allWords) * 100).toFixed(2)
      })
    }
  },
  onChooseBook(e){
    let index = e.mark.index
    this.setData({
      bookIndex: index,
      currentBook: this.data.bookMenu[index - 1]
    })    
    wx.setStorageSync('currentBook', this.data.currentBook)
  },
  handleBookMenu(value){
    this.setData({
      bookMenu: value,
      currentBook: value[0]
    })
  },

  onUnload(){
    bookMenuStore.offState("bookMenu",this.handleBookMenu)
  }
 
})