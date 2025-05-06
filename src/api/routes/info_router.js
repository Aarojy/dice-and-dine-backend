import express from 'express';
import {authenticateToken} from '../../middlewares.js';
import {
  getMenu,
  getMenuItem,
  getRestaurant,
  getAllergens,
  getBoardgames,
  getGameCategories,
  getItemCategories,
  getPublicTransport,
  postRestaurantEmail,
  postRestaurantNumber,
  postRestaurantOpen,
} from '../controllers/info_controller.js';

const infoRouter = express.Router();

infoRouter.route('/menu/:lang').get(getMenu);

infoRouter.route('/menu/item/:id').get(getMenuItem);

infoRouter.route('/allergens/:lang').get(getAllergens);

infoRouter
  .route('/restaurant/phone/:number')
  .post(authenticateToken, postRestaurantNumber);

infoRouter
  .route('/restaurant/email/:email')
  .post(authenticateToken, postRestaurantEmail);

infoRouter
  .route('/restaurant/open/:open')
  .post(authenticateToken, postRestaurantOpen);

infoRouter.route('/restaurant/:lang').get(getRestaurant);

infoRouter.route('/boardgames/:lang').get(getBoardgames);

infoRouter.route('/itemcategories/:lang').get(getItemCategories);

infoRouter.route('/gamecategories/:lang').get(getGameCategories);

infoRouter.route('/getPublicTransport').get(getPublicTransport);

export default infoRouter;
