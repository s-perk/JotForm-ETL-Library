/*
Just a script acting as our "globals" that we can call each time we need something
If you don't put variables in a function, GAS just assumes it is accessible everywhere
*/

var ss_bridge = SpreadsheetApp.openById('1V6UzkyQ6CHRN1RbXi039GJzp00QxmW49zIR6T-xlu1g') //This is the Bridge Table in the Master DB

function globals(ss_master){

    // --------------------------------------------------------------------------------------
    //                                    Spreadsheet Stuff               
    // --------------------------------------------------------------------------------------
    //1. Target spreadsheet and Bridge Sheet
    //var ss_master = SpreadsheetApp.openById('1_w-KrXEmYC-dmvo_VH_n7setCA3xWSnrlfLtVApJxNo') //This is the Master Spreadsheet on the TeamDrive which you'll copy data into

    var sheet_master_values = ss_master.getSheetByName('Master Values') //This is the Master Values sheet on the Master Spreadsheet
    var sheet_allRaw = ss_master.getSheetByName("All Raw Values") //This is the All Raw Values sheet on the Master Spreadsheet
    var sheet_column_directory = ss_master.getSheetByName("Column Directory") //This tab contains a directory of all columns currently mapped

    //2. Get some information about the current Archive Sheet and Source spreadsheet by looking at the Master Spreadsheet
    var sheet_jotform_directory = ss_master.getSheetByName('JotForm Version Directory')
    var d_last_row = sheet_jotform_directory.getRange("B1:B").getValues().filter(String).length; //this line finds the last value in Column C for the JotForm Link (get range, get values, filter on a null string, count the number of lines that contain values)
    var archive_number = sheet_jotform_directory.getRange(d_last_row,1).getValues(); //get the version ID from column 1
    var jotform_sheet_ID = sheet_jotform_directory.getRange(d_last_row,3).getValues(); //get the sheet ID from column 3
    var archive_sheet_name = "Archive_v".concat(archive_number);
    var sheet_archive = ss_master.getSheetByName(archive_sheet_name)
    var ss_source = SpreadsheetApp.openById(jotform_sheet_ID); // Source spreadsheet on the Personal Drive





    // --------------------------------------------------------------------------------------
    //                                    Folder Stuff               
    // --------------------------------------------------------------------------------------
    //var s_folder=DriveApp.getFolderById("1y2s42BLPquEW8sBJlM9uws0F9Ij66Xc_") // Source folder on maintenance@allweare.org My Drive
    //var t_folder=DriveApp.getFolderById("1YJLd3J6Cp4Depne2V546E996G8xypkz1") // TeamDrive Folder (Programs > Admin > Database > JotForm Data > Technical Site Visit)

    variables = {
        ss_source:ss_source,
        sheet_master_values:sheet_master_values,
        sheet_allRaw:sheet_allRaw,
        sheet_archive:sheet_archive,
        sheet_jotform_directory:sheet_jotform_directory,
        sheet_column_directory:sheet_column_directory,
        archive_sheet_name:archive_sheet_name
      
    }

    return variables
}
