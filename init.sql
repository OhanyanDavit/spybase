-- Active: 1749377451012@@127.0.0.1@5432@spybase

CREATE TABLE IF NOT EXISTS agents (
    id SERIAL PRIMARY KEY,
    codename TEXT UNIQUE NOT NULL,
    real_name TEXT NOT NULL,
    clearance_level INTEGER CHECK (clearance_level >= 1 AND clearance_level <= 10)
);

CREATE TABLE IF NOT EXISTS missions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT CHECK (status IN ('assigned', 'active', 'failed', 'completed')) NOT NULL,
    agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mission_files
(
    id SERIAL PRIMARY KEY,
    mission_id INTEGER REFERENCES missions(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    encrypted_data TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS missions CASCADE;
DROP TABLE IF EXISTS mission_files CASCADE;