var inputFrame, searchBtn, reportDiv

window.onload = () => {
  reportDiv = document.querySelector('.reports')
  inputFrame = document.querySelector('.inputFrame')
  searchBtn = document.querySelector('.searchBtn')

  myListener()
}

function myListener() {
  inputFrame.addEventListener('focus', (e) => {
    e.target.placeholder = ''
    e.target.style.border = '3px solid #5662f6'
  })
  inputFrame.addEventListener('blur', (e) => {
    e.target.placeholder = '请输入城市名...'
    e.target.style.border = ''
  })

  searchBtn.addEventListener('mousedown', (e) => {
    e.target.className = 'searchBtn2'
  })
  searchBtn.addEventListener('mouseup', (e) => {
    e.target.className = 'searchBtn'
  })
  searchBtn.addEventListener('click', (e) => {
    if (cities[inputFrame.value]) {
      const cityCode = cities[inputFrame.value].code + '00'
      getWeatherData(cityCode)
    } else {
      alert('您输入的城市名不在范围内或不符合格式...')
    }
  })

}

function getWeatherData(cityCode) {
  // Get the KEY from https://lbs.amap.com/api/webservice/guide/api/weatherinfo and use it
  // 'WRITE_DOWN_YOUR_KEY'
  const KEY = null
  var url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=${KEY}`

  if (!KEY) {
    alert('Please get the KEY from https://lbs.amap.com/api/webservice/guide/api/weatherinfo')
    return
  }

  // 使用axios调用ajax请求
  axios.get(url)
  .then(function (res) {
    var curReport = reportDiv.firstChild

    var report = document.createElement('div')
    report.className = 'report'
    writeRes(report, res.data)

    if (!curReport) {
      reportDiv.appendChild(report)
    } else {
      reportDiv.replaceChild(report, curReport)
    }
  })
  .catch(function (err) {
    console.log(err)
  })

  // 天气数据结果响应
  function writeRes(report, data) {
    console.log(data)
    var text = ''
    if (data.status === 0) text = '未知错误...'
    else {
      const cityInfo = data.lives[0]
      text = `
        <div class="topBox">
          查询成功
        </div>
        <ul>
          <li>城市编码: ${cityInfo.adcode}</li>
          <li>城市名: ${cityInfo.city}</li>
          <li>城市所在省份: ${cityInfo.province}</li>
          <li>天气现象: ${cityInfo.weather}</li>
          <li>气温: ${cityInfo.temperature}</li>
          <li>风向: ${cityInfo.winddirection}</li>
          <li>风力等级: ${cityInfo.windpower}</li>
          <li>空气湿度: ${cityInfo.humidity}</li>
          <li>发布时间: ${cityInfo.reporttime}</li>
        </ul>
      `
    }
    report.innerHTML = text
  }
}
