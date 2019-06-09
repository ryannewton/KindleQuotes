const {
  insertBook,
  deleteBook,
  getBookId,
  deleteQuotes,
  insertQuotes,
  getQuotesAndIds,
  getQuotes,
} = require('../db-query')

const sum = (a, b) => (a+b)
const title = `Ryan's World`
const quotes = ['quote #1', 'quote #2']
const quote = quotes[0]
let book_id

test('Checks if jest is working', () => {
  expect(sum(1, 2)).toBe(3)
})

test('Inserting and retrieving a book', async () => {
  await insertBook(title)
  book_id = await getBookId(title)
  expect(book_id).toBeDefined()
})

test('Inserting quotes and retrieving quotesAndIds', async () => {
  insertQuotes(quotes, title)
  let quotesAndIds = await getQuotesAndIds({ bookTitle: title, numberOfQuotes: quotes.length })
  const returnedQuotes = quotesAndIds.map(quotesAndId => quotesAndId.quote)
  expect(returnedQuotes.sort()).toEqual(quotes.sort())
  const returnedQuoteIds = quotesAndIds.map(quotesAndId => quotesAndId.quote_id)
  expect(returnedQuoteIds.length).toEqual(quotes.length)
  expect(returnedQuoteIds[0]).toBeTruthy()
  expect(typeof returnedQuoteIds[0]).toBe('string')
})

test('Retrieving quotes', async () => {
  let returnedQuotes = await getQuotes(title, quotes.length)
  expect(returnedQuotes.sort()).toEqual(quotes.sort())
})

test('Deleting quotes', async () => {
  await deleteQuotes(quotes, title)
  quotesAndIds = await getQuotesAndIds({ bookTitle: title, numberOfQuotes: quotes.length })
  expect(quotesAndIds).toEqual([])
})

test('Deleting a book', async () => {
  const deleteCount = await deleteBook(title)
  expect(deleteCount).toBe(1)
  book_id = await getBookId(title)
  expect(book_id).toBeNull()
})
