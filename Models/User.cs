using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ExoticBackend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty; // Hash

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        // --- Rental Specific Data ---

        public string? FullName { get; set; } = string.Empty;

        public DateTime? DateOfBirth { get; set; }

        public string? LicenseNumber { get; set; } = string.Empty;

        public DateTime? LicenseExpiryDate { get; set; }

        public bool IsVerified { get; set; } = false; // Set to true once admin checks ID/License

        // --- System & RBAC ---

        public int Clearance { get; set; } = 1; // 1: User, 2: Employee, 3: Admin

        public DateTime Created_At { get; set; } = DateTime.UtcNow;

        // --- Navigation Properties ---

        // Renamed from Orders to Bookings to fit Car Rental terminology
        public List<Order> Orders { get; set; } = new List<Order>();
    }
}