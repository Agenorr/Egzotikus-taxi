public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    // This is where the BLOB becomes a string for the browser
    public string? ProfilePicture { get; set; }
}