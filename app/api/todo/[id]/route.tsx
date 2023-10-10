import sequelize from "@/config/sequelize";
import Todo from "@/models/todo.model";
import { errorResponse, successResponse } from "@/utils/api";
import { Op } from "sequelize";

interface IParamsProp {
  params: { id: string };
}
export const GET = async (request: Request, { params }: IParamsProp) => {
  try {
    const todo = await Todo.findByPk(params.id);
    return successResponse(todo);
  } catch (error) {
    return errorResponse();
  }
};

export const PUT = async (request: Request, { params }: IParamsProp) => {
  try {
    const { todo, isCompleted } = await request.json();
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
        id: {
          [Op.not]: params.id,
        },
      },
    });

    if (todos.length > 0) {
      return errorResponse("exists", 400);
    }

    const upateTodo = await Todo.findByPk(params.id);
    if (!upateTodo) {
      return errorResponse("missing", 400);
    }
    upateTodo.todo = todo;
    if (isCompleted != undefined) {
      upateTodo.isCompleted = Boolean(isCompleted);
    }
    await upateTodo?.save();
    return successResponse(upateTodo);
  } catch (error) {
    return errorResponse();
  }
};

export const DELETE = async (request: any, { params }: any) => {
  try {
    const todo = await Todo.findByPk(params.id);

    if (!todo) {
      return errorResponse("Todo not found.");
    }
    await todo.destroy();
    return successResponse();
  } catch (error) {
    return errorResponse();
  }
};
