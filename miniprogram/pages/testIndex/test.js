const db = wx.cloud.database()
const collect = db.collection("collect")

Page({
 

  async onLoad(){
    let skipCount = 0 // 跳过的单词
    let res = await db.collection("collect")
      .skip(skipCount)
      .limit(100)
      .get()

    console.log(res.data)
  }
})