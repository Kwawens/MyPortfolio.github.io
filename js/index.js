const searchInput = document.getElementById("searchInput");
const cardContainer = document.getElementById("cardContainer");
let originalCardData;

function convertToDateFormat(date, type = "/") {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const parts = date.split(" ");
    const monthIndex = months.indexOf(parts[0]);
    const day = parts[1].replace(",", "");
    const year = parts[2];
    const convertedDate = `${(monthIndex + 1).toString().padStart(2, '0')}${type}${day.padStart(2, '0')}${type}${year}`;
    return convertedDate;
}

function getDayOfWeekLabel(dateString) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    const dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
}

function filterCards(query) {
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
    }

    const lowercaseQuery = query.toLowerCase();
    const filteredData = originalCardData.filter(card => {
        const lowercaseDate = convertToDateFormat(card.date).toLowerCase();
        const lowercaseContent = card.text.join(" ").toLowerCase();
        const dayOfWeekLabel = getDayOfWeekLabel(card.date);
    
        const convertedDateMatch = lowercaseDate.includes(lowercaseQuery);
        const originaldateMatch = card.date.toLowerCase().includes(lowercaseQuery);
        const contentMatch = lowercaseContent.includes(lowercaseQuery);
        const dayOfWeekMatch = dayOfWeekLabel.toLowerCase().includes(lowercaseQuery);
    
        return convertedDateMatch || originaldateMatch || contentMatch || dayOfWeekMatch;
    });

    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    var count = originalCardData.length;
    var journalDatabase = [];
    filteredData.forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "col";
        cardDiv.innerHTML = `
            <div class="card shadow-sm h-100 d-flex flex-column" id="${count}">
            <img class="bd-placeholder-img card-img-top" src="images/dates/${convertToDateFormat(card.date, "-")}.png">
            <div class="card-body cbody">
                <p class="card-text">- ${card.text.join("<br>- ")}</p>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">#${count}</button>
                </div>
                <small class="text-body-secondary">${convertToDateFormat(card.date, "-")} | ${getDayOfWeekLabel(card.date)}</small>
                </div>
            </div>
            </div>
        `;
        cardContainer.appendChild(cardDiv);

        const formatDate = convertToDateFormat(card.date);
        journalDatabase[count] = {
            "count": count,
            "date": card.date,
            "formatDate": formatDate
        };

        count--;
    });

    const journalDropdown = document.getElementById("journalDropdown");
    journalDatabase.forEach(dropdown => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.href = "#" + dropdown.count;
        a.textContent = "#" + dropdown.count + " | " + dropdown.date;
        li.appendChild(a);
        journalDropdown.appendChild(li);
    });
}

fetch('journal.json')
    .then(response => response.json())
    .then(cardData => {
        originalCardData = cardData;
        filterCards("");
        searchInput.addEventListener("input", () => {
            const searchQuery = searchInput.value.trim();
            filterCards(searchQuery);
        });
    })
    .catch(error => {
        console.error("Theres some problem with JSON Data:", error);
    });