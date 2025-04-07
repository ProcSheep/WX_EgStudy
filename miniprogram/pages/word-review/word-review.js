Page({
  data:{
    userInfo: {},
    studyRecord: [], // 学习记录
    hasRecord: false // 是否有学习记录
  },

  onLoad(){
    // console.log('hello')
    this.initData()
  },

  initData(){
    // 未登录先别执行
    const openid = wx.getStorageSync('_openid')
    if(openid.length == 0){
      return 
    }

    const userInfo = wx.getStorageSync('userInfo')
    const studyRecord = userInfo.studyRecord.reverse() // 颠倒一下数组
    if(studyRecord.length !== 0){
      this.setData({
        hasRecord: true
      })
    }else{
      return 
    }

    // if(studyRecord[0].books[])
    this.setData({
      userInfo,
      studyRecord
    })
  },

  // 跳转到选书页面
  goReview(e){
    let stuReDate = e.mark.data.date // 点击区块的复习日期
    let books = e.mark.data.books // 当天学习的记录(三本书)

    let bookStr = JSON.stringify(books)

    wx.navigateTo({
      // 注意url传递参数会默认转为字符串形式,所以这个数组books要先转化为JSON字符串
      url: `/pages/choose-review/choose-review?stuReDate=${stuReDate}&books=${bookStr}`, // 作为参数传递给下一个页面
    })
    
  },

  onUnload(){
    // console.log('over')
  }

})