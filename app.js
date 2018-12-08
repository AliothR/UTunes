//app.js
//commit test
const stdA = wx.createInnerAudioContext()
const MAX_LEVEL = 30

App({
  globalData: {
    userInfo: null,
    scoreboard: {
      level: 0,
      score: 0,
      hasUserInfo: null
    },
    firstTimePlay: null,
    audioPosition: 'http://chorus.ustc.edu.cn/student/UTunes/mp3s',
    selfVersion: [1,0,2],
    dataCleanComplete: null,
    notes: []
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
  checkDataClean: function(callback){
    var that = this
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://chorus.ustc.edu.cn/student/UTunes/dataCleanCheck.php',
          method: 'POST',
          data: {
            selfVersion: that.globalData.selfVersion,
            code: res.code
          },
          success: function (res) {
            if(res.data == '1'){
              wx.setStorageSync('hasUserInfo', null)
              that.globalData.scoreboard.hasUserInfo = null
            }
            that.globalData.dataCleanComplete = true
            callback()
          },
          fail: function () {
            console.log('dataClean check failed')
            that.globalData.dataCleanComplete = true
            callback()
          }
        })
      },
      fail: function () {
        console.log('login failed!')
        that.globalData.dataCleanComplete = true
        callback()
      }
    })
  },
  checkUserInfo: function(){
    try {
      var hasUserInfo = wx.getStorageSync('hasUserInfo')
      if (hasUserInfo != '') {
        this.globalData.hasUserInfo = hasUserInfo
        if (hasUserInfo) {
          try {
            var userInfo = wx.getStorageSync('userInfo')
            if (userInfo) { this.globalData.userInfo = userInfo }
            else { console.log('userInfo empty!') }
          } catch (e) { console.error('hasUserInfo true but no userInfo!') }
        }
      }
      else {
        console.log('no hasUserInfo')
        this.globalData.hasUserInfo = null
      }
    } catch (e) { console.error(e) }
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
  getNotes(num) {
    var note_h = wx.createInnerAudioContext(), note_l = wx.createInnerAudioContext()
    note_h.src = this.globalData.audioPosition + '/lv' + num + '_h.mp3'
    note_l.src = this.globalData.audioPosition + '/lv' + num + '_l.mp3'
    this.globalData.notes[num] = {
      h: note_h,
      l: note_l
    }
    if (num < MAX_LEVEL) {
      console.log('buffering note '+num)
      setTimeout(this.getNotes, 10, num + 1)
    }
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
    this.checkDataClean(this.checkUserInfo)
    this.getNotes(0)
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
  },
  stdA: stdA
})