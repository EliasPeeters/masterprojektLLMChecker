-- V1__create_tables.sql

CREATE TABLE evaluation_items (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  llmResult TEXT NOT NULL
);

CREATE TABLE evaluation_answers (
  id VARCHAR(36) PRIMARY KEY,
  itemId VARCHAR(36) NOT NULL,
  answer TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);