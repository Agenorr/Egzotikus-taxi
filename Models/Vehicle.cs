using ExoticBackend.Data;

namespace ExoticBackend.Models
{
    public class Vehicle
    {
        public int Id { get; set; }

        public string? Category { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public int? Weight { get; set; }
        public int? Doors { get; set; }
        public string? Drive { get; set; }
        public decimal Price_Per_Day { get; set; }
        public string? Description { get; set; }
        public int Times_Rented { get; set; }
        public int Status { get; set; }
        public DateTime Created_At { get; set; }

        // 🔥 MUST be plural
        public ICollection<VehicleImage> VehicleImages { get; set; } = new List<VehicleImage>();

        // existing
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
