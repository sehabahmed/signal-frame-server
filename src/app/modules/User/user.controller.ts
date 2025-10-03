import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import httpStatus from "http-status";

const userRegister = catchAsync(async (req, res) => {
  const user = await UserServices.createuser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Created Successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.getSingleUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: user,
  });
});

export const UserControllers = {
  getSingleUser,
  userRegister,
  getAllUsers,
};
