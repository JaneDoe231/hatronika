export class Logger {

  static error(
    component,
    method,
    ex
  ) {

    console.log(component, method, ex);
  }

  static info(obj) {

    // obj can be string or javascript object
  }
}