using ExoticBackend.Data;
using ExoticBackend.DTOs;
using ExoticBackend.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http; // Added for IFormFile
using System;
using System.IO;                 // Added for MemoryStream
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.Net;            // <-- Added for Email
using System.Net.Mail;       // <-- Added for Email

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
                    VerificationToken = token, // Assign the generated token
                    ProfilePicture = Array.Empty<byte>()
                };

                db.Users.Add(user);
                await db.SaveChangesAsync();

                // 5. SEND THE EMAIL
                try
                {
                    string verificationLink = $"http://localhost:3000/verify-email?token={token}";

                    var smtpClient = new SmtpClient("smtp.gmail.com")
                    {
                        Port = 587,
                        Credentials = new NetworkCredential("bravery.cs@gmail.com", "zrau wgzd vgin kljz"),
                        EnableSsl = true,
                    };

                    string emailBody = $@"
                    <div style='font-family: ""Segoe UI"", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #252525; border: 1px solid #333333; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3);'>
                        <div style='background-color: #0d0d0d; padding: 30px 20px; text-align: center; border-bottom: 2px solid #DAA520;'>
                            <h1 style='color: #DAA520; margin: 0; font-size: 26px; letter-spacing: 4px;'>EXOTIC RENTALS</h1>
                        </div>
                        <div style='padding: 40px 30px; color: #bbbbbb;'>
                            <h2 style='color: #DAA520; margin-top: 0;'>Üdvözlünk a klubban, {user.Username}!</h2>
                            <p style='font-size: 16px; line-height: 1.6;'>Köszönjük, hogy csatlakoztál az Exotic Rentals közösségéhez. Már csak egyetlen lépés választ el attól, hogy hozzáférj exkluzív járműparkunkhoz.</p>
                            <p style='font-size: 16px; line-height: 1.6;'>A <strong>2-es szintű jogosultság (bérlés)</strong> aktiválásához kérjük, erősítsd meg az e-mail címedet az alábbi gombra kattintva:</p>
                            
                            <div style='text-align: center; margin: 40px 0;'>
                                <a href='{verificationLink}' style='background-color: #DAA520; color: #0d0d0d; padding: 16px 35px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px; display: inline-block;'>E-mail cím megerősítése</a>
                            </div>
                            
                            <p style='font-size: 14px; color: #777777; border-top: 1px solid #444444; padding-top: 20px;'>Ha a fenti gomb nem működik, másold be a következő hivatkozást a böngésződbe:<br>
                            <a href='{verificationLink}' style='color: #DAA520; word-break: break-all; text-decoration: none;'>{verificationLink}</a></p>
                        </div>
                        <div style='background-color: #0d0d0d; padding: 20px; text-align: center; color: #777777; font-size: 12px; border-top: 1px solid #333333;'>
                            &copy; {DateTime.Now.Year} Exotic Rentals. Minden jog fenntartva.
                        </div>
                    </div>";

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("bravery.cs@gmail.com", "Exotic Rentals"),
                        Subject = "Exotic Rentals - Erősítsd meg a fiókodat!",
                        Body = emailBody,
                        IsBodyHtml = true,
                    };

                    mailMessage.To.Add(user.Email);
                    smtpClient.Send(mailMessage);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send email: {ex.Message}");
                }

                return Results.Ok(new
                {
                    message = "Sikeres regisztráció! Kérjük, ellenőrizd az e-mailedet a fiók megerősítéséhez.",
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    clearance = user.Clearance,
                    is_verified = user.Is_Verified,
                    isDriver = user.isDriver
                });
            });


            app.MapPost("/api/auth/verify", async (string token, ExoticDbContext db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.VerificationToken == token);

                if (user == null)
                {
                    return Results.BadRequest(new { message = "Invalid or expired verification token." });
                }

                // 1. E-mail megerősítése
                user.Is_Verified = 1;
                user.VerificationToken = null;

                // 2. SZINTLÉPÉS ELLENŐRZÉSE: Ha már van jogosítványa, azonnal kapja meg a 2-es szintet!
                if (!string.IsNullOrEmpty(user.LicenseNumber))
                {
                    user.Clearance = 2;
                }

                await db.SaveChangesAsync();

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

                return Results.Ok(new
                {
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    clearance = user.Clearance,
                    is_verified = user.Is_Verified,
                    isDriver = user.isDriver
                });
            });

            app.MapGet("/api/user/{id}/profile", async (int id, ExoticDbContext db) =>
            {
                var user = await db.Users.FindAsync(id);

                if (user == null)
                {
                    return Results.NotFound(new { message = "User not found." });
                }

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
                    is_verified = user.Is_Verified,
                    isDriver = user.isDriver
                });
            });

            app.MapGet("/api/user/{id}/orders", async (int id, ExoticDbContext db) =>
            {
                var orders = await db.Orders
                    .Include(o => o.Vehicle)
                        .ThenInclude(v => v.VehicleImages)
                    .Where(o => o.UserId == id)
                    .OrderByDescending(o => o.CreatedAt)
                    .Select(o => new OrderHistoryDto
                    {
                        Id = o.Id,
                        Brand = o.Vehicle.Brand,
                        Model = o.Vehicle.Model,
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

                        string emailBody = $@"
                        <div style='font-family: ""Segoe UI"", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #252525; border: 1px solid #333333; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3);'>
                            <div style='background-color: #0d0d0d; padding: 30px 20px; text-align: center; border-bottom: 2px solid #DAA520;'>
                                <h1 style='color: #DAA520; margin: 0; font-size: 26px; letter-spacing: 4px;'>EXOTIC RENTALS</h1>
                            </div>
                            <div style='padding: 40px 30px; color: #bbbbbb;'>
                                <h2 style='color: #DAA520; margin-top: 0;'>Foglalásod megerősítésre vár!</h2>
                                <p style='font-size: 16px; line-height: 1.6;'>Kedves {user.Username}!</p>
                                <p style='font-size: 16px; line-height: 1.6;'>Rendszerünk rögzítette a bérlési szándékodat. A kiválasztott autó lefoglalásához és a bérlés véglegesítéséhez kérjük, erősítsd meg a tranzakciót:</p>
                                
                                <div style='background-color: #1a1a1a; padding: 25px; border-left: 4px solid #DAA520; margin: 30px 0; border-radius: 4px;'>
                                    <h3 style='margin-top: 0; color: #ffffff;'>Foglalás részletei:</h3>
                                    <ul style='list-style-type: none; padding: 0; margin: 0; font-size: 15px;'>
                                        <li style='margin-bottom: 10px;'><strong>Kezdés:</strong> {dto.StartDate.ToString("yyyy. MM. dd.")}</li>
                                        <li style='margin-bottom: 10px;'><strong>Visszaadás:</strong> {dto.EndDate.ToString("yyyy. MM. dd.")}</li>
                                        <li><strong>Végösszeg:</strong> <span style='color: #DAA520; font-weight: bold; font-size: 18px;'>{dto.TotalPrice.ToString("N0")} Ft</span></li>
                                    </ul>
                                </div>
                                
                                <div style='text-align: center; margin: 40px 0;'>
                                    <a href='{verificationLink}' style='background-color: #DAA520; color: #0d0d0d; padding: 16px 35px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px; display: inline-block;'>Foglalás Véglegesítése</a>
                                </div>
                            </div>
                            <div style='background-color: #0d0d0d; padding: 20px; text-align: center; color: #777777; font-size: 12px; border-top: 1px solid #333333;'>
                                &copy; {DateTime.Now.Year} Exotic Rentals. Minden jog fenntartva.
                            </div>
                        </div>";

                        var mailMessage = new MailMessage
                        {
                            From = new MailAddress("bravery.cs@gmail.com", "Exotic Rentals"),
                            Subject = "Exotic Rentals - Autóbérlés megerősítése",
                            Body = emailBody,
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
                var order = await db.Orders
                    .Include(o => o.Vehicle)
                    .FirstOrDefaultAsync(o => o.VerificationToken == token);

                if (order == null)
                {
                    return Results.BadRequest(new { message = "Érvénytelen vagy lejárt megerősítő link." });
                }

                order.Status = 2;
                order.VerificationToken = null;

                if (order.Vehicle != null)
                {
                    order.Vehicle.Status = 2;
                }

                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Rendelés sikeresen aktiválva és az autó lefoglalva!" });
            });


            app.MapGet("/api/drivers", async (ExoticDbContext db) =>
            {
                var drivers = await db.Users
                    .Where(u => u.isDriver == true)
                    .Select(u => new
                    {
                        id = u.Id,
                        name = string.IsNullOrEmpty(u.FullName) ? u.Username : u.FullName,
                        email = u.Email,
                        rating = 4.8,
                        experience = "Tapasztalt"
                    })
                    .ToListAsync();

                return Results.Ok(drivers);
            });



            app.MapPost("/api/orders/taxi", async (CreateTaxiOrderDto dto, ExoticDbContext db) =>
            {
                var user = await db.Users.FindAsync(dto.UserId);
                var driver = await db.Users.FindAsync(dto.DriverId);

                if (user == null || driver == null)
                    return Results.BadRequest("Felhasználó vagy sofőr nem található.");

                var newTaxiOrder = new TaxiOrder
                {
                    UserId = dto.UserId,
                    VehicleId = dto.VehicleId,
                    DriverId = dto.DriverId,
                    PickupLocation = dto.PickupLocation,
                    DropoffLocation = dto.DropoffLocation,
                    PickupDateTime = dto.PickupDateTime,
                    TotalPrice = dto.TotalPrice,
                    Status = 1,
                    CreatedAt = DateTime.UtcNow
                };

                db.TaxiOrders.Add(newTaxiOrder);
                await db.SaveChangesAsync();

                try
                {
                    var smtpClient = new SmtpClient("smtp.gmail.com")
                    {
                        Port = 587,
                        Credentials = new NetworkCredential("bravery.cs@gmail.com", "zrau wgzd vgin kljz"),
                        EnableSsl = true,
                    };

                    string driverName = driver.FullName ?? driver.Username;
                    string customerName = user.FullName ?? user.Username;

                    string emailBody = $@"
                    <div style='font-family: ""Segoe UI"", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #252525; border: 1px solid #333333; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3);'>
                        <div style='background-color: #0d0d0d; padding: 25px; text-align: center; border-bottom: 2px solid #DAA520;'>
                            <h1 style='color: #DAA520; margin: 0; font-size: 24px; letter-spacing: 2px;'>SOFŐR PULT - ÚJ FUVARIGÉNY</h1>
                        </div>
                        <div style='padding: 40px 30px; color: #bbbbbb;'>
                            <h2 style='color: #DAA520; margin-top: 0;'>Szia {driverName}!</h2>
                            <p style='font-size: 16px; line-height: 1.6;'>Egy utas téged választott! Egy új fuvarigény vár jóváhagyásra a rendszerben.</p>
                            
                            <div style='background-color: #1a1a1a; border-radius: 6px; padding: 20px; margin: 30px 0;'>
                                <table style='width: 100%; border-collapse: collapse;'>
                                    <tr>
                                        <td style='padding: 12px 0; border-bottom: 1px solid #333; width: 35%; color: #888;'><strong>Utas neve:</strong></td>
                                        <td style='padding: 12px 0; border-bottom: 1px solid #333; color: #fff;'>{customerName}</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 12px 0; border-bottom: 1px solid #333; color: #888;'><strong>Telefonszám:</strong></td>
                                        <td style='padding: 12px 0; border-bottom: 1px solid #333; color: #fff;'>{user.PhoneNumber ?? "Nincs megadva"}</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 12px 0; border-bottom: 1px solid #333; color: #888;'><strong>Felvétel helye:</strong></td>
                                        <td style='padding: 12px 0; border-bottom: 1px solid #333; color: #fff;'>{dto.PickupLocation}</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 12px 0; border-bottom: 1px solid #333; color: #888;'><strong>Célállomás:</strong></td>
                                        <td style='padding: 12px 0; border-bottom: 1px solid #333; color: #fff;'>{dto.DropoffLocation}</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 12px 0; border-bottom: 1px solid #333; color: #888;'><strong>Időpont:</strong></td>
                                        <td style='padding: 12px 0; border-bottom: 1px solid #333; color: #fff;'><strong>{dto.PickupDateTime.ToString("yyyy. MM. dd. HH:mm")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 15px 0 0 0; color: #888;'><strong>Várható tarifa:</strong></td>
                                        <td style='padding: 15px 0 0 0; color: #DAA520; font-weight: bold; font-size: 18px;'>{dto.TotalPrice.ToString("N0")} Ft</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style='font-size: 16px; line-height: 1.6; text-align: center;'>Kérjük, lépj be a sofőr felületre a fuvar elfogadásához vagy elutasításához!</p>
                            
                            <div style='text-align: center; margin: 35px 0;'>
                                <a href='http://localhost:3000/Profile' style='background-color: transparent; color: #DAA520; padding: 14px 28px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px; display: inline-block; border: 2px solid #DAA520;'>Ugrás a Sofőr Pultra</a>
                            </div>
                        </div>
                        <div style='background-color: #0d0d0d; padding: 20px; text-align: center; color: #777777; font-size: 12px; border-top: 1px solid #333333;'>
                            &copy; {DateTime.Now.Year} Exotic Rentals Taxi.
                        </div>
                    </div>";

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("bravery.cs@gmail.com", "Exotic Rentals Taxi"),
                        Subject = "ÚJ FUVAR - Jóváhagyás szükséges",
                        Body = emailBody,
                        IsBodyHtml = true,
                    };

                    mailMessage.To.Add(driver.Email);
                    smtpClient.Send(mailMessage);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Driver email failed: {ex.Message}");
                }

                return Results.Ok(new { message = "Foglalás elküldve a sofőrnek!" });
            });


            app.MapPost("/api/orders/taxi/{id}/accept", async (int id, ExoticDbContext db) =>
            {
                var order = await db.TaxiOrders
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (order == null) return Results.NotFound("A fuvar nem található.");
                if (order.Status != 1) return Results.BadRequest("Ezt a fuvart már elfogadták vagy törölték.");

                order.Status = 2;
                await db.SaveChangesAsync();

                if (order.User != null)
                {
                    try
                    {
                        var smtpClient = new SmtpClient("smtp.gmail.com")
                        {
                            Port = 587,
                            Credentials = new NetworkCredential("bravery.cs@gmail.com", "zrau wgzd vgin kljz"),
                            EnableSsl = true,
                        };

                        string customerName = order.User.FullName ?? order.User.Username;

                        string emailBody = $@"
                        <div style='font-family: ""Segoe UI"", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #252525; border: 1px solid #333333; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3);'>
                            <div style='background-color: #0d0d0d; padding: 30px 20px; text-align: center; border-bottom: 2px solid #DAA520;'>
                                <h1 style='color: #DAA520; margin: 0; font-size: 24px; letter-spacing: 2px;'>FUVAR MEGERŐSÍTVE!</h1>
                            </div>
                            <div style='padding: 40px 30px; color: #bbbbbb;'>
                                <h2 style='color: #DAA520; margin-top: 0;'>Kedves {customerName}!</h2>
                                <p style='font-size: 16px; line-height: 1.6;'>Jó hírünk van! A sofőröd sikeresen elfogadta a fuvarkérelmedet, és a megadott időpontban várni fog rád.</p>
                                
                                <div style='background-color: #1a1a1a; padding: 25px; border-left: 4px solid #DAA520; margin: 30px 0; border-radius: 4px;'>
                                    <h3 style='margin-top: 0; color: #ffffff;'>Utazásod részletei:</h3>
                                    <ul style='list-style-type: none; padding: 0; margin: 0; font-size: 15px;'>
                                        <li style='margin-bottom: 12px;'><strong style='color:#888;'>Felvétel:</strong> <span style='color:#fff;'>{order.PickupLocation}</span></li>
                                        <li style='margin-bottom: 12px;'><strong style='color:#888;'>Cél:</strong> <span style='color:#fff;'>{order.DropoffLocation}</span></li>
                                        <li style='margin-bottom: 12px;'><strong style='color:#888;'>Időpont:</strong> <span style='color:#fff;'>{order.PickupDateTime.ToString("yyyy. MM. dd. HH:mm")}</span></li>
                                        <li><strong style='color:#888;'>Várható végösszeg:</strong> <span style='color: #DAA520; font-weight: bold;'>{order.TotalPrice.ToString("N0")} Ft</span></li>
                                    </ul>
                                </div>
                                
                                <p style='font-size: 16px; line-height: 1.6;'>Kérjük, légy a megadott helyszínen az indulás időpontjában. Jó utat kíván az Exotic Rentals csapata!</p>
                            </div>
                            <div style='background-color: #0d0d0d; padding: 20px; text-align: center; color: #777777; font-size: 12px; border-top: 1px solid #333333;'>
                                &copy; {DateTime.Now.Year} Exotic Rentals Taxi.
                            </div>
                        </div>";

                        var mailMessage = new MailMessage
                        {
                            From = new MailAddress("bravery.cs@gmail.com", "Exotic Rentals Taxi"),
                            Subject = "Exotic Rentals - A sofőröd úton van!",
                            Body = emailBody,
                            IsBodyHtml = true,
                        };

                        mailMessage.To.Add(order.User.Email);
                        smtpClient.Send(mailMessage);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"User email failed: {ex.Message}");
                    }
                }

                return Results.Ok(new { message = "Fuvar sikeresen elfogadva, utas értesítve." });
            });

            app.MapGet("/api/driver/{driverId}/taxi-orders", async (int driverId, ExoticDbContext db) =>
            {
                var orders = await db.TaxiOrders
                    .Where(t => t.DriverId == driverId && (t.Status == 1 || t.Status == 2 || t.Status == 3))
                    .Select(t => new {
                        id = t.Id,
                        customerName = db.Users.Where(u => u.Id == t.UserId).Select(u => u.FullName != null && u.FullName != "" ? u.FullName : u.Username).FirstOrDefault(),
                        customerPhone = db.Users.Where(u => u.Id == t.UserId).Select(u => u.PhoneNumber).FirstOrDefault(),
                        pickupLocation = t.PickupLocation,
                        dropoffLocation = t.DropoffLocation,
                        pickupDateTime = t.PickupDateTime,
                        totalPrice = t.TotalPrice,
                        status = t.Status
                    })
                    .ToListAsync();

                return Results.Ok(orders);
            });

            app.MapPost("/api/orders/taxi/{id}/finish", async (int id, ExoticDbContext db) =>
            {
                var order = await db.TaxiOrders.FindAsync(id);
                if (order == null) return Results.NotFound("A fuvar nem található.");

                order.Status = 3; // 3 = Befejezett
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Fuvar sikeresen befejezve!" });
            });

            app.MapGet("/api/user/{userId}/taxi-orders", async (int userId, ExoticDbContext db) =>
            {
                var taxiOrders = await db.TaxiOrders
                    .Where(t => t.UserId == userId)
                    .OrderByDescending(t => t.PickupDateTime)
                    .Select(t => new {
                        t.Id,
                        t.PickupLocation,
                        t.DropoffLocation,
                        t.PickupDateTime,
                        t.TotalPrice,
                        t.Status
                    })
                    .ToListAsync();

                return Results.Ok(taxiOrders);
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

            //Profile picture upload

            app.MapPost("/api/users/{id}/upload-pfp", async (int id, IFormFile file, ExoticDbContext db) =>
            {
                var user = await db.Users.FindAsync(id);
                if (user == null) return Results.NotFound("User not found.");

                if (file == null || file.Length == 0) return Results.BadRequest("No file uploaded.");

                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);

                // Store the raw bytes in the DB
                user.ProfilePicture = ms.ToArray();

                await db.SaveChangesAsync();
                return Results.Ok(new { message = "Kép elmentve!" });
            }).DisableAntiforgery();

            app.MapGet("/api/users/{id}/profile", async (int id, ExoticDbContext db) =>
            {
                var user = await db.Users
                    .Where(u => u.Id == id)
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        Username = u.Username,
                        Email = u.Email,
                        FullName = u.FullName,
                        // Convert the BLOB (byte[]) to a Base64 string for React
                        ProfilePicture = u.ProfilePicture != null
                            ? Convert.ToBase64String(u.ProfilePicture)
                            : null
                    })
                    .FirstOrDefaultAsync();

                return user is not null ? Results.Ok(user) : Results.NotFound();
            });

            app.MapPost("/api/user/{id}/verify-license", async (int id, UploadLicenseDto dto, ExoticDbContext db) =>
            {
                var user = await db.Users.FindAsync(id);
                if (user == null) return Results.NotFound(new { message = "Felhasználó nem található." });

                if (string.IsNullOrWhiteSpace(dto.LicenseNumber))
                    return Results.BadRequest(new { message = "A jogosítvány száma nem lehet üres!" });

                user.LicenseNumber = dto.LicenseNumber;


                if (user.Is_Verified == 1)
                {
                    user.Clearance = 2;
                }

                await db.SaveChangesAsync();

                return Results.Ok(new
                {
                    message = user.Clearance == 2 ? "Sikeres hitelesítés! Most már bérelhetsz." : "Jogosítvány rögzítve, de kérjük erősítsd meg az e-mail címedet is!",
                    clearance = user.Clearance,
                    isVerified = user.Is_Verified
                });
            });

            //Password Reset

            // --- ELFELEJTETT JELSZÓ KÉRÉSE ---
            app.MapPost("/api/auth/forgot-password", async (ForgotPasswordDto dto, ExoticDbContext db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

                if (user == null)
                {
                    return Results.Ok(new { message = "Ha a megadott e-mail cím létezik a rendszerünkben, elküldtük a visszaállítási linket." });
                }

                string token = Guid.NewGuid().ToString();
                user.ResetPasswordToken = token;
                user.ResetPasswordExpiry = DateTime.UtcNow.AddHours(1);
                await db.SaveChangesAsync();

                try
                {
                    string resetLink = $"http://localhost:3000/reset-password?token={token}";

                    var smtpClient = new SmtpClient("smtp.gmail.com")
                    {
                        Port = 587,
                        Credentials = new NetworkCredential("bravery.cs@gmail.com", "zrau wgzd vgin kljz"),
                        EnableSsl = true,
                    };

                    string emailBody = $@"
                    <div style='font-family: ""Segoe UI"", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #252525; border: 1px solid #333333; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3);'>
                        <div style='background-color: #0d0d0d; padding: 30px 20px; text-align: center; border-bottom: 2px solid #DAA520;'>
                            <h1 style='color: #DAA520; margin: 0; font-size: 26px; letter-spacing: 4px;'>EXOTIC RENTALS</h1>
                        </div>
                        <div style='padding: 40px 30px; color: #bbbbbb;'>
                            <h2 style='color: #DAA520; margin-top: 0;'>Jelszó visszaállítása</h2>
                            <p style='font-size: 16px; line-height: 1.6;'>Kedves {user.Username}!</p>
                            <p style='font-size: 16px; line-height: 1.6;'>Kérést kaptunk a fiókodhoz tartozó jelszó visszaállítására. Ha te indítottad a kérést, kattints az alábbi gombra az új jelszó megadásához. <br><small style='color: #888;'>(A link biztonsági okokból 1 órán belül lejár!)</small></p>
                            
                            <div style='text-align: center; margin: 40px 0;'>
                                <a href='{resetLink}' style='background-color: #DAA520; color: #0d0d0d; padding: 16px 35px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px; display: inline-block;'>Új jelszó beállítása</a>
                            </div>
                            
                            <p style='font-size: 14px; color: #777777; border-top: 1px solid #444444; padding-top: 20px;'>Ha nem te kérted a jelszó visszaállítását, kérjük, hagyd figyelmen kívül ezt az e-mailt. A fiókod továbbra is biztonságban van.</p>
                        </div>
                        <div style='background-color: #0d0d0d; padding: 20px; text-align: center; color: #777777; font-size: 12px; border-top: 1px solid #333333;'>
                            &copy; {DateTime.Now.Year} Exotic Rentals. Minden jog fenntartva.
                        </div>
                    </div>";

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("bravery.cs@gmail.com", "Exotic Rentals"),
                        Subject = "Exotic Rentals - Jelszó visszaállítása",
                        Body = emailBody,
                        IsBodyHtml = true,
                    };

                    mailMessage.To.Add(user.Email);
                    smtpClient.Send(mailMessage);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send reset email: {ex.Message}");
                }

                return Results.Ok(new { message = "Ha a megadott e-mail cím létezik a rendszerünkben, elküldtük a visszaállítási linket." });
            });


            // --- ÚJ JELSZÓ BEÁLLÍTÁSA ---
            app.MapPost("/api/auth/reset-password", async (ResetPasswordDto dto, ExoticDbContext db) =>
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.ResetPasswordToken == dto.Token);

                if (user == null || user.ResetPasswordExpiry == null || user.ResetPasswordExpiry < DateTime.UtcNow)
                {
                    return Results.BadRequest(new { message = "A visszaállító link érvénytelen vagy már lejárt." });
                }

                string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
                user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword, salt);

                user.ResetPasswordToken = null;
                user.ResetPasswordExpiry = null;

                await db.SaveChangesAsync();

                return Results.Ok(new { message = "A jelszavad sikeresen megváltozott! Most már bejelentkezhetsz." });
            });

            // --- BEJELENTKEZETT FELHASZNÁLÓ JELSZÓMÓDOSÍTÁSA ---
            app.MapPost("/api/user/{id}/change-password", async (int id, ChangePasswordDto dto, ExoticDbContext db) =>
            {
                var user = await db.Users.FindAsync(id);
                if (user == null)
                {
                    return Results.NotFound(new { message = "Felhasználó nem található." });
                }

                if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password))
                {
                    return Results.BadRequest(new { message = "A megadott jelenlegi jelszó helytelen!" });
                }

                string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
                user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword, salt);

                await db.SaveChangesAsync();

                return Results.Ok(new { message = "A jelszavad sikeresen frissítve lett!" });
            });

            app.Run();
        }
    }
}
