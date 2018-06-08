//index.js
//获取应用实例
const app = getApp()
var userInfo = app.globalData.userInfo
var level = app.globalData.scoreboard.level
var num = 0
var window = {height:0, width:0}
var imageUrl = null
var origin = null
var ctxStore = null
var that = null

Page({
  data: {
    userInfo: null,
    scoreboard: null,
    reviewGroup: null,
    char_lt: '<',
    canvasSize: { height: 0, width: 0 },
    tempFilePath: null
  },
  retry() {
    wx.redirectTo({
      url: '../play/play',
    })
  },
  bindRestartTap: function () {
    setTimeout(this.retry, 250)
  },
  getWindow() {
    wx.getSystemInfo({
      success: res => {
        window = { height: res.windowHeight, width: res.windowWidth, dpr: res.pixelRatio}
      }
    })
  },//获取屏幕大小
  getReviewGroup() {
    var numT = Math.floor(Math.random() * this.results[this.lChart[level]].length)
    var reviewGroupT = this.results[this.lChart[level]][numT]
    num = numT
    userInfo = app.globalData.userInfo
    if (reviewGroupT.post === null) {
      console.log(reviewGroupT)
    }
    else {
      reviewGroupT.middle = (userInfo ? userInfo.nickName : '你')
      console.log(reviewGroupT)
    }
    if (reviewGroupT.pre.indexOf('TA') != -1 && (!userInfo || userInfo.gender != 0)) {
      reviewGroupT.pre = reviewGroupT.pre.replace(/TA/g, userInfo ? (userInfo.gender == 1 ? '他' : '她') : '你')
    }
    if ((!(!reviewGroupT.post)) && reviewGroupT.post.indexOf('TA') != -1 && (!userInfo || userInfo.gender != 0)) {
      reviewGroupT.post = reviewGroupT.post.replace(/TA/g, userInfo ? (userInfo.gender == 1 ? '他' : '她') : '你')
    }
    if (reviewGroupT.post === null) {
      reviewGroupT.post = ''
    }
    this.setData({
      userInfo: userInfo,
      scoreboard: app.globalData.scoreboard,
      reviewGroup: reviewGroupT
    })
  },//生成review
  canvasIdErrorCallback(e) {
    console.error(e.detail.errMsg)
  },
  drawText(ctx, text, x, y, fontSize, align){
    ctx.setTextAlign(align)
    ctx.setTextBaseline('middle')
    ctx.setFontSize(fontSize)
    ctx.setFillStyle((align == 'right') ? '#000000' : '#ffffff')
    y += fontSize * 0.5
    ctx.fillText(text, x, y)
    y += fontSize * 0.5
    return { x: x, y: y }
  },//输出文字
  drawReviewDash(ctx, x, y, r, size, review, rpx) {
    const PI = Math.PI
    ctx.setLineDash([30*rpx, 30*rpx], )
    ctx.setLineWidth(15*rpx)
    ctx.setStrokeStyle('#ffffff')
    ctx.beginPath()
    ctx.moveTo(x, y)
    x += size.width - 200*rpx
    ctx.lineTo(x, y)
    y += r
    ctx.arc(x, y, r, -0.5 * PI, 0)
    x += r
    y += review.height - 50*rpx
    ctx.lineTo(x, y)
    x -= r
    ctx.arc(x, y, r, 0, 0.5 * PI)
    y += r
    x -= size.width - 200 * rpx
    ctx.lineTo(x, y)
    y -= r
    ctx.arc(x, y, r, 0.5 * PI, PI)
    x -= r
    y -= (review.height - 50*rpx)
    ctx.lineTo(x, y)
    x += r
    ctx.arc(x, y, r, PI, 1.5 * PI)
    y -= r
    ctx.closePath()
    ctx.stroke()
    return {x: x, y: y}
  },//画review虚线框
  drawReview(ctx, review, position, rpx){
    var out = 0
    ctx.setLineWidth(1)
    ctx.setStrokeStyle('rgba(255,255,255,.4)')
    ctx.setLineDash([1,0],0)
    ctx.beginPath()
    while(review.group[out]){
      position.y += (review.lineHeight - review.fontSize) * 0.5
      position = this.drawText(ctx, review.group[out], position.x, position.y, review.fontSize, 'left')
      position.y += (review.lineHeight - review.fontSize) * 0.5
      ctx.moveTo(position.x, position.y)
      ctx.lineTo((position.x + review.fontSize * review.group[out].length), position.y)
      out = out + 1
    }
    ctx.closePath()
    ctx.stroke()
    return {x: position.x, y: position.y}
  },//输出Review
  drawShareCanvas(){
    that = this
    var scoreboard = this.data.scoreboard
    var size = { height: 0, width: window.width * (origin == 'group' ? 1 : 0.8)}
    var vh = window.height / 100
    var rpx = window.width / 750
    var reviewGroup = this.data.reviewGroup
    var blank = 6*vh
    var review = {
      content: reviewGroup.pre + (reviewGroup.middle ? reviewGroup.middle : '') + reviewGroup.post,
      width: null,
      height: null,
      lineNumber: null,
      group: [],
      fontSize: 40*rpx,
      lineHeight: 60*rpx,
      QRSize: 170*rpx
    }
    review.width = size.width - 150 * rpx,
    review.lineNumber = Math.floor(review.width / review.fontSize)
    review.height = Math.ceil(review.content.length / review.lineNumber) * review.lineHeight
    size.height = blank + 2.5 * vh + 15 * vh + 2.5 * vh + blank + 25 * rpx + review.height + 25 * rpx + (origin == 'group' ? 0 : (blank + review.QRSize)) + blank
    while(origin == 'group'&&(Math.abs(size.height - 0.8 * size.width) > 5*rpx)){
      if(size.height <= (size.width * 0.8)){
        size.height = size.width * 0.8
      }
      else {
        size.width = size.height * 1.25
        review.width = size.width - 150 * rpx,
        review.lineNumber = Math.floor(review.width / review.fontSize)
        review.height = Math.ceil(review.content.length / review.lineNumber) * review.lineHeight
        size.height = blank + 2.5 * vh + 15 * vh + 2.5 * vh + blank + 25 * rpx + review.height + 25 * rpx + (origin == 'group' ? 0 : (blank + review.QRSize)) + blank
      }
    }
    var tmp = 0
    review.group[tmp] = review.content.substring(review.lineNumber * tmp, review.lineNumber * (tmp + 1))
    while(review.group[tmp].length == review.lineNumber){
      tmp = tmp + 1
      review.group[tmp] = review.content.substring(review.lineNumber * tmp, review.lineNumber * (tmp + 1))
    }//处理review换行
    var ctx = wx.createCanvasContext('share-pyq')
    var position = {x: 0, y: 0}
    var r = 50*rpx
    ctx.rect(0, 0, size.width, size.height)
    ctx.setFillStyle('rgba(46,184,142,1)')
    ctx.fill()
    position.y = blank
    position = this.drawText(ctx, 'Level ' + scoreboard.level, size.width / 2, position.y, 2.5*vh, 'center')
    position = this.drawText(ctx, scoreboard.score, size.width / 2, position.y, 15*vh, 'center')
    position = this.drawText(ctx, scoreboard.ratio + '% of a half step', size.width / 2, position.y, 2.5*vh, 'center')
    position.y = position.y + blank
    position.x = 100*rpx
    position = this.drawReviewDash(ctx, position.x, position.y, r, size, review, rpx)
    position.y = position.y + 25*rpx
    position.x = 75*rpx
    position = this.drawReview(ctx, review, position, rpx)
    position.y = position.y + 25*rpx
    if (origin == 'pyq') {
      position.y = position.y + blank
      position.x = (size.width - review.QRSize - 7 * review.fontSize) * 0.4 + 7 * review.fontSize
      position.y = position.y + (review.QRSize - review.fontSize * 2 - 10 * rpx) / 2
      position = this.drawText(ctx, '扫码关注公众号', position.x, position.y, review.fontSize, 'right')
      position.y += 10 * rpx
      position = this.drawText(ctx, '参与测试', position.x, position.y, review.fontSize, 'right')
      position.x = size.width - (size.width - review.QRSize - 7 * review.fontSize) * 0.4 - review.QRSize
      position.y = position.y - (review.QRSize + review.fontSize * 2 + 10 * rpx) / 2
      ctx.drawImage('/resource/QRcode.png', position.x, position.y, review.QRSize, review.QRSize)
    }
    ctxStore = ctx
    that = this
    setTimeout(function(){that.setData({
      canvasSize: { height: Math.ceil(size.height), width: size.width, opacity: 0 }
    }, function(){
      setTimeout(function(){
      ctxStore.draw(true, () => {
        that.saveCanvasToFile(5)
      })},100)
    })},100)
  },
  delayDraw() {
  },
  saveCanvasToFile(repeat) {
    that = this
    wx.canvasToTempFilePath({
      canvasId: 'share-pyq',
      success: function (res) {
        if (origin == 'pyq') {
          that.setData({
            tempFilePath: res.tempFilePath
          })
          console.log('tempFilePath = ' + that.data.tempFilePath)
        }
        else if (origin == 'group') {
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              imageUrl = res.savedFilePath
              console.log('imageUrl = ' + imageUrl)
            }
          })
          origin = 'pyq'
          that.drawShareCanvas()
        }
      },
      fail(res) {
        if (res.errMsg == 'canvasToTempFilePath:fail:create bitmap failed'&&repeat) {
          repeat -= 1
          setTimeout(function(){that.saveCanvasToFile(false)},100)
        }
        console.log(res)
      }
    }, that)
  },
  saveFileToPhotoAlbum() {
    that = this
    if (this.data.tempFilePath) {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.tempFilePath,
        success: function (res) {
          console.log(res.errMsg)
          that.closeShare()
        },
        fail() {
          console.log('saveImageToPhotosAlbum fail!')
          wx.showModal({
            title: '需要授予权限',
            content: '请允许写入相册的权限哟',
            confirmText: '好的呀',
            cancelText: '不要',
            confirmColor: 'rgb(0,255,181)',
            success(res) {
              if (res.confirm == true) {
                wx.openSetting({
                  success(res){
                    console.log(res.authSetting['scope.writePhotosAlbum'])
                    if (res.authSetting['scope.writePhotosAlbum']){
                      wx.saveImageToPhotosAlbum({
                        filePath: this.data.tempFilePath,
                        success(res){
                          that.closeShare()
                        }
                      })
                    }
                    else{
                      that.closeShare()
                    }
                  }
                })
              }
              else {
                that.closeShare()
              }
            }
          })
        },
      })
    }
    else{
      wx.showToast({
        title: '请等待图片加载完成',
        complete(res){
          console.log(res)
          that.closeShare()
        }
      })
    }
  },
  sharePyq() {
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#208164' })
    this.setData({
      canvasSize: {height: this.data.canvasSize.height, width: this.data.canvasSize.width, opacity: 1}
    })
  },
  onLoad: function(){
    this.getWindow()
    level = app.globalData.scoreboard.level
    this.getReviewGroup()
    imageUrl = null
    origin = null
    ctxStore = null
    that = null
    origin = 'group'
    this.drawShareCanvas()
  },
  closeShare() {
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#2eb88e' })
    this.setData({
      canvasSize: { height: this.data.canvasSize.height, width: this.data.canvasSize.width, opacity: 0}
    })
  },
  lChart: {
    0: 'L1', 1: 'L1', 2: 'L1', 3: 'L2', 4: 'L2', 5: 'L2', 6: 'L3', 7: 'L3', 8: 'L3', 9: 'L3', 10: 'L4',
    11: 'L4', 12: 'L4', 13: 'L4', 14: 'L5', 15: 'L5', 16: 'L5', 17: 'L5', 18: 'L5', 19: 'L6', 20: 'L6',
    21: 'L6', 22: 'L6', 23: 'L6', 24: 'L7', 25: 'L7', 26: 'L7', 27: 'L7', 28: 'L8', 29: 'L8', 30: 'L8',
    'Master': 'L9'
  },
  results: {
    L1: [{
      pre: '猜你喜欢：助听器',
      post: null
    },{
      pre: '',
      post: '分不清室友是在玩金山打字还是吃鸡，因为TA不能区分鼠标和键盘的声音'
    },{
      pre: '',
      post: '经常对下课铃声充耳不闻，因为TA总是把这声音和教室外施工的声音混淆'
    }],
    L2: [{
      pre: '',
      post: '从小听力不太好，没带眼镜的时候甚至弄不清讲台上说话的老师是男是女'
    }, {
      pre: '啊哦，',
      post: '耳力不算很突出哦。诶？快戴上耳机，离开科大西区工地远一点啦！'
    }, {
      pre: '诶你说什么我没带眼镜听不太清？',
      post: null
    }],
    L3: [{
      pre: '',
      post: '从不在意是不是别人跑调，宽容的TA总能欣赏别人的歌喉'
    }, {
      pre: '',
      post: '的音高感还算不错，TA能准确分辨出落在地上的硬币是一毛而不是一块'
    }, {
      pre: '',
      post: '对自己的电脑散热能力了如指掌，风扇音调很高的时候，TA决定让电脑休息一会'
    }],
    L4: [{
      pre: '',
      post: '耳力不错，想必唱歌也很好听吧～'
    }, {
      pre: '',
      post: '对音高比较敏感，KTV里同学们扯着嗓子嚎《离歌》的时候，TA总能发现哪里不对劲'
    }, {
      pre: '窗外下起雨来，',
      post: '没有抬头，TA知道雨不大，不打伞也没大问题'
    }, {
      pre: '',
      post: '永远不会在拐角撞到叼着面包快迟到的少女，因为TA老远就能听清那轻快的脚步声'
    }],
    L5: [{
      pre: '',
      post: '耳力不错，通过敲击西瓜，TA可以挑选出熟得最好的那一个'
    }, {
      pre: '',
      post: '引以为傲的特异功能——根据脚步声判断体重'
    }, {
      pre: '',
      post: '耳朵非常棒，TA知道自己鼠标左键和右键按下的声音有着细微的差别'
    }],
    L6: [{
      pre: '对于听力超凡的',
      post: '来说，即使闭着眼睛往暖壶灌水都不会漫出来'
    }, {
      pre: '',
      post: '的听力非常好，TA甚至能从声音的嘶哑程度听出对方昨天吃的麻辣烫是什么辣度！'
    }, {
      pre: '有着超凡的耳力的',
      post: '，听得出楼下那个拉小提琴的同学，每天都在进步一点点'
    }],
    L7: [{
      pre: '',
      post: '的耳力了得，可以说是很有音乐天赋了，不考虑一下合唱团吗？'
    }, {
      pre: '',
      post: '耳朵非常厉害，如果学习乐器的话，是可以凭借耳朵调音的呢！'
    }, {
      pre: '如果不是学习成绩足够好，',
      post: '应该去音乐学院才对'
    }, {
      pre: '睡梦中的',
      post: '被蚊子的嗡嗡声吵醒，TA皱了皱眉:“可恶，和刚才的不是同一只。”'
    }],
    L8: [{
      pre: '哇晒！',
      post: '的音高感怎么这么好！？我们几乎要怀疑你就是较音器！'
    }, {
      pre: '',
      post: '的音高感是天才级别的，五岁时TA就能听出硬币掉到地上的音高对应钢琴的哪个键'
    }],
    L9: [{
      pre: '这位朋友，你通关了，调琴发家致富了解一下？',
      post: null
    }, {
      pre: '',
      post: '一直有着自己的小秘密，TA知道，樱花飘落的声音，是2.33Hz'
    }
    ]
  },
  onShareAppMessage: function(res){
    return{
      title: '音高辨识度能力测试——来看看你的乐感叭',
      path: '/pages/start/start',
      imageUrl: imageUrl,
    }
  }
})
