# Course Import / Export

Staff users can import and export courses as JSON via the Course Builder at `/course-builder`.

## JSON Structure

The import and export use the same shape. Every field is required unless noted.

```typescript
{
  // ── Course ──────────────────────────────────────────────────
  "title":        string,            // required, trimmed
  "description":  string,            // required, max 255 chars
  "instructor":   string,            // required
  "thumbnail":    string,            // URL or empty string
  "length":       number,            // total duration in seconds, >= 0
  "categoryId":   number | null,     // FK → categories.id; must be non-null on import
  "categoryName": string | omitted,  // export-only, informational

  // ── Modules (ordered) ──────────────────────────────────────
  "modules": [
    {
      "title":   string,  // module heading
      "lessons": [        // ordered
        {
          // ── Lesson ──────────────────────────────────────────
          "title":     string,
          "length":    number,  // seconds, >= 0
          "contentMd": string,  // markdown body

          // ── Challenge questions (ordered) ──────────────────
          "challengeQuestions": [
            {
              "questionText":  string,
              "type":          "multiple_choice" | "flag",
              "correctAnswer": string | null,     // used when type = "flag"
              "options": [                        // used when type = "multiple_choice"
                {
                  "optionText": string,
                  "isCorrect":  boolean          // at least one should be true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Export

1. Go to **Course Builder** (`/course-builder`).
2. Select a course from the dropdown.
3. Click **Export** in the left sidebar.
4. A `course-<id>.json` file is downloaded.

The export route (`GET /course-builder/:courseId/export`) is a resource route outside the layout hierarchy — it returns raw JSON with a `Content-Disposition: attachment` header. Only staff users can access it.

## Import

1. Go to **Course Builder** (`/course-builder`).
2. Click **Import** in the left sidebar.
3. Select a `.json` file from your machine.
4. The course is inserted into the database and the builder loads it for editing.

A new course is always created — the import does **not** update an existing course. Only staff users can import.

## Related Files

| File                                                       | Purpose                                              |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| `app/.server/queries/course-export.ts`                     | Fetches full course tree + challenge data for export |
| `app/routes/CourseExport.ts`                               | Resource route handler for export                    |
| `app/routes.ts:13`                                         | Route manifest entry                                 |
| `app/components/course-builder/CourseBuilderWorkspace.tsx` | Import/Export UI buttons                             |
| `app/pages/CourseBuilder.tsx`                              | Action handler for `intent=import-course`            |
