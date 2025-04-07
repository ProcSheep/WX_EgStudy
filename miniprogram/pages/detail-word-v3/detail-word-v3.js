// pages/detail-word-v3/detail-word-v3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentWordInfo: {},
     // ===== 数据的拆分 =====
     trans: [],
     relWord: [],
     remMethod: "",
     phrase: [],
     syno: [],
     realExamSentence: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let currentWord = JSON.parse(decodeURIComponent(options.currentWord))
    // console.log(currentWord)
    this.setData({
      currentWordInfo: currentWord
    })

    this.InitWordInfo(this.data.currentWordInfo)
  },

  InitWordInfo(wordInfo){
    // 单词翻译
    let trans = wordInfo.trans
    // 词型 数组
    let relWord = wordInfo.relWord?.rels || []
    // 记忆技巧 字符串
    let remMethod = wordInfo.remMethod?.val || ""
    // 相关短语 数组
    let phrase = wordInfo.phrase?.phrases || []
    // 延伸拓展 数组
    let syno = wordInfo.syno?.synos || []
    // 真题例句 数组
    let realExamSentence = wordInfo.realExamSentence?.sentences || []

    this.setData({
      trans,
      relWord,
      remMethod,
      phrase,
      syno,
      realExamSentence
    })

  },
})