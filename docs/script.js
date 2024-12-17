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
                    throw new Error('Struktur JSON tidak sah: kandungan hilang');
                }
            } catch (error) {
                console.error('Ralat dalam memproses data:', error.message);
                tableContainer.innerHTML = `<p style="color: red;">Gagal untuk memproses data: ${error.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Ralat memuatkan data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Gagal untuk memuatkan data: ${error.message}</p>`;
        });

    loadMap();
});

function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    console.log('Memaparkan data:', data);

    if (!data.ppsbuka || data.ppsbuka.length === 0) {
        tableContainer.innerHTML = '<p>Tiada data yang tersedia.</p>';
        return;
    }

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nama PPS</th>
                    <th>Negeri</th>
                    <th>Daerah</th>
                    <th>Mangsa</th>
                    <th>Keluarga</th>
                    <th>Kapasiti</th>
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
            throw new Error('Gagal memuatkan data geojson');
        }
    })
    .then(data => {
        if (data.contents) {
            L.geoJSON(JSON.parse(data.contents)).addTo(map);
        } else {
            console.error('Respons yang tidak sah untuk Semenanjung geojson:', data);
        }
    })
    .catch(error => {
        console.error('Ralat memuatkan geojson Semenanjung:', error);
    });

    // Fetch Borneo GeoJSON data
    fetch(geojsonUrlBorneo)
        .then(response => response.json())
        .then(data => {
            if (data.contents) {
                L.geoJSON(JSON.parse(data.contents)).addTo(map);
            } else {
                console.error('Respons yang tidak sah untuk Borneo geojson:', data);
            }
        })
        .catch(error => console.error('Ralat memuatkan geojson Borneo:', error));
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
        labels: ['Mangsa', 'Keluarga'],
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
        document.getElementById('pie-chart-container').innerHTML = '<p>Tiada data tersedia untuk carta pai.</p>';
    }
}
