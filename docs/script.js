// Function to fetch data from the API
async function fetchData() {
    const url = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=';

    try {
        const response = await fetch(url);  // Make the API call
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();  // Parse the JSON data
        
        // Call function to create the table with fetched data
        createTable(data.ppsbuka);  // Assuming the API returns data in this structure
    } catch (error) {
        console.error('Error fetching data:', error);
        const tableContainer = d3.select('#table-container');
        tableContainer.select('.loading').remove();
        tableContainer.append('p')
            .attr('class', 'error')
            .text('Failed to load data.');
    }
}

// Create a table and populate it with the data
function createTable(data) {
    const tableContainer = d3.select('#table-container');
    tableContainer.select('.loading').remove(); // Remove the loading message

    if (!data || data.length === 0) {
        // Fallback for missing or empty data
        tableContainer.append('p')
            .attr('class', 'error')
            .text('Failed to load data.');
        return;
    }

    // Create the table
    const table = tableContainer.append('table');

    // Add table header
    const thead = table.append('thead');
    thead.append('tr')
        .selectAll('th')
        .data(['PPS Name', 'State', 'District', 'Victims', 'Families', 'Capacity'])
        .enter()
        .append('th')
        .text(d => d);

    // Add table body
    const tbody = table.append('tbody');
    tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .selectAll('td')
        .data(d => [d.nama, d.negeri, d.daerah, d.mangsa, d.keluarga, d.kapasiti])
        .enter()
        .append('td')
        .text(d => d);
}

// Load the data from the API and populate the table
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Show a loading message until the data is fetched
        const tableContainer = d3.select('#table-container');
        tableContainer.append('p')
            .attr('class', 'loading')
            .text('Loading data...');
        
        // Fetch the data from the API
        fetchData();
    } catch (error) {
        console.error('Error loading data:', error);
        const tableContainer = d3.select('#table-container');
        tableContainer.select('.loading').remove();
        tableContainer.append('p')
            .attr('class', 'error')
            .text('Failed to load data.');
    }
});
