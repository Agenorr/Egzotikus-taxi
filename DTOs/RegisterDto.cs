using System.ComponentModel.DataAnnotations;

namespace ExoticBackend.DTOs
{
    public class RegisterDto
    {
        // Data annotations help validate the input before your code even runs
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress] // Ensures the string looks like a real email
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)] // Security best practice: enforce a minimum password length
        public string Password { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;
    }
}