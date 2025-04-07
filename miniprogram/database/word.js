export const db = wx.cloud.database()

class WordCollection{
  constructor(collectName){
    this.collection = db.collection(collectName)
  }

  query(offset = 0, size = 15){
    return this.collection.where({bookId: "CET4luan_1"}).skip(offset).limit(size).get()
  }
}

export const CET4Collection = new WordCollection('CET-4')