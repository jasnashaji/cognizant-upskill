// Event data
const events = [
    {
        id: 1,
        name: "Community Picnic",
        date: "2023-06-15",
        description: "Join us for a fun-filled day of food, games, and community bonding at the city park.",
        category: "social",
        location: "Central Park",
        seats: 50,
        fee: 0
    },
    {
        id: 2,
        name: "Gardening Workshop",
        date: "2023-06-20",
        description: "Learn urban gardening techniques from our local experts. Perfect for beginners!",
        category: "workshop",
        location: "Community Center",
        seats: 20,
        fee: 15
    },
    {
        id: 3,
        name: "Summer Concert Series",
        date: "2023-06-25",
        description: "Enjoy an evening of live music featuring local bands and artists.",
        category: "concert",
        location: "Town Square",
        seats: 100,
        fee: 10
    },
    {
        id: 4,
        name: "Charity 5K Run",
        date: "2023-07-08",
        description: "Run for a cause! All proceeds go to local education initiatives.",
        category: "sports",
        location: "Riverside Trail",
        seats: 200,
        fee: 25
    },
    {
        id: 5,
        name: "Art Exhibition",
        date: "2023-07-15",
        description: "View and purchase artwork from talented local artists.",
        category: "exhibition",
        location: "Art Gallery",
        seats: 40,
        fee: 5
    }
];

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Load and display events
function loadEvents() {
    const eventList = document.getElementById('eventList');
    if (!eventList) return;

    eventList.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];

    events.forEach(event => {
        if (event.date >= today && event.seats > 0) {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <h3>${event.name}</h3>
                <p class="date">${formatDate(event.date)} at ${event.location}</p>
                <p class="description">${event.description}</p>
                <p><strong>Seats available:</strong> ${event.seats}</p>
                <p><strong>Fee:</strong> $${event.fee}</p>
                <button class="register-btn" onclick="registerForEvent(${event.id})">Register</button>
            `;
            eventList.appendChild(eventCard);
        }
    });
}

// Geolocation to find nearby events
function findNearbyEvents() {
    const locationInfo = document.getElementById('locationInfo');
    const nearbyEvents = document.getElementById('nearbyEvents');

    if (locationInfo) locationInfo.innerHTML = '<p>Finding your location...</p>';
    if (nearbyEvents) nearbyEvents.innerHTML = '';

    if (!navigator.geolocation) {
        if (locationInfo) locationInfo.innerHTML = '<p class="error">Geolocation is not supported by your browser</p>';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            if (locationInfo) {
                locationInfo.innerHTML = `
                    <p>Your location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}</p>
                    <p>Searching for nearby events...</p>
                `;
            }

            setTimeout(() => {
                const nearby = events.filter(event =>
                    event.category === 'social' || event.category === 'workshop'
                );

                if (nearbyEvents) {
                    if (nearby.length > 0) {
                        nearbyEvents.innerHTML = '<h3>Events Near You</h3>';
                        nearby.forEach(event => {
                            const eventDiv = document.createElement('div');
                            eventDiv.className = 'event-card';
                            eventDiv.innerHTML = `
                                <h4>${event.name}</h4>
                                <p>${formatDate(event.date)} at ${event.location}</p>
                            `;
                            nearbyEvents.appendChild(eventDiv);
                        });
                    } else {
                        nearbyEvents.innerHTML = '<p>No events found near your location. Check our full event list.</p>';
                    }
                }
            }, 1500);
        },
        error => {
            let message = '';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = "Permission denied. Please enable location access.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    message = "Location request timed out. Try again.";
                    break;
                default:
                    message = "An unknown error occurred.";
            }
            if (locationInfo) locationInfo.innerHTML = `<p class="error">${message}</p>`;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// DOMContentLoaded - Page init
document.addEventListener('DOMContentLoaded', function () {
    console.log("Welcome to the Community Portal");
    alert("Welcome to our Community Event Portal!");
    loadSavedPreferences();
    loadEvents();
    setupImageEnlargement(); // Assuming this function exists elsewhere
});

// Utility Functions (already defined in your original code)
function validatePhone(input, silent = false) {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const errorElement = document.getElementById('phoneError');

    if (input.value && !phoneRegex.test(input.value)) {
        if (!silent && errorElement) {
            errorElement.textContent = 'Please enter a valid phone number (e.g., 123-456-7890)';
            input.focus();
        }
        return false;
    } else {
        if (errorElement) errorElement.textContent = '';
        return true;
    }
}

function loadSavedPreferences() {
    const preferredEventType = localStorage.getItem('preferredEventType');
    if (preferredEventType) {
        const select = document.getElementById('eventType');
        if (select) {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === preferredEventType) {
                    select.selectedIndex = i;
                    showEventFee(select);
                    break;
                }
            }
        }
    }
}

function showEventFee(select) {
    const feeElement = document.getElementById('eventFee');
    if (!feeElement) return;

    const selectedOption = select.value;
    const fees = { workshop: 15, concert: 10, sports: 25, exhibition: 5 };
    const fee = fees[selectedOption] || 0;

    feeElement.textContent = fee > 0 ? `Fee: $${fee}` : 'Free event';
}

function clearPreferences() {
    localStorage.removeItem('preferredEventType');
    sessionStorage.clear();
    alert('Your preferences have been cleared.');

    const select = document.getElementById('eventType');
    if (select) select.selectedIndex = 0;

    const feeElement = document.getElementById('eventFee');
    if (feeElement) feeElement.textContent = '';
}

function countChars(textarea) {
    const charCount = document.getElementById('charCount');
    if (charCount) {
        charCount.textContent = `${textarea.value.length}/200 characters`;
    }
}

function validatePhone() {
    const phoneInput = document.getElementById("phone");
    const phoneError = document.getElementById("phoneError");
    const phonePattern = /^\d{10}$/;

    if (!phonePattern.test(phoneInput.value)) {
        phoneError.textContent = "Enter a valid 10-digit number";
    } else {
        phoneError.textContent = "";
    }
}

function displayFee() {
    const select = document.getElementById("eventSelect");
    const feeDisplay = document.getElementById("eventFeeDisplay");

    if (select.value) {
        feeDisplay.textContent = `Selected Event Fee: $${select.value}`;
    } else {
        feeDisplay.textContent = "";
    }
}

function submitFeedback() {
    alert("Thank you for your feedback! Submission confirmed.");
}

function enlargeImage(img) {
    img.classList.toggle("enlarged");
}

function countCharacters() {
    const feedback = document.getElementById("feedback");
    const count = feedback.value.length;
    document.getElementById("charCount").textContent = `Characters: ${count}`;
}
