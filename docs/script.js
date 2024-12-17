const geoJsonUrls = [
    'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson'),
    'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson')
];

const floodApiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');

const width = 900;
const height = 500;

// Create SVG container for the map
const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Projection for Malaysia map
const projection = d3.geoMercator()
    .center([109.5, 3.5]) // Center of Malaysia
    .scale(3000)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Fetch GeoJSON through proxy
async function fetchGeoJson(url) {
    const response = await fetch(url);
    const result = await response.json();
    return JSON.parse(result.contents);
}

// Draw Map
async function drawMap() {
    try {
        const combinedGeoJson = { type: "FeatureCollection", features: [] };

        // Load GeoJSON files
        for (let url of geoJsonUrls) {
            const data = await fetchGeoJson(url);
            combinedGeoJson.features = combinedGeoJson.features.concat(data.features);
        }

        // Render map
        svg.selectAll("path")
            .data(combinedGeoJson.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "#000")
            .attr("fill", "#e0e0e0")
            .attr("stroke-width", 0.5);

        // Load flood center data
        loadFloodCenters();
    } catch (error) {
        console.error("Error loading GeoJSON:", error);
        d3.select("#map").append("p").text("Failed to load the map.");
    }
}

// Load flood center data
async function loadFloodCenters() {
    const tableContainer = document.getElementById('table-container');

    try {
        const response = await fetch(floodApiUrl);
        const proxyData = await response.json();
        const floodData = JSON.parse(proxyData.contents);

        displayData(floodData);
        renderFloodCentersOnMap(floodData.ppsbuka);
    } catch (error) {
        console.error("Error loading flood data:", error);
        tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
    }
}

// Render flood centers as circles on the map
function renderFloodCentersOnMap(floodCenters) {
    svg.selectAll("circle")
        .data(floodCenters)
        .enter()
        .append("circle")
        .attr("cx", d => projection([+d.longitude, +d.latitude])[0])
        .attr("cy", d => projection([+d.longitude, +d.latitude])[1])
        .attr("r", 5)
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .append("title")
        .text(d => `${d.nama} (${d.negeri} - ${d.daerah})`);
}

// Display table data
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

// Initialize map rendering
drawMap();
