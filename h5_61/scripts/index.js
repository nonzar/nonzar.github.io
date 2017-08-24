function GetQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return null
}

var vmCtrl = new Vue({
  el: document.querySelector('.g-view'),
  data: function () {
    return {
      loading: true,
      loadingText: function () {
        var timer = null, len = 0
        timer = setInterval(function () {
          if (len >= 3) {
            len = 0
            vmCtrl.loadingText = '加载中'
          } else {
            len++
            vmCtrl.loadingText += '.'
          }
        }, 350)
        return '加载中'
      }(),
      options: [
        {
          txt: '我到现在还这么做呢！',
          score: 2,
        },
        {
          txt: '小时候做过，现在不会了~怀念~',
          score: 1,
        },
        {
          txt: '从小到大，没做过这件傻事！',
          score: 0,
        },
      ],
      answers: [
        '你到底有没有童年？相信你从小到大，都有超越同龄人的心智！但成熟的你，一定总是让人有一种依靠感吧。在工作单位，或是朋友圈子里，也是属于“砥柱中流”的人物。愿你的生活能有多一点纯真的色彩，与快乐相伴，越来越美好！',
        '也许是年龄的增长，也许是生活的压力，你的童心被消磨了。但还是要在心里面留下一片纯净的空间，累了不妨放空自己。为了你曾经美好的以往，更是为了你更加美好的将来。送你一句话：愿你走出半生，归来仍是少年。',
        '你在心中还保留着自己的童心！随着岁月的流逝，经历的增多，昔日的小孩也慢慢长大，褪去了几分稚嫩，多了几分“人情世故”。但是当你自己一个人，或跟亲密的人在一起时，你依然是那个闹腾的“小逗比”，愿你永远快乐下去！',
        '你还是个孩子啊！明明长着一张大人的脸，却拥有一颗孩子的心。但相信与你相处的人，即便拥有恶魔般的灵魂也会被你净化。你是快乐与善良，终将让你与你身边人的生活变得越来越美好！希望你永远都有一颗童心！',
      ],

      scene: 0,//场景
      maskShare: false,//遮罩显示

      source: 0,//1:朋友分享
      user: {
        id: _openId,
        name: _userName,
        score: -1,
        answers: [],
        answerIdx: -1,
        qus: [],
        quIdx: -1
      },
      friend: {
        id: function (id) {
          if (id == null ||
            id == '') return ''
          return id
        }(GetQueryString('id')),
        name: function (name) {
          if (name == null ||
            name == '') return ''
          return name
        }(GetQueryString('name')),
        score: function (score) {
          if (isNaN(score) ||
            score < 0) return -1
          return score
        }(parseInt(GetQueryString('score'))),
        answerIdx: -1
      }
    }
  }(),
  watch: {
    'user.score': function () {
      if (wxShare && wx) {
        wxShare.link = _www + '/childrens-day?id=' + vmCtrl.user.id + '&name=' + encodeURIComponent(vmCtrl.user.name) + '&score=' + encodeURIComponent(vmCtrl.user.score)
        wx.ready(function () {
          onMenuShareAppFn()
          onMenuShareTL()
          onMenuShareQQ()
          onMenuShareWB()
          onMenuShareQZ()
        })
      }
    }
  },
  created: function () {
    if (this.user.id != this.friend.id) {
      //来源朋友
      if (this.friend.name != '' &&
        this.friend.score >= 0) {
        //数据齐全
        this.friend.answerIdx = this.getAnswerIdx(this.friend.score)
        this.source = 1
        this.scene = 2
      } else {
        //数据不全
        this.source = 0
        this.scene = 0
      }
    } else {
      //来源自己
      this.user.score = this.friend.score
      this.user.answerIdx = this.getAnswerIdx(this.friend.score)
      if (this.user.score >= 0) {
        //数据齐全
        this.friend.answerIdx = this.getAnswerIdx(this.friend.score)
        this.source = 0
        this.scene = 2
      } else {
        //数据不全
        this.source = 0
        this.scene = 0
      }
    }
    this.loading = false
    if (this.scene == 0) {
      Vue.nextTick(function () {
        this.wave()
      }.bind(this))
    }
  },
  methods: {
    wave: function () {
      window.requestAnimationFrame(function () {
        var step = 0,
          angle = 0,
          deltaHeight = 0,
          deltaHeightRight = 0
        var a1, a2, b1, b2
        a1 = a2 = 25, b1 = b2 = 50

        var canvas = document.getElementById('canvas'),
          ctx = canvas.getContext('2d')
        canvas.width = canvas.parentNode.offsetWidth
        canvas.height = canvas.parentNode.offsetHeight
        return function () {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          step++
          ctx.fillStyle = 'rgba(167,129,83, 0.4)'
          //每个矩形的角度都不同
          angle = step * Math.PI / 180
          deltaHeight = Math.sin(angle) * a1
          deltaHeightRight = Math.cos(angle) * a2
          ctx.beginPath()
          ctx.moveTo(0, canvas.height / 2 + deltaHeight)
          ctx.bezierCurveTo(canvas.width / 2,
            canvas.height / 2 + deltaHeight - b1,
            canvas.width / 2,
            canvas.height / 2 + deltaHeightRight - b2,
            canvas.width,
            canvas.height / 2 + deltaHeightRight)
          ctx.lineTo(canvas.width, canvas.height)
          ctx.lineTo(0, canvas.height)
          ctx.lineTo(0, canvas.height / 2 + deltaHeight)
          ctx.closePath()
          ctx.fill()
          window.requestAnimationFrame(arguments.callee)
        }
      }())
    },
    //获取随机问题列表
    getUserQus: function () {
      var arr = [], arr2 = [], idx = -1
      for (var i = 1; i < 13; i++) {
        arr.push(i)
      }
      for (var i = 0; i < 8; i++) {
        idx = Math.floor(Math.random() * arr.length)
        arr2.push(arr.splice(idx, 1)[0])
      }
      console.log(arr2)
      return arr2
    },
    startGame: function () {
      this.user.answers.splice(0)
      this.user.score = -1
      this.source = 0
      this.user.quIdx = -1
      this.scene = 1
      this.user.qus = this.getUserQus()
      this.nextQu()
    },
    choiseOption: function () {
      var _timer = null
      return function (index) {
        Vue.set(this.user.answers, this.user.quIdx, index)
        clearTimeout(_timer)
        _timer = setTimeout(function () {
          this.nextQu()
        }.bind(this), 350)
      }
    }(),
    nextQu: function () {
      if (this.user.quIdx >= this.user.qus.length - 1) {
        this.gameOver()
      }
      this.user.quIdx++
      Vue.set(this.user.answers, this.user.quIdx, -1)
    },
    updateScore: function () {
      for (var i = 0; i < this.user.answers.length; i++) {
        this.user.score += this.options[this.user.answers[i]].score
      }
    },
    getAnswerIdx: function (score) {
      if (score <= 4) {
        return 0
      } else if (score <= 8) {
        return 1
      } else if (score <= 12) {
        return 2
      } else {
        return 3
      }
      return -1
    },
    gameOver: function () {
      this.updateScore()
      this.user.answerIdx = this.getAnswerIdx(this.user.score)
      this.scene = 2
    },
  },
})