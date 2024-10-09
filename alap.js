// Function to toggle the sidebar visibility
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "0px" || sidebar.style.width === "") {
        sidebar.style.width = "20%";
    } else {
        sidebar.style.width = "0";
    }
}

// Event listener to handle the dropdown functionality
document.getElementById('rentalDropdown').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the link from navigating away
    let dropdownElement = document.getElementById('rentalDropdown');
    let dropdown = new bootstrap.Dropdown(dropdownElement);
    dropdown.toggle(); // Toggle the dropdown visibility
});

// szijamija