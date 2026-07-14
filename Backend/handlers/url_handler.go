package handlers

import (
	"net/http"

	// Import our database connection
	"backend/config"

	// Import URL database model
	"backend/models"

	// Import short code generator
	"backend/utils"

	// Gin framework
	"github.com/gin-gonic/gin"
)


// =====================================================
// Endpoint 1:
// POST /shorten
//
// Purpose:
// Receive a long URL from the user,
// generate a short code,
// save it in PostgreSQL,
// return the shortened URL.
// Gin is a web framework for Go that helps you build HTTP servers and REST APIs easily.
// Without Gin, you would use Go's built-in net/http package and write more code manually.
// =====================================================

func CreateShortURL(c *gin.Context) {


	// Create a structure to receive JSON request data
	// Expected request:
	//
	// {
	//    "original_url": "https://github.com/openai"
	// }
	var request struct {

		// Maps JSON field "original_url"
		// to this Go variable
		OriginalURL string `json:"original_url"`
	}



	// Read JSON body sent by client
	// Convert JSON -> Go struct
	err := c.ShouldBindJSON(&request)


	// If JSON is invalid
	if err != nil {

		c.JSON(
			http.StatusBadRequest,

			gin.H{
				"error": "Invalid request body",
			},
		)

		return
	}



	// Generate random 6 character code
	//
	// Example:
	//
	// Ab12Cd
	//
	shortCode := utils.GenerateShortCode()



	// Create a new URL object
	// This represents one row in database
	url := models.URL{

		// Original long URL
		OriginalURL: request.OriginalURL,


		// Generated short identifier
		ShortCode: shortCode,


		// New URL starts with zero clicks
		Clicks: 0,
	}



	// Save URL object into PostgreSQL
	//
	// SQL equivalent:
	//
	// INSERT INTO urls
	// (original_url, short_code, clicks)
	// VALUES(...)
	//
	result := config.DB.Create(&url)



	// Check database error
	if result.Error != nil {


		c.JSON(
			http.StatusInternalServerError,

			gin.H{
				"error": "Could not save URL",
			},
		)


		return
	}



	// Send response back to frontend
	//
	// Response:
	//
	// {
	//    "short_url":
	//    "http://localhost:8080/Ab12Cd"
	// }
	c.JSON(
		http.StatusOK,

		gin.H{

			"short_url":
			"http://localhost:8080/" + shortCode,
		},
	)

}





// =====================================================
// Endpoint 2:
// GET /:code
//
// Example:
//
// GET /Ab12Cd
//
// Purpose:
// Find the original URL,
// increase click count,
// redirect user.
// =====================================================

func RedirectURL(c *gin.Context) {


	// Get code from URL parameter
	//
	// Example:
	//
	// /Ab12Cd
	//
	// code = Ab12Cd
	//
	code := c.Param("code")



	// Create empty URL object
	// Database result will be stored here
	var url models.URL



	// Search database using short code
	//
	// SQL equivalent:
	//
	// SELECT *
	// FROM urls
	// WHERE short_code='Ab12Cd'
	//
	result := config.DB.
		Where(
			"short_code = ?",
			code,
		).
		First(&url)



	// If URL does not exist
	if result.Error != nil {


		c.JSON(
			http.StatusNotFound,

			gin.H{
				"error": "Short URL not found",
			},
		)


		return
	}




	// Increase click count
	//
	// Example:
	//
	// Before:
	// clicks = 5
	//
	// After:
	// clicks = 6
	//
	url.Clicks++



	// Save updated click count
	//
	// SQL:
	//
	// UPDATE urls
	// SET clicks=6
	//
	config.DB.Save(&url)



	// Redirect browser to original URL
	//
	// Example:
	//
	// localhost:8080/Ab12Cd
	//
	// redirects to:
	//
	// https://github.com/openai
	c.Redirect(
		http.StatusMovedPermanently,
		url.OriginalURL,
	)

}





// =====================================================
// Endpoint 3:
// GET /stats/:code
//
// Example:
//
// GET /stats/Ab12Cd
//
// Purpose:
// Return URL information and click count.
// =====================================================

func GetStats(c *gin.Context) {


	// Get short code from URL
	code := c.Param("code")



	// Create URL object
	var url models.URL



	// Find URL in database
	//
	// SQL:
	//
	// SELECT *
	// FROM urls
	// WHERE short_code='Ab12Cd'
	//
	result := config.DB.
		Where(
			"short_code = ?",
			code,
		).
		First(&url)



	// URL not found
	if result.Error != nil {


		c.JSON(
			http.StatusNotFound,

			gin.H{
				"error":"URL not found",
			},
		)


		return
	}




	// Return statistics
	//
	// Response:
	//
	// {
	//    "original_url":
	//       "https://github.com/openai",
	//
	//    "clicks":12
	// }
	c.JSON(
		http.StatusOK,

		gin.H{

			"original_url": url.OriginalURL,

			"clicks": url.Clicks,
		},
	)

}