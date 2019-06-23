## Overview

Kindle Quotes is an app that sends users a daily email with book quotes from their Kindle highlights.

Rather than randomly selecting quotes, the user specifies a book they want to revisit and the app sends quotes in the order they appear in the book. The purpose of this is to help users revisit valuable content to reinforce the lessons.

## 📋 Current State

The project is currently only a node.js app that:

- Saves books, users, quotes, and schedules
- Sends quotes at the designated time

Planned features include:

- Scraping a user's Kindle quotes (they must currently be uploaded manually using the /quotes/add endpoint)
- Add a frontend so users can sign up on their own

## 🚀 Setup

This project is very immature and consequently the functionality is limited. If you would like to start using it yourself, follow these steps:

1. Download the project from GitHub
2. Sign up for a [SendGrid](sendgrid.com) account
   1. The free tier works
   2. Set up a Transactional Template, with variables `{{{ bookTitle }}}`, `{{{ author }}}`, `{{{ quote0 }}}`, `{{{ quote1 }}}`, `{{{ quote2 }}}`, `{{{ quote3 }}}`, `{{{ quote4 }}}`
3. Sign up for a [Heroku](heroku.com) account
   1. Create a kindle-quotes app. You will need at least a Hobby account (\$7/mo.). The free tier turns off after 1 hr of inactivity, which is likely before your email is scheduled
   2. Add a Postgres database
   3. Add config variables `SENDGRID_KEY`, `SENDGRID_TEMPLATE_ID`. Get the values from your SendGrid account
4. [Deploy the project to Heroku](https://devcenter.heroku.com/articles/git#creating-a-heroku-remote)
5. Set up your scheduled quotes
   1. Create a user with `/users/add`
   2. Add books with `/books/add`
   3. Add quotes with `/quotes/add`
   4. Schedule emails with `/quotes/schedule`

## 🤓🏂 About the Author

Ryan Newton is currently a Technical Lead at a software startup. He loves reading and exclusively reads on his Kindle. He has always liked the idea of reviewing his highlights, but found he never actually did so, so Kindle Quotes was born. This is a side project he works on for fun.

## 📇 Contact

If you would like to contact me, email me at newton1988@gmail.com
I am happy to take add you as an alpha user, take feature requests, or disucss anything else on your mind.
