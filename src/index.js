// wei~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// 綁DOM
const customerName = document.querySelector('input[name="name"]')
const handPhone = document.querySelector('input[name="handphone"]')
const email = document.querySelector('input[name="account"]')
const address = document.querySelector('input[name="address"]')
const payment = document.querySelector('select[name="payment"]')

// 監聽 form 表單
const form = document.querySelector('form')
form.addEventListener('submit', function (e) {
  e.preventDefault()
  checkValue()
})
// let error = validate({ username: nameInput }, constraints)
const constraints = {
  name: {
    presence: { message: '^必填欄位' },
    length: {
      minimum: 2, // 設定姓名最少兩個字
      message: '^請輸入正確資訊'
    }
  },
  handphone: {
    presence: { message: '^必填欄位' },
    length: {
      is: 10, // 設定姓名最少兩個字

      message: '^請輸入10碼'
    }
  },
  account: {
    presence: { message: '^必填欄位' },
    email: { message: '^請輸入有效的email' }
  },
  address: {
    presence: { message: '^必填欄位' },
    length: {
      minimum: 10, // 設定十個字
      message: '^請輸入正確地址'
    }
  },
  payment: {
    presence: { message: '^必填欄位' }
  }
}

// 檢查
function checkValue() {
  // eslint-disable-next-line no-undef
  const errors = validate(form, constraints) // 驗證form
  document.querySelectorAll("p[class*='message']").forEach((item) => {
    item.textContent = ''
  }) // 將message設定為""
  if (errors === undefined) {
    // 驗證成功 => call post表單 api
    const obj = {
      data: {
        user: {
          name: customerName.value,
          tel: handPhone.value,
          email: email.value,
          address: address.value,
          payment: payment.value
        }
      }
    }
    // eslint-disable-next-line no-undef
    axios
      .post(
        'https://livejs-api.hexschool.io/api/livejs/v1/customer/benson/orders',
        obj
      )
      .then(function (response) {
        // 成功會回傳的內容
        console.log(obj)
        console.log(response)
      })
      .catch(function (error) {
        // 失敗會回傳的內容
        console.log(error)
        console.log(obj)
      })
  } else {
    // 驗證失敗，呈現在畫面上
    console.log('errors.keys', errors.keys)
    Object.keys(errors).forEach(function (key) {
      document.querySelector(`p[class*="messages ${key}"]`).textContent =
        errors[key]
      console.log(document.querySelector(`p[class*='messages ${key}']`))
    })
  }
}
