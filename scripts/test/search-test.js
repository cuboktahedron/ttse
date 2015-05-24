describe("Word Criteria", function() {
  'use strict';

  var searcher = require('../search');

  var records = [
    {
      id: '1',
      record: 'AAA',
      tags: ['hoge', 'piyo'],
    },

    {
      id: '2',
      record: 'BBB',
      tags: [],
    },

    {
      id: '3',
      record: 'CCC',
      tags: ['123hoge', 'piyo123'],
    },

    {
      id: '4',
      record: 'DDD',
      tags: ['hoge', 'ほげ'],
    },
  ];

  var ids = function(rs) {
    return rs.map(function(v) { return v.id;
    });
  };

  beforeEach(function() {
  });

  afterEach(function() {
  });

  it("should matches all records", function() {
    expect(4).toEqual(searcher(records, '').length);
  });

  it("should matches perfectly with", function() {
    expect(['1', '4']).toEqual(ids(searcher(records, 'hoge')));
  });

  it("should not matches perfectly with", function() {
    expect(['1']).not.toEqual(ids(searcher(records, 'hoger')));
  });

  it("should matches that begins with", function() {
    expect(['1', '3']).toEqual(ids(searcher(records, 'piyo*')));
  });

  it("should matches that ends with", function() {
    expect(['1', '3', '4']).toEqual(ids(searcher(records, '*hoge')));
  });

  it("should matches partialy with", function() {
    expect(['1', '3', '4']).toEqual(ids(searcher(records, '*oge*')));
  });

  it("should excludes matching records", function() {
    expect(['2']).toEqual(ids(searcher(records, '-*hoge*')));
  });

  it("should ignored case", function() {
    expect(['1', '4']).toEqual(ids(searcher(records, 'HoGe')));
  });

  it("should multi byte characters", function() {
    expect(['4']).toEqual(ids(searcher(records, 'ほげ')));
  });

  it("should matches any single character", function() {
    expect(['1', '4']).toEqual(ids(searcher(records, '_o_e')));
  });

  it("should excludes matching records with '_'", function() {
    expect(['2', '3']).toEqual(ids(searcher(records, '-_o_e*')));
  });
});

