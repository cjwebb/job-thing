# planning on using Amazon RDS for this. However, for development, I've been
# using MSQL.

# Run these commands to setup databases/tables.

CREATE DATABASE jobthing;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(200),
	email VARCHAR(200),
	password VARCHAR(200) # TODO: this need hashing
);