using System;

namespace ExoticBackend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalPrice { get; set; }
        public int Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // ADD THIS LINE
        public string? VerificationToken { get; set; }
    }
}