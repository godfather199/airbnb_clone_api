import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'


export const login_Success_Func = async (req, res, next) => {
    try {
      const {emails } = req.user;

      const user = await User.findOne({ email: emails[0].value });

      if (!user) {
        return next(error_Handler(400, "Invalid username/email"));
      }

      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "3d",
        }
      );

      res
        .status(201)
        .cookie("access_token_ab", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        })
        .json({
          msg: "User login successfull",
          user,
        });
    } catch (error) {
      next(error);
    }
}