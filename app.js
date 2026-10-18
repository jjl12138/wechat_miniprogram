import {HTTP} from '/util/http.js'

let http  = new HTTP()

App({
  onLaunch:function(){
    http.getToken();
  }
})