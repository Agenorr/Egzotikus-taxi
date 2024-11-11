function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "0px" || sidebar.style.width === "") {
        sidebar.style.width = "20%";
    } else {
        sidebar.style.width = "0";
    }
}

document.getElementById('rentalDropdown').addEventListener('click', function (event) {
    event.preventDefault();
    let dropdownElement = document.getElementById('rentalDropdown');
    let dropdown = new bootstrap.Dropdown(dropdownElement);
    dropdown.toggle();
});
