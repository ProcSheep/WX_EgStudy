// pages/login/login.js
// import {userCollection} from '../../database/index.js'
import {dateFormat} from '../../utils/dateFormat.js'
const db = wx.cloud.database()
const usercol = db.collection('userInfo')

Page({
  data: {

  },

  onLoad(){
    this.checkLogin()
  },

  checkLogin(){
    const openid = wx.getStorageSync('_openid')
    if(openid){
      // 跳转标签页不能用navigator
      wx.switchTab({
        url: '/pages/main-index/main-index',
      })
    }
  },

  async onLoginClick(){
    const res = await wx.cloud.callFunction({
      name: "getOpenid"
    })
    if(res){
      // 本地存储openid
      const _openid = res.result.openid
      wx.setStorageSync('_openid', _openid)
      // 鉴定用户
      this.loginOrsignup(_openid)
      wx.switchTab({
        url: '/pages/main-index/main-index',
      })
    }else{
      wx.showToast({
        title: '登录失败,请检查网络'
      })
    }
  },

  // 自动为用户注册信息
  async loginOrsignup(_openid){
    const {data} = await usercol.where({_openid}).get()

    // 处理单词记录和日期的函数 
    // this.initLoginDate()

    // 记录当前登录的日期
    const loginDate = dateFormat(new Date())
    wx.setStorageSync('loginDate', loginDate)

    // 数据库中没有这个用户的信息
    if(data.length === 0){
      usercol.add({
        data:{
          // 快速登录的默认名字
          nickName: "微信用户",
          motto: '这个用户很神秘~',
          wordStudy: {
            "CET4": [0,1162],
            "CET6": [0,1228],
            "KY": [0,1341]
          },
          // 学习记录,上一次学习单词开始和结束的数组索引,用于复习单词
          wordRecord: {
            "CET4": [0,0,0],
            "CET6": [0,0,0],
            "KY": [0,0,0]
          },
          // 登录时间 XXXX-XX-XX 年月日
          loginRecord: loginDate,
          // 记录用户每日的学习情况,具体为 日期 + 学习的单词数据(书本 + 要复习的单词)
          // [ {date: 2000-12-12,wordRecord:[要复习的单词,三本书都有,没有的列为0]} ]
          studyRecord: []
        }
      })
    }else{
      // 如果数据库有这个用户
      wx.setStorageSync('userInfo', data[0])
    }
  },

  // 处理日期的函数
  initLoginDate(){
    // 上一次登录的日期
    let lastLoginDate = wx.getStorageSync('lastLoginDate');
    if (!lastLoginDate) {
      // 如果不存在则初始化
      lastLoginDate = '';
      wx.setStorageSync('lastLoginDate', lastLoginDate);
    }

    // 上一次学习的单词记录
    // let studyRecord = wx.getStorageSync('key')
  }
})