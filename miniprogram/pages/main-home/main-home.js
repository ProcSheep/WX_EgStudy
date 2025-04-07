// pages/main-home/main-home.js
Page({
  data:{
    motto: "", // 个性签名
    nickName: "" // 用户名
  },
  onLoad(){
    this.getUserInfo()
  },
  // 回显
  onShow(){
    // 在userInfo页会更新本地数据的
    this.initUserInfo()
  },

  // 获取用户信息(首次进入'我的'页面进行初次本地数据更新)
  async getUserInfo(){
    const openid = wx.getStorageSync('_openid')
    // 根据openid获取用户的基础信息
    const userInfo = await wx.cloud.callFunction({
      name:'getUserInfo',
      data:{
        openid
      }
    })
    // console.log(userInfo)
    if(userInfo){
      wx.setStorageSync('userInfo', userInfo.result[0])
    }
    // 设置完本地数据后,再初始化
    this.initUserInfo()
  },

  // 初始化用户信息
  initUserInfo(){
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        motto: userInfo.motto,
        nickName: userInfo.nickName,
      })
    }
  },
  setUserInfo(){
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },

  // ==== 4大功能区 ====
  // 单词书
  goWordBook(){
    wx.navigateTo({
      url: '/pages/book-menu/book-menu',
    })
  },

  // 跳转到学习记录页面
  goRecord(){
    wx.navigateTo({
      url: '/pages/word-review/word-review',
    })
  },

  // 跳转到收藏界面
  goCollect(){
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },

  // 关于我们的声明
  goUs(){
    wx.navigateTo({
      url: '/pages/statement/statement',
    })
  }
})