/**
 * Leo's World — OPTIONAL READ-ONLY Google Sheets bridge.
 *
 * Install as a bound Apps Script on the Leo's World Google Sheet.
 * Deploy as a web app, execute as you. The site calls this via JSONP.
 *
 * PRIVACY WARNING: Anyone who can use the deployed URL can read the
 * entire relationship / event dataset if the deployment permits public access.
 * Never put secrets in this sheet or script. For sensitive data, do not
 * enable a public deployment; use manual JSON backups instead.
 */
const LEO_TABS = ['Characters', 'Relationships', 'Events', 'Games', 'History'];

function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || '');
  if (!/^[A-Za-z_$][A-Za-z0-9_$]{0,90}$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback')
      .setMimeType(ContentService.MimeType.TEXT);
  }
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const data = {};
  for (const tab of LEO_TABS) {
    const sheet = spreadsheet.getSheetByName(tab);
    if (!sheet) throw new Error('Missing required tab: ' + tab);
    const values = sheet.getDataRange().getDisplayValues();
    const headers = values[0] || [];
    data[tab.toLowerCase()] = values.slice(1).filter(row => row.some(String))
      .map(row => Object.fromEntries(headers.map((heading, i) => [heading, row[i] || ''])));
  }
  const payload = JSON.stringify(data).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return ContentService.createTextOutput(callback + '(' + payload + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
