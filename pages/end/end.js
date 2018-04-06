//index.js
//获取应用实例
const app = getApp()
var audioCtx
var amp
var direction

Page({
  data: {
    userInfo: app.globalData.userInfo,
    score: 0,
    level: 1,
    answer: "\n"
  },
  bindHighTap: function () {
    audioCtx.close()
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
        answer: "BOOM"
      })
    }
    console.log(this.data.answer)
    this.playNotes(this.data.level)
  },
  bindLowTap: function () {
    audioCtx.close()
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
        answer: "BOOM"
      })
    }
    console.log(this.data.answer)
    this.playNotes(this.data.level)
  },
  onLoad: function () {
    this.playNotes(this.data.level)
  },
  playNotes: function (level) {
    audioCtx = new AudioContext
    amp = audioCtx.createGain()
    amp.gain.value = 0.5
    amp.connect(audioCtx.destination)
    const osc1 = audioCtx.createOscillator()
    const osc2 = audioCtx.createOscillator()
    var now = audioCtx.currentTime + 0.5;

    direction = Math.round(Math.random()) * 2 - 1
    osc1.frequency.setValueAtTime(440, now);
    osc2.frequency.setValueAtTime(440, now + 1.618);
    osc2.detune.setValueAtTime(direction * 100 / level, now + 2.236)
    osc1.connect(amp)
    osc2.connect(amp)

    osc1.start(now)
    osc1.stop(now + 1.618)
    osc2.start(now + 2.236)
    osc2.stop(now + 3.854)
    console.log(this.data.level, this.data.score)
  }
})
