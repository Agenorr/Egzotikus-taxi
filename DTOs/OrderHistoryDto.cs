using System;

namespace ExoticBackend.DTOs
{
    public class OrderHistoryDto
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string ImageUrl { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalPrice { get; set; }
        public int Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}