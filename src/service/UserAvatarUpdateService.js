const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class UserAvatarUpdateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ user_id, avatarFileName }) {
    const diskStorage = new DiskStorage()

    const user = await this.userRepository.findById(user_id)

    if (!user) {
      throw new AppError(
        "Somente usuários autenticados podem mudar o avatar",
        401
      )
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar)
    }

    const filename = await diskStorage.saveFile(avatarFileName)
    user.avatar = filename

    await this.userRepository.updateAvatar(user.avatar, user.id)
  }
}

module.exports = UserAvatarUpdateService
