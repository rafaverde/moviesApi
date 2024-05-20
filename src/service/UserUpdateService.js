const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

class UserUpdateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password, old_password, user_id }) {
    const user = await this.userRepository.findById(user_id)

    if (!user) {
      throw new AppError("Usuário não encontrado.")
    }

    const userWithUpdatedEmail = await this.userRepository.findByEmail(email)

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

    this.userRepository.update(user.name, user.email, user.password, user_id)
  }
}

module.exports = UserUpdateService
