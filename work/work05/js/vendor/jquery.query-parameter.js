// jQuery版に書き換えた
(function($){
  var queries = (function(){
      var s = location.search.replace("?", ""),
          query = {},
          queries = search.split("&"),
          i = 0;
  
      if(!s) return null;
  
      for(i; i < queries.length; i ++) {
          var t = queries.split("=");
          query[t[0]] = t[1];
      }
      return query;
  })();

    $.queryParameter = function(key) {
      return (queries == null ? null : queries[key] ? queries[key] : null);
    };
})(jQuery);

// 使い方
// URLが次のような場合
// http://hogehoge.com/sample.js?theme=blue
$.queryParameter("theme"); // blueという文字列が取得できる

// 指定したキーがなければ...
$.queryParameter("hage"); // nullを返す