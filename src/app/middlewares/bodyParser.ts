import AppError from "../errors/AppError";
import { catchAsync } from "../utils/catchAsync";

export const parseBody = catchAsync(async (req, res, next) => {
  // If data is already an object (normal JSON), use it directly
  if (req.body && typeof req.body === 'object' && !req.body.data) {
    // Body is already parsed JSON, continue
    return next();
  }
  
  // If data is under 'data' key (your current format)
  if (!req.body.data) {
    throw new AppError(400, "Please provide data in the body under data key");
  }
  
  // Parse the stringified JSON from data property
  req.body = JSON.parse(req.body.data);
  next();
});