/**
 * Search file in drive location
 * @return{obj} data file
 * */

const OPENAI_API_KEY = "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";

async function searchFile() {
    const {GoogleAuth} = require('google-auth-library');
    const {google} = require('googleapis');
  
    // Get credentials and build service
    // TODO (developer) - Use appropriate auth mechanism for your app
    const auth = new GoogleAuth({
        keyFile: './credentials.json',
        scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({version: 'v3', auth});
    const files = [];
    try {
      const res = await service.files.list({
        //q: "'1rw7lkHsNKQCw9Cwa-zDW-Ue4UzJrdJ27' in parents",
        q: "'1Prq2ijH8ag_ySAXWi48PcXdP_bX8Ih5i' in parents",
        fields: 'nextPageToken, files(id, name, mimeType)',
        spaces: 'drive',

      });
      Array.prototype.push.apply(files, res.files);
      res.data.files.forEach(function(file) {
        console.log('Found file:', file.name, file.id, file.mimeType);
      });
      return res.data.files;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async function searchFiles(id) {
    const {GoogleAuth} = require('google-auth-library');
    const {google} = require('googleapis');
  
    // Get credentials and build service
    // TODO (developer) - Use appropriate auth mechanism for your app
    const auth = new GoogleAuth({
        keyFile: './credentials.json',
        scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({version: 'v3', auth});
    const files = [];
    try {
      const res = await service.files.list({
        q: "'" + id +"' " + "in parents",
        fields: 'nextPageToken, files(id, name, mimeType)',
        spaces: 'drive',

      });
      Array.prototype.push.apply(files, res.files);
      res.data.files.forEach(function(file) {
        console.log('Found file:', file.name, file.id, file.mimeType);
      });
      return res.data.files;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

/**
 * Downloads a file
 * @param{string} realFileId file ID
 * @return{obj} file status
 * */
async function downloadFile(realFileId) {
    // Get credentials and build service
    // TODO (developer) - Use appropriate auth mechanism for your app
  
    const {GoogleAuth} = require('google-auth-library');
    const {google} = require('googleapis');
  
    const auth = new GoogleAuth({
        keyFile: './credentials.json',
        scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({version: 'v3', auth});
  
    //fileId = realFileId;
    try {
      const file = await service.files.get({
        fileId: realFileId,
        alt: 'media',
      });
      //console.log(ty);
      return file;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async function updateFile(realFileId, newContent) {
    // Get credentials and build service
    // TODO (developer) - Use appropriate auth mechanism for your app
  
    const {GoogleAuth} = require('google-auth-library');
    const {google} = require('googleapis');
  
    const auth = new GoogleAuth({
        keyFile: './credentials.json',
        scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({version: 'v3', auth});
  
    try {
      // convert newContent to a base64 encoded string
  
      // update the file on Google Drive
      const updatedFile = await service.files.update({
        fileId: realFileId,
        media: {
            body: newContent,
            mimeType: 'text/html',
        },
      });
      return updatedFile;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async function createFolder(username,phone) {
    const {GoogleAuth} = require('google-auth-library');
    const {google} = require('googleapis');
  
    const auth = new GoogleAuth({
      keyFile: './credentials.json',
      scopes: 'https://www.googleapis.com/auth/drive',
  });
    const service = google.drive({version: 'v3', auth});
    const fileMetadata = {
      name: username+' '+phone.toString(),
      mimeType: 'application/vnd.google-apps.folder',
      parents: ['1gQ8dFtDYe3mvSFlaX0qp1oPNoffjrct0'],
    };
    try {
      const file = await service.files.create({
        resource: fileMetadata,
        fields: 'id',
      });
      console.log(file.data.id)
      return file.data.id;
    } catch (err) {
      throw err;
    }
  }

  async function createFile(name, phone, email, town, pg, Parent) {
    const {GoogleAuth} = require('google-auth-library');
    const {google} = require('googleapis');
  
    const auth = new GoogleAuth({
      keyFile: './credentials.json',
      scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({version: 'v3', auth});
    const fileMetadata = {
      name: 'info',
      mimeType: 'text/plain',
      parents: [Parent],
    };
    const content = name + '\n' + phone + '\n' + email + '\n' + town + '\n' + pg;
    const media = {
      mimeType: 'text/plain',
      body: content,
    };
    
    try {
      const file = await service.files.create({
        resource: fileMetadata,
        media: media,
      });
      //console.log(`File created: ${file.data.name} (${file.data.id})`);
    } catch (err) {
      console.error(err);
    }
  }
  

  module.exports = { searchFile, downloadFile, searchFiles, updateFile, createFolder, createFile};

  //app.listen(process.env.PORT || 8000);
