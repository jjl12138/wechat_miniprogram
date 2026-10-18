// pages/book_detail/book_detail.js
import {
  BookModel
} from '../../models/book.js'
import { LikeModel } from '../../models/like.js'

const bookModel = new BookModel()
const likeModel = new LikeModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDetail:null,
    likeStatus:false,
    likeCount:0,
    comments:[],
    posting:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading()
    const id = options.bookId
    const detail = bookModel.getDetail(id)
    const likeStatus = bookModel.getLikeStatus(id)
    const comments = bookModel.getComments(id)

    Promise.all([detail,likeStatus,comments])
      .then(res=>{
        this.setData({
          bookDetail:res[0],
          likeStatus:res[1].like_status,
          likeCount:res[1].fav_nums,
          comments:res[2].comments
        })
        wx.hideLoading()
      })
  },

  onLike(event){
    const like_or_cancel = event.detail.behavior
    likeModel.like(like_or_cancel,this.data.bookDetail.id,400)
  },

  onFakePost(event){
    this.setData({
      posting:true
    })
  },

  onCancel(event){
    this.setData({
      posting:false
    })
  },

  onPost(event){
    const comment = event.detail.text || event.detail.value
    if(!comment){
      return
    }

    if(comment.length>12){
      wx.showToast({
        title:'短评最多12个字',
        icon:'none'
      })
      return 
    }

    bookModel.postComment(this.data.bookDetail.id,comment)
      .then(res=>{
        wx.showToast({
          title:'+1',
          icon:"none"
        })
        console.log(this.data.comments)
        
        this.data.comments.unshift({
          content:comment,
          nums:1
        })

        console.log(this.data.comments)

        this.setData({
          comments:this.data.comments,
          posting:false
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})