package utils

import (
	"math/rand"
	"time"
)


// Characters used to generate short codes
const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"


// GenerateShortCode creates a random 6-character code
// string mean return the string value
func GenerateShortCode() string {

	// Seed random generator
	rand.Seed(time.Now().UnixNano())


	code := make([]byte, 6)


	for i := 0; i < 6; i++ {

		// Pick random character
		code[i] = characters[rand.Intn(len(characters))]
	}


	return string(code)
}