import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http'

import './main.html';

Session.set('blogData', {});
Session.set('blogger-api-key', '');
Session.set('auth-key', '');
Session.set('loading', false);

Template.bloggerForm.onCreated(function bloggerFormOnCreated() {
  this.baseUrl = new ReactiveVar('https://www.googleapis.com/blogger/v3/blogs/');
  this.url = new ReactiveVar({
    posts: 'posts/'
  });
});

Template.bloggerForm.helpers({
  bloggerapikey() {
    return Session.get('blogger-api-key');
  },
  authkey() {
    return Session.get('auth-key');
  },
  url() {
    return Template.instance().url.blogs.get();
  },
  loading() {
    return Session.get('loading');
  }
});

Template.bloggerForm.events({
  'click #login'(event, instance) {
    Session.set('loading', true);
    var form = event.target.parentNode;
    Session.set('blogger-api-key', form.querySelector("#blogger-api-key").value);
    Session.set('auth-key', form.querySelector("#auth-key").value);
    var url = instance.baseUrl.get() + Session.get('blogger-api-key') + '/?key=' + Session.get('auth-key');
    console.log(url);
    HTTP.call("GET", url,
      {},
      function (error, result) {
        if (!error) {
          Session.set('loading', false);
          Session.set('blogData', JSON.parse(result.content));
          console.log(result.content);
        }
      });
  }
});

Template.blogData.onCreated(function bloggerDataOnCreated() {
  
});

Template.blogData.helpers({
  blogData() {
    var blogData = {};
    if (Session.get('blogData').name) {
      blogData = Session.get('blogData');
    }
    return blogData;
  }
});

Template.blogData.events({

});