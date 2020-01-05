let clipboard = new ClipboardJS('.j-copy', {
  text: trigger => {
    return trigger.parentNode.querySelector('.copy-text').textContent.trim()
  },
})
clipboard.on('success', e => {
  e.trigger.textContent = '复制成功'
  setTimeout(() => {
    e.trigger.textContent = '复制'
  }, 1500)
})
clipboard.on('error', () => {
  alert('复制失败')
})