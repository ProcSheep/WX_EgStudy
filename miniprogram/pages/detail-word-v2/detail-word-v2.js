import {wordStore} from '../../store/wordStore.js'

Page({
  data:{
    currentWordInfo: {}, // 这个单词的所有数据
    // ===== 数据的拆分 =====
    trans: [],
    relWord: [],
    remMethod: "",
    phrase: [],
    syno: [],
    realExamSentence: []
  },
  
  onLoad(){
    wordStore.onState("currentWordInfo",this.handleWordInfo)
    this.InitWordInfo(this.data.currentWordInfo)
  },

  handleWordInfo(value){
    this.setData({
      currentWordInfo: value
    })
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

  onNextWord(){
    wordStore.dispatch('onNextWord')
    this.InitWordInfo(this.data.currentWordInfo)
  },

  onUnload(){
    wordStore.offState("currentWordInfo",this.handleWordInfo)
  }
})