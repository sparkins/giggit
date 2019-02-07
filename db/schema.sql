DROP DATABASE IF EXISTS giggetter_db;

CREATE DATABASE IF NOT EXISTS giggetter_db;

USE giggetter_db;



CREATE TABLE IF NOT EXISTS users(
    userId INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
    isABusiness BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (userId)
); 

CREATE TABLE IF NOT EXISTS categories(
    categoryId INT AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (categoryId)
); 

CREATE TABLE IF NOT EXISTS businesses(
    businessId INT AUTO_INCREMENT,
    userId     INT ,
    categoryId INT NOT NULL,
    business_name VARCHAR(50) NOT NULL,
    business_bio VARCHAR (255),
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (categoryId) REFERENCES categories(categoryId),
    PRIMARY KEY (businessId)
); 

CREATE TABLE IF NOT EXISTS jobs(
    jobId INT AUTO_INCREMENT,
    userId INT NOT NULL,
    businessId INT NOT NULL,
    categoryId INT NOT NULL,
    rating INT,
    review VARCHAR(255),
    cost DECIMAL (10,2),
    jobStatus VARCHAR (25) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (businessId) REFERENCES businesses(businessId),
    FOREIGN KEY (categoryId) REFERENCES categories(categoryId),
    PRIMARY KEY (jobId)
); 