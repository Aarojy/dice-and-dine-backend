import promisePool from '../src/utils/database.js';

const gameCategories = [
  {name: 'Arpa', lang: 'fi'},
  {name: 'Seikkailu', lang: 'fi'},
  {name: 'Pulma', lang: 'fi'},
  {name: 'Strategia', lang: 'fi'},
  {name: 'Perhe', lang: 'fi'},
  {name: 'Juhla', lang: 'fi'},
  {name: 'Chance', lang: 'en'},
  {name: 'Adventure', lang: 'en'},
  {name: 'Puzzle', lang: 'en'},
  {name: 'Strategy', lang: 'en'},
  {name: 'Family', lang: 'en'},
  {name: 'Party', lang: 'en'},
];

async function seedGameCategories() {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    for (const category of gameCategories) {
      // Insert category, ignore if duplicate
      await connection.execute(
        'INSERT IGNORE INTO game_categories (name, lang) VALUES (?, ?)',
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
seedGameCategories();
