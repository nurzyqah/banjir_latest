const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORS Anywhere proxy URL
const apiUrlSemenanjung = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson';
const apiUrlBorneo = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson';

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    fetch(apiUrl)
        .then(response => response.text())  // Get raw response as text
        .then(data => {
            console.log('Raw proxy data:', data);  // Log the raw data to check for issues
            try {
                const jsonData = JSON.parse(data);  // Attempt to parse the response as JSON
                if (jsonData && jsonData.contents) {
                    const parsedData = JSON.parse(jsonData.contents);  // Parse the contents as JSON
                    displayData(parsedData);  // Pass the parsed data to displayData
                    displayPieChart(parsedData);  // Add pie chart logic here
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

    // Load GeoJSON data and display map
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
        <table border="1" style="width: 100%; border-collapse: collapse;">
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

// Function to load the map and GeoJSON data
function loadMap() {
    // Initialize map centered at Malaysia's latitude and longitude
    const map = L.map('map').setView([4.2105, 101.9758], 6); // Malaysia's coordinates

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Use CORS Anywhere proxy for GeoJSON files to avoid CORS issues
    const geojsonUrlSemenanjung = corsProxyUrl + apiUrlSemenanjung;
    const geojsonUrlBorneo = corsProxyUrl + apiUrlBorneo;

    // Fetch and add GeoJSON layers for districts
    fetch(geojsonUrlSemenanjung)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON data for Semenanjung:', error));

    fetch(geojsonUrlBorneo)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON data for Borneo:', error));
}

// Function to display a pie chart based on the data
function displayPieChart(data) {
    const pieChartContainer = document.getElementById('pie-chart-container');
    const ctx = document.getElementById('floodPieChart').getContext('2d');

    // Initialize counters for victims and families
    let victims = 0;
    let families = 0;

    // Loop through the data to accumulate total victims and families
    data.ppsbuka.forEach(item => {
        // Ensure that the numbers are valid integers, defaulting to 0 if not
        victims += parseInt(item.mangsa) || 0;
        families += parseInt(item.keluarga) || 0;
    });

    // Prepare the data for the pie chart
    const pieData = {
        labels: ['Victims', 'Families'],
        datasets: [{
            label: 'Flood Data (Victims vs Families)',
            data: [victims, families],
            backgroundColor: ['#FF5733', '#33FF57'],  // Red for victims, Green for families
            borderColor: ['#FF5733', '#33FF57'],
            borderWidth: 1
        }]
    };

    // Options for the pie chart
    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    // Display the value in tooltip with a more user-friendly format
                    label: function(tooltipItem) {
                        // Display the value as a number with a comma for thousands
                        return tooltipItem.label + ': ' + tooltipItem.raw.toLocaleString();
                    },
                    // Adding percentage tooltips
                    afterLabel: function(tooltipItem) {
                        const total = victims + families;
                        const percentage = (tooltipItem.raw / total * 100).toFixed(2);
                        return `(${percentage}% of total)`;
                    }
                }
            }
        }
    };

    // Check if victims or families are zero to avoid drawing an empty pie chart
    if (victims > 0 || families > 0) {
        // Create and render the pie chart
        new Chart(ctx, {
            type: 'pie',
            data: pieData,
            options: pieOptions
        });
    } else {
        // If no data is available, display a message
        pieChartContainer.innerHTML = '<p>No data available for the pie chart.</p>';
    }

    // Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Set the default Mangsa Masuk value
    let mangsaMasuk = 0;  // You can update this dynamically based on real data

    // Select the Mangsa Masuk element in the DOM to display the data
    const mangsaMasukElement = document.querySelector('.echart-mangsa-masuk .text-800');
    if (mangsaMasukElement) {
        mangsaMasukElement.textContent = mangsaMasuk;
    }

    // Function to fetch and update the Mangsa Masuk count (for example, from an API or dataset)
    function updateMangsaMasukCount() {
        // Simulating an API call (replace this with your actual API call or logic)
        setTimeout(() => {
            // Random number for demonstration purposes (replace with real data)
            mangsaMasuk = Math.floor(Math.random() * 100);
            
            // Update the displayed count on the page
            if (mangsaMasukElement) {
                mangsaMasukElement.textContent = mangsaMasuk;
            }
        }, 1000); // Simulating delay of 1 second
    }

    // Initialize the ECharts instance
    const myChart = echarts.init(document.querySelector('.echart-mangsa-masuk canvas'));

    // Set chart options (replace with your actual data and options)
    const chartOptions = {
        title: {
            text: 'Mangsa Masuk Statistics',
            left: 'center',
            top: '20px'
        },
        tooltip: {
            trigger: 'item'
        },
        xAxis: {
            type: 'category',
            data: ['January', 'February', 'March', 'April', 'May', 'June']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [12, 25, 18, 38, 45, 22],  // Replace with actual dynamic data
                type: 'line',
                smooth: true
            }
        ]
    };

    // Set the options for the chart
    myChart.setOption(chartOptions);

    // Update the Mangsa Masuk count and chart every 10 seconds (simulating dynamic data update)
    setInterval(updateMangsaMasukCount, 10000);

    // Resize chart when the window is resized (responsive design)
    window.addEventListener('resize', function () {
        myChart.resize();
    });
});

}
