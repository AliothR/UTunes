//app.js
//commit test
const stdA = wx.createInnerAudioContext()

App({
  globalData: {
    userInfo: null,
    scoreboard: {
      level: 0,
      score: 0,
      hasUserInfo: null
    },
    firstTimePlay: null,
    audioPosition: 'http://home.ustc.edu.cn/~haku/mp3s'
  }, 
  updateFailed: function() {
    // 新版本下载失败
    wx.showToast({
      title: '啊呀呀，船新版本下载失败啦，麻烦稍后重启小程序咯~',
      icon: 'none',
      complete: function () {
        setTimeout(wx.hideToast, 1500)
      }
    })
  }, 
  tryRestart: function () {
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#124a39' })
    wx.showModal({
      title: '有更新哟',
      content: '船新版本已经上线啦~现在试试嘛？',
      confirmText: '好的呀',
      cancelText: '不要',
      confirmColor: 'rgb(0,255,181)',
      success: function (res) {
        wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#2eb88e' })
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      },
      fail: function (res) {
        if (res.errMsg && res.errMsg != 'fail cancel') console.log(res);
        wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#2eb88e' })
      }
    })
  },
  checkUpdate: function() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(this.tryRestart)

    updateManager.onUpdateFailed(this.updateFailed)
  },
  onLaunch: function () {
    this.checkUpdate()
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
    /*wx.getSetting({
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
    })*/
    //适配新的微信授权
    try{
      var hasUserInfo = wx.getStorageSync('hasUserInfo')
      if(hasUserInfo != ''){
        this.globalData.hasUserInfo = hasUserInfo
        if(hasUserInfo){
          try{
            var userInfo = wx.getStorageSync('userInfo')
            if(userInfo){this.globalData.userInfo = userInfo}
            else{console.log('userInfo empty!')}
          } catch (e){console.error('hasUserInfo true but no userInfo!')}
        }
      }
      else{console.log('no hasUserInfo')}
    } catch (e){console.error(e)}
    //如果已有用户信息
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