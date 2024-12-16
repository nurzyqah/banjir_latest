const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Raw proxy data:', data);
            const parsedData = JSON.parse(data.contents); // Parse JSON yang ada dalam 'contents'
            displayData(parsedData);
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });
});

function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    if (!data.ppsbuka || data.ppsbuka.length === 0) {
        tableContainer.innerHTML = '<p class="text-center text-danger">No data available.</p>';
        return;
    }

    let tableHTML = `
        <table class="table table-bordered table-hover">
            <thead>
                <tr>
                    <th>#</th>
                    <th>State</th>
                    <th>PPS Name</th>
                    <th>District</th>
                    <th>Victims</th>
                    <th>Families</th>
                    <th>Capacity</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.ppsbuka.forEach((item, index) => {
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <img src="https://infobencanajkmv2.jkm.gov.my/images/${item.pic}" alt="${item.negeri}" width="50" height="30">
                    ${item.negeri}
                </td>
                <td>${item.nama}</td>
                <td>${item.daerah}</td>
                <td>${item.mangsa}</td>
                <td>${item.keluarga}</td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${item.kapasiti};">
                            ${item.kapasiti}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;
}
