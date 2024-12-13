// Dummy data
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

// Create a table and populate it
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

// Load dummy data
document.addEventListener('DOMContentLoaded', () => {
    try {
        setTimeout(() => {
            createTable(dummyData.ppsbuka);
        }, 1000); // Simulate a short delay
    } catch (error) {
        console.error('Error loading data:', error);
        const tableContainer = d3.select('#table-container');
        tableContainer.select('.loading').remove();
        tableContainer.append('p')
            .attr('class', 'error')
            .text('Failed to load data.');
    }
});
