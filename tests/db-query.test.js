const { bookQueries, quoteQueries } = require('../db-queries')

const sum = (a, b) => a + b
const title = `Ryan's World`
const author = 'Ryan Newton'
const quotes = [{ text: 'quote #1', location: 1 }, { text: 'quote #2', location: 2 }]
const quote = quotes[0]
let bookId
let book
let returnedQuotes
let quotesText

test('Checks if jest is working', () => {
  expect(sum(1, 2)).toBe(3)
})

test('Inserting and retrieving a book', async () => {
  await bookQueries.insert({ title, author })
})

test('Retriving book by Title', async () => {
  book = await bookQueries.getByTitle(title)
  bookId = book.book_id
  expect(bookId).toBeDefined()
})

test('Retrieving book by ID', async () => {
  book = await bookQueries.getById(bookId)
  expect(book.bookTitle).toBe(title)
  expect(book.author).toBe(author)
})

test('Inserting quotes and retrieving quotesAndIds', async () => {
  quoteQueries.insert(quotes, title)
  returnedQuotes = await quoteQueries.get({ bookTitle: title, numberOfQuotes: quotes.length })
  const returnedQuotesText = returnedQuotes.map(quote => quote.text)
  quotesText = quotes.map(quote => quote.text)
  expect(returnedQuotesText.sort()).toEqual(quotesText.sort())
  const returnedQuoteIds = returnedQuotes.map(quote => quote.quote_id)
  expect(returnedQuoteIds.length).toEqual(quotes.length)
  expect(returnedQuoteIds[0]).toBeTruthy()
  expect(typeof returnedQuoteIds[0]).toBe('string')
})

test('Deleting quotes', async () => {
  quotesText = quotes.map(quote => quote.text)
  await quoteQueries.delete(quotesText, title)
  returnedQuotes = await quoteQueries.get({ bookTitle: title, numberOfQuotes: quotes.length })
  expect(returnedQuotes).toEqual([])
})

test('Deleting a book', async () => {
  const deleteCount = await bookQueries.delete(title)
  expect(deleteCount).toBeGreaterThanOrEqual(1)
  book = await bookQueries.getByTitle(title)
  expect(book).toBeNull()
})
