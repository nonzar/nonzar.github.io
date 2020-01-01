// 数据
let userList = [
  {
    name: '添',
    id: 'hZF_YuwoUY-QMcfC5HpB_w',
  },
  {
    name: 'Ajax',
    id: 'C68jv4mw2W73s0jSTchvyDHJjQVZ6t65wB2hQlDcOKQ',
  },
  {
    name: '华',
    id: 'SP2bUEjePJiZilTbUxyuzjHJjQVZ6t65wB2hQlDcOKQ',
  },
  {
    name: '萍',
    id: 'h99o6GRWGlfBuj8V3IpEgE5OYI4LToSA',
  },
]

userList.map(e => {
  e.qq = `https://uua.jr.jd.com/uc-fe-wxgrowing/1111jingtiecommand/index/157433679875950707/?utm_term=qqfriends&channelLv=zhcfloating&utm_medium=jrappshare&shareId=${encodeURIComponent(e.id)}&utm_source=iOS%2Aurl%2A1574336800031`
  e.qq2 = `https://a.ua.jd.com/uc-fe-wxgrowing/1111jingtiecommand/index/157709390728453272/?shareId=${encodeURIComponent(e.id)}`
  e.wechat = `https://u2.jr.jd.com/downloadApp/index.html?jumpUrl=https%3A%2F%2Fuua.jr.jd.com%2Fuc-fe-wxgrowing%2F1111jingtiecommand%2Findex%2F%3FchannelLv%3Dzhcfloating%26shareId%3D${encodeURIComponent(e.id)}`
})
console.log(userList)

let clipboard = new ClipboardJS('.j-copy', {
  text: trigger => {
    return trigger.parentNode.textContent
  },
})
clipboard.on('success', () => {
  alert('复制成功')
})
clipboard.on('error', () => {
  alert('复制失败')
})