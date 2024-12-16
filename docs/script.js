const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');
const geoJsonUrlSemenanjung = 'https://cors-anywhere.herokuapp.com/https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson';
const geoJsonUrlBorneo = 'https://cors-anywhere.herokuapp.com/https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson';
const floodDataUrl = 'https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0';

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');
    const map = L.map('map').setView([4.2105, 101.9758], 6); // Malaysia coordinates

    // Add tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fetch and load GeoJSON data with retry mechanism
    Promise.all([
        fetchGeoJsonWithFallback(geoJsonUrlSemenanjung),
        fetchGeoJsonWithFallback(geoJsonUrlBorneo)
    ])
    .then(([semenanjungData, borneoData]) => {
        if (semenanjungData && borneoData) {
            L.geoJSON(semenanjungData).addTo(map);
            L.geoJSON(borneoData).addTo(map);
        } else {
            console.error('GeoJSON data is empty or invalid');
            tableContainer.innerHTML = '<p style="color: red;">Failed to load map data.</p>';
        }
    })
    .catch(error => {
        console.error('Error loading GeoJSON data:', error);
        tableContainer.innerHTML = '<p style="color: red;">Failed to load map data.</p>';
    });

    // Function to fetch GeoJSON data with a fallback approach
    function fetchGeoJsonWithFallback(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.features) {
                    return data; // Return parsed GeoJSON if valid
                } else {
                    throw new Error('GeoJSON is not valid');
                }
            })
            .catch(error => {
                console.error('Error fetching GeoJSON:', error);
                return null; // Return null if GeoJSON fetch fails
            });
    }

    // Function to fetch flood data (example)
    function fetchFloodData() {
        const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const parsedData = JSON.parse(data.contents);
                if (parsedData && parsedData.ppsbuka) {
                    displayTable(parsedData.ppsbuka);
                    createPieChart(parsedData.ppsbuka);
                } else {
                    tableContainer.innerHTML = '<p>No data available.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching flood data:', error);
                tableContainer.innerHTML = '<p style="color: red;">Failed to load flood data.</p>';
            });
    }

    // Function to display data in a table (example)
    function displayTable(data) {
        let tableHTML = `
            <table>
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
        data.forEach(item => {
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

    // Function to create a pie chart (example)
    function createPieChart(data) {
        // Pie chart code here
    }
});

