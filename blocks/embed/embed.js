import { readBlockConfig } from '../../scripts/lib-franklin.js';

const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

export default function decorate(block) {
  const cfg = readBlockConfig(block);

  switch (cfg.source) {
    case 'JWP':
      const jwpIframe = document.createElement('iframe');
      jwpIframe.src = cfg.link;
      jwpIframe.title = cfg.title;
      jwpIframe.scrolling = 'auto';
      jwpIframe.allowfullscreen = '';
      jwpIframe.frameBorder = "0";
      jwpIframe.width = cfg.width || "640";
      jwpIframe.height = cfg.height || "360";
      block.replaceWith(jwpIframe);
      break;
    case 'Twitter':
      const twitterIframe = document.createElement('iframe');
      /*twitterIframe.src = cfg.link;
      twitterIframe.title = cfg.title || "Twitter Tweet";
      twitterIframe.scrolling = 'no';
      twitterIframe.allowtransparency = 'true';
      twitterIframe.allowfullscreen = 'true';
      twitterIframe.frameBorder = "0";
      twitterIframe.width = cfg.width || "550";
      twitterIframe.height = cfg.height || "826";
      block.replaceWith(twitterIframe);*/
      // block.innerHTML = `<blockquote class="twitter-tweet"><a href="${cfg.link}"></a></blockquote>`;

      // block.innerHTML = `<blockquote class="twitter-tweet"><a href="https://twitter.com/fckoeln/status/1605473150623289350?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1605473150623289350%7Ctwgr%5E6014f296a836f38221e18a3b3488fb928d3e8006%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Ffc.de%2Fde%2Ffc-info%2Fnews%2Fdetailseite%2Fdetails%2Fstadtrundfahrt-im-fc-bus-jetzt-anmelden-2%2F"></a></blockquote>`;
      block.innerHTML = `<blockquote class="twitter-tweet"><a href="${cfg.link}"></a></blockquote>`;

      //

      loadScript('https://platform.twitter.com/widgets.js');
      break;

    case 'Instagram':
      const instagramIframe = document.createElement('iframe');
      instagramIframe.src = cfg.link;
      instagramIframe.title = cfg.title || "Twitter Tweet";
      instagramIframe.scrolling = 'no';
      instagramIframe.allowtransparency = 'true';
      instagramIframe.allowfullscreen = 'true';
      instagramIframe.frameBorder = "0";
      instagramIframe.height = cfg.height || "1025";
      instagramIframe.style = "background: white; max-width: 540px; width: calc(100% - 2px); border-radius: 3px; border: 1px solid rgb(219, 219, 219); box-shadow: none; display: block; margin: 0px 0px 12px; min-width: 326px; padding: 0px;";
      block.replaceWith(instagramIframe);
      break;

    default:
      console.log('Unhandled embed: ' + cfg.source)
  }

  console.log(cfg);

  /* change to ul, li */

  /*
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Add link
    const a = document.createElement('a');
    a.innerHTML = row.innerHTML;

    const nodes = a.querySelectorAll('div');
    const last = nodes[nodes.length- 1];


    a.setAttribute('href', last.innerText);
    a.removeChild(last);


    [...a.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    li.append(a);
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
  */
}
