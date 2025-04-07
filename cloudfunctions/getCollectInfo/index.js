// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    let allWordId = [] // 所有单词的id数据
    let wordList = [] // 所有的单词数据
    let skipCount = 0 // 跳过的单词
    let hasMore = true // 还有没有更多
    let res // 数据库获取数据的中间变量

    while(hasMore){
      try{
          res = await db.collection("collect")
          .skip(skipCount)
          .limit(100)
          .get()
        let collectList = res.data 
        if(collectList.length > 0){ // 成功获取到有效数据
          skipCount += 100
          for(let i=0; i<collectList.length; i++){
            allWordId.push(collectList[i].wordId) // 融合单词id
            wordList.push(collectList[i]) 
          }          
        }else{
          hasMore = false // 无法获取更多,退出while循环
        }
      }catch(e){
        return {
          success: false,
          message: "没有请求的数据,可能是数据库出错",
          error: e
        }
      }
    }

    return {
      success: true,
      message: '成功获取的后台数据',
      allWordId: allWordId,
      wordList: wordList
    }
}