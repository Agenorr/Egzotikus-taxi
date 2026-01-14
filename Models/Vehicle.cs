using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System;
using System.Collections.Generic;

namespace ExoticBackend.Models
{
    public class Vehicle
    {
        public int id { get; set; }
        public string category { get; set; }
        public string brand { get; set; }
        public string model { get; set; }
        public int year { get; set; }
        public int weight { get; set; }
        public int doors { get; set; }
        public int drive { get; set; }
        public string description { get; set; }
        public decimal price_per_day { get; set; }
        public int status { get; set; } // 1=available, 2=rented, 3=maintenance
        public int times_rented { get; set; }

        // Navigation properties
        public List<Order> Orders { get; set; } = new List<Order>();
        public List<VehicleImage> VehicleImages { get; set; } = new List<VehicleImage>();
    }
}
