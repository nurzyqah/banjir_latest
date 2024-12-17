const mapContainer = d3.select("#map");
const width = 800, height = 600;

const geoJsonUrls = [
    'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson',
    'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson'
];

const dataApiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');

// Projection and Path Generator
const projection = d3.geoMercator()
    .center([109.5, 3.5]) // Center over Malaysia
    .scale(4000)          // Adjust scale for zoom
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Function to load GeoJSON and draw the map
async function drawMap() {
    const combinedGeoJson = { type: "FeatureCollection", features: [] };

    for (let url of geoJsonUrls) {
        const response = await d3.json(url);
        combinedGeoJson.features = combinedGeoJson.features.concat(response.features);
    }

    mapContainer.selectAll("path")
        .data(combinedGeoJson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "#000")
        .attr("fill", "#e0e0e0")
        .attr("stroke-width", 0.5);

    loadFloodCenters(); // Load flood center data after map is drawn
}

// Function to load flood center data
async function loadFloodCenters() {
    try {
        const response = await fetch(dataApiUrl);
        const result = await response.text();
        const parsed = JSON.parse(result).contents;
        const floodData = JSON.parse(parsed);

        displayDataInTable(floodData.ppsbuka);
        plotFloodCenters(floodData.ppsbuka);
    } catch (error) {
        console.error("Error loading flood center data:", error);
    }
}

// Function to display flood center data in a table
function displayDataInTable(data) {
    const tableContainer = document.getElementById("table-container");
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

// Function to plot flood centers on the map
function plotFloodCenters(data) {
    const colorScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.mangsa)])
        .range(["yellow", "red"]);

    data.forEach(center => {
        const coords = [parseFloat(center.longitude), parseFloat(center.latitude)];
        if (!isNaN(coords[0]) && !isNaN(coords[1])) {
            mapContainer.append("circle")
                .attr("cx", projection(coords)[0])
                .attr("cy", projection(coords)[1])
                .attr("r", 5)
                .attr("fill", colorScale(center.mangsa))
                .append("title")
                .text(`${center.nama}\nVictims: ${center.mangsa}`);
        }
    });
}

drawMap();
