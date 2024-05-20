const { hash } = require("bcryptjs")
const AppError = require("../utils/AppError")

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password }) {
    const checkUserExists = await this.userRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError("Este email já esta sendo usado.")
    }

    const hashedPassword = await hash(password, 8)

    this.userRepository.create({ name, email, password: hashedPassword })
  }
}

module.exports = UserCreateService
