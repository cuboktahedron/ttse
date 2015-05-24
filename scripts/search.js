module.exports = function(records, word) {
  'use strict';

  var $ = require('jquery');

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

  var word = word.replace(new RegExp("　", "g"), ' ');
  var tags = word.split(' ');

  // 条件に含めるタグ配列生成
  var plusTags = tags.filter(function(tag) {
    if (!tag) {
      return false;
    }
    return tag.charAt(0) !== '-';
  });
  plusTags = plusTags.map(function(tag) {
    var pattern = escapeRegExpExceptForAstarisk(tag).replace(/\*/g, '.*');
    pattern = pattern.replace(/_/g, '.');
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
    pattern = pattern.replace(/_/g, '.');
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

