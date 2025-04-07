// pages/main-index/main-index.js
// import {bookStore} from '../../store/bookStore.js'
// import Toast from '@vant/weapp/toast/toast';
// import {bookStore} from '../../store/bookStore'
// import {wordStore} from '../../store/wordStore.js'
import {userCollection} from '../../database/index.js'


Page({
  data:{
    userInfo: {}, // 用户信息
    currentBook: { bookName: 'empty' }, // 单词书(默认为空)
    columns: ['10', '15', '20', '25', '30'],
    
    wordIndex: 0, // 今日已学习的单词数
    wordNum: 10, // 今日学习单词的任务
    reWord: 10, // 今日要复习的单词数

    allWords: 0, // 所有的单词数
    stuWords: 0, // 已经学习的单词数
    percentWord: 0, // 单词学习的百分比

    show: false, // ?
    hasBook: false, // ?
  },

  onLoad(){
    this.initUserInfo()
  },

  async onShow(){
    // console.log('onShow');
    await this.initUserInfo()
    this.handleShowBook()
  },

  async initUserInfo(){
    const wordNum = wx.getStorageSync('wordNum')
    const wordIndex = wx.getStorageSync('wordIndex')
    // 获取数据库中最新的用户信息,内含单词数据 (异步!!!)
    let openid = wx.getStorageSync('_openid')
    const userInfo = await userCollection.query(0,1,{_openid: openid})

    if(openid.length == 0){
      return
    }
    this.setData({ 
      userInfo: userInfo.data[0],
      wordNum,
      wordIndex
    })
    this.handleDate(openid)
  },

  handleDate(openid){
    // 日期的比较
    // 当前的登录日期(刚刚登录时存入的)
    const loginDate = wx.getStorageSync('loginDate')
    // 用户数据库记录的登录日期(上一次登录记录的)
    const lastLoginDate = this.data.userInfo.loginRecord
    if(loginDate > lastLoginDate){
      // console.log('新日期')
      // 更新本地的日期记录和数据库的日期记录
      this.data.userInfo.loginRecord = loginDate
      wx.setStorageSync('loginDate', loginDate)
      userCollection.update({_openid: openid},{loginRecord: loginDate},false)
      // 在本地记录日期更新的事情,用于清空今日学习单词数量的变量,在detail-word-v1的逻辑代码里面
      wx.setStorageSync('hasDayOver', true)
    }else{
      wx.setStorageSync('hasDayOver', false)
    }
  },

  handleShowBook(){
    const currentBook = wx.getStorageSync('currentBook')
    if(currentBook.length == 0){
      return 
    }
    // const wordIndex = wx.getStorageSync('wordIndex')
    if(currentBook){
      this.setData({
        currentBook,
        hasBook: true,
        // percentWord: (( currentBook.studyWords / currentBook.allWords) * 100).toFixed(2)
      })
    }

    let stuWords = 0
    let allWords = 0
    let toStudy = 0

    if(currentBook.bookIndex === 1){
      stuWords = this.data.userInfo.wordStudy.CET4[0]
      allWords = this.data.userInfo.wordStudy.CET4[1]
      toStudy = this.data.userInfo.wordRecord.CET4[2]
    }else if (currentBook.bookIndex === 2){
      stuWords = this.data.userInfo.wordStudy.CET6[0]
      allWords = this.data.userInfo.wordStudy.CET6[1]
      toStudy = this.data.userInfo.wordRecord.CET6[2]
    }else{
      stuWords = this.data.userInfo.wordStudy.KY[0]
      allWords = this.data.userInfo.wordStudy.KY[1]
      toStudy = this.data.userInfo.wordRecord.KY[2]
    }

    this.setData({
      stuWords,
      allWords,
      reWord: toStudy,
      percentWord: (( stuWords / allWords) * 100).toFixed(2)
    })
  },

  // 跳页面
  onChooseBook(){
    wx.navigateTo({
      url: '/pages/book-menu/book-menu',
    })
  },
  onStudyWords(){
    // console.log(this.data.wordNum.length == 0)
    
    // 判断是否选择单词书和单词书wordNum
    // return 
    if(this.data.currentBook.bookName === 'empty' || this.data.wordNum.length == 0){
      console.log(this.data.currentBook.bookName)
      wx.showModal({
        title: '提示',
        content: '请检查是否选择书本或新词数',
        showCancel: false,
        confirmText: '知道了'
      });
    }else{
      wx.navigateTo({
        url: "/pages/detail-word-v1/detail-word-v1"
      })
    }

  },
  // 再来一组的学习
  onNextStudy(){
    wx.navigateTo({
      url: "/pages/detail-word-v1/detail-word-v1"
    })
    this.data.wordIndex = 0
    wx.setStorageSync('wordIndex', 0)
  },
  onWordList(){
    const bookIndex = this.data.currentBook.bookIndex
    wx.navigateTo({
      url: `/pages/word-list/word-list?bookIndex=${bookIndex}`,
    })
  },

  // 每日单词数组件的应用
  onChange(event) {
    const { picker, value, index } = event.detail;
    // console.log(`当前值：${value}, 当前索引：${index}`);
    this.data.wordIndex = index
    this.setData({
      wordNum: Number(value)
    })
  },
  studyPlan(){
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({ show: false });
    wx.setStorageSync('wordIndex', this.data.wordIndex)
    wx.setStorageSync('wordNum', this.data.wordNum)
  },

  // onUnload中记录单词的数据
  handleWordRecord(){
  // test(){
    const CET4 = wx.getStorageSync('CET4')
    const CET6 = wx.getStorageSync('CET6')
    const KY = wx.getStorageSync('KY')
    const loginDate = wx.getStorageSync('loginDate')

    if(CET4 === ''){
      wx.setStorageSync('CET4', { bookName: '四级词汇', hasStu: 0, RwordS: 0, RwordE: 0 })
    }
    if(CET6 === ''){
      wx.setStorageSync('CET6', { bookName: '六级词汇', hasStu: 0, RwordS: 0, RwordE: 0 })
    }
    if(KY === ''){
      wx.setStorageSync('KY', { bookName: '考研词汇', hasStu: 0, RwordS: 0, RwordE: 0 })
    }

    const studyRecord = {
      date: loginDate,
      books: [CET4,CET6,KY]
    }

    // console.log(studyRecord)
    const allStudyRecord = this.updateStudyRecords(studyRecord)
    // console.log(allStudyRecord)

    userCollection.update({_openid: this.data._openid},{ studyRecord: allStudyRecord },false)
  },

  // 更新学习数据的函数
  updateStudyRecords(newRecord){
    // 学习总记录(数据库存储的)
    const studyRecord = this.data.userInfo.studyRecord
    const lastIndex = studyRecord.length - 1
    const lastRecord = studyRecord[lastIndex]

    if(lastRecord && lastRecord.date === newRecord.date){
      studyRecord[lastIndex] = newRecord
    }else{
      studyRecord.push(newRecord)
    }

    return studyRecord
  },

  // 删除用户所有的本地信息
  destoryStorage(){
    wx.removeStorageSync('_openid')
    wx.removeStorageSync('loginDate')
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('hasDayOver')
    wx.removeStorageSync('currentBook')
    wx.removeStorageSync('wordIndex')
    wx.removeStorageSync('wordNum')
  },

  // 此页面被销毁即用户彻底退出小程序页面
  onUnload(){
    // console.log('over')
    // 整理本地的数据,然后到数据库中
    this.handleWordRecord()
    // 删除本地数据
    this.destoryStorage()
  },

  // 测试onUnload页面的
  onDestory(){
    console.log('over')
    // 整理本地的数据,然后到数据库中
    this.handleWordRecord()
  }
  
})