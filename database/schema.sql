DROP DATABASE IF EXISTS test;
CREATE DATABASE IF NOT EXISTS test;
USE test;
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(37) PRIMARY KEY,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_updated DATETIME DEFAULT NULL
) ENGINE=InnoDB;
