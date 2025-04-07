import {getWordInfo} from '../../service/getWordInfo'

Page({
  data:{
    isShow: true,
    isEyeShow: true,
    bookId: 1, // 1 = 四级 以此类推
    date: '', // 要复习的日期
    books: [], // 要复习的书单

    wordList: [], // 要复习的单词列表
    bookName: '', // 当前复习的单词书名字
    hasWord: false // 有没有单词
  },

  onLoad(options){
    const bookId = Number(options.bookId)
    const date = options.date
    const bookStr = options.books // 是JSON字符串的格式,要转化回来
    const books = JSON.parse(bookStr)
    
    this.setData({
      bookId,
      date,
      books
    })

    this.getWordList(bookId,books)
  },

  // 获取单词列表
  async getWordList(bookId,books){
    let offset = books[bookId - 1].RwordS
    let size = books[bookId -1].hasStu
    let bookName = books[bookId -1].bookName
    console.log('书本编码,请求起始位置和请求数量',bookId,offset,size)
    this.setData({
      bookName
    })
    // 参数num: 1代表请求四级,以此类推; offset: 起始位置; size: 请求数量
    if(size === 0){
      return 
    }else{
      this.setData({
        hasWord: true
      })
    }
    let data = await getWordInfo(bookId,offset,size)
    this.setData({
      wordList: data.result.data,
    })

  },

  isHideWords(){
    const isShow = this.data.isShow
    if(isShow){
      this.setData({
        isShow: false,
        isEyeShow: false
      })
    }else{
      this.setData({
        isShow: true,
        isEyeShow: true
      })
    }
  },

  goWordDetailV3(e){
    let currentWord = e.mark.item.content.word.content
    wx.navigateTo({
      url: '/pages/detail-word-v3/detail-word-v3?currentWord=' + encodeURIComponent(JSON.stringify(currentWord)),
    })
  }


  
})