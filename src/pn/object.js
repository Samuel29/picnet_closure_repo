
goog.require('goog.asserts');
goog.require('goog.object');

goog.provide('pn.object');


/**
 * Extends an objects properties ensuring that all properties are unique.  If
 *    some of the properties to extend already exist then an error is thrown.
 *
 * @param {Object} target  The object to modify.
 * @param {...Object} var_args The objects from which values will be copied.
 */
pn.object.uniqueExtend = function(target, var_args) {
  pn.ass(target);
  pn.ass(arguments.length > 1);
  var args = pn.toarr(arguments);
  var keys = [];
  args.pnforEach(function(o) {
    keys = keys.pnconcat(goog.object.getKeys(o));
  });
  var exp = keys.length;
  keys.pnremoveDuplicates();
  if (exp !== keys.length) {
    throw new Error('Keys not unique amongst all objects');
  }

  goog.object.extend.apply(null, args);
};
