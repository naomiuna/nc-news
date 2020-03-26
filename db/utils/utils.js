exports.formatDates = list => {
  return list.map(item => {
    return { ...item, created_at: new Date(item.created_at) };
  });
};

exports.makeRefObj = (list, key, val) => {
  const result = {};
  list.forEach(item => {
    result[item[key]] = item[val];
  });
  return result;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(({ belongs_to, created_by, ...rest }) => {
    return {
      author: created_by,
      article_id: articleRef[belongs_to],
      ...rest
    };
  });
};
