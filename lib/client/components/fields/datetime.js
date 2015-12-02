'use strict';

var m = require('mithril');
var util = require('../../../util');
var Pikaday = require('pikaday');
var moment = require('moment');
var dateFormat = 'YYYY-MM-DD';
var dateTimeFormat = 'YYYY-MM-DD hh:mm:ss';

module.exports = {
  controller: function (context, opts) {
    var scope = {};
    var value = context.item[context.fieldName];
    var granularityIndex = ['hours', 'minutes', 'seconds'].indexOf(opts.granularity);
    var date = moment(value);

    scope.hours = date.hour();
    scope.minutes = date.minute();
    scope.seconds = date.second();

    scope.normalizeOpts = function (opts) {
      opts = opts || {};
      opts.dateFormat = opts.dateFormat || dateFormat;
      opts.dateTimeFormat = opts.dateTimeFormat || dateTimeFormat;
      opts.datePicker = opts.datePicker || {};
      opts.granularity = (opts.granularity !== false) ? opts.granularity || 'seconds' : false;
      return opts;
    };

    scope.setDate = function () {
      var date = scope.datePicker.getMoment();

      if (granularityIndex >= 0) {
        date.hour(scope.hours);
      }

      if (granularityIndex >= 1) {
        date.minutes(scope.minutes);
      }

      if (granularityIndex >= 2) {
        date.seconds(scope.seconds);
      }

      // TODO: use optional setter here
      context.item[context.fieldName] = date.toString();
    };

    scope.setHours = function (value) {
      scope.hours = value;
      scope.setDate();
    };

    scope.setMinutes = function (value) {
      scope.minutes = value;
      scope.setDate();
    };

    scope.setSeconds = function (value) {
      scope.seconds = value;
      scope.setDate();
    };

    scope.configPicker =  function (el, inited) {
      if (inited || opts.readonly) {
        return;
      }

      opts.datePicker.field = el;
      opts.datePicker.format = opts.dateFormat;
      scope.datePicker = new Pikaday(opts.datePicker);
    };

    opts = scope.normalizeOpts(opts);

    return scope;
  },
  view: function (scope, context, opts) {
    opts = scope.normalizeOpts(opts);
    var granularityIndex = ['hours', 'minutes', 'seconds'].indexOf(opts.granularity);
    var value = context.item[context.fieldName];

    return m('span.m-admin-field-datetime',
      context.action === 'edit' || context.action === 'create' ? [
        m('input.m-admin-field-datetime-date[name="' + context.fieldName + '"]', util.removeFalsy({
          type: 'text',
          value: moment(value).format(dateFormat),
          required: opts.required,
          readonly: opts.readonly,
          config: scope.configPicker,
          oninput: scope.setDate
        })),

        granularityIndex >= 0 ?
        m('input.m-admin-field-datetime-hours[name="' + context.fieldName +'[hours]"]', util.removeFalsy({
          type: 'number',
          min: 0, max: 23,
          value: scope.hours,
          required: opts.required,
          readonly: opts.readonly,
          onchange: m.withAttr('value', scope.setHours)
        })) : null,

        granularityIndex >= 1 ?
        m('input.m-admin-field-datetime-minutes[name="' + context.fieldName +'[minutes]"]', util.removeFalsy({
          type: 'number',
          min: 0, max: 59,
          value: scope.minutes,
          required: opts.required,
          readonly: opts.readonly,
          onchange: m.withAttr('value', scope.setMinutes)
        })) : null,

        granularityIndex >= 2 ?
        m('input.m-admin-field-datetime-seconds[name="' + context.fieldName +'[seconds]"]', util.removeFalsy({
          type: 'number',
          min: 0, max: 59,
          value: scope.seconds,
          required: opts.required,
          readonly: opts.readonly,
          onchange: m.withAttr('value', scope.setSeconds)
        })) : null
      ] : m('span.m-admin-field-value', moment(value).format(opts.granularity ? opts.dateTimeFormat : opts.dateFormat))
    );
  }
};
