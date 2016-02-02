'use strict';

var m = require('mithril');
var util = require('../../../util');
var Pikaday = require('pikaday');
var moment = require('moment');
var dateFormat = 'YYYY-MM-DD';
var dateTimeFormat = 'YYYY-MM-DD hh:mm:ss';

var c = module.exports = {
  theme: {
    class: '',
    inputClass: '',
    valueClass: ''
  },
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
      if (opts.readonly || !scope.datePicker) {
        return;
      }

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
      context.item[context.fieldName] = date.toISOString();
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
  views: {
    dateInput: function (scope, context, opts) {
      var value = context.item[context.fieldName];

      return m('input.m-admin-field-datetime-date[name="' + context.fieldName + '"].m-admin-field-input' + c.theme.dateInputClass, util.removeFalsy({
        type: 'text',
        value: value ? moment(new Date(value)).format(opts.dateFormat) : '',
        required: opts.required,
        readonly: opts.readonly,
        config: scope.configPicker,
        onchange: scope.setDate
      }));
    },
    hoursInput: function (scope, context, opts) {
      return m('input.m-admin-field-datetime-hours[name="' + context.fieldName +'[hours]"]' + c.theme.hoursInputClass, util.removeFalsy({
        type: 'number',
        min: 0, max: 23,
        value: scope.hours,
        required: opts.required,
        readonly: opts.readonly,
        onchange: m.withAttr('value', scope.setHours)
      }));
    },
    minutesInput: function (scope, context, opts) {
      return m('input.m-admin-field-datetime-minutes[name="' + context.fieldName +'[minutes]"]' + c.theme.minutesInputClass, util.removeFalsy({
        type: 'number',
        min: 0, max: 59,
        value: scope.minutes,
        required: opts.required,
        readonly: opts.readonly,
        onchange: m.withAttr('value', scope.setMinutes)
      }));
    },
    secondsInput: function (scope, context, opts) {
      return m('input.m-admin-field-datetime-seconds[name="' + context.fieldName +'[seconds]"]' + c.theme.secondsInputClass, util.removeFalsy({
        type: 'number',
        min: 0, max: 59,
        value: scope.seconds,
        required: opts.required,
        readonly: opts.readonly,
        onchange: m.withAttr('value', scope.setSeconds)
      }));
    },
    value: function (scope, context, opts) {
      var value = context.item[context.fieldName];

      return m('span.m-admin-field-value' + c.theme.valueClass, moment(value).format(opts.granularity ? opts.dateTimeFormat : opts.dateFormat));
    }
  },
  view: function (scope, context, opts) {
    opts = scope.normalizeOpts(opts);
    var granularityIndex = ['hours', 'minutes', 'seconds'].indexOf(opts.granularity);
    var value = context.item[context.fieldName];

    return m('span.m-admin-field-datetime' + c.theme.class,
      util.canEditField(context, opts) ? [
        c.views.dateInput(scope, context, opts),
        granularityIndex >= 0 ?
        c.views.hoursInput(scope, context, opts) : null,

        granularityIndex >= 1 ?
        c.views.minutesInput(scope, context, opts) : null,

        granularityIndex >= 2 ?
        c.views.secondsInput(scope, context, opts) : null
      ] : c.views.value(scope, context, opts)
    );
  }
};
