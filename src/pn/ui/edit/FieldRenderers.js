﻿;
goog.require('goog.date.Date');
goog.require('goog.ui.InputDatePicker');
goog.require('goog.ui.LabelInput');
goog.require('pn.convert');
goog.require('pn.date');
goog.provide('pn.ui.edit.FieldRenderers');


/**
 * @param {*} val The date (millis since 1970) to display.
 * @param {Object} entity The Entity being displayed.
 * @param {!Element} parent The parent to attach this input control to.
 * @return {!goog.ui.Component} The date control.
 */
pn.ui.edit.FieldRenderers.dateRenderer =
    function(val, entity, parent) {
  var dt = null;
  if (val) {
    dt = new goog.date.Date();

    dt.setTime(/** @type {number} */ (val));
    if (dt.getFullYear() <= 1970) dt = null;
  }

  var fieldLabelInput = new goog.ui.LabelInput('DD/MMM/YYYY');
  fieldLabelInput.render(parent);
  parent.labelInput_ = fieldLabelInput;

  var idp = new goog.ui.InputDatePicker(pn.date.dateFormat, pn.date.dateParser);
  idp.getDatePicker().setShowWeekNum(false);
  idp.decorate(fieldLabelInput.getElement());
  if (dt) {
    idp.setDate(dt);
  }

  return idp;
};


/**
 * @param {*} val The time number represented by hhmm format.
 * @param {Object} entity The Entity being displayed.
 * @param {!Element} parent The parent to attach this input control to.
 * @return {!Element} The date control.
 */
pn.ui.edit.FieldRenderers.timeRenderer =
    function(val, entity, parent) {
  var picker = goog.dom.createDom('select', {
    'class': 'time-picker'
  });

  for (var h = 5; h < 22; h++) {
    var displayHr = goog.string.padNumber((h % 12) + 1, 2);
    var amPm = h < 12 ? ' AM' : 'PM';
    for (var m = 0; m < 60; m += 15) {
      var value = h * 60 + m;
      var opt = goog.dom.createDom('option',
          {'value': value },
          displayHr + ':' +
          goog.string.padNumber(m, 2) +
          amPm);
      goog.dom.appendChild(picker, opt);
    }
  }
  picker.value = val;
  goog.dom.appendChild(parent, picker);
  return picker;
};


/**
 * @param {*} val The text to display.
 * @param {Object} entity The Entity being displayed.
 * @param {!Element} parent The parent to attach this input control to.
 * @return {!Text} The readonly
 *    text field control.
 */
pn.ui.edit.FieldRenderers.centsRenderer = function(val, entity, parent) {
  goog.asserts.assertNumber(val);
  var display = pn.convert.centsToDisplayString(/** @type {number} */ (val));
  return goog.dom.createTextNode(display);
};


/**
 * @param {*} val The boolean to display.
 * @param {Object} entity The Entity being displayed.
 * @param {!Element} parent The parent to attach this input control to.
 * @return {!Element} The checkbox control.
 */
pn.ui.edit.FieldRenderers.boolRenderer =
    function(val, entity, parent) {
  var inp = goog.dom.createDom('input', {'type': 'checkbox'});
  inp.defaultChecked = inp.checked = (val === true);
  goog.dom.appendChild(parent, inp);
  return inp;
};


/**
 * @param {*} val The text to display.
 * @param {Object} entity The Entity being displayed.
 * @param {!Element} parent The parent to attach this input control to.
 * @return {!Element} The textarea control.
 */
pn.ui.edit.FieldRenderers.textAreaRenderer =
    function(val, entity, parent) {
  var textarea = goog.dom.createDom('textarea',
      {'rows': '5', 'value': val || ''});
  goog.dom.appendChild(parent, textarea);
  return textarea;
};


/**
 * @param {*} val The text to display.
 * @param {Object} entity The Entity being displayed.
 * @param {!Element} parent The parent to attach this input control to.
 * @return {!Element} The textarea control.
 */
pn.ui.edit.FieldRenderers.hiddenTextField =
    function(val, entity, parent) {

  var inp = goog.dom.createDom('input', {'type': 'hidden', 'value': val || ''});
  goog.dom.appendChild(parent, inp);
  return inp;
};


/**
 * @param {*} val The text to display.
 * @param {Object} entity The Entity being displayed.
 * @param {!Element} parent The parent to attach this input control to.
 * @return {!Element} The readonly text field control.
 */
pn.ui.edit.FieldRenderers.readOnlyTextField =
    function(val, entity, parent) {
  var readonly = goog.dom.createDom('input',
      {'type': 'text', 'readonly': 'readonly',
        'disabled': 'disabled', 'value': val || ''});
  goog.dom.appendChild(parent, readonly);
  return readonly;
};


/**
 * @param {*} val The text to display.
 * @param {Object} entity The Entity being displayed.
 * @param {!Element} parent The parent to attach this input control to.
 * @return {!Element} The readonly text field control.
 */
pn.ui.edit.FieldRenderers.readOnlyTextAreaField =
    function(val, entity, parent) {
  var ta = pn.ui.edit.FieldRenderers.textAreaRenderer(val, entity, parent);
  ta['readonly'] = 'readonly';
  ta['disabled'] = 'disabled';
  return ta;
};


/**
 * @param {*} val The text to display.
 * @param {Object} entity The Entity being displayed.
 * @param {!Element} parent The parent to attach this input control to.
 * @return {!goog.ui.LabelInput} The readonly
 *    text field control.
 */
pn.ui.edit.FieldRenderers.readOnlyDateField =
    function(val, entity, parent) {
  var date = !val ? null : new Date(val);
  var txt = !date ? '' : pn.date.dateFormat.format(date);
  var li = new goog.ui.LabelInput(txt);
  li.render(parent);
  li.setEnabled(false);
  li.getValue = function() { return date ? date.getTime() : 0; };

  return li;
};


/**
 * @param {*} val The text to display.
 * @param {Object} entity The Entity being displayed.
 * @param {!Element} parent The parent to attach this input control to.
 * @return {!Element} The text field control for search inputs.
 */
pn.ui.edit.FieldRenderers.standardTextSearchField =
    function(val, entity, parent) {
  var txt = goog.dom.createDom('input', {'type': 'text'});
  goog.dom.appendChild(parent, txt);
  return txt;
};
