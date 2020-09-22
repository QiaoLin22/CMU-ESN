class Alert {
  static showAlert(alertElement, text, alertClass) {
    alertElement.text(text);
    alertElement.attr('class', `alert ${alertClass}`);
    alertElement.attr('hidden', false);
  }

  static hideAlert(alertElement) {
    alertElement.attr('hidden', true);
  }
}

export default Alert;
