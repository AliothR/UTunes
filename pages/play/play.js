//index.js
//获取应用实例
const app = getApp()
var audioCtx
var amp
var direction = null

Page({
  data: {
    userInfo: app.globalData.userInfo,
    score: 0,
    level: 1,
    lifes: 3,
    retry: true,
    answer: "\n"
  },
  bindHighTap: function () {
    if (direction == 1) {
      this.setData({
        score: this.data.score + this.data.level * 10,
        level: this.data.level + 1,
        answer: "BINGO"
      })
    }
    else {
      this.setData({
        score: this.data.score - this.data.level * 5,
        level: this.data.level == 1 ? 1 : this.data.level - 1,
        lifes: this.data.lifes - 1,
        answer: "BOOM"
      })
    }
    console.log(this.data.answer)
    this.playNotes()
  },
  bindLowTap: function () {
    if (direction == -1) {
      this.setData({
        score: this.data.score + this.data.level * 10,
        level: this.data.level + 1,
        answer: "BINGO"
      })
    }
    else {
      this.setData({
        score: this.data.score - this.data.level * 5,
        level: this.data.level == 1 ? 1 : this.data.level - 1,
        lifes: this.data.lifes - 1,
        answer: "BOOM"
      })
    }
    console.log(this.data.answer)
    if (this.data.lifes == 0) {
      wx.navigateTo({
        url: '../end/end',
      })
    }
    this.playNotes()
  },
  bindRetryTap: function () {
    this.setData({
      retry: true
    })
    this.playNotes(true)
  },
  onLoad: function () {
    this.playNotes()
  },
  playNotes: function (isRetry = false) {
    if (audioCtx) audioCtx.close()
    audioCtx = new AudioContext
    amp = audioCtx.createGain()
    amp.gain.value = 0.5
    amp.connect(audioCtx.destination)
    const osc1 = audioCtx.createOscillator()
    const osc2 = audioCtx.createOscillator()
    var now = audioCtx.currentTime + 0.5;

    if (!isRetry) direction = Math.round(Math.random()) * 2 - 1
    osc1.frequency.setValueAtTime(440, now);
    osc2.frequency.setValueAtTime(440, now + 1.618);
    osc2.detune.setValueAtTime(direction * 100 / this.data.level, now + 2.236)
    osc1.connect(amp)
    osc2.connect(amp)

    osc1.start(now)
    osc1.stop(now + 1.618)
    osc2.start(now + 2.236)
    osc2.stop(now + 3.854)
    console.log(this.data.level, this.data.score, direction, isRetry)
  }
})
