(function() {
  'use strict';

  var $ = require('jquery');
  var config = require('./config');
  var records = require('./data').records;
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
    var searchResult = search();

    $.each(searchResult, function(i, record) {
      var recordId = ('000000000000' + record.id).slice(-10);
      var tags = "";
      $.each(record.tags, function(i, tag) {
        tags += ('<div class="tag">' + tag + '</div>');
      });
      $searchResult.append('<li><div class="link-block"><a href="http://www.cuboktahedron.sakura.ne.jp/tetsimu/?' + record.record + '" target="_blank">' + recordId + '</a></div>' + tags + '</li>');
    });
    $('#count').text('マッチ件数：' + searchResult.length + '件');
  });

  var search = function() {
    var escapeRegExpExceptForAstarisk = function(str) {
      return str.replace(/([.+?^=!:${}()|[\]\/\\])/g, "\\$1");
    };

    var isTagMatch = function(searchTag, tags) {
      for(var i = 0, len = tags.length; i < len; i++) {
        if(tags[i].match(searchTag)) {
          return true;
        }
      };

      return false;
    };

    var word = $('#word').val();
    word = word.replace(new RegExp("　", "g"), ' ');
    tags = word.split(' ');

    // 条件に含めるタグ配列生成
    var plusTags = tags.filter(function(tag) {
      if (!tag) {
        return false;
      }
      return tag.charAt(0) !== '-';
    });
    plusTags = plusTags.map(function(tag) {
      var pattern = escapeRegExpExceptForAstarisk(tag).replace(/\*/g, '.*');
      return new RegExp('^' + pattern + '$', 'i');
    });

    // 条件から除外するタグ配列作成
    var minusTags = tags.filter(function(tag) {
      if (!tag) {
        return false;
      }
      return tag.charAt(0) === '-';
    });
    minusTags = minusTags.map(function(tag) {
      tag = tag.substring(1);
      var pattern = escapeRegExpExceptForAstarisk(tag).replace(/\*/g, '.*');
      return new RegExp('^' + pattern + '$', 'i');
    });

    return records.filter(function(record) {
      var tags = record.tags;

      // タグの判定
      var i;
      var len;
      for(i = 0, len = plusTags.length; i < len; i++) {
        if (!isTagMatch(plusTags[i], tags)) {
          return false;
        }
      }

      for(i = 0, len = minusTags.length; i < len; i++) {
        if (isTagMatch(minusTags[i], tags)) {
          return false;
        }
      }

      return true;
    });
  };
})();
