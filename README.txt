BHASHI CREATIONS | COMING SOON PAGE
===================================

A single static page (index.html + assets/) with a live countdown to:

    25 November 2026, 6:30 PM Sri Lanka time (UTC+05:30)

The countdown is fixed to that exact moment, so it is correct for visitors in any
timezone.

When the countdown reaches zero, the page switches to "The wait is over" and refreshes
itself every 2 minutes. Once the main website replaces this page on the same
domain, that refresh takes visitors straight to the new site.


HOW TO PUBLISH
--------------
Upload the whole folder (index.html and the assets folder) to any web host.

Vercel:   vercel.com > Add New > Project > drag in this folder (or run `npx vercel`
          inside it). No build settings are needed.
Netlify:  app.netlify.com/drop > drag in this folder.
cPanel:   upload the contents into public_html.


BEFORE YOU PUBLISH (optional)
-----------------------------
Social link previews (WhatsApp, Facebook, X) need a full image address.
In index.html, change
    <meta property="og:image" content="assets/banner.jpg" />
to your real domain, for example
    <meta property="og:image" content="https://yourdomain.com/assets/banner.jpg" />


PREVIEW THE "WE'RE LIVE" SCREEN
-------------------------------
Open the page with #launched at the end of the address, e.g.
    https://yourdomain.com/#launched
then refresh. Visitors never see this unless they add #launched themselves.


CHANGE THE LAUNCH TIME
----------------------
In index.html, search for 2026-11-25T18:30:00+05:30 and edit the date and time.
Keep +05:30 at the end so it stays in Sri Lanka time. Also update the date line
"25.11.2026 · 6:30 PM Sri Lanka" shown under the countdown.


Web solutions by Craxe | www.craxe.org
