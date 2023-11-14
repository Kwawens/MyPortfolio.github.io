const searchInput = document.getElementById("searchInput");
const cardContainer = document.getElementById("cardContainer");
let originalCardData;

function convertToDateFormat(date, type = "/") {
    var months = [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July", 
        "August", 
        "September", 
        "October", 
        "November", 
        "December"
    ];
    var parts = date.split(" ");
    var monthIndex = months.indexOf(parts[0]);
    var day = parts[1].replace(",", "");
    var year = parts[2];
    var convertedDate = `${(monthIndex + 1).toString().padStart(2, '0')}${type}${day.padStart(2, '0')}${type}${year}`;
    return convertedDate;
}

function getDayOfWeekLabel(dateString) {
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var date = new Date(dateString);
    var dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
}

function filterCards(query) {
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
    }

    var lowercaseQuery = query.toLowerCase();
    var filteredData = originalCardData.filter(card => {
        var lowercaseDate = convertToDateFormat(card.date).toLowerCase();
        var lowercaseContent = card.text.join(" ").toLowerCase();
        var dayOfWeekLabel = getDayOfWeekLabel(card.date);
    
        var convertedDateMatch = lowercaseDate.includes(lowercaseQuery);
        var originaldateMatch = card.date.toLowerCase().includes(lowercaseQuery);
        var contentMatch = lowercaseContent.includes(lowercaseQuery);
        var dayOfWeekMatch = dayOfWeekLabel.toLowerCase().includes(lowercaseQuery);
    
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
                <div class="scrollable-card-text">
                    <p class="card-text">- ${card.text.join("<br>- ")}</p>
                </div>
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

        var formatDate = convertToDateFormat(card.date);
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

document.addEventListener('DOMContentLoaded', function () {
    const cardContainer = document.getElementById('cardContainer');
    const cards = cardContainer.getElementsByClassName('card');
  
    let currentCardIndex = 0;
    
    function updateModalContent() {
        var modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = cards[currentCardIndex].innerHTML;
    }
  
    function showCardModal() {
        updateModalContent();
        $('#cardModal').modal('show');
    }
    
    function closeModal() {
        $('#cardModal').modal('hide');
    }

    cardContainer.addEventListener('click', function (e) {
        var clickedCard = e.target.closest('.card');
        if(clickedCard){
            currentCardIndex = Array.from(cards).indexOf(clickedCard);
            showCardModal();
        }
    });
    
    document.getElementById('prevCardBtn').addEventListener('click', function () {
        if(currentCardIndex < cards.length - 1){
            currentCardIndex++;
            updateModalContent();
        }
    });
  
    document.getElementById('nextCardBtn').addEventListener('click', function () {
        if(currentCardIndex > 0){
            currentCardIndex--;
            updateModalContent();
        }
    });

    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
});

fetch('journal.json')
    .then(response => response.json())
    .then(cardData => {
        originalCardData = cardData;
        filterCards("");
        searchInput.addEventListener("input", () => {
            var searchQuery = searchInput.value.trim();
            filterCards(searchQuery);
        });
    })
    .catch(error => {
        console.error("Theres some problem with JSON Data:", error);
    });