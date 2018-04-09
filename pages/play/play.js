//index.js
//获取应用实例
const app = getApp()
var direction = null
const stdA = app.stdA
const note = wx.createInnerAudioContext()
const MAX_LEVEL = 30

Page({
  data: {
    userInfo: null,
    score: 0,
    level: 0,
    lifes: 0,
    ratio: 0,
    ready: false,
    retry: false,
    answer: "\n",
    note_one_playing: false,
    note_two_playing: false
  },
  bindHighTap: function () {
    if (this.data.note_one_playing) stdA.stop()
    else if (this.data.note_two_playing) note.stop()
    this.judge(1)
  },
  bindLowTap: function () {
    if (this.data.note_one_playing) stdA.stop()
    else if (this.data.note_two_playing) note.stop()
    this.judge(-1)
  },
  bindRetryTap: function () {
    this.setData({
      retry: false,
    })
    if (this.data.note_one_playing) stdA.stop()
    else if (this.data.note_two_playing) note.stop()
    this.playNotes(true)
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      score: 10,
      level: 1,
      lifes: 3,
      ratio: this.ratio_chart[1],
      ready: false,
      retry: true,
      answer: "\n",
      note_one_playing: false,
      note_two_playing: false
    })
    note.obeyMuteSwitch = false
    stdA.onPlay(() => {
      this.setData({
        note_one_playing: true
      })
    })
    stdA.onEnded(() => {
      this.setData({
        note_one_playing: false
      })
    })
    stdA.onStop(() => {
      this.setData({
        note_one_playing: false
      })
    })
    note.onPlay(() => {
      this.setData({
        ready: true,
        note_two_playing: true
      })
    })
    note.onEnded(() => {
      this.setData({
        note_two_playing: false
      })
    })
    note.onStop(() => {
      this.setData({
        note_two_playing: false
      })
    })
    this.playNotes()
  },
  judge: function (answer) {
    if (direction == answer) {
      this.setData({
        score: this.data.score + Math.max(10, Math.ceil(this.data.level / 5) * 10),
        level: this.data.level == MAX_LEVEL ? 'Master' : this.data.level + 1,
        answer: "BINGO"
      })
    }
    else {
      this.setData({
        score: Math.max(0, this.data.score - Math.max(5, Math.ceil(this.data.level / 5) * 5)),
        level: this.data.lifes > 1 ? Math.max(0, this.data.level - 1) : this.data.level,
        lifes: this.data.lifes - 1,
        answer: "BOOM"
      })
    }
    this.setData({
      ratio: this.ratio_chart[this.data.level == 'Master' ? MAX_LEVEL : this.data.level]
    })
    console.log(this.data.answer)
    if (this.data.lifes <= 0 || this.data.level == 'Master') {
      this.setData({
        ready: false
      })
      app.globalData.scoreboard = {
        status: this.data.lifes <= 0 ? 'GO' : 'GC',
        level: this.data.level,
        score: this.data.score,
        ratio: this.data.ratio
      }
      wx.navigateTo({
        url: '../end/end',
      })
    }
    else this.playNotes(this.level)
  },
  playNotes: function (isRetry = false) {
    this.setData({
      ready: false
    })
    if (!isRetry) direction = Math.round(Math.random()) * 2 - 1
    console.log(this.data.level, this.data.score, direction, isRetry)
    note.src = 'http://165.227.29.231/UTunes/mp3s/lv' + this.data.level + (direction == -1 ? '_l' : '_h') + '.mp3'
    setTimeout(function () {
      console.log('Playing ' + stdA.src)
      stdA.play()
      setTimeout(function () {
        console.log('Playing ' + note.src)
        note.play()
      }, 1618)
    }, 618)  
  },
  ratio_chart: [
    200.00,
    100.00,
    50.00,
    33.33,
    25.00,
    20.00,
    16.67,
    12.50,
    10.00,
    8.33,
    7.14,
    6.25,
    5.26,
    4.55,
    4.00,
    3.57,
    3.23,
    2.86,
    2.56,
    2.33,
    2.13,
    1.96,
    1.79,
    1.64,
    1.52,
    1.41,
    1.32,
    1.22,
    1.14,
    1.06,
    1.00
  ]
})