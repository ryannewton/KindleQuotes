const {
  insertBook,
  deleteBook,
  getBookId,
} = require('../db-query')

const sum = (a, b) => (a+b)

test('Checks if jest is working', () => {
  expect(sum(1, 2)).toBe(3)
})

test('Inserting, retrieving, and deleting books', async () => {
  const title = `Ryan's World`
  await insertBook(title)
  let book_id = await getBookId(title)
  expect(book_id).toBeDefined()
  const deleteCount = await deleteBook(title)
  expect(deleteCount).toBe(1)
  book_id = await getBookId(title)
  expect(book_id).toBeNull()
})
