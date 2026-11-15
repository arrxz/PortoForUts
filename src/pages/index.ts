import { initHome, destroyHome } from './home';
import { initAbout, destroyAbout } from './about';
import { initWork, destroyWork } from './work';
import { initContact, destroyContact } from './contact';

export function initPage(namespace: string, container: HTMLElement) {
  switch (namespace) {
    case 'home':
      initHome(container);
      break;
    case 'about':
      initAbout(container);
      break;
    case 'work':
      initWork(container);
      break;
    case 'contact':
      initContact(container);
      break;
    default:
      initHome(container);
      break;
  }
}

export function destroyPage(namespace: string) {
  switch (namespace) {
    case 'home':
      destroyHome();
      break;
    case 'about':
      destroyAbout();
      break;
    case 'work':
      destroyWork();
      break;
    case 'contact':
      destroyContact();
      break;
    default:
      destroyHome();
      break;
  }
}
