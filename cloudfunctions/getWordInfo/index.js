// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const CET4 = db.collection("CET-4")
const CET6 = db.collection("CET-6")
const KY = db.collection("KY")
// switch来区分以后到底拿哪一个单词书

// 云函数入口函数
exports.main = async (event, context) => {

  // const wxContext = cloud.getWXContext()
  const {num,offset,size} = event
  switch(num){
    case 1:
      return await CET4.where({bookId: "CET4luan_1"}).skip(offset).limit(size).get()
    case 2:
      return await CET6.where({bookId: "CET6luan_1"}).skip(offset).limit(size).get()
    case 3:
      return await KY.where({bookId: "KaoYanluan_1"}).skip(offset).limit(size).get()
  }

  
}