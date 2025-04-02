function fbGetAll_(url) {
  url += url.includes(`per_page`)
    ? ""
    : (!url.includes("?") ? "?" : (url.endsWith('?') ? '' : '&')) + `per_page=100`;

  let allData = [];
  let hasMoreData;
  let pageCnt = 0;
  let mainDataKey;
  do {
    pageCnt++;
    let response = fbGetRequest_(`${url}&page=${pageCnt}`);
    if (Object.keys(response)[0] == 'response') {
      response = response.response
    }
    if (Object.keys(response)[0] == 'result') {
      response = response.result
    }


    mainDataKey = Object.keys(response).find(key => Array.isArray(response[key]));
    let data = response[mainDataKey];
    if (response.meta) {
      hasMoreData = response.meta.page !== response.meta.pages;
    } else {
      hasMoreData = !!response.page && !!response.pages && response.page !== response.pages;
    }
    allData = [...allData, ...data];
  } while (hasMoreData);

  return { [mainDataKey]: allData };
}
/**
 * Authorizes and makes a request to the Freshbooks API.
 */
function fbGetRequest_(url) {
  let service = getService_();
  if (!validateService_(service)) _toast_("Authorize using the prompt");

  var response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: "Bearer " + service.getAccessToken(),
      "x-api-key": FB_CLIENT_ID,
    },
  });
  // Logger.log(response.getContentText());
  return JSON.parse(response.getContentText());
}

function fbPostRequest_(url, jsonData) {
  let service = getService_();
  let options = {
    method: "post",
    headers: {
      Authorization: "Bearer " + service.getAccessToken(),
      Accept: "application/json",
    },
    contentType: "application/json",
    payload: JSON.stringify(jsonData),
    muteHttpExceptions: true,
  };

  let response = UrlFetchApp.fetch(url, options);

  let result = JSON.parse(response.getContentText());
  Logger.log(JSON.stringify(result, null, 2), false);
  return result;
}


function fbPutRequest_(url, jsonData) {
  let service = getService_();
  let options = {
    method: "put",
    headers: {
      Authorization: "Bearer " + service.getAccessToken(),
      Accept: "application/json",
    },
    contentType: "application/json",
    payload: JSON.stringify(jsonData),
    muteHttpExceptions: true,
  };

  let response = UrlFetchApp.fetch(url, options);

  let result = JSON.parse(response.getContentText());
  // Logger.log(JSON.stringify(result, null, 2), false);
  return result;
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function resetFreshbooks() {
  getService_().reset();
}

/**
 * Configures the service.
 */
function getService_() {
  let service = OAuth2.createService("Freshbooks")
    .setAuthorizationBaseUrl("https://auth.freshbooks.com/oauth/authorize")
    .setTokenUrl("https://auth.freshbooks.com/oauth/token")

    .setClientId(FB_CLIENT_ID)
    .setClientSecret(FB_CLIENT_SECRET)

    .setCallbackFunction("authCallback_")

    .setPropertyStore(PropertiesService.getScriptProperties())

    .setScope(SCOPE);

  return service;
}

function validateService_(service) {
  if (!service.hasAccess()) {
    let authorizationUrl = service.getAuthorizationUrl();
    let template = HtmlService.createTemplate(
      '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
      "Close sidebar when the authorization is complete."
    );
    template.authorizationUrl = authorizationUrl;
    let page = template.evaluate();
    try {
      _openLink_(authorizationUrl, customOAuthMessage(), "Authorize");
    } catch (e) {
      throw `Use this url to validate ${authorizationUrl}`;
    }

    return false;
  }

  return true;
}

/**
 * Handles the OAuth callback.
 */
function authCallback_(request) {
  var service = getService_();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput("Success! You can close this page");
  } else {
    return HtmlService.createHtmlOutput("Denied.");
  }
}

function customOAuthMessage() {
  return `If you unable to authorize, then first add this as redirect uri to the api -> ${OAuth2.getRedirectUri()}`;
}

/**
 * Logs the redict URI to register in the Dropbox application settings.
 */
function logRedirectUri() {
  Logger.log(OAuth2.getRedirectUri());
}

function getAccessToken() {
  Logger.log(
    JSON.stringify(PropertiesService.getScriptProperties().getProperties())
  );
}
