let timeout;

function displayMessage(message, type, scroll = true) {
	// displays the message with fade pop up and fade out with hide
	const html = `<p class="${type}">${message}</p>`;
	clearTimeout(timeout);
	$('#messageDialog').stop(true, true).hide();
	$('#messageDialog').empty().append(html);
	$('#messageDialog').show();
	console.log(this);
	if (scroll) {
		$('html, body').animate({
	            scrollTop: $('#messageDialog').offset().top
	    }, 500);
	}

	timeout = setTimeout(function() {
		$('#messageDialog').hide(1000);
	}, 2000);
	
}

function changeCanvasSize() {
	console.log('changeCanvasSize running')
	const homeWidth = $('#home').width();
	const homeHeight = $('#home').height();
	console.log('homeWidth: '+homeWidth);
	console.log('homeHeight: '+homeHeight);	
	$('#backgroundParticle').attr('width', homeWidth);
	$('#backgroundParticle').attr('height', homeHeight);
}

// UI UX TABLE RESPONSIVENESS
// STYLING FUNCTIONS
function addStylingClasses() {
	$('table').addClass('table-striped table-bordered table-sm');
}

function sidebarResponsive(viewportWidth = $(window).width()) {
	console.log('sidebarResponsive');
	if (viewportWidth > 1600) {
		$('#sidebarSearch').removeClass('col-lg-4');
		$('#sidebarSearch').addClass('col-lg-12');
		$('#sidebarLength').removeClass('col-lg-4');
		$('#sidebarLength').addClass('col-lg-12');
		$('#sidebarStates').removeClass('col-lg-4');
		$('#sidebarStates').addClass('col-lg-12');
		$('#mainPage').addClass('col-lg-10');
		$('#mainPage').removeClass('col-lg-12');
	} else if (viewportWidth <= 1600) {
		$('#sidebarSearch').addClass('col-lg-4');
		$('#sidebarSearch').removeClass('col-lg-12');
		$('#sidebarLength').addClass('col-lg-4');
		$('#sidebarLength').removeClass('col-lg-12');
		$('#sidebarStates').addClass('col-lg-4');
		$('#sidebarStates').removeClass('col-lg-12');
		$('#mainPage').removeClass('col-lg-10');
		$('#mainPage').addClass('col-lg-12');
	}
}

function listenToViewportChange() {
	let viewportWidth = $(window).width();
	addResponsiveness(viewportWidth);
	$(window).resize(event => {
		console.log('window resizng');
		viewportWidth = $(window).width();
		console.log(viewportWidth);
		addResponsiveness(viewportWidth);
		tableResponsive(viewportWidth);
		sidebarResponsive(viewportWidth);
		changeCanvasSize(viewportWidth);
	});
}

function tableResponsive(viewportWidth = $(window).width()) {
	console.log('tableResponsive running');
	console.log(viewportWidth);
    const table = $('#dataTableTwo').DataTable();
	if (viewportWidth >= 1900) {
		table.columns([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).visible(true, false);
	} else if (viewportWidth < 1900 && viewportWidth > 1100) {
		table.columns([1, 2, 3, 4, 5, 7, 9]).visible(true, false);
		table.columns([0, 6, 8, 10]).visible(false, false);
	} else if (viewportWidth <= 1100 && viewportWidth > 768) {
		table.columns([1, 2, 3, 4, 5, 9]).visible(true, false);
		table.columns([0, 6, 7, 8, 10]).visible(false, false);
	} else if (viewportWidth <= 768 && viewportWidth > 710) {
		table.columns([1, 2, 3, 4, 9]).visible(true, false);
		table.columns([0, 5, 6, 7, 8, 10]).visible(false, false);
	} else if (viewportWidth <= 710 && viewportWidth > 580) {
		table.columns([1, 2, 3, 9]).visible(true, false);
		table.columns([0, 4, 5, 6, 7, 8, 10]).visible(false, false);
	} else if (viewportWidth <= 580) {
		console.log(`less than ${viewportWidth}`);
		table.columns([1, 2, 9]).visible(true, false);
		table.columns([0, 3, 4, 5, 6, 7, 8, 10]).visible(false, false);
	}
	table.columns.adjust().draw( false );
}

function addResponsiveness(viewportWidth = $(window).width()) {
	//listens to the viewport width
	// then adds appropiate classes to the html elements
	// reset
	$('#dataTableTwo_paginate').removeClass('col-lg-6 col-lg-8 col-md-4 col-sd-4 center');
	$('#dataTableTwo_info').removeClass('col-lg-6 col-lg-4 col-md-4 col-sd-4 center');

	$('table').addClass('table table-responsive');
	if (viewportWidth > 1500) {
		$('#dataTableTwo_paginate').addClass('col-lg-6');
		$('#dataTableTwo_info').addClass('col-lg-6');
	} else if (viewportWidth <= 1500 && viewportWidth > 820) {
		$('#dataTableTwo_paginate').addClass('col-md-8');
		$('#dataTableTwo_info').addClass('col-md-4');
	} else if (viewportWidth <= 820) {
		$('#dataTableTwo_paginate').addClass('center');
		$('#dataTableTwo_info').addClass('center');
		$('#dataTableTwo_paginate').addClass('col-lg-8');
		$('#dataTableTwo_info').addClass('col-lg-4');
	}
} // END OF STYLING FUNCTIONS
//______________________________________________________________________


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
	if (currentlyDisplayed) {
		// const divider = `<div class="dropdown-divider"></div>`;
		// $('#sidebarStates').find('.dropdown-menu').empty().append(dropdownItem);
		// $('#sidebarStates').find('.dropdown-menu').append(divider);
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
	$('#dataTableTwo').DataTable().columns.adjust().draw();
}

function loadSidebarAfterClick(state) {
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
		const stateClicked = $(event.currentTarget).text();
		displayMessage(`${stateClicked}'s Economic Census Data has been loaded successfully`, 'success');
		$('#sidebarStatesButton').text(stateClicked);
		loadSidebarClickedTable(stateClicked);
		loadSidebarAfterClick(stateClicked);
	});
} // END OF SIDEBAR STATE FILTER FUNCTIONS 
// __________________________________________________________


// FEATURE - SEARCH
// SIdebar implementation
// Add a search bar that searches for any records in all columns
function listenToSidebarSearch() {
	$('#sidebarSearch').on('keyup', event => {
		const input = $('#sidebarSearch input').val();
		displayMessage(`Displaying results for '${input}'`, 'success');
		$('#dataTableTwo').DataTable().search(input).draw();
	});
}

function listenToSidebarTableLength() {
	$('#sidebarLength').on('click', 'button', event => {
		const input = $(event.currentTarget).text();
		displayMessage(`Now displaying ${input} rows`, 'success');
		$('#dataTableTwo').DataTable().page.len(input).draw();
		$('#sidebarLength').find('button.active').removeClass('active');
		$(event.currentTarget).toggleClass('active');
	});
} // END OF SIDEBAR SEARCH FUNCTIONS
//_________________________________________________________________



// ______________________________________________________________
// PROGRESS BAR FUNCTIONS

function showPleaseWait() {
	$('#pleaseWaitDialog').modal('show');
}

function hidePleaseWait() {
	// $('#pleaseWaitDialog').modal('toggle');
	$('#pleaseWaitDialog').hide();
	$('.modal-backdrop').hide();
	$('.modal-open').css('overflow', 'auto');

}
function progressBarUpdate() {
	const totalCalls = 51;
	const current = CENSUS_DATA.callsDone;
	const percentageDone = Math.ceil((current / 51) * 100);
	if (percentageDone < 15) {
		$('.modal-header').children('h1').text('Firing up systems!');
	} else if (percentageDone >= 15 && percentageDone < 60) {
		$('.modal-header').children('h1').text('Receiving data...');
	} else if (percentageDone >= 60 && percentageDone < 80) {
		$('.modal-header').children('h1').text('Just about done...');
	} else if (percentageDone >= 80 && percentageDone < 100) {
		$('.modal-header').children('h1').text('Almost there...');
	} else if (percentageDone == 100) {
		$('.modal-header').children('h1').text('Data is now ready!');
	}
	$('#progressBar').attr('aria-valuenow', percentageDone);
	$('#progressBar').width(`${percentageDone}%`);
	$('#srOnly').text(`${percentageDone}% Complete`);

}

function listenToAjaxStop() {
	$(document).ajaxStop(function () {
		setTimeout(function() {
			hidePleaseWait();
		}, 1000);
	});
}

function initializeProgressBar() {
	showPleaseWait();

	$('.modal-backdrop').append('<div id="particles-js"></div>');
	particlesJS.load('particles-js', 'assets/particles.json', function() {
	  console.log('callback - particles.js config loaded');
	});

	$('.overlay').append('<div id="backgroundParticle"></div>');
	particlesJS.load('backgroundParticle', 'assets/particlesjs-home-bg.json', function() {
	  console.log('callback - particles.js config loaded');
	});
} // END OF PROGRESS BAR FUNCTIONS
//__________________________________________________________________


//FEATURE - REMOVE DUPLICATES
// Use the array filter function


// FEATURE - Hiding columns based on viewport

function processCensusDataLoop(data, callNumber, state) {
	// Chunked Data for efficiency
	let currentData = data;
	CENSUS_DATA[state] = currentData;
	CENSUS_DATA.callsDone++;
	if (CENSUS_DATA.submitClicked) {
		$('#dataTableTwo').DataTable().rows.add(currentData).draw(false);
	}
	progressBarUpdate();
}

function runProcessesOnLoad() {
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

function listenToPaginationClick() {
	$('#tablePagination').on('click', '.js-pagination-link', function(event) {
		event.preventDefault();
		let elementClicked = checkPageNumber($(event.currentTarget).find('a').text());
		generateTable(0, elementClicked);
		renderTablePagination(CENSUS_DATA['queryData'], elementClicked);
	})
}

/*   _______________________________________
		AJAX CALLS AND DATA PROCESSING   */
function getCensusDataCall(endpoint, query, timeOut, state, callNumber, callback) {
	$.getJSON(endpoint, query, function(data) {
		callback(data, callNumber, state);
	})
		.done(function(data, textStatus, jqXHR) {
		})
		.fail(function( jqXHR, textStatus, errorThrown) {
		 	console.log('failed AJAX');
		 	console.log(errorThrown);
		})
		.always(function( data, textStatus, jqXHR ) { 
		 	console.log('running AJAX'); 
	});
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

function processCensusDataTypes(data) {
	for (let row = 0; row < data.length; row++) {
		data[row][2] = OPTAX[data[row][2]];

		data[row][3] = parseInt(data[row][3]).toLocaleString();
		data[row][4] = parseInt(data[row][4]).toLocaleString();

		data[row][5] = "$" + parseInt(data[row][5]).toLocaleString();
		data[row][7] = "$" + parseInt(data[row][7]).toLocaleString();
		data[row][9] = "$" + parseInt(data[row][9]).toLocaleString();

		data[row][6] = data[row][6] + '%';
		data[row][8] = data[row][8] + '%';
		data[row][10] = data[row][10] + '%';
	
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
//GEO_TTL,NAICS2012_TTL,OPTAX,ESTAB,EMP,RCPTOT,RCPTOT_S,PAYANN,PAYANN_S,PAYQTR1,PAYQTR1_S
function renderDataTableTwo() {
	console.log('renderDataTableTwo running');
	let data = CENSUS_DATA['Alabama'];
	CENSUS_DATA['showing'] = 1;
	let columns = renderDataTableTwoHeader(data.splice(0, 1));
	data = processCensusDataTypes(data);
	$('#dataTableTwo').DataTable({
		data: data,
		columns: columns,
		retrieve: true,	
		searching: true,
		"autoWidth": false,
		columnDefs: [
			{"targets": '_all', visible: true, "createdCell": function(td, cellData, rowData,row, col) {$(td).attr('title', cellData);}}

		],
		"iDisplayLength": 50,
		"sDom": '<"top"ip><"card-block"tr><"card-footer"p>',
		"order": [[1, "desc"]],
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
		const target = $('#reportSubmitButton').attr('href');
		$('#resultsPage').toggleClass('hidden');
		renderDataTableTwo();
	    $('html, body').stop().animate({
		    scrollTop: $(target).offset().top
	    }, 750);
	    CENSUS_DATA.submitClicked = true;
	    tableResponsive();
		addResponsiveness();
		sidebarResponsive();
		setTimeout(function() {
			$('#home').hide();
		}, 750);
		setTimeout(function() {
			displayMessage("Report is now ready<br>Currently viewing Alabama's Economic Census data", 'success', false);
		}, 500);
	});
} 
/*  END OF AJAX CALLS AND DATA PROCESSING   
_____________________________________________*/



/*  HOMEPAGE DROPDOWN MENU  */
function updateMainDropDown() {
	const html = `<option value="0">${CENSUS_DATA['title']}</option>`;
	$('#reportSelect').append(html);
	fillSidebarState('Alabama', true);
}/*- end of HOMEPAGE DROPDOWN MENU */

// MAIN FUNCTION TO HANDLE PROCESSES
function handleCensus() {
	console.log('handleCensus running');
	$(updateMainDropDown);
	$(listenToMainReportSubmit);
	$(listenToSidebarSearch);
	$(listenToSidebarTableLength);
	$(runProcessesOnLoad);
	$(listenToAjaxStop);
	$(listenToSidebarState);
	$(listenToViewportChange);
	$(addStylingClasses);
	$(initializeProgressBar);
	$(changeCanvasSize);
}

$(handleCensus);