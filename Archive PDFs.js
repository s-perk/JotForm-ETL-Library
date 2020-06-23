/*
Move all of the PDFs that are generated in My Drive to the TeamDrive
this function searches through two levels of folders to find the files

Files and folders in Google Drive can be in multiple locations. If you click on the file, you can see all of these locations. 
So "adding" or "removing" is just altering all the places that the file exists. If you truly want to delete it, you can use .setTrashed(true) instead
*/


function archivePDFs(s_folder,t_folder){
  var term = 'Term ' + getTerm()
  
  //If an Archive folder doesn't already exist in the Source drive, create one
  if (!s_folder.getFoldersByName('Archive').hasNext()) {
    s_folder.createFolder('Archive')
  } 

  //Get the actual Archive folder on the personal drive
  a_folder = s_folder.getFoldersByName('Archive').next()
  
  
  

  //Loop through all folders in the Source folder to move them to the TeamDrive folder
  // Structure goes Source folder > Year > Term
  var s_folder_list = s_folder.getFolders() // get all the folders in the new folder
  while (s_folder_list.hasNext()){
    
    //1. "Year" Folder Stuff
    var s_year_folder = s_folder_list.next()
    var d = new Date() //get the current date
    var year = ''+d.getFullYear() //get year from date and convert to string

    
    
    if (s_year_folder.getName() == "Archive") {continue} //don't move the Archive folder
    if (year == "") {continue} // this should never be hit, but don't move anything other than the year folders we care about
    
    
    //Check if a folder with the name of the year exists already in the Archive. If it doesn't, create one
    if (!a_folder.getFoldersByName(year).hasNext()) { 
      a_folder.createFolder(year)
    } 
    
    //Do the same thing for the TeamDrive
    if (!t_folder.getFoldersByName(year).hasNext()) { 
      t_folder.createFolder(year)
    }

    // Get the actual Year folders on each drive
    var a_year_folder = a_folder.getFoldersByName(year).next() //get the folder by that name
    var t_year_folder = t_folder.getFoldersByName(year).next() //get the folder by that name
    
    
    //2. "Term" Folder Stuff
    //Check if a Term folder exists in the TeamDrive. Create one if it doesn't.
    if (!t_year_folder.getFoldersByName(term).hasNext()) { 
      t_year_folder.createFolder(term)
    }
    

    //Get the TeamDrive term folder (Source > Year > Term)
    var t_term_folder = t_year_folder.getFoldersByName(term).next()
    
   
    //Add the folder (and files) to the Archive
    //Moving the folder also moves all files
    a_year_folder.addFolder(s_year_folder)
    
    
    //Loop through files and only move the report to the TeamDrive
    var s_file_list = s_year_folder.getFiles()
    while (s_file_list.hasNext()){
      var file = s_file_list.next()

      if (file.getName().indexOf(".pdf")<0) {continue}  // only move the pdfs to the TeamDrive - this is a weird way of checking if the string is contained in the name of the file
      
      t_term_folder.addFile(file)
    }
    
    s_folder.removeFolder(s_year_folder)//finally, remove the folder from the source drive
  }
}






