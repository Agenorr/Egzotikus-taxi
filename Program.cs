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
using System.Net;           // <-- Added for Email
using System.Net.Mail;      // <-- Added for Email

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
                            Category = v.Category,
                            Drivetrain = v.Drive,
                            EngineType = v.Powertrain,
                            Fuel = v.Fuel,
                            Year = v.Year,
                            Status = v.Status,
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
                    fuel = vehicle.Fuel,
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

                // 3. GENERATE THE TOKEN (This was missing)
                string token = Guid.NewGuid().ToString();

                // 4. Save to database
                var user = new User
                {
                    Username = dto.Username,
                    Password = passwordHash,
                    Email = dto.Email,
                    PhoneNumber = dto.PhoneNumber,
                    Created_At = DateTime.UtcNow,
                    Clearance = 1,
                    Is_Verified = 0,             // Set to 0 (Unverified)
                    VerificationToken = token    // Assign the generated token
                };

                db.Users.Add(user);
                await db.SaveChangesAsync();

                // 5. SEND THE EMAIL (This was missing)
                try
                {
                    // This is the link to your React app
                    string verificationLink = $"http://localhost:3000/verify-email?token={token}";

                    // *** YOU MUST CHANGE THESE CREDENTIALS TO A REAL EMAIL ***
                    var smtpClient = new SmtpClient("smtp.gmail.com")
                    {
                        Port = 587,
                        Credentials = new NetworkCredential("bravery.cs@gmail.com", "zrau wgzd vgin kljz"),
                        EnableSsl = true,
                    };

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("bravery.cs@gmail.com", "Exotic Rentals"),
                        Subject = "Verify your Exotic Rentals Account",
                        Body = $"Welcome! <br><br> Please click the link to verify your email and unlock Level 2 Clearance: <br><br> <a href='{verificationLink}'>{verificationLink}</a>",
                        IsBodyHtml = true,
                    };

                    mailMessage.To.Add(user.Email);
                    smtpClient.Send(mailMessage);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send email: {ex.Message}");
                }

                return Results.Ok(new { message = "User registered successfully! Please check your email to verify." });
            });


            app.MapPost("/api/auth/verify", async (string token, ExoticDbContext db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.VerificationToken == token);

                if (user == null)
                {
                    return Results.BadRequest(new { message = "Invalid or expired verification token." });
                }

                // Update status to 1 (Verified)
                user.Is_Verified = 1;
                user.VerificationToken = null;

                await db.SaveChangesAsync();

                // === CHANGED THIS RETURN STATEMENT ===
                // We now return the updated user data in the EXACT same format as the login endpoint!
                return Results.Ok(new
                {
                    message = "Email verified successfully!",
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    clearance = user.Clearance,
                    is_verified = user.Is_Verified
                });
            });

            app.MapGet("/api/auth/me/{id}", async (int id, ExoticDbContext db) =>
            {
                var user = await db.Users.FindAsync(id);

                if (user == null)
                {
                    return Results.NotFound(new { message = "User not found." });
                }

                // Return the exact same structure as Login and Verify!
                return Results.Ok(new
                {
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    clearance = user.Clearance,
                    is_verified = user.Is_Verified
                });
            });

            app.MapGet("/api/user/{id}/profile", async (int id, ExoticDbContext db) =>
            {
                var user = await db.Users.FindAsync(id);

                if (user == null)
                {
                    return Results.NotFound(new { message = "User not found." });
                }

                // Return ONLY the data needed for the Personal Info tab
                return Results.Ok(new
                {
                    fullName = user.FullName,
                    phoneNumber = user.PhoneNumber,
                    licenseNumber = user.LicenseNumber 
                });
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
                    clearance = user.Clearance,
                    is_verified = user.Is_Verified
                });
            });
            app.MapGet("/api/user/{id}/orders", async (int id, ExoticDbContext db) =>
            {
                var orders = await db.Orders
                    .Include(o => o.Vehicle)
                        .ThenInclude(v => v.VehicleImages)
                    .Where(o => o.UserId == id)
                    .OrderByDescending(o => o.CreatedAt) // Legújabb rendelések legelöl
                    .Select(o => new OrderHistoryDto
                    {
                        Id = o.Id,
                        Brand = o.Vehicle.Brand,
                        Model = o.Vehicle.Model,
                        // Próbáljuk az elsődleges képet lekérni, ha nincs, akkor az elsőt
                        ImageUrl = o.Vehicle.VehicleImages.FirstOrDefault(i => i.Is_Primary).Image_Url
                                   ?? o.Vehicle.VehicleImages.FirstOrDefault().Image_Url,
                        StartDate = o.StartDate,
                        EndDate = o.EndDate,
                        TotalPrice = o.TotalPrice,
                        Status = o.Status,
                        CreatedAt = o.CreatedAt
                    })
                    .ToListAsync();

                return Results.Ok(orders);
            });
            // Pásztázd be ezt a POST végpontot a GET /api/user/{id}/orders fölé vagy alá!
            app.MapPost("/api/orders", async (CreateOrderDto dto, ExoticDbContext db) =>
            {
                try
                {
                    // 1. Fetch the user so we know where to send the email
                    var user = await db.Users.FindAsync(dto.UserId);
                    if (user == null) return Results.BadRequest("User not found.");

                    // 2. Generate a secure token
                    string token = Guid.NewGuid().ToString();

                    // 3. Create the order
                    var newOrder = new Order
                    {
                        UserId = dto.UserId,
                        VehicleId = dto.VehicleId,
                        StartDate = dto.StartDate,
                        EndDate = dto.EndDate,
                        TotalPrice = dto.TotalPrice,
                        Status = 1, // 1 = Pending
                        CreatedAt = DateTime.UtcNow,
                        VerificationToken = token // Save the token
                    };

                    db.Orders.Add(newOrder);
                    await db.SaveChangesAsync();

                    // 4. Send the Verification Email
                    try
                    {
                        string verificationLink = $"http://localhost:3000/verify-order?token={token}";

                        var smtpClient = new SmtpClient("smtp.gmail.com")
                        {
                            Port = 587,
                            Credentials = new NetworkCredential("bravery.cs@gmail.com", "zrau wgzd vgin kljz"),
                            EnableSsl = true,
                        };

                        var mailMessage = new MailMessage
                        {
                            From = new MailAddress("bravery.cs@gmail.com", "Exotic Rentals"),
                            Subject = "Erősítse meg autóbérlését (Verify Order)",
                            Body = $"Köszönjük a foglalást! <br><br> Kérjük, kattintson az alábbi linkre a bérlés megerősítéséhez és aktiválásához: <br><br> <a href='{verificationLink}'>{verificationLink}</a>",
                            IsBodyHtml = true,
                        };

                        mailMessage.To.Add(user.Email);
                        smtpClient.Send(mailMessage);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to send order email: {ex.Message}");
                    }

                    return Results.Ok(new { message = "Order created! Please check your email to verify." });
                }
                catch (Exception ex)
                {
                    return Results.Problem($"Failed to create order: {ex.Message}");
                }
            });
            app.MapPost("/api/orders/verify", async (string token, ExoticDbContext db) =>
            {
                // 1. Keresd meg a rendelést, és INCLUDÁLD hozzá az autót is!
                var order = await db.Orders
                    .Include(o => o.Vehicle) // <-- Ez nagyon fontos, hogy módosíthassuk az autót!
                    .FirstOrDefaultAsync(o => o.VerificationToken == token);

                if (order == null)
                {
                    return Results.BadRequest(new { message = "Érvénytelen vagy lejárt megerősítő link." });
                }

                // 2. Frissítsd a rendelés státuszát 2-re (Aktív)
                order.Status = 2;
                order.VerificationToken = null;

                // 3. Frissítsd az Autó státuszát is 2-re (Kifoglalt/Nem elérhető)
                if (order.Vehicle != null)
                {
                    order.Vehicle.Status = 2;
                }

                // 4. Mentsd el mindkét változást az adatbázisba egyszerre
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Rendelés sikeresen aktiválva és az autó lefoglalva!" });
            });
            app.MapPost("/api/orders/{id}/finish", async (int id, ExoticDbContext db) =>
            {
                var order = await db.Orders
                    .Include(o => o.Vehicle)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null) return Results.NotFound("Order not found.");

                // 1. Set Order to Completed
                order.Status = 3;

                // 2. Make the Car Available again
                if (order.Vehicle != null)
                {
                    order.Vehicle.Status = 1;
                }

                await db.SaveChangesAsync();
                return Results.Ok(new { message = "Bérlés sikeresen lezárva, az autó újra elérhető!" });
            });


            //Profil update

            app.MapPut("/api/user/{id}/profile", async (int id, UpdateProfileDto dto, ExoticDbContext db) =>
            {
                var user = await db.Users.FindAsync(id);

                if (user == null)
                {
                    return Results.NotFound(new { message = "User not found." });
                }

                // Update the fields
                user.FullName = dto.FullName;
                user.PhoneNumber = dto.PhoneNumber;
                user.LicenseNumber = dto.LicenseNumber;

                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Profil sikeresen frissítve!" });
            });

            app.Run();
        }
    }
}