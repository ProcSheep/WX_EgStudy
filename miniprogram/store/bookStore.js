import {HYEventStore} from 'hy-event-store'


export const bookStore = new HYEventStore({
  state: {
    bookIndex: 1, // 哪本书(索引 1 2 3 --> 四级 六级 考研)
    allWords: 0, // 所有的单词数
    stuWords: 0, // 已经学习的单词数

    wordIndex: 0, // 今日已学习的单词数
    wordNum: 10, // 今日学习单词的任务
    reWord: 10, // 今日要复习的单词数

  },
  actions: {
    setBookInfo(ctx,bookIndex,allwords,stuWords,wordIndex,wordNum,reWord){
      ctx.bookIndex = bookIndex
      ctx.allwords = allwords
      ctx.stuWords = stuWords
      ctx.wordIndex = wordIndex
      ctx.wordNum = wordNum
      ctx.reWord = reWord
    }
  }
})