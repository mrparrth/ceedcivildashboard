var DROPBOX_CLIENT_ID = 'gcmh6p1ybimrz1s';
var DROPBOX_CLIENT_SECRET = 'yodox58rihu300z';

function authorizeDropbox() {
  resetDropbox()
  let service = _getDropboxService_();
  if (!_validateService_(service)) return
}

function _validateService_(service) {
  if (service.hasAccess()) {
    return true
  }
  else {
    let authorizationUrl = service.getAuthorizationUrl();
    _openLink_(authorizationUrl, customOAuthMessage(), 'Authorize')
    _toast_('Authorize using the prompt')
  }
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function resetDropbox() {
  _getDropboxService_().reset();
}

/**
 * Configures the service.
 */
function _getDropboxService_() {
  return OAuth2.createService('Dropbox')
    .setAuthorizationBaseUrl('https://www.dropbox.com/oauth2/authorize?token_access_type=offline')
    .setTokenUrl('https://api.dropboxapi.com/oauth2/token')
    .setClientId(DROPBOX_CLIENT_ID)
    .setClientSecret(DROPBOX_CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setParam('response_type', 'code');
}

/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  let service = _getDropboxService_();
  let authorized = service.handleCallback(request);

  return HtmlService.createHtmlOutput(authorized?'Success!':'Denied.')
}


function checkFolderExists(service, folderPath) {
  let url = 'https://api.dropboxapi.com/2/files/get_metadata';
  let options = {
    headers: {
      'Authorization': 'Bearer ' + service.getAccessToken(),
      'Content-Type': 'application/json'
    },
    'method': 'post',
    'payload': JSON.stringify({
      "path": folderPath,
      "include_deleted": false
    }),
    'muteHttpExceptions': true
  };

  try {
    let response = UrlFetchApp.fetch(url, options);
    return response.getResponseCode() === 200;
  } catch (e) {
    return false;
  }
}

function getUniqueFolder(service, basePath) {
  if (!checkFolderExists(service, basePath)) {
    return basePath;
  }

  let counter = 1;
  let newPath;
  do {
    newPath = `${basePath}_${counter}`;
    counter++;
  } while (checkFolderExists(service, newPath));

  return newPath;
}

function getShareableLinkFromFolderPath(service, folderPath) {
  url = `https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings`
  headers = {
    "Authorization": "Bearer " + service.getAccessToken(),
    "Content-Type": "application/json",
  }

  payload = {
    "path": folderPath
  }
  options = { headers: headers, method: 'post', payload: JSON.stringify(payload), muteHttpExceptions: true }

  response = UrlFetchApp.fetch(url, options)

  jsonResponse = JSON.parse(response)
  if (jsonResponse.error_summary) {
    return jsonResponse.error.shared_link_already_exists.metadata.url
  }
  else {
    return jsonResponse.url
  }
}

function createDropBoxFolderAndGetLink(folderName, shareWith = null) {
  function cleanFolderName(folderName) {
    const invalidChars = /[\/\\<>:"|?*\u{1F600}-\u{1F64F}]/gu;
    const cleanedName = folderName.replace(invalidChars, '');
    return cleanedName.trim();
  }

  let validFolderName = cleanFolderName(folderName)

  let service = _getDropboxService_();
  if (!_validateService_(service)) return

  let folderPath = _createDropboxFolder_(service, validFolderName)

  let sharableLink = getShareableLinkFromFolderPath(service, folderPath)

  if (shareWith) shareFolderWithEmail(service, folderPath, shareWith)

  return sharableLink
}

function _createDropboxFolder_(service, folderName) {
  let settings = _getSettings_()
  let fullPath = `${settings.dropboxRootFolder}/${folderName}`;

  // Get unique path if folder exists
  let uniquePath = getUniqueFolder(service, fullPath);

  let url = 'https://api.dropboxapi.com/2/files/create_folder_v2';
  let options = {
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken(),
      'Content-Type': 'application/json'
    },
    'method': 'post',
    'payload': JSON.stringify({
      "path": uniquePath
    }),
    'muteHttpExceptions': true
  };

  try {
    let response = UrlFetchApp.fetch(url, options);
    let result = JSON.parse(response.getContentText());
    Logger.log('Created folder: ' + uniquePath);
    return result.metadata.path_display;
  } catch (e) {
    Logger.log('Error creating folder: ' + e.message);
    throw new Error('Failed to create folder: ' + e.message);
  }
}

function waitForAsyncJobComplete(service, jobId) {
  const url = 'https://api.dropboxapi.com/2/sharing/check_share_job_status';
  const options = {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken(),
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({
      "async_job_id": jobId
    }),
    'muteHttpExceptions': true
  };

  // Poll until job completes
  while (true) {
    let response = UrlFetchApp.fetch(url, options);
    let result = JSON.parse(response.getContentText());
    Logger.log('Job status response: ' + response.getContentText());

    if (result['.tag'] === 'complete') {
      return result;
    } else if (result['.tag'] === 'in_progress') {
      Utilities.sleep(1000); // Wait 1 second before checking again
      continue;
    } else {
      throw new Error('Job failed: ' + response.getContentText());
    }
  }
}

function shareFolderWithEmail(service, folderPath, emailAddress) {
  let accessLevel = 'editor';
  let customMessage = 'You have been invited to collaborate on this folder.';

  try {
    // First share the folder
    let shareUrl = 'https://api.dropboxapi.com/2/sharing/share_folder';
    let shareOptions = {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken(),
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify({
        "path": folderPath,
        "acl_update_policy": "editors",
        "force_async": false,
        "member_policy": "anyone",
        "shared_link_policy": "anyone"
      }),
      'muteHttpExceptions': true
    };

    let shareResponse = UrlFetchApp.fetch(shareUrl, shareOptions);
    let shareResult = JSON.parse(shareResponse.getContentText());
    Logger.log('Share response: ' + shareResponse.getContentText());

    // Handle the share result
    let sharedFolderId;
    if (shareResult['.tag'] === 'complete') {
      sharedFolderId = shareResult.shared_folder_id;
    } else if (shareResult['.tag'] === 'async_job_id') {
      // Wait for the async job to complete
      let completeResult = waitForAsyncJobComplete(service, shareResult.async_job_id);
      sharedFolderId = completeResult.shared_folder_id;
    } else if (shareResult.error && shareResult.error['.tag'] === 'already_shared') {
      sharedFolderId = shareResult.error.shared_folder_id;
    } else {
      throw new Error('Unexpected share result: ' + shareResponse.getContentText());
    }

    // Add member using shared_folder_id
    let addMemberUrl = 'https://api.dropboxapi.com/2/sharing/add_folder_member';
    let addMemberOptions = {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken(),
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify({
        "shared_folder_id": sharedFolderId,
        "members": [{
          ".tag": "email",
          "email": emailAddress
        }],
        "quiet": false,
        "custom_message": customMessage,
        "access_level": accessLevel
      }),
      'muteHttpExceptions': true
    };

    let addMemberResponse = UrlFetchApp.fetch(addMemberUrl, addMemberOptions);
    Logger.log('Add member response: ' + addMemberResponse.getContentText());
    Logger.log('Folder shared successfully with ' + emailAddress);
  } catch (e) {
    Logger.log('Error sharing folder: ' + e.message);
  }
}

function deleteDropboxFolder(folderPath) {
  let service = _getDropboxService_();
  if (!_validateService_(service)) return;

  let url = 'https://api.dropboxapi.com/2/files/delete_v2';
  let options = {
    headers: {
      'Authorization': 'Bearer ' + service.getAccessToken(),
      'Content-Type': 'application/json'
    },
    'method': 'post',
    'payload': JSON.stringify({
      "path": folderPath
    }),
    'muteHttpExceptions': true
  };

  try {
    let response = UrlFetchApp.fetch(url, options);
    let result = JSON.parse(response.getContentText());
    Logger.log('Successfully deleted folder: ' + folderPath);
    return result;
  } catch (e) {
    Logger.log('Error deleting folder: ' + e.message);
    throw new Error('Failed to delete folder: ' + e.message);
  }
}

function createProjectFolderStructure(projectFolder, teamEmails) {
  const folderStructure = [
    'Arch Folder',
    'Client Provided Files',
    'MEP folder',
    'Old Archive Folder',
    'Structural Folder'
  ];

  let service = _getDropboxService_();
  if (!_validateService_(service)) return;

  // Create main project folder
  let projectPath = _createDropboxFolder_(service, cleanFolderName(projectFolder));
  console.log(projectPath)
  // // Create subfolders
  // let folderPaths = {};
  // for (let folder of folderStructure) {
  //   let subfolder = `${projectFolder}/${folder}`;
  //   let path = _createDropboxFolder_(service, subfolder);
  //   folderPaths[folder] = path;
  // }

  // Share client folder with anyone (get shareable link)
  let clientFolderLink = getShareableLinkFromFolderPath(
    service,
    folderPaths['Client Provided Files']
  );

  // Share other folders with team emails
  const foldersToShare = [
    'Arch Folder',
    'MEP folder',
    'Old Archive Folder',
    'Structural Folder'
  ];

  for (let folder of foldersToShare) {
    for (let email of teamEmails) {
      shareFolderWithEmail(service, folderPaths[folder], email);
    }
  }

  return {
    projectPath: projectPath,
    clientFolderLink: clientFolderLink,
    folderPaths: folderPaths
  };
}

function cleanFolderName(folderName) {
  const invalidChars = /[\/\\<>:"|?*\u{1F600}-\u{1F64F}]/gu;
  const cleanedName = folderName.replace(invalidChars, '');
  return cleanedName.trim();
}

// Example usage:
function testProjectCreation() {
  let service =_getDropboxService_()
  let settings = _getSettings_()
  const projectName = 'Project_ABC';
  deleteDropboxFolder(`${settings.dropboxRootFolder}/${projectName}`)
  const teamEmails = ['iamparrth@gmail.com', 'erparthas@gmail.com'];

  const result = createProjectFolderStructure(projectName, teamEmails);
  Logger.log('Project created with structure:');
  Logger.log('Project path: ' + result.projectPath);
  Logger.log('Client folder link: ' + result.clientFolderLink);
  Logger.log('All folder paths: ' + JSON.stringify(result.folderPaths, null, 2));
}
