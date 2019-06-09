const {
  insertBook,
  deleteBook,
  getBookByTitle,
  getBookById,
  deleteQuotes,
  insertQuotes,
  getQuotesAndIds,
  getQuotes,
} = require('../db-query')

const sum = (a, b) => (a+b)
const title = `Ryan's World`
const author = 'Ryan Newton'
const quotes = ['quote #1', 'quote #2']
const quote = quotes[0]
let bookId
let book

test('Checks if jest is working', () => {
  expect(sum(1, 2)).toBe(3)
})

test('Inserting and retrieving a book', async () => {
  await insertBook({ title, author })
})

test('Retriving book by Title', async () => {
  book = await getBookByTitle(title)
  bookId = book.book_id
  expect(bookId).toBeDefined()
})

test('Retrieving book by ID', async () => {
  book = await getBookById(bookId)
  expect(book.bookTitle).toBe(title)
  expect(book.author).toBe(author)
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
  expect(deleteCount).toBeGreaterThanOrEqual(1)
  book = await getBookByTitle(title)
  expect(book).toBeNull()
})
