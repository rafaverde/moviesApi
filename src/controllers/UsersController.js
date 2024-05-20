const UserRepository = require("../repositories/UserRespository")
const UserCreateService = require("../service/UserCreateService")
const UserUpdateService = require("../service/UserUpdateService")

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const userRepository = new UserRepository()
    const userCreateService = new UserCreateService(userRepository)

    await userCreateService.execute({ name, email, password })

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const user_id = request.user.id

    const userRepository = new UserRepository()
    const userUpdateService = new UserUpdateService(userRepository)

    await userUpdateService.execute({
      name,
      email,
      password,
      old_password,
      user_id,
    })

    return response.status(200).json()
  }
}

module.exports = UsersController
