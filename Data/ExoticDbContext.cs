using Microsoft.EntityFrameworkCore;
using ExoticBackend.Models;

namespace ExoticBackend.Data
{
    public class ExoticDbContext : DbContext
    {
        public ExoticDbContext(DbContextOptions<ExoticDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<VehicleImage> VehicleImages { get; set; }
        public DbSet<GalleryImage> GalleryImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Map C# classes to existing database tables (no renaming needed)
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Vehicle>().ToTable("vehicles");
            modelBuilder.Entity<Order>().ToTable("orders");      // "Order" is a C# class, table is "orders"
            modelBuilder.Entity<VehicleImage>(entity =>
            {
                entity.ToTable("vehicle_images");

                entity.Property(e => e.VehicleId)
                      .HasColumnName("vehicle_id");

                entity.Property(e => e.Image_Url)
                      .HasColumnName("image_url");

                entity.Property(e => e.Is_Primary)
                      .HasColumnName("is_primary");

                entity.Property(e => e.Created_At)
                      .HasColumnName("created_at");
            });

            // Relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId);

            modelBuilder.Entity<Vehicle>()
                .HasMany(v => v.Orders)
                .WithOne(o => o.Vehicle)
                .HasForeignKey(o => o.VehicleId);

            modelBuilder.Entity<Vehicle>()
                .HasMany(v => v.VehicleImages)
                .WithOne(i => i.Vehicle)
                .HasForeignKey(i => i.VehicleId);
        }
    }
}
