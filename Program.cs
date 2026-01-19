using ExoticBackend.Data;
using ExoticBackend.DTOs;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging; 
using System;

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
                        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
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

            app.Run();
        }
    }
}

