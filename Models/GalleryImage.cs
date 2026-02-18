using System.ComponentModel.DataAnnotations.Schema;

namespace ExoticBackend.Models
{
    [Table("gallery_images")]
    public class GalleryImage
    {
        public int Id { get; set; }
        public string? Title { get; set; }

        // Use [Column] attribute if the DB name is different from the property name
        [Column("Image_Url")]
        public string Image_Url { get; set; } = string.Empty;

        public string Category { get; set; } = "General";
        public DateTime Upload_Date { get; set; } = DateTime.UtcNow;
    }
}
