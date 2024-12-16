const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => {
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to fetch data. Response not OK.');
            }
            return response.text(); // Get raw response text (we'll parse it manually)
        })
        .then(data => {
            console.log('Raw response:', data); // Log the raw response data

            // Try to parse the data as JSON
            try {
                const parsedData = JSON.parse(data); // Parse the JSON data inside 'contents'
                displayData(parsedData);
            } catch (error) {
                // If parsing fails, show an error message
                tableContainer.innerHTML = `<p style="color: red;">Failed to parse data: ${error.message}</p>`;
                console.error('Error parsing data:', error.message);
            }
        })
        .catch(error => {
            // Log errors during fetching
            console.error('Error fetching data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });
});

// Function to display the data in the table
function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    console.log('Displaying data:', data);

    // Check if there is any data available
    if (!data.ppsbuka || data.ppsbuka.length === 0) {
        tableContainer.innerHTML = '<p>No data available.</p>';
        return;
    }

    // Build the table HTML
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

    // Loop through the data and add each row to the table
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
    tableContainer.innerHTML = tableHTML; // Set the table HTML in the container
}
