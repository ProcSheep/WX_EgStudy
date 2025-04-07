// components/wordItem/wordItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData:{
      type: Object,
      value:{}
    },
    index:{
      type:Number,
      value: 1
    },
    isEyeShow:{
      type:Boolean,
      value: true
    },
    isCollect:{
      type:Boolean,
      value: false
    }
  },

  data: {
    wordMean: [],
    isEyeShow: false,
    fireCount: 1
  },

  lifetimes:{
    attached(){
      this.handleWordData()
    }
  },

  methods: {
    handleWordData(){
      // 有个别的单词没有syno
      const wordMean = this.properties.itemData.content.word.content.syno?.synos
      // console.log(wordMean)
      if(wordMean === undefined){
        this.setData({
          wordMean: false // undefined不允许设置
        })
      }else{
        this.setData({
          wordMean // 有值就是true
        })
      }

      // 获取单词考试次数(数组),以此确定小火苗个数
      const examTimes = this.properties.itemData.content.word.content.realExamSentence?.sentences
      // console.log(examTimes)
      if(examTimes === undefined){
        this.setData({
          fireCount: 1
        })
      }else if (examTimes.length > 0 && examTimes.length <= 3){
        this.setData({
          fireCount: 2
        })
      }else if (examTimes.length > 3){
        this.setData({
          fireCount: 3
        })
      } 
    },

    delete(){
      wx.showModal({
        title: '是否取消收藏',
        complete: (res) => {
          if (res.cancel) {
            // console.log('不取消')
          }
      
          if (res.confirm) {
            const itemData = this.properties.itemData 
            // console.log('取消',itemData)
            const delId = itemData._id
            // console.log(delId)
            this.triggerEvent('delete',delId)

          }
        }
      })
    }
    
  }
})