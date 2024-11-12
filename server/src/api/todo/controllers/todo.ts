// src/api/todo/controllers/todo.js
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::todo.todo", ({ strapi }) => ({
  async delete(ctx) {
    const { id } = ctx.params;

    // Check if the todo item exists
    const existingItem = await strapi.service("api::todo.todo").findOne(id);

    if (!existingItem) {
      return ctx.notFound("Todo item not found");
    }

    try {
      // Attempt to delete the todo item
      const deletedItem = await strapi.service("api::todo.todo").delete(id);

      // Return a response with the deleted item
      return ctx.send({
        message: "Todo item deleted successfully",
        deletedItem,
      });
    } catch (error) {
      // Handle deletion failure
      console.error(error);
      return ctx.internalServerError("Error deleting the todo item");
    }
  },
}));
