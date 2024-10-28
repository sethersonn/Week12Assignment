/*
Coding Steps:
1. Create a CRD application (CRUD without update) using json-server or another API
2. Use fetch and async/await to interact with the API
3. Use a form to create/post new entities
4. Build a way for users to delete entities
5. Include a way to get entities from the API and display them
6. You do NOT need update, but you can add it if you'd like
7. Use Bootstrap and/or CSS to style your project
*/

/*List of States:
const listOfStates = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY"
]
*/


const form = document.getElementById("stateForm");
const parksContainer = document.getElementById("parks");
const campgroundsContainer = document.getElementById("campgrounds");
const galleryContainer = document.getElementById("gallery");

//Event listener for form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    //ensure state code is uppercase
    const state = document.getElementById("statename").value.trim().toUpperCase();
    await fetchNationalParks(state);
});

//fetch national parks based on the state code
async function fetchNationalParks(state) {
    try {
        //Clear previous gallery images before fetching new data
        galleryContainer.innerHTML = '';
        const response = await fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=${api_key}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        //display the parks
        displayParks(data.data);
        //fetch campgrounds after parks
        await fetchCampgrounds(state);
    } catch (error) {
        console.error("Error fetching parks:", error);
        parksContainer.innerHTML = '<p class="text-danger">Failed to fetch parks. Please try again later.</p>';
    }
}


// Display parks in the UI
function displayParks(parks) {
    parksContainer.innerHTML = ''; // Clear previous results
    if (parks.length === 0) {
        parksContainer.innerHTML = '<p>No parks found for this state.</p>';
        return;
    }

    //create html for the parks
    parks.forEach(park => {
        const parkDiv = document.createElement('div');
        parkDiv.className = 'park-item mb-3 border border-success p-3';
        parkDiv.innerHTML = `
            <h4>${park.fullName}</h4>
            <p>${park.description}</p>
            <button class="btn btn-danger" onclick="deletePark('${park.id}')">Delete</button>
        `;
        parksContainer.appendChild(parkDiv);

        // Add park image to gallery if available
        if (park.images.length > 0) {
            const img = document.createElement('img');
            img.src = park.images[0].url;
            img.alt = park.images[0].altText;
            img.className = 'img-fluid';
            galleryContainer.appendChild(img);
        }
    });
}

// Fetch Campgrounds based on state code
async function fetchCampgrounds(state) {
    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/campgrounds?stateCode=${state}&api_key=${api_key}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayCampgrounds(data.data);
    } catch (error) {
        console.error('Error fetching campgrounds:', error);
        campgroundsContainer.innerHTML = '<p class="text-danger">Failed to fetch campgrounds. Please try again later.</p>';
    }
}

// Display campgrounds
function displayCampgrounds(campgrounds) {
    campgroundsContainer.innerHTML = ''; // Clear previous results
    if (campgrounds.length === 0) {
        campgroundsContainer.innerHTML = '<p>No campgrounds found for this state.</p>';
        return;
    }

    //create the html for the campgrounds
    campgrounds.forEach(campground => {
        const campgroundDiv = document.createElement('div');
        campgroundDiv.className = 'campground-item mb-3 border border-success p-3';
        campgroundDiv.innerHTML = `
            <h4>${campground.name}</h4>
            <p>${campground.description}</p>
            <button class="btn btn-danger" onclick="deleteCampground('${campground.id}')">Delete</button>

        `;
        campgroundsContainer.appendChild(campgroundDiv);
    });
}

//Delete Button Functions
function deletePark(parkId) {
    const parkItems = document.querySelectorAll('.park-item');
    parkItems.forEach(item => {
        if (item.querySelector('button').onclick.toString().includes(parkId)) {
            item.remove();
        }
    });
}

function deleteCampground(campgroundId) {
    const campgroundItems = document.querySelectorAll('.campground-item');
    campgroundItems.forEach(item => {
        if (item.querySelector('button').onclick.toString().includes(campgroundId)) {
            item.remove();
        }
    });
}

