import { alertError } from './sweetAlert.js'
Swal.fire('Hello World')

// 基礎資料
const baseUrl = 'https://livejs-api.hexschool.io/'
const apiPath = 'nancy20230412'
// const token = 'kaDEO9MFd9Th490SfUyAz5QXjto1'

// 綁定DOM元素

const productCategory = document.querySelector('.productCategory')
const list = document.querySelector('.list')
const cartList = document.querySelector('.cartList')
const total = document.querySelector('.total')
const deleteBtn = document.querySelector('.deleteBtn')
// console.log(total);
// total.textContent = `NT$6e180`

// 變數
let productData = []
let cartData = []

// 渲染商品列表
function renderProductList(input) {
  let str = ''
  const newData = []

  productData.forEach((item) => {
    if (input === item.category) {
      newData.push(item)
    } else if (input === '') {
      newData.push(item)
    } else if (input === undefined) {
      newData.push(item)
    }
  })
  newData.forEach((item) => {
    // str += `<div class="w-20 h-20"><img src="${item.images}" class="w-full"/></div>`
    // console.log(item.images)
    str += `<div class="col-span-1 mb-7" data-id="${item.id}">
    <div class="card">
    <div
              class="card-img relative h-[302px] w-full flex justify-center items-center"
            ><img src="${item.images}" class="w-full h-full"/>
              <div
                class="new absolute right-[-10px] top-3 bg-black px-8 py-2 text-white"
              >
                新品
              </div>
            </div>
            <input
              type="button"
              value="加入購物車"
              class="add-to-cart cursor-pointer hover:bg-primary h-12 w-full mb-2 bg-black text-white"
            />
            <div class="card-body">
              <p class="text-base">${item.title}</p>
              <p class="text-lg line-through">NT$${item.origin_price}</p>
              <p class="text-3xl">NT$${item.price}</p>
            </div>
          </div>
        </div>`
  })

  list.innerHTML = str
}
// 取得產品資料
function getProductList() {
  // eslint-disable-next-line no-undef
  axios
    .get(`${baseUrl}api/livejs/v1/customer/${apiPath}/products`)
    .then((res) => {
      console.log(res.data.products)
      productData = res.data.products
      renderProductList()
      alertError.fire({
        titleText: res.message
      })
    })
    .catch((error) => {
      console.log(error.response)
      alertError.fire({
        titleText: error.message
      })
    })
}

// 商品列表篩選功能
function filter() {
  // console.log(productCategory.value)
  productCategory.addEventListener('change', function () {
    renderProductList(productCategory.value)
  })
}

// 渲染購物車畫面
function renderCartList() {
  let str = ''
  cartData.forEach((item) => {
    // console.log(item.product.images)
    const price = item.product.price * item.quantity
    str += `<li class="w-full border-b-2 border-[#BFBFBF] pb-[20px] mb-[20px]" data-id="${item.id}">
                <ul class="item flex w-full items-center">
                  <li class="flex w-[30%] items-center pr-[30px]">
                  <div class="mr-[15px] h-[80px] w-[80px] overflow-hidden flex justify-center items-center">
<img
                      src="${item.product.images}"
                      alt=""
                      srcset=""
                      class="w-[80px] h-full object-fill"
                    />
                  </div>
                    

                    <p class="item-name text-base w-[160px]">${item.product.title}</p>
                  </li>
                  <li class="w-[20%]">
                    <p>NT$${item.product.price}</p>
                  </li>
                  <li class="w-[20%]">
                    <input type="number" value="${item.quantity}" class="edit-num w-10 border-2 border-gray-300 rounded" palceholder="1"/>
                  </li>
                  <li class="w-[20%]">
                    <p>NT$${price}</p>
                  </li>
                  <li class="flex w-[10%] flex-row-reverse pr-7">
                    <button type="button" class="deleteBtn">
                      <i class="fa-solid fa-x"></i>
                    </button>
                  </li>
                </ul>
              </li>`
  })
  // console.log(str)
  cartList.innerHTML = str
  // 計算+渲染總金額
  let totalPrice = 0
  cartData.forEach((item) => {
    const price = item.product.price * item.quantity
    totalPrice += price
  })
  // console.log(totalPrice);
  total.textContent = `NT$ ${totalPrice}`
}
// 取得購物車資料
function getCartList() {
  // eslint-disable-next-line no-undef
  axios
    .get(`${baseUrl}api/livejs/v1/customer/${apiPath}/carts`)
    .then((res) => {
      // console.log(res)
      cartData = res.data.carts
      console.log(cartData)
      renderCartList()
      // totalPrice()
    })
    .catch((err) => {
      console.log(err)
    })
}

// 加入購物車
function addToCart(e) {
  const click = e.target.getAttribute('class')
  console.log(click)
  if (
    click !==
    'add-to-cart cursor-pointer hover:bg-primary h-12 w-full mb-2 bg-black text-white'
  ) {
    return
  }
  const id = e.target.parentNode.parentNode.getAttribute('data-id')
  console.log(id)
  const obj = {
    data: {
      productId: id,
      quantity: 1
    }
  }
  // console.log(obj);
  // eslint-disable-next-line no-undef
  axios
    .post(`${baseUrl}api/livejs/v1/customer/${apiPath}/carts`, obj)
    .then((res) => {
      // 檢查新增商品是否已存在購物車
      const idArr = cartData.map((item) => {
        return item.product.id
      })
      // console.log(idArr)
      if (idArr.indexOf(id) !== -1) {
        alert('購物車已有該項商品，請到購物車修改數量')
      } else {
        alert('新增成功')
      }
      console.log(res)

      getCartList()
    })
    .catch((err) => {
      console.log(err)
    })
}

// 修改購物車商品數量
function editNum(e) {
  const num = parseInt(e.target.value)
  const cartId =
    e.target.parentNode.parentNode.parentNode.getAttribute('data-id')
  // console.log(id);
  if (e.target.getAttribute('class') !== 'edit-num w-10') {
    return
  }
  console.log(num)
  const obj = {
    data: {
      id: cartId,
      quantity: num
    }
  }
  // console.log(obj)
  // eslint-disable-next-line no-undef
  axios
    .patch(`${baseUrl}api/livejs/v1/customer/${apiPath}/carts`, obj)
    .then((res) => {
      console.log(res)
      getCartList()
    })
    .catch((err) => {
      console.log(err)
    })
}

// 刪除單筆購物車
function deleteItem(e) {
  const btn = e.target.parentNode.getAttribute('class')
  const id =
    e.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id')
  console.log(btn)
  console.log(id)
  if (btn !== 'deleteBtn') {
    return
  }
  // eslint-disable-next-line no-undef
  axios
    .delete(`${baseUrl}api/livejs/v1/customer/${apiPath}/carts/${id}`)
    .then((res) => {
      console.log(res)
      alert('刪除成功')
      getCartList()
    })
    .catch((err) => {
      console.log(err)
    })
}

// 刪除全部購物車
function deleteAll() {
  if (cartData.length === 0) {
    alert('購物車裡沒有商品')
  }
  // eslint-disable-next-line no-undef
  axios
    .delete(`${baseUrl}api/livejs/v1/customer/${apiPath}/carts`)
    .then((res) => {
      console.log(res)
      getCartList()
    })
    .catch((err) => {
      console.log(err)
    })
}

// 初始化
function init() {
  getProductList()
  filter()
  getCartList()
}
init()

// 事件監聽
list.addEventListener('click', addToCart)
// list.addEventListener('click', check)
cartList.addEventListener('change', editNum)
cartList.addEventListener('click', deleteItem)
deleteBtn.addEventListener('click', deleteAll)
// productCategory.addEventListener(
//   'change',
//   renderProductList(productCategory.value)
// )
