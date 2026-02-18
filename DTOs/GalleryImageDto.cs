namespace ExoticBackend.DTOs
{
    public class GalleryImageDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }
}
