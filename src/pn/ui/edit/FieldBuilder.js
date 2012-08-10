﻿;
goog.provide('pn.ui.edit.FieldBuilder');

goog.require('goog.date.Date');
goog.require('goog.events.EventHandler');
goog.require('goog.string');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('pn.ui.UiSpecsRegister');
goog.require('pn.ui.grid.Grid');


/**
 * @param {!pn.ui.edit.FieldCtx} fctx The field to create a label for.
 * @return {!Element} The label element wrapped in a div.
 */
pn.ui.edit.FieldBuilder.getFieldLabel = function(fctx) {
  var className = (fctx.spec.className || 'field');
  var id = fctx.controlId;
  return goog.dom.createDom('div', {'id': id, 'class': className},
      goog.dom.createDom('label', { 'for': id }, fctx.spec.name || id));
};


/**
 * @param {Element|goog.ui.Component} inp The input field.
 * @param {Object=} opt_target The optional 'entity' target to inject values
 *    into if required.
 * @return {string} The value in the specified field.
 */
pn.ui.edit.FieldBuilder.getFieldValue = function(inp, opt_target) {
  goog.asserts.assert(inp);

  if (inp.getValue) { return inp.getValue(opt_target); }
  else if (inp.options) {
    var arr = [];
    goog.array.forEach(inp.options, function(o) {
      if (o.selected) { arr.push(o.value); }
    });
    return inp.multiple && arr.length > 1 ? arr : arr[0];
  }
  else if (inp.type === 'checkbox') { return inp.checked; }
  else { return inp.value; }
};


/**
 * @param {!pn.ui.edit.FieldCtx} fctx The field to create a dom tree for.
 * @param {!Element} parent The parent control to attach this control to.
 * @param {!Object} entity The entity being edited.
 * @return {Element|goog.ui.Component|Text} The created dom element.
 */
pn.ui.edit.FieldBuilder.createAndAttach = function(fctx, parent, entity) {
  var renderer = fctx.getFieldRenderer();
  if (renderer instanceof pn.ui.edit.ComplexRenderer) {
    renderer.decorate(parent);
    return renderer;
  }
  return renderer(fctx, parent, entity);
};


/**
 * @param {string} selectTxt The message to display in the first element of the
 *    list.
 * @param {!Array.<Object>} list The list of entities.
 * @param {string} txtf The text field property name.
 * @return {goog.ui.ComboBox} The select box.
 */
pn.ui.edit.FieldBuilder.createCombo = function(selectTxt, list, txtf) {
  goog.array.sortObjectsByKey(list, txtf, goog.string.caseInsensitiveCompare);
  var cb = new goog.ui.ComboBox();
  cb.setUseDropdownArrow(true);
  if (selectTxt) { cb.setDefaultText(selectTxt); }
  goog.array.forEach(list, function(e) {
    cb.addItem(new goog.ui.ComboBoxItem(e[txtf]));
  });
  return cb;
};
