using ExoticBackend.Data;
using ExoticBackend.DTOs;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace ExoticBackEnd
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // -------------------------
            // Add services first
            // -------------------------

            // Enable CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact",
                    policy => policy.AllowAnyOrigin()
                                    .AllowAnyMethod()
                                    .AllowAnyHeader());
            });

            // DbContext
            builder.Services.AddDbContext<ExoticDbContext>(options =>
                options.UseMySql(
                    "server=localhost;database=exotic_rentals;user=root;password=;", // empty password example
                    new MySqlServerVersion(new Version(8, 0, 32))
                )
            );

            // Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // -------------------------
            // Middleware
            // -------------------------
            app.UseCors("AllowReact");

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();           // Generates swagger.json
                app.UseSwaggerUI();         // Interactive UI at /swagger
            }

            // -------------------------
            // API Endpoints
            // -------------------------
            app.MapGet("/api/status", () => new
            {
                Message = "Backend is running",
                Timestamp = DateTime.Now
            });

            app.MapGet("/api/vehicles", async (ExoticDbContext db) =>
            {
                try
                {
                    var vehicles = await db.Vehicles
                    .Include(v => v.VehicleImages)
                    .AsNoTracking()
                    .Select(v => new VehicleDto
                    {
                        Id = v.Id,
                        Brand = v.Brand,
                        Model = v.Model,
                        Description = v.Description,
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
                    Console.WriteLine($"Error fetching vehicles: {ex}");
                    return Results.Problem(ex.Message); // <-- show full exception in Swagger
                }
            });

            app.Run();
        }
    }
}
