import { alertError, Toast } from './sweetAlert.js'

// // API 相關資料
const url = 'https://livejs-api.hexschool.io/api/livejs/v1/admin/'
const urlPath = 'benson'
const token = {
  headers: {
    Authorization: 'BFzjqCpJPlT5Owb5TIsGnbsEs1x1'
  }
}
// HTML ID
const orderList = document.querySelector('#order-list')
const deleteAllBtn = document.querySelector('#deleteAll-btn')
const orderStatus = document.querySelector('#order-status')
const chart = document.querySelector('#chart')
let orderData = []

// 取得已下單資料
const getData = () => {
  // eslint-disable-next-line no-undef
  return axios
    .get(`${url}${urlPath}/orders`, token)
    .then((res) => {
      orderData = []
      orderData.push(res.data.orders)
      // 如訂單沒資料，則不顯示刪除全部Btn
      if (orderData[0].length === 0) {
        deleteAllBtn.classList.add('hidden')
        chart.classList.add('hidden')
        orderStatus.textContent = '🔥目前無訂單🔥'
      } else {
        deleteAllBtn.classList.remove('hidden')
        chart.classList.remove('hidden')
      }
    })
    .catch((err) => {
      alertError.fire({
        titleText: err.message
      })
    })
}

// 渲然已下單資料
const renderData = (data) => {
  let orderInfo = ''
  if (!data) {
    orderList.innerHTML = orderInfo
    return
  }
  data[0].forEach((item) => {
    let productList = ''
    item.products.forEach((product) => {
      productList += `<p>${product.title}</p>`
    })
    orderInfo += `<tr>
      <th>${item.createdAt}</th>
      <th class='text-left'>${item.user.name}<br/>${item.user.tel}</th>
      <th>${item.user.address}</th>
      <th>${item.user.email}</th>
      <th class='text-left'>${productList}</th>
      <th>${new Date(item.updatedAt * 1000)
        .toISOString()
        .slice(0, 10)
        .replace('T', ' ')}</th>
      <th><a class='underline text-lightPurple cursor-pointer' id='paid-status' data-id='${
        item.id
      }'>${item.paid ? '已處理' : '未處理'}<a/></th>
      <th><button id='delete-btn' data-id='${
        item.id
      }' class='text-white bg-[#C44021] hover:bg-[#e74925] w-[56px] h-[30px]'>刪除</button></th>
  </tr>`
  })
  orderList.innerHTML = orderInfo
}

const showChart = (data) => {
  // eslint-disable-next-line no-undef
  c3.generate({
    bindto: '#chart',
    data: {
      columns: data,
      type: 'pie'
    },
    color: {
      pattern: ['#DACBFF', '#9D7FEA', '#5434A7', '#6A33F8']
    }
    // title: {
    //   text: '全品項營收比重',
    //   position: 'top-center'
    // }
  })
  // eslint-disable-next-line no-undef
  d3.selectAll('.c3-chart-arc text').style('font-size', '16px')
}

// category | title 丟入 type 可以切換
const filterData = (data, type) => {
  const itemNum = {}
  data[0].forEach((item) => {
    item.products.forEach((products) => {
      if (!itemNum[products.category]) {
        itemNum[products.category] = 0
      }
      itemNum[products.category] += 1
    })
  })
  return Object.entries(itemNum)
}

// 建立刪除All function
const deleteAll = () => {
  // eslint-disable-next-line no-undef
  axios
    .delete(`${url}${urlPath}/orders`, token)
    .then(async (res) => {
      await getData()
      const forChartData = filterData(orderData)
      showChart(forChartData)
      renderData(orderData)
      Toast.fire({
        icon: 'success',
        title: '成功刪除全部訂單'
      })
    })
    .catch((err) => {
      alertError.fire({
        titleText: err.message
      })
    })
}
deleteAllBtn.addEventListener('click', deleteAll)

// 刪除特定訂單
const deleteBtnFn = (productId) => {
  // eslint-disable-next-line no-undef
  axios
    .delete(`${url}${urlPath}/orders/${productId}`, token)
    .then(async (res) => {
      await getData()
      const forChartData = filterData(orderData)
      showChart(forChartData)
      renderData(orderData)
      Toast.fire({
        icon: 'success',
        title: '成功刪除訂單'
      })
    })
    .catch((err) => {
      alertError.fire({
        titleText: err.message
      })
    })
}

// 切換付款狀態
const changePaidStatus = (productId, boolean) => {
  // eslint-disable-next-line no-undef
  axios
    .put(
      `${url}${urlPath}/orders`,
      {
        data: {
          id: `${productId}`,
          paid: boolean
        }
      },
      token
    )
    .then((res) => {
      return getData()
    })
    .then(() => {
      renderData(orderData)
    })
    .catch((err) => {
      alertError.fire({
        titleText: err.message
      })
    })
}

// 刪除特定訂單監聽事件
orderList.addEventListener('click', (e) => {
  if (e.target.id === 'delete-btn') {
    const orderId = e.target.dataset.id
    deleteBtnFn(orderId)
  }
  if (e.target.id === 'paid-status') {
    const orderId = e.target.dataset.id
    const paidStatus = e.target.parentNode.textContent
    Toast.fire({
      icon: 'success',
      title: '成功修改訂單狀態'
    })
    changePaidStatus(orderId, paidStatus === '未處理')
  }
})

const init = async () => {
  // 取得資料
  await getData()
  // 渲然
  renderData(orderData)
  // 修改資料結構提供 c3.js 使用
  const forChartData = filterData(orderData)
  showChart(forChartData)
}

init()
