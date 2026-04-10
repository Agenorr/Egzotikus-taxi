using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExoticBackend.Models
{
    public class TaxiOrder
    {
        [Key]
        public int Id { get; set; }

        // --- Foreign Keys ---

        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; } // Links to the customer

        [Required]
        public int VehicleId { get; set; }
        // Uncomment this if you have a Vehicle model setup in EF
        // [ForeignKey("VehicleId")]
        // public Vehicle? Vehicle { get; set; }

        [Required]
        public int DriverId { get; set; }
        // If your Drivers are also stored in the User table (as employees), you can link them like this:
        // [ForeignKey("DriverId")]
        // public User? Driver { get; set; }

        // --- Trip Details ---

        [Required]
        [StringLength(255)]
        public string PickupLocation { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string DropoffLocation { get; set; } = string.Empty;

        [Required]
        public DateTime PickupDateTime { get; set; }

        // --- Financial & Status ---

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        // Status tracking: 1 = Megerősítésre vár, 2 = Aktív, 3 = Befejezett, 4 = Törölt
        public int Status { get; set; } = 1;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}