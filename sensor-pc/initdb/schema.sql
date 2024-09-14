CREATE DATABASE IF NOT EXISTS mysqldb;
USE mysqldb;

-- Table: alert

DROP TABLE IF EXISTS alert;

CREATE TABLE IF NOT EXISTS alert (
    `row` INT NOT NULL AUTO_INCREMENT,
    datetime_start TIMESTAMP NULL DEFAULT NULL,
    datetime_end TIMESTAMP NULL DEFAULT NULL,
    alert_type VARCHAR(50) DEFAULT NULL,
    alert_topic VARCHAR(50) DEFAULT NULL,
    alert_message VARCHAR(50) DEFAULT NULL,
    alert_identity VARCHAR(50) DEFAULT NULL,
    alert_from VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY (`row`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: material

DROP TABLE IF EXISTS material;

CREATE TABLE IF NOT EXISTS material (
    `row` INT NOT NULL AUTO_INCREMENT,
    material_id VARCHAR(50) NOT NULL,
    material_type VARCHAR(50) DEFAULT NULL,
    material_name VARCHAR(50) DEFAULT NULL,
    material_density DOUBLE DEFAULT NULL,
    material_lot VARCHAR(50) DEFAULT NULL,
    material_discription TEXT DEFAULT NULL,
    PRIMARY KEY (`row`),
    UNIQUE KEY matid_const (material_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: radar

DROP TABLE IF EXISTS radar;

CREATE TABLE IF NOT EXISTS radar (
    `row` INT NOT NULL AUTO_INCREMENT,
    radar_id VARCHAR(50) DEFAULT NULL,
    radar_type VARCHAR(50) DEFAULT NULL,
    radar_name VARCHAR(50) DEFAULT NULL,
    loop_name VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY (`row`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: silo

DROP TABLE IF EXISTS silo;

CREATE TABLE IF NOT EXISTS silo (
    `row` INT NOT NULL AUTO_INCREMENT,
    silo_id VARCHAR(50) DEFAULT NULL,
    silo_type VARCHAR(50) DEFAULT NULL,
    silo_name VARCHAR(50) DEFAULT NULL,
    silo_latitude VARCHAR(50) DEFAULT NULL,
    silo_longitude VARCHAR(50) DEFAULT NULL,
    silo_capacity DOUBLE DEFAULT NULL,
    station_row INT DEFAULT NULL,
    radar_row INT DEFAULT NULL,
    material_row INT DEFAULT NULL,
    HH INT DEFAULT NULL,
    H INT DEFAULT NULL,
    L INT DEFAULT NULL,
    LL INT DEFAULT NULL,
    PRIMARY KEY (`row`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: value_data

DROP TABLE IF EXISTS value_data;

CREATE TABLE IF NOT EXISTS value_data (
    `row` INT NOT NULL AUTO_INCREMENT,
    date_time TIMESTAMP NULL DEFAULT NULL,
    radar_value DECIMAL(8,3) DEFAULT NULL,
    height_value DECIMAL(8,3) DEFAULT NULL,
    percent_value DECIMAL(8,3) DEFAULT NULL,
    volume_value DECIMAL(8,3) DEFAULT NULL,
    weight_value DECIMAL(8,3) DEFAULT NULL,
    silo_row INT DEFAULT NULL,
    material_id VARCHAR(50) DEFAULT NULL,
    material_name VARCHAR(50) DEFAULT NULL,
    material_density DOUBLE DEFAULT NULL,
    PRIMARY KEY (`row`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;