import {
  getMenuFromDatabase,
  getAllergensFromDatabase,
  getRestaurantFromDatabase,
  getBoardgamesFromDatabase,
  getItemCategoriesFromDatabase,
  getGameCategoriesFromDatabase,
} from '../models/info_model.js';

/* eslint-disable no-unused-vars */
const getMenu = async (req, res) => {
  try {
    const menu = await getMenuFromDatabase(req.params.lang); // Replace with actual database call
    res.status(200).json(menu);
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
  getAllergens,
  getRestaurant,
  getBoardgames,
  getItemCategories,
  getGameCategories,
};
