const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

const sqliteConnection = require("../database/sqlite")

class UsersController {
  async create(request, response) {
    const { name, email, password, isAdmin } = request.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    )

    if (checkUserExists) {
      throw new AppError("Este email já esta sendo usado.")
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    )

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    // const { id } = request.params
    const user_id = request.user.id

    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ])

    if (!user) {
      throw new AppError("Usuário não encontrado.")
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso! Tente novamente.")
    }

    user.name = name ?? user.name //Nullish operator, se estiver vazio, mantém o valor que já está.
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError("Informe a senha atual para poder atualizar a senha.")
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError("Senha atual não confere! Tente novamente.")
      }

      user.password = await hash(password, 8)
    }

    await database.run(
      `
        UPDATE 
          users
        SET
          name = ?,
          email = ?,
          password = ?,
          updated_at = DATETIME("now")
        WHERE
          id = ?
      `,
      [user.name, user.email, user.password, user_id]
    )

    return response.status(200).json()
  }
}

module.exports = UsersController
