//index.js
//获取应用实例
const app = getApp()
var audioCtx
var amp
var direction = null

Page({
  data: {
    userInfo: null,
    score: 0,
    level: 1,
    lifes: 3,
    retry: true,
    answer: "\n",
    playing: false,
    note_one_playing: false,
    note_two_playing: false
  },
  bindHighTap: function () {
    this.judge(1)
  },
  bindLowTap: function () {
    this.judge(-1)
  },
  bindRetryTap: function () {
    this.setData({
      retry: false
    })
    this.playNotes(true)
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      score: 0,
      level: 1,
      lifes: 3,
      retry: true,
      answer: "\n",
      note_one_playing: false,
      note_two_playing: false
    })
    this.playNotes()
  },
  judge: function (answer) {
    if (direction == answer) {
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
      if (this.data.playing) {
        this.setData({
          playing: false
        })
        audioCtx.close()
      }
      app.globalData.scoreboard = {
        level: this.data.level,
        score: this.data.score
      }
      wx.navigateTo({
        url: '../end/end',
      })
    }
    else this.playNotes(this.level)
  },
  playNotes: function (isRetry = false) {
    if (this.data.playing) audioCtx.close()
    audioCtx = new AudioContext
    amp = audioCtx.createGain()
    amp.gain.value = 0.5
    amp.connect(audioCtx.destination)
    const osc1 = audioCtx.createOscillator()
    const osc2 = audioCtx.createOscillator()
    var now = audioCtx.currentTime + 0.5;

    if (!isRetry) direction = Math.round(Math.random()) * 2 - 1
    osc1.frequency.setValueAtTime(440, now);
    osc1.onended = this.note1EndCallback
    osc2.frequency.setValueAtTime(440, now + 1.618);
    osc2.detune.setValueAtTime(direction * 100 / this.data.level, now + 2.236)
    osc2.onended = this.note2EndCallback
    osc1.connect(amp)
    osc2.connect(amp)

    this.note1StartCallback()
    setTimeout(this.note2StartCallback, 2236)
    osc1.start(now)
    osc1.stop(now + 1.618)
    osc2.start(now + 2.236)
    osc2.stop(now + 3.854)
    console.log(this.data.level, this.data.score, direction, isRetry)
  },
  note1StartCallback: function () {
    this.setData({
      playing: true,
      note_one_playing: true
    })
  },
  note2StartCallback: function() {
    this.setData({
      note_two_playing: true
    })
  },
  note1EndCallback: function () {
    this.setData({
      playing: false,
      note_one_playing: false
    })
  },
  note2EndCallback: function () {
    this.setData({
      note_two_playing: false
    })
    audioCtx.close()
  }
})
