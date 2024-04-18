exports.getTestMongoose = (req, res) => {
  res.send('GET Mongoose.');
};

exports.getTestMongooseParam = (req, res) => {
  const { params } = req.params;
  res.send('GET Mongoose params: ' + params);
};

exports.postTestMongooseBody = (req, res) => {
  const { body } = req.body;
  res.send('POST Mongoose body: ' + JSON.stringify(body));
};

exports.postTestMongoose = (req, res) => {
  res.send('POST Mongoose.');
};

exports.deleteTestMongoose = (req, res) => {
  res.send('DELETE Mongoose.');
};

exports.putTestMongoose = (req, res) => {
  res.send('PUT Mongoose.');
};
