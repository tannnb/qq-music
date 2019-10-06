module.exports = {
  returnBody(status, data = null) {
    this.status = status;
    this.body = data;
  },
};
