//  highlight.js
hljs.initHighlightingOnLoad();

//  skrollr.js
skrollr.init();

$(function (){

  // scrollでコード表示
  var code = $("code#code");
  var text = hljs.highlightAuto(code.text()).value;
  var cursor = "<span class=\"cursor blinking\" id=\"cursor\">|</span>";
  code.html(cursor);


  $(window).bind("scroll", function(){
    scroll = $(this).scrollTop();
    console.log(scroll);
    if (scroll < 6000) {
      code.html(text.substring(0, Math.round(scroll/5)) + cursor);
    }

    if(scroll > 500) {
      $('.scroll_word').removeClass('d_block');
      $('.scroll_word').addClass('d_none');
    }else{
      $('.scroll_word').removeClass('d_none')
      $('.scroll_word').addClass('d_block');
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

  /*$(".contact_link").bind("click", function(){
    set("contact",27000);
  });*/


  //  過去の作品部分
  $('#works .link').on('click', function(){

    $.when(
      $('.sec04').find('.overlay').addClass('a_overlay')
    ).done(function(){
      setTimeout(function(){
        $('.sec04').find('.overlay').children('.overlay__content').fadeIn(1000);
        $('.sec04').find('.overlay').children('.overlay__close').fadeIn(1000);
      },600);

      no_scroll();
    });
  });

  //  オーバレイ表示を閉じる
  $('.overlay__close').on('click', function(){
    $.when(
      $('.sec04').find('.overlay').removeClass('a_overlay'),
      $('.sec04').find('.overlay').addClass('b_overlay')
    ).done(function(){
      $('.sec04').find('.overlay').children('.overlay__content').fadeOut(500);
      $('.sec04').find('.overlay').children('.overlay__close').fadeOut(500);
      setTimeout(function(){
        $('.sec04').find('.overlay').removeClass('b_overlay');
      },800);
    });
    return_scroll();
  });


  //スクロール禁止用関数
  function no_scroll(){
    //PC用
    var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $(document).on(scroll_event,function(e){e.preventDefault();});
    //SP用
    $(document).on('touchmove.noScroll', function(e) {e.preventDefault();});
  }

  //スクロール復活用関数
  function return_scroll(){
    //PC用
    var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $(document).off(scroll_event);
    //SP用
    $(document).off('.noScroll');
  }
});
