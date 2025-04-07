import {HYEventStore} from 'hy-event-store'
// import {CET4Collection} from '../database/word.js'
// import {getWordInfo} from '../service/getWordInfo'

export const wordStore = new HYEventStore({
  state: {
    wordInfo: [],
    currentWordInfo: {},
    wordIndex: 0
  },

  actions:{
    // 由于不能传递参数控制每日学习单词的数量,所以采用普通函数的方式执行
    // async getWordInfo(ctx){
    //   // const wordInfo = await CET4Collection.query()
    //   // console.log(wordInfo)
    //   const wordInfo = await getWordInfo()

    //   ctx.wordInfo = wordInfo.data
    // },

    onNextWord(ctx){
      let length = ctx.wordInfo.length
      let wordIndex = ctx.wordIndex
      
      
      if(wordIndex !== length - 1){
        let currentWordInfo
        try{
          currentWordInfo = ctx.wordInfo[wordIndex + 1].content.word.content
        }catch(e){
          console.log('') // 这个错误忽略
        }

        ctx.wordIndex = wordIndex + 1
        
        ctx.currentWordInfo = currentWordInfo
      }
    },
  }
})

// wordStore.dispatch("getWordInfo")