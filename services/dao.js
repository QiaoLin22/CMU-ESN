class DAO {
  constructor(_db) {
    this.db = _db;
  }

  get db() {
    return this.db;
  }

  set db(_db) {
    this.db = _db;
  }
}

module.exports = new DAO();
