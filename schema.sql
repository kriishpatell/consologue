CREATE TABLE account (
    account_id INT PRIMARY KEY AUTO_INCREMENT, 
    username VARCHAR(30) UNIQUE NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    account_type ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

CREATE TABLE profile (
    profile_id INT PRIMARY KEY AUTO_INCREMENT, 
    account_id INT,
    username INT,
    first_name VARCHAR(30) DEFAULT NULL,
    last_name VARCHAR(30) DEFAULT NULL,
    date_of_birth DATE DEFAULT NULL,
    profile_picture BLOB DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    is_private TINYINT(1) NOT NULL DEFAULT 0, 
    FOREIGN KEY (account_id) REFERENCES account(account_id)
)

CREATE TABLE platform (
	platform_id INT PRIMARY KEY AUTO_INCREMENT, 
    platform_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE genre (
	genre_id INT PRIMARY KEY AUTO_INCREMENT, 
    genre_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE developer (
	developer_id INT PRIMARY KEY AUTO_INCREMENT, 
    developer_name VARCHAR(255) UNIQUE NOT NULL,
    date_founded DATE DEFAULT NULL
);

CREATE TABLE game (
	game_id INT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    description TEXT NOT NULL,
    release_date DATE DEFAULT NULL,  
    game_poster BLOB DEFAULT NULL,
    developer INT, 
    age_rating ENUM('eC', 'E', 'E10+', 'T', 'M', 'Ao'),
    FOREIGN KEY (developer) REFERENCES developer(developer_id)
);

CREATE TABLE game_genre (
	game_genre_id INT PRIMARY KEY AUTO_INCREMENT, 
    game_id INT, 
    genre_id INT, 
    CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES game(game_id), 
    CONSTRAINT fk_genre FOREIGN KEY (genre_id) REFERENCES genre(genre_id)
);

CREATE TABLE game_platform (
	game_platform_id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT,
    platform_id INT, 
    CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES game(game_id),
    CONSTRAINT fk_platform FOREIGN KEY (platform_id) REFERENCES platform(platform_id)
);
    
CREATE TABLE user_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    account_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 10),
    review_text TEXT,
    review_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

CREATE TABLE user_lists (
    list_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    list_name VARCHAR(255) NOT NULL,
    list_description TEXT,
    creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

CREATE TABLE list_games (
    list_game_id INT PRIMARY KEY AUTO_INCREMENT,
    list_id INT NOT NULL,
    game_id INT NOT NULL,
    FOREIGN KEY (list_id) REFERENCES user_lists(list_id),
    FOREIGN KEY (game_id) REFERENCES game(game_id)
);