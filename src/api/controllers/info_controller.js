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
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

/* eslint-disable no-unused-vars */
const getMenu = async (req, res) => {
  try {
    const menu = await getMenuFromDatabase(req.params.lang);
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

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

const getAllergens = async (req, res) => {
  try {
    const allergens = await getAllergensFromDatabase(req.params.lang); // Replace with actual database call
    res.status(200).json(allergens);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await getRestaurantFromDatabase(req.params.lang); // Replace with actual database call
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

const postRestaurantNumber = async (req, res) => {
  try {
    const {number} = req.params;

    if (!number) {
      return res.status(400).json({error: 'Invalid phone number'});
    }

    changeRestaurantInfo(number, 'phone');

    res.status(200).json({message: 'Phone number saved successfully'});
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

const postRestaurantEmail = async (req, res) => {
  try {
    const {email} = req.params;

    if (!email) {
      return res.status(400).json({error: 'Invalid email'});
    }

    changeRestaurantInfo(email, 'email');

    res.status(200).json({message: 'Email saved successfully'});
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

const postRestaurantOpen = async (req, res) => {
  try {
    const {open} = req.params;
    console.log(open);

    if (!open) {
      return res.status(400).json({error: 'Invalid open times'});
    }

    changeRestaurantInfo(open, 'open_times');

    res.status(200).json({message: 'Open times saved successfully'});
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};

const getBoardgames = async (req, res) => {
  try {
    const boardgames = await getBoardgamesFromDatabase(req.params.lang); // Replace with actual database call
    res.status(200).json(boardgames);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};
const getItemCategories = async (req, res) => {
  try {
    const itemCategories = await getItemCategoriesFromDatabase(req.params.lang); // Replace with actual database call
    res.status(200).json(itemCategories);
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
};
const getGameCategories = async (req, res) => {
  try {
    const gameCategories = await getGameCategoriesFromDatabase(req.params.lang); // Replace with actual database call
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
