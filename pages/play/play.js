//index.js
//获取应用实例
const app = getApp()
var direction = null
const stdA = app.stdA
const note = wx.createInnerAudioContext()
const MAX_LEVEL = 30
var ready = false
var retry = true
var originX = 0
var originY = 0
var moveDirection = 1
var setMoveDirection = true
var window
var lastRenderTime = new Date().getTime()

Page({
  data: {
    score: 0,
    level: 0,
    lifes: 0,
    ratio: 0,
    noteOnePlaying: null,
    noteTwoPlaying: null,
    firstTimePlay: false,
    selectX: 0,
    selectY: 0,
    allowAllTransitions: false,
    answerMatch: {right: 0,wrong: 0,none: 1}
  },
  stopPlay() {
    if (this.data.noteOnePlaying) stdA.stop()
    if (this.data.noteTwoPlaying) note.stop()
    this.setData({
      noteOnePlaying: 2,
      noteTwoPlaying: 2,
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
      score: 10,
      level: 1,
      lifes: 3,
      ratio: 100,
      noteOnePlaying: 0,
      noteTwoPlaying: 0,
      firstTimePlay: false,
      selectX: 0,
      selectY: 0,
      allowAllTransitions: false,
      selectMove: 0
    })
    wx.getSystemInfo({
      success: res => {
        window = { height: res.windowHeight, width: res.windowWidth }
      }
    });
    note.obeyMuteSwitch = false
    stdA.onPlay(() => {this.setData({noteOnePlaying: 1})})
    stdA.onEnded(() => {this.setData({noteOnePlaying: 2,selectMove: 1})})
    note.onPlay(() => {
      this.setData({ready: true,noteTwoPlaying: 1})
      ready = true
    })
    note.onEnded(() => {this.setData({noteTwoPlaying: 2})})
    this.playNotes()
  },
  getOrigin: function(e) {
    originX = e.touches[0].clientX
    originY = e.touches[0].clientY
    this.setData({ allowAllTransitions: false })
  },
  selectAnswer: function (e) {
    if (ready) {
      var renderInterval = new Date().getTime() - lastRenderTime
      if (renderInterval > 10) {
        var dX = e.touches[0].clientX - originX
        var dY = e.touches[0].clientY - originY
        var selectX = (Math.abs(dX) < window.width / 4) ? dX : (window.width / 4 * Math.abs(dX) / dX)
        var selectY = (Math.abs(dY) < window.height * 0.16) ? dY : (window.height * 0.16 * Math.abs(dY) / dY)
        if (setMoveDirection) {
          if (Math.abs(dX) > Math.abs(dY)) moveDirection = 0
          else moveDirection = 1
          setMoveDirection = false
        }
        if (!moveDirection) selectY = 0
        else selectX = 0
        this.setData({ selectX: selectX, selectY: selectY })
        lastRenderTime = lastRenderTime + renderInterval
      }
    }
  },
  clearMove(){
    this.setData({
      selectX: 0,
      selectY: 0,
      originX: 0,
      originY: 0,
      noteOnePlaying: 0,
      noteTwoPlaying: 0
    })
  },
  clearDirection: function (e) {
    var selectX = this.data.selectX
    var selectY = this.data.selectY
    if (selectY < 20 - window.height * 0.16) {
      this.selectHigh()
    } else if (selectY > window.height * 0.16 - 20) {
      this.selectLow()
    } else if (selectX < 20 - window.width / 4) {
      this.selectRetry()
    }
    this.setData({ allowAllTransitions: true })
    setMoveDirection = true
    if (this.data.answerMatch.none) {
      this.clearMove()
      console.log()
    }
    else if(this.data.answerMatch.right) {
      setTimeout(this.clearMove, 200)
    }
    else{
      setTimeout(this.clearMove, 400)
    }
  },
  judge: function (answer) {
    var score = this.data.score
    var level = this.data.level
    var lifes = this.data.lifes
    var answerMatch = { right: 0,wrong: 0,none: 0}
    if (direction == answer) {
      answerMatch.right = 1
      score += Math.max(10, Math.ceil(level / 5) * 10)
      level = level == MAX_LEVEL ? 'Master' : level + 1
    }
    else {
      answerMatch.wrong = 1
      score = Math.max(0, score - Math.max(10, Math.ceil(level / 5) * 5))
      level = lifes > 1 ? Math.max(0, level - 1) : level
      lifes = lifes - 1
    }
    this.setData({
      answerMatch: answerMatch,
      score: score,
      level: level,
      lifes: lifes,
      ratio: this.ratioChart[level == 'Master' ? MAX_LEVEL : level],
    })
    console.log(this.data.lifes)
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
      wx.redirectTo({
        url: '../end/end',
      })
    }
    else{
      setTimeout(this.playNotes, 618 + answerMatch.right * 100 + answerMatch.wrong * 200)
    }
  },
  playNotes: function (isRetry = false) {
    var answerMatch = { right: 0,wrong: 0,none: 1 }
    ready = false
    this.setData({
      noteOnePlaying: 0,
      noteTwoPlaying: 0,
      selectMove: 0,
      answerMatch: answerMatch
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
  ratioChart: [
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