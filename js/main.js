//  highlight.js
hljs.initHighlightingOnLoad();

//  skrollr.js
skrollr.init();

$(function (){

  // scrollでコード表示
  var code = $("code#code");
  var text = hljs.highlightAuto(code.text()).value;
  var cursor = "<span id=\"cursor\" />";
  code.html(cursor);


  $(window).bind("scroll", function(){
    scroll = $(this).scrollTop();
    console.log(scroll);
    if (scroll < 6000) {
      code.html(text.substring(0, Math.round(scroll/5)) + cursor);
    }
  });



  // menu link scroll
  var datas = $('#global_menu').dataset;
  var set = function(to, offset){
    $('a[href^=#' + to + ']').click(function() {
      $('html,body').animate({ scrollTop: offset }, 1000);
      return false;
    });
  }

  $(".introduction_link").bind("click", function(){
    set("introduction",0);
  });

  $(".about_link").bind("click", function(){
    set("about",10500);
  });

  $(".skills_link").bind("click", function(){
    set("skills",16500);
  });

  $(".works_link").bind("click", function(){
    set("works",21500);
  });

  $(".contact_link").bind("click", function(){
    set("contact",27000);
  });
});
