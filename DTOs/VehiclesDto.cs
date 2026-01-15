namespace ExoticBackend.DTOs
{
    public class VehicleDto
    {
        public int Id { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? Description { get; set; }
        public List<VehicleImageDto> Images { get; set; } = new();
    }
}
