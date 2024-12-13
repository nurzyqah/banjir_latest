// Dummy data for testing if needed
const dummyData = {
    ppsbuka: [
        {
            id: "10067",
            pic: "johor.png",
            nama: "DEWAN KOMUNITI KAMPUNG TASEK",
            negeri: "Johor",
            daerah: "Segamat",
            mangsa: 45,
            keluarga: 14,
            kapasiti: "45%",
        },
        {
            id: "5476",
            pic: "johor.png",
            nama: "BALAIRAYA GEMEREH IV (BATU BADAK)",
            negeri: "Johor",
            daerah: "Segamat",
            mangsa: 40,
            keluarga: 12,
            kapasiti: "57.14%",
        },
        {
            id: "2780",
            pic: "pahang.png",
            nama: "BALAIRAYA KAMPUNG BARU PERTANIAN",
            negeri: "Pahang",
            daerah: "Maran",
            mangsa: 11,
            keluarga: 4,
            kapasiti: "11%",
        },
    ],
};

// Fetch data from API
async function fetchData() {
    const url = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=';
    
    try {
        // Make the API request
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();  // Parse the JSON response

        console.log('Fetched data:', data);  // Log data to inspect its structure

        // Check if ppsbuka exists in the response
        if (data && data.ppsbuka) {
            createTable(data.ppsbuka);  // Call function to create the table with fetched data
        } else {
            throw new Error('Data not found in response');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        const tableContainer = d3.select('#table-container');
        tableContainer.select('.loading').remove();
        tableContainer.append('p')
            .attr('class', 'error')
            .text('Failed to load data.');
    }
}

// Create a table and populate it
function createTable(data) {
    const tableContainer = d3.select('#table-container');
    tableContainer.select('.loading').remove(); // Remove the loading message

    if (!data || data.length === 0) {
        // Fallback for missing or empty data
        tableContainer.append('p')
            .attr('class', 'error')
            .text('No data available.');
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
        .data(data) // Assuming the API returns an array of objects
        .enter()
        .append('tr')
        .selectAll('td')
        .data(d => [d.nama, d.negeri, d.daerah, d.mangsa, d.keluarga, d.kapasiti])
        .enter()
        .append('td')
        .text(d => d);
}

// Wait for the DOM to load, then fetch data
document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = d3.select('#table-container');
    tableContainer.append('p').attr('class', 'loading').text('Loading data...');  // Show loading message
    
    fetchData();  // Fetch data from the API
});
