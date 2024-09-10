const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

/*

function return model:

Success:
{
  ok: true,
  data: [object | array | string | undefined | any]
}

Failure:
{
  ok: false,
  message: 'fail message',
  data: [object | array | string | undefined | any]
}

*/

export class TodoApi {

  static async getTodoList() {

    await sleep(1500);

    return {
      ok: true,
      data: ['To this', 'Then do this', 'Then do this after']
    };
  }

  static async getTodoById(id) {

    await sleep(1000);

    return {
      ok: true,
      data: {
        todo: 'This is my todo'
      }
    };
  }

  static async saveTodo(todo) {

    await sleep(1000);

    return {
      ok: true,
      data: 'Successfully saved'
    };
  }
}