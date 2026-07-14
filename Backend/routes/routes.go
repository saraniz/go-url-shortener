package routes

import (

	// Import URL handler functions
	"backend/handlers"


	// Gin framework
	"github.com/gin-gonic/gin"
)


// RegisterRoutes connects API URLs
// with their handler functions
func RegisterRoutes(router *gin.Engine) {

	// Root Route (API Status & Welcome)
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"message": "ShrinkIt URL Shortener API is running",
		})
	})

	// =====================================
	// Create Short URL
	//
	// Method:
	// POST
	//
	// URL:
	// /shorten
	//
	// Function:
	// CreateShortURL
	// =====================================

	router.POST(
		"/shorten",
		handlers.CreateShortURL,
	)



	// =====================================
	// Redirect URL
	//
	// Method:
	// GET
	//
	// URL:
	// /:code
	//
	// Example:
	// /Ab12Cd
	//
	// Function:
	// RedirectURL
	// =====================================

	router.GET(
		"/:code",
		handlers.RedirectURL,
	)



	// =====================================
	// Get Statistics
	//
	// Method:
	// GET
	//
	// URL:
	// /stats/:code
	//
	// Example:
	// /stats/Ab12Cd
	//
	// Function:
	// GetStats
	// =====================================

	router.GET(
		"/stats/:code",
		handlers.GetStats,
	)

}