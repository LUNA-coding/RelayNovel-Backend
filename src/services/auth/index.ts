import { ServiceSchema } from '@/services';
import Joi from 'joi';
import * as controllers from './controller';

export default <ServiceSchema>{
  name: 'auth',
  baseURL: '/auth',
  routes: [
    {
      method: 'post',
      path: '/signup',
      needAuth: false,
      validateSchema: {
        username: Joi.string().required(),
        name: Joi.string().required(),
        password: Joi.string().required(),
      },
      handler: controllers.signUp,
    },
    {
      method: 'post',
      path: '/login',
      needAuth: false,
      validateSchema: {
        username: Joi.string().required(),
        password: Joi.string().required(),
      },
      handler: controllers.login,
    },
  ],
};
