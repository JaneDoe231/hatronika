export class Validations {

  static isValidEmail(email) {

    if (typeof email !== 'string') {
      return false;
    }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  static isValidPhone(phone) {

    if (typeof phone !== 'string') {
      return false;
    }

    const phonePattern = /^\+?\d{1,3}?[-.\s]?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;

    return phonePattern.test(phone);
  }

  static isValidPasswordLength(password) {

    if (typeof password !== 'string') {
      return false;
    }

    if (password.length < 8) {
      return false;
    }

    return true;
  }

  static isValidPasswordUpperLower(password) {

    if (typeof password !== 'string') {
      return false;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    return hasUppercase && hasLowercase;
  }

  static isValidPasswordSymbolNumber(password) {

    if (typeof password !== 'string') {
      return false;
    }

    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    return hasSymbol && hasNumber;
  }
}