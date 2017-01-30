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
            getNumPosts(baseUrl, data.nextPageToken);
          } else {
            Session.set('loading', false);
          }
          Session.set('numPosts', Session.get('numPosts') + numPostsPage);
        }
      });
}