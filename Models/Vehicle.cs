using System;
using System.Collections.Generic;

namespace ExoticBackend.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string? Category { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? ExteriorColor { get; set; }
        public string? Interior { get; set; }
        public int? Year { get; set; }
        public int? Weight { get; set; }
        public int? Doors { get; set; }
        public string? WheelStyle { get; set; }
        public string? Powertrain { get; set; }
        public string? Transmission { get; set; }
        public int? Hp { get; set; }
        public string Fuel { get; set; }
        public int? Torque { get; set; }
        public string? Acceleration { get; set; }
        public int? TopSpeed { get; set; }
        public string? Extras { get; set; }
        public string? Drive { get; set; }
        public decimal Price_Per_Day { get; set; }
        public string? Description { get; set; }
        public int? Times_Rented { get; set; }
        public byte Status { get; set; } // tinyint in SQL maps well to byte
        public DateTime Created_At { get; set; }

        // Navigation properties
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<VehicleImage> VehicleImages { get; set; } = new List<VehicleImage>();
    }
}