const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORS Anywhere proxy URL
const apiUrl = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/flood_data.json'; // Example API
const apiUrlSemenanjung = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson';
const apiUrlBorneo = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson';

// Run after DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');
    const pieChartContainer = document.getElementById('pie-chart-container');
    const mapContainer = document.getElementById('map');

    // Check if essential elements exist
    if (!tableContainer || !pieChartContainer || !mapContainer) {
        console.error("Missing DOM elements. Ensure 'table-container', 'pie-chart-container', and 'map' exist in the HTML.");
        return;
    }

    // Inform user that data is loading
    tableContainer.textContent = 'Loading data...';

    // Fetch data and display table, pie chart, and map
    fetchData();
    loadMap();
});

function fetchData() {
    const tableContainer = document.getElementById('table-container');

    fetch(corsProxyUrl + apiUrl)
        .then(response => response.json())
        .then(data => {
            displayData(data);
            displayPieChart(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });
}

function displayData(data) {
    const tableContainer = document.getElementById('table-container');

    if (!data.ppsbuka || data.ppsbuka.length === 0) {
        tableContainer.innerHTML = '<p>No data available.</p>';
        return;
    }

    let tableHTML = `
        <table border="1" style="width: 100%; border-collapse: collapse;">
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

function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6); // Malaysia's coordinates

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const geojsonUrlSemenanjung = corsProxyUrl + apiUrlSemenanjung;
    const geojsonUrlBorneo = corsProxyUrl + apiUrlBorneo;

    fetch(geojsonUrlSemenanjung)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, { style: { color: 'blue' } }).addTo(map);
        })
        .catch(error => console.error('Error loading Semenanjung data:', error));

    fetch(geojsonUrlBorneo)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, { style: { color: 'green' } }).addTo(map);
        })
        .catch(error => console.error('Error loading Borneo data:', error));
}

function displayPieChart(data) {
    const pieChartContainer = document.getElementById('pie-chart-container');
    const ctx = document.getElementById('floodPieChart').getContext('2d');

    let victims = 0;
    let families = 0;

    data.ppsbuka.forEach(item => {
        victims += parseInt(item.mangsa) || 0;
        families += parseInt(item.keluarga) || 0;
    });

    const pieData = {
        labels: ['Victims', 'Families'],
        datasets: [{
            label: 'Flood Data',
            data: [victims, families],
            backgroundColor: ['#FF5733', '#33FF57'],
            borderColor: ['#FF5733', '#33FF57'],
            borderWidth: 1
        }]
    };

    if (victims > 0 || families > 0) {
        new Chart(ctx, {
            type: 'pie',
            data: pieData,
            options: { responsive: true }
        });
    } else {
        pieChartContainer.innerHTML = '<p>No data for pie chart.</p>';
    }
}
