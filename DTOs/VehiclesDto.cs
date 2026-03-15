namespace ExoticBackend.DTOs
{
    public class VehicleDto
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Category { get; set; }
        // Map 'drive' from DB to 'drivetrain' for Frontend
        public string Drivetrain { get; set; }
        // Map 'powertrain' from DB to 'engineType' for Frontend
        public string EngineType { get; set; }
        public string Fuel {  get; set; }
        public int Status { get; set; }

        public int? Year { get; set; }
        public decimal PricePerDay { get; set; }
        // Ensure this is initialized so .map() doesn't crash
        public List<VehicleImageDto> Images { get; set; } = new();
    }
}
