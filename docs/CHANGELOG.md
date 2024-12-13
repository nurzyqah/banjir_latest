# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Initial release of the Malaysia Flood Dashboard project with basic structure.
- Dummy data added for flood relief center information (Pusat Pemindahan Sementara - PPS).
- Dynamic table implementation to display the PPS details.
- Error handling to display a message when data fails to load.

## [1.0.0] - 2024-12-13
### Added
- Basic project structure with `index.html`, `banjir.css`, `script.js`, and `README.md`.
- Responsive design to ensure compatibility across mobile, tablet, and desktop.
- Dummy JSON data used to simulate the flood relief centers' details.
- JavaScript (D3.js) used to dynamically populate the table with flood relief center data.
- Sorting and filtering capabilities added to the table for better usability.
- Error message implemented to display "Failed to load data" when data loading fails.

### Changed
- Updated table to display additional information such as state, district, victims, families, and capacity percentage.
- Updated `README.md` to reflect current status of the project and installation instructions.

## [0.1.0] - 2024-11-30
### Added
- Project initialized with basic HTML structure for the dashboard.
- Created placeholder files for `banjir.css` and `script.js` to be filled in later.

### Changed
- Basic styles implemented for layout and table structure in `banjir.css`.
- Set up initial data structure for flood relief centers, simulating the JSON format for future data integration.

## [0.0.1] - 2024-11-15
### Added
- Initial commit to the project repository.
- Placeholder for `README.md` with a basic project description.
- Set up project repository with an empty folder structure.

## Future Plans
- **Live Data Integration**: Replace dummy data with live flood relief center data from an API or database.
- **Map Integration**: Add an interactive map showing the location of flood relief centers (PPS) based on latitude and longitude.
- **Alert Notifications**: Implement real-time notifications when flood relief centers reach full capacity or near full capacity.
- **Mobile App Version**: Develop a mobile application version for users to access the dashboard easily on the go.

---

This CHANGELOG follows the "Keep a Changelog" principles and uses semantic versioning. Each new release adds important features or bug fixes that will be tracked to maintain a history of the project's evolution.
