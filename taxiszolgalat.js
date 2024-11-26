document.addEventListener("DOMContentLoaded", () => {
    const sedanButton = document.querySelectorAll(".car-option button")[0];
    const suvButton = document.querySelectorAll(".car-option button")[1];
    const supercarButton = document.querySelectorAll(".car-option button")[2];

    const cars = {
        sedan: {
            list: ["2025 Acura Integra Type S", "2024 Audi S3", "2025 BMW 2-Series"],
            images: {
                "2025 Acura Integra Type S": "kepek/acuras.avif",
                "2024 Audi S3": "kepek/audis3.avif",
                "2025 BMW 2-Series": "kepek/bmws2.jpg",
            }
        },
        suv: {
            list: ["Ferrari Purosangue", "Bentley Bentayga", "Lamborghini Urus"],
            images: {
                "Ferrari Purosangue": "kepek/ferraripuro.avif",
                "Bentley Bentayga": "kepek/bentlyb.avif",
                "Lamborghini Urus": "kepek/laborginiUrus.avif",
            }
        },
        supercar: {
            list: ["Maserati MC20", "Porsche 911 Turbo S", "McLaren 720S"],
            images: {
                "Maserati MC20": "kepek/maseratimc20.webp",
                "Porsche 911 Turbo S": "kepek/porsche911.webp",
                "McLaren 720S": "kepek/Mclaren720S.webp",
            }
        }
    };

    // Container for car list
    const formContainer = document.querySelector(".form-container");
    const carListContainer = document.createElement("div");
    carListContainer.id = "car-list";
    carListContainer.style.marginTop = "20px";
    formContainer.appendChild(carListContainer);

    // Function to display the car list
    const displayCars = (type) => {
        const carType = cars[type];
        carListContainer.innerHTML = `
            <h3>Available ${type.charAt(0).toUpperCase() + type.slice(1)}s:</h3>
            <ul>
                ${carType.list.map(car => `<li class="car-item" data-type="${type}" data-car="${car}">${car}</li>`).join("")}
            </ul>
            <div id="car-image" style="margin-top: 20px; text-align: center;"></div>
        `;

        // Add click events to car items
        const carItems = document.querySelectorAll(".car-item");
        carItems.forEach(item => {
            item.addEventListener("click", (e) => {
                const selectedCar = e.target.dataset.car;
                const carType = e.target.dataset.type;
                const imageSrc = cars[carType].images[selectedCar];
                const carImageContainer = document.getElementById("car-image");
                carImageContainer.innerHTML = `<h4>${selectedCar}</h4><img src="${imageSrc}" alt="${selectedCar}" style="max-width: 100%; height: auto; border-radius: 8px;">`;
            });
        });
    };

    // Attach event listeners
    sedanButton.addEventListener("click", () => displayCars("sedan"));
    suvButton.addEventListener("click", () => displayCars("suv"));
    supercarButton.addEventListener("click", () => displayCars("supercar"));
});
