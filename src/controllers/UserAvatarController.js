const UserRepository = require("../repositories/UserRepository")
const UserAvatarUpdateService = require("../service/UserAvatarUpdateService")

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id
    const avatarFileName = request.file.filename

    const userRepository = new UserRepository()
    const userAvatarUpdateService = new UserAvatarUpdateService(userRepository)

    await userAvatarUpdateService.execute({ user_id, avatarFileName })

    const user = await userRepository.findById(user_id)

    return response.json(user)
  }
}

module.exports = UserAvatarController
