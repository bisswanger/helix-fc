/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */


const createMetadata = (main, document) => {
  const meta = {};

  let title = document.querySelector('[property="og:title"]');
  if (title) {
    meta.Title = title.content.replace(/[\n\t​]/gm, '');
  } else {
    title = document.querySelector('title');
    if (title) {
      meta.Title = title.innerHTML.replace(/[\n\t]/gm, '')
    }
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

    // News pages
    const subtitle = document.querySelector('.mod-stage-info-block h4');
    if (subtitle) {
        meta.Subtitle = subtitle.textContent;
    }

  const date = document.querySelector('.news-list-date');
  if (date) {
    meta.Date = date.textContent;
  }

  const category = document.querySelector('.news-list-category');
  if (category) {
    meta.Category = category.textContent;
  }

  const author = document.querySelector('.news-list-author');
  if (author) {
    meta.Author = author.textContent.replace(/Erstellt von /gm, '');
  }



  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

const correctLinksAndImageReferences = (main, document) => {
  /*
  main.querySelectorAll('a').forEach((a) => {
    if (a.href.startsWith('/')) {
      const ori = a.href;
      const u = new URL(a.href, host);
      if (base && u.pathname.startsWith(base)) {
        u.pathname = u.pathname.substring(base.length);
      }
      u.pathname = u.pathname.replace(/\.html$/, '').toLocaleLowerCase();
      a.href = u.toString();

      if (a.textContent === ori) {
        a.textContent = a.href;
      }
    }
  });*/
  main.querySelectorAll('img').forEach((img) => {
    if (!img.src.startsWith('/') && !img.src.startsWith('http')) {
      img.src = "/" + img.src;
    }
  });
};

const migrateEmbed = (main, document) => {
  main.querySelectorAll('iframe').forEach((iframe) => {
    let src = '';
    let source = '';
    let title = '';
    const normalizedSrc = iframe.src.startsWith('//') ? `https:${iframe.src}` : iframe.src;

    if (normalizedSrc == '') {
      return;
    }

    const sourceUrl = new URL(normalizedSrc);

    if (sourceUrl.hostname === 'www.youtube.com' && sourceUrl.pathname.startsWith('/embed/')) {
      const vid = sourceUrl.pathname.split('/')[2];
      src = `https://www.youtube.com/watch?v=${vid}`;
      source = 'YouTube';
    } else if (sourceUrl.hostname === 'www.instagram.com') {
      src = sourceUrl.toString();
      source = 'Instagram';
    } else if (sourceUrl.hostname === 'platform.twitter.com' && sourceUrl.pathname.startsWith('/embed/')) {
      const usp = new URLSearchParams(normalizedSrc);
      src = 'https://twitter.com/' + usp.get('siteScreenName') + '/status/' + usp.get('id');
      source = 'Twitter';
    } else if (sourceUrl.hostname === 'cdn.jwplayer.com') {
      src = sourceUrl.toString();
      source = 'JWP';
      title = iframe.title;
    } else if (sourceUrl.hostname === 'platform.twitter.com' && sourceUrl.pathname.startsWith('/widgets/widget_iframe')) {
      iframe.parentElement.removeChild(iframe);
      return;
    } else {
      // src = iframe.src;
      console.log('Unknown embed URL: ' + sourceUrl)
    }
    if (src && source) {
      const link = document.createElement('a');
      link.href = src;
      link.innerHTML = src;

      const embedCells = [
        ['Embed'],
        ['Link', link],
        ['Source', source],
      ];

      if (title) {
        embedCells.push(['Title', title]);
      }

      const embedBlock = WebImporter.DOMUtils.createTable(embedCells, document);
      iframe.replaceWith(embedBlock);
    }
  });

  main.querySelectorAll('form').forEach((form) => {
    let src = '';
    let source = '';
    let content = '';
    const normalizedAction = form.action.startsWith('//') ? `https:${form.action}` : form.action;

    if (normalizedAction == '') {
      return;
    }

    if (normalizedAction.endsWith('nc/de/fc-info/news/newsletter/')) {
      return;
    }

    console.log("ACTION: " + normalizedAction);
    const sourceUrl = new URL(normalizedAction);

    if (sourceUrl.hostname === 'www.paypal.com' && sourceUrl.pathname.startsWith('/donate')) {
      src = form.querySelector('input[name="hosted_button_id"]').value;
      source = 'PayPal';
      content = form.innerHTML;
    } else {
      console.log('Unknown form action: ' + sourceUrl)
    }
    if (src && source && content) {
      const link = document.createElement('a');
      link.href = src;
      link.innerHTML = src;

      const embedCells = [
        ['Embed'],
        ['Link', link],
        ['Source', source],
        ['Content', content],
      ];
      const embedBlock = WebImporter.DOMUtils.createTable(embedCells, document);
      form.replaceWith(embedBlock);
    }
  });
  /*
  <form action="https://www.paypal.com/donate" method="post" target="_top"><input type="hidden" name="hosted_button_id" value="THQXVJQBCMK8G"><input type="image" src="/fileadmin/user_upload/Club/Stiftung/PayPal_Spendenbutton1.jpg" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button"><img alt="" border="0" src="https://www.paypal.com/de_DE/i/scr/pixel.gif" width="1" height="1"></form>

   */
}

const removeTrackingPixel = (main, document) => {
  main.querySelectorAll('img').forEach((img) => {
    if (img.src.startsWith('https://ad1.adfarm1.adition.com/') || (img.width == 1 && img.height == 1)) {
      img.parentElement.removeChild(img);
    }
  });
};

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // create the metadata block and append it to the main element
    createMetadata(main, document);

    correctLinksAndImageReferences(main, document);
    removeTrackingPixel(main, document);

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      '#hiddenNav',
      '.mod-breadcrumb',
      '.mod-social-media-bar',
      '.mod-service-bar',
      '.mod-scroll-top',
      '#usercentrics-root',

      // Header block is dynamically generated
      '.mod-stage-info-block',
      '.mod-teaser-media',

      // News Detail Pages
      '.news-list-date',
      '.news-list-category',
      '.news-list-author',

      '.news-single .col-right',
      '.news-backlink-wrap',
      '.news-related-wrap',
      '.article .wrapper:last-child',


        // TODO => REPLACE HEADER IMAGE
    ]);

    migrateEmbed(main, document);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname
      .replace(/\.html$/, '')
      .replace(/\/$/, '')
      .replace(/\/news\/detailseite\/details/, '\/news')
  ),
};