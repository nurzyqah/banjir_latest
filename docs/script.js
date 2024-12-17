// Alternative Proxy URL
const corsProxyUrl = 'https://api.allorigins.win/raw?url='; // Replace with ThingProxy or CORS Proxy if needed

// API URLs
const apiUrl = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/flood_data.json';
const apiUrlSemenanjung = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson';
const apiUrlBorneo = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson';

// Run after DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');
    const pieChartContainer = document.getElementById('pie-chart-container');
    const mapContainer = document.getElementById('map');

    if (!tableContainer || !pieChartContainer || !mapContainer) {
        console.error("Missing DOM elements. Ensure 'table-container', 'pie-chart-container', and 'map' exist in the HTML.");
        return;
    }

    tableContainer.textContent = 'Loading data...';

    fetchData();
    loadMap();
});

// Fetch flood data
function fetchData() {
    const tableContainer = document.getElementById('table-container');

    fetch(corsProxyUrl + encodeURIComponent(apiUrl))
        .then(response => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            displayData(data);
            displayPieChart(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });
}

// Display table data
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

// Load map with geoJSON data
function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    fetch(corsProxyUrl + encodeURIComponent(apiUrlSemenanjung))
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, { style: { color: 'blue' } }).addTo(map);
        })
        .catch(error => console.error('Error loading Semenanjung data:', error));

    fetch(corsProxyUrl + encodeURIComponent(apiUrlBorneo))
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, { style: { color: 'green' } }).addTo(map);
        })
        .catch(error => console.error('Error loading Borneo data:', error));
}

// Display pie chart
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
