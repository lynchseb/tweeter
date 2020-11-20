/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */  

//Helper Functions
const dayConverter = function(milliseconds) {
  let difference = (new Date() - milliseconds);
  let minutes = Math.floor(difference / 60000);
  let hours = Math.round(minutes / 60);
  let days = Math.round(hours / 24);
  const date = {days, hours, minutes};
  return date;
};
console.log("Days since", dayConverter(1461116232227))

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const renderTweets = function(data){
  $(".tweets-container").empty();
  data.forEach((tweets) => {
    const tweet = createTweetElement(tweets)
    $(".tweets-container").prepend(tweet);
  })
}

const createTweetElement = function(tweet) {
  let conversion = dayConverter(tweet.created_at)
  let { days } = conversion;
  return tweet = $(`
  <article class="tweet">
  <header class="articleHead">
    <div class="articleHead">
      <img class="marginRight" src=${tweet.user.avatars} alt="abc">
      <p>${tweet.user.name}</p>
    </div>
    <div class="hiddenName">${tweet.user.handle}</p>
    </div>
  </header>
  <p class="tweetContent">
    ${escape(tweet.content.text)}
  </p>
  <hr />
  <footer>
    <div class="footContent">
      <span>${days} days ago</span>
      <span>
      <i class="fas fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>
      <span/>
    </div>
  </footer>
</article>`); 
}

const loadTweets = function() {
  $.ajax({
    url: '/tweets',
    data: 'json'
  })
  .then(data => {
    renderTweets(data)
  })
}

const isTweetTooLong = function(message) {
return message.length > 140;
}

const isTweetNotValid = function(message) {
 return message === "";
}

const scrollTop = () => {
  $(window).scroll(function() {
   if ($(this).scrollTop() > 300) {
     $(".topBtn").fadeIn();
   } setTimeout(function() {
    if ($(this).scrollTop() < 300){
      $(".topBtn").fadeOut();
    }
   }, 1000)
   
 });
 $(".topBtn").click(function() {
   $('html').animate({scrollTop: 0}, 1000);
   if($(".new-tweet").is(":visible")) {
    $(".new-tweet textarea").focus();
   } else {
     setTimeout(function(){
       $(".new-tweet").toggle("slow");
       $(".new-tweet textarea").focus();
     }, 1000)
   }
 });
}

const navBarToggle = () => {
  $(".rightMenuArrow").click(function() {
    $(".new-tweet").toggle("slow");
    $("textarea").focus();
  });
}
//Main Document
$(document).ready(function() {
 console.log("ready!");

//Tweet Counter
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

//Tweet submission form
  $('#tweet-form').submit(function(event) {
    event.preventDefault();
    const message = $('#tweet-form textarea').val()
    if (isTweetTooLong(message)){
      $(".alert h3").text(`Too long: please remove ${message.length - 140} characters`);
      $(".alert").slideDown('slow');
      setTimeout(function(){
         $(".alert").slideUp('slow');
       }, 8000)
    } else if (isTweetNotValid(message)){
      $(".alert h3").text("Not a valid Tweet");
      $(".alert").slideDown('slow');
      setTimeout(function(){
        $(".alert").slideUp('slow');
      }, 8000)
    } else {
      $.ajax({
        type: 'POST',
        url: '/tweets',
        data: $(this).serialize()
      })
      .then(() => { 
       $(".counter").text(140);
       $("#tweet-form").trigger('reset');
       $(".new-tweet").toggle("slow");
       loadTweets();
       $(".tweet").focus();
      })
    }
  })
// Call functions on Document.ready
loadTweets();
scrollTop();
navBarToggle();
});
 


