// look for duplicates within the data and remove them
// tell the user that the duplicate data has been removed
// ask if the user wants to include the duplicate data in the table


// FEATURE - sidebar filter by state
// dropdown menu to choose state
// dropdown menu is dynamically made
// dropdown event will redraw the table according to what was chosen
// How to grab current state thats populated

function returnDropdownItem(item, disabled = false, link = '#', ) {
	return `<a class="dropdown-item ${disabled ? 'disabled' : ''}" href="${link}">${item}</a>`;
}

function fillSidebarState(state, currentlyDisplayed = false) {
	const dropdownItem = returnDropdownItem(state, currentlyDisplayed);
	console.log(dropdownItem);
	if (currentlyDisplayed) {
		const divider = `<div class="dropdown-divider"></div>`;
		$('#sidebarStates').find('.dropdown-menu').empty().append(dropdownItem);
		$('#sidebarStates').find('.dropdown-menu').append(divider);
		$('#sidebarStatesButton').text(state);
	} else {
		$('#sidebarStates').find('.dropdown-menu').append(dropdownItem);
	}
}

function loadSidebarClickedTable(state) {
	console.log('loadSidebarClickedTable running');
	let data = CENSUS_DATA[state];
	renderDataTableTwoHeader(data.splice(0, 1));
	data = processCensusDataTypes(data);
	$('#dataTableTwo').DataTable().clear().draw();
	$('#dataTableTwo').DataTable().rows.add(data);
	$('#dataTableTwo').DataTable().columns.adjust().draw()
}

function loadSidebarAfterClick(state) {
	// FIrst erase the options
	// load what was clicked at the top with divider
	// then loop through the rest and add
	fillSidebarState(state, true);
	for (let key in STATE_CODE) {
		if (key !== state) {
			fillSidebarState(key);
		}
	}
}

function listenToSidebarState() {
	$('#sidebarStates').on('click', '.dropdown-item', event => {
		event.preventDefault();
		// event.stopPropagation();
		const stateClicked = $(event.currentTarget).text();
		$('#sidebarStatesButton').text(stateClicked);
		loadSidebarClickedTable(stateClicked);
		loadSidebarAfterClick(stateClicked);
		console.log(stateClicked);
		console.log('state clicked');
	});
}


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

function listenToAjaxStop() {
	$(document).ajaxStop(function () {
		$('#reportSelect').toggleClass('disabled');
		$('#reportSubmitButton').toggleClass('disabled');
		console.log('report rdy');
		console.log(CENSUS_DATA);
	});
}


//FEATURE - REMOVE DUPLICATES
// Use the array filter function


// FEATURE - Hiding columns based on viewport

function processCensusDataLoop(data, callNumber, state) {
	// Chunked Data for efficiency
	let currentData = data;
	CENSUS_DATA[state] = currentData;
	// if (CENSUS_DATA.queryData[0] == null) {
	// 	CENSUS_DATA.queryData = currentData;
	// } else {
	// 	currentData.splice(0, 1);
	// 	CENSUS_DATA.queryData = CENSUS_DATA.queryData.concat(currentData);
	// }
	CENSUS_DATA.callsDone++;
	if (CENSUS_DATA.submitClicked) {
		$('#dataTableTwo').DataTable().rows.add(currentData).draw(false);
	}
	console.log(`CAll ${callNumber} done. Percent done: ${(CENSUS_DATA.callsDone/51) *100}%`);
}

function runProcessesOnLoad() {
	// How to do interval getJson
	const endpoint = CENSUS_DATA.endpoint;
	let timeOut = 1000;
	let query = CENSUS_DATA.defaultQuery;
	let stateCode;
	let callNumber = 1;
	for (let key in STATE_CODE) {
		(function(key, query, stateCode, timeOut, endpoint) {
			if (STATE_CODE[key] < 10) {
				stateCode = '0' + STATE_CODE[key];
			} else {
				stateCode = STATE_CODE[key];
			}
			query.for = `state:${stateCode}`;
			getCensusDataCall(endpoint, query, timeOut, key, callNumber, processCensusDataLoop);
			if (key !== 'Alabama') {
				fillSidebarState(key);
			}
			callNumber++;
		})(key, query, stateCode, timeOut, endpoint);
	};
}

// FEATURE - AJAX ON LOAD

function getCensusDataCall(endpoint, query, timeOut, state, callNumber, callback) {
	console.log(query);
		$.getJSON(endpoint, query, function(data) {
				callback(data, callNumber, state);
		})
			.done(function(data, textStatus, jqXHR) {
		 		// processCensusData(data);
		 	})
		 	.fail(function( jqXHR, textStatus, errorThrown) {
		 		console.log('failed AJAX');
		 		console.log(errorThrown);
		 	})
		 	.always(function( data, textStatus, jqXHR ) { 
		 		console.log('running AJAX'); 
		});
}

function processCensusDataTypes(data) {
	// TODO data[row][0] Only target the columns that need editing
	for (let row = 0; row < data.length; row++) {
		data[row][0] = parseInt(data[row][0]).toLocaleString();
		data[row][1] = parseInt(data[row][1]).toLocaleString();
		data[row][5] = "$" + parseInt(data[row][5]).toLocaleString();
		data[row][7] = "$" + parseInt(data[row][7]).toLocaleString();
		data[row][9] = "$" + parseInt(data[row][9]).toLocaleString();

		data[row][6] = data[row][6] + '%';
		data[row][8] = data[row][8] + '%';
		data[row][10] = data[row][10] + '%';

		data[row][4] = OPTAX[data[row][4]];
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
	// let data = CENSUS_DATA['queryData'];
	let data = CENSUS_DATA['Alabama'];
	CENSUS_DATA['showing'] = 1;
	let columns = renderDataTableTwoHeader(data.splice(0, 1));
	data = processCensusDataTypes(data);
	$('#dataTableTwo').DataTable({
		data: data,
		columns: columns,
		retrieve: true,	
		searching: true,
		"iDisplayLength": 50,
		"sDom": '<"top"ip><"card-block"tr><"card-footer"p>',
		"order": [[0, "desc"]],
		"language": {
			"decimal": ".",
			"thousands": ","
		}
	});
}

function listenToMainReportSubmit() {
	$('.home-search-form').submit(event => {
		console.log('main form submitted');
		event.preventDefault();
		// Might be implemented in the future for more reports
		const reportIndex = $('#reportSelect').find(":selected").val();
		const target = $('#reportSubmitButton').attr('href');
		$('#resultsPage').toggleClass('hidden');
		renderDataTableTwo();
	    $('html, body').stop().animate({
		    scrollTop: $(target).offset().top
	    }, 1500);
	    CENSUS_DATA.submitClicked = true;
		
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

function updateMainDropDown() {
	// const html = getAllReports();
	const html = `<option value="0">${CENSUS_DATA['title']}</option>`;
	$('#reportSelect').append(html);
	fillSidebarState('Alabama', true);
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
	$(listenToSidebarSearch);
	$(listenToSidebarTableLength);
	$(runProcessesOnLoad);
	$(listenToAjaxStop);
	$(listenToSidebarState);
}

$(handleCensus);








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