export const db = wx.cloud.database()

class HYCollection{
  constructor(collectionName){
    this.collection = db.collection(collectionName)
  }

  // 增
  add(condition){
    return this.collection.add( {data: condition} )
  }

  // 删
  remove(condition,isDoc=true){
    if(isDoc){
      return this.collection.doc(condition).remove()
    }else{
      return this.collection.where(condition).remove()
    }
  }

  // 更 不考虑set
  update(condition,data,isDoc=true){
    if(isDoc){
      // data是ES6简写
      return this.collection.doc(condition).update({data})
    }else{
      return this.collection.where(condition).update({data})
    }
  }

  // 查
  query(offset=0,size=20,condition,isDoc=false){
    if(isDoc){
      return this.collection.doc(condition).get()
    }else{
      return this.collection.where(condition).skip(offset).limit(size).get()
    }
  }

}

export const userCollection = new HYCollection('userInfo')
export const bookMenuCollection = new HYCollection('book-menu')
export const CET4Collection = new HYCollection('CET-4')
export const CET6Collection = new HYCollection('CET-6')
export const KYCollection = new HYCollection('KY')
export const testCollection = new HYCollection('test')