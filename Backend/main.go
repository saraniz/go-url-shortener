package main


import (

	// Used for loading .env file
	"github.com/joho/godotenv"


	// Gin web framework
	"github.com/gin-gonic/gin"

	// CORS middleware
	"github.com/gin-contrib/cors"


	// Our database connection
	"backend/config"


	// Our routes
	"backend/routes"


	// Logging
	"log"
)



func main() {


	// =====================================
	// STEP 1:
	// Load environment variables
	//
	// Reads values from:
	//
	// .env
	//
	// Example:
	//
	// DATABASE_URL=postgresql://...
	// =====================================

	err := godotenv.Load()


	if err != nil {

		log.Println("Warning: .env file not found")

	}



	// =====================================
	// STEP 2:
	// Connect PostgreSQL database
	//
	// This will:
	//
	// - Read DATABASE_URL
	// - Connect using GORM
	// - Run AutoMigrate()
	//
	// =====================================

	config.ConnectDatabase()




	// =====================================
	// STEP 3:
	// Create Gin server
	//
	// gin.Default() creates:
	//
	// - Router
	// - Logger middleware
	// - Recovery middleware
	//
	// =====================================

	router := gin.Default()

	// Enable CORS
	router.Use(cors.Default())




	// =====================================
	// STEP 4:
	// Register API routes
	//
	// Connect:
	//
	// POST /shorten
	// GET  /:code
	// GET  /stats/:code
	//
	// =====================================

	routes.RegisterRoutes(router)




	// =====================================
	// STEP 5:
	// Start server
	//
	// Backend runs on:
	//
	// http://localhost:8080
	//
	// =====================================

	router.Run(":8080")

}