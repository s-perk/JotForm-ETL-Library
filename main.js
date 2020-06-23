/*
Main point of entry for the script
*/
function main(ss_master,s_folder,t_folder){
    //1. Excel Stuff
    archiveExcelData(ss_master)
    processArchiveSheet(ss_master)
    
    //2. PDF Stuff
    archivePDFs(s_folder,t_folder)
  
  }
  