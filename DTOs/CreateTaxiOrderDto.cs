public class CreateTaxiOrderDto
{
    public int UserId { get; set; }
    public int VehicleId { get; set; }
    public int DriverId { get; set; }
    public string PickupLocation { get; set; } = string.Empty;
    public string DropoffLocation { get; set; } = string.Empty;
    public DateTime PickupDateTime { get; set; }
    public decimal TotalPrice { get; set; }
}