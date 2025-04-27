import promisePool from '../src/utils/database.js';

const allergens = [
  {name: 'Gluten', lang: 'fi'},
  {name: 'Kananmuna', lang: 'fi'},
  {name: 'Maito', lang: 'fi'},
  {name: 'Pähkinä', lang: 'fi'},
  {name: 'Merenelävä', lang: 'fi'},
  {name: 'Kala', lang: 'fi'},
  {name: 'Gluten', lang: 'en'},
  {name: 'Egg', lang: 'en'},
  {name: 'Milk', lang: 'en'},
  {name: 'Nuts', lang: 'en'},
  {name: 'Seafood', lang: 'en'},
  {name: 'Fish', lang: 'en'},
];

async function seedAllergens() {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    for (const allergen of allergens) {
      // Insert allergen, ignore if duplicate
      await connection.execute(
        'INSERT IGNORE INTO allergens (name, lang) VALUES (?, ?)',
        [allergen.name, allergen.lang]
      );
    }

    await connection.commit();
    console.log('Allergens seeded successfully!');
  } catch (error) {
    await connection.rollback();
    console.error('Error seeding allergens:', error);
  } finally {
    connection.release();
  }
}

seedAllergens();
