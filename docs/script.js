const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');
const geoJsonUrlSemenanjung = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson';
const geoJsonUrlBorneo = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson';
const floodDataUrl = 'https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0';
const pieDataMangsaUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-pie.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=&j=mangsa';
const pieDataKeluargaUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-pie.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=&j=keluarga';
const pieDataPpsUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-pie.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=&j=pps';

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

    // Fetch pie chart data for Victims, Families, and PPS
    Promise.all([fetch(pieDataMangsaUrl), fetch(pieDataKeluargaUrl), fetch(pieDataPpsUrl)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            const [mangsaData, keluargaData, ppsData] = data;
            renderPieChart(mangsaData, 'mangsaChart', 'Victims');
            renderPieChart(keluargaData, 'keluargaChart', 'Families');
            renderPieChart(ppsData, 'ppsChart', 'PPS');
        })
        .catch(error => console.error('Error fetching pie chart data:', error));

    // Function to render pie chart
    function renderPieChart(data, chartId, label) {
        if (!data || !data.data || data.data.length === 0) {
            document.getElementById(chartId).parentElement.innerHTML = `<p>No data available for ${label}</p>`;
            return;
        }

        const ctx = document.getElementById(chartId).getContext('2d');
        const chartData = {
            labels: data.data.map(item => item.label),
            datasets: [{
                data: data.data.map(item => item.value),
                backgroundColor: ['#FF9999', '#66B3FF', '#99FF99', '#FFCC99'], // Customize as needed
                borderColor: ['#FF6666', '#3399FF', '#66FF66', '#FF9966'],
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw;
                            }
                        }
                    }
                }
            });
        };
    }
});
