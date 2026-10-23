# Leo’s World — relationship atlas

A responsive, buildless static web app. The `dist/` directory is GitHub Pages-ready: upload `index.html`, `styles.css`, `roster.js`, and `app.js` together. No Node build or package install is required.

## Data model

The five Google Sheet tabs are `Characters`, `Relationships`, `Events`, `Games`, and `History`, with headers matching the specification. The initial roster has **148 relationships plus the separate Leo profile**. All Events, Games, and History rows start empty. IDs are permanent: do not renumber them.

- Characters: `ID, Name, Franchise, Group, Relationship Status, Image URL, Description, Notes, Sort Order`
- Relationships: `ID, Character A, Character B, Status, Start Date, End Date, Notes`
- Events: `ID, Date, Sequence, Type, Action, Description, Participants, Person A, Person B, Initiator, Recipient, Game, Notes`
- Games: `Game ID, Game Name, Description, Participants, Status, Notes`
- History: `Character A, Character B, Relationship Fact, Description, Notes`

All person-reference columns store **character IDs**, not names. `Participants` uses `|` separators, e.g. `char-leo|char-1-001`. Unknown dates stay blank; sequence preserves order. Do not invent events for relationship status, and do not duplicate a game-based event in the Events tab.

## Google Sheets

Native Google Sheet: https://docs.google.com/spreadsheets/d/137j12KdGBX_GJnZ5C0peAsoClbz33hG_pudKSCXDBKo/edit

ChatGPT can use its Google Drive / Sheets connector to append or edit records when connected. For a natural-language update, request a specific change (e.g. “Record Leo kissed Yor, initiated by Leo, sequence 1, unknown date”) and require that ChatGPT read the updated range back before confirming. For an actual romantic or sexual event, establish adult ages where needed. The web app never assumes events occurred based on statuses.

### Optional live reading on the website

A static GitHub Pages site cannot access a private Google Sheet just because its owner is signed in to ChatGPT. The optional `GoogleSheetsBridge.gs` provides **read-only** website access:

1. Open the Sheet, choose **Extensions → Apps Script**.
2. Replace the editor contents with `GoogleSheetsBridge.gs`, save, and deploy as **Web app** (execute as you).
3. Choose deployment access deliberately. **Anyone with the public endpoint URL can read the data if access is public.** This includes intimate history. Do not deploy publicly unless you accept that exposure.
4. Copy the resulting `/exec` HTTPS URL. In Leo’s World, open **Dashboard → Connect Google Sheet** and paste it into the read-endpoint field.
5. Use the **Refresh** button. A successful validated response shows *Live read*. Failed refreshes retain your snapshot and display an error.

The bridge is read-only by design. Website edits remain local until you export/import records or have ChatGPT write matching records to Google Sheets. A local upload stays local; host selected images in a durable repository/assets URL for cross-device use. Never share access tokens in page JavaScript.

### Natural-language record procedure

For every new event, resolve each named character to an exact `ID` from Characters. Generate a new UUID-like `evt-...` ID, record one Events row, and preserve the sequence/date precisely. If the event occurred in a game, put that game's name in the same Events row: the app will surface it in both tabs automatically. Read the inserted row back to confirm. To change status, edit `Characters.Relationship Status` and the appropriate `Relationships.Status`; never remove Events/History rows.

## Local persistence, backups and pictures

Edits in the app use browser storage for local durability. Dashboard supports JSON export, merge-import, or confirmed replacement. Save backups regularly, especially before clearing browser data or switching phones. URL artwork is saved for that browser and exported with JSON. Phone uploads are resized for browser storage and explicitly labeled local-only. In Picture studio, you can search anime/Wikimedia suggestions (manual identity verification required), preview direct URLs, and assign one selected default portrait consistently throughout the site.

The app starts with placeholders whenever images have not been chosen. It does not fabricate character portraits or substitute a random fictional character for Leo.

## Publish on GitHub Pages

1. Create a GitHub repository, e.g. `leos-world`.
2. Copy the **contents** of `dist/` to the repository root (or commit them to a `docs/` folder).
3. In **Settings → Pages**, select **Deploy from a branch**, branch `main`, and folder `/ (root)` (or `/docs`).
4. Save. Wait for GitHub's published URL. HTTPS is required for normal browser storage and external image/API requests.
5. Keep all four static files together. The page intentionally needs no build tool or backend.

For private personal data, avoid publishing the live Sheet endpoint if public access would expose records. A private hosted copy plus manual JSON exchange is safer than a public Sheet bridge.

## Testing checklist

- The initial group counts and order match source lists, all statuses preloaded, no example events.
- Every portrait slot fails gracefully; Pictures supports URL preview/selection, image search suggestions, and phone upload.
- Event modal can record two-person or multi-person actions; `Sex`/`Oral` and sexual-touch categories reject unconfirmed-adult participants.
- Game interactions use the same Events records as Intimacy and Timeline.
- JSON backup round-trip preserves IDs and data; remote refresh merges IDs and does not clear local-only rows.
- iPhone 390 × 844 and narrow 320 px layouts: safe top/bottom padding, seven scrollable bottom nav icons, no overflow.
