export function dateFormat(date){
  const year = date.getFullYear()
  // padStart: 是字符串的方法,所以要先把数据String(),操作是补位,如果长度小于2,则补位'0'
  const month = String(date.getMonth() + 1).padStart(2,'0')
  const day = String(date.getDate()).padStart(2,'0')

  return `${year}-${month}-${day}`
}