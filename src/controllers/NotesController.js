const knex = require("../database/knex")

class NotesController {
  async create(request, response) {
    const { title, rating, tags } = request.body
    const { user_id } = request.params

    const [note_id] = await knex("movie_notes").insert({
      title,
      rating,
      user_id,
    })

    const tagInsert = tags.map((name) => {
      return {
        note_id,
        name,
        user_id,
      }
    })

    await knex("movie_tags").insert(tagInsert)

    response.json()
  }
}

module.exports = NotesController
