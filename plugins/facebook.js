import Vue from 'vue'
import FBSignInButton from 'vue-facebook-signin-button'
Vue.use(FBSignInButton)

let presolve, preject;
let loadFB = new Promise(function(resolve, reject) {
  presolve = resolve;
  preject = reject;
});

Vue.mixin({
  data () {
    return {
      loadFB
    }
  }
})
window.fbAsyncInit = function() {
  FB.init({
    appId      : '145058629529192',
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.11' // use graph api version 2.8
  });
  // Vue.mixin({
  //   data () {
  //     return {
  //       FB
  //     }
  //   }
  // })
  presolve();
};
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
