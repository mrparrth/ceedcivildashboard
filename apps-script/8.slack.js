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
  console.log(`Creating slack channel for project ${project.projectName}`)
  let settings = _getSettings_(CONFIG.SETTINGS)
  
  let commonEmailsForEverySlackChannel = settings.commonEmailsForEverySlackChannel.split(',').map(email => email.trim())
  let userEmails = new User().getAllUsers()
    .filter(user => user.manager?
      project.assignedTo.includes(user.manager):
      project.assignedTo.includes(user.name))
    .map(user => user.slackAlias)
    .filter(email => email)

  // Channel configuration
  const config = {
    channelName: formatChannelName(project.projectNumber, project.projectName),
    channelTopic: project.projectName,
    channelDescription: project.description,
    emailsToInvite: [...commonEmailsForEverySlackChannel, ...userEmails],
    bookmarks: [
      {
        title: 'Go To Project Folder',
        url: project.projectFilesFolder
      }
    ],
    welcomeMessage: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `🎉 *Welcome to Project #${project.projectNumber} - ${project.projectName}!* 🎉`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<${project.projectFilesFolder}|📁 Go to project folder>`
          }
        }
      ],
      parse: 'full'
    }
  };

  config.bookmarks = config.bookmarks.filter(bookmark => !!bookmark.url)

  try {
    // Execute operations in sequence
    const channelId = createChannel(config.channelName);
    setChannelTopic(channelId, config.channelTopic);
    if(config.channelDescription)
      setChannelPurpose(channelId, config.channelDescription);
    inviteUsersToChannel(channelId, config.emailsToInvite);
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
  console.log(`Creating slack channel ${channelName}`)
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
  console.log(`Setting topic for channel ${channelId} to ${topic}`)
  const payload = {
    channel: channelId,
    topic: topic.slice(0, 250)
  };

  const response = makeSlackApiCall(API_ENDPOINTS.SET_TOPIC, payload);

  if (!response.ok) {
    let message = `Failed to set topic: ${response.error}`
    console.error(message)
  }
}

/**
 * Sets the purpose for a Slack channel
 * @param {string} channelId - ID of the channel
 * @param {string} purpose - Purpose description to set
 */
function setChannelPurpose(channelId, purpose) {
  console.log(`Setting purpose for channel ${channelId} to ${purpose}`)
  const payload = {
    channel: channelId,
    purpose: purpose.slice(0, 250)
  };

  const response = makeSlackApiCall(API_ENDPOINTS.SET_PURPOSE, payload);

  if (!response.ok) {
    let message = `Failed to set purpose: ${response.error}`
    console.error(message)
  }
}

/**
 * Adds bookmarks to a Slack channel
 * @param {string} channelId - ID of the channel
 * @param {Array} bookmarks - Array of bookmark objects with title and url properties
 */
function addBookmarks(channelId, bookmarks) {
  console.log(`Adding bookmarks to channel ${channelId}, ${JSON.stringify(bookmarks)}`)
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
  console.log(`Sending welcome message to channel ${channelId}, ${JSON.stringify(message)}`)
  let payload = message
  payload.channel = channelId

  const response = makeSlackApiCall(API_ENDPOINTS.SEND_MESSAGE, payload);

  if (!response.ok) {
    let message = `Failed to send welcome message: ${response.error}`
    console.error(message)
  }
}

function sendTextMessage(channelId, message) {
  console.log(`Sending message to channel ${channelId}, ${JSON.stringify(message)}`)
  const payload = {
    channel: channelId,
    text: message,
    parse: 'full'
  };

  const response = makeSlackApiCall(API_ENDPOINTS.SEND_MESSAGE, payload);

  if (!response.ok) {
    let message = `Failed to send message: ${response.error}`
    console.error(message)
  }
}

/**
 * Invites a user to a Slack channel by email
 * @param {string} channelId - ID of the channel
 * @param {array} slackAliasEmails - Array of slack alias and email addresses of the users to invite
 */
function inviteUsersToChannel(channelId, slackAliasEmails) {
  console.log(`Inviting users to channel ${channelId}, ${JSON.stringify(slackAliasEmails)}`)

  // Look up user by email
  slackAliasEmails.forEach(slackAliasEmail => {
      const lookupUrl = `${SLACK_API_BASE_URL}${API_ENDPOINTS.LOOKUP_USER}?email=${encodeURIComponent(slackAliasEmail.trim())}`;
      const lookupOptions = {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + SLACK_BOT_TOKEN
        }
      };

      const lookupResponse = UrlFetchApp.fetch(lookupUrl, lookupOptions);
      const lookupData = JSON.parse(lookupResponse.getContentText());

      if (!lookupData.ok) {
        let message = `Failed to look up user by email ${email}: ${lookupData.error}`
        console.error(message)
      }

      // Invite user to channel
      const userId = lookupData.user.id;
      const payload = {
        channel: channelId,
        users: userId
      };

      const response = makeSlackApiCall(API_ENDPOINTS.INVITE_USER, payload);

      if (!response.ok) {
        let message = `Failed to invite user ${email}: ${response.error}`
        console.error(message)
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

function formatChannelName(projectNumber, projectName) {
  return `${projectNumber}-${projectName}`
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '\$1 $2')
    .replace(/\s+/g, ' ')
    .slice(0, 35)
    .trim()
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9\-_]/gi, '')
    .toLowerCase()
}

function getIcon(status) {
  if (!status) return "🔄";
  const statusIcons = {
    "hold": "⏸️",
    "pending start": "🚦",
    "in work": "👷‍♂️",
    "for ryan": "👨‍💼",
    "review": "🔎",
    "sent to client": "📤",
    "pending s&s": "⏳",
    "rework/updates": "🔄",
    "submitted for permit": "📝",
    "completed": "✅",
    "final": "🏁",
    "cancelled": "❌",
    "canceled": "❌" // U.S. spelling
  };
  return statusIcons[status.toLowerCase().trim()] || "🔄";
}
