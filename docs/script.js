// GeoJSON URLs for Malaysia maps
const geoJsonUrls = [
    'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson',
    'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson'
];

// Flood API URL using CORS proxy
const floodApiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');

// Map dimensions
const width = 900;
const height = 500;

// Create SVG container for the map
const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Define the projection for Malaysia
const projection = d3.geoMercator()
    .center([109.5, 3.5]) // Center of Malaysia
    .scale(3000)
    .translate([width / 2, height / 2]);

// Define the path generator
const path = d3.geoPath().projection(projection);

// Main function to render the map and load data
async function drawMap() {
    try {
        const combinedGeoJson = { type: "FeatureCollection", features: [] };

        // Load GeoJSON files for Peninsular Malaysia and Borneo
        for (let url of geoJsonUrls) {
            const response = await d3.json(url);
            combinedGeoJson.features = combinedGeoJson.features.concat(response.features);
        }

        // Render the combined GeoJSON map
        svg.selectAll("path")
            .data(combinedGeoJson.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "#000")
            .attr("fill", "#e0e0e0")
            .attr("stroke-width", 0.5);

        console.log("GeoJSON data successfully loaded.");

        // Load flood center data
        loadFloodCenters();
    } catch (error) {
        console.error("Error loading GeoJSON:", error);
        d3.select("#map").append("p").text("Failed to load the map. Please check your connection.");
    }
}

// Function to load flood center data
async function loadFloodCenters() {
    const tableContainer = document.getElementById('table-container');

    try {
        const response = await fetch(floodApiUrl);
        const proxyData = await response.text();
        const jsonData = JSON.parse(proxyData).contents; // Parse the proxy response
        const floodData = JSON.parse(jsonData); // Extract flood data

        console.log("Flood data successfully loaded:", floodData);

        // Render flood centers on the map and display table
        displayData(floodData);
        renderFloodCentersOnMap(floodData.ppsbuka);
    } catch (error) {
        console.error("Error loading flood data:", error);
        tableContainer.innerHTML = `<p style="color: red;">Failed to load flood center data. Please try again later.</p>`;
    }
}

// Function to render flood centers on the map
function renderFloodCentersOnMap(floodCenters) {
    if (!floodCenters || floodCenters.length === 0) {
        console.warn("No flood centers data to render.");
        return;
    }

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

// Function to display flood center data in a table
function displayData(data) {
    const tableContainer = document.getElementById('table-container');

    if (!data.ppsbuka || data.ppsbuka.length === 0) {
        tableContainer.innerHTML = '<p>No flood center data available.</p>';
        return;
    }

    // Build the table HTML
    let tableHTML = `
        <table border="1" cellspacing="0" cellpadding="5">
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

    console.log("Flood center data table rendered successfully.");
}

// Initialize the map rendering
drawMap();
