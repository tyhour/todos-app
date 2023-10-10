import sequelize from "@/config/sequelize";
import { DataTypes, Model } from "sequelize";
import { v4 as uuidv4 } from "uuid"; // Import the UUID generation function

class Todo extends Model {
  public id!: string; // Use string type for UUID
  public todo!: string;
  public isCompleted!: boolean;
}

Todo.init(
  {
    id: {
      type: DataTypes.UUID, // Use UUID data type
      defaultValue: () => uuidv4(), // Generate a new UUID as the default value
      primaryKey: true, // Set as the primary key
    },
    todo: {
      type: DataTypes.STRING,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Todo",
    timestamps: true, // If you want timestamps (createdAt, updatedAt) for your model
  }
);

export default Todo;
