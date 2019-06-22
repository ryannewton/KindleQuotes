const userQueries = client => ({
  insert: async email => {
    try {
      const res = await client.query('SELECT * FROM users WHERE email = $1', [email])
      if (res.rows.length === 0) {
        await client.query('INSERT INTO users(email) VALUES($1)', [email])
      }
    } catch (err) {
      console.log('Error: ', err)
    }
  },

  get: async ({ userId, email }) => {
    try {
      let res
      if (userId) {
        res = await client.query('SELECT * FROM users WHERE user_id = $1', [userId])
      } else if (email) {
        res = await client.query('SELECT * FROM users WHERE email = $1', [email])
      }
      if (res.rows.length === 0) {
        return null
      }
      return res.rows[0]
    } catch (err) {
      console.log('Error: ', err)
    }
  },

  delete: async ({ userId, email }) => {
    try {
      let res
      if (userId) {
        res = await client.query('DELETE FROM users WHERE user_id = $1', [userId])
      } else if (email) {
        res = await client.query('DELETE FROM users WHERE email = $1', [email])
      }
      return res.rowCount
    } catch (err) {
      console.log('Error: ', err)
    }
  },
})

module.exports = userQueries
