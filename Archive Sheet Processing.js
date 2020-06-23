/*
This script contains the main functions for processing the Archive sheet, including:
    1. Adding column descriptors
    2. Calculate Bridge IDs and Term #s
    3. Highlight any rows that are missing from the Master Values sheet
*/
function processArchiveSheet(ss_master){
  
  var column_Num_bridge = 1
  var column_Num_term = 2

  
  var glo = globals(ss_master)
  var sheet_archive = glo.sheet_archive
  var sheet_master_values = glo.sheet_master_values


  //0. Do some basic initial things (setting headers)
  sheet_archive.getRange(2,column_Num_bridge).setValue('Bridge ID')
  sheet_archive.getRange(2,column_Num_term).setValue('Term #')
  

  //1. Set column descriptors
  setColumnDescriptors(sheet_master_values,sheet_archive)

  var last_row = sheet_archive.getRange("C1:C").getValues().filter(String).length //this line finds the last value in Column C for the JotForm Link (get range, get values, filter on a null string, count the number of lines that contain values)
  var last_row_termID = sheet_archive.getRange("B1:B").getValues().filter(String).length //getting length of column B (Term ID) as well to save some time, so we don't need to calculate the Bridge and Term IDs every time
  
  /*
  The Return function in clasp doesn't like dates, so you need to Convert dates to strings using .toString()
  Otherwise throws an error
  */

  //2. Loop through each row and calculate the Bridge and Term IDs if applicable
  //    Bridge IDs are only currently used for Technical Site Visit Data
  
  for (var row = last_row_termID; row <= last_row; row++) {
    
    //Set bridge ID
    var bridgeID = getBridgeID(row,sheet_archive)
    sheet_archive.getRange(row,column_Num_bridge).setValue(bridgeID)
  
    
    //Set cell to Term ID
    var termID = getTermID(row,sheet_archive)
    sheet_archive.getRange(row,column_Num_term).setValue(termID)
  
  }

  //3. Compare Archive_n and Master Values tabs to see if there are any discrepancies between submissions
  //If there is a submission missing, highlight cells on Archive_n sheet
  highlightMissingSubmissions(sheet_archive,glo.sheet_master_values)
}





//Common function to return a value given a row and descriptor
function getValueFromDescriptor(row,descriptor,sheet_archive){
  var last_column = sheet_archive.getLastColumn()
  var descriptor_list = sheet_archive.getRange(1,1,1,last_column).getValues()
  descriptor_list = descriptor_list[0]//getValues() returns as a nested array - ary[[]], so need to get [0] node
  
  var column = descriptor_list.indexOf(descriptor) 
  if (column < 0){return} //if descriptor doesn't exist just quit out
  column = column + 1 //add 1 because the array starts at 0
  
  //Get the value
  var value = sheet_archive.getRange(row,column).getValue()

  return value

}








/*
Given a row #, find the Bridge ID for this unique location / system combo 
row = row on source sheet you're searching through
*/

function getBridgeID(row,sheet){
  
  if (!sheet){return} //quit out if a sheet isn't passed in

  //Get location ID
  var locID_source = getValueFromDescriptor(row,"SITE_NUM",sheet)

  //Get system ID
  var systemID_source = getValueFromDescriptor(row,"SYSTEM_DESCRIPTION_TEXT",sheet)
  if (!systemID_source){return} //quit out if a system ID doesn't exist (this will be the case for most tables besides Technical Site Visit)

  //Create a unique location:system string
  loc_sys_string_source = locID_source + '-' + systemID_source


  //Check the Bridge table for that unique combo
  var sheet_bridge = ss_bridge.getSheetByName('Bridge')
  var data_bridge = sheet_bridge.getRange(1,1,sheet_bridge.getLastRow(),sheet_bridge.getLastColumn()).getValues()

  //Get the columns in the Bridge Table where Location and System IDs are located (just in case these change)
  for (var i = 0; i < sheet_bridge.getLastColumn(); i++){
    if (data_bridge[0][i] == 'LocId'){var loc_column_Num_bridge = i}
    if (data_bridge[0][i] == 'System Number'){var sys_column_num_bridge = i}
  }


  //Loop through each row and find the Bridge ID
  for (var i = 1; i < sheet_bridge.getLastRow(); i++){
    var locID_bridge = data_bridge[i][loc_column_Num_bridge]
    var systemID_bridge = data_bridge[i][sys_column_num_bridge]
    var loc_sys_string_bridge = locID_bridge + '-' + systemID_bridge

    //Compare with loc-sys combo from the source table
    if (loc_sys_string_bridge == loc_sys_string_source) {
      var bridgeID = data_bridge[i][0]
    }

    
  }
  return bridgeID

}

function getTermID(row,sheet){
  if (!sheet){sheet = sheet_archive} //if sheet isn't passed in, assume it's the latest archive sheet

  //Get visit date
  var date = getValueFromDescriptor(row,"SUBMISSION_DATE",sheet)
  
  //Parse month from first piece of date
  var month = date.split("/")[0]

  //Get Term (call getTerm)
  var term = getTerm(month)

  return term
}












/*
This highlights missing submissions on the Archive sheet
*/
function highlightMissingSubmissions(sheet_archive,sheet_master_values){

  //Get submission IDs from latest archive sheet
  var sub_ary_archive = getSubmissionArray(sheet_archive)

  //Get submission IDs from Master Values Sheet
  var sub_ary_master = getSubmissionArray(sheet_master_values)

  var row = 0
  var last_column_archive = sheet_archive.getLastColumn()
  
  //Loop through each Submission ID in the archive array
  sub_ary_archive.forEach(function(submissionID_archive){
      //If submission isn't on the master sheet, highlight the row in the Archive sheet so you can move it into the Master Value sheet
      row = sub_ary_archive.indexOf(submissionID_archive) + 3

      if (!sub_ary_master.includes(submissionID_archive)){
          sheet_archive.getRange(row,1,1,last_column_archive).setBackgroundColor("#f5e189") //highlight the whole row
      }
      else {
          sheet_archive.getRange(row,1,1,last_column_archive).setBackgroundColor("#ffffff") //clear the highlighting on the whole row
      }
  })
}







/* 
Returns an array of submission IDs in a given sheet 
*/
function getSubmissionArray(sheet){
  if (!sheet){return}
  
  var descriptor_ary = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0]
  var sub_column = descriptor_ary.indexOf("SUBMISSION_ID_NUM") + 1

  if (!sub_column) {return} // if we can't find the subscriptor column, just quit out

  var last_row = sheet.getRange("C1:C").getValues().filter(String).length
  
  var submissionID_array = sheet.getRange(3,sub_column,last_row-2,1).getValues()
  /*
  You need to run the following function on any array of cells that you get from a column to convert it into a one-dimensional array
  If you copy a single column, these are still stored as multi-dimensional arrays (i.e. array = [[4486717054324560907], [4487494376227535778], [4488379344718100899],..])
  You can't use indexOf on this array b/c it doesn't work to find arrays within arrays
  So this wacky little function below converts our array into a simple array of strings (like we're used to dealing with in rows) (i.e. [4486717054324560907, 4487494376227535778, 4488379344718100899,..])
  https://www.youtube.com/watch?v=S5TbN36E8Uw
  */
  submissionID_array = submissionID_array.map(function(r){return r[0]})
  return submissionID_array
}









/*
This function adds column identifiers to the passed in sheet (if the columns exist already on the Directory Form and the label hasn't changed)
The "Column Directory" tab is just manually updated
*/
function setColumnDescriptors(sheet_source,sheet_target) {
  var desc_labels_source = sheet_source.getRange(1,1,2,sheet_source.getLastColumn()).getValues() //array where the first node is an array of descriptors, and second is the array of labels from JotForm
  var desc_labels_target = sheet_target.getRange(1,1,2,sheet_target.getLastColumn()).getValues() //same for the target


  //Loop thru each descriptor in the target array
  // Using the target array, because usually the Archive sheet has more descriptors than the Master Values Sheet (start with the most nodes, identify gaps)
  desc_labels_target[1].forEach(function(label){
    var i = desc_labels_source[1].indexOf(label)
    var j = desc_labels_target[1].indexOf(label)

    //if the index doesn't exist in either array, quit out (shouldn't be hit)
    if ((i<0)&&(j<0)){return}
  
    //if the descriptor doesn't exist in the Master Values sheet, highlight the cell on the Archive sheet and quit out
    //This will serve as a way to flag any additional questions that have been added, which are not yet accounted for on the Master Values sheet
    if (!desc_labels_source[0][i]){
      sheet_target.getRange(1,j+1,1,1).setBackgroundColor("#f5e189") //highlight the whole row
      return
    }
    else {sheet_target.getRange(1,j+1,1,1).setBackgroundColor("#ffffff")} //clear the highlighting
  
  //if we've made it this far, we can set the DESCRIPTOR value of the target sheet to the source sheet's value
  sheet_target.getRange(1,j+1,1,1).setValue(desc_labels_source[0][i]) //set the descriptor value to the new one   
  })
}

















