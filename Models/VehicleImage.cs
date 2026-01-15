namespace ExoticBackend.Models
{
    public class VehicleImage
    {
        public int Id { get; set; }

        // MUST match FK
        public int VehicleId { get; set; }

        public string Image_Url { get; set; } = null!;
        public bool Is_Primary { get; set; }
        public DateTime Created_At { get; set; }

        public Vehicle Vehicle { get; set; } = null!;
    }
}
