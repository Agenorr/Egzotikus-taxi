// Várakozás, amíg a DOM teljesen betöltődik
document.addEventListener("DOMContentLoaded", () => { 
    // A gombok kiválasztása, amelyek a különböző autó típusokat jelölik
    const sedanButton = document.querySelectorAll(".car-option button")[0];
    const suvButton = document.querySelectorAll(".car-option button")[1];
    const supercarButton = document.querySelectorAll(".car-option button")[2];

    // Az autók adatstruktúrája, különböző típusokra bontva
    const cars = {
        sedan: {
            list: ["2025 Acura Integra Type S", "2024 Audi S3", "2025 BMW 2-Series"], // Sedan típusú autók listája
            images: {
                "2025 Acura Integra Type S": "kepek/acuras.avif", // A képek elérési útjai
                "2024 Audi S3": "kepek/audis3.avif",
                "2025 BMW 2-Series": "kepek/bmws2.jpg",
            }
        },
        suv: {
            list: ["Ferrari Purosangue", "Bentley Bentayga", "Lamborghini Urus"], // SUV típusú autók listája
            images: {
                "Ferrari Purosangue": "kepek/ferraripuro.avif",
                "Bentley Bentayga": "kepek/bentlyb.avif",
                "Lamborghini Urus": "kepek/laborginiUrus.avif",
            }
        },
        supercar: {
            list: ["Maserati MC20", "Porsche 911 Turbo S", "McLaren 720S"], // Szuperautók listája
            images: {
                "Maserati MC20": "kepek/maseratimc20.webp",
                "Porsche 911 Turbo S": "kepek/porsche911.webp",
                "McLaren 720S": "kepek/Mclaren720S.webp",
            }
        }
    };

    // A car list container létrehozása
    const formContainer = document.querySelector(".form-container");
    const carListContainer = document.createElement("div");
    carListContainer.id = "car-list"; // Id-t adunk a konténernek
    carListContainer.style.marginTop = "20px"; // Kis margó a lista felett
    formContainer.appendChild(carListContainer); // A form-containerhez adja hozzá

    // Funkció az autók listájának megjelenítésére a kiválasztott típus alapján
    const displayCars = (type) => {
        const carType = cars[type]; // Kiválasztott autó típus adatainak lekérése
        carListContainer.innerHTML = ` 
            <h3>Elérhető ${type.charAt(0).toUpperCase() + type.slice(1)}-ek:</h3> 
            <ul>
                ${carType.list.map(car => `<li class="car-item" data-type="${type}" data-car="${car}">${car}</li>`).join("")} 
            </ul>
            <div id="car-image" style="margin-top: 20px; text-align: center;"></div> 
        `;

        // Kattintás események hozzáadása az autó listához
        const carItems = document.querySelectorAll(".car-item");
        carItems.forEach(item => {
            item.addEventListener("click", (e) => {
                const selectedCar = e.target.dataset.car; // Az autó, amit kiválasztottak
                const carType = e.target.dataset.type; // Az autó típusának meghatározása
                const imageSrc = cars[carType].images[selectedCar]; // A kiválasztott autó képének elérési útja
                const carImageContainer = document.getElementById("car-image"); // Az a konténer, ahová a képet beillesztjük
                carImageContainer.innerHTML = `<h4>${selectedCar}</h4><img src="${imageSrc}" alt="${selectedCar}" style="max-width: 100%; height: auto; border-radius: 8px;">`; 
                // Az autó képe és neve megjelenik
            });
        });
    };

    // Eseménykezelők hozzáadása a különböző gombokhoz
    sedanButton.addEventListener("click", () => displayCars("sedan")); // Sedan gombra kattintásra megjeleníti a sedan autókat
    suvButton.addEventListener("click", () => displayCars("suv")); // SUV gombra kattintásra megjeleníti az SUV-kat
    supercarButton.addEventListener("click", () => displayCars("supercar")); // Szuperautó gombra kattintásra megjeleníti a szuperautókat
});
