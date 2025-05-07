import promisePool from '../../utils/database.js';
const menu = 'menu';
const allergens = 'allergens';
const allergenTable = 'allergen_table';
const restaurant = 'restaurant_info';
const boardgames = 'boardgames';
const itemCategories = 'item_categories';
const itemCategoriesTable = 'category_table';
const gameCategories = 'game_categories';
const gameCategoriesTable = 'game_category_table';

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
 * @apiSuccess {Object[]} menu.allergens The list of allergens for the menu item.
 * @apiSuccess {Object[]} menu.categories The list of categories for the menu item.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the menu.
 */
const getMenuFromDatabase = async (lang) => {
  let result = [];

  // Fetch all menu items
  const [rows] = await promisePool.query(
    `SELECT * FROM ${menu} WHERE lang="${lang}"`
  );

  // Fetch all allergens for each menu item
  for (const row of rows) {
    const allergenRows = await promisePool.query(
      `SELECT * FROM ${allergenTable} WHERE menu_item_id=${row.id}`
    );

    let allergensList = [];
    for (const allergen_id of allergenRows[0]) {
      let allergen = await promisePool.query(
        `SELECT * FROM ${allergens} WHERE id=${allergen_id.allergen_id}`
      );

      allergensList.push(allergen[0][0].name);
    }

    row.allergens = allergensList;
    result.push(row);
  }

  // Fetch all categories for each menu item
  for (const row of rows) {
    const categoryRows = await promisePool.query(
      `SELECT * FROM ${itemCategoriesTable} WHERE menu_item_id=${row.id}`
    );

    let categoriesList = [];
    for (const category_id of categoryRows[0]) {
      let category = await promisePool.query(
        `SELECT * FROM ${itemCategories} WHERE id=${category_id.category_id}`
      );

      categoriesList.push(category[0][0].name);
    }

    row.categories = categoriesList;
  }

  return result;
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
 * @apiSuccess {Object[]} menuItem.allergens The list of allergens for the menu item.
 * @apiSuccess {Object[]} menuItem.categories The list of categories for the menu item.
 *
 * @apiError (404 Not Found) MenuItemNotFound The menu item was not found.
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the menu item.
 */
const getMenuItemFromDatabase = async (id) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${menu} WHERE id=${id}`
  );

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];

  // Fetch allergens for the menu item
  const allergenRows = await promisePool.query(
    `SELECT * FROM ${allergenTable} WHERE menu_item_id=${row.id}`
  );

  let allergensList = [];
  for (const allergen_id of allergenRows[0]) {
    let allergen = await promisePool.query(
      `SELECT * FROM ${allergens} WHERE id=${allergen_id.allergen_id}`
    );

    allergensList.push(allergen[0][0].name);
  }

  row.allergens = allergensList;

  // Fetch categories for the menu item
  const categoryRows = await promisePool.query(
    `SELECT * FROM ${itemCategoriesTable} WHERE menu_item_id=${row.id}`
  );

  let categoriesList = [];
  for (const category_id of categoryRows[0]) {
    let category = await promisePool.query(
      `SELECT * FROM ${itemCategories} WHERE id=${category_id.category_id}`
    );

    categoriesList.push(category[0][0].name);
  }

  row.categories = categoriesList;

  return row;
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
const getAllergensFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${allergens} WHERE lang="${lang}"`
  );
  return rows;
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
const getRestaurantFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${restaurant} WHERE lang="${lang}"`
  );
  return rows;
};

/**
 * @api {put} /api/v1/info/restaurant Update Restaurant Info
 * @apiName UpdateRestaurantInfo
 * @apiGroup Info
 *
 * @apiBody {String} info The new information to update.
 * @apiBody {String} type The type of information to update (e.g., phone, email, open_times).
 *
 * @apiSuccess {String} message Success message indicating the restaurant info was updated.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while updating the restaurant info.
 */
const changeRestaurantInfo = async (info, type) => {
  await promisePool.query(
    `UPDATE restaurant_info
     SET ${type}='${info}'`
  );
  return;
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
 * @apiSuccess {Object[]} boardgames.categories The list of categories for the boardgame.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the boardgames.
 */
const getBoardgamesFromDatabase = async (lang) => {
  let result = [];

  const [rows] = await promisePool.query(
    `SELECT * FROM ${boardgames} WHERE lang="${lang}"`
  );

  // Fetch all categories for each game
  for (const row of rows) {
    const categoryRows = await promisePool.query(
      `SELECT * FROM ${gameCategoriesTable} WHERE game_id=${row.id}`
    );

    let categoriesList = [];
    for (const category_id of categoryRows[0]) {
      let category = await promisePool.query(
        `SELECT * FROM ${gameCategories} WHERE id=${category_id.game_category_id}`
      );

      categoriesList.push(category[0][0].name);
    }

    row.categories = categoriesList;
    result.push(row);
  }

  return rows;
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
const getItemCategoriesFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${itemCategories} WHERE lang="${lang}"`
  );
  return rows;
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
const getGameCategoriesFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${gameCategories} WHERE lang="${lang}"`
  );
  return rows;
};

/**
 * @api {get} /api/v1/info/public-transport Get Public Transport Data
 * @apiName GetPublicTransport
 * @apiGroup Info
 *
 * @apiSuccess {Object} transportData The public transport data.
 * @apiSuccess {Object[]} transportData.scooters The list of nearby scooters.
 * @apiSuccess {Object[]} transportData.stops The list of nearby stops.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching public transport data.
 */
const fetchPublicTransport = async () => {
  try {
    const restaurantData = await getRestaurantFromDatabase('fi');
    const lat = restaurantData[0].latitude;
    const lon = restaurantData[0].longitude;

    const responseScooter = await fetch(process.env.DIGITRANSIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'digitransit-subscription-key': process.env.DIGITRANSIT_API_KEY,
      },
      body: JSON.stringify({
        query: `
          query {
            nearest(
              lat: ${lat},
              lon: ${lon},
              maxDistance: 300,
              filterByPlaceTypes: [VEHICLE_RENT]
            ) {
              edges {
                node {
                  place {
                    __typename
                    ... on Stop {
                      name
                      lat
                      lon
                      code
                    }
                    ... on RentalVehicle {
                      name
                      lat
                      lon
                    }
                    ... on DepartureRow {
                      lat
                      lon
                    }
                  }
                  distance
                }
              }
            }
          }
        `,
      }),
    });

    const responseStops = await fetch(process.env.DIGITRANSIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'digitransit-subscription-key': process.env.DIGITRANSIT_API_KEY,
      },
      body: JSON.stringify({
        query: `
          query {
            nearest(
              lat: ${lat},
              lon: ${lon},
              maxDistance: 300,
              filterByPlaceTypes: [STOP, STATION, CAR_PARK, BIKE_PARK]
            ) {
              edges {
                node {
                  place {
                    __typename
                    ... on Stop {
                      name
                      lat
                      lon
                      code
                    }
                    ... on RentalVehicle {
                      name
                      lat
                      lon
                    }
                    ... on DepartureRow {
                      lat
                      lon
                    }
                  }
                  distance
                }
              }
            }
          }
        `,
      }),
    });

    const scooterData = await responseScooter.json();
    const stopsData = await responseStops.json();

    const response = {scooters: scooterData, stops: stopsData};

    return response;
  } catch (error) {
    console.error('Error fetching public transport data:', error);
    throw error;
  }
};

export {
  getMenuFromDatabase,
  getMenuItemFromDatabase,
  getAllergensFromDatabase,
  getRestaurantFromDatabase,
  getBoardgamesFromDatabase,
  getItemCategoriesFromDatabase,
  getGameCategoriesFromDatabase,
  fetchPublicTransport,
  changeRestaurantInfo,
};
