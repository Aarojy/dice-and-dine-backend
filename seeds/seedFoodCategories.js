import promisePool from '../src/utils/database.js';

const categories = [
  {name: 'Alkupala', lang: 'fi'},
  {name: 'Pääruoka', lang: 'fi'},
  {name: 'Jälkiruoka', lang: 'fi'},
  {name: 'Juomat', lang: 'fi'},
  {name: 'Napostelu', lang: 'fi'},
  {name: 'Starter', lang: 'en'},
  {name: 'Main', lang: 'en'},
  {name: 'Dessert', lang: 'en'},
  {name: 'Beverages', lang: 'en'},
  {name: 'Snacks', lang: 'en'},
];

async function seedFoodCategories() {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    for (const category of categories) {
      // Insert category, ignore if duplicate
      await connection.execute(
        'INSERT IGNORE INTO item_categories (name, lang) VALUES (?, ?)',
        [category.name, category.lang]
      );
    }

    await connection.commit();
    console.log('Categories seeded successfully!');
  } catch (error) {
    await connection.rollback();
    console.error('Error seeding categories:', error);
  } finally {
    connection.release();
  }
}

// Run the seed function
seedFoodCategories();
