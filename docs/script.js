const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');
const mapUrlSemenanjung = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson';
const mapUrlBorneo = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson';
const floodDataUrl = 'https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0';

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    // Load the flood data table
    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            console.log('Raw proxy data:', data);
            try {
                const jsonData = JSON.parse(data);
                if (jsonData && jsonData.contents) {
                    const parsedData = JSON.parse(jsonData.contents);
                    displayData(parsedData);
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

    // Initialize the map
    const map = L.map('map').setView([4.2105, 101.9758], 6); // Set to Malaysia's center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Load GeoJSON for the map
    Promise.all([
        fetch(mapUrlSemenanjung).then(res => res.json()),
        fetch(mapUrlBorneo).then(res => res.json())
    ]).then(([semenanjungGeoJson, borneoGeoJson]) => {
        L.geoJSON(semenanjungGeoJson).addTo(map);
        L.geoJSON(borneoGeoJson).addTo(map);

        // Add flood data markers on the map
        fetch(floodDataUrl)
            .then(response => response.json())
            .then(floodData => {
                floodData.forEach(item => {
                    const lat = parseFloat(item.latitude);
                    const lon = parseFloat(item.longitude);
                    if (!isNaN(lat) && !isNaN(lon)) {
                        L.marker([lat, lon])
                            .bindPopup(`<b>${item.nama}</b><br>Victims: ${item.mangsa}<br>Families: ${item.keluarga}`)
                            .addTo(map);
                    }
                });
            })
            .catch(err => console.error('Error fetching flood data:', err));
    }).catch(err => console.error('Error loading map data:', err));
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
