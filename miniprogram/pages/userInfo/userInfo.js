import {userCollection} from '../../database/index'

Page({
  data: {
    // 双向绑定的
    motto: "", // 个性签名
    nickName: "" // 用户名
  },
  onLoad(){
    // 初始化用户表格信息
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        motto: userInfo.motto,
        nickName: userInfo.nickName
      })
    }
  },
  
  // model:value bug
  onempty(){},

  // 提交新的数据进入数据库
  onSubmit(){
    const _openid = wx.getStorageSync('openid')
    const nickName = this.data.nickName
    const motto = this.data.motto
    let userInfo = {nickName,motto}
    // 不填没事,有初始化,但是不能提交空数据! 
    if (nickName && motto) {
      // 本地更新
      wx.setStorageSync('userInfo', userInfo)
      // 数据库更新数据,如果原样提交,则数据库内容不变
      userCollection.update({_openid},{
        nickName,
        motto
      },false)
      wx.navigateBack()
    }else{
      // 有空数据,则不提交,本地也不会更新
      wx.showToast({
        icon:'error',
        title: '请输入完整信息',
      })
    }
    
  }
})