import {Base64} from 'js-base64'
import {config} from '../config.js'

const tips = {
  1:'抱歉，出现了一个错误',
  10006:'appkey无效，请前往www.talelin.com申请',
  10007:'期刊不存在'
}

class HTTP{
  // getToken(){
  //   wx.login({
  //     success:(res)=>{
  //       if(res.code){
  //         wx.request({
  //           url:'http://localhost:3000/v1/token',
  //           method:'POST',
  //           data:{
  //             account:res.code,
  //             type:100
  //           },
  //           success:(res)=>{
  //             console.log(res.data)
  //             const code = res.statusCode.toString()
  //             if(code.startsWith('2')){
  //               wx.setStorageSync('token',res.data.token)
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // }

  // request(params){
  //   if(!params.method){
  //     params.method="GET"
  //   }
  //   wx.request({
  //     url:config.api_base_url+params.url,
  //     method:params.method,
  //     data:params.data,
  //     header:{
  //       // Authorization:wx.getStorageSync('token')
  //       Authorization: this._encode()
  //     },
  //     success:(res)=>{
  //       let code = res.statusCode.toString()
  //       if(code.startsWith('2')){
  //         params.success(res.data)
  //       }else{
  //         //let error_code = res.data.error_code
  //         const error_code = 1005;
  //         this._show_error(error_code);
  //       }
  //     },
  //     fail:(err)=>{
  //       this._show_error(1)
  //     }
  //   })
  // }

  getToken() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.request({
              url: 'http://localhost:3000/v1/token',
              method: 'POST',
              data: {
                account: res.code,
                type: 100
              },
              success: (res) => {
                const code = res.statusCode.toString();
                if (code.startsWith('2')) {
                  wx.setStorageSync('token', res.data.token);
                  resolve(res.data.token);
                } else {
                  reject('Token获取失败');
                }
              },
              fail: () => reject('Token请求失败')
            });
          } else {
            reject('wx.login失败');
          }
        }
      });
    });
  }

  request(params) {
    const token = wx.getStorageSync('token');
    if (!token) {
      // 没有 token，先获取
      this.getToken().then(token => {
        this._doRequest(params, token);
      });
    } else {
      this._doRequest(params, token);
    }
  }
  
  _doRequest(params, token) {
    if (!params.method) {
      params.method = "GET";
    }
    wx.request({
      url: config.api_base_url + params.url,
      method: params.method,
      data: params.data,
      header: {
        Authorization: this._encode()
      },
      success: (res) => {
        let code = res.statusCode.toString();
        if (code.startsWith('2')) {
          params.success && params.success(res.data);
        } else {
          const error_code = res.data.errorCode;
          this._show_error(error_code);
        }
      },
      fail: (err) => {
        this._show_error(1);
      }
    });
  }

  _show_error(error_code){
    if(!error_code){
      error_code = 1
    }
    const tip = tips[error_code]
    wx.showToast({
      title:tip?tip:tips[1],
      icon:'none',
      duration:5000
    })
  }

  _encode() {
    // account:password
    // token
    // token:
    const token = wx.getStorageSync('token')
    const base64 = Base64.encode(token + ':')
    // Authorization:Basic base64(account:password)
    return 'Basic ' + base64
  }
}

export {HTTP}