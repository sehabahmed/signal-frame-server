import bcryptjs from "bcryptjs";
import { model, Schema } from "mongoose";
import { IUserModel, TUser } from "./user.interface";
import { USER_ROLE, USER_STATUS } from "./user.constant";
import config from "../../config";

const userSchema = new Schema<TUser, IUserModel>(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      required: true,
    },
    email: {
      type: String,
      required: true,
      //validate email
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    status: {
      type: String,
      enum: Object.keys(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    passwordChangedAt: {
      type: Date,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // hasing password and save into DB
  user.password = await bcryptjs.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// set "" after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({
    email,
  }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcryptjs.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: number,
  jwtIssuedTimeStamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return jwtIssuedTimeStamp < passwordChangedTime;
};

export const User = model<TUser, IUserModel>("User", userSchema);
