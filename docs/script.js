const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

const geoJsonUrlSemenanjung = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson';
const geoJsonUrlBorneo = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson';
const floodDataUrl = 'https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0';

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');
    const map = L.map('map').setView([4.2105, 101.9758], 6); // Malaysia's central coordinates

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
        .then(response => response.text()) // Get raw response as text
        .then(data => {
            try {
                const jsonData = JSON.parse(data);
                if (jsonData && jsonData.contents) {
                    const parsedData = JSON.parse(jsonData.contents);
                    displayData(parsedData); // Pass the parsed data to displayData
                    createPieChart(parsedData); // Create pie chart
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

    // Function to create a pie chart
    function createPieChart(data) {
        if (!data.ppsbuka || data.ppsbuka.length === 0) {
            return;
        }

        const totalVictims = d3.sum(data.ppsbuka, d => +d.mangsa);
        const totalFamilies = d3.sum(data.ppsbuka, d => +d.keluarga);
        const totalPPS = data.ppsbuka.length;

        const pieData = [
            { label: "Victims", value: totalVictims },
            { label: "Families", value: totalFamilies },
            { label: "PPS", value: totalPPS }
        ];

        const width = 400, height = 400, radius = Math.min(width, height) / 2;

        const svg = d3.select("#pie-chart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal()
            .domain(pieData.map(d => d.label))
            .range(["#ff9999", "#66b3ff", "#99ff99"]);

        const pie = d3.pie()
            .value(d => d.value);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        svg.selectAll("path")
            .data(pie(pieData))
            .join("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.label))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        // Add labels
        svg.selectAll("text")
            .data(pie(pieData))
            .join("text")
            .text(d => `${d.data.label} (${d.data.value})`)
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .style("text-anchor", "middle")
            .style("font-size", "12px");
    }
});

