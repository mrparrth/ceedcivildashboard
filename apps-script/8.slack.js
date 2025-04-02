/**
 * Slack Channel Management Utility
 * Creates and configures a Slack channel with description, bookmarks, and invites users
 */

// Constants
const SLACK_API_BASE_URL = 'https://slack.com/api';
const API_ENDPOINTS = {
  CREATE_CHANNEL: '/conversations.create',
  SET_TOPIC: '/conversations.setTopic',
  SET_PURPOSE: '/conversations.setPurpose',
  ADD_BOOKMARK: '/bookmarks.add',
  SEND_MESSAGE: '/chat.postMessage',
  LOOKUP_USER: '/users.lookupByEmail',
  INVITE_USER: '/conversations.invite'
};

/**
 * Main function to create and configure a Slack channel
 */
function _createSlackChannel(project) {
  let users = project.assignedTo
  let userEmails = new User().getAllUsers().filter(user => users.includes(user.email)).map(user => user.email)

  // Channel configuration
  const config = {
    channelName: `project-${project.projectNumber}`,
    channelTopic: project.projectName,
    channelDescription: project.description,
    emailsToInvite: userEmails,
    bookmarks: [
      {
        title: 'Project Folder',
        url: project.projectFilesFolder
      },
      {
        title: 'Contract Document',
        url: project.contractDocumentUrl
      },
      {
        title: 'Engg Folder',
        url: project.engineeringDropboxLink
      },
      {
        title: 'Mep Folder',
        url: project.mepDropboxLink
      },
      {
        title: 'Drafting Folder',
        url: project.draftingDropboxLink
      },
      {
        title: 'Civil Folder',
        url: project.civilDropboxLink
      },
    ],
    welcomeMessage: `🎉 *Welcome to Project #${project.projectNumber} - ${project.projectName}!* 🎉

                      📢 This channel is your central hub for:
                        • Project updates and milestones
                        • Important announcements 
                        • Team collaboration
                        • Resource sharing`
  };

  config.bookmarks = config.bookmarks.filter(bookmark => !!bookmark.url)

  try {
    // Execute operations in sequence
    const channelId = createChannel(config.channelName);
    setChannelTopic(channelId, config.channelTopic);
    setChannelPurpose(channelId, config.channelDescription);
    inviteUserToChannel(channelId, config.emailsToInvite);
    addBookmarks(channelId, config.bookmarks);
    sendWelcomeMessage(channelId, config.welcomeMessage);

    Logger.log(`Channel "${config.channelName}" (${channelId}) created successfully!`);
    return channelId
  } catch (error) {
    Logger.log(`Error creating channel: ${error.toString()}`);
  }
}

/**
 * Creates a new Slack channel
 * @param {string} channelName - Name of the channel to create
 * @returns {string} The ID of the created channel
 */
function createChannel(channelName) {
  const payload = {
    name: channelName,
    is_private: false
  };

  const response = makeSlackApiCall(API_ENDPOINTS.CREATE_CHANNEL, payload);

  if (!response.ok) {
    let message = `Failed to create channel: ${response.error}`
    throw new Error(message);
  }

  return response.channel.id;
}

/**
 * Sets the topic for a Slack channel
 * @param {string} channelId - ID of the channel
 * @param {string} topic - Topic to set
 */
function setChannelTopic(channelId, topic) {
  const payload = {
    channel: channelId,
    topic: topic.slice(0, 250)
  };

  const response = makeSlackApiCall(API_ENDPOINTS.SET_TOPIC, payload);

  if (!response.ok) {
    let message = `Failed to set topic: ${response.error}`
    throw new Error(message);
  }
}

/**
 * Sets the purpose for a Slack channel
 * @param {string} channelId - ID of the channel
 * @param {string} purpose - Purpose description to set
 */
function setChannelPurpose(channelId, purpose) {
  const payload = {
    channel: channelId,
    purpose: purpose.slice(0, 250)
  };

  const response = makeSlackApiCall(API_ENDPOINTS.SET_PURPOSE, payload);

  if (!response.ok) {
    let message = `Failed to set purpose: ${response.error}`
    throw new Error(message);
  }
}

/**
 * Adds bookmarks to a Slack channel
 * @param {string} channelId - ID of the channel
 * @param {Array} bookmarks - Array of bookmark objects with title and url properties
 */
function addBookmarks(channelId, bookmarks) {
  bookmarks.forEach(bookmark => {
    const payload = {
      channel: channelId,
      title: bookmark.title,
      link: bookmark.url,
      type: 'link'
    };

    const response = makeSlackApiCall(API_ENDPOINTS.ADD_BOOKMARK, payload);

    if (!response.ok) {
      Logger.log(`Warning: Failed to add bookmark "${bookmark.title}": ${response.error}`);
    }
  });
}

/**
 * Sends a welcome message to a Slack channel
 * @param {string} channelId - ID of the channel
 * @param {string} message - Message text to send
 */
function sendWelcomeMessage(channelId, message) {
  const payload = {
    channel: channelId,
    text: message,
    parse: 'full'
  };

  const response = makeSlackApiCall(API_ENDPOINTS.SEND_MESSAGE, payload);

  if (!response.ok) {
    let message = `Failed to send welcome message: ${response.error}`
    throw new Error(message);
  }
}

/**
 * Invites a user to a Slack channel by email
 * @param {string} channelId - ID of the channel
 * @param {string} email - Email address of the user to invite
 */
function inviteUserToChannel(channelId, emails) {
  // Look up user by email
  emails.forEach(email => {
    const lookupUrl = `${SLACK_API_BASE_URL}${API_ENDPOINTS.LOOKUP_USER}?email=${encodeURIComponent(email)}`;
    const lookupOptions = {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + SLACK_BOT_TOKEN
      }
    };

    const lookupResponse = UrlFetchApp.fetch(lookupUrl, lookupOptions);
    const lookupData = JSON.parse(lookupResponse.getContentText());

    if (!lookupData.ok) {
      let message = `Failed to look up user by email: ${lookupData.error}`
      throw new Error(message);
    }

    // Invite user to channel
    const userId = lookupData.user.id;
    const payload = {
      channel: channelId,
      users: userId
    };

    const response = makeSlackApiCall(API_ENDPOINTS.INVITE_USER, payload);

    if (!response.ok) {
      let message = `Failed to invite user: ${response.error}`
      throw new Error(message);
    }
  }
  )
}

/**
 * Makes a call to the Slack API
 * @param {string} endpoint - API endpoint to call
 * @param {Object} payload - Data to send
 * @returns {Object} Parsed JSON response
 */
function makeSlackApiCall(endpoint, payload) {
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + SLACK_BOT_TOKEN
    },
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(`${SLACK_API_BASE_URL}${endpoint}`, options);
  return JSON.parse(response.getContentText());
}

