function steve(){
  var ss_master = SpreadsheetApp.openById('18ri67JywAUeLPnXdgIBh4MdkeriJ6ZdDc7V7lDUAdME')
  var s_folder = DriveApp.getFolderById("1bfZBidXPBWb-xdPJO1tFozr-7bEfdNyb")
  var t_folder = DriveApp.getFolderById("1QMJsVRF3TkodXZuiuffCnX4VfBlFOb9E")

  Logger.log('Executing General Site Visit Data')
}

function globals1(){
   var variables = {
      sheet: 'hello',

   }
   return variables
}

//trying to think through how to assign column descriptors with arrays instead of looping through every row.
//hello :)
//This function adds column identifiers to the passed in sheet (if the columns exist already on the Directory Form and the label hasn't changed)
//The "Column Directory" tab is just manually updated
function setColumnDescriptorsOLD(t_tab,t_col_first,glo){
  
  
   //if a target tab name isn't passed in, quit out
   if (!t_tab){return}
   
   //if starting column isn't passed in, set it to 1
   if (!t_col_first){var t_col_first = 1}
   
   
   //Column Directory Sheet
   var d_tab=glo.sheet_column_directory
   var d_last_row = d_tab.getLastRow()
   var d_range=d_tab.getRange(2,1,d_last_row,4).getValues()
   
   
   //Archive Sheet
   var t_last_col = t_tab.getLastColumn()
   var t_labels_range = t_tab.getRange(2,1,2,t_last_col).getValues()
   var t_label = ""
   var cell = t_tab.getRange(1,1)
                            
   
   
   //Check the labels to see if there is already an exact match on our Column Directory tab
   //Loop through every column label in the raw data sheet
   for (var i = 0; i < t_last_col;i++) {
     t_label = t_labels_range[0][i]  //get the descriptor for each
     
     
     //Loop through every Label currently listed in the directory
     for (var j = 0; j < d_last_row; j++) {
       
       //Check column D for the label to see if it matches the raw data sheet
       if (t_label == d_range[j][3]) { 
         cell = t_tab.getRange(1,i+1)
         cell.setValue(d_range[j][0])
       }
     }
 
   }
 };