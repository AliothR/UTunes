//index.js
//获取应用实例
const app = getApp()
var audioCtx
var amp
var direction = null

Page({
  data: {
    userInfo: null,
    score: 10,
    level: 1,
    lifes: 3,
    ratio: 100,
    retry: true,
    answer: "\n",
    note_one_playing: false,
    note_two_playing: false
  },
  bindHighTap: function () {
    this.setData({
      note_one_playing: false,
      note_two_playing: false
    })
    audioCtx.close()
    this.judge(1)
  },
  bindLowTap: function () {
    this.setData({
      note_one_playing: false,
      note_two_playing: false
    })
    audioCtx.close()
    this.judge(-1)
  },
  bindRetryTap: function () {
    this.setData({
      retry: false,
      note_one_playing: false,
      note_two_playing: false
    })
    audioCtx.close()
    this.playNotes(true)
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      score: 10,
      level: 1,
      lifes: 3,
      ratio: 100,
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
        score: this.data.score + Math.max(10, Math.ceil(this.data.level / 5) * 10),
        level: this.data.level + 1,
        answer: "BINGO"
      })
    }
    else {
      this.setData({
        score: this.data.score - Math.max(5, Math.ceil(this.data.level / 5) * 5),
        level: this.data.level == 0 ? 0 : this.data.level - 1,
        lifes: this.data.lifes - 1,
        answer: "BOOM"
      })
    }
    var ratio = this.data.level == 0 ? 200 : 1000 / this.data.score
    if (ratio % 1 != 0) ratio = ratio.toFixed(2)
    else ratio = ratio.toString()
    this.setData({
      ratio: ratio
    })
    console.log(this.data.answer)
    if (this.data.lifes <= 0) {
      app.globalData.scoreboard = {
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
    osc2.detune.setValueAtTime(direction * 100 / this.data.level, now + 1.618)
    osc2.onended = this.note2EndCallback
    osc1.connect(amp)
    osc2.connect(amp)

    this.note1StartCallback()
    setTimeout(this.note2StartCallback, 1000)
    osc1.start(now)
    osc1.stop(now + 1)
    osc2.start(now + 1.618)
    osc2.stop(now + 2.618)
    console.log(this.data.level, this.data.score, direction, isRetry)
  },
  note1StartCallback: function () {
    this.setData({
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
      note_one_playing: false
    })
  },
  note2EndCallback: function () {
    this.setData({
      note_two_playing: false
    })
  }
})
