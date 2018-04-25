//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null,
    scoreboard: null,
    reviewGroup: null,
    char_lt: '<'
  },
  retry() {
    wx.redirectTo({
      url: '../play/play',
    })
  },
  bindRestartTap: function () {
    setTimeout(this.retry, 250)
  },
  onLoad: function () {
    var userInfo = app.globalData.userInfo
    var level = app.globalData.scoreboard.level
    var num = Math.floor(Math.random() * this.results[this.lChart[level]].length)
    var reviewGroup = this.results[this.lChart[level]][num]
    if (reviewGroup.post === null) {
      console.log(reviewGroup)
    }
    else{
      reviewGroup.middle = (userInfo ? userInfo.nickName : '你')
      console.log(reviewGroup)
    }
    if (reviewGroup.pre.indexOf('TA') != -1 && (!userInfo || userInfo.gender != 0))
    {
      reviewGroup.pre = reviewGroup.pre.replace(/TA/g, userInfo ? (userInfo.gender == 1 ? '他' : '她') : '你')
      console.log(reviewGroup.pre)
    }
    if ((!(!reviewGroup.post)) && reviewGroup.post.indexOf('TA') != -1 && (!userInfo || userInfo.gender != 0)) {
      reviewGroup.post = reviewGroup.post.replace(/TA/g, userInfo ? (userInfo.gender == 1 ? '他' : '她') : '你')
      console.log(reviewGroup.post)
    }
    this.setData({
      userInfo: userInfo,
      scoreboard: app.globalData.scoreboard,
      reviewGroup: reviewGroup
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
      post: '的听力非常好，TA甚至能从对方声音的嘶哑程度听出TA昨天吃的麻辣烫是什么辣度！'
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
  }
})
