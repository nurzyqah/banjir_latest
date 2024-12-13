# Malaysia Flood Dashboard

## Overview
The Malaysia Flood Dashboard is an interactive web application designed to display real-time data on flood relief centers across Malaysia. This project uses dummy data for demonstration purposes and includes features such as a dynamic table to display information about evacuation centers (Pusat Pemindahan Sementara - PPS), their capacities, and the number of victims.

## Features
- **Dynamic Table**: Displays PPS details such as name, state, district, number of victims, families, and capacity percentage.
- **Responsive Design**: Ensures the dashboard is accessible on various devices.
- **Error Handling**: Handles data loading errors gracefully, showing an error message when data fails to load.

## Technology Stack
- **HTML**: Structure of the web page.
- **CSS**: Styling and layout.
- **JavaScript (D3.js)**: For data binding and dynamic table generation.

## File Structure
```
project-directory/
├── index.html      # Main HTML file for the dashboard
├── banjir.css      # CSS file for styling
├── script.js       # JavaScript file for functionality
└── README.md       # Documentation file
```

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd project-directory
   ```

## Usage
1. Open the `index.html` file in your web browser to view the dashboard.
2. The page will attempt to load data dynamically. If the data fails to load, an error message will be displayed.

## Dummy Data
The project uses the following dummy data for demonstration purposes:
```json
{
  "ppsbuka": [
    {
      "id": "10067",
      "pic": "johor.png",
      "nama": "DEWAN KOMUNITI KAMPUNG TASEK",
      "negeri": "Johor",
      "daerah": "Segamat",
      "mangsa": 45,
      "keluarga": 14,
      "kapasiti": "45%"
    },
    {
      "id": "5476",
      "pic": "johor.png",
      "nama": "BALAIRAYA GEMEREH IV (BATU BADAK)",
      "negeri": "Johor",
      "daerah": "Segamat",
      "mangsa": 40,
      "keluarga": 12,
      "kapasiti": "57.14%"
    }
  ]
}
```

## Error Handling
If data fails to load, the dashboard will:
1. Remove the "Loading data..." message.
2. Display an error message: "Failed to load data."

## Contribution
Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.

## License
This project is open-source and available under the [MIT License](LICENSE).

---

## Contact
For inquiries or feedback, please contact:
- **Name**: [Your Name]
- **Email**: [Your Email]
