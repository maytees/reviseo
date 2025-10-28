---
title: "How Reviseo Works: A Complete Guide"
date: "27-10-2025"
category: "product"
author: "Ansh Seghal"
authorLinkedIn: "https://www.linkedin.com/in/ansh-sehgal-623167246/"
authorImage: "/ansh.jpg"
authorRole: "Co-Founder & CEO"
description: "From install to invite to annotated feedback to resolution—see exactly how Reviseo streamlines client collaboration."
slug: "how-reviseo-works"
---

# How Reviseo Works: A Complete Guide

Reviseo helps freelancers and agencies collect crystal‑clear, visual feedback from clients—so revisions take minutes, not days. This guide walks you through the full flow: install → invite → feedback → resolve.

> Target audience: New users evaluating Reviseo or just getting started.

## 1) Install the Widget (60 seconds)

Add the Reviseo script and stylesheet to any website or app you want feedback on. You’ll get a `projectId` in your dashboard.

```html
<link rel="stylesheet" href="https://reviseo.app/cdn/reviseo.css" />
<script
  src="https://reviseo.app/cdn/reviseo.js"
  data-project-id="YOUR_PROJECT_ID"
  defer
></script>
```

Once installed, a small widget button appears for your invited users and clients. Clicking it opens an overlay where they can point, draw, and submit feedback with context.

![Install step screenshot](/cdn/install-step.png)

## 2) Invite Clients (or Teammates)

From your Reviseo dashboard, add your client’s email. They’ll receive a friendly invite explaining how to leave feedback with one click—no account creation friction if you enable magic links.

![Invite modal screenshot](/cdn/invite-step.png)

We recommend including Reviseo in your onboarding email or kickoff call to set expectations that all feedback goes through the widget.

## 3) Collect Visual, Actionable Feedback

Clients click the widget, type a note, and use Excalidraw‑style annotations to circle, point, or highlight areas on the page. Every submission includes:

- Page URL and viewport size
- Full‑page or element‑focused screenshot
- Annotations (arrows, boxes, freehand)
- Structured fields (priority, category) if you enable them

![Annotation screenshot](/cdn/annotation-step.png)

## 4) Triage and Resolve Faster

Inside Reviseo, each submission is a trackable item. Assign owners, set status, and push to your issue tracker if you like. When you ship a fix, mark it resolved—clients get a clear update.

![Triage board screenshot](/cdn/triage-step.png)

## 5) Close the Loop (and Prevent Repeat Work)

Reviseo keeps a history of changes. When questions resurface—“didn’t we fix this?”—you have a source of truth with before/after context and timestamps.

## Embedded Demo

Below is a short demo showing the full install → invite → annotate → resolve loop.

```html
<div style="position:relative;padding-top:56.25%">
  <iframe
    src="https://player.vimeo.com/video/your_demo_id"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
    title="Reviseo Demo"
  ></iframe>
  
</div>
```

## Best Practices

- Set expectations on day one: “All website feedback via the Reviseo widget.”
- Use priorities to batch work. Resolve “quick hits” daily; group bigger items into sprints.
- Keep comments actionable. Encourage clients to point and explain “why,” not just “what.”

## Frequently Asked

**Does Reviseo work with static sites and site builders?** Yes—drop the script on any HTML page. WordPress, Webflow, Shopify, Next.js, and more are supported.

**Is client training required?** Nope. The widget is obvious to use and includes inline hints.

**Can I turn it off in production?** You choose where it runs. Many teams enable it only on staging or password‑protected previews.

---

If you’re ready to try it, install the snippet above and send your first invite. You’ll feel the difference on the very first revision round.


