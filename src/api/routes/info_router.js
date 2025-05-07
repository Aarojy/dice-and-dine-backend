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

/**
 * @api {get} /api/v1/info/menu/:lang Get Menu
 * @apiName GetMenu
 * @apiGroup Info
 *
 * @apiParam {String} lang The language of the menu.
 *
 * @apiSuccess {Object[]} menu The list of menu items.
 * @apiSuccess {String} menu.name The name of the menu item.
 * @apiSuccess {Number} menu.price The price of the menu item.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the menu.
 */
infoRouter.route('/menu/:lang').get(getMenu);

/**
 * @api {get} /api/v1/info/menu/item/:id Get Menu Item
 * @apiName GetMenuItem
 * @apiGroup Info
 *
 * @apiParam {Number} id The ID of the menu item.
 *
 * @apiSuccess {Object} menuItem The details of the menu item.
 * @apiSuccess {String} menuItem.name The name of the menu item.
 * @apiSuccess {Number} menuItem.price The price of the menu item.
 *
 * @apiError (404 Not Found) MenuItemNotFound The menu item was not found.
 */
infoRouter.route('/menu/item/:id').get(getMenuItem);

/**
 * @api {get} /api/v1/info/allergens/:lang Get Allergens
 * @apiName GetAllergens
 * @apiGroup Info
 *
 * @apiParam {String} lang The language of the allergens.
 *
 * @apiSuccess {Object[]} allergens The list of allergens.
 * @apiSuccess {String} allergens.name The name of the allergen.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the allergens.
 */
infoRouter.route('/allergens/:lang').get(getAllergens);

/**
 * @api {post} /api/v1/info/restaurant/phone/:number Update Restaurant Phone Number
 * @apiName PostRestaurantNumber
 * @apiGroup Info
 *
 * @apiParam {String} number The new phone number for the restaurant.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the phone number was updated.
 *
 * @apiError (403 Forbidden) Unauthorized The user is not authorized to perform this action.
 * @apiError (400 Bad Request) InvalidPhoneNumber The provided phone number is invalid.
 */
infoRouter
  .route('/restaurant/phone/:number')
  .post(authenticateToken, postRestaurantNumber);

/**
 * @api {post} /api/v1/info/restaurant/email/:email Update Restaurant Email
 * @apiName PostRestaurantEmail
 * @apiGroup Info
 *
 * @apiParam {String} email The new email address for the restaurant.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the email was updated.
 *
 * @apiError (403 Forbidden) Unauthorized The user is not authorized to perform this action.
 * @apiError (400 Bad Request) InvalidEmail The provided email is invalid.
 */
infoRouter
  .route('/restaurant/email/:email')
  .post(authenticateToken, postRestaurantEmail);

/**
 * @api {post} /api/v1/info/restaurant/open/:open Update Restaurant Open Times
 * @apiName PostRestaurantOpen
 * @apiGroup Info
 *
 * @apiParam {String} open The new open times for the restaurant.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the open times were updated.
 *
 * @apiError (403 Forbidden) Unauthorized The user is not authorized to perform this action.
 * @apiError (400 Bad Request) InvalidOpenTimes The provided open times are invalid.
 */
infoRouter
  .route('/restaurant/open/:open')
  .post(authenticateToken, postRestaurantOpen);

/**
 * @api {get} /api/v1/info/restaurant/:lang Get Restaurant Info
 * @apiName GetRestaurant
 * @apiGroup Info
 *
 * @apiParam {String} lang The language of the restaurant information.
 *
 * @apiSuccess {Object} restaurant The restaurant information.
 * @apiSuccess {String} restaurant.name The name of the restaurant.
 * @apiSuccess {String} restaurant.address The address of the restaurant.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the restaurant information.
 */
infoRouter.route('/restaurant/:lang').get(getRestaurant);

/**
 * @api {get} /api/v1/info/boardgames/:lang Get Boardgames
 * @apiName GetBoardgames
 * @apiGroup Info
 *
 * @apiParam {String} lang The language of the boardgames.
 *
 * @apiSuccess {Object[]} boardgames The list of boardgames.
 * @apiSuccess {String} boardgames.name The name of the boardgame.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the boardgames.
 */
infoRouter.route('/boardgames/:lang').get(getBoardgames);

/**
 * @api {get} /api/v1/info/itemcategories/:lang Get Item Categories
 * @apiName GetItemCategories
 * @apiGroup Info
 *
 * @apiParam {String} lang The language of the item categories.
 *
 * @apiSuccess {Object[]} itemCategories The list of item categories.
 * @apiSuccess {String} itemCategories.name The name of the item category.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the item categories.
 */
infoRouter.route('/itemcategories/:lang').get(getItemCategories);

/**
 * @api {get} /api/v1/info/gamecategories/:lang Get Game Categories
 * @apiName GetGameCategories
 * @apiGroup Info
 *
 * @apiParam {String} lang The language of the game categories.
 *
 * @apiSuccess {Object[]} gameCategories The list of game categories.
 * @apiSuccess {String} gameCategories.name The name of the game category.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the game categories.
 */
infoRouter.route('/gamecategories/:lang').get(getGameCategories);

/**
 * @api {get} /api/v1/info/getPublicTransport Get Public Transport Data
 * @apiName GetPublicTransport
 * @apiGroup Info
 *
 * @apiSuccess {Object} transportData The public transport data.
 * @apiSuccess {Object[]} transportData.scooters The list of nearby scooters.
 * @apiSuccess {Object[]} transportData.stops The list of nearby stops.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching public transport data.
 */
infoRouter.route('/getPublicTransport').get(getPublicTransport);

export default infoRouter;
