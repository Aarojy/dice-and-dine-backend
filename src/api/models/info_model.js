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

const getAllergensFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${allergens} WHERE lang="${lang}"`
  );
  return rows;
};

const getRestaurantFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${restaurant} WHERE lang="${lang}"`
  );
  return rows;
};

const changeRestaurantInfo = async (info, type) => {
  await promisePool.query(
    `UPDATE restaurant_info
     SET ${type}='${info}'`
  );
  return;
};

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

const getItemCategoriesFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${itemCategories} WHERE lang="${lang}"`
  );
  return rows;
};

const getGameCategoriesFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${gameCategories} WHERE lang="${lang}"`
  );
  return rows;
};

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
              maxDistance: 200,
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
              maxDistance: 200,
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
