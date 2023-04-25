
// 封装获取日期的函数
function getNowTime() {
  var t = new Date()
  // 获取年月日 时分秒 星期几
  var y = t.getFullYear(), M = t.getMonth() + 1, d = t.getDate()
  var h = t.getHours(), m = t.getMinutes(), s = t.getSeconds();
  var mp = {0:'日',1:'一',2:'二',3:'三',4:'四',5:'五',6:'六'}
  var day = t.getDay()

  // 计算clock中时分秒的角度
  var hDegree = h/12*360+m/60*30+90
  var mDegree = m/60*360+s/60*6+90
  var sDegree = s/60*360+90

  // 处理数值
  M = M < 10 ? '0' + M : M
  d = d < 10 ? '0' + d : d
  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s
  // 返回
  return `${y}-${M}-${d}-${h}-${m}-${s}-${mp[day]}-${hDegree}-${mDegree}-${sDegree}` 
}

var str = getNowTime() // 获取时间
setText(str) // 通过dom树设置文本

// 设置定时器
window.setInterval(() => {
  str = getNowTime()
  setText(str)
}, 1000) // 每一秒获取最新时间

function setText(str) {
  console.log(str)
  var ar = str.split('-')
  
  var year = document.querySelector('#year')
  var month = document.querySelector('#month')
  var date = document.querySelector('#date')
  var hour = document.querySelector('#hour')
  var minute = document.querySelector('#minute')
  var second = document.querySelector('#second')
  var day = document.querySelector('#day')

  var hClip = document.querySelector('.h-clip')
  var mClip = document.querySelector('.m-clip')
  var sClip = document.querySelector('.s-clip')

  // 设置时分秒针的角度
  hClip.style.transform = `rotate(${ar[7]}deg)`
  mClip.style.transform = `rotate(${ar[8]}deg)`
  sClip.style.transform = `rotate(${ar[9]}deg)`

  hour.innerHTML = ar[3]
  minute.innerHTML = ar[4]
  second.innerHTML = ar[5]

  year.innerHTML = ar[0] + '年'
  month.innerHTML = ar[1] + '月'
  date.innerHTML = ar[2] + '日'
  day.innerHTML = '礼拜' + ar[6]
}