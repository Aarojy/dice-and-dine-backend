import express from 'express';
import {
  getMenu,
  getMenuItem,
  getRestaurant,
  getAllergens,
  getBoardgames,
  getGameCategories,
  getItemCategories,
  getPublicTransport,
} from '../controllers/info_controller.js';

const infoRouter = express.Router();

infoRouter.route('/menu/:lang').get(getMenu);

infoRouter.route('/menu/item/:id').get(getMenuItem);

infoRouter.route('/allergens/:lang').get(getAllergens);

infoRouter.route('/restaurant/:lang').get(getRestaurant);

infoRouter.route('/boardgames/:lang').get(getBoardgames);

infoRouter.route('/itemcategories/:lang').get(getItemCategories);

infoRouter.route('/gamecategories/:lang').get(getGameCategories);

infoRouter.route('/getPublicTransport').get(getPublicTransport);

export default infoRouter;
