//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: app.globalData.hasUserInfo,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
  activeButton() {
    this.setData({
      gameStartButton: "active-button"
    })
  },
  clearButton() {
    this.setData({
      gameStartButton: "visited-button",
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
    this.activeButton()
    setTimeout(this.clearButton, 250)
    setTimeout(this.pageOut, 500)
    setTimeout(this.play,500)
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    else if (!this.data.canIUse){
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          this.setData({
            hasUserInfo: false
          })
        }
      })
    }
    console.log('hasUserInfo = ' + this.data.hasUserInfo)
  },
  onShow: function(){
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
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('hasUserInfo', true)
      wx.setStorageSync('userInfo', e.detail.userInfo)
    }
  },
  //获取和更新用户信息
})
