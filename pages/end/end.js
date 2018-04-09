//index.js
//获取应用实例
const app = getApp()
var audioCtx
var amp
var direction

Page({
  data: {
    userInfo: null,
    scoreboard: null,
    char_lt: '<'
  },
  bindRestartTap: function () {
    wx.navigateTo({
      url: '../play/play',
    })
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      scoreboard: app.globalData.scoreboard
    })
  },
})
