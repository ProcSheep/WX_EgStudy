export function getWordInfo(num=1,offset=0,size=15){
  // return CET4Collection.query(offset,size)
  
  return wx.cloud.callFunction({
    name:"getWordInfo",
    data:{
      num,
      offset,
      size
    }
  })
}