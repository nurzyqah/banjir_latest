// JavaScript File: script.js

// API URL
const apiUrl = "https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=";

// Fetch data from the API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Process data for visualizations
        renderBarChart(data);
        renderDataTable(data);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

// Render bar chart
function renderBarChart(data) {
    const svg = d3.select("#bar-chart");
    const width = svg.attr("width");
    const height = svg.attr("height");
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const centers = data.map(d => d.name);
    const evacuees = data.map(d => +d.total_evacuees);

    const x = d3.scaleBand()
        .domain(centers)
        .range([0, chartWidth])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(evacuees)])
        .range([chartHeight, 0]);

    // X Axis
    g.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Y Axis
    g.append("g")
        .call(d3.axisLeft(y));

    // Bars
    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.total_evacuees))
        .attr("width", x.bandwidth())
        .attr("height", d => chartHeight - y(d.total_evacuees))
        .attr("fill", "#007bff");
}

// Render data table
function renderDataTable(data) {
    const tableContainer = d3.select("#data-table");

    const table = tableContainer.append("table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    // Table headers
    thead.append("tr")
        .selectAll("th")
        .data(["Name", "Total Evacuees", "Total Centers"])
        .enter()
        .append("th")
        .text(d => d);

    // Table rows
    tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .selectAll("td")
        .data(d => [d.name, d.total_evacuees, d.total_centers])
        .enter()
        .append("td")
        .text(d => d);
}
