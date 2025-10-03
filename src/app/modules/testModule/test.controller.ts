import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TestServices } from "./test.service";
import httpStatus from "http-status";

const createTest = catchAsync(async (req, res) => {
  const item = await TestServices.createTestIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Test created successfully",
    data: item,
  });
});

const getAllItems = catchAsync(async (req, res) => {
  const items = await TestServices.getAllTestsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tests retrieved successfully",
    data: items,
  });
});


export const TestControllers = {
    createTest,
    getAllItems,
};