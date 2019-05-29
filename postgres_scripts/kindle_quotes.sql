-- Database: kindle_quotes

-- DROP DATABASE kindle_quotes;

CREATE DATABASE kindle_quotes
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;


-- Create Table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE books (
	book_id uuid DEFAULT uuid_generate_v4(),
	title TEXT,
	PRIMARY KEY (book_id)
);
