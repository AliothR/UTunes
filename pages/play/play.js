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
    note_one_playing: null,
    note_two_playing: null,
    firstTimePlay: false,
    originX: 0,
    originY: 0,
    selectX: 0,
    selectY: 0,
    moveDirection: 1,
    setMoveDirection: true
  },
  stopPlay() {
    if (this.data.note_one_playing) stdA.stop()
    else if (this.data.note_two_playing) note.stop()
    this.setData({
      note_one_playing: 0,
      note_two_playing: 0
    })
  },
  selectHigh() {
    this.stopPlay()
    this.judge(1)
  },
  selectLow() {
    this.stopPlay()
    this.judge(-1)
  },
  selectRetry() {
    this.setData({
      retry: false,
    })
    this.stopPlay()
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
      note_one_playing: 0,
      note_two_playing: 0
    })
    note.obeyMuteSwitch = false
    stdA.onPlay(() => {
      this.setData({
        note_one_playing: 1
      })
    })
    stdA.onEnded(() => {
      this.setData({
        note_one_playing: 2,
        selectMove: 1
      })
    })
    stdA.onStop(() => {
      this.setData({
        note_one_playing: 0
      })
    })
    note.onPlay(() => {
      this.setData({
        ready: true,
        note_two_playing: 1
      })
    })
    note.onEnded(() => {
      this.setData({
        note_two_playing: 2
      })
    })
    note.onStop(() => {
      this.setData({
        note_two_playing: 0
      })
    })
    this.playNotes()
  },
  getOrigin: function(e) {
    this.setData({
      originX: e.touches[0].clientX,
      originY: e.touches[0].clientY
    })
  },
  selectAnswer: function (e) {
    wx.getSystemInfo({
      success: res => {
        var window = {height: res.windowHeight, width: res.windowWidth}
        this.setData({window: window})
      }
    });
    var dX = e.touches[0].clientX - this.data.originX
    var dY = e.touches[0].clientY - this.data.originY
    var window = this.data.window
    var selectX = (Math.abs(dX) < window.width / 4) ? dX : (window.width / 4 * Math.abs(dX) / dX)
    var selectY = (Math.abs(dY) < window.height *0.16) ? dY : (window.height * 0.16 * Math.abs(dY) / dY)
    var moveDirection = this.data.moveDirection
    if(this.data.setMoveDirection){
      if (Math.abs(dX) > Math.abs(dY)){moveDirection = 0}
      else{moveDirection = 1}
      this.setData({moveDirection: moveDirection, setMoveDirection: false})
    }
    if(!moveDirection){selectY = 0}
    else {selectX = 0}
    if(this.data.ready){this.setData({selectX: selectX, selectY: selectY})}
  },
  clearDirection: function (e) {
    var window = this.data.window
    var selectX = this.data.selectX
    var selectY = this.data.selectY
    if (selectY < 20 - window.height * 0.16) {
      this.selectHigh()
    } else if (selectY > window.height * 0.16 - 20) {
      this.selectLow()
    } else if (selectX < 20 - window.width / 4) {
      this.selectRetry()
    }
    this.setData({allTransitionAllow: true})
    this.setData({
      selectX: 0,
      selectY: 0,
      setMoveDirection: true,
    })
  },
  judge: function (answer) {
    var score = this.data.score
    var level = this.data.level
    var lifes = this.data.lifes
    if (direction == answer) {
      this.setData({
        score: score + Math.max(10, Math.ceil(level / 5) * 10),
        level: level == MAX_LEVEL ? 'Master' : level + 1,
        answer: "BINGO"
      })
    }
    else {
      this.setData({
        score: Math.max(0, score - Math.max(5, Math.ceil(level / 5) * 5)),
        level: lifes > 1 ? Math.max(0, level - 1) : level,
        lifes: lifes - 1,
        answer: "BOOM"
      })
    }
    this.setData({
      ratio: this.ratio_chart[level == 'Master' ? MAX_LEVEL : level],
    })
    console.log(this.data.answer)
    if (lifes <= 0 || level == 'Master') {
      this.setData({
        ready: false
      })
      app.globalData.scoreboard = {
        status: lifes <= 0 ? 'GO' : 'GC',
        level: level,
        score: score,
        ratio: this.data.ratio
      }
      wx.navigateTo({
        url: '../end/end',
      })
    }
    else{
      setTimeout(this.playNotes,600)
    }
  },
  playNotes: function (isRetry = false) {
    this.setData({
      ready: false,
      selectMove: 0
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