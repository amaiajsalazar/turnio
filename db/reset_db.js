const loadDatabase = async () => {
    const dbName = "turnio.db";
    const dbAsset = require("./assets/turnio.db");
    const dbUri = Asset.fromModule(dbAsset).uri;
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  
    // Check if the database file already exists
    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    console.log("Database file info:", fileInfo);
  
    // If the file exists, delete it to ensure the new schema is copied
    if (fileInfo.exists) {
      console.log("Deleting existing database file...");
      await FileSystem.deleteAsync(dbFilePath);
    }
  
    // Create directory if it doesn't exist
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "SQLite",
      { intermediates: true }
    );
  
    // Copy the new database file
    console.log("Copying new database file to document directory...");
    await FileSystem.downloadAsync(dbUri, dbFilePath);
    console.log("Database file copied to:", dbFilePath);
  
    return dbFilePath;
  };
  