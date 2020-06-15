
const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const Users = require('../users/users-model')


router.post('/register', async (req, res) => {
    const user = req.body
    const hash = bcryptjs.hashSync(user.password, 8)
  
    user.password = hash

    try {
        const saved = await Users.add(user)
        res.status(201).json(saved)
        res.status(201).json({message: `${user}`})
    } catch (err) {
        res.status(500).json(err)
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await Users.findBy({ username }).first()

        if (user && bcryptjs.compareSync(password, user.password)) {
            req.session.user = user
            res.status(200).json({ message: `Welcome ${user.username}!`, })
        } else {
            res.status(401).json({ message: 'invalid credentials' })
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router