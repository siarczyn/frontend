import Keycloak from 'keycloak-js';

let keycloak: Keycloak | undefined;

const initKeycloak = (): Keycloak => {
  if (!keycloak) {
    keycloak = new Keycloak({
      realm: 'frontend',
      url: 'https://maski.strupino.pl/auth',
      clientId: 'front'
    });
  }
  return keycloak;
};

export default initKeycloak;