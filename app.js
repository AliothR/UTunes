//app.js
//commit test
const stdA = wx.createInnerAudioContext()

App({
  globalData: {
    userInfo: null,
    scoreboard: {
      level: 0,
      score: 0
    },
    firstTimePlay: null,
    audioPosition: 'http://home.ustc.edu.cn/~haku/mp3s'
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              if(res.userInfo.country != 'China'){
                this.globalData.audioPosition = 'http://165.227.29.231/UTunes/mp3s'
              }
              stdA.src = this.globalData.audioPosition + '/stdA.mp3'
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    stdA.src = this.globalData.audioPosition + '/stdA.mp3'
    stdA.obeyMuteSwitch = false
    try {
      var firstTimePlay = wx.getStorageSync('firstTimePlay')
      if (firstTimePlay === false) {
        console.log('firstTimePlay', 'false')
        this.globalData.firstTimePlay = firstTimePlay
      }
      else {
        console.log('firstTimePlay', 'true')
        wx.setStorageSync('firstTimePlay', 'true')
        this.globalData.firstTimePlay = true
      }
    } catch (e) {
      console.log('firstTimePlay', 'error')
      console.log(e)
      wx.setStorageSync('firstTimePlay', 'true')
      this.globalData.firstTimePlay = true
    }
  },
  stdA: stdA
})