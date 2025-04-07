// pages/study-words/study-words.js
import { CET4Collection } from '../../database/index.js'
import { CET6Collection } from '../../database/index.js'
import { KYCollection } from '../../database/index.js'
// import { testCollection } from '../../database/index.js'
 
Page({
  data:{
    wordList: [],
    isShow:true,
    isEyeShow: true,
    offset: 0, // 初始页数
    size: 20, // 每次请求的个数
    bookIndex: 1, // 书的索引
    hasBook: false // 是否选择单词书
  },
  onLoad(options){
    let {bookIndex} = options 
    // 判断有没有书,仅执行一次即可
    if(bookIndex !== 'undefined'){
      this.setData({
        hasBook: true
      })
    }
    // console.log(typeof(bookIndex))
    this.getWordList(Number(bookIndex))
    this.setData({
      bookIndex: Number(bookIndex)
    })
  },
  onUnload(){
    // 清除积存的单词列表
    this.clearWordReach()
  },
  async getWordList(bookIndex){
    let offset = this.data.offset 
    let size = this.data.size
    let wordRes 

    // console.log(size,offset)

    if(bookIndex === 1){
      wordRes = await CET4Collection.query(offset,size,{bookId: "CET4luan_1"})
    }else if (bookIndex === 2){
      wordRes = await CET6Collection.query(offset,size,{bookId: "CET6luan_1"})
    }else if(bookIndex === 3){ // bookIndex=3
      wordRes = await KYCollection.query(offset,size,{bookId: "KaoYanluan_1"})
    }

    // wordRes = await testCollection.query(offset,size,{bookId: "CET4luan_1"})
    // wordRes = await CET4Collection.query(offset,size,{bookId: "CET4luan_1"})


    // console.log(wordRes)

    if(wordRes){
      let newWordRes = [...this.data.wordList,...wordRes.data]
      this.setData({
        wordList: newWordRes
      })
      this.data.offset = this.data.wordList.length
    }else{
      // 如果没有数据了,停止进行新的操作
      // console.log('没有多余数据了')
      return 
    }
    
  },
  goWordDetailV3(e){
    let currentWord = e.mark.item.content.word.content
    wx.navigateTo({
      url: '/pages/detail-word-v3/detail-word-v3?currentWord=' + encodeURIComponent(JSON.stringify(currentWord)),
    })
  },
  

  // 底部触发
  onReachBottom(){
    this.getWordList(this.data.bookIndex)
  },
  // 清除积存的单词列表
  clearWordReach(){
    this.data.offset = 0
    this.data.wordList = []

    // console.log('over')
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
  }
  
})

