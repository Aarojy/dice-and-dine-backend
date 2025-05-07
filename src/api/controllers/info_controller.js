/* eslint-disable no-unused-vars */
import {
  getMenuFromDatabase,
  getMenuItemFromDatabase,
  getAllergensFromDatabase,
  getRestaurantFromDatabase,
  getBoardgamesFromDatabase,
  getItemCategoriesFromDatabase,
  getGameCategoriesFromDatabase,
  fetchPublicTransport,
  changeRestaurantInfo,
} from '../models/info_model.js';

const getPublicTransport = async (req, res) => {
  try {
    const publicTransport = await fetchPublicTransport();
    res.status(200).json(publicTransport);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

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
const getMenu = async (req, res) => {
  try {
    const menu = await getMenuFromDatabase(req.params.lang);
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

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
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the menu item.
 */
const getMenuItem = async (req, res) => {
  try {
    const menuItem = await getMenuItemFromDatabase(req.params.id);
    if (!menuItem) {
      return res.status(404).json({error: 'Menu item not found'});
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

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
const getAllergens = async (req, res) => {
  try {
    const allergens = await getAllergensFromDatabase(req.params.lang); // Replace with actual database call
    res.status(200).json(allergens);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

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
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await getRestaurantFromDatabase(req.params.lang); // Replace with actual database call
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

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
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while updating the phone number.
 */
const postRestaurantNumber = async (req, res) => {
  try {
    const {number} = req.params;

    if (req.user.user_type !== 'admin') {
      return res.status(403).json({message: 'Unauthorized'});
    }

    if (!number) {
      return res.status(400).json({error: 'Invalid phone number'});
    }

    changeRestaurantInfo(number, 'phone');

    res.status(200).json({message: 'Phone number saved successfully'});
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

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
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while updating the email.
 */
const postRestaurantEmail = async (req, res) => {
  try {
    const {email} = req.params;

    if (req.user.user_type !== 'admin') {
      return res.status(403).json({message: 'Unauthorized'});
    }

    if (!email) {
      return res.status(400).json({error: 'Invalid email'});
    }

    changeRestaurantInfo(email, 'email');

    res.status(200).json({message: 'Email saved successfully'});
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

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
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while updating the open times.
 */
const postRestaurantOpen = async (req, res) => {
  try {
    const {open} = req.params;

    if (req.user.user_type !== 'admin') {
      return res.status(403).json({message: 'Unauthorized'});
    }

    if (!open) {
      return res.status(400).json({error: 'Invalid open times'});
    }

    changeRestaurantInfo(open, 'open_times');

    res.status(200).json({message: 'Open times saved successfully'});
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

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
const getBoardgames = async (req, res) => {
  try {
    const boardgames = await getBoardgamesFromDatabase(req.params.lang);
    res.status(200).json(boardgames);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

/**
 * @api {get} /api/v1/info/item-categories/:lang Get Item Categories
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
const getItemCategories = async (req, res) => {
  try {
    const itemCategories = await getItemCategoriesFromDatabase(req.params.lang);
    res.status(200).json(itemCategories);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

/**
 * @api {get} /api/v1/info/game-categories/:lang Get Game Categories
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
const getGameCategories = async (req, res) => {
  try {
    const gameCategories = await getGameCategoriesFromDatabase(req.params.lang);
    res.status(200).json(gameCategories);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

export {
  getMenu,
  getMenuItem,
  getAllergens,
  getRestaurant,
  getBoardgames,
  getItemCategories,
  getGameCategories,
  getPublicTransport,
  postRestaurantEmail,
  postRestaurantOpen,
  postRestaurantNumber,
};
