using System;
using System.Collections.Generic;

namespace ExoticBackend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int Clearance { get; set; } // 1=guest, 2=user, 3=admin
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation property
        public List<Order> Orders { get; set; } = new List<Order>();
    }
}
