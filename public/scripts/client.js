/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
 console.log("ready!");

  $("#tweet-form textarea").on('input', function() {
    const tweetLength = this.value.length;
    $(this).parent().find(".counter").text(140 - tweetLength);
    const charsLeft =  $(this).parent().find(".counter").text();
    if (charsLeft < 0) {
      $(this).parent().find(".counter").text(charsLeft).css("color", "red");
    } else {
      $(this).parent().find(".counter").text(charsLeft).css("color", "black");
    }
  });

  // loadTweets();
});
 


