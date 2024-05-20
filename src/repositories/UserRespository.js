const knex = require("../database/knex")

class UserRespository {
  async findByEmail(email) {
    const user = await knex("users").where({ email }).first()

    return user
  }

  async findById(user_id) {
    const user = await knex("users").where({ id: user_id }).first()

    return user
  }

  async create({ name, email, password }) {
    const userId = await knex("users").insert({ name, email, password })

    return { id: userId }
  }

  async update(name, email, password, user_id) {
    await knex("users")
      .where({ id: user_id })
      .update({ name: name, email: email, password: password })
  }
}

module.exports = UserRespository
