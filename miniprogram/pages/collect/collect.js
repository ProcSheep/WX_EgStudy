// pages/collect/collect.js
const db = wx.cloud.database()
const collect = db.collection("collect")

Page({
  data: {
    wordList: [], 
    isShow:true,
    isEyeShow: true,
    hasBook: false // 是否选择单词书,没有选择不能看收藏列表
  },

  onLoad() {
    this.initData()
  },

  async initData(){
    const {_openid} = wx.getStorageSync('_openid')
    const {bookIndex} = wx.getStorageSync('currentBook')
    // console.log(bookIndex)
    if(bookIndex){
      // console.log(1);
      this.setData({
        hasBook: true
      })
    }

    const userCollectInfo = await collect.where({
      _openid
    }).get()
    const collectWordList = userCollectInfo.data[0].collectionList
    const wordList = collectWordList.map(item => item.wordInfo)
    
    this.setData({
      wordList
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
  },

  // 子传父
  async deleteWord(e){
    const delId = e.detail // 收获子的参数
    const {_openid} = wx.getStorageSync('_openid')
    const userCollectInfo = await collect.where({
      _openid
    }).get()
    const collectWordList = userCollectInfo.data[0].collectionList
    // console.log(collectWordList);
    // 把要删除的单词踢出去,留下不会被删除的单词
    const newCollectWordList = collectWordList.filter(item => item.wordId !== delId)
    // console.log(newCollectWordList);
    // 数据库参数的修改
    await collect.where({_openid}).update({
      data: {
        collectionList: newCollectWordList
      }
    })
    // 本地数据的修改(由于格式问题,所以需要对数据进行整理
    const wordList = newCollectWordList.map(item => item.wordInfo)
    this.setData({
      wordList
    })
  }

  // // 底部触发 ---- 收藏单词一次性全部请求,没有底部触发
  // onReachBottom(){

  // }

})