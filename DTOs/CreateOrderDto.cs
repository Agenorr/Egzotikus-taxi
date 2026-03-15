using System;

namespace ExoticBackend.DTOs
{
    public class CreateOrderDto
    {
        public int UserId { get; set; }
        public int VehicleId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalPrice { get; set; }
    }
}