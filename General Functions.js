/*
Functions that are used in several places that don't quite fit on one of the other scripts
*/

function formatDate(date,addZeros) {
  var d = new Date(date)
  var month = '' + (d.getMonth() + 1)
  var day = '' + d.getDate()
  var year = d.getFullYear()
  
  if (addZeros){
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  }
  return [year, month, day].join('-');
}


/*
Get the month given a date
  Assumes the international date format of DD-MM-YYYY or DD/MM/YYYY
*/
function getMonthFromDate(date){
  var month = ''

  //grab the second piece of the date
  //Also account for different date formats coming in
  if (date.includes('-')) {month = date.split("-")[1]}
  else if (date.includes('/')) {month = date.split("/")[1]} 
  
  return month
}

function getTerm(month){
  //if no month passed in, assume it's today
  if (!month){
    var date = formatDate(Date.now()) //current month
    var month = getMonthFromDate(date)
  }
  
  month = parseInt(month) //convert to a number if it isn't already (make it easy for case statement to read it)
 
  //kinda just guessing on the term visits here depending on the month that they are performed in...
  //Term 1: Feb thru May
  //Term 2: June to August
  //Term 3: Sept to Dec
  //See this google doc for site visit details: https://docs.google.com/document/d/19bwrA7rk2LvlsBKlQFNJaGjqB-JFjRSQ04E1xVXc4fc/edit 
  switch (month) {
    case 1: return "1"; break;
    case 2: return "1"; break;
    case 3: return "1"; break;
    case 4: return "1"; break;
    case 5: return "1"; break;
    case 6: return "2"; break;
    case 7: return "2"; break;
    case 8: return "2"; break;
    case 9: return "3"; break;
    case 10: return "3"; break;
    case 11: return "3"; break;
    case 12: return "3"; break;
    default: return "1"
  }
  
  
}


function addEditorsToFile(){

}

function scrapsteve(){
  var date = '11/7/2019'
  var month = getMonthFromDate(date)

  Logger.log(month)
}