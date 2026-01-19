using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // Useful for validation

namespace ExoticBackend.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty; // This will store the Hash

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        // Default to 1 (Guest) for security
        public int Clearance { get; set; } = 1;

        public DateTime Created_At { get; set; } = DateTime.UtcNow;

        // Navigation property
        public List<Order> Orders { get; set; } = new List<Order>();
    }
}