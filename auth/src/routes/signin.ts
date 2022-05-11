import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be supplied'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isSamePassword = await Password.compare(user.password, password);

    // return res.status(200).send({ isSamePassword, password: user.password });

    if (!isSamePassword) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_KEY!
    );

    // Store it on the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(user);
  }
);

export { router as signinRouter };
