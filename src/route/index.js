// Підключаємо технологію express для back-end сервера
const express = require('express')
const { info } = require('sass')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) =>
    this.password === this.password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

class Product {
  constructor(name, price, description) {
    const randomNumber = Math.floor(Math.random() * 10)
    const id = randomNumber.toString().padStart(5, '0')

    this.id = id
    this.name = name
    this.price = price
    this.description = description
    this.createDate = new Date().toISOString()
  }

  static #list = []

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList)

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Сталася помилка',
  })
})

// ================================================================

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  if (name && price && description) {
    const product = new Product(name, price, description)
    Product.add(product)

    res.render('alert', {
      style: 'alert',
      info: 'Товар успішно створений!',
      success: true,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка. Неможливо створити товар!',
      success: false,
    })
  }
})

// ================================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list', {
    style: 'product-list',

    products: {
      list,
      isEmpty: list.length === 0,
    },

    product: [
      {
        title: 'Стильна сукня',
        description:
          'Елегантна сукня з натуральної тканини для особливих випадків.',
        id: '1936402846',
        price: '1500₴',
      },
      {
        title: 'Спортивні кросівки',
        description:
          'Зручні та стильні кросівки для активного способу життя.',
        id: '2047304827',
        price: '1200₴',
      },
      {
        title: 'Сонячні окуляри',
        description:
          'Модні окуляри з високоякісними лінзами для захисту очей від сонця.',
        id: '2947302649',
        price: '800₴',
      },
      {
        title: 'Чоловічий годинник',
        description:
          'Елегантний годинник з механічним механізмом і сталевим браслетом.',
        id: '1835294638',
        price: '2500₴',
      },
      {
        title: 'Жіночий рюкзак',
        description:
          'Стильний рюкзак з великим відділенням та кишенями.',
        id: '2037491746',
        price: '900₴',
      },
      {
        title: 'Парасолька',
        description:
          'Компактна парасолька з автоматичним механізмом.',
        id: '1096352946',
        price: '350₴',
      },
    ],
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const id = Number(req.query.id)
  const product = Product.getById(id)

  res.render('product-edit', {
    style: 'product-edit',
    product,
  })
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  const success = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  if (success) {
    res.render('alert', {
      style: 'alert',
      info: 'Товар оновлено!',
      success: true,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка. Товар з таким ID не знайдено',
      success: false,
    })
  }
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const id = Number(req.query.id)
  const success = Product.deleteById(id)

  if (success) {
    res.render('alert', {
      style: 'alert',
      info: 'Товар видалено!',
      success: true,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка. Неможливо видалити товар!',
      success: false,
    })
  }
})
// Підключаємо роутер до бек-енду
module.exports = router
