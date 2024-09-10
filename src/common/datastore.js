export class DataStore {

  static set(key, value) {

    if (!key) {
      return;
    }

    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static get(key) {

    if (!key) {
      return;
    }

    let val = sessionStorage.getItem(key);

    if (!val) {
      return val;
    }
    
    return JSON.parse(val);
  }

  static clear(key) {

    if (!key) {
      return;
    }

    sessionStorage.removeItem(key);
  }

  static clearAll() {
    sessionStorage.clear();
  }
}