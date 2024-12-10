document.addEventListener("DOMContentLoaded", () => {
    const carTypeDropdown = document.getElementById("car-type");
    const carListDropdown = document.getElementById("car-model");
    const carImageContainer = document.getElementById("car-image");
    const carDetailsContainer = document.getElementById("car-details");

    const cars = {
        sedan: {
            list: ["2025 Acura Integra Type S", "2024 Audi S3", "2025 BMW 2-Series"],
            images: {
                "2025 Acura Integra Type S": "kepek/acuras.avif",
                "2024 Audi S3": "kepek/audis3.avif",
                "2025 BMW 2-Series": "kepek/bmws2.jpg",
            },
            details: {
                "2025 Acura Integra Type S": ["4 férőhely", "Ár: 600ft/km"],
                "2024 Audi S3": ["4 férőhely", "Ár: 600ft/km"],
                "2025 BMW 2-Series": ["4 férőhely", "Ár: 600ft/km"],
            },
        },
        suv: {
            list: ["Ferrari Purosangue", "Bentley Bentayga", "Lamborghini Urus"],
            images: {
                "Ferrari Purosangue": "kepek/ferraripuro.avif",
                "Bentley Bentayga": "kepek/bentlyb.avif",
                "Lamborghini Urus": "kepek/laborginiUrus.avif",
            },
            details: {
                "Ferrari Purosangue": ["6 férőhely", "Ár: 800ft/km"],
                "Bentley Bentayga": ["6 férőhely", "Ár: 800ft/km"],
                "Lamborghini Urus": ["6 férőhely", "Ár: 800ft/km"],
            },
        },
        supercar: {
            list: ["Maserati MC20", "Porsche 911 Turbo S", "McLaren 720S"],
            images: {
                "Maserati MC20": "kepek/maseratimc20.webp",
                "Porsche 911 Turbo S": "kepek/porsche911.webp",
                "McLaren 720S": "kepek/Mclaren720S.webp",
            },
            details: {
                "Maserati MC20": ["1-3 férőhely", "Ár: 1200ft/km"],
                "Porsche 911 Turbo S": ["1-3 férőhely", "Ár: 1200ft/km"],
                "McLaren 720S": ["1-3 férőhely", "Ár: 1200ft/km"],
            },
        },
    };

    carTypeDropdown.addEventListener("change", () => {
        const selectedType = carTypeDropdown.value;
        carListDropdown.innerHTML = "<option value=''>-- Válasszon autót --</option>";

        if (selectedType) {
            cars[selectedType].list.forEach((car) => {
                const option = document.createElement("option");
                option.value = car;
                option.textContent = car;
                carListDropdown.appendChild(option);
            });

            carListDropdown.disabled = false;
        } else {
            carListDropdown.disabled = true;
        }

        carImageContainer.innerHTML = "";
        carDetailsContainer.innerHTML = "";
    });

    carListDropdown.addEventListener("change", () => {
        const selectedType = carTypeDropdown.value;
        const selectedCar = carListDropdown.value;

        if (selectedCar) {
            const imageSrc = cars[selectedType].images[selectedCar];
            const details = cars[selectedType].details[selectedCar];

            carImageContainer.innerHTML = `<h4>${selectedCar}</h4><img src="${imageSrc}" alt="${selectedCar}" style="max-width: 100%; height: auto; border-radius: 8px;">`;
            carDetailsContainer.innerHTML = `<ul>${details.map(detail => `<li>${detail}</li>`).join("")}</ul>`;
        } else {
            carImageContainer.innerHTML = "";
            carDetailsContainer.innerHTML = "";
        }
    });
});
