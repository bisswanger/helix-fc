
export default async function decorate(block) {
    block.textContent = '';

    // fetch nav content
    const resp = await fetch(`data/homepage.json`, window.location.pathname.endsWith('/nav') ? { cache: 'reload' } : {});

    if (resp.ok) {
        const json = await resp.json();

        if (json && json.data) {
            // Create news DOM
            const newsWrapper = document.createElement('div');
            newsWrapper.className = 'news-wrapper';

            // Create display
            const newsContent = document.createElement('div');
            newsContent.className = 'news-content';
            newsWrapper.append(newsContent);

            const imageLink = document.createElement('a');
            newsContent.append(imageLink);

            const newsImage = document.createElement('img');
            imageLink.append(newsImage);

            const newsInfoWrapper = document.createElement('div');
            newsInfoWrapper.className = 'news-info-wrapper';
            newsContent.append(newsInfoWrapper);

            const newsInfo = document.createElement('div');
            newsInfo.className = 'news-info';
            newsInfoWrapper.append(newsInfo);

            const newsCategory = document.createElement('span');
            newsInfo.append(newsCategory);

            const newsInfoLink = document.createElement('a');
            newsInfo.append(newsInfoLink);

            const newsInfoSubtitle = document.createElement('h4');
            newsInfoLink.append(newsInfoSubtitle);

            const newsInfoTitle = document.createElement('h2');
            newsInfoLink.append(newsInfoTitle);

            // show first news
            newsImage.src = "https://fc.de/" + json.data[0].Teaser;
            newsCategory.innerText = json.data[0].Kategorie + " | " + json.data[0].Datum;
            imageLink.setAttribute("href", "https://fc.de/" + json.data[0].Link);
            newsInfoLink.setAttribute("href", "https://fc.de/" + json.data[0].Link);
            newsInfoSubtitle.innerText = json.data[0].Untertitel;
            newsInfoTitle.innerText = json.data[0].Titel;

            /*
             */

            // Create buttons
            const buttons = document.createElement('div');
            buttons.className = 'carousel-buttons';
            newsWrapper.append(buttons);

            const backButton = document.createElement('button');
            buttons.append(backButton);

            [...json.data].forEach((row, i) => {
                const button = document.createElement('button');
                if (!i) button.classList.add('selected');
                button.addEventListener('click', () => {
                    // selectButton(block, button, row, [...buttons.children]);


                    newsImage.src = "https://fc.de/" + json.data[i].Teaser;
                    newsCategory.innerText = json.data[i].Kategorie + " | " + json.data[i].Datum;
                    imageLink.setAttribute("href", "https://fc.de/" + json.data[i].Link);
                    newsInfoLink.setAttribute("href", "https://fc.de/" + json.data[i].Link);
                    newsInfoSubtitle.innerText = json.data[i].Untertitel;
                    newsInfoTitle.innerText = json.data[i].Titel;

                });
                buttons.append(button);
            });

            const forwardButton = document.createElement('button');
            buttons.append(forwardButton);

            block.append(newsWrapper);
        }

        //  newsWrapper.innerHTML = html;



        /*
        classes.forEach((c, i) => {
          const section = nav.children[i];
          if (section) section.classList.add(`nav-${c}`);
        });

        const navSections = nav.querySelector('.nav-sections');
        if (navSections) {
          // top-level menu
          navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
            if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
            navSection.addEventListener('click', () => {
              if (isDesktop.matches) {
                const expanded = navSection.getAttribute('aria-expanded') === 'true';
                toggleAllNavSections(navSections);
                navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
              }
            });
          });

          // 1st + 2nd level navigation handling
          navSections.querySelectorAll(':scope > ul > li > a, :scope > ul > li > ul > li > a').forEach((navLink) => {
            navLink.addEventListener('click', (event) => {
              if (isDesktop.matches) {
                // Nothing happens on desktop mode
                event.preventDefault();
              } else {
                // Expand/collapse on mobile mode
                const expanded = navLink.getAttribute('aria-expanded') === 'true';
                toggleAllNavSections(navSections);
                navLink.setAttribute('aria-expanded', expanded ? 'false' : 'true');
              }
            });
          });
          */
    }
}
