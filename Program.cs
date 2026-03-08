using ExoticBackend.Data;
using ExoticBackend.DTOs;
using ExoticBackend.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging; 
using System;
using System.ComponentModel.DataAnnotations;

namespace ExoticBackEnd
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<ExoticDbContext>(options =>
                options.UseMySql(
                    connectionString,
                    new MySqlServerVersion(new Version(8, 0, 32))
                )
            );

           //CORS
            var allowedOrigins = "_myAllowSpecificOrigins";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: allowedOrigins,
                    policy =>
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                    });
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            //MIDDLEWARE

            //HTTPS REDIRECT
            app.UseHttpsRedirection();

            app.UseCors(allowedOrigins);

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                app.UseHsts();
            }

            //API
            app.MapGet("/api/status", () => new
            {
                Message = "Backend is running",
                Timestamp = DateTime.UtcNow 
            });

            
            app.MapGet("/api/vehicles", async (string? category, ExoticDbContext db, ILogger<Program> logger) =>
            {
                try
                {
                    var query = db.Vehicles
                        .Include(v => v.VehicleImages)
                        .AsNoTracking()
                        .AsQueryable();

                    if (!string.IsNullOrWhiteSpace(category))
                    {
                        query = query.Where(v => v.Category == category);
                    }

                    var vehicles = await query
                        .Select(v => new VehicleDto
                        {
                            Id = v.Id,
                            Brand = v.Brand,
                            Model = v.Model,
                            Description = v.Description,
                            Category = v.Category,
                            Images = v.VehicleImages.Select(i => new VehicleImageDto
                            {
                                Id = i.Id,
                                ImageUrl = i.Image_Url,
                                IsPrimary = i.Is_Primary
                            }).ToList()
                        })
                        .ToListAsync();

                    return Results.Ok(vehicles);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while fetching vehicles.");

                    if (ex.InnerException is MySqlConnector.MySqlException mysqlEx)
                    {
                        return Results.Problem(
                            detail: "The database service is currently unavailable. Please ensure MySQL is started.",
                            statusCode: 503 
                        );
                    }

                    return Results.Problem("An internal error occurred.");
                }
            });


            app.MapGet("/api/vehicles/{id}", async (int id, ExoticDbContext db) =>
            {
                var vehicle = await db.Vehicles
                    .Include(v => v.VehicleImages)
                    .FirstOrDefaultAsync(v => v.Id == id);

                if (vehicle == null)
                {
                    return Results.NotFound(new { message = "Car not found" });
                }

                // Map ALL the new fields to the response
                return Results.Ok(new
                {
                    id = vehicle.Id,
                    brand = vehicle.Brand,
                    model = vehicle.Model,
                    description = vehicle.Description,
                    category = vehicle.Category,
                    pricePerDay = vehicle.Price_Per_Day,
                    year = vehicle.Year,
                    weight = vehicle.Weight,
                    doors = vehicle.Doors,
                    drive = vehicle.Drive,
                    exteriorColor = vehicle.ExteriorColor,
                    interior = vehicle.Interior,
                    wheelStyle = vehicle.WheelStyle,
                    powertrain = vehicle.Powertrain,
                    transmission = vehicle.Transmission,
                    hp = vehicle.Hp,
                    torque = vehicle.Torque,
                    acceleration = vehicle.Acceleration,
                    topSpeed = vehicle.TopSpeed,
                    extras = vehicle.Extras,

                    images = vehicle.VehicleImages.Select(i => new
                    {
                        id = i.Id,
                        imageUrl = i.Image_Url,
                        isPrimary = i.Is_Primary
                    }).ToList()
                });
            });

            // API - Fetch Gallery Images
            app.MapGet("/api/gallery", async (ExoticDbContext db) =>
            {
                // Fetch EVERYTHING without filters
                var images = await db.GalleryImages
                    .AsNoTracking()
                    .Select(img => new GalleryImageDto
                    {
                        Id = img.Id,
                        Title = img.Title,
                        // Map the underscore version from DB to the CamelCase version in DTO
                        ImageUrl = img.Image_Url,
                        Category = img.Category
                    })
                    .ToListAsync();

                return Results.Ok(images);
            });

            app.MapPost("/api/register", async (RegisterDto dto, ExoticDbContext db) =>
            {
                // 1. Check if user already exists
                if (await db.Users.AnyAsync(u => u.Email == dto.Email))
                {
                    return Results.BadRequest("User with this email already exists.");
                }

                // 2. Hash the password
                string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, salt);

                // 3. Save to database
                var user = new User
                {
                    Username = dto.Username,
                    Password = passwordHash,
                    Email = dto.Email,
                    PhoneNumber = dto.PhoneNumber,
                    Created_At = DateTime.UtcNow,
                    Clearance = 1
                };

                db.Users.Add(user);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "User registered successfully!" });
            });

            app.MapPost("/api/login", async (LoginDto dto, ExoticDbContext db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

                if (user == null)
                {
                    return Results.Unauthorized();
                }

                
                bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);

                if (!isValid)
                {
                    return Results.Unauthorized(); 
                }

                return Results.Ok(new
                {
                    message = "Login successful!",
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    clearance = user.Clearance
                });
            });

            app.Run();
        }
    }
}

