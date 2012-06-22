﻿;
goog.provide('pn.ui.edit.ComplexRenderer');

goog.require('goog.events.EventHandler');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
pn.ui.edit.ComplexRenderer = function() {
  goog.ui.Component.call(this);

  /**
   * @protected
   * @type {pn.ui.FieldCtx}
   */
  this.fctx = null;

  /**
   * @protected
   * @type {Object}
   */
  this.entity = null;

  /** @type {boolean} */
  this.showLabel = true;

  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.eh = null;
};
goog.inherits(pn.ui.edit.ComplexRenderer, goog.ui.Component);


/**
 * @param {!pn.ui.FieldCtx} fctx The field context object.
 * @param {!Object} entity The entity being edited.
 */
pn.ui.edit.ComplexRenderer.prototype.initialise = function(fctx, entity) {
  goog.asserts.assert(fctx);
  goog.asserts.assert(entity);

  this.eh = new goog.events.EventHandler(this);
  this.fctx = fctx;
  this.entity = entity;
};


/**
 * @param {Object=} opt_target The optional 'entity' target to inject values
 *    into if required.
 * @return {*} Gets the value in the current editor.
 */
pn.ui.edit.ComplexRenderer.prototype.getValue = goog.abstractMethod;


/**
 * Optional
 * @return {string|Array.<string>} Any error (if any) for the specified field.
 */
pn.ui.edit.ComplexRenderer.prototype.validate = function() { return ''; };


/** @inheritDoc */
pn.ui.edit.ComplexRenderer.prototype.createDom = function() {
  this.decorateInternal(this.dom_.createElement('div'));
};


/** @inheritDoc */
pn.ui.edit.ComplexRenderer.prototype.disposeInternal = function() {
  pn.ui.edit.ComplexRenderer.superClass_.disposeInternal.call(this);

  if (this.eh) {
    this.eh.removeAll();
    goog.dispose(this.eh);
  }

  delete this.eh;
  delete this.fctx;
};
