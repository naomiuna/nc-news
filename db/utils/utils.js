exports.formatDates = list => {
  return list.map(item => {
  return {...item, created_at: new Date(item.created_at)}
  })
};

exports.makeRefObj = (list, key, val) => {
  const result = {};
  list.forEach(item => {
    result[item[key]] = item[val];
  })
  return result;
};

exports.formatComments = (comments, articleRef) => {
  // if (comments.length === 0) return [];
  // const { belongs_to, created_by, ...rest } = comments[0];
  // result = [{...rest}];
  // result[0].author = created_by;
  // result[0].article_id = articleRef[belongs_to]
  // return result;
  return comments.map(({ belongs_to, created_by, ...rest }) => {
    return {
      author: created_by,
      article_id: articleRef[belongs_to],
      ...rest
    }
  })
};
