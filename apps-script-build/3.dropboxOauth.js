var DROPBOX_CLIENT_ID = 'gcmh6p1ybimrz1s';
var DROPBOX_CLIENT_SECRET = 'yodox58rihu300z';

function authorizeDropbox() {
  resetDropbox()
  let service = getDropboxService_();
  if (!validateService(service)) return
}
/**
 * Reset the authorization state, so that it can be re-tested.
 */
function resetDropbox() {
  getDropboxService_().reset();
}

/**
 * Configures the service.
 */
function getDropboxService_() {
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
  var service = getDropboxService_();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}

function validateService(service) {
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
 * Authorizes and makes a request to the Dropbox API.
 */
function createDropBoxFolderAndGetLink(folderName) {
  let service = getDropboxService_();
  if (!validateService(service)) return

  let folderPath = _createDropboxFolder_(service, folderName)

  let sharableLink = getShareableLinkFromFolderPath(service, folderPath)

  return sharableLink
}

function _createDropboxFolder_(service, folderName) {
  let settings = _getSettings_()
  let url = 'https://api.dropboxapi.com/2/files/create_folder_v2';
  let options = {
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken(),
      'Content-Type': 'application/json'
    },
    'method': 'post',
    'payload': JSON.stringify({
      "path": `${settings.dropboxRootFolder}/${folderName}`
    })
  };

  let response = UrlFetchApp.fetch(url, options);
  let result = JSON.parse(response.getContentText())
  var path = result.metadata.path_display
  return path
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

function testSession2() {
  createDropBoxFolderAndGetLink('test')
}

function testSession() {
  Logger.log(JSON.stringify(PropertiesService.getScriptProperties().getProperties()))
}