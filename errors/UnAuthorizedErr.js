const STATUS_NOT_AUTH = 401;

class UnAuthorizedErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_NOT_AUTH;
  }
}

module.exports = UnAuthorizedErr;
