const isValidID = (id) => {
  console.log(id);
  if (id.match(/^[0-9a-fA-F]{24}$/)) return true;
  else return false;
};

// DaTE IS A NUMBER
const isValidDate = (date) => {
  if (typeof date !== 'number') return;
  if (date.toString().match(/([0-9/-])\w+/)) return true;
  else return false;
};

exports.isValidID = isValidID;
exports.isValidDate = isValidDate;
