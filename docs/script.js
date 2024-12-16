const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');
    const totalVictims = document.getElementById('total-victims');
    const totalFamilies = document.getElementById('total-families');
    const totalCapacity = document.getElementById('total-capacity');
    const map = L.map('map').setView([4.2105, 101.9758], 5); // Default coordinates for Malaysia

    // Fetching flood data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const parsedData = JSON.parse(data.contents);
            displayData(parsedData);
            displayStats(parsedData);
            displayMap(parsedData, map);
            renderChart(parsedData);
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });

    // Display stats like total victims, families, and capacity
    function displayStats(data) {
        let victimsCount = 0;
        let familiesCount = 0;
        let capacityCount = 0;

        data.ppsbuka.forEach(item => {
            victimsCount += parseInt(item.mangsa);
            familiesCount += parseInt(item.keluarga);
            capacityCount += parseFloat(item.kapasitiDouble);
        });

        totalVictims.innerText = victimsCount;
        totalFamilies.innerText = familiesCount;
        totalCapacity.innerText = (capacityCount / data.ppsbuka.length).toFixed(2) + '%';
    }

    // Display table with data
    function displayData(data) {
        const tableContainer = document.getElementById('table-container');
        if (!data.ppsbuka || data.ppsbuka.length === 0) {
            tableContainer.innerHTML = '<p>No data available.</p>';
            return;
        }

        let tableHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>PPS Name</th>
                        <th>State</th>
                        <th>District</th>
                        <th>Victims</th>
                        <th>Families</th>
                        <th>Capacity</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.ppsbuka.forEach(item => {
            tableHTML += `
                <tr>
                    <td>${item.nama}</td>
                    <td>${item.negeri}</td>
                    <td>${item.daerah}</td>
                    <td>${item.mangsa}</td>
                    <td>${item.keluarga}</td>
                    <td>${item.kapasiti}</td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        tableContainer.innerHTML = tableHTML;
    }

    // Display map with markers
    function displayMap(data, map) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        data.ppsbuka.forEach(item => {
            L.marker([parseFloat(item.latitude), parseFloat(item.longitude)])
                .addTo(map)
                .bindPopup(`<b>${item.nama}</b><br>${item.negeri}, ${item.daerah}<br>Victims: ${item.mangsa}<br>Families: ${item.keluarga}<br>Capacity: ${item.kapasiti}`);
        });
    }

    // Render chart for victims and families
    function renderChart(data) {
        const ctx = document.getElementById('victimsChart').getContext('2d');
        const victimsData = data.ppsbuka.map(item => item.mangsa);
        const familiesData = data.ppsbuka.map(item => item.keluarga);
        const labels = data.ppsbuka.map(item => item.nama);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Victims',
                    data: victimsData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Families',
                    data: familiesData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
