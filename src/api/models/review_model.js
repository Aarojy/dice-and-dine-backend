import promisePool from '../../utils/database.js';

const listReviews = async () => {
  const [rows] = await promisePool.query('SELECT * FROM reviews');
  return rows;
};

const createReview = async (user_id, review, rating) => {
  if (user_id) {
    const [result] = await promisePool.query(
      'INSERT INTO reviews (customer, review_text, time, rating) VALUES (?, ?, ?, ?)',
      [user_id, review, new Date(), rating]
    );

    return {id: result.insertId, user_id, review, rating};
  } else {
    const [result] = await promisePool.query(
      'INSERT INTO reviews (review_text, time, rating) VALUES (?, ?, ?)',
      [review, new Date(), rating]
    );

    return {id: result.insertId, user_id, review, rating};
  }
};

export {createReview, listReviews};
