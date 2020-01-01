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