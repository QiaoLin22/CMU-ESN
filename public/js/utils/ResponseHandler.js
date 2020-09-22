import { showAlert } from './Alert';

class ResponseHandler {
  static checkStatus(res) {
    if (!res.ok) throw res;
    return res.json();
  }

  static catchError(err, alertElement) {
    if (err instanceof Error) {
      if (alertElement) {
        showAlert(
          alertElement,
          'Error occurred when connecting to server',
          'alert-danger'
        );
      }
    }

    err.json().then(({ error }) => {
      if (alertElement) {
        showAlert(alertElement, error, 'alert-danger');
      }
    });
  }
}

export default ResponseHandler;
