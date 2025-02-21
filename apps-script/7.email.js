// function sendEmail(emailKey, dataObject) {
//   console.log(`Sending Emails For ${emailKey}`)

//   let emailInfoObject = _getItemsFromSheet_(SpreadsheetApp.getActive().getSheetByName(`Emails`))
//   let emailDetails = emailInfoObject.find(row => row.key == emailKey)

//   let draft = getGmailTemplateFromDrafts_(emailDetails.emailDraftSubject)

//   let emailObject = fillInTemplateFromObject_(draft.message, dataObject)

//   GmailApp.sendEmail(emailDetails.to, emailObject.subject, emailObject.text, {
//     htmlBody: emailObject.html,
//     name: 'Ceed Civil',
//     attachments: emailObject.attachments,
//     inlineImages: emailObject.inlineImages
//   });
// }

function _sendEmail_(draftSubject, sendTo, dataObject) {
  console.log(`Sending Emails For ${draftSubject}`)

  try {
    let draft = getGmailTemplateFromDrafts_(draftSubject)

    let emailObject = fillInTemplateFromObject_(draft.message, dataObject)

    GmailApp.sendEmail(sendTo, emailObject.subject, emailObject.text, {
      htmlBody: emailObject.html,
      from: 'project_coordinator@ceedcivil.com',
      name: 'Ceed Civil Admin',
      attachments: emailObject.attachments,
      inlineImages: emailObject.inlineImages
    });
  } catch (e) {
    console.log(e)
  }
}

/**
   * Get a Gmail draft message by matching the subject line.
   * @param {string} subject_line to search for draft message
   * @return {object} containing the subject, plain and html message body and attachments
  */
function getGmailTemplateFromDrafts_(subject_line) {
  try {
    const drafts = GmailApp.getDrafts();
    const draft = drafts.filter(subjectFilter_(subject_line))[0];
    const msg = draft.getMessage();

    const allInlineImages = draft.getMessage().getAttachments({ includeInlineImages: true, includeAttachments: false });
    const attachments = draft.getMessage().getAttachments({ includeInlineImages: false });
    const htmlBody = msg.getBody();

    const img_obj = allInlineImages.reduce((obj, i) => (obj[i.getName()] = i, obj), {});

    const imgexp = RegExp('<img.*?src="cid:(.*?)".*?alt="(.*?)"[^\>]+>', 'g');
    const matches = [...htmlBody.matchAll(imgexp)];

    const inlineImagesObj = {};
    matches.forEach(match => inlineImagesObj[match[1]] = img_obj[match[2]]);

    return {
      message: { subject: subject_line, text: msg.getPlainBody(), html: htmlBody },
      attachments: attachments, inlineImages: inlineImagesObj
    };
  } catch (e) {
    throw new Error("Oops - can't find Gmail draft");
  }

  /**
   * Filter draft objects with the matching subject linemessage by matching the subject line.
   * @param {string} subject_line to search for draft message
   * @return {object} GmailDraft object
  */
  function subjectFilter_(subject_line) {
    return function (element) {
      if (element.getMessage().getSubject() === subject_line) {
        return element;
      }
    }
  }
}

/**
 * Fill template string with data object
 * @see https://stackoverflow.com/a/378000/1027723
 * @param {string} template string containing {{}} markers which are replaced with data
 * @param {object} data object used to replace {{}} markers
 * @return {object} message replaced with data
*/
function fillInTemplateFromObject_(template, data) {
  // We have two templates one for plain text and the html body
  // Stringifing the object means we can do a global replace
  let template_string = JSON.stringify(template);

  // Token replacement
  template_string = template_string.replace(/{{[^{}]+}}/g, key => {
    return escapeData_(data[key.replace(/[{}]+/g, "")] || "");
  });
  return JSON.parse(template_string);
}

/**
 * Escape cell data to make JSON safe
 * @see https://stackoverflow.com/a/9204218/1027723
 * @param {string} str to escape JSON special characters from
 * @return {string} escaped string
*/
function escapeData_(str) {
  return str.toString()
    .replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
};
