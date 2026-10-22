Pawprint — Free Bootstrap 5 Animal Rescue Website Template by uiCookies
https://uicookies.com/

Pawprint is a free website template for animal rescues and shelters, built on
Bootstrap 5 for a fictional rescue called Second Chance Animal Rescue. It ships
three pages: a home page with an adopt-a-pet hero and quick search, an adopt page
listing 26 dogs, cats and rabbits with filters, pet profile dialogs and a
four-step adoption application, and a get-involved page for donations, fostering,
volunteer shifts, a supplies wishlist and sponsorship. The design pairs warm
orange and deep teal on cream with Baloo 2 headings and Figtree body text. It is
jQuery-free: every interaction is plain vanilla JavaScript, all content is
visible without JavaScript, and animations respect prefers-reduced-motion.
Free for personal and commercial use. Attribution is optional but always welcome — https://uicookies.com/license/

WHAT'S INSIDE
  index.html            Home: hero + quick search, featured animals, adoption
                        steps, impact numbers, foster/volunteer, happy tails,
                        donate strip, events, newsletter
  adopt.html            All adoptable animals with search, filters and sort,
                        detail dialog with gallery, fees, adoption application
  get-involved.html     Donate, where the money goes, foster sign-up, volunteer
                        roles and shifts, wishlist, sponsorship, FAQ
  css/vendor/           Bootstrap 5.3.8 (minified, self-hosted)
  css/style.css         Template design layer (palette, type, components)
  js/vendor/            Bootstrap 5.3.8 bundle (includes Popper)
  js/main.js            Template behavior — vanilla JavaScript, no jQuery
  img/                  Demo photos (public domain, see CREDITS.txt)
  CREDITS.txt           Source and licence for every demo photo

NOTES
  - Built on Bootstrap 5. No jQuery, no plugin dependencies.
  - Colours, fonts and radii are CSS custom properties at the top of
    css/style.css. Change them there to rebrand every page at once.
  - Each animal is one <article class="pet-card"> in adopt.html. Its data-*
    attributes drive the filters and sorting (species, age, size, good with
    kids/cats/dogs, arrival date, fee); data-photos lists its gallery images and
    data-alts their alt text, separated by "|". When you add an animal, also add
    it to the "Which animal" list in the application form.
  - Deep links: adopt.html?species=cat&age=senior opens the list filtered, and
    adopt.html?pet=maple opens Maple's profile.
  - Forms are front-end only: they validate in the browser and show a success
    message. Point them at your backend, a form service or (for donations) your
    payment provider to make them live.
  - The shortlist and wishlist are saved in the visitor's browser only.
  - Replace the demo photos in img/ with your own animals before launch.
