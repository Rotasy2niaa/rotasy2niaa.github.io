# Updating Notes

1. Write the entry as a UTF-8 plain text file in this folder. Use lowercase letters, numbers and hyphens in the filename, for example `2026-11-10-studio-log.txt`.
2. Add an entry to `index.json` with the title, date and exact filename. For the first note, replace the empty array with the example below and edit the values.
3. Save both files and reopen the Notes window. Entries are sorted by date, newest first. Publish both files together when the note is ready to go online.

```json
[
  {
    "title": "Studio log",
    "date": "2026-11-10",
    "file": "2026-11-10-studio-log.txt"
  }
]
```

Use blank lines between paragraphs. The text file contains the entry body. Notes uses the title and date from the index.
