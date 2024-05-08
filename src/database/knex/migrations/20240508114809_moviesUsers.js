exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id").primary()
    table.string("name")
    table.string("email")
    table.string("password")
    table.text("avatar").nullable()
    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable("users")
