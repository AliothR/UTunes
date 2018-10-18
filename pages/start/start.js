//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: app.globalData.hasUserInfo,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gameStartDisable: false
  },
  play() {
    wx.navigateTo({
      url: '../play/play',
    })
  },
  pageIn() {
    this.setData({
      pageCondition: "page-in"
    })
  },
  pageOut() {
    this.setData({
      pageCondition: "page-out"
    })
  },
  //事件处理函数
  /*bindViewTap: function(e) {
    if (!this.data.hasUserInfo) {
      wx.openSetting({
        success: (res) => {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
              })
            }
         })
        }
      })
    }
  },适配新版用户信息*/
  bindPlayTap: function() {
    this.setData({
      gameStartDisable: true
    })
    setTimeout(this.pageOut, 500)
    setTimeout(this.play,500)
  },
  setUserInfo: function () {
    if (!getApp().globalData.dataCleanComplete) setTimeout(this.setUserInfo, 50)
    else if (app.globalData.userInfo) {
      this.setData({
        userInfo: getApp().globalData.userInfo,
        hasUserInfo: true
      })
    }
    console.log('hasUserInfo = ' + this.data.hasUserInfo)
  },
  onLoad: function () {
    this.setUserInfo()
  },
  onShow: function () {
    this.setData({
      gameStartDisable: false
    })
    this.pageIn()
  },
  getUserInfo: function(e) {
    console.log(e)
    if (!e.detail.userInfo) {
      app.globalData.hasUserInfo = false
      this.setData({
        hasUserInfo: false
      })
      wx.setStorageSync('hasUserInfo', false)
    }
    else {
      app.globalData.hasUserInfo = true
      app.globalData.userInfo = e.detail.userInfo
      if (e.detail.userInfo.country != 'China') {app.globalData.audioPosition = 'http://165.227.29.231/UTunes/mp3s'}
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('hasUserInfo', true)
      wx.setStorageSync('userInfo', e.detail.userInfo)
      wx.login({
        success: function (res) {
          wx.request({
            url: 'https://chorus.ustc.edu.cn/student/userInfoStore.php',
            method: 'POST',
            data: {
              userInfo: e.detail.userInfo,
              code: res.code
            },
            success: function (res) {
              console.log('userInfo update succeed')
            },
            fail: function () {
              console.log('userInfo update failed')
            }
          })
        },
        fail: function(){
          console.log('login failed!')
        }
      })
    }
    this.setData({
      gameStartDisable: false
    })
  },
  //获取和更新用户信息
})
