const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');
const geoJsonUrlSemenanjung = 'https://cors-anywhere.herokuapp.com/https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson';
const geoJsonUrlBorneo = 'https://cors-anywhere.herokuapp.com/https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson';

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

    // Fetch and display flood data
    fetchFloodData();

    // Function to fetch flood data
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
                if (data && data.contents) {
                    return JSON.parse(data.contents); // Return parsed GeoJSON
                } else {
                    throw new Error('GeoJSON data is empty or invalid');
                }
            })
            .catch(error => {
                console.error('Error fetching GeoJSON:', error);
                return null; // Return null if GeoJSON fetch fails
            });
    }

    // Function to display data in a table
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

    // Function to create a pie chart using D3.js
    function createPieChart(data) {
        const totalVictims = d3.sum(data, d => +d.mangsa);
        const totalFamilies = d3.sum(data, d => +d.keluarga);

        const pieData = [
            { label: 'Victims', value: totalVictims },
            { label: 'Families', value: totalFamilies }
        ];

        const width = 400, height = 400, radius = Math.min(width, height) / 2;

        const svg = d3.select("#pie-chart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie().value(d => d.value);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        svg.selectAll('path')
            .data(pie(pieData))
            .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.label))
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        svg.selectAll('text')
            .data(pie(pieData))
            .join('text')
            .text(d => `${d.data.label} (${d.data.value})`)
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .style('text-anchor', 'middle')
            .style('font-size', '12px');
    }
});

