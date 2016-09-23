'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments();
    table.integer('book_id').references('id').inTable('books').onDelete('CASCADE').notNullable();
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  knex.schema.dropTable('favorites');
};
