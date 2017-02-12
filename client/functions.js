getNumPosts = function(baseUrl, page){
  var url = baseUrl + Session.get('blogger-api-key') + '/posts/?key=' + Session.get('auth-key');
  if (typeof page !== 'undefined') {
    url += '&pageToken=' + page;
  }
  console.log(url);
  HTTP.call("GET", url,
      {},
      function (error, result) {
        if (!error) {
          var data = JSON.parse(result.content);
          var numPostsPage = (data.items)?data.items.length:0;
          if (data.nextPageToken) {
            savePostsId(data.items);
            getNumPosts(baseUrl, data.nextPageToken);
          } else {
            Session.set('loading', false);
          }
          Session.set('numPosts', Session.get('numPosts') + numPostsPage);
        }
      });
}

savePostsId = function(posts) {
  posts.forEach(function(element) {
    var post = {
      id: element.id,
      title: element.title,
      published: element.published,
      content: element.content,
      labels: element.labels,
      url: element.url,
      bloggerUrl: element.selfLink
    }
    Posts.insert(post);
  }, this);
}