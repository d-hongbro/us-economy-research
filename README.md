# Us Economy Census Data Research
https://d-hongbro.github.io/us-economy-research/

## Introduction
This app provides access to the Economic Census Data: Economy-Wide Key Statistics from 2012.
You able to see the industry related statistics for each state like the number of employees and establishments along with the value of business done and payroll expenses. The information will be made available through table where you will be able to dynamically search for keywords, select how many rows of data to display, and sort the data by columns.

## Getting Started

Below are instructions on how to navigate through the features of the application.

### API Information
https://www.census.gov/data/developers/data-sets/economic-census.html
#### 2012 Economic Census - All Sectors: Economy-Wide Key Statistics
"The Economic Census is the U.S. Government's official five-year measure of American business and the economy. It is conducted by the U.S. Census Bureau, and response is required by law. In October through December 2012, forms were sent out to nearly 4 million businesses, including large, medium and small companies representing all U.S. locations and industries. Respondents were asked to provide a range of operational and performance data for their companies." - description from https://census.gov

#### Endpoint: https://api.census.gov/data/2012/ewks
This application requests the statistics below in order of data table columns

* State
* NAICS2012 industry title
* Type of operation or tax status code
* Number of establishments
* Number of employees
* Value of business done ($1,000)
* Standard error for estimate of value of business done (%)
* Annual payroll ($1,000)
* Standard error for estimate of annual payroll (%)
* Total first quarter payrol
* Standard error for estimate of first-quarter payroll (%)

#### Loading Screen
The loading screen is displayed for a short period of time as the application gathers the reports per state through the API endpoint.

![Loading Screen](/assets/img/loading-screen.jpg)

#### Home Page
Once you see this screen then the reports are now ready to be viewed. Click the blue button block to continue.
![Home Page](/assets/img/home-page.jpg)

#### Filter Sidebar
Depending on your screen size, the sidebar may be displayed on the left of the datatable or at the top.
You can use the filters to dynamically search the datatable, display "X" amount of rows, and display results by state.
![Filter Sidebar](/assets/img/filter-sidebar.jpg)

#### Table Column and Pagination
You can go through the result pages here and also click the column headers to sort the table.
![Table Header](/assets/img/table-header.jpg)

## Built With

HTML5, CSS3, JavaScript, jQuery, Particle JS, Bootstrap, DataTable, Normalize, Font Awesome

## Features Coming

* Session Storage for time complexity and UX
* User generated graphs
* Excel File download option
* Data comparison tables
* Multiple table rendering
