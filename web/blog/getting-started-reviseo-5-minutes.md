---
title: "Getting Started with Reviseo in 5 Minutes"
date: "27-10-2025"
category: "guide"
author: "Ansh Seghal"
authorLinkedIn: "https://www.linkedin.com/in/ansh-sehgal-623167246/"
authorImage: "/ansh.jpg"
authorRole: "Co-Founder & CEO"
description: "A lightning‑fast setup guide for React, WordPress, and plain HTML sites—plus your first feedback submission."
slug: "getting-started-5-minutes"
---

# Getting Started with Reviseo in 5 Minutes

New to Reviseo? This quick guide gets you from zero to your first annotated feedback in five minutes.

## 1) Create a Project

Sign in to the dashboard and create a project to get your `projectId`.

## 2) Install the Widget

### HTML (any site builder)

```html
<link rel="stylesheet" href="https://reviseo.app/cdn/reviseo.css" />
<script src="https://reviseo.app/cdn/reviseo.js" data-project-id="YOUR_PROJECT_ID" defer></script>
```

### Next.js (App Router or Pages Router)

Add the snippet in your root layout or `_document.tsx`:

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://reviseo.app/cdn/reviseo.css" />
        <script
          src="https://reviseo.app/cdn/reviseo.js"
          data-project-id="YOUR_PROJECT_ID"
          defer
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### WordPress

Use a header/footer plugin or your theme to add the snippet just before `</head>`:

```html
<link rel="stylesheet" href="https://reviseo.app/cdn/reviseo.css" />
<script src="https://reviseo.app/cdn/reviseo.js" data-project-id="YOUR_PROJECT_ID" defer></script>
```

## 3) Invite Your Client

In the dashboard, add your client’s email. They’ll get a magic link invite (optional) and guidance.

## 4) Submit Your First Feedback

Open your site, click the widget, draw on the page to point at an issue, and submit. You’ll see it instantly in your Reviseo project.

## Troubleshooting

- Widget not visible? Confirm the snippet is present and the `data-project-id` matches your dashboard.
- Installed on a CMS? Clear caches/CDN and hard refresh.
- Staging only? Restrict the snippet to staging domains.

That’s it—you’re live. Your next revision round will be dramatically faster.


