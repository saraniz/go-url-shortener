package config

import (
	"log"
	"os"

	"backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)


// Global database variable
var DB *gorm.DB


// Connect database function
func ConnectDatabase() {

	// Get DATABASE_URL from environment variables
	dsn := os.Getenv("DATABASE_URL")


	// Check if DATABASE_URL exists
	if dsn == "" {
		log.Fatal("DATABASE_URL is missing")
	}


	// Connect PostgreSQL using GORM
	// return 2 values in this function
	// &gorm.Config{}, // default settings
	database, err := gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{}, // default settings
	)


	// Check connection error
	/* 
	if err != nil
	nil means nothing / no error.
	*/
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}


	// Store database connection globally
	DB = database


	// Create tables automatically
	err = DB.AutoMigrate(&models.URL{})


	if err != nil {
		log.Fatal("Migration failed:", err)
	}


	log.Println("Database connected successfully")
}