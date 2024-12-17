const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            console.log('Raw proxy data:', data);
            try {
                const jsonData = JSON.parse(data);
                if (jsonData && jsonData.contents) {
                    const parsedData = JSON.parse(jsonData.contents);
                    displayData(parsedData);
                    displayPieChart(parsedData);
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

    loadMap();
});

function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    console.log('Displaying data:', data);

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

function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // URLs for the GeoJSON data (using AllOrigins proxy)
    const geojsonUrlSemenanjung = 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson');
    const geojsonUrlBorneo = 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson');


    // Fetch Semenanjung GeoJSON data
    fetch(geojsonUrlSemenanjung)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to load geojson data');
        }
    })
    .then(data => {
        if (data.contents) {
            L.geoJSON(JSON.parse(data.contents)).addTo(map);
        } else {
            console.error('Invalid response for Semenanjung geojson:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching Semenanjung geojson:', error);
    });


    // Fetch Borneo GeoJSON data
    fetch(geojsonUrlBorneo)
        .then(response => response.json())
        .then(data => {
            if (data.contents) {
                L.geoJSON(JSON.parse(data.contents)).addTo(map);
            } else {
                console.error('Invalid response for Borneo geojson:', data);
            }
        })
        .catch(error => console.error('Error fetching Borneo geojson:', error));
}

function displayPieChart(data) {
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
            data: [victims, families],
            backgroundColor: ['#FF5733', '#33FF57'],
        }]
    };

    if (victims > 0 || families > 0) {
        new Chart(ctx, {
            type: 'pie',
            data: pieData,
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
    } else {
        document.getElementById('pie-chart-container').innerHTML = '<p>No data available for pie chart.</p>';
    }
}
