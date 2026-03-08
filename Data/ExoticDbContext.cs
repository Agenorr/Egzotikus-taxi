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
            // 1. Map Users Table
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.FullName).HasColumnName("full_name");
                entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Clearance).HasColumnName("clearance");
                entity.Property(e => e.Created_At).HasColumnName("created_at");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.PhoneNumber).HasColumnName("phoneNumber"); // Exact match to your SQL
                entity.Property(e => e.LicenseNumber).HasColumnName("license_number");
                entity.Property(e => e.LicenseExpiryDate).HasColumnName("license_expiry_date");
                entity.Property(e => e.IsVerified).HasColumnName("is_verified").HasDefaultValue(false);
            });

            // 2. Map Vehicles Table
            // 2. Map Vehicles Table
            modelBuilder.Entity<Vehicle>(entity =>
            {
                entity.ToTable("vehicles");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.Brand).HasColumnName("brand");
                entity.Property(e => e.Model).HasColumnName("model");

                // Newly added mappings
                entity.Property(e => e.ExteriorColor).HasColumnName("exterior_color");
                entity.Property(e => e.Interior).HasColumnName("interior");
                entity.Property(e => e.Year).HasColumnName("year");
                entity.Property(e => e.Weight).HasColumnName("weight");
                entity.Property(e => e.Doors).HasColumnName("doors");
                entity.Property(e => e.WheelStyle).HasColumnName("wheel_style");
                entity.Property(e => e.Powertrain).HasColumnName("powertrain");
                entity.Property(e => e.Transmission).HasColumnName("transmission");
                entity.Property(e => e.Hp).HasColumnName("hp");
                entity.Property(e => e.Torque).HasColumnName("torque");
                entity.Property(e => e.Acceleration).HasColumnName("acceleration");
                entity.Property(e => e.TopSpeed).HasColumnName("top_speed");
                entity.Property(e => e.Extras).HasColumnName("extras");
                entity.Property(e => e.Drive).HasColumnName("drive");

                // Existing mappings
                entity.Property(e => e.Price_Per_Day).HasColumnName("price_per_day");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Times_Rented).HasColumnName("times_rented");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.Created_At).HasColumnName("created_at");
            });

            // 3. Map Vehicle Images Table
            modelBuilder.Entity<VehicleImage>(entity =>
            {
                entity.ToTable("vehicle_images");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");
                entity.Property(e => e.Image_Url).HasColumnName("image_url"); // Fixes the 500 crash
                entity.Property(e => e.Is_Primary).HasColumnName("is_primary");
                entity.Property(e => e.Created_At).HasColumnName("created_at");
            });

            // 4. Map Orders Table
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("orders");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");
                // Ensure other Order properties are mapped here if you have them in the C# model
            });

            // 5. Relationships
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
