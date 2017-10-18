const CENSUS_KEY = '9b2b6ee49188c1c9ef44583d8015ae145f796cb8';

let CENSUS_DATA = {
	title: 'Economic Census: Economy-Wide Key Statistics 2012',
	endpoint: 'https://api.census.gov/data/2012/ewks',
	defaultQuery:  {
			get: 'EMP,ESTAB,GEO_TTL,NAICS2012_TTL,OPTAX,PAYANN,PAYANN_S,PAYQTR1,PAYQTR1_S,RCPTOT,RCPTOT_S',
			for: 'state:02',
			NAICS2012: '',
			key: CENSUS_KEY
			},
	queryData: []
}

let OPTAX = {
	'00': 'Wholesale Trade',
	'10': "Merchant wholesalers, except manufacturers' sales branches and offices",
	'20': "Manufacturers' sales branches and offices",
	'99': "Total",
	'A': 'All establishments',
	'T': 'Establishments subject to federal income tax',
	'N': 'Establishments exempt from federal income tax (2002 and earlier)',
	'Y': 'Establishments exempt from federal income tax (Starting in 2007)'
};

let STATE_CODE = {
	'Alabama': 1,
	'Alaska': 2,
	'Arizona': 4,
	'Arkansas': 5,
	'California': 6,
	'Colorado': 8,
	'Connecticut': 9,
	'Delaware': 10,
	'District of Columbia': 11,
	'Florida': 12,
	'Georgia': 13,
	'Hawaii': 15,
	'Idaho': 16,
	'Illinois': 17,
	'Indiana': 18,
	'Iowa': 19,
	'Kansas': 20,
	'Kentucky': 21,
	'Louisiana': 22,
	'Maine': 23,
	'Maryland': 24,
	'Massachusetts': 25,
	'Michigan': 26,
	'Minnesota': 27,
	'Mississippi': 28,
	'Missouri': 29,
	'Montana': 30,
	'Nebraska': 31,
	'Nevada': 32,
	'New Hampshire': 33,
	'New Jersey': 34,
	'New Mexico': 35,
	'New York': 36,
	'North Carolina': 37,
	'North Dakota': 38,
	'Ohio': 39,
	'Oklahoma': 40,
	'Oregon': 41,
	'Pennsylvania': 42,
	'Rhode Island': 44,
	'South Carolina': 45,
	'South Dakota': 46,
	'Tennessee': 47,
	'Texas': 48,
	'Utah': 49,
	'Vermont': 50,
	'Virginia': 51,
	'Washington': 53,
	'West Virginia': 54,
	'Wisconsin': 55,
	'Wyoming': 56
};

const HEADER_TYPE = {
	'EMP': 'integer',
	'ESTAB': 'integer',
	'GEO_TTL': 'string',
	'NAICS2012_TTL': 'string',
	'PAYANN': 'integer',
	'PAYANN_S': 'percent',
	'PAYQTR1': 'integer',
	'PAYQTR1_S': 'percent',
	'RCPTOT': 'integer',
	'RCPTOT_S': 'percent',
	'OPTAX': 'OPTAX'
}

const HEADER = {
	'EMP': 'Total Employees',
	'ESTAB': 'Total Establishments',
	'GEO_TTL': 'State',
	'NAICS2012_TTL': 'NAICS2012',
	'PAYANN': 'Annual Payroll*',
	'PAYANN_S': 'Annual Payroll SD',
	'PAYQTR1': 'Total First Quarter Payroll',
	'PAYQTR1_S': 'First Quarter Payroll SD**',
	'RCPTOT': 'Value of Business Done*',
	'RCPTOT_S': 'Value of Business Done SD**',
	'OPTAX': 'OPTAX'
}

const HEADER_REMARKS = {
	'*': 'Per $1000',
	'**': 'Expressed in Percentage'
}