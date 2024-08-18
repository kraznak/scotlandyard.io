const playersCount = 5; // Number of players
let roundCounter = 0; // Tracks the number of rounds

// Object to keep track of transport usage and locations
let transportData = {};
let usedLocations = new Set(); // To track used locations in the current round

document.addEventListener("DOMContentLoaded", () => {
    const playerTableBody = document.querySelector('#playerTable tbody');

    for (let i = 1; i <= playersCount; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Player ${i}</td>
            <td><input type="text" id="locationPlayer${i}" placeholder="Current location"></td>
            <td><input type="number" id="taxiPlayer${i}" value="10" min="0"></td>
            <td><input type="number" id="busPlayer${i}" value="8" min="0"></td>
            <td><input type="number" id="subwayPlayer${i}" value="8" min="0"></td>
        `;
        playerTableBody.appendChild(row);

        // Initialize transportData for each player
        transportData[`Player${i}`] = {
            location: "",
            taxi: 10,
            bus: 8,
            subway: 8
        };
    }
});

function addRound() {
    const historyContainer = document.getElementById('historyContainer');
    const roundNumber = ++roundCounter;

    // Create table for the current round
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Player</th>
                <th>Location</th>
                <th>Taxi</th>
                <th>Bus</th>
                <th>Subway</th>
            </tr>
        </thead>
        <tbody>
            <!-- Round data will be dynamically added here -->
        </tbody>
    `;

    const tbody = table.querySelector('tbody');
    const currentRoundLocations = new Set(); // Track locations used in the current round

    for (let i = 1; i <= playersCount; i++) {
        const playerId = `Player${i}`;
        const location = document.getElementById(`locationPlayer${i}`).value.trim();
        const taxi = parseInt(document.getElementById(`taxiPlayer${i}`).value, 10);
        const bus = parseInt(document.getElementById(`busPlayer${i}`).value, 10);
        const subway = parseInt(document.getElementById(`subwayPlayer${i}`).value, 10);

        if (location === "") {
            alert(`Location cannot be empty for Player ${i}`);
            return;
        }

        if (currentRoundLocations.has(location)) {
            alert(`Location "${location}" is already used by another player in this round.`);
            return;
        }

        // Deduct at least one transport variable
        if (taxi > 0 && bus > 0 && subway > 0 && roundCounter > 1) {
	    if (transportData[playerId].taxi == taxi && transportData[playerId].bus == bus && transportData[playerId].subway == subway)
		{
	            alert(`Player ${i} must use at least one transport option (Taxi, Bus, or Subway) in this round.`);
	            return;
		}
        }

        // Update transportData with current values
        transportData[playerId].location = location;
        transportData[playerId].taxi = taxi;
        transportData[playerId].bus = bus;
        transportData[playerId].subway = subway;

        // Add location to current round locations
        currentRoundLocations.add(location);

        // Reset input fields after recording
        //document.getElementById(`locationPlayer${i}`).value = "";
        //document.getElementById(`taxiPlayer${i}`).value = 10;
        //document.getElementById(`busPlayer${i}`).value = 8;
        //document.getElementById(`subwayPlayer${i}`).value = 8;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Player ${i}</td>
            <td>${location}</td>
            <td>${transportData[playerId].taxi}</td>
            <td>${transportData[playerId].bus}</td>
            <td>${transportData[playerId].subway}</td>
        `;
        tbody.appendChild(row);
    }

    // Append round table to history
    const heading = document.createElement('h3');
    heading.textContent = `Round ${roundNumber}`;
    historyContainer.prepend(table);
    historyContainer.prepend(heading);

    // Update usedLocations set with current round locations for future reference
    usedLocations = new Set([...usedLocations, ...currentRoundLocations]);
}
