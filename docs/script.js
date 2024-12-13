// API URL
const apiUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=';

// Select table container
const tableContainer = d3.select('#table-container');

// Add a loading message
tableContainer.append('div').attr('class', 'loading').text('Loading data...');

// Fetch data from API
d3.json(apiUrl).then(data => {
    // Remove loading message
    tableContainer.select('.loading').remove();

    // Create table
    const table = tableContainer.append('table').attr('class', 'table');

    // Add table header
    const thead = table.append('thead');
    thead.append('tr')
        .selectAll('th')
        .data(['PPS Name', 'District', 'State', 'Victims', 'Families', 'Status'])
        .enter()
        .append('th')
        .text(d => d);

    // Add table body
    const tbody = table.append('tbody');
    data.forEach(item => {
        tbody.append('tr')
            .selectAll('td')
            .data([
                item.pps_name || 'N/A',
                item.district_name || 'N/A',
                item.state_name || 'N/A',
                item.total_mangsa || 'N/A',
                item.total_keluarga || 'N/A',
                item.status_name || 'N/A'
            ])
            .enter()
            .append('td')
            .text(d => d);
    });
}).catch(error => {
    console.error('Error fetching data:', error);
    tableContainer.select('.loading').text('Failed to load data.');
});
