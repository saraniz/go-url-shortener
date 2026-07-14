// package models mean this file belongs to model package
package models

import (
	"time"
)

// URL represents a shortened URL record in the database. this mean we use struct to create db table
// gorm mean GORM (Go Object Relational Mapping) is a library for Go that allows you to interact with databases using Go structs instead of writing SQL queries manually.
/*
`gorm:"..."` are called GORM struct tags. They give instructions to GORM about how to create the database columns.
*/

type URL struct {

	// Primary key
	ID uint `gorm:"primaryKey"`

	// Original long URL
	// Example:
	// https://github.com/openai
	OriginalURL string `gorm:"not null"`

	// Generated short code
	// Example:
	// Ab12Cd
	ShortCode string `gorm:"unique;not null"`

	// Number of times the short URL was visited
	Clicks int `gorm:"default:0"`

	// Automatically stores creation time
	CreatedAt time.Time

	// Automatically stores update time
	UpdatedAt time.Time
}