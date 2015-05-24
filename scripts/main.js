(function() {
  'use strict';

  var $ = require('jquery');
  var config = require('./config');
  var search = require('./search');

  // 各テキストボックスのEnter押下で検索押下のイベント登録
  $('input[type="text"]').keypress(function(e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
      $('#search-btn').click();
    }
  });

  $('#total-count').text('登録件数：' + records.length + '件');

  // 検索ボタン押下処理
  $('#search-btn').click(function() {
    var $searchResult = $('#search-result').empty();
    var searchResult = search(records, $('#word').val());

    $.each(searchResult, function(i, record) {
      var recordId = ('000000000000' + record.id).slice(-10);
      var tags = "";
      $.each(record.tags, function(i, tag) {
        tags += ('<div class="tag">' + tag + '</div>');
      });
      $searchResult.append('<li><div class="link-block"><a href="' + config.site + '?' + record.record + '" target="_blank">' + recordId + '</a></div>' + tags + '</li>');
    });
    $('#count').text('マッチ件数：' + searchResult.length + '件');
  });
})();
