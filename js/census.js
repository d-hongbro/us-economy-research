// function processVariableData(data) {
// 	console.log(data);
// 	data.sort();
// 	CENSUS_DATA[0].api[0].variable_data = data;
// 	console.log(CENSUS_DATA[0].api[0].variable_data);
// }


// look for duplicates within the data and remove them
// tell the user that the duplicate data has been removed
// ask if the user wants to include the duplicate data in the table

// FEATURE - SEARCH
// SIdebar implementation
// Add a search bar that searches for any records in all columns


function listenToSidebarSearch() {
	$('#sidebarSearch').on('keyup', event => {
		$('#dataTableTwo').DataTable().search($(event.currentTarget).val()).draw();
	});
}

function listenToSidebarTableLength() {
	$('#sidebarLength').on('click', 'button', event => {
		$('#dataTableTwo').DataTable().page.len($(event.currentTarget).text()).draw();
		$('#sidebarLength').find('button.active').removeClass('active');
		$(event.currentTarget).toggleClass('active');
	});
}






//FEATURE - REMOVE DUPLICATES
// Use the array filter function


// FEATURE - Hiding columns based on viewport





function processCensusDataTypes(data) {
	// TODO data[row][0] Only target the columns that need editing
	for (let row = 0; row < data.length; row++) {
		for (let column = 0; column < data[row].length; column++) {
			if (column == 0 || column == 1 || column == 5 || column == 7 || column == 9) {
				data[row][column] = parseInt(data[row][column]).toLocaleString();
			} else if (column == 6 ||  column == 8 || column == 10) {
				data[row][column] = data[row][column] + '%';
			} else if (column == 4) {
				data[row][column] = OPTAX[data[row][column]];
			}
			if (column == 5 || column == 7 || column == 9) {
				data[row][column] = "$" + data[row][column];
			}
		}
	}
	return data;
}

function renderDataTableTwoHeader(data) {
	console.log('renderDataTableTwoHeader running');
	let columns = [];
	let value;
	data[0].forEach((item, index) => {
		value = returnObjectValueByKey(HEADER, item);
		if (value !== false) {
			columns.push({title: value});
		}
	});
	return columns;
}

function renderDataTableTwo() {
	console.log('renderDataTableTwo running');
	let data = CENSUS_DATA['queryData'];
	let columns = renderDataTableTwoHeader(data.splice(0, 1));
	data = processCensusDataTypes(data);
	$('#dataTableTwo').DataTable({
		data: data,
		columns: columns,
		retrieve: true,
		searching: true,
		"sDom": '<"top"ip><"card-block"tr><"card-footer"p>',
		"order": [[0, "desc"]],
		"language": {
			"decimal": ".",
			"thousands": ","
		}
	});
}

function getReportParameters(reportIndex) {
	// const variableEndpoint = CENSUS_DATA[reportIndex].api[0].variable_endpoint;
	// getCensusData(variableEndpoint, query, reportIndex, processVariableData);
	const query = CENSUS_DATA['defaultQuery'];
	const endpoint = CENSUS_DATA['endpoint'];
	return {
		endpoint: endpoint, 
		query: query
	};
}

function getCensusData(endpoint, query, reportIndex, callback) {
	$.getJSON(endpoint, query, function(data) {
			callback(data, reportIndex);
	})
		.done(function(data, textStatus, jqXHR) {
	 		// processCensusData(data);
	 	})
	 	.fail(function( jqXHR, textStatus, errorThrown) {
	 		console.log('failed AJAX');
	 		console.log(errorThrown);
	 	})
	 	.always(function( data, textStatus, jqXHR ) { console.log('running AJAX'); });
}

function generateChart(reportIndex) {

}

function returnObjectValueByKey(obj, key) {
	let value = '';
	if (key in obj) {
		value = obj[key];
	} else {
		value = false;
	}
	return value;
}

function generateTableHeader(data) {
	let html = '<th>#</th>';
	let value = '';
	$.each(data, (index, item) => {
		value = returnObjectValueByKey(HEADER, item);
		if (value !== false) {
			html += `<th>${value}</th>`;
		}

	});
	return html;
}


function setPageNumber(pageNumber) {
	$('#dataTable').attr('data-current-page', pageNumber);
}

function getPageNumber() {
	return parseInt($('#dataTable').attr('data-current-page'));
}

function generateTable(reportIndex, pageNumber = 1, resultsPerPage = 50) {
	// This accounts for pagination and spits out the table
	// Need to render the pagination html
	let resultStart, resultEnd;
	if (pageNumber == 1) {
		resultStart = 1;
		resultEnd = resultsPerPage;
	} else if (pageNumber > 1) {
		resultStart = (pageNumber * resultsPerPage) - resultsPerPage;
		resultEnd = pageNumber * resultsPerPage;
	}
	console.log('generateTable running');
	let html = `<table class="table table-striped table-responsive table-sm table-bordered">
						<thead>
					    <tr>`;
    const data = CENSUS_DATA['queryData'];
    html += generateTableHeader(data[0]);					    
    for (let i = resultStart; i <= resultEnd; i++) {
    		html += `<tr>
						    <th scope="row">${i}</th>`;
    		$.each(data[i], (index, item) => {
    			if (index < 11) {
    				html += `<td>${item}</td>`
    			}
    		});
    		html += `</tr>`;
    	}
    html += `</tbody>
					</table>`;
	$('#dataTable').empty().append(html);
	setPageNumber(pageNumber);
}

function getPageStartEnd(resultsPerPage, pageNumber, dataLength) {
	let resultStart, resultEnd, totalPage;
	if (pageNumber == 1) {
		resultStart = 1;
		resultEnd = resultsPerPage;
	} else if (pageNumber > 1) {
		resultStart = (pageNumber * resultsPerPage) - resultsPerPage;
		resultEnd = pageNumber * resultsPerPage;
	}
	totalPage = Math.round(dataLength/resultsPerPage);

	return [resultsPerPage, pageNumber, resultStart, resultEnd, totalPage];
}

function generateTablePaginationHTML(resultsArray) {
	// Switch this to a destructive statement
	const resultsPerPage = resultsArray[0];
	const pageNumber = resultsArray[1];
	const resultStart = resultsArray[2];
	const resultEnd = resultsArray[3];
	const totalPage = resultsArray[4];
	let html = `<nav aria-label="Table Pages">
  <ul class="pagination justify-content-center">`;

  if (pageNumber == 1) {
  	html += `<li class="js-pagination-link page-item disabled">
      <a class="page-link" href="#" tabindex="-1">Previous</a>
    </li>`;
  } else {
  	html += `<li class="js-pagination-link page-item">
      <a class="page-link" href="#" tabindex="-1">Previous</a>
    </li>`;
  }
  for (let i = pageNumber; i < (pageNumber + 3); i++) {
  	html += `<li class="js-pagination-link page-item"><a class="page-link" href="#">${i}</a></li>`;
  }

  if (totalPage == 1) {
  	html += `    <li class="js-pagination-link page-item disabled">
      <a class="page-link" href="#">Next</a>
    </li>`;
  } else {
  	html += `    <li class="js-pagination-link page-item">
      <a class="page-link" href="#">Next</a>
    </li>`;
  }
  html += ` </ul>
</nav>`;
  return html;
}

function checkPageNumber(pageNumber) {
	let newPageNumber = '';
	if (!$.isNumeric(pageNumber) && pageNumber == 'Previous') {
		newPageNumber = getPageNumber() - 1;
	} else if (!$.isNumeric(pageNumber) && pageNumber == 'Next') {
		newPageNumber = getPageNumber() + 1;
	} else {
		newPageNumber = pageNumber;
	}
	return parseInt(newPageNumber);
}

function renderTablePagination(data, pageNumber = 1, resultsPerPage = 50) {
	// Delegates the task to generateTable with the data, resultsPerPage, pageNumber
	// then displays the table in the table portion of the page
	dataLength = data.length;
	resultArray = getPageStartEnd(resultsPerPage, pageNumber, dataLength);
	const html = generateTablePaginationHTML(resultArray);

	$('#tablePagination').empty().append(html);
}

function processCensusData(data, reportIndex) {
	// Delegates the process of census data
	// This is the callback function called within listenToMainReportSubmit()
	// Sends data to graph processor
	// Sends data to table processor
	CENSUS_DATA['queryData'] = data;
	generateTable(reportIndex);
	renderTablePagination(data);
	renderDataTableTwo();
}

function renderFilterBar(data) {
	// Render Filter Bar at the top
	// This is the callback function called within renderResultsPage()
}

function renderSidebar() {
	// Render sidebar Menu
}

function renderResultsPage(report) {
	// Render sidebar menu
	renderSidebar();
	// Render top Filter bar (report)
	// getCensusData(report, renderFilterBar);
	// Render Graph box even if no data
	// Render Table Box even if no data
}

function listenToFilterSubmit() {
	// Listens to Report filter submit
	// Call AJAX with report and callback function
	// re-render results page
	// getCensusData(report, processCensusData);
	// renderResultsPage(report);
}

function listenToSideBarClick() {
	// Listens to sidebar click
	// Call AJAX with report and callback function
	// re-render results page
	// getCensusData(report, processCensusData);
	// renderResultsPage(report);

}

function listenToMainReportSubmit() {
	// Listen to main page report lick
	// If clicked, get report value and pass to AJAX census call
	// Pass in callback function for data
	// Render Result page(Report)

	$('.home-search-form').submit(event => {
		console.log('main form submitted');
		event.preventDefault();
		// Might be implemented in the future for more reports
		const reportIndex = $('#reportSelect').find(":selected").val();
		const target = $('#reportSubmitButton').attr('href');
		const parameters = getReportParameters(reportIndex);
		getCensusData(parameters.endpoint, parameters.query, reportIndex, processCensusData);
		$('#resultsPage').toggleClass('hidden');
	    $('html, body').stop().animate({
		    scrollTop: $(target).offset().top
	    }, 1500);

		
	});
}

function listenToPaginationClick() {
	$('#tablePagination').on('click', '.js-pagination-link', function(event) {
		event.preventDefault();
		let elementClicked = checkPageNumber($(event.currentTarget).find('a').text());
		generateTable(0, elementClicked);
		renderTablePagination(CENSUS_DATA['queryData'], elementClicked);
	})
}

// function getAllReports() {
// 	// returns object of all reports available
// 	let string = '';
// 	$.each(CENSUS_DATA, (i, report) => {
// 		string += `<option value="${i}">${report.name}</option>`;
// 	});
// 	return string;
// }

function updateMainDropDown() {
	// const html = getAllReports();
	const html = `<option value="0">${CENSUS_DATA['title']}</option>`;
	$('#reportSelect').append(html);
}

function handleCensus() {
	console.log('handleCensus running');
	// user report click listener
	// user report filter listener
	// user sidebar click listener
	// get current available reports in a drop down menu on home page+
	// load the variables I will be using for the calls

	$(updateMainDropDown);
	$(listenToMainReportSubmit);
	$(listenToSideBarClick);
	$(listenToFilterSubmit);
	$(listenToPaginationClick);
	$(listenToSidebarSearch);
	$(listenToSidebarTableLength);
}

$(handleCensus);