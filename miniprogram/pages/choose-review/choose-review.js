// pages/choose-review/choose-review.js
Page({
  data:{
    date: '', // 复习的日期
    books: [] // 复习的书单
  },

  onLoad(options){
    const date = options.stuReDate 
    const books = options.books 
    console.log(books)
    // console.log(date)
    this.setData({
      date,
      books
    })
  },

  // 因为只有三个所以就不写for循环+绑定事件了,麻烦
  // 跳转到详细复习页面 --- 四级
  goReviewList1(){
    wx.navigateTo({
      url: `/pages/review-list/review-list?bookId=1&date=${this.data.date}&books=${this.data.books}`,
    })
  },
  goReviewList2(){
    wx.navigateTo({
      url: `/pages/review-list/review-list?bookId=2&date=${this.data.date}&books=${this.data.books}`,
    })
  },
  goReviewList3(){
    wx.navigateTo({
      url: `/pages/review-list/review-list?bookId=3&date=${this.data.date}&books=${this.data.books}`,
    })
  }
})