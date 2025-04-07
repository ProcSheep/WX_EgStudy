// components/auth.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLogin: false
  },

  // 生命周期
  lifetimes:{
    attached(){
      const openid = wx.getStorageSync("_openid")
      if(openid){
        this.setData({
          isLogin: true
        })
      }else{
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})