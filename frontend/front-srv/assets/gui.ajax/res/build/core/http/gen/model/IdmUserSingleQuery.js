/**
 * Pydio Cells Rest API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ApiClient = require('../ApiClient');

var _ApiClient2 = _interopRequireDefault(_ApiClient);

var _IdmNodeType = require('./IdmNodeType');

var _IdmNodeType2 = _interopRequireDefault(_IdmNodeType);

/**
* The IdmUserSingleQuery model module.
* @module model/IdmUserSingleQuery
* @version 1.0
*/

var IdmUserSingleQuery = (function () {
    /**
    * Constructs a new <code>IdmUserSingleQuery</code>.
    * @alias module:model/IdmUserSingleQuery
    * @class
    */

    function IdmUserSingleQuery() {
        _classCallCheck(this, IdmUserSingleQuery);

        this.Uuid = undefined;
        this.Login = undefined;
        this.Password = undefined;
        this.GroupPath = undefined;
        this.Recursive = undefined;
        this.FullPath = undefined;
        this.AttributeName = undefined;
        this.AttributeValue = undefined;
        this.AttributeAnyValue = undefined;
        this.HasRole = undefined;
        this.NodeType = undefined;
        this.not = undefined;
    }

    /**
    * Constructs a <code>IdmUserSingleQuery</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/IdmUserSingleQuery} obj Optional instance to populate.
    * @return {module:model/IdmUserSingleQuery} The populated <code>IdmUserSingleQuery</code> instance.
    */

    IdmUserSingleQuery.constructFromObject = function constructFromObject(data, obj) {
        if (data) {
            obj = obj || new IdmUserSingleQuery();

            if (data.hasOwnProperty('Uuid')) {
                obj['Uuid'] = _ApiClient2['default'].convertToType(data['Uuid'], 'String');
            }
            if (data.hasOwnProperty('Login')) {
                obj['Login'] = _ApiClient2['default'].convertToType(data['Login'], 'String');
            }
            if (data.hasOwnProperty('Password')) {
                obj['Password'] = _ApiClient2['default'].convertToType(data['Password'], 'String');
            }
            if (data.hasOwnProperty('GroupPath')) {
                obj['GroupPath'] = _ApiClient2['default'].convertToType(data['GroupPath'], 'String');
            }
            if (data.hasOwnProperty('Recursive')) {
                obj['Recursive'] = _ApiClient2['default'].convertToType(data['Recursive'], 'Boolean');
            }
            if (data.hasOwnProperty('FullPath')) {
                obj['FullPath'] = _ApiClient2['default'].convertToType(data['FullPath'], 'String');
            }
            if (data.hasOwnProperty('AttributeName')) {
                obj['AttributeName'] = _ApiClient2['default'].convertToType(data['AttributeName'], 'String');
            }
            if (data.hasOwnProperty('AttributeValue')) {
                obj['AttributeValue'] = _ApiClient2['default'].convertToType(data['AttributeValue'], 'String');
            }
            if (data.hasOwnProperty('AttributeAnyValue')) {
                obj['AttributeAnyValue'] = _ApiClient2['default'].convertToType(data['AttributeAnyValue'], 'Boolean');
            }
            if (data.hasOwnProperty('HasRole')) {
                obj['HasRole'] = _ApiClient2['default'].convertToType(data['HasRole'], 'String');
            }
            if (data.hasOwnProperty('NodeType')) {
                obj['NodeType'] = _IdmNodeType2['default'].constructFromObject(data['NodeType']);
            }
            if (data.hasOwnProperty('not')) {
                obj['not'] = _ApiClient2['default'].convertToType(data['not'], 'Boolean');
            }
        }
        return obj;
    };

    /**
    * @member {String} Uuid
    */
    return IdmUserSingleQuery;
})();

exports['default'] = IdmUserSingleQuery;
module.exports = exports['default'];

/**
* @member {String} Login
*/

/**
* @member {String} Password
*/

/**
* @member {String} GroupPath
*/

/**
* @member {Boolean} Recursive
*/

/**
* @member {String} FullPath
*/

/**
* @member {String} AttributeName
*/

/**
* @member {String} AttributeValue
*/

/**
* @member {Boolean} AttributeAnyValue
*/

/**
* @member {String} HasRole
*/

/**
* @member {module:model/IdmNodeType} NodeType
*/

/**
* @member {Boolean} not
*/
