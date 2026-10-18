import {Base64} from 'js-base64'
import {config} from '../config.js'

const tips = {
  1:'抱歉，出现了一个错误',
  10006:'appkey无效，请前往www.talelin.com申请',
  10007:'期刊不存在'
}

class HTTP{
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

  request({url,data={},method='GET'}){
    return new Promise((resolve,reject)=>{
      this._request(url,resolve,reject,data,method)
    })

  }

  _request(url,resolve,reject,data={},method='GET') {
    const token = wx.getStorageSync('token');
    if (!token) {
      // 没有 token，先获取
      this.getToken().then(token => {
        this._doRequest(url,resolve,reject,data,method='GET', token);
      });
    } else {
      this._doRequest(url,resolve,reject,data,method='GET', token);
    }
  }
  
  _doRequest(url,resolve,reject,data={},method='GET', token) {
    wx.request({
      url: config.api_base_url + url,
      method: method,
      data: data,
      header: {
        Authorization: this._encode()
      },
      success: (res) => {
        const code = res.statusCode.toString();
        if (code.startsWith('2')) {
         resolve(res.data);
        } else {
          reject()
          const error_code = res.data.errorCode;
          this._show_error(error_code);
        }
      },
      fail: (err) => {
        reject()
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