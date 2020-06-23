/*
This function copies data from the JotForm sheet on the AWA Maintenance's Personal Drive over to the Team Drive (Programs > Admin > Database > Technical Site Visit Data)
This is necessary because JotForm doesn't currently support copying data into a TeamDrive sheet

Explanation of Tabs: 
  Master Values - final staging area - these columns should match the Master DB
      - Data is manually copied into here from the latest Archive sheet
  Archive_vN - a snapshot of how the database looked at that point in time
      - The latest Archive tab is also used as a staging area, and is processed to add Bridge IDs,
        Term IDs, and highlight any rows that are missing from the Master Values tab
  All Raw Values - Just a copy of the latest JotForm database sheet. This sheet has no real purpose 
      right now, but is meant just more as another backup of the most recent set of data
*/

function archiveExcelData(ss_master){

  // 1. Get Target Spreadsheet 
  // This is the Master Staging Spreadsheet (Programs > Admin > Database > Technical Site Visit Data)
  
  // **this step has been moved to the globals sheet**

  // 2. Get preliminary info about source spreadsheet and current Archive Sheet
  // This is stored in the Master Staging Spreadsheet's "JotForm Version Directory tab" 
  //  - We need this directory sheet because every time we update fields in JotForm, it creates a new sheet
  var glo = globals(ss_master) //get a variable of globals to save us some time - can't set object to same name as function
  var sheet_archive = glo.sheet_archive



  // 3. Get values from the Source Spreadsheet
  // Get Source Spreadsheet
  var ss_source = glo.ss_source

  // Get last row and column of source data sheet "Sheet1" where all raw data directly from JotForm flows into
  var sheet_source = ss_source.getSheetByName("Sheet1");
  var s_last_row=ss_source.getLastRow()
  var s_last_column=ss_source.getLastColumn()

  // Get range of data
  var s_range = sheet_source.getRange(1,1,s_last_row,s_last_column).getValues()



  // 3.a. Create a temporary staging area to convert all values to plain text 
  // This is a second sheet on the JotForm Personal Drive sheet called "Plain Text"
  // This is so we don't corrupt the original data coming directly into the form
  if (!ss_source.getSheetByName('Plain Text')) {ss_source.insertSheet('Plain Text',1)} //if a sheet doesn't already exist, create one
  var s_range_plaintext = ss_source.getSheetByName('Plain Text').getRange(1,1,s_last_row,s_last_column)
  s_range_plaintext.setNumberFormat("@") //convert to plain text format before
  s_range_plaintext.setValues(s_range)
  s_range_plaintext.setNumberFormat("@") //convert to plain text format again after setting values, just to be really sure this worked (sometimes the dates get whacked out for some reason)
  s_range_plaintext = s_range_plaintext.getValues() //get actual values
  
  

  


  // 4. Copy data into All Raw Values Sheet
  //  This is just a direct copy of the data (maybe not necessary, but is mostly meant to show a copy of the most current set of data,
  //  with nothing processed, just in case something gets corrupted
  var sheet_allRaw = glo.sheet_allRaw
  var range_allRaw = sheet_allRaw.getRange(1,1,s_last_row,s_last_column);
  range_allRaw.setValues(s_range_plaintext) 



  // 5. Copy data onto Archive_N sheet
  // I'm basically just creating a tab for every version of the JotForm that we have submissions for so that we have a snapshot of each of these in case the Master Sheet gets messed up.
  // If the sheet doesn't exist, create a new one
  if (!sheet_archive){
    var last_sheet = ss_master.getNumSheets() //get last sheet in Spreadsheet so we can just add it way at the end
    var archive_sheet_name=glo.archive_sheet_name
    ss_master.insertSheet(archive_sheet_name,last_sheet);
    sheet_archive = ss_master.getSheetByName(archive_sheet_name)
    //Copy old data from Archive Sheet over (to preserve any updates made)

  }

  // Copy new data over into Archive Sheet
  var range_archive = sheet_archive.getRange(2,3,s_last_row,s_last_column);
  range_archive.setNumberFormat("@") //convert to plain text format before
  range_archive.setValues(s_range_plaintext) 
  range_archive.setNumberFormat("@") //convert to plain text format before
  

  // Hide some tabs
  sheet_allRaw.hideSheet() 
  

  
}








