// components/search/index.js
import {KeywordModel} from '../../models/keyword.js'
import {BookModel} from '../../models/book.js'
import {paginationBeh} from '../behaviors/pagination'

const keywordModel = new KeywordModel()
const bookModel = new BookModel()

Component({

  behaviors:[paginationBeh],
  /**
   * 组件的属性列表
   */
  properties: {
    more:{
      type:String,
      observer:'loadMore'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    historyWords:[],
    hotWords:[],
    searching:false,
    queryKey:'',
    loading:false,
    loadingCenter:false
  },

  attached(){
    this.setData({
      historyWords:keywordModel.getHistory()
    })
    keywordModel.getHot().then(res=>{
      this.setData({
        hotWords:res.hot
      })
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCancel(event){
      this.initialize()
      this.triggerEvent('cancel',{},{})
    },

    onConfirm(event){
      this.initialize()
      this._showResult()
      this._showLoadingCenter()
      const word = event.detail.value || event.detail.text
      this.setData({
        queryKey:word
      })
      bookModel.search(0,word)
      .then(res=>{
        this.setMoreData(res.books)
        this.setTotal(res.total)
        keywordModel.addToHistory(word)
        this._hideLoadingCenter()
      })
    },

    onDelete(event){
      this.initialize()
      this._closeResult()
    },

    loadMore(){
      if(!this.data.queryKey){
        return
      }
      if(this.isLocked()){
        return
      }
      if(this.hasMore()){
        this.locked()
        bookModel.search(this.getCurrentStart(),this.data.queryKey)
        .then(res=>{
          this.setMoreData(res.books)
          this._unlocked()
        },()=>{
          this.unlocked()
        })
      }
    },

    _showResult(){
      this.setData({
        searching:true
      })
    },

    _closeResult(){
      this.setData({
        searching:false,
        queryKey:''
      })
    },

    _showLoadingCenter(){
      this.setData({
        loadingCenter:true
      })
    },

    _hideLoadingCenter(){
      this.setData({
        loadingCenter:false
      })
    }
  }
})