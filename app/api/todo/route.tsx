import { db } from "@/config/firebase";
import sequelize from "@/config/sequelize";
import Todo from "@/models/todo.model";
import { errorResponse, successResponse } from "@/utils/api";
import { Op } from "sequelize";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const where: any = {};
    if (search?.trim().length > 0) {
      where.todo = {
        [Op.iLike]: `%${search?.toLowerCase()}%`, // Use the LIKE operator to perform a partial match
      };
    }
    const todos = await Todo.findAll({
      where,
      order: [["createdAt", "ASC"]],
    });
    return successResponse(todos);
  } catch (error) {
    console.log(error);
    return errorResponse();
  }
}

export const POST = async (request: Request) => {
  try {
    const { todo } = await request.json();
    if (!todo) {
      return errorResponse("required", 400);
    }
    // Use the Sequelize model to find users with a matching name
    const todos = await Todo.findAll({
      where: {
        todo: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("todo")),
          "=",
          todo.toLowerCase()
        ),
      },
    });

    if (todos.length > 0) {
      return errorResponse("exists", 400);
    }
    const newTodo = await Todo.create({
      todo,
    });
    return successResponse(newTodo);
  } catch (error) {
    return errorResponse();
  }
};
