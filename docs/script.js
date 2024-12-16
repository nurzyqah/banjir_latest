document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    // URL API
    const apiUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=';

    // Fetch data dari API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayData(data); // Fungsi untuk paparkan data
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            tableContainer.innerHTML = '<p style="color: red;">Failed to load data. Please try again later.</p>';
        });
});

// Fungsi untuk paparkan data dalam HTML
function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    const ppsData = data.ppsbuka || []; // Ambil data ppsbuka

    // Jika tiada data
    if (ppsData.length === 0) {
        tableContainer.innerHTML = '<p>No data available.</p>';
        return;
    }

    // Bina jadual HTML
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

    // Loop melalui data
    ppsData.forEach(item => {
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

    // Paparkan jadual dalam HTML
    tableContainer.innerHTML = tableHTML;
}
