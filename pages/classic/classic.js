import {ClassicModel} from '../../models/classic.js'
import {LikeModel} from '../../models/like.js'

let classicModel  = new ClassicModel()
let likeModel  = new LikeModel()

// pages/classic/classic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classicData:null,
    latest:true,
    first:false,
    likeCount:0,
    likeStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // http.getToken();
    
    classicModel.getLatest((res)=>{
      // console.log(res)
      this.setData({
        // ...res
        classicData:res,
        likeCount:res.fav_nums,
        likeStatus:res.like_status
      })
    })
  },

  onLike:function(event){
    let behavior = event.detail.behavior
    likeModel.like(behavior,this.data.classicData.id,this.data.classicData.type)
  },

  onNext:function(event){
    this._updateClassic('next')
  },

  onPrevious:function(event){
    this._updateClassic('previous')
  },

  _updateClassic:function(nextOrPrevious){
    let index = this.data.classicData.index
    classicModel.getClassic(index, nextOrPrevious, (res)=>{
      this._getClassicLikeStatus(res.id,res.type)
      this.setData({
        classicData:res,
        latest:classicModel.isLatest(res.index),
        first:classicModel.isFirst(res.index)
      })
    })
  },

  _getClassicLikeStatus:function(artId, category){
    likeModel.getClassicLikeStatus(artId,category,(res)=>{
      this.setData({
        likeCount:res.fav_nums,
        likeStatus:res.like_status
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

  },
})