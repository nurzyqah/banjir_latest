const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

const geoJsonUrlSemenanjung = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson';
const geoJsonUrlBorneo = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson';
const floodDataUrl = 'https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0';

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');
    const map = L.map('map').setView([4.2105, 101.9758], 6);  // Malaysia's central coordinates

    // Tile layer for the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Load GeoJSON for both Semenanjung and Borneo
    Promise.all([fetch(geoJsonUrlSemenanjung), fetch(geoJsonUrlBorneo)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            const [semenanjungData, borneoData] = data;
            L.geoJSON(semenanjungData).addTo(map);
            L.geoJSON(borneoData).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON data:', error));

    // Fetch flood data and populate the table
    fetch(apiUrl)
        .then(response => response.text())  // Get raw response as text
        .then(data => {
            try {
                const jsonData = JSON.parse(data);
                if (jsonData && jsonData.contents) {
                    const parsedData = JSON.parse(jsonData.contents);
                    displayData(parsedData);  // Pass the parsed data to displayData
                    updatePieChart(parsedData);  // Pass data to update the pie chart
                } else {
                    throw new Error('Invalid JSON structure: missing contents');
                }
            } catch (error) {
                console.error('Error parsing the data:', error.message);
                tableContainer.innerHTML = `<p style="color: red;">Failed to parse data: ${error.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });

    // Function to display flood data in a table
    function displayData(data) {
        const tableContainer = document.getElementById('table-container');
        if (!data.ppsbuka || data.ppsbuka.length === 0) {
            tableContainer.innerHTML = '<p>No data available.</p>';
            return;
        }

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

    // Function to update the pie chart
    function updatePieChart(data) {
        const floodStats = {
            "Sufficient Capacity": 0,
            "Overflowing": 0,
            "Insufficient Capacity": 0
        };

        if (data.ppsbuka && data.ppsbuka.length > 0) {
            data.ppsbuka.forEach(item => {
                if (item.kapasiti) {
                    if (item.kapasiti === "Sufficient") {
                        floodStats["Sufficient Capacity"]++;
                    } else if (item.kapasiti === "Overflowing") {
                        floodStats["Overflowing"]++;
                    } else {
                        floodStats["Insufficient Capacity"]++;
                    }
                }
            });
        }

        const ctx = document.getElementById('pie-chart').getContext('2d');
        const pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(floodStats),
                datasets: [{
                    data: Object.values(floodStats),
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                    borderColor: ['#fff', '#fff', '#fff'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }
});
