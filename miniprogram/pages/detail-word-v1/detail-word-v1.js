import {
  wordStore
} from '../../store/wordStore.js'
import {
  getWordInfo
} from '../../service/getWordInfo'
import {
  userCollection
} from '../../database/index.js'

const db = wx.cloud.database()
const collect = db.collection("collect")
const _ = db.command

Page({
  data: {
    checked: true, // 是否显示中文
    wordList: [], // 今日任务的所有单词列表
    allWordId: [], // 收藏单词的Id集合
    wordIndex: 0,
    currentWordInfo: {}, // 当前单词的意思解析,用于渲染基础页面
    currentWord: {}, // 当前单词的所有信息,用于收藏使用,涉及数据_id
    isShow: true, // 是否显示'下一个'选项
    percentage: 0, // 单词百分比
    offset: 0, // 请求单词页数
    size: 10, // 请求单词的个数
    _openid: '', // 用户的openid
    bookIndex: 1, // 选择的单词书序号
    userInfo: {}, // 用户的信息,关键信息,单词书的学习进度

    stuWords: 0, // 已经学习的单词数(总的)
    toStuWords: 0, // 今天学习的单词数

    isCollect: false, // 是否收藏
  },

  async onLoad() {
    this.initGetWord()
    this.showCollect() // 在onNextWord也有一个
  },

  // 收藏显示功能
  showCollect() {
    let allWordId = this.data.allWordId
    let thisWordId = this.data.currentWord._id
    let num = 0
    // console.log(allWordId,thisWordId)
    for (let i = 0; i < allWordId.length; i++) {
      // 如果收藏夹里面的id与这个单词id相同则自动高亮这个单词的收藏按钮
      if (thisWordId === allWordId[i]) {
        this.setData({
          isCollect: true
        })
        break;
      }
      num++
    }
    // 即循环完了还没有找到符合的
    if (num === allWordId.length) {
      this.setData({
        isCollect: false
      })
      num = 0
    }
  },

  // 处理请求单词的offset和size的问题
  async initGetWord() {
    let size = wx.getStorageSync('wordNum')
    let _openid = wx.getStorageSync('_openid')

    let {
      bookIndex
    } = wx.getStorageSync('currentBook')
    this.data.bookIndex = bookIndex

    const userInfo = await userCollection.query(0, 1, {
      _openid: _openid
    })
    this.data.userInfo = userInfo.data[0]
    let {
      wordStudy
    } = this.data.userInfo
    let {
      wordRecord
    } = this.data.userInfo

    // 记录所有单词的id,后期用于查看页面单词id是否属于这里面的某一项
    const userCollectInfo = await collect.where({
      _openid
    }).get()
    const collectWordList = userCollectInfo.data[0].collectionList
    const allWordId = collectWordList.map(item => item.wordId)
    // console.log(allWordId)

    this.setData({
      allWordId,
      size
    })

    // 边界问题,这本单词数读完了,待定 offset + size > 单词书的最大单词数

    // 根据书本获取下一步请求新单词的起始位置
    switch (this.data.bookIndex) {
      case 1:
        // 新请求单词的起始位置
        this.data.offset = wordStudy.CET4[0]
        this.data.toStuWords = wordRecord.CET4[2]
        break;
      case 2:
        this.data.offset = wordStudy.CET6[0]
        this.data.toStuWords = wordRecord.CET6[2]
        break;
      case 3:
        this.data.offset = wordStudy.KY[0]
        this.data.toStuWords = wordRecord.KY[2]
        break;
    }
    // 但是如果日期已经过了,则清空今日学习单词开始和结束位置 以及 今日学习单词的数据 [0,0,0]
    let hasDayOver = wx.getStorageSync('hasDayOver')
    if (hasDayOver) {
      wx.setStorageSync('hasDayOver', false) // 还原
      userCollection.update({
        _openid: this.data._openid
      }, {
        wordRecord: {
          'CET4': [0, 0, 0],
          'CET6': [0, 0, 0],
          'KY': [0, 0, 0]
        }
      }, false)
    }

    // 请求新的单词数据 --- 从数据库中请求
    this.getWordInfo(this.data.bookIndex, this.data.offset, this.data.size)

    this.setData({
      size: Number(size),
      _openid,
      bookIndex
    })
  },

  // 请求单词数据的函数
  async getWordInfo(num, offset, size) {
    // console.log(num,offset,size)
    let data = await getWordInfo(num, offset, size)
    this.setData({
      wordList: data.result.data,
      stuWords: this.data.offset + this.data.size // 请求完成,更新学习的单词数
    })
    wordStore.setState('wordInfo', this.data.wordList)
    wordStore.onState("wordInfo", this.handleWordInfo)
  },
  handleWordInfo(value) {
    let currentWordInfo
    let currentWord
    try {
      currentWordInfo = value[0].content.word.content
      currentWord = value[0]
    } catch (e) {
      console.log('') // 这个错误忽略
    }

    this.setData({
      wordList: value,
      currentWordInfo,
      currentWord
    })
    // 同时修改wordStore中的值
    wordStore.setState('currentWordInfo', this.data.currentWordInfo)

  },
  onChange({
    detail
  }) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: detail
    });
  },

  // 详细解释
  onDetailWords() {
    wx.navigateTo({
      url: '/pages/detail-word-v2/detail-word-v2',
    })
  },
  // 下一个
  onNextWord() {
    // 收藏星星变色
    this.showCollect()

    let length = this.data.wordList.length
    let wordIndex = this.data.wordIndex

    if (wordIndex !== length - 1) {
      let currentWordInfo
      let currentWord
      try {
        currentWordInfo = this.data.wordList[wordIndex + 1].content.word.content
        currentWord = this.data.wordList[wordIndex + 1]
      } catch (e) {
        console.log('') // 这个错误忽略
      }

      wordIndex = wordIndex + 1
      // 除法/的优先级高于加法+,所以先把加法括起来计算 
      let percentage = (wordIndex / (length - 1) * 100).toFixed(2)

      this.setData({
        wordIndex,
        percentage,
        currentWordInfo,
        currentWord
      })

      // 同时修改wordStore中的值
      wordStore.setState('currentWordInfo', this.data.currentWordInfo)
    } else {
      this.setData({
        isShow: false
      })
    }
  },

  // 已完成按钮 
  onOver() {
    console.log('over')
    wx.switchTab({
      url: '/pages/main-index/main-index',
    })

    // console.log(this.data.toStuWords)
    // 更新今日学习的单词数
    let toStuWords = this.data.toStuWords
    toStuWords = toStuWords + this.data.size
    // 计算今日单词起始位置和结束位置 开始位置 = 新单词请求位置 - 今天已经学了的单词数
    let startWord = this.data.offset - this.data.toStuWords
    // 结束位置 = 学习的总单词数(学到哪,结束在哪)
    let endWord = this.data.stuWords

    // 记录用户学习的情况 (哪本单词书,开始学习的单词位置索引,结束学习的单词位置索引)
    switch (this.data.bookIndex) {
      case 1:
        userCollection.update({
          _openid: this.data._openid
        }, {
          wordRecord: {
            'CET4': [startWord, endWord, toStuWords]
          },
          wordStudy: {
            'CET4': [this.data.stuWords, 1162]
          }
        }, false)
        break;
      case 2:
        userCollection.update({
          _openid: this.data._openid
        }, {
          wordRecord: {
            'CET6': [0, this.data.wordIndex, toStuWords]
          },
          wordStudy: {
            'CET6': [this.data.stuWords, 1228]
          }
        }, false)
        break;
      case 3:
        userCollection.update({
          _openid: this.data._openid
        }, {
          wordRecord: {
            'KY': [0, this.data.wordIndex, toStuWords]
          },
          wordStudy: {
            'KY': [this.data.stuWords, 1341]
          }
        }, false)
        break;
    }
    // 更新今日已学习单词的数量 
    wx.setStorageSync('wordIndex', this.data.wordIndex + 1)

    // 在本地记录每本书的学习情况(先不着急更新到数据库,当主页面onUnload时,一起更新,在此之前,每次只临时更新存储到本地)
    // 书名 学习日期 学习单词数 学习的开始位置和结束位置
    switch (this.data.bookIndex) {
      case 1:
        wx.setStorageSync('CET4', {
          bookName: '四级词汇',
          hasStu: toStuWords,
          RwordS: startWord,
          RwordE: endWord
        })
        break;
      case 2:
        wx.setStorageSync('CET6', {
          bookName: '六级词汇',
          hasStu: toStuWords,
          RwordS: startWord,
          RwordE: endWord
        })
        break;
      case 3:
        wx.setStorageSync('KY', {
          bookName: '考研词汇',
          hasStu: toStuWords,
          RwordS: startWord,
          RwordE: endWord
        })
        break;
    }

  },

  // 收藏功能
  async onCollect() {
    // 收藏星星切换显示
    let isCollect = this.data.isCollect
    if (isCollect) {
      this.setData({
        isCollect: false
      })
    } else {
      this.setData({
        isCollect: true
      })
    }

    const _openid = this.data._openid
    const _id = this.data.currentWord._id

    try {
      // 查看collect数据库中有没有用户集合(.data),如果没有数据,返回空数组[],有数据即为非空数组
      const userCollectInfo = await collect.where({
        _openid
      }).get()
      // 获取用户收藏的单词数据
      const collectWordList = userCollectInfo.data[0].collectionList
      // 寻找当前单词的id在collectWordList内部存在,查不到返回-1,查到了返回单词在数组的索引
      const wordIndex = collectWordList.findIndex(item => item.wordId === _id)

      if(userCollectInfo.data.length > 0){ // 用户已创建收藏
        if(wordIndex !== -1){ // 单词已经存在,取消收藏
          // 把要删除的单词踢出去,留下不会被删除的单词
          const newCollectWordList = collectWordList.filter(item => item.wordId !== _id)
          await collect.where({_openid}).update({
            data: {
              collectionList: newCollectWordList
            }
          })
          // .then(res => console.log('单词删除成功',res))
        }else{ // 单词不存在,添加进数据库
          await collect.where({_openid}).update({
            data:{
              collectionList: _.push({
                wordId: _id,
                wordInfo: this.data.currentWord
              })
            }
          })
          // .then(res => console.log('单词添加成功',res) )
        }
      }else{
        // 初次为用户创建收藏数据结构
        await collect.add({
          data:{
            collectionList: [
              {
                wordId: _id,
                wordInfo: this.data.currentWord
              }
            ]
          }
        })
        // .then(res => console.log('收藏创建成功',res))
      }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        message: '操作失败',
        error: e
      }
    }

  },

  onUnload() {
    console.log('unload')
    wordStore.offState("wordInfo", this.handleWordInfo)
    // 更新今日已学习单词的数量 
    wx.setStorageSync('wordIndex', this.data.wordIndex + 1)
  }
});