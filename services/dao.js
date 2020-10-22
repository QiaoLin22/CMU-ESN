class DAO {
  constructor(db) {
    this.db = db;
  }

  get db() {
    return this.db;
  }
}

exports.DAO = DAO;
