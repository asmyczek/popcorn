/**
 * @module Popcorn.All
 * @requires Popcorn.Core
 * @requires Popcorn.Common
 * @requires Popcorn.Dictionary
 * @requires Popcorn.Names
 * @requires Popcorn.Passwords
 * @requires Popcorn.Network
 */

/**
 * For simplification, module 'All' merges all Popcorn modules
 * and generators together. Just load all project JavaScript
 * files and use as:
 * <pre>
 *   with({ p: Popcorn.All }) {
 *     <i>... your generator code ...</i>
 *   }
 * </pre>
 *
 * @namespace Popcorn.All
 * @author Adam Smyczek
 */
Popcorn.All = function (core, common, dictionary, passwords, names, network) {

  // Merge all packages
  return core.merge(core, common, dictionary, passwords, names, network);

}(Popcorn.Core,
  Popcorn.Common,
  Popcorn.Dictionary,
  Popcorn.Passwords,
  Popcorn.Names,
  Popcorn.Network);

