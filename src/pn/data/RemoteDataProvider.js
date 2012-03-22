﻿;
goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.object');
goog.require('pn.data.IDataProvider');
goog.require('pn.data.IEntity');
goog.require('pn.data.TransactionResult');
goog.require('pn.json');

goog.provide('pn.data.IDataAjaxRequest');
goog.provide('pn.data.RemoteDataProvider');



/**
 * @interface
 */
pn.data.IDataAjaxRequest = function() {};


/**
 * @param {string} method The remote method to call.
 * @param {!Object} data The args to pass to the remote method.
 * @param {!function(Object)|function(Array.<Object>)|
 *    !function(pn.data.TransactionResult)|
 *    !function(Array.<pn.data.TransactionResult>)} callback The
 *    success callback.
 * @param {!function()|null} offlineCallback The callback to use when the
 *    application has gone offline.
 * @param {Object=} opt_handler The context to use when calling the callback.
 */
pn.data.IDataAjaxRequest.prototype.makeAjaxRequest =
    function(method, data, callback, offlineCallback, opt_handler) {};



/**
 * @constructor
 * @implements {pn.data.IDataProvider}
 * @extends {goog.Disposable}
 * @param {!pn.data.IDataAjaxRequest} ajax The ajax provider.
 */
pn.data.RemoteDataProvider = function(ajax) {
  goog.Disposable.call(this);

  /**
   * @private
   * @type {!pn.data.IDataAjaxRequest}
   */
  this.ajax_ = ajax;

  /**
   * @type {function(string,pn.data.IEntity):boolean}
   */
  this.onPreSave;
};
goog.inherits(pn.data.RemoteDataProvider, goog.Disposable);


/**
 * @const
 * @type {string}
 */
pn.data.RemoteDataProvider.OFFLINE = 'OFFLINE';


/** @inheritDoc */
pn.data.RemoteDataProvider.prototype.getEntities = function(type) {
  throw new Error('RemoteDataProvider.getEntities not supported');
};


/** @inheritDoc */
pn.data.RemoteDataProvider.prototype.getEntity = function(type, id) {
  throw new Error('RemoteDataProvider.getEntity not supported');

};


/** @inheritDoc */
pn.data.RemoteDataProvider.prototype.saveEntity =
    function(type, data, callback, opt_handler) {
  if (this.onPreSave && !this.onPreSave(type, data)) {
    callback.call(opt_handler, null);
    return;
  }

  this.ajax_.makeAjaxRequest('SaveEntity', {'type': type, 'entity':
        pn.json.serialiseJson(data)}, callback, function() {
    callback.call(opt_handler, pn.data.RemoteDataProvider.OFFLINE);
  }, opt_handler);
};


/** @inheritDoc */
pn.data.RemoteDataProvider.prototype.deleteEntity =
    function(type, id, callback, opt_handler) {
  this.ajax_.makeAjaxRequest('DeleteEntity', {'type': type, 'id': id}, callback,
      function() {
        callback.call(opt_handler, pn.data.RemoteDataProvider.OFFLINE);
      }, opt_handler);
};


/** @inheritDoc */
pn.data.RemoteDataProvider.prototype.deleteEntities =
    function(type, ids, callback, opt_handler) {
  if (!ids || ids.length === 0) {
    return callback.call(opt_handler || this, []);
  }
  this.ajax_.makeAjaxRequest('DeleteEntities', {'type': type, 'ids': ids},
      callback, function() {
        callback.call(opt_handler, pn.data.RemoteDataProvider.OFFLINE);
      }, opt_handler);
};


/** @inheritDoc */
pn.data.RemoteDataProvider.prototype.saveEntities =
    function(data, callback, opt_handler) {
  this.ajax_.makeAjaxRequest('SaveEntities', {'data':
        pn.json.serialiseJson(
        this.convertToPolymorphicablePackage_(data))},
  callback, function() {
    callback.call(opt_handler, pn.data.RemoteDataProvider.OFFLINE);
  }, opt_handler);
};


/**
 * @private
 * @param {!Object.<string, !Array.<pn.data.IEntity>>} data The data to
 *    convert.
 * @return {!Object.<string, string>} The converted data (serialised [json]
 *    internals).
 */
pn.data.RemoteDataProvider.prototype.convertToPolymorphicablePackage_ =
    function(data) {
  // Convert arrays to JSON to allow polymorphic deserialisation in server
  var data2 = {};
  for (var type in data) {
    var arr = data[type];
    if (this.onPreSave) {
      arr = goog.array.map(arr, function(e) { this.onPreSave(type, e); });
    }
    data2[type] = pn.json.serialiseJson(arr);
  }
  return data2;
};


/**
 * @param {!Object.<string, !Array.<pn.data.IEntity>>} tosave The batch
 *    data map to save.
 * @param {!Object.<string, !Array.<number>>} todelete The batch data map
 *    to delete.
 * @param {!function(Array.<string>)} callback The success callback.
 * @param {Object=} opt_handler The context to use when calling the callback.
 */
pn.data.RemoteDataProvider.prototype.updateServer =
    function(tosave, todelete, callback, opt_handler) {
  if (goog.object.isEmpty(tosave) && goog.object.isEmpty(todelete)) {
    callback.call(opt_handler || this, null);
    return;
  }
  this.ajax_.makeAjaxRequest('UpdateServer', {
    'tosave':
        pn.json.serialiseJson(
        this.convertToPolymorphicablePackage_(tosave)),
    'todelete': pn.json.serialiseJson(todelete)
  }, callback, null, opt_handler);
};


/**
 * @param {string} since The data to get changes from.
 * @param {!function(Array.<string>)} callback The success callback.
 * @param {Object=} opt_handler The context to use when calling the callback.
 */
pn.data.RemoteDataProvider.prototype.getChangesSince =
    function(since, callback, opt_handler) {
  this.ajax_.makeAjaxRequest('GetChangesSince', {'since': since},
      callback, null, opt_handler);
};


/**
 * @private
 * @param {!Object} o The object to property level stringify.
 */
pn.data.RemoteDataProvider.prototype.stringifyValues_ = function(o) {
  if (!o) { return; }
  for (var i in o) {
    o[i] = pn.json.serialiseJson(o[i]);
  }
};


/** @inheritDoc */
pn.data.RemoteDataProvider.prototype.disposeInternal = function() {
  pn.data.RemoteDataProvider.superClass_.disposeInternal.call(this);

  goog.dispose(this.ajax_);
};
