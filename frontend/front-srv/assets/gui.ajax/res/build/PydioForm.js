(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PydioForm = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsFormMixin = require('../mixins/FormMixin');

var _mixinsFormMixin2 = _interopRequireDefault(_mixinsFormMixin);

var _mixinsFieldWithChoices = require('../mixins/FieldWithChoices');

var _mixinsFieldWithChoices2 = _interopRequireDefault(_mixinsFieldWithChoices);

var React = require('react');

var _require = require('material-ui');

var AutoComplete = _require.AutoComplete;
var MenuItem = _require.MenuItem;
var RefreshIndicator = _require.RefreshIndicator;

var AutocompleteBox = React.createClass({
    displayName: 'AutocompleteBox',

    mixins: [_mixinsFormMixin2['default']],

    handleUpdateInput: function handleUpdateInput(searchText) {
        //this.setState({searchText: searchText});
    },

    handleNewRequest: function handleNewRequest(chosenValue) {
        if (chosenValue.key === undefined) {
            this.onChange(null, chosenValue);
        } else {
            this.onChange(null, chosenValue.key);
        }
    },

    render: function render() {
        var choices = this.props.choices;

        var dataSource = [];
        var labels = {};
        choices.forEach(function (choice, key) {
            dataSource.push({
                key: key,
                text: choice,
                value: React.createElement(
                    MenuItem,
                    null,
                    choice
                )
            });
            labels[key] = choice;
        });

        var displayText = this.state.value;
        if (labels && labels[displayText]) {
            displayText = labels[displayText];
        }

        if (this.isDisplayGrid() && !this.state.editMode || this.props.disabled) {
            var value = this.state.value;
            if (choices.get(value)) {
                value = choices.get(value);
            }
            return React.createElement(
                'div',
                {
                    onClick: this.props.disabled ? function () {} : this.toggleEditMode,
                    className: value ? '' : 'paramValue-empty' },
                !value ? 'Empty' : value,
                '   ',
                React.createElement('span', { className: 'icon-caret-down' })
            );
        }

        return React.createElement(
            'div',
            { className: 'pydioform_autocomplete', style: { position: 'relative' } },
            !dataSource.length && React.createElement(RefreshIndicator, {
                size: 30,
                right: 10,
                top: 0,
                status: 'loading'
            }),
            dataSource.length && React.createElement(AutoComplete, {
                fullWidth: true,
                searchText: displayText,
                onUpdateInput: this.handleUpdateInput,
                onNewRequest: this.handleNewRequest,
                dataSource: dataSource,
                floatingLabelText: this.props.attributes['label'],
                filter: function (searchText, key) {
                    if (!key || !searchText) {
                        return false;
                    }
                    return key.toLowerCase().indexOf(searchText.toLowerCase()) === 0;
                },
                openOnFocus: true,
                menuProps: { maxHeight: 200 }
            })
        );
    }

});

exports['default'] = AutocompleteBox = _mixinsFieldWithChoices2['default'](AutocompleteBox);
exports['default'] = AutocompleteBox;
module.exports = exports['default'];

},{"../mixins/FieldWithChoices":16,"../mixins/FormMixin":17,"material-ui":"material-ui","react":"react"}],2:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsFormMixin = require('../mixins/FormMixin');

var _mixinsFormMixin2 = _interopRequireDefault(_mixinsFormMixin);

var React = require('react');
var debounce = require('lodash.debounce');

var _require = require('material-ui');

var AutoComplete = _require.AutoComplete;
var MenuItem = _require.MenuItem;
var RefreshIndicator = _require.RefreshIndicator;
var FontIcon = _require.FontIcon;

var AutocompleteTree = React.createClass({
    displayName: 'AutocompleteTree',

    mixins: [_mixinsFormMixin2['default']],

    handleUpdateInput: function handleUpdateInput(searchText) {
        this.debounced();
        this.setState({ searchText: searchText });
    },

    handleNewRequest: function handleNewRequest(chosenValue) {
        var key = undefined;
        if (chosenValue.key !== undefined) {
            key = chosenValue.key;
        } else {
            key = chosenValue;
        }
        this.onChange(null, key);
        this.loadValues(key);
    },

    componentWillMount: function componentWillMount() {
        this.debounced = debounce(this.loadValues.bind(this), 300);
        this.lastSearch = null;
        var value = "";
        if (this.props.value) {
            value = this.props.value;
        }
        this.loadValues(value);
    },

    loadValues: function loadValues() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

        var basePath = value;
        if (!value && this.state.searchText) {
            var last = this.state.searchText.lastIndexOf('/');
            basePath = this.state.searchText.substr(0, last);
        }
        if (this.lastSearch !== null && this.lastSearch === basePath) {
            return;
        }
        this.lastSearch = basePath;
        // TODO : load values from service
    },

    render: function render() {

        var dataSource = [];
        if (this.state && this.state.nodes) {
            this.state.nodes.forEach(function (node) {
                var icon = "mdi mdi-folder";
                if (node.uuid.startsWith("DATASOURCE:")) {
                    icon = "mdi mdi-database";
                }
                dataSource.push({
                    key: node.path,
                    text: node.path,
                    value: React.createElement(
                        MenuItem,
                        null,
                        React.createElement(FontIcon, { className: icon, color: '#616161', style: { float: 'left', marginRight: 8 } }),
                        ' ',
                        node.path
                    )
                });
            });
        }

        var displayText = this.state.value;

        return React.createElement(
            'div',
            { className: 'pydioform_autocomplete', style: { position: 'relative' } },
            !dataSource.length && React.createElement(RefreshIndicator, {
                size: 30,
                right: 10,
                top: 0,
                status: 'loading'
            }),
            React.createElement(AutoComplete, {
                fullWidth: true,
                searchText: displayText,
                onUpdateInput: this.handleUpdateInput,
                onNewRequest: this.handleNewRequest,
                dataSource: dataSource,
                floatingLabelText: this.props.attributes['label'],
                filter: function (searchText, key) {
                    return key.toLowerCase().indexOf(searchText.toLowerCase()) === 0;
                },
                openOnFocus: true,
                menuProps: { maxHeight: 200 }
            })
        );
    }

});

exports['default'] = AutocompleteTree;
module.exports = exports['default'];

},{"../mixins/FormMixin":17,"lodash.debounce":"lodash.debounce","material-ui":"material-ui","react":"react"}],3:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

/**
 * UI to drop a file (or click to browse), used by the InputImage component.
 */
exports["default"] = React.createClass({
    displayName: "FileDropzone",

    getDefaultProps: function getDefaultProps() {
        return {
            supportClick: true,
            multiple: true,
            onDrop: function onDrop() {}
        };
    },

    getInitialState: function getInitialState() {
        return {
            isDragActive: false
        };
    },

    propTypes: {
        onDrop: React.PropTypes.func.isRequired,
        ignoreNativeDrop: React.PropTypes.bool,
        size: React.PropTypes.number,
        style: React.PropTypes.object,
        dragActiveStyle: React.PropTypes.object,
        supportClick: React.PropTypes.bool,
        accept: React.PropTypes.string,
        multiple: React.PropTypes.bool
    },

    onDragLeave: function onDragLeave(e) {
        this.setState({
            isDragActive: false
        });
    },

    onDragOver: function onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";

        this.setState({
            isDragActive: true
        });
    },

    onFilePicked: function onFilePicked(e) {
        if (!e.target || !e.target.files) return;
        var files = e.target.files;
        var maxFiles = this.props.multiple ? files.length : 1;
        files = Array.prototype.slice.call(files, 0, maxFiles);
        if (this.props.onDrop) {
            this.props.onDrop(files, e, this);
        }
    },

    onFolderPicked: function onFolderPicked(e) {
        if (this.props.onFolderPicked) {
            this.props.onFolderPicked(e.target.files);
        }
    },

    onDrop: function onDrop(e) {

        this.setState({
            isDragActive: false
        });
        e.preventDefault();
        if (this.props.ignoreNativeDrop) {
            return;
        }

        var files = undefined;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }

        var maxFiles = this.props.multiple ? files.length : 1;
        for (var i = 0; i < maxFiles; i++) {
            files[i].preview = URL.createObjectURL(files[i]);
        }

        if (this.props.onDrop) {
            files = Array.prototype.slice.call(files, 0, maxFiles);
            this.props.onDrop(files, e, this);
        }
    },

    onClick: function onClick() {
        if (this.props.supportClick === true) {
            this.open();
        }
    },

    open: function open() {
        this.refs.fileInput.click();
    },

    openFolderPicker: function openFolderPicker() {
        this.refs.folderInput.setAttribute("webkitdirectory", "true");
        this.refs.folderInput.click();
    },

    render: function render() {

        var className = this.props.className || 'file-dropzone';
        if (this.state.isDragActive) {
            className += ' active';
        }

        var style = {
            width: this.props.size || 100,
            height: this.props.size || 100
        };
        //borderStyle: this.state.isDragActive ? "solid" : "dashed"
        if (this.props.style) {
            style = _extends({}, style, this.props.style);
        }
        if (this.state.isDragActive && this.props.dragActiveStyle) {
            style = _extends({}, style, this.props.dragActiveStyle);
        }
        var folderInput = undefined;
        if (this.props.enableFolders) {
            folderInput = React.createElement("input", { style: { display: 'none' }, name: "userfolder", type: "file", ref: "folderInput", onChange: this.onFolderPicked });
        }
        return React.createElement(
            "div",
            { className: className, style: style, onClick: this.onClick, onDragLeave: this.onDragLeave, onDragOver: this.onDragOver, onDrop: this.onDrop },
            React.createElement("input", { style: { display: 'none' }, name: "userfile", type: "file", multiple: this.props.multiple, ref: "fileInput", value: "", onChange: this.onFilePicked, accept: this.props.accept }),
            folderInput,
            this.props.children
        );
    }

});
module.exports = exports["default"];

},{"react":"react"}],4:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsFormMixin = require('../mixins/FormMixin');

var _mixinsFormMixin2 = _interopRequireDefault(_mixinsFormMixin);

var React = require('react');

var _require = require('material-ui');

var Toggle = _require.Toggle;

/**
 * Boolean input
 */
exports['default'] = React.createClass({
    displayName: 'InputBoolean',

    mixins: [_mixinsFormMixin2['default']],

    getDefaultProps: function getDefaultProps() {
        return {
            skipBufferChanges: true
        };
    },

    onCheck: function onCheck(event, newValue) {
        this.props.onChange(newValue, this.state.value);
        this.setState({
            dirty: true,
            value: newValue
        });
    },

    getBooleanState: function getBooleanState() {
        var boolVal = this.state.value;
        if (typeof boolVal === 'string') {
            boolVal = boolVal == "true";
        }
        return boolVal;
    },

    render: function render() {
        var boolVal = this.getBooleanState();
        return React.createElement(
            'span',
            null,
            React.createElement(Toggle, {
                toggled: boolVal,
                onToggle: this.onCheck,
                disabled: this.props.disabled,
                label: this.isDisplayForm() ? this.props.attributes.label : null,
                labelPosition: this.isDisplayForm() ? 'left' : 'right'
            })
        );
    }

});
module.exports = exports['default'];

},{"../mixins/FormMixin":17,"material-ui":"material-ui","react":"react"}],5:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsActionRunnerMixin = require('../mixins/ActionRunnerMixin');

var _mixinsActionRunnerMixin2 = _interopRequireDefault(_mixinsActionRunnerMixin);

var React = require('react');

var _require = require('material-ui');

var RaisedButton = _require.RaisedButton;

/**
 * Simple RaisedButton executing the applyButtonAction
 */
exports['default'] = React.createClass({
    displayName: 'InputButton',

    mixins: [_mixinsActionRunnerMixin2['default']],

    applyButton: function applyButton() {

        var callback = this.props.actionCallback;
        if (!callback) {
            callback = function (transport) {
                var text = transport.responseText;
                if (text.startsWith('SUCCESS:')) {
                    global.pydio.displayMessage('SUCCESS', transport.responseText.replace('SUCCESS:', ''));
                } else {
                    global.pydio.displayMessage('ERROR', transport.responseText.replace('ERROR:', ''));
                }
            };
        }
        this.applyAction(callback);
    },

    render: function render() {
        return React.createElement(RaisedButton, {
            label: this.props.attributes['label'],
            onTouchTap: this.applyButton,
            disabled: this.props.disabled
        });
    }
});
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../mixins/ActionRunnerMixin":15,"material-ui":"material-ui","react":"react"}],6:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsFormMixin = require('../mixins/FormMixin');

var _mixinsFormMixin2 = _interopRequireDefault(_mixinsFormMixin);

var _FileDropzone = require('./FileDropzone');

var _FileDropzone2 = _interopRequireDefault(_FileDropzone);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pydioHttpApi = require('pydio/http/api');

var _pydioHttpApi2 = _interopRequireDefault(_pydioHttpApi);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _pydioUtilLang = require('pydio/util/lang');

var _pydioUtilLang2 = _interopRequireDefault(_pydioUtilLang);

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var NativeFileDropProvider = _Pydio$requireLib.NativeFileDropProvider;

// Just enable the drop mechanism, but do nothing, it is managed by the FileDropzone
var BinaryDropZone = NativeFileDropProvider(_FileDropzone2['default'], function (items, files, props) {});

/**
 * UI for displaying and uploading an image,
 * using the binaryContext string.
 */
exports['default'] = _react2['default'].createClass({
    displayName: 'InputImage',

    mixins: [_mixinsFormMixin2['default']],

    propTypes: {
        attributes: _react2['default'].PropTypes.object,
        binary_context: _react2['default'].PropTypes.string
    },

    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        var imgSrc = undefined;
        if ((newProps.value || newProps.binary_context && newProps.binary_context !== this.props.binary_context) && !this.state.reset) {
            imgSrc = this.getBinaryUrl(newProps, this.state.temporaryBinary && this.state.temporaryBinary === newProps.value);
        } else if (newProps.attributes['defaultImage']) {
            imgSrc = newProps.attributes['defaultImage'];
        }
        if (imgSrc) {
            this.setState({ imageSrc: imgSrc, reset: false });
        }
    },

    getInitialState: function getInitialState() {
        var imgSrc = undefined,
            originalBinary = undefined;
        if (this.props.value) {
            imgSrc = this.getBinaryUrl(this.props);
            originalBinary = this.props.value;
        } else if (this.props.attributes['defaultImage']) {
            imgSrc = this.props.attributes['defaultImage'];
        }
        return { imageSrc: imgSrc, originalBinary: originalBinary };
    },

    getBinaryUrl: function getBinaryUrl(props) {
        var pydio = _pydioHttpApi2['default'].getClient().getPydioObject();
        var url = pydio.Parameters.get('ENDPOINT_REST_API') + props.attributes['loadAction'];
        var bId = props.value;
        if (props.binary_context && props.binary_context.indexOf('user_id=') === 0) {
            bId = props.binary_context.replace('user_id=', '');
        }
        url = url.replace('{BINARY}', bId);
        return url;
    },

    getUploadUrl: function getUploadUrl() {
        var pydio = _pydioHttpApi2['default'].getClient().getPydioObject();
        var url = pydio.Parameters.get('ENDPOINT_REST_API') + this.props.attributes['uploadAction'];
        var bId = '';
        if (this.props.binary_context && this.props.binary_context.indexOf('user_id=') === 0) {
            bId = this.props.binary_context.replace('user_id=', '');
        } else if (this.props.value) {
            bId = this.props.value;
        } else {
            bId = _pydioUtilLang2['default'].computeStringSlug(this.props.attributes["name"] + ".png");
        }
        url = url.replace('{BINARY}', bId);
        return url;
    },

    uploadComplete: function uploadComplete(newBinaryName) {
        var prevValue = this.state.value;
        this.setState({
            temporaryBinary: newBinaryName,
            value: null
        });
        if (this.props.onChange) {
            var additionalFormData = { type: 'binary' };
            if (this.state.originalBinary) {
                additionalFormData['original_binary'] = this.state.originalBinary;
            }
            this.props.onChange(newBinaryName, prevValue, additionalFormData);
        }
    },

    htmlUpload: function htmlUpload() {
        window.formManagerHiddenIFrameSubmission = (function (result) {
            this.uploadComplete(result.trim());
            window.formManagerHiddenIFrameSubmission = null;
        }).bind(this);
        this.refs.uploadForm.submit();
    },

    onDrop: function onDrop(files, event, dropzone) {
        var _this = this;

        if (_pydioHttpApi2['default'].supportsUpload()) {
            this.setState({ loading: true });
            _pydioHttpApi2['default'].getRestClient().getOrUpdateJwt().then(function (jwt) {
                var xhrSettings = { customHeaders: { Authorization: 'Bearer ' + jwt } };
                _pydioHttpApi2['default'].getClient().uploadFile(files[0], "userfile", '', (function (transport) {
                    var result = JSON.parse(transport.responseText);
                    if (result && result.binary) {
                        this.uploadComplete(result.binary);
                    }
                    this.setState({ loading: false });
                }).bind(_this), (function (transport) {
                    // error
                    this.setState({ loading: false });
                }).bind(_this), function (computableEvent) {
                    // progress
                    // console.log(computableEvent);
                }, _this.getUploadUrl(), xhrSettings);
            });
        } else {
            this.htmlUpload();
        }
    },

    clearImage: function clearImage() {
        var _this2 = this;

        if (global.confirm('Do you want to remove the current image?')) {
            (function () {
                var prevValue = _this2.state.value;
                _this2.setState({
                    value: null,
                    reset: true
                }, (function () {
                    this.props.onChange('', prevValue, { type: 'binary' });
                }).bind(_this2));
            })();
        }
    },

    render: function render() {
        var coverImageStyle = {
            backgroundImage: "url(" + this.state.imageSrc + ")",
            backgroundPosition: "50% 50%",
            backgroundSize: "cover"
        };
        var icons = [];
        if (this.state && this.state.loading) {
            icons.push(_react2['default'].createElement('span', { key: 'spinner', className: 'icon-spinner rotating', style: { opacity: '0' } }));
        } else {
            icons.push(_react2['default'].createElement('span', { key: 'camera', className: 'icon-camera', style: { opacity: '0' } }));
        }

        return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
                'div',
                { className: 'image-label' },
                this.props.attributes.label
            ),
            _react2['default'].createElement(
                'form',
                { ref: 'uploadForm', encType: 'multipart/form-data', target: 'uploader_hidden_iframe', method: 'post', action: this.getUploadUrl() },
                _react2['default'].createElement(
                    BinaryDropZone,
                    { onDrop: this.onDrop, accept: 'image/*', style: coverImageStyle },
                    icons
                )
            ),
            _react2['default'].createElement(
                'div',
                { className: 'binary-remove-button', onClick: this.clearImage },
                _react2['default'].createElement('span', { key: 'remove', className: 'mdi mdi-close' }),
                ' RESET'
            ),
            _react2['default'].createElement('iframe', { style: { display: "none" }, id: 'uploader_hidden_iframe', name: 'uploader_hidden_iframe' })
        );
    }

});
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../mixins/FormMixin":17,"./FileDropzone":3,"pydio":"pydio","pydio/http/api":"pydio/http/api","pydio/util/lang":"pydio/util/lang","react":"react"}],7:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsFormMixin = require('../mixins/FormMixin');

var _mixinsFormMixin2 = _interopRequireDefault(_mixinsFormMixin);

var React = require('react');
var ReactMUI = require('material-ui-legacy');

/**
 * Text input that is converted to integer, and
 * the UI can react to arrows for incrementing/decrementing values
 */
exports['default'] = React.createClass({
    displayName: 'InputInteger',

    mixins: [_mixinsFormMixin2['default']],

    keyDown: function keyDown(event) {
        var inc = 0,
            multiple = 1;
        if (event.key == 'Enter') {
            this.toggleEditMode();
            return;
        } else if (event.key == 'ArrowUp') {
            inc = +1;
        } else if (event.key == 'ArrowDown') {
            inc = -1;
        }
        if (event.shiftKey) {
            multiple = 10;
        }
        var parsed = parseInt(this.state.value);
        if (isNaN(parsed)) parsed = 0;
        var value = parsed + inc * multiple;
        this.onChange(null, value);
    },

    render: function render() {
        if (this.isDisplayGrid() && !this.state.editMode) {
            var value = this.state.value;
            return React.createElement(
                'div',
                { onClick: this.props.disabled ? function () {} : this.toggleEditMode, className: value ? '' : 'paramValue-empty' },
                !value ? 'Empty' : value
            );
        } else {
            var intval = undefined;
            if (this.state.value) {
                intval = parseInt(this.state.value) + '';
                if (isNaN(intval)) intval = this.state.value + '';
            } else {
                intval = '0';
            }
            return React.createElement(
                'span',
                { className: 'integer-input' },
                React.createElement(ReactMUI.TextField, {
                    value: intval,
                    onChange: this.onChange,
                    onKeyDown: this.keyDown,
                    disabled: this.props.disabled,
                    floatingLabelText: this.isDisplayForm() ? this.props.attributes.label : null
                })
            );
        }
    }

});
module.exports = exports['default'];

},{"../mixins/FormMixin":17,"material-ui-legacy":"material-ui-legacy","react":"react"}],8:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsFormMixin = require('../mixins/FormMixin');

var _mixinsFormMixin2 = _interopRequireDefault(_mixinsFormMixin);

var _mixinsFieldWithChoices = require('../mixins/FieldWithChoices');

var _mixinsFieldWithChoices2 = _interopRequireDefault(_mixinsFieldWithChoices);

/**
 * Select box input conforming to Pydio standard form parameter.
 */

var React = require('react');

var _require = require('material-ui');

var SelectField = _require.SelectField;
var MenuItem = _require.MenuItem;
var Chip = _require.Chip;

var LangUtils = require('pydio/util/lang');
var InputSelectBox = React.createClass({
    displayName: 'InputSelectBox',

    mixins: [_mixinsFormMixin2['default']],

    getDefaultProps: function getDefaultProps() {
        return {
            skipBufferChanges: true
        };
    },

    onDropDownChange: function onDropDownChange(event, index, value) {
        this.onChange(event, value);
        this.toggleEditMode();
    },

    onMultipleSelect: function onMultipleSelect(event, index, newValue) {
        if (newValue == -1) return;
        var currentValue = this.state.value;
        var currentValues = typeof currentValue === 'string' ? currentValue.split(',') : currentValue;
        if (!currentValues.indexOf(newValue) !== -1) {
            currentValues.push(newValue);
            this.onChange(event, currentValues.join(','));
        }
        this.toggleEditMode();
    },

    onMultipleRemove: function onMultipleRemove(value) {
        var currentValue = this.state.value;
        var currentValues = typeof currentValue === 'string' ? currentValue.split(',') : currentValue;
        if (currentValues.indexOf(value) !== -1) {
            currentValues = LangUtils.arrayWithout(currentValues, currentValues.indexOf(value));
            this.onChange(null, currentValues.join(','));
        }
    },

    render: function render() {
        var _this = this;

        var currentValue = this.state.value;
        var menuItems = [],
            multipleOptions = [],
            mandatory = true;
        if (!this.props.attributes['mandatory'] || this.props.attributes['mandatory'] != "true") {
            mandatory = false;
            menuItems.push(React.createElement(MenuItem, { value: -1, primaryText: this.props.attributes['label'] + '...' }));
        }
        var choices = this.props.choices;

        choices.forEach(function (value, key) {
            menuItems.push(React.createElement(MenuItem, { value: key, primaryText: value }));
            multipleOptions.push({ value: key, label: value });
        });
        if (this.isDisplayGrid() && !this.state.editMode || this.props.disabled) {
            var value = this.state.value;
            if (choices.get(value)) value = choices.get(value);
            return React.createElement(
                'div',
                {
                    onClick: this.props.disabled ? function () {} : this.toggleEditMode,
                    className: value ? '' : 'paramValue-empty' },
                !value ? 'Empty' : value,
                '   ',
                React.createElement('span', { className: 'icon-caret-down' })
            );
        } else {
            var hasValue = false;
            if (this.props.multiple && this.props.multiple == true) {
                var currentValues = currentValue;
                if (typeof currentValue === "string") {
                    currentValues = currentValue.split(",");
                }
                hasValue = currentValues.length ? true : false;
                return React.createElement(
                    'span',
                    { className: "multiple has-value" },
                    React.createElement(
                        'div',
                        { style: { display: 'flex', flexWrap: 'wrap' } },
                        currentValues.map(function (v) {
                            return React.createElement(
                                Chip,
                                { onRequestDelete: function () {
                                        _this.onMultipleRemove(v);
                                    } },
                                v
                            );
                        })
                    ),
                    React.createElement(
                        SelectField,
                        {
                            value: -1,
                            onChange: this.onMultipleSelect,
                            fullWidth: true,
                            className: this.props.className
                        },
                        menuItems
                    )
                );
            } else {
                return React.createElement(
                    'span',
                    null,
                    React.createElement(
                        SelectField,
                        {
                            floatingLabelText: this.props.attributes.label,
                            value: currentValue,
                            onChange: this.onDropDownChange,
                            fullWidth: true,
                            className: this.props.className
                        },
                        menuItems
                    )
                );
            }
        }
    }
});

exports['default'] = InputSelectBox = _mixinsFieldWithChoices2['default'](InputSelectBox);
exports['default'] = InputSelectBox;
module.exports = exports['default'];

},{"../mixins/FieldWithChoices":16,"../mixins/FormMixin":17,"material-ui":"material-ui","pydio/util/lang":"pydio/util/lang","react":"react"}],9:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsActionRunnerMixin = require('../mixins/ActionRunnerMixin');

var _mixinsActionRunnerMixin2 = _interopRequireDefault(_mixinsActionRunnerMixin);

var React = require('react');

exports['default'] = React.createClass({
    displayName: 'MonitoringLabel',

    mixins: [_mixinsActionRunnerMixin2['default']],

    getInitialState: function getInitialState() {
        var loadingMessage = 'Loading';
        if (this.context && this.context.getMessage) {
            loadingMessage = this.context.getMessage(466, '');
        } else if (global.pydio && global.pydio.MessageHash) {
            loadingMessage = global.pydio.MessageHash[466];
        }
        return { status: loadingMessage };
    },

    componentDidMount: function componentDidMount() {
        var callback = (function (transport) {
            this.setState({ status: transport.responseText });
        }).bind(this);
        this._poller = (function () {
            this.applyAction(callback);
        }).bind(this);
        this._poller();
        this._pe = global.setInterval(this._poller, 10000);
    },

    componentWillUnmount: function componentWillUnmount() {
        if (this._pe) {
            global.clearInterval(this._pe);
        }
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            this.state.status
        );
    }

});
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../mixins/ActionRunnerMixin":15,"react":"react"}],10:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsFormMixin = require('../mixins/FormMixin');

var _mixinsFormMixin2 = _interopRequireDefault(_mixinsFormMixin);

var _materialUi = require('material-ui');

/**
 * Text input, can be single line, multiLine, or password, depending on the
 * attributes.type key.
 */

var React = require('react');
exports['default'] = React.createClass({
    displayName: 'TextField',

    mixins: [_mixinsFormMixin2['default']],

    render: function render() {
        if (this.isDisplayGrid() && !this.state.editMode) {
            var value = this.state.value;
            if (this.props.attributes['type'] === 'password' && value) {
                value = '***********';
            } else {
                value = this.state.value;
            }
            return React.createElement(
                'div',
                { onClick: this.props.disabled ? function () {} : this.toggleEditMode, className: value ? '' : 'paramValue-empty' },
                !value ? 'Empty' : value
            );
        } else {
            var field = React.createElement(_materialUi.TextField, {
                floatingLabelText: this.isDisplayForm() ? this.props.attributes.label : null,
                value: this.state.value || "",
                onChange: this.onChange,
                onKeyDown: this.enterToToggle,
                type: this.props.attributes['type'] === 'password' ? 'password' : null,
                multiLine: this.props.attributes['type'] === 'textarea',
                disabled: this.props.disabled,
                errorText: this.props.errorText,
                autoComplete: 'off',
                fullWidth: true
            });
            if (this.props.attributes['type'] === 'password') {
                return React.createElement(
                    'form',
                    { autoComplete: 'off', style: { display: 'inline' } },
                    field
                );
            } else {
                return React.createElement(
                    'span',
                    null,
                    field
                );
            }
        }
    }

});
module.exports = exports['default'];

},{"../mixins/FormMixin":17,"material-ui":"material-ui","react":"react"}],11:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsFormMixin = require('../mixins/FormMixin');

var _mixinsFormMixin2 = _interopRequireDefault(_mixinsFormMixin);

var _pydioUtilPass = require('pydio/util/pass');

var _pydioUtilPass2 = _interopRequireDefault(_pydioUtilPass);

var _materialUi = require('material-ui');

/**
 * Text input, can be single line, multiLine, or password, depending on the
 * attributes.type key.
 */

var React = require('react');
exports['default'] = React.createClass({
    displayName: 'ValidLogin',

    mixins: [_mixinsFormMixin2['default']],

    textValueChanged: function textValueChanged(event, value) {
        var err = _pydioUtilPass2['default'].isValidLogin(value);
        var prevStateValid = this.state.valid;
        var valid = !err;
        if (prevStateValid !== valid && this.props.onValidStatusChange) {
            this.props.onValidStatusChange(valid);
        }
        this.setState({ valid: valid, err: err });

        this.onChange(event, value);
    },

    render: function render() {
        var _this = this;

        if (this.isDisplayGrid() && !this.state.editMode) {
            var value = this.state.value;
            if (this.props.attributes['type'] === 'password' && value) {
                value = '***********';
            } else {
                value = this.state.value;
            }
            return React.createElement(
                'div',
                { onClick: this.props.disabled ? function () {} : this.toggleEditMode, className: value ? '' : 'paramValue-empty' },
                !value ? 'Empty' : value
            );
        } else {
            var err = this.state.err;

            var field = React.createElement(_materialUi.TextField, {
                floatingLabelText: this.isDisplayForm() ? this.props.attributes.label : null,
                value: this.state.value || "",
                onChange: function (e, v) {
                    return _this.textValueChanged(e, v);
                },
                onKeyDown: this.enterToToggle,
                type: this.props.attributes['type'] === 'password' ? 'password' : null,
                multiLine: this.props.attributes['type'] === 'textarea',
                disabled: this.props.disabled,
                errorText: this.props.errorText || err,
                autoComplete: 'off',
                fullWidth: true
            });
            if (this.props.attributes['type'] === 'password') {
                return React.createElement(
                    'form',
                    { autoComplete: 'off', style: { display: 'inline' } },
                    field
                );
            } else {
                return React.createElement(
                    'span',
                    null,
                    field
                );
            }
        }
    }

});
module.exports = exports['default'];

},{"../mixins/FormMixin":17,"material-ui":"material-ui","pydio/util/pass":"pydio/util/pass","react":"react"}],12:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsFormMixin = require('../mixins/FormMixin');

var _mixinsFormMixin2 = _interopRequireDefault(_mixinsFormMixin);

var PassUtils = require('pydio/util/pass');
var React = require('react');

var _require = require('material-ui');

var TextField = _require.TextField;
exports['default'] = React.createClass({
    displayName: 'ValidPassword',

    mixins: [_mixinsFormMixin2['default']],

    isValid: function isValid() {
        return this.state.valid;
    },

    checkMinLength: function checkMinLength(value) {
        var minLength = parseInt(global.pydio.getPluginConfigs("core.auth").get("PASSWORD_MINLENGTH"));
        return !(value && value.length < minLength);
    },

    getMessage: function getMessage(messageId) {
        if (this.context && this.context.getMessage) {
            return this.context.getMessage(messageId, '');
        } else if (global.pydio && global.pydio.MessageHash) {
            return global.pydio.MessageHash[messageId];
        }
    },

    updatePassState: function updatePassState() {
        var prevStateValid = this.state.valid;
        var newState = PassUtils.getState(this.refs.pass.getValue(), this.refs.confirm ? this.refs.confirm.getValue() : '');
        this.setState(newState);
        if (prevStateValid !== newState.valid && this.props.onValidStatusChange) {
            this.props.onValidStatusChange(newState.valid);
        }
    },

    onPasswordChange: function onPasswordChange(event) {
        this.updatePassState();
        this.onChange(event, event.target.value);
    },

    onConfirmChange: function onConfirmChange(event) {
        this.setState({ confirmValue: event.target.value });
        this.updatePassState();
        this.onChange(event, this.state.value);
    },

    render: function render() {
        if (this.isDisplayGrid() && !this.state.editMode) {
            var value = this.state.value;
            return React.createElement(
                'div',
                { onClick: this.props.disabled ? function () {} : this.toggleEditMode, className: value ? '' : 'paramValue-empty' },
                !value ? 'Empty' : value
            );
        } else {
            var overflow = { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%' };
            var className = this.state.valid ? '' : 'mui-error-as-hint';
            if (this.props.className) {
                className = this.props.className + ' ' + className;
            }
            var _confirm = undefined;
            if (this.state.value && !this.props.disabled) {
                _confirm = [React.createElement('div', { key: 'sep', style: { width: 20 } }), React.createElement(TextField, {
                    key: 'confirm',
                    ref: 'confirm',
                    floatingLabelText: this.getMessage(199),
                    floatingLabelShrinkStyle: _extends({}, overflow, { width: '130%' }),
                    floatingLabelStyle: overflow,
                    className: className,
                    value: this.state.confirmValue,
                    onChange: this.onConfirmChange,
                    type: 'password',
                    multiLine: false,
                    disabled: this.props.disabled,
                    fullWidth: true,
                    style: { flex: 1 },
                    errorText: this.state.confirmErrorText
                })];
            }
            return React.createElement(
                'form',
                { autoComplete: 'off' },
                React.createElement(
                    'div',
                    { style: { display: 'flex', marginTop: -16 } },
                    React.createElement(TextField, {
                        ref: 'pass',
                        floatingLabelText: this.isDisplayForm() ? this.props.attributes.label : null,
                        floatingLabelShrinkStyle: _extends({}, overflow, { width: '130%' }),
                        floatingLabelStyle: overflow,
                        className: className,
                        value: this.state.value,
                        onChange: this.onPasswordChange,
                        onKeyDown: this.enterToToggle,
                        type: 'password',
                        multiLine: false,
                        disabled: this.props.disabled,
                        errorText: this.state.passErrorText,
                        fullWidth: true,
                        style: { flex: 1 }
                    }),
                    _confirm
                )
            );
        }
    }

});
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../mixins/FormMixin":17,"material-ui":"material-ui","pydio/util/pass":"pydio/util/pass","react":"react"}],13:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mixinsHelperMixin = require('./mixins/HelperMixin');

var _mixinsHelperMixin2 = _interopRequireDefault(_mixinsHelperMixin);

var _managerManager = require('./manager/Manager');

var _managerManager2 = _interopRequireDefault(_managerManager);

var _fieldsTextField = require('./fields/TextField');

var _fieldsTextField2 = _interopRequireDefault(_fieldsTextField);

var _fieldsValidPassword = require('./fields/ValidPassword');

var _fieldsValidPassword2 = _interopRequireDefault(_fieldsValidPassword);

var _fieldsInputInteger = require('./fields/InputInteger');

var _fieldsInputInteger2 = _interopRequireDefault(_fieldsInputInteger);

var _fieldsInputBoolean = require('./fields/InputBoolean');

var _fieldsInputBoolean2 = _interopRequireDefault(_fieldsInputBoolean);

var _fieldsInputButton = require('./fields/InputButton');

var _fieldsInputButton2 = _interopRequireDefault(_fieldsInputButton);

var _fieldsMonitoringLabel = require('./fields/MonitoringLabel');

var _fieldsMonitoringLabel2 = _interopRequireDefault(_fieldsMonitoringLabel);

var _fieldsInputSelectBox = require('./fields/InputSelectBox');

var _fieldsInputSelectBox2 = _interopRequireDefault(_fieldsInputSelectBox);

var _fieldsAutocompleteBox = require('./fields/AutocompleteBox');

var _fieldsAutocompleteBox2 = _interopRequireDefault(_fieldsAutocompleteBox);

var _fieldsInputImage = require('./fields/InputImage');

var _fieldsInputImage2 = _interopRequireDefault(_fieldsInputImage);

var _panelFormPanel = require('./panel/FormPanel');

var _panelFormPanel2 = _interopRequireDefault(_panelFormPanel);

var _panelFormHelper = require('./panel/FormHelper');

var _panelFormHelper2 = _interopRequireDefault(_panelFormHelper);

var _fieldsFileDropzone = require('./fields/FileDropzone');

var _fieldsFileDropzone2 = _interopRequireDefault(_fieldsFileDropzone);

var _fieldsAutocompleteTree = require('./fields/AutocompleteTree');

var _fieldsAutocompleteTree2 = _interopRequireDefault(_fieldsAutocompleteTree);

var PydioForm = {
  HelperMixin: _mixinsHelperMixin2['default'],
  Manager: _managerManager2['default'],
  InputText: _fieldsTextField2['default'],
  ValidPassword: _fieldsValidPassword2['default'],
  InputBoolean: _fieldsInputBoolean2['default'],
  InputInteger: _fieldsInputInteger2['default'],
  InputButton: _fieldsInputButton2['default'],
  MonitoringLabel: _fieldsMonitoringLabel2['default'],
  InputSelectBox: _fieldsInputSelectBox2['default'],
  AutocompleteBox: _fieldsAutocompleteBox2['default'],
  AutocompleteTree: _fieldsAutocompleteTree2['default'],
  InputImage: _fieldsInputImage2['default'],
  FormPanel: _panelFormPanel2['default'],
  PydioHelper: _panelFormHelper2['default'],
  FileDropZone: _fieldsFileDropzone2['default'],
  createFormElement: _managerManager2['default'].createFormElement
};

exports['default'] = PydioForm;
module.exports = exports['default'];

},{"./fields/AutocompleteBox":1,"./fields/AutocompleteTree":2,"./fields/FileDropzone":3,"./fields/InputBoolean":4,"./fields/InputButton":5,"./fields/InputImage":6,"./fields/InputInteger":7,"./fields/InputSelectBox":8,"./fields/MonitoringLabel":9,"./fields/TextField":10,"./fields/ValidPassword":12,"./manager/Manager":14,"./mixins/HelperMixin":18,"./panel/FormHelper":19,"./panel/FormPanel":20}],14:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fieldsValidLogin = require('../fields/ValidLogin');

var _fieldsValidLogin2 = _interopRequireDefault(_fieldsValidLogin);

var XMLUtils = require('pydio/util/xml');
var InputBoolean = require('./../fields/InputBoolean');
var InputText = require('./../fields/TextField');
var ValidPassword = require('./../fields/ValidPassword');
var InputInteger = require('./../fields/InputInteger');
var InputButton = require('./../fields/InputButton');
var MonitoringLabel = require('./../fields/MonitoringLabel');
var InputImage = require('./../fields/InputImage');
var SelectBox = require('./../fields/InputSelectBox');
var AutocompleteBox = require('./../fields/AutocompleteBox');
var AutocompleteTree = require('./../fields/AutocompleteTree');

/**
 * Utility class to parse / handle pydio standard form definitions/values.
 */

var Manager = (function () {
    function Manager() {
        _classCallCheck(this, Manager);
    }

    Manager.hasHelper = function hasHelper(pluginId, paramName) {

        var helpers = Manager.getHelpersCache();
        return helpers[pluginId] && helpers[pluginId]['parameters'][paramName];
    };

    Manager.getHelpersCache = function getHelpersCache() {
        if (!Manager.HELPERS_CACHE) {
            var helperCache = {};
            var helpers = XMLUtils.XPathSelectNodes(window.pydio.Registry.getXML(), 'plugins/*/client_settings/resources/js[@type="helper"]');
            for (var i = 0; i < helpers.length; i++) {
                var helperNode = helpers[i];
                var plugin = helperNode.getAttribute("plugin");
                helperCache[plugin] = { namespace: helperNode.getAttribute('className'), parameters: {} };
                var paramNodes = XMLUtils.XPathSelectNodes(helperNode, 'parameter');
                for (var k = 0; k < paramNodes.length; k++) {
                    var paramNode = paramNodes[k];
                    helperCache[plugin]['parameters'][paramNode.getAttribute('name')] = true;
                }
            }
            Manager.HELPERS_CACHE = helperCache;
        }
        return Manager.HELPERS_CACHE;
    };

    Manager.parseParameters = function parseParameters(xmlDocument, query) {
        return XMLUtils.XPathSelectNodes(xmlDocument, query).map((function (node) {
            return Manager.parameterNodeToHash(node);
        }).bind(this));
    };

    Manager.parameterNodeToHash = function parameterNodeToHash(paramNode) {
        var paramsAtts = paramNode.attributes;
        var paramsObject = {};
        if (paramNode.parentNode && paramNode.parentNode.parentNode && paramNode.parentNode.parentNode.getAttribute) {
            paramsObject["pluginId"] = paramNode.parentNode.parentNode.getAttribute("id");
        }
        var collectCdata = false;
        var MessageHash = global.pydio.MessageHash;

        for (var i = 0; i < paramsAtts.length; i++) {
            var attName = paramsAtts.item(i).nodeName;
            var value = paramsAtts.item(i).value;
            if ((attName === "label" || attName === "description" || attName === "group" || attName.indexOf("group_switch_") === 0) && MessageHash[value]) {
                value = MessageHash[value];
            }
            if (attName === "cdatavalue") {
                collectCdata = true;
                continue;
            }
            paramsObject[attName] = value;
        }
        if (collectCdata) {
            paramsObject['value'] = paramNode.firstChild.value;
        }
        if (paramsObject['type'] === 'boolean') {
            if (paramsObject['value'] !== undefined) {
                paramsObject['value'] = paramsObject['value'] === "true";
            }
            if (paramsObject['default'] !== undefined) {
                paramsObject['default'] = paramsObject['default'] === "true";
            }
        } else if (paramsObject['type'] === 'integer') {
            if (paramsObject['value'] !== undefined) {
                paramsObject['value'] = parseInt(paramsObject['value']);
            }
            if (paramsObject['default'] !== undefined) {
                paramsObject['default'] = parseInt(paramsObject['default']);
            }
        }
        return paramsObject;
    };

    Manager.createFormElement = function createFormElement(props) {
        var value = undefined;
        switch (props.attributes['type']) {
            case 'boolean':
                value = React.createElement(InputBoolean, props);
                break;
            case 'string':
            case 'textarea':
            case 'password':
                value = React.createElement(InputText, props);
                break;
            case 'valid-password':
                value = React.createElement(ValidPassword, props);
                break;
            case 'valid-login':
                value = React.createElement(_fieldsValidLogin2['default'], props);
                break;
            case 'integer':
                value = React.createElement(InputInteger, props);
                break;
            case 'button':
                value = React.createElement(InputButton, props);
                break;
            case 'monitor':
                value = React.createElement(MonitoringLabel, props);
                break;
            case 'image':
                value = React.createElement(InputImage, props);
                break;
            case 'select':
                value = React.createElement(SelectBox, props);
                break;
            case 'autocomplete':
                value = React.createElement(AutocompleteBox, props);
                break;
            case 'autocomplete-tree':
                value = React.createElement(AutocompleteTree, props);
                break;
            case 'legend':
                value = null;
                break;
            case 'hidden':
                value = null;
                break;
            default:
                if (props.value) {
                    value = props.value;
                } else {
                    value = React.createElement(
                        'span',
                        { className: 'paramValue-empty' },
                        'Empty'
                    );
                }
                break;
        }
        return value;
    };

    Manager.SlashesToJson = function SlashesToJson(values) {
        if (values === undefined || typeof values !== 'object') {
            return values;
        }
        var newValues = {};
        var recurseOnKeys = {};
        Object.keys(values).forEach(function (k) {
            var data = values[k];
            if (k.indexOf('/') > 0) {
                var parts = k.split('/');
                var firstPart = parts.shift();
                var lastPart = parts.join('/');
                if (!newValues[firstPart]) {
                    newValues[firstPart] = {};
                } else if (typeof newValues[firstPart] === 'string') {
                    newValues[firstPart] = { '@value': newValues[firstPart] };
                }
                newValues[firstPart][lastPart] = data;
                recurseOnKeys[firstPart] = firstPart;
            } else {
                if (newValues[k] && typeof newValues[k] === 'object') {
                    newValues[k]['@value'] = data;
                } else {
                    newValues[k] = data;
                }
            }
        });
        Object.keys(recurseOnKeys).map(function (key) {
            newValues[key] = Manager.SlashesToJson(newValues[key]);
        });
        return newValues;
    };

    Manager.JsonToSlashes = function JsonToSlashes(values) {
        var prefix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

        var newValues = {};
        Object.keys(values).forEach(function (k) {
            if (typeof values[k] === 'object') {
                var subValues = Manager.JsonToSlashes(values[k], prefix + k + '/');
                newValues = _extends({}, newValues, subValues);
                if (values[k]['@value']) {
                    newValues[prefix + k] = values[k]['@value'];
                }
            } else {
                newValues[prefix + k] = values[k];
            }
        });
        return newValues;
    };

    /**
     *
     * Extract POST-ready values from a combo parameters/values
     *
     * @param definitions Array Standard Form Definition array
     * @param values Object Key/Values of the current form
     * @param prefix String Optional prefix to add to all parameters (by default DRIVER_OPTION_).
     * @returns Object Object with all pydio-compatible POST parameters
     */

    Manager.getValuesForPOST = function getValuesForPOST(definitions, values) {
        var prefix = arguments.length <= 2 || arguments[2] === undefined ? 'DRIVER_OPTION_' : arguments[2];
        var additionalMetadata = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

        var clientParams = {};
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                clientParams[prefix + key] = values[key];
                var defType = null;
                for (var d = 0; d < definitions.length; d++) {
                    if (definitions[d]['name'] == key) {
                        defType = definitions[d]['type'];
                        break;
                    }
                }
                if (!defType) {

                    var parts = key.split('/');
                    var last, prev;
                    if (parts.length > 1) {
                        last = parts.pop();
                        prev = parts.pop();
                    }
                    for (var k = 0; k < definitions.length; k++) {
                        if (last !== undefined) {
                            if (definitions[k]['name'] == last && definitions[k]['group_switch_name'] && definitions[k]['group_switch_name'] == prev) {
                                defType = definitions[k]['type'];
                                break;
                            }
                        } else {
                            if (definitions[k]['name'] == key) {
                                defType = definitions[k]['type'];
                                break;
                            }
                        }
                    }
                }
                //definitions.map(function(d){if(d.name == theKey) defType = d.type});
                if (defType) {
                    if (defType == "image") defType = "binary";
                    clientParams[prefix + key + '_ajxptype'] = defType;
                }
                if (additionalMetadata && additionalMetadata[key]) {
                    for (var meta in additionalMetadata[key]) {
                        if (additionalMetadata[key].hasOwnProperty(meta)) {
                            clientParams[prefix + key + '_' + meta] = additionalMetadata[key][meta];
                        }
                    }
                }
            }
        }

        // Reorder tree keys
        var allKeys = Object.keys(clientParams);
        allKeys.sort();
        allKeys.reverse();
        var treeKeys = {};
        allKeys.map(function (key) {
            if (key.indexOf("/") === -1) return;
            if (key.endsWith("_ajxptype")) return;
            var typeKey = key + "_ajxptype";
            var parts = key.split("/");
            var parentName = parts.shift();
            var parentKey;
            while (parts.length > 0) {
                if (!parentKey) {
                    parentKey = treeKeys;
                }
                if (!parentKey[parentName]) {
                    parentKey[parentName] = {};
                }
                parentKey = parentKey[parentName];
                parentName = parts.shift();
            }
            var type = clientParams[typeKey];
            delete clientParams[typeKey];
            if (parentKey && !parentKey[parentName]) {
                if (type == "boolean") {
                    var v = clientParams[key];
                    parentKey[parentName] = v == "true" || v == 1 || v === true;
                } else if (type == "integer") {
                    parentKey[parentName] = parseInt(clientParams[key]);
                } else if (type && type.startsWith("group_switch:") && typeof clientParams[key] == "string") {
                    parentKey[parentName] = { group_switch_value: clientParams[key] };
                } else {
                    parentKey[parentName] = clientParams[key];
                }
            } else if (parentKey && type && type.startsWith('group_switch:')) {
                parentKey[parentName]["group_switch_value"] = clientParams[key];
            }
            delete clientParams[key];
        });
        for (key in treeKeys) {
            if (!treeKeys.hasOwnProperty(key)) continue;
            var treeValue = treeKeys[key];
            if (clientParams[key + '_ajxptype'] && clientParams[key + '_ajxptype'].indexOf('group_switch:') === 0 && !treeValue['group_switch_value']) {
                treeValue['group_switch_value'] = clientParams[key];
            }

            clientParams[key] = JSON.stringify(treeValue);
            clientParams[key + '_ajxptype'] = "text/json";
        }

        // Clean XXX_group_switch parameters
        for (var theKey in clientParams) {
            if (!clientParams.hasOwnProperty(theKey)) continue;

            if (theKey.indexOf("/") == -1 && clientParams[theKey] && clientParams[theKey + "_ajxptype"] && clientParams[theKey + "_ajxptype"].startsWith("group_switch:")) {
                if (typeof clientParams[theKey] == "string") {
                    clientParams[theKey] = JSON.stringify({ group_switch_value: clientParams[theKey] });
                    clientParams[theKey + "_ajxptype"] = "text/json";
                }
            }
            if (clientParams.hasOwnProperty(theKey)) {
                if (theKey.endsWith("_group_switch")) {
                    delete clientParams[theKey];
                }
            }
        }

        return clientParams;
    };

    return Manager;
})();

exports['default'] = Manager;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../fields/ValidLogin":11,"./../fields/AutocompleteBox":1,"./../fields/AutocompleteTree":2,"./../fields/InputBoolean":4,"./../fields/InputButton":5,"./../fields/InputImage":6,"./../fields/InputInteger":7,"./../fields/InputSelectBox":8,"./../fields/MonitoringLabel":9,"./../fields/TextField":10,"./../fields/ValidPassword":12,"pydio/util/xml":"pydio/util/xml"}],15:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;
var React = require('react');
var PathUtils = require('pydio/util/path');

exports['default'] = {

    propTypes: {
        attributes: React.PropTypes.object.isRequired,
        applyButtonAction: React.PropTypes.func,
        actionCallback: React.PropTypes.func
    },

    applyAction: function applyAction(callback) {
        var choicesValue = this.props.attributes['choices'].split(":");
        var firstPart = choicesValue.shift();
        if (firstPart === "run_client_action" && global.pydio) {
            global.pydio.getController().fireAction(choicesValue.shift());
            return;
        }
        if (this.props.applyButtonAction) {
            var parameters = { action: firstPart };
            if (choicesValue.length > 1) {
                parameters['action_plugin_id'] = choicesValue.shift();
                parameters['action_plugin_method'] = choicesValue.shift();
            }
            if (this.props.attributes['name'].indexOf("/") !== -1) {
                parameters['button_key'] = PathUtils.getDirname(this.props.attributes['name']);
            }
            this.props.applyButtonAction(parameters, callback);
        }
    }

};
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"pydio/util/path":"pydio/util/path","react":"react"}],16:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('react');

var Component = _require.Component;

var _require$requireLib = require('pydio').requireLib('boot');

var PydioContextConsumer = _require$requireLib.PydioContextConsumer;

exports['default'] = function (PydioComponent) {
    var FieldWithChoices = (function (_Component) {
        _inherits(FieldWithChoices, _Component);

        FieldWithChoices.prototype.loadExternalValues = function loadExternalValues(choices) {
            var _this = this;

            var pydio = this.props.pydio;

            var parsed = true;

            var list_action = undefined;
            if (choices instanceof Map) {
                if (this.onChoicesLoaded) this.onChoicesLoaded(choices);
                return { choices: choices, parsed: parsed };
            }

            var output = new Map();
            if (choices.indexOf('json_file:') === 0) {
                parsed = false;
                list_action = choices.replace('json_file:', '');
                output.set('0', pydio.MessageHash['ajxp_admin.home.6']);
                PydioApi.getClient().loadFile(list_action, function (transport) {
                    var newOutput = new Map();
                    if (transport.responseJSON) {
                        transport.responseJSON.forEach(function (entry) {
                            newOutput.set(entry.key, entry.label);
                        });
                    } else if (transport.responseText) {
                        try {
                            JSON.parse(transport.responseText).forEach(function (entry) {
                                newOutput.set(entry.key, entry.label);
                            });
                        } catch (e) {
                            console.log('Error while parsing list ' + choices, e);
                        }
                    }
                    _this.setState({ choices: newOutput }, function () {
                        if (_this.onChoicesLoaded) {
                            _this.onChoicesLoaded(newOutput);
                        }
                    });
                });
            } else if (choices === "PYDIO_AVAILABLE_LANGUAGES") {
                pydio.listLanguagesWithCallback(function (key, label) {
                    output.set(key, label);
                });
                if (this.onChoicesLoaded) this.onChoicesLoaded(output);
            } else if (choices === "PYDIO_AVAILABLE_REPOSITORIES") {
                if (pydio.user) {
                    (function () {
                        var sorter = [];
                        pydio.user.repositories.forEach(function (repository) {
                            if (repository.getRepositoryType() !== "cell") {
                                sorter.push({ id: repository.getId(), label: repository.getLabel() });
                                //output.set(repository.getId(), repository.getLabel());
                            }
                        });
                        sorter.sort(function (a, b) {
                            return a.label > b.label ? 1 : -1;
                        });
                        sorter.forEach(function (d) {
                            return output.set(d.id, d.label);
                        });
                    })();
                }
                if (this.onChoicesLoaded) {
                    this.onChoicesLoaded(output);
                }
            } else {
                // Parse string and return map
                choices.split(",").map(function (choice) {
                    var label = undefined,
                        value = undefined;
                    var l = choice.split('|');
                    if (l.length > 1) {
                        value = l[0];
                        label = l[1];
                    } else {
                        value = label = choice;
                    }
                    if (global.pydio.MessageHash[label]) label = global.pydio.MessageHash[label];
                    output.set(value, label);
                });
            }
            return { choices: output, parsed: parsed };
        };

        function FieldWithChoices(props, context) {
            _classCallCheck(this, FieldWithChoices);

            _Component.call(this, props, context);
            var choices = new Map();
            choices.set('0', this.props.pydio ? this.props.pydio.MessageHash['ajxp_admin.home.6'] : ' ... ');
            this.state = { choices: choices, choicesParsed: false };
        }

        FieldWithChoices.prototype.componentDidMount = function componentDidMount() {
            if (this.props.attributes['choices']) {
                var _loadExternalValues = this.loadExternalValues(this.props.attributes['choices']);

                var choices = _loadExternalValues.choices;
                var parsed = _loadExternalValues.parsed;

                this.setState({ choices: choices, choicesParsed: parsed });
            }
        };

        FieldWithChoices.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
            if (newProps.attributes['choices'] && newProps.attributes['choices'] !== this.props.attributes['choices']) {
                var _loadExternalValues2 = this.loadExternalValues(newProps.attributes['choices']);

                var choices = _loadExternalValues2.choices;
                var parsed = _loadExternalValues2.parsed;

                this.setState({
                    choices: choices,
                    choicesParsed: parsed
                });
            }
        };

        FieldWithChoices.prototype.render = function render() {
            return React.createElement(PydioComponent, _extends({}, this.props, this.state));
        };

        return FieldWithChoices;
    })(Component);

    FieldWithChoices = PydioContextConsumer(FieldWithChoices);

    return FieldWithChoices;
};

module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"pydio":"pydio","react":"react"}],17:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;
var React = require('react');
var PydioApi = require('pydio/http/api');
/**
 * React Mixin for Form Element
 */
exports['default'] = {

    propTypes: {
        attributes: React.PropTypes.object.isRequired,
        name: React.PropTypes.string.isRequired,

        displayContext: React.PropTypes.oneOf(['form', 'grid']),
        disabled: React.PropTypes.bool,
        multiple: React.PropTypes.bool,
        value: React.PropTypes.any,
        onChange: React.PropTypes.func,
        onChangeEditMode: React.PropTypes.func,
        binary_context: React.PropTypes.string,
        errorText: React.PropTypes.string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            displayContext: 'form',
            disabled: false
        };
    },

    isDisplayGrid: function isDisplayGrid() {
        return this.props.displayContext == 'grid';
    },

    isDisplayForm: function isDisplayForm() {
        return this.props.displayContext == 'form';
    },

    toggleEditMode: function toggleEditMode() {
        if (this.isDisplayForm()) return;
        var newState = !this.state.editMode;
        this.setState({ editMode: newState });
        if (this.props.onChangeEditMode) {
            this.props.onChangeEditMode(newState);
        }
    },

    enterToToggle: function enterToToggle(event) {
        if (event.key == 'Enter') {
            this.toggleEditMode();
        }
    },

    bufferChanges: function bufferChanges(newValue, oldValue) {
        this.triggerPropsOnChange(newValue, oldValue);
    },

    onChange: function onChange(event, value) {
        if (value === undefined) {
            value = event.currentTarget.getValue ? event.currentTarget.getValue() : event.currentTarget.value;
        }
        if (this.changeTimeout) {
            global.clearTimeout(this.changeTimeout);
        }
        var newValue = value,
            oldValue = this.state.value;
        if (this.props.skipBufferChanges) {
            this.triggerPropsOnChange(newValue, oldValue);
        }
        this.setState({
            dirty: true,
            value: newValue
        });
        if (!this.props.skipBufferChanges) {
            var timerLength = 250;
            if (this.props.attributes['type'] === 'password') {
                timerLength = 1200;
            }
            this.changeTimeout = global.setTimeout((function () {
                this.bufferChanges(newValue, oldValue);
            }).bind(this), timerLength);
        }
    },

    triggerPropsOnChange: function triggerPropsOnChange(newValue, oldValue) {
        if (this.props.attributes['type'] === 'password') {
            this.toggleEditMode();
            this.props.onChange(newValue, oldValue, { type: this.props.attributes['type'] });
        } else {
            this.props.onChange(newValue, oldValue);
        }
    },

    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value,
            dirty: false
        });
    },

    getInitialState: function getInitialState() {
        return {
            editMode: false,
            dirty: false,
            value: this.props.value
        };
    }

};
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"pydio/http/api":"pydio/http/api","react":"react"}],18:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;
var React = require('react');
/**
 * React Mixin for the form helper : default properties that
 * helpers can receive
 */
exports['default'] = {
  propTypes: {
    paramName: React.PropTypes.string,
    paramAttributes: React.PropTypes.object,
    values: React.PropTypes.object,
    updateCallback: React.PropTypes.func
  }
};
module.exports = exports['default'];

},{"react":"react"}],19:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _managerManager = require('../manager/Manager');

var _managerManager2 = _interopRequireDefault(_managerManager);

var React = require('react');

var _require$requireLib = require('pydio').requireLib('boot');

var AsyncComponent = _require$requireLib.AsyncComponent;

/**
 * Display a form companion linked to a given input.
 * Props: helperData : contains the pluginId and the whole paramAttributes
 */
exports['default'] = React.createClass({
    displayName: 'FormHelper',

    propTypes: {
        helperData: React.PropTypes.object,
        close: React.PropTypes.func.isRequired
    },

    closeHelper: function closeHelper() {
        this.props.close();
    },

    render: function render() {
        var helper = undefined;
        if (this.props.helperData) {
            var helpersCache = _managerManager2['default'].getHelpersCache();
            var pluginHelperNamespace = helpersCache[this.props.helperData['pluginId']]['namespace'];
            helper = React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'helper-title' },
                    React.createElement('span', { className: 'helper-close mdi mdi-close', onClick: this.closeHelper }),
                    'Pydio Companion'
                ),
                React.createElement(
                    'div',
                    { className: 'helper-content' },
                    React.createElement(AsyncComponent, _extends({}, this.props.helperData, {
                        namespace: pluginHelperNamespace,
                        componentName: 'Helper',
                        paramName: this.props.helperData['paramAttributes']['name']
                    }))
                )
            );
        }
        return React.createElement(
            'div',
            { className: 'pydio-form-helper' + (helper ? ' helper-visible' : ' helper-empty'), style: { zIndex: 1 } },
            helper
        );
    }

});
module.exports = exports['default'];

},{"../manager/Manager":14,"pydio":"pydio","react":"react"}],20:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _GroupSwitchPanel = require('./GroupSwitchPanel');

var _GroupSwitchPanel2 = _interopRequireDefault(_GroupSwitchPanel);

var _ReplicationPanel = require('./ReplicationPanel');

var _ReplicationPanel2 = _interopRequireDefault(_ReplicationPanel);

var _managerManager = require('../manager/Manager');

var _managerManager2 = _interopRequireDefault(_managerManager);

var _pydioUtilLang = require("pydio/util/lang");

var _pydioUtilLang2 = _interopRequireDefault(_pydioUtilLang);

var _materialUi = require("material-ui");

/**
 * Form Panel is a ready to use form builder inherited for Pydio's legacy parameters formats ('standard form').
 * It is very versatile and can basically take a set of parameters defined in the XML manifests (or defined manually
 * in JS) and display them as a user form.
 * It is a controlled component: it takes a {values} object and triggers back an onChange() function.
 *
 * See also Manager class to get some utilitary functions to parse parameters and extract values for the form.
 */
exports['default'] = _react2['default'].createClass({
    displayName: 'FormPanel',

    _hiddenValues: {},
    _internalValid: null,
    _parametersMetadata: null,

    propTypes: {
        /**
         * Array of Pydio StandardForm parameters
         */
        parameters: _react2['default'].PropTypes.array.isRequired,
        /**
         * Object containing values for the parameters
         */
        values: _react2['default'].PropTypes.object,
        /**
         * Trigger unitary function when one form input changes.
         */
        onParameterChange: _react2['default'].PropTypes.func,
        /**
         * Send all form values onchange, including eventually the removed ones (for dynamic panels)
         */
        onChange: _react2['default'].PropTypes.func,
        /**
         * Triggered when the form globabally switches between valid and invalid state
         * Triggered once at form construction
         */
        onValidStatusChange: _react2['default'].PropTypes.func,
        /**
         * Disable the whole form at once
         */
        disabled: _react2['default'].PropTypes.bool,
        /**
         * String added to the image inputs for upload/download operations
         */
        binary_context: _react2['default'].PropTypes.string,
        /**
         * 0 by default, subforms will have their zDepth value increased by one
         */
        depth: _react2['default'].PropTypes.number,

        /**
         * Add an additional header component (added inside first subpanel)
         */
        header: _react2['default'].PropTypes.object,
        /**
         * Add an additional footer component (added inside last subpanel)
         */
        footer: _react2['default'].PropTypes.object,
        /**
         * Add other arbitrary panels, either at the top or the bottom
         */
        additionalPanes: _react2['default'].PropTypes.shape({
            top: _react2['default'].PropTypes.array,
            bottom: _react2['default'].PropTypes.array
        }),
        /**
         * An array of tabs containing groupNames. Groups will be splitted
         * accross those tabs
         */
        tabs: _react2['default'].PropTypes.array,
        /**
         * Fired when a the active tab changes
         */
        onTabChange: _react2['default'].PropTypes.func,
        /**
         * A bit like tabs, but using accordion-like layout
         */
        accordionizeIfGroupsMoreThan: _react2['default'].PropTypes.number,
        /**
         * Forward an event when scrolling the form
         */
        onScrollCallback: _react2['default'].PropTypes.func,
        /**
         * Restrict to a subset of field groups
         */
        limitToGroups: _react2['default'].PropTypes.array,
        /**
         * Ignore some specific fields types
         */
        skipFieldsTypes: _react2['default'].PropTypes.array,

        /* Helper Options */
        /**
         * Pass pointers to the Pydio Companion container
         */
        setHelperData: _react2['default'].PropTypes.func,
        /**
         * Function to check if the companion is active or none and if a parameter
         * has helper data
         */
        checkHasHelper: _react2['default'].PropTypes.func,
        /**
         * Test for parameter
         */
        helperTestFor: _react2['default'].PropTypes.string

    },

    externallySelectTab: function externallySelectTab(index) {
        this.setState({ tabSelectedIndex: index });
    },

    getInitialState: function getInitialState() {
        if (this.props.onTabChange) {
            return { tabSelectedIndex: 0 };
        }
        return {};
    },

    getDefaultProps: function getDefaultProps() {
        return { depth: 0, values: {} };
    },

    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        if (JSON.stringify(newProps.parameters) !== JSON.stringify(this.props.parameters)) {
            this._internalValid = null;
            this._hiddenValues = {};
            this._parametersMetadata = {};
        }
        if (newProps.values && newProps.values !== this.props.values) {
            this.checkValidStatus(newProps.values);
        }
    },

    getValues: function getValues() {
        return this.props.values; //LangUtils.mergeObjectsRecursive(this._hiddenValues, this.props.values);
    },

    onParameterChange: function onParameterChange(paramName, newValue, oldValue) {
        var additionalFormData = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

        // Update writeValues
        var newValues = _pydioUtilLang2['default'].deepCopy(this.getValues());
        if (this.props.onParameterChange) {
            this.props.onParameterChange(paramName, newValue, oldValue, additionalFormData);
        }
        if (additionalFormData) {
            if (!this._parametersMetadata) {
                this._parametersMetadata = {};
            }
            this._parametersMetadata[paramName] = additionalFormData;
        }
        newValues[paramName] = newValue;
        var dirty = true;
        this.onChange(newValues, dirty);
    },

    onChange: function onChange(newValues, dirty, removeValues) {
        if (this.props.onChange) {
            //newValues = LangUtils.mergeObjectsRecursive(this._hiddenValues, newValues);
            for (var key in this._hiddenValues) {
                if (this._hiddenValues.hasOwnProperty(key) && newValues[key] === undefined && (!removeValues || removeValues[key] === undefined)) {
                    newValues[key] = this._hiddenValues[key];
                }
            }
            this.props.onChange(newValues, dirty, removeValues);
        }
        this.checkValidStatus(newValues);
    },

    onSubformChange: function onSubformChange(newValues, dirty, removeValues) {
        var values = _pydioUtilLang2['default'].mergeObjectsRecursive(this.getValues(), newValues);
        if (removeValues) {
            for (var k in removeValues) {
                if (removeValues.hasOwnProperty(k) && values[k] !== undefined) {
                    delete values[k];
                    if (this._hiddenValues[k] !== undefined) {
                        delete this._hiddenValues[k];
                    }
                }
            }
        }
        this.onChange(values, dirty, removeValues);
    },

    onSubformValidStatusChange: function onSubformValidStatusChange(newValidValue, failedMandatories) {
        if ((newValidValue !== this._internalValid || this.props.forceValidStatusCheck) && this.props.onValidStatusChange) {
            this.props.onValidStatusChange(newValidValue, failedMandatories);
        }
        this._internalValid = newValidValue;
    },

    applyButtonAction: function applyButtonAction(parameters, callback) {
        if (this.props.applyButtonAction) {
            this.props.applyButtonAction(parameters, callback);
        }
        /*
        // Old way
        parameters = LangUtils.mergeObjectsRecursive(parameters, this.getValuesForPOST(this.getValues()));
        PydioApi.getClient().request(parameters, callback);
        */
    },

    getValuesForPOST: function getValuesForPOST(values) {
        var prefix = arguments.length <= 1 || arguments[1] === undefined ? 'DRIVER_OPTION_' : arguments[1];

        return _managerManager2['default'].getValuesForPOST(this.props.parameters, values, prefix, this._parametersMetadata);
    },

    checkValidStatus: function checkValidStatus(values) {
        var failedMandatories = [];
        this.props.parameters.map((function (p) {
            if (['string', 'textarea', 'password', 'integer'].indexOf(p.type) > -1 && (p.mandatory === "true" || p.mandatory === true)) {
                if (!values || !values.hasOwnProperty(p.name) || values[p.name] === undefined || values[p.name] === "") {
                    failedMandatories.push(p);
                }
            }
            if (p.type === 'valid-password' && this.refs['form-element-' + p.name]) {
                if (!this.refs['form-element-' + p.name].isValid()) {
                    failedMandatories.push(p);
                }
            }
        }).bind(this));
        var previousValue = undefined,
            newValue = undefined;
        previousValue = this._internalValid; //(this._internalValid !== undefined ? this._internalValid : true);
        newValue = !failedMandatories.length;
        if ((newValue !== this._internalValid || this.props.forceValidStatusCheck) && this.props.onValidStatusChange) {
            this.props.onValidStatusChange(newValue, failedMandatories);
        }
        this._internalValid = newValue;
    },

    componentDidMount: function componentDidMount() {
        this.checkValidStatus(this.props.values);
    },

    renderGroupHeader: function renderGroupHeader(groupLabel, accordionize, index, active) {

        var properties = { key: 'group-' + groupLabel };
        if (accordionize) {
            var current = this.state && this.state.currentActiveGroup ? this.state.currentActiveGroup : null;
            properties['className'] = 'group-label-' + (active ? 'active' : 'inactive');
            properties['onClick'] = (function () {
                this.setState({ currentActiveGroup: current !== index ? index : null });
            }).bind(this);
            groupLabel = [_react2['default'].createElement('span', { key: 'toggler', className: "group-active-toggler icon-angle-" + (current === index ? 'down' : 'right') }), groupLabel];
        }

        return _react2['default'].createElement('h' + (3 + this.props.depth), properties, groupLabel);
    },

    render: function render() {
        var _this2 = this;

        var allGroups = [];
        var values = this.getValues();
        var groupsOrdered = ['__DEFAULT__'];
        allGroups['__DEFAULT__'] = { FIELDS: [] };
        var replicationGroups = {};

        this.props.parameters.map((function (attributes) {
            var _this = this;

            var type = attributes['type'];
            if (this.props.skipFieldsTypes && this.props.skipFieldsTypes.indexOf(type) > -1) {
                return;
            }
            var paramName = attributes['name'];
            var field;
            if (attributes['group_switch_name']) {
                return;
            }

            var group = attributes['group'] || '__DEFAULT__';
            if (!allGroups[group]) {
                groupsOrdered.push(group);
                allGroups[group] = { FIELDS: [], LABEL: group };
            }

            var repGroup = attributes['replicationGroup'];
            if (repGroup) {

                if (!replicationGroups[repGroup]) {
                    replicationGroups[repGroup] = {
                        PARAMS: [],
                        GROUP: group,
                        POSITION: allGroups[group].FIELDS.length
                    };
                    allGroups[group].FIELDS.push('REPLICATION:' + repGroup);
                }
                // Copy
                var repAttr = _pydioUtilLang2['default'].deepCopy(attributes);
                delete repAttr['replicationGroup'];
                delete repAttr['group'];
                replicationGroups[repGroup].PARAMS.push(repAttr);
            } else {

                if (type.indexOf("group_switch:") === 0) {

                    field = _react2['default'].createElement(_GroupSwitchPanel2['default'], _extends({}, this.props, {
                        onChange: this.onSubformChange,
                        paramAttributes: attributes,
                        parameters: this.props.parameters,
                        values: this.props.values,
                        key: paramName,
                        onScrollCallback: null,
                        limitToGroups: null,
                        onValidStatusChange: this.onSubformValidStatusChange
                    }));
                } else if (attributes['type'] !== 'hidden') {

                    var helperMark;
                    if (this.props.setHelperData && this.props.checkHasHelper && this.props.checkHasHelper(attributes['name'], this.props.helperTestFor)) {
                        var showHelper = (function () {
                            this.props.setHelperData({
                                paramAttributes: attributes,
                                values: values,
                                postValues: this.getValuesForPOST(values),
                                applyButtonAction: this.applyButtonAction
                            }, this.props.helperTestFor);
                        }).bind(this);
                        helperMark = _react2['default'].createElement('span', { className: 'icon-question-sign', onClick: showHelper });
                    }
                    var mandatoryMissing = false;
                    var classLegend = "form-legend";
                    if (attributes['errorText']) {
                        classLegend = "form-legend mandatory-missing";
                    } else if (attributes['warningText']) {
                        classLegend = "form-legend warning-message";
                    } else if (attributes['mandatory'] && (attributes['mandatory'] === "true" || attributes['mandatory'] === true)) {
                        if (['string', 'textarea', 'image', 'integer'].indexOf(attributes['type']) !== -1 && !values[paramName]) {
                            mandatoryMissing = true;
                            classLegend = "form-legend mandatory-missing";
                        }
                    }

                    var props = {
                        ref: "form-element-" + paramName,
                        attributes: attributes,
                        name: paramName,
                        value: values[paramName],
                        onChange: function onChange(newValue, oldValue, additionalFormData) {
                            _this.onParameterChange(paramName, newValue, oldValue, additionalFormData);
                        },
                        disabled: this.props.disabled || attributes['readonly'],
                        multiple: attributes['multiple'],
                        binary_context: this.props.binary_context,
                        displayContext: 'form',
                        applyButtonAction: this.applyButtonAction,
                        errorText: mandatoryMissing ? pydio.MessageHash['621'] : attributes.errorText ? attributes.errorText : null
                    };

                    field = _react2['default'].createElement(
                        'div',
                        { key: paramName, className: 'form-entry-' + attributes['type'] },
                        _managerManager2['default'].createFormElement(props),
                        _react2['default'].createElement(
                            'div',
                            { className: classLegend },
                            attributes['warningText'] ? attributes['warningText'] : attributes['description'],
                            ' ',
                            helperMark
                        )
                    );
                } else {

                    this._hiddenValues[paramName] = values[paramName] === undefined ? attributes['default'] : values[paramName];
                }

                if (field) {
                    allGroups[group].FIELDS.push(field);
                }
            }
        }).bind(this));

        for (var rGroup in replicationGroups) {
            if (!replicationGroups.hasOwnProperty(rGroup)) {
                continue;
            }
            var rGroupData = replicationGroups[rGroup];
            allGroups[rGroupData.GROUP].FIELDS[rGroupData.POSITION] = _react2['default'].createElement(_ReplicationPanel2['default'], _extends({}, this.props, {
                key: "replication-group-" + rGroupData.PARAMS[0].name,
                onChange: this.onSubformChange,
                onParameterChange: null,
                values: this.getValues(),
                depth: this.props.depth + 1,
                parameters: rGroupData.PARAMS,
                applyButtonAction: this.applyButtonAction,
                onScrollCallback: null
            }));
        }

        var groupPanes = [];
        var accordionize = this.props.accordionizeIfGroupsMoreThan && groupsOrdered.length > this.props.accordionizeIfGroupsMoreThan;
        var currentActiveGroup = this.state && this.state.currentActiveGroup ? this.state.currentActiveGroup : 0;
        groupsOrdered.map((function (g, gIndex) {
            if (this.props.limitToGroups && this.props.limitToGroups.indexOf(g) === -1) {
                return;
            }
            var header,
                gData = allGroups[g];
            var className = 'pydio-form-group',
                active = false;
            if (accordionize) {
                active = currentActiveGroup === gIndex;
                if (gIndex === currentActiveGroup) {
                    className += ' form-group-active';
                } else {
                    className += ' form-group-inactive';
                }
            }
            if (!gData.FIELDS.length) {
                return;
            }
            if (gData.LABEL && !(this.props.skipFieldsTypes && this.props.skipFieldsTypes.indexOf('GroupHeader') > -1)) {
                header = this.renderGroupHeader(gData.LABEL, accordionize, gIndex, active);
            }
            if (this.props.depth === 0) {
                className += ' z-depth-1';
                groupPanes.push(_react2['default'].createElement(
                    _materialUi.Paper,
                    { className: className, key: 'pane-' + g },
                    gIndex === 0 && this.props.header ? this.props.header : null,
                    header,
                    _react2['default'].createElement(
                        'div',
                        null,
                        gData.FIELDS
                    ),
                    gIndex === groupsOrdered.length - 1 && this.props.footer ? this.props.footer : null
                ));
            } else {
                groupPanes.push(_react2['default'].createElement(
                    'div',
                    { className: className, key: 'pane-' + g },
                    gIndex === 0 && this.props.header ? this.props.header : null,
                    header,
                    _react2['default'].createElement(
                        'div',
                        null,
                        gData.FIELDS
                    ),
                    gIndex === groupsOrdered.length - 1 && this.props.footer ? this.props.footer : null
                ));
            }
        }).bind(this));
        if (this.props.additionalPanes) {
            (function () {
                var otherPanes = { top: [], bottom: [] };
                var depth = _this2.props.depth;
                var index = 0;

                var _loop = function (k) {
                    if (!otherPanes.hasOwnProperty(k)) {
                        return 'continue';
                    }
                    if (_this2.props.additionalPanes[k]) {
                        _this2.props.additionalPanes[k].map(function (p) {
                            if (depth === 0) {
                                otherPanes[k].push(_react2['default'].createElement(
                                    _materialUi.Paper,
                                    { className: 'pydio-form-group additional', key: 'other-pane-' + index },
                                    p
                                ));
                            } else {
                                otherPanes[k].push(_react2['default'].createElement(
                                    'div',
                                    { className: 'pydio-form-group additional', key: 'other-pane-' + index },
                                    p
                                ));
                            }
                            index++;
                        });
                    }
                };

                for (var k in otherPanes) {
                    var _ret2 = _loop(k);

                    if (_ret2 === 'continue') continue;
                }
                groupPanes = otherPanes['top'].concat(groupPanes).concat(otherPanes['bottom']);
            })();
        }

        if (this.props.tabs) {
            var _ret3 = (function () {
                var className = _this2.props.className;
                var initialSelectedIndex = 0;
                var i = 0;
                var tabs = _this2.props.tabs.map((function (tDef) {
                    var label = tDef['label'];
                    var groups = tDef['groups'];
                    if (tDef['selected']) {
                        initialSelectedIndex = i;
                    }
                    var panes = groups.map(function (gId) {
                        if (groupPanes[gId]) {
                            return groupPanes[gId];
                        } else {
                            return null;
                        }
                    });
                    i++;
                    return _react2['default'].createElement(
                        _materialUi.Tab,
                        { label: label,
                            key: label,
                            value: this.props.onTabChange ? i - 1 : undefined },
                        _react2['default'].createElement(
                            'div',
                            { className: (className ? className + ' ' : ' ') + 'pydio-form-panel' + (panes.length % 2 ? ' form-panel-odd' : '') },
                            panes
                        )
                    );
                }).bind(_this2));
                if (_this2.state.tabSelectedIndex !== undefined) {
                    initialSelectedIndex = _this2.state.tabSelectedIndex;
                }
                return {
                    v: _react2['default'].createElement(
                        'div',
                        { className: 'layout-fill vertical-layout tab-vertical-layout' },
                        _react2['default'].createElement(
                            _materialUi.Tabs,
                            { ref: 'tabs',
                                initialSelectedIndex: initialSelectedIndex,
                                value: _this2.props.onTabChange ? initialSelectedIndex : undefined,
                                onChange: _this2.props.onTabChange ? function (i) {
                                    _this2.setState({ tabSelectedIndex: i });_this2.props.onTabChange(i);
                                } : undefined,
                                style: { flex: 1, display: 'flex', flexDirection: 'column' },
                                contentContainerStyle: { flex: 1, overflowY: 'auto' }
                            },
                            tabs
                        )
                    )
                };
            })();

            if (typeof _ret3 === 'object') return _ret3.v;
        } else {
            return _react2['default'].createElement(
                'div',
                { className: (this.props.className ? this.props.className + ' ' : ' ') + 'pydio-form-panel' + (groupPanes.length % 2 ? ' form-panel-odd' : ''), onScroll: this.props.onScrollCallback },
                groupPanes
            );
        }
    }

});
module.exports = exports['default'];

},{"../manager/Manager":14,"./GroupSwitchPanel":21,"./ReplicationPanel":23,"material-ui":"material-ui","pydio/util/lang":"pydio/util/lang","react":"react"}],21:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _FormPanel = require('./FormPanel');

var _FormPanel2 = _interopRequireDefault(_FormPanel);

var _fieldsInputSelectBox = require('../fields/InputSelectBox');

var _fieldsInputSelectBox2 = _interopRequireDefault(_fieldsInputSelectBox);

var React = require('react');

var LangUtils = require('pydio/util/lang');

/**
 * Sub form with a selector, switching its fields depending
 * on the selector value.
 */
exports['default'] = React.createClass({
    displayName: 'GroupSwitchPanel',

    propTypes: {
        paramAttributes: React.PropTypes.object.isRequired,
        parameters: React.PropTypes.array.isRequired,
        values: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    computeSubPanelParameters: function computeSubPanelParameters() {

        // CREATE SUB FORM PANEL
        // Get all values
        var switchName = this.props.paramAttributes['type'].split(":").pop();
        var parentName = this.props.paramAttributes['name'];
        var switchValues = {},
            potentialSubSwitches = [];

        this.props.parameters.map((function (p) {
            "use strict";
            if (!p['group_switch_name']) return;
            if (p['group_switch_name'] != switchName) {
                potentialSubSwitches.push(p);
                return;
            }
            var crtSwitch = p['group_switch_value'];
            if (!switchValues[crtSwitch]) {
                switchValues[crtSwitch] = {
                    label: p['group_switch_label'],
                    fields: [],
                    values: {},
                    fieldsKeys: {}
                };
            }
            p = LangUtils.deepCopy(p);
            delete p['group_switch_name'];
            p['name'] = parentName + '/' + p['name'];
            var vKey = p['name'];
            var paramName = vKey;
            if (switchValues[crtSwitch].fieldsKeys[paramName]) {
                return;
            }
            switchValues[crtSwitch].fields.push(p);
            switchValues[crtSwitch].fieldsKeys[paramName] = paramName;
            if (this.props.values && this.props.values[vKey]) {
                switchValues[crtSwitch].values[paramName] = this.props.values[vKey];
            }
        }).bind(this));
        // Remerge potentialSubSwitches to each parameters set
        for (var k in switchValues) {
            if (switchValues.hasOwnProperty(k)) {
                var sv = switchValues[k];
                sv.fields = sv.fields.concat(potentialSubSwitches);
            }
        }

        return switchValues;
    },

    clearSubParametersValues: function clearSubParametersValues(parentName, newValue, newFields) {
        var vals = LangUtils.deepCopy(this.props.values);
        var toRemove = {};
        for (var key in vals) {
            if (vals.hasOwnProperty(key) && key.indexOf(parentName + '/') === 0) {
                toRemove[key] = '';
            }
        }
        vals[parentName] = newValue;

        newFields.map(function (p) {
            if (p.type == 'hidden' && p['default'] && !p['group_switch_name'] || p['group_switch_name'] == parentName) {
                vals[p['name']] = p['default'];
                if (toRemove[p['name']] !== undefined) delete toRemove[p['name']];
            } else if (p['name'].indexOf(parentName + '/') === 0 && p['default']) {
                if (p['type'] && p['type'].startsWith('group_switch:')) {
                    //vals[p['name']] = {group_switch_value:p['default']};
                    vals[p['name']] = p['default'];
                } else {
                    vals[p['name']] = p['default'];
                }
            }
        });
        this.props.onChange(vals, true, toRemove);
        //this.onParameterChange(parentName, newValue);
    },

    onChange: function onChange(newValues, dirty, removeValues) {
        this.props.onChange(newValues, true, removeValues);
    },

    render: function render() {
        var attributes = this.props.paramAttributes;
        var values = this.props.values;

        var paramName = attributes['name'];
        var switchValues = this.computeSubPanelParameters(attributes);
        var selectorValues = new Map();
        Object.keys(switchValues).map(function (k) {
            selectorValues.set(k, switchValues[k].label);
        });
        var selectorChanger = (function (newValue) {
            this.clearSubParametersValues(paramName, newValue, switchValues[newValue] ? switchValues[newValue].fields : []);
        }).bind(this);
        var subForm = undefined,
            selectorLegend = undefined,
            subFormHeader = undefined;
        var selector = React.createElement(_fieldsInputSelectBox2['default'], {
            key: paramName,
            name: paramName,
            className: 'group-switch-selector',
            attributes: {
                name: paramName,
                choices: selectorValues,
                label: attributes['label'],
                mandatory: attributes['mandatory']
            },
            value: values[paramName],
            onChange: selectorChanger,
            displayContext: 'form',
            disabled: this.props.disabled,
            ref: 'subFormSelector'
        });

        var helperMark = undefined;
        if (this.props.setHelperData && this.props.checkHasHelper && this.props.checkHasHelper(attributes['name'], this.props.helperTestFor)) {
            var showHelper = (function () {
                this.props.setHelperData({ paramAttributes: attributes, values: values });
            }).bind(this);
            helperMark = React.createElement('span', { className: 'icon-question-sign', onClick: showHelper });
        }

        selectorLegend = React.createElement(
            'div',
            { className: 'form-legend' },
            attributes['description'],
            ' ',
            helperMark
        );
        if (values[paramName] && switchValues[values[paramName]]) {
            subFormHeader = React.createElement(
                'h4',
                null,
                values[paramName]
            );
            subForm = React.createElement(_FormPanel2['default'], {
                onParameterChange: this.props.onParameterChange,
                applyButtonAction: this.props.applyButtonAction,
                disabled: this.props.disabled,
                ref: paramName + '-SUB',
                key: paramName + '-SUB',
                className: 'sub-form',
                parameters: switchValues[values[paramName]].fields,
                values: values,
                depth: this.props.depth + 1,
                onChange: this.onChange,
                checkHasHelper: this.props.checkHasHelper,
                setHelperData: this.props.setHelperData,
                helperTestFor: values[paramName],
                accordionizeIfGroupsMoreThan: 5
            });
        }
        return React.createElement(
            'div',
            { className: 'sub-form-group' },
            selector,
            selectorLegend,
            subForm
        );
    }

});
module.exports = exports['default'];

},{"../fields/InputSelectBox":8,"./FormPanel":20,"pydio/util/lang":"pydio/util/lang","react":"react"}],22:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _FormPanel = require('./FormPanel');

var _FormPanel2 = _interopRequireDefault(_FormPanel);

var _require = require('react');

var Component = _require.Component;

var _require2 = require('material-ui');

var IconButton = _require2.IconButton;
var FlatButton = _require2.FlatButton;
var Paper = _require2.Paper;

var UP_ARROW = 'mdi mdi-menu-up';
var DOWN_ARROW = 'mdi mdi-menu-down';
var REMOVE = 'mdi mdi-delete-circle';

var ReplicatedGroup = (function (_Component) {
    _inherits(ReplicatedGroup, _Component);

    function ReplicatedGroup(props, context) {
        _classCallCheck(this, ReplicatedGroup);

        _Component.call(this, props, context);
        var subValues = props.subValues;
        var parameters = props.parameters;

        var firstParam = parameters[0];
        var instanceValue = subValues[firstParam['name']] || '';
        this.state = { toggled: instanceValue ? false : true };
    }

    ReplicatedGroup.prototype.render = function render() {
        var _this = this;

        var _props = this.props;
        var depth = _props.depth;
        var onSwapUp = _props.onSwapUp;
        var onSwapDown = _props.onSwapDown;
        var onRemove = _props.onRemove;
        var parameters = _props.parameters;
        var subValues = _props.subValues;
        var disabled = _props.disabled;
        var toggled = this.state.toggled;

        var firstParam = parameters[0];
        var instanceValue = subValues[firstParam['name']] || React.createElement(
            'span',
            { style: { color: 'rgba(0,0,0,0.33)' } },
            'Empty Value'
        );

        return React.createElement(
            Paper,
            { style: { marginLeft: 2, marginRight: 2, marginBottom: 10 } },
            React.createElement(
                'div',
                { style: { display: 'flex', alignItems: 'center' } },
                React.createElement(
                    'div',
                    null,
                    React.createElement(IconButton, { iconClassName: 'mdi mdi-chevron-' + (this.state.toggled ? 'up' : 'down'), onTouchTap: function () {
                            _this.setState({ toggled: !_this.state.toggled });
                        } })
                ),
                React.createElement(
                    'div',
                    { style: { flex: 1, fontSize: 16 } },
                    instanceValue
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(IconButton, { iconClassName: UP_ARROW, onTouchTap: onSwapUp, disabled: !!!onSwapUp || disabled }),
                    React.createElement(IconButton, { iconClassName: DOWN_ARROW, onTouchTap: onSwapDown, disabled: !!!onSwapDown || disabled })
                )
            ),
            toggled && React.createElement(_FormPanel2['default'], _extends({}, this.props, {
                tabs: null,
                values: subValues,
                onChange: null,
                className: 'replicable-group',
                depth: depth
            })),
            toggled && React.createElement(
                'div',
                { style: { padding: 4, textAlign: 'right' } },
                React.createElement(FlatButton, { label: 'Remove', primary: true, onTouchTap: onRemove, disabled: !!!onRemove || disabled })
            )
        );
    };

    return ReplicatedGroup;
})(Component);

exports['default'] = ReplicatedGroup;
module.exports = exports['default'];

},{"./FormPanel":20,"material-ui":"material-ui","react":"react"}],23:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ReplicatedGroup = require('./ReplicatedGroup');

var _ReplicatedGroup2 = _interopRequireDefault(_ReplicatedGroup);

var React = require('react');

var _require = require('material-ui');

var IconButton = _require.IconButton;

var LangUtils = require('pydio/util/lang');

/**
 * Sub form replicating itself (+/-)
 */
exports['default'] = React.createClass({
    displayName: 'ReplicationPanel',

    propTypes: {
        parameters: React.PropTypes.array.isRequired,
        values: React.PropTypes.object,
        onChange: React.PropTypes.func,
        disabled: React.PropTypes.bool,
        binary_context: React.PropTypes.string,
        depth: React.PropTypes.number
    },

    buildSubValue: function buildSubValue(values) {
        var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        var subVal = undefined;
        var suffix = index == 0 ? '' : '_' + index;
        this.props.parameters.map(function (p) {
            var pName = p['name'];
            if (values[pName + suffix] !== undefined) {
                if (!subVal) subVal = {};
                subVal[pName] = values[pName + suffix];
            }
        });
        return subVal || false;
    },

    indexedValues: function indexedValues(rowsArray) {
        var index = 0,
            values = {};
        rowsArray.map(function (row) {
            var suffix = index == 0 ? '' : '_' + index;
            for (var p in row) {
                if (!row.hasOwnProperty(p)) continue;
                values[p + suffix] = row[p];
            }
            index++;
        });
        return values;
    },

    indexValues: function indexValues(rowsArray, removeLastRow) {
        var _this = this;

        var indexed = this.indexedValues(rowsArray);
        if (this.props.onChange) {
            if (removeLastRow) {
                (function () {
                    var lastRow = {},
                        nextIndex = rowsArray.length - 1;
                    _this.props.parameters.map(function (p) {
                        lastRow[p['name'] + (nextIndex > 0 ? '_' + nextIndex : '')] = '';
                    });
                    _this.props.onChange(indexed, true, lastRow);
                })();
            } else {
                this.props.onChange(indexed, true);
            }
        }
    },

    instances: function instances() {
        var _this2 = this;

        // Analyze current value to grab number of rows.
        var rows = [],
            subVal = undefined,
            index = 0;
        while (subVal = this.buildSubValue(this.props.values, index)) {
            index++;
            rows.push(subVal);
        }
        var firstParam = this.props.parameters[0];
        if (!rows.length && firstParam['replicationMandatory'] === 'true') {
            (function () {
                var emptyValue = {};
                _this2.props.parameters.map(function (p) {
                    emptyValue[p['name']] = p['default'] || '';
                });
                rows.push(emptyValue);
            })();
        }
        return rows;
    },

    addRow: function addRow() {
        var newValue = {},
            currentValues = this.instances();
        this.props.parameters.map(function (p) {
            newValue[p['name']] = p['default'] || '';
        });
        currentValues.push(newValue);
        this.indexValues(currentValues);
    },

    removeRow: function removeRow(index) {
        var instances = this.instances();
        var removeInst = instances[index];
        instances = LangUtils.arrayWithout(this.instances(), index);
        instances.push(removeInst);
        this.indexValues(instances, true);
    },

    swapRows: function swapRows(i, j) {
        var instances = this.instances();
        var tmp = instances[j];
        instances[j] = instances[i];
        instances[i] = tmp;
        this.indexValues(instances);
    },

    onChange: function onChange(index, newValues, dirty) {
        var instances = this.instances();
        instances[index] = newValues;
        this.indexValues(instances);
    },

    onParameterChange: function onParameterChange(index, paramName, newValue, oldValue) {
        var instances = this.instances();
        instances[index][paramName] = newValue;
        this.indexValues(instances);
    },

    render: function render() {
        var _this3 = this;

        var _props = this.props;
        var parameters = _props.parameters;
        var disabled = _props.disabled;

        var firstParam = parameters[0];
        var replicationTitle = firstParam['replicationTitle'] || firstParam['label'];
        var replicationDescription = firstParam['replicationDescription'] || firstParam['description'];
        var replicationMandatory = firstParam['replicationMandatory'] === 'true';

        var instances = this.instances();
        var multiple = instances.length > 1;
        var rows = instances.map(function (subValues, index) {
            var onSwapUp = undefined,
                onSwapDown = undefined,
                onRemove = undefined;
            var onParameterChange = function onParameterChange(paramName, newValue, oldValue) {
                _this3.onParameterChange(index, paramName, newValue, oldValue);
            };
            if (multiple && index > 0) {
                onSwapUp = function () {
                    _this3.swapRows(index, index - 1);
                };
            }
            if (multiple && index < instances.length - 1) {
                onSwapDown = function () {
                    _this3.swapRows(index, index + 1);
                };
            }
            if (multiple || !replicationMandatory) {
                onRemove = function () {
                    _this3.removeRow(index);
                };
            }
            var props = { onSwapUp: onSwapUp, onSwapDown: onSwapDown, onRemove: onRemove, onParameterChange: onParameterChange };
            return React.createElement(_ReplicatedGroup2['default'], _extends({ key: index }, _this3.props, props, { subValues: subValues }));
        });

        return React.createElement(
            'div',
            { className: 'replicable-field' },
            React.createElement(
                'div',
                { className: 'title-bar' },
                React.createElement(IconButton, { key: 'add', style: { float: 'right' }, iconClassName: 'mdi mdi-plus', iconStyle: { fontSize: 24 }, tooltip: 'Add value', onClick: this.addRow, disabled: disabled }),
                React.createElement(
                    'div',
                    { className: 'title' },
                    replicationTitle
                ),
                React.createElement(
                    'div',
                    { className: 'legend' },
                    replicationDescription
                )
            ),
            rows
        );
    }

});
module.exports = exports['default'];

},{"./ReplicatedGroup":22,"material-ui":"material-ui","pydio/util/lang":"pydio/util/lang","react":"react"}]},{},[13])(13)
});

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJyZXMvYnVpbGQvdWkvRm9ybS9maWVsZHMvQXV0b2NvbXBsZXRlQm94LmpzIiwicmVzL2J1aWxkL3VpL0Zvcm0vZmllbGRzL0F1dG9jb21wbGV0ZVRyZWUuanMiLCJyZXMvYnVpbGQvdWkvRm9ybS9maWVsZHMvRmlsZURyb3B6b25lLmpzIiwicmVzL2J1aWxkL3VpL0Zvcm0vZmllbGRzL0lucHV0Qm9vbGVhbi5qcyIsInJlcy9idWlsZC91aS9Gb3JtL2ZpZWxkcy9JbnB1dEJ1dHRvbi5qcyIsInJlcy9idWlsZC91aS9Gb3JtL2ZpZWxkcy9JbnB1dEltYWdlLmpzIiwicmVzL2J1aWxkL3VpL0Zvcm0vZmllbGRzL0lucHV0SW50ZWdlci5qcyIsInJlcy9idWlsZC91aS9Gb3JtL2ZpZWxkcy9JbnB1dFNlbGVjdEJveC5qcyIsInJlcy9idWlsZC91aS9Gb3JtL2ZpZWxkcy9Nb25pdG9yaW5nTGFiZWwuanMiLCJyZXMvYnVpbGQvdWkvRm9ybS9maWVsZHMvVGV4dEZpZWxkLmpzIiwicmVzL2J1aWxkL3VpL0Zvcm0vZmllbGRzL1ZhbGlkTG9naW4uanMiLCJyZXMvYnVpbGQvdWkvRm9ybS9maWVsZHMvVmFsaWRQYXNzd29yZC5qcyIsInJlcy9idWlsZC91aS9Gb3JtL2luZGV4LmpzIiwicmVzL2J1aWxkL3VpL0Zvcm0vbWFuYWdlci9NYW5hZ2VyLmpzIiwicmVzL2J1aWxkL3VpL0Zvcm0vbWl4aW5zL0FjdGlvblJ1bm5lck1peGluLmpzIiwicmVzL2J1aWxkL3VpL0Zvcm0vbWl4aW5zL0ZpZWxkV2l0aENob2ljZXMuanMiLCJyZXMvYnVpbGQvdWkvRm9ybS9taXhpbnMvRm9ybU1peGluLmpzIiwicmVzL2J1aWxkL3VpL0Zvcm0vbWl4aW5zL0hlbHBlck1peGluLmpzIiwicmVzL2J1aWxkL3VpL0Zvcm0vcGFuZWwvRm9ybUhlbHBlci5qcyIsInJlcy9idWlsZC91aS9Gb3JtL3BhbmVsL0Zvcm1QYW5lbC5qcyIsInJlcy9idWlsZC91aS9Gb3JtL3BhbmVsL0dyb3VwU3dpdGNoUGFuZWwuanMiLCJyZXMvYnVpbGQvdWkvRm9ybS9wYW5lbC9SZXBsaWNhdGVkR3JvdXAuanMiLCJyZXMvYnVpbGQvdWkvRm9ybS9wYW5lbC9SZXBsaWNhdGlvblBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3hYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9taXhpbnNGb3JtTWl4aW4gPSByZXF1aXJlKCcuLi9taXhpbnMvRm9ybU1peGluJyk7XG5cbnZhciBfbWl4aW5zRm9ybU1peGluMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21peGluc0Zvcm1NaXhpbik7XG5cbnZhciBfbWl4aW5zRmllbGRXaXRoQ2hvaWNlcyA9IHJlcXVpcmUoJy4uL21peGlucy9GaWVsZFdpdGhDaG9pY2VzJyk7XG5cbnZhciBfbWl4aW5zRmllbGRXaXRoQ2hvaWNlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taXhpbnNGaWVsZFdpdGhDaG9pY2VzKTtcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgnbWF0ZXJpYWwtdWknKTtcblxudmFyIEF1dG9Db21wbGV0ZSA9IF9yZXF1aXJlLkF1dG9Db21wbGV0ZTtcbnZhciBNZW51SXRlbSA9IF9yZXF1aXJlLk1lbnVJdGVtO1xudmFyIFJlZnJlc2hJbmRpY2F0b3IgPSBfcmVxdWlyZS5SZWZyZXNoSW5kaWNhdG9yO1xuXG52YXIgQXV0b2NvbXBsZXRlQm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnQXV0b2NvbXBsZXRlQm94JyxcblxuICAgIG1peGluczogW19taXhpbnNGb3JtTWl4aW4yWydkZWZhdWx0J11dLFxuXG4gICAgaGFuZGxlVXBkYXRlSW5wdXQ6IGZ1bmN0aW9uIGhhbmRsZVVwZGF0ZUlucHV0KHNlYXJjaFRleHQpIHtcbiAgICAgICAgLy90aGlzLnNldFN0YXRlKHtzZWFyY2hUZXh0OiBzZWFyY2hUZXh0fSk7XG4gICAgfSxcblxuICAgIGhhbmRsZU5ld1JlcXVlc3Q6IGZ1bmN0aW9uIGhhbmRsZU5ld1JlcXVlc3QoY2hvc2VuVmFsdWUpIHtcbiAgICAgICAgaWYgKGNob3NlblZhbHVlLmtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKG51bGwsIGNob3NlblZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UobnVsbCwgY2hvc2VuVmFsdWUua2V5KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIGNob2ljZXMgPSB0aGlzLnByb3BzLmNob2ljZXM7XG5cbiAgICAgICAgdmFyIGRhdGFTb3VyY2UgPSBbXTtcbiAgICAgICAgdmFyIGxhYmVscyA9IHt9O1xuICAgICAgICBjaG9pY2VzLmZvckVhY2goZnVuY3Rpb24gKGNob2ljZSwga2V5KSB7XG4gICAgICAgICAgICBkYXRhU291cmNlLnB1c2goe1xuICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgIHRleHQ6IGNob2ljZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgTWVudUl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGNob2ljZVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGFiZWxzW2tleV0gPSBjaG9pY2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBkaXNwbGF5VGV4dCA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgICAgIGlmIChsYWJlbHMgJiYgbGFiZWxzW2Rpc3BsYXlUZXh0XSkge1xuICAgICAgICAgICAgZGlzcGxheVRleHQgPSBsYWJlbHNbZGlzcGxheVRleHRdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwbGF5R3JpZCgpICYmICF0aGlzLnN0YXRlLmVkaXRNb2RlIHx8IHRoaXMucHJvcHMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgICAgICAgICBpZiAoY2hvaWNlcy5nZXQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjaG9pY2VzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6IHRoaXMucHJvcHMuZGlzYWJsZWQgPyBmdW5jdGlvbiAoKSB7fSA6IHRoaXMudG9nZ2xlRWRpdE1vZGUsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogdmFsdWUgPyAnJyA6ICdwYXJhbVZhbHVlLWVtcHR5JyB9LFxuICAgICAgICAgICAgICAgICF2YWx1ZSA/ICdFbXB0eScgOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAnIMKgwqAnLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2ljb24tY2FyZXQtZG93bicgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdweWRpb2Zvcm1fYXV0b2NvbXBsZXRlJywgc3R5bGU6IHsgcG9zaXRpb246ICdyZWxhdGl2ZScgfSB9LFxuICAgICAgICAgICAgIWRhdGFTb3VyY2UubGVuZ3RoICYmIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVmcmVzaEluZGljYXRvciwge1xuICAgICAgICAgICAgICAgIHNpemU6IDMwLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnbG9hZGluZydcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgZGF0YVNvdXJjZS5sZW5ndGggJiYgUmVhY3QuY3JlYXRlRWxlbWVudChBdXRvQ29tcGxldGUsIHtcbiAgICAgICAgICAgICAgICBmdWxsV2lkdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgc2VhcmNoVGV4dDogZGlzcGxheVRleHQsXG4gICAgICAgICAgICAgICAgb25VcGRhdGVJbnB1dDogdGhpcy5oYW5kbGVVcGRhdGVJbnB1dCxcbiAgICAgICAgICAgICAgICBvbk5ld1JlcXVlc3Q6IHRoaXMuaGFuZGxlTmV3UmVxdWVzdCxcbiAgICAgICAgICAgICAgICBkYXRhU291cmNlOiBkYXRhU291cmNlLFxuICAgICAgICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0OiB0aGlzLnByb3BzLmF0dHJpYnV0ZXNbJ2xhYmVsJ10sXG4gICAgICAgICAgICAgICAgZmlsdGVyOiBmdW5jdGlvbiAoc2VhcmNoVGV4dCwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgha2V5IHx8ICFzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoVGV4dC50b0xvd2VyQ2FzZSgpKSA9PT0gMDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wZW5PbkZvY3VzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lbnVQcm9wczogeyBtYXhIZWlnaHQ6IDIwMCB9XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IEF1dG9jb21wbGV0ZUJveCA9IF9taXhpbnNGaWVsZFdpdGhDaG9pY2VzMlsnZGVmYXVsdCddKEF1dG9jb21wbGV0ZUJveCk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBBdXRvY29tcGxldGVCb3g7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWl4aW5zRm9ybU1peGluID0gcmVxdWlyZSgnLi4vbWl4aW5zL0Zvcm1NaXhpbicpO1xuXG52YXIgX21peGluc0Zvcm1NaXhpbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taXhpbnNGb3JtTWl4aW4pO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGRlYm91bmNlID0gcmVxdWlyZSgnbG9kYXNoLmRlYm91bmNlJyk7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJ21hdGVyaWFsLXVpJyk7XG5cbnZhciBBdXRvQ29tcGxldGUgPSBfcmVxdWlyZS5BdXRvQ29tcGxldGU7XG52YXIgTWVudUl0ZW0gPSBfcmVxdWlyZS5NZW51SXRlbTtcbnZhciBSZWZyZXNoSW5kaWNhdG9yID0gX3JlcXVpcmUuUmVmcmVzaEluZGljYXRvcjtcbnZhciBGb250SWNvbiA9IF9yZXF1aXJlLkZvbnRJY29uO1xuXG52YXIgQXV0b2NvbXBsZXRlVHJlZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0F1dG9jb21wbGV0ZVRyZWUnLFxuXG4gICAgbWl4aW5zOiBbX21peGluc0Zvcm1NaXhpbjJbJ2RlZmF1bHQnXV0sXG5cbiAgICBoYW5kbGVVcGRhdGVJbnB1dDogZnVuY3Rpb24gaGFuZGxlVXBkYXRlSW5wdXQoc2VhcmNoVGV4dCkge1xuICAgICAgICB0aGlzLmRlYm91bmNlZCgpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2VhcmNoVGV4dDogc2VhcmNoVGV4dCB9KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlTmV3UmVxdWVzdDogZnVuY3Rpb24gaGFuZGxlTmV3UmVxdWVzdChjaG9zZW5WYWx1ZSkge1xuICAgICAgICB2YXIga2V5ID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoY2hvc2VuVmFsdWUua2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGtleSA9IGNob3NlblZhbHVlLmtleTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleSA9IGNob3NlblZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25DaGFuZ2UobnVsbCwga2V5KTtcbiAgICAgICAgdGhpcy5sb2FkVmFsdWVzKGtleSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLmRlYm91bmNlZCA9IGRlYm91bmNlKHRoaXMubG9hZFZhbHVlcy5iaW5kKHRoaXMpLCAzMDApO1xuICAgICAgICB0aGlzLmxhc3RTZWFyY2ggPSBudWxsO1xuICAgICAgICB2YXIgdmFsdWUgPSBcIlwiO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy52YWx1ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnByb3BzLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZFZhbHVlcyh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGxvYWRWYWx1ZXM6IGZ1bmN0aW9uIGxvYWRWYWx1ZXMoKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IFwiXCIgOiBhcmd1bWVudHNbMF07XG5cbiAgICAgICAgdmFyIGJhc2VQYXRoID0gdmFsdWU7XG4gICAgICAgIGlmICghdmFsdWUgJiYgdGhpcy5zdGF0ZS5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICB2YXIgbGFzdCA9IHRoaXMuc3RhdGUuc2VhcmNoVGV4dC5sYXN0SW5kZXhPZignLycpO1xuICAgICAgICAgICAgYmFzZVBhdGggPSB0aGlzLnN0YXRlLnNlYXJjaFRleHQuc3Vic3RyKDAsIGxhc3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxhc3RTZWFyY2ggIT09IG51bGwgJiYgdGhpcy5sYXN0U2VhcmNoID09PSBiYXNlUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdFNlYXJjaCA9IGJhc2VQYXRoO1xuICAgICAgICAvLyBUT0RPIDogbG9hZCB2YWx1ZXMgZnJvbSBzZXJ2aWNlXG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXG4gICAgICAgIHZhciBkYXRhU291cmNlID0gW107XG4gICAgICAgIGlmICh0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUubm9kZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBpY29uID0gXCJtZGkgbWRpLWZvbGRlclwiO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnV1aWQuc3RhcnRzV2l0aChcIkRBVEFTT1VSQ0U6XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGljb24gPSBcIm1kaSBtZGktZGF0YWJhc2VcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YVNvdXJjZS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBub2RlLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IG5vZGUucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBNZW51SXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvbnRJY29uLCB7IGNsYXNzTmFtZTogaWNvbiwgY29sb3I6ICcjNjE2MTYxJywgc3R5bGU6IHsgZmxvYXQ6ICdsZWZ0JywgbWFyZ2luUmlnaHQ6IDggfSB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICcgJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucGF0aFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkaXNwbGF5VGV4dCA9IHRoaXMuc3RhdGUudmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncHlkaW9mb3JtX2F1dG9jb21wbGV0ZScsIHN0eWxlOiB7IHBvc2l0aW9uOiAncmVsYXRpdmUnIH0gfSxcbiAgICAgICAgICAgICFkYXRhU291cmNlLmxlbmd0aCAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KFJlZnJlc2hJbmRpY2F0b3IsIHtcbiAgICAgICAgICAgICAgICBzaXplOiAzMCxcbiAgICAgICAgICAgICAgICByaWdodDogMTAsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIHN0YXR1czogJ2xvYWRpbmcnXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXV0b0NvbXBsZXRlLCB7XG4gICAgICAgICAgICAgICAgZnVsbFdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNlYXJjaFRleHQ6IGRpc3BsYXlUZXh0LFxuICAgICAgICAgICAgICAgIG9uVXBkYXRlSW5wdXQ6IHRoaXMuaGFuZGxlVXBkYXRlSW5wdXQsXG4gICAgICAgICAgICAgICAgb25OZXdSZXF1ZXN0OiB0aGlzLmhhbmRsZU5ld1JlcXVlc3QsXG4gICAgICAgICAgICAgICAgZGF0YVNvdXJjZTogZGF0YVNvdXJjZSxcbiAgICAgICAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dDogdGhpcy5wcm9wcy5hdHRyaWJ1dGVzWydsYWJlbCddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogZnVuY3Rpb24gKHNlYXJjaFRleHQsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2hUZXh0LnRvTG93ZXJDYXNlKCkpID09PSAwO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3Blbk9uRm9jdXM6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVudVByb3BzOiB7IG1heEhlaWdodDogMjAwIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gQXV0b2NvbXBsZXRlVHJlZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLyoqXG4gKiBVSSB0byBkcm9wIGEgZmlsZSAob3IgY2xpY2sgdG8gYnJvd3NlKSwgdXNlZCBieSB0aGUgSW5wdXRJbWFnZSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiBcIkZpbGVEcm9wem9uZVwiLFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdXBwb3J0Q2xpY2s6IHRydWUsXG4gICAgICAgICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgICAgICAgIG9uRHJvcDogZnVuY3Rpb24gb25Ecm9wKCkge31cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc0RyYWdBY3RpdmU6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBvbkRyb3A6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICAgIGlnbm9yZU5hdGl2ZURyb3A6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgICAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICBzdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgZHJhZ0FjdGl2ZVN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICBzdXBwb3J0Q2xpY2s6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgICAgICBhY2NlcHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG11bHRpcGxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuICAgIH0sXG5cbiAgICBvbkRyYWdMZWF2ZTogZnVuY3Rpb24gb25EcmFnTGVhdmUoZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzRHJhZ0FjdGl2ZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9uRHJhZ092ZXI6IGZ1bmN0aW9uIG9uRHJhZ092ZXIoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzRHJhZ0FjdGl2ZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgb25GaWxlUGlja2VkOiBmdW5jdGlvbiBvbkZpbGVQaWNrZWQoZSkge1xuICAgICAgICBpZiAoIWUudGFyZ2V0IHx8ICFlLnRhcmdldC5maWxlcykgcmV0dXJuO1xuICAgICAgICB2YXIgZmlsZXMgPSBlLnRhcmdldC5maWxlcztcbiAgICAgICAgdmFyIG1heEZpbGVzID0gdGhpcy5wcm9wcy5tdWx0aXBsZSA/IGZpbGVzLmxlbmd0aCA6IDE7XG4gICAgICAgIGZpbGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZmlsZXMsIDAsIG1heEZpbGVzKTtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25Ecm9wKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRHJvcChmaWxlcywgZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Gb2xkZXJQaWNrZWQ6IGZ1bmN0aW9uIG9uRm9sZGVyUGlja2VkKGUpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25Gb2xkZXJQaWNrZWQpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25Gb2xkZXJQaWNrZWQoZS50YXJnZXQuZmlsZXMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRHJvcDogZnVuY3Rpb24gb25Ecm9wKGUpIHtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzRHJhZ0FjdGl2ZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuaWdub3JlTmF0aXZlRHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGVzID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgICAgIGZpbGVzID0gZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQpIHtcbiAgICAgICAgICAgIGZpbGVzID0gZS50YXJnZXQuZmlsZXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWF4RmlsZXMgPSB0aGlzLnByb3BzLm11bHRpcGxlID8gZmlsZXMubGVuZ3RoIDogMTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhGaWxlczsgaSsrKSB7XG4gICAgICAgICAgICBmaWxlc1tpXS5wcmV2aWV3ID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkRyb3ApIHtcbiAgICAgICAgICAgIGZpbGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZmlsZXMsIDAsIG1heEZpbGVzKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25Ecm9wKGZpbGVzLCBlLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5zdXBwb3J0Q2xpY2sgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgICAgIHRoaXMucmVmcy5maWxlSW5wdXQuY2xpY2soKTtcbiAgICB9LFxuXG4gICAgb3BlbkZvbGRlclBpY2tlcjogZnVuY3Rpb24gb3BlbkZvbGRlclBpY2tlcigpIHtcbiAgICAgICAgdGhpcy5yZWZzLmZvbGRlcklucHV0LnNldEF0dHJpYnV0ZShcIndlYmtpdGRpcmVjdG9yeVwiLCBcInRydWVcIik7XG4gICAgICAgIHRoaXMucmVmcy5mb2xkZXJJbnB1dC5jbGljaygpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblxuICAgICAgICB2YXIgY2xhc3NOYW1lID0gdGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgJ2ZpbGUtZHJvcHpvbmUnO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc0RyYWdBY3RpdmUpIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZSArPSAnIGFjdGl2ZSc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGUgPSB7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5zaXplIHx8IDEwMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5zaXplIHx8IDEwMFxuICAgICAgICB9O1xuICAgICAgICAvL2JvcmRlclN0eWxlOiB0aGlzLnN0YXRlLmlzRHJhZ0FjdGl2ZSA/IFwic29saWRcIiA6IFwiZGFzaGVkXCJcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuc3R5bGUpIHtcbiAgICAgICAgICAgIHN0eWxlID0gX2V4dGVuZHMoe30sIHN0eWxlLCB0aGlzLnByb3BzLnN0eWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc0RyYWdBY3RpdmUgJiYgdGhpcy5wcm9wcy5kcmFnQWN0aXZlU3R5bGUpIHtcbiAgICAgICAgICAgIHN0eWxlID0gX2V4dGVuZHMoe30sIHN0eWxlLCB0aGlzLnByb3BzLmRyYWdBY3RpdmVTdHlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZvbGRlcklucHV0ID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5lbmFibGVGb2xkZXJzKSB7XG4gICAgICAgICAgICBmb2xkZXJJbnB1dCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7IHN0eWxlOiB7IGRpc3BsYXk6ICdub25lJyB9LCBuYW1lOiBcInVzZXJmb2xkZXJcIiwgdHlwZTogXCJmaWxlXCIsIHJlZjogXCJmb2xkZXJJbnB1dFwiLCBvbkNoYW5nZTogdGhpcy5vbkZvbGRlclBpY2tlZCB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lLCBzdHlsZTogc3R5bGUsIG9uQ2xpY2s6IHRoaXMub25DbGljaywgb25EcmFnTGVhdmU6IHRoaXMub25EcmFnTGVhdmUsIG9uRHJhZ092ZXI6IHRoaXMub25EcmFnT3Zlciwgb25Ecm9wOiB0aGlzLm9uRHJvcCB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHsgc3R5bGU6IHsgZGlzcGxheTogJ25vbmUnIH0sIG5hbWU6IFwidXNlcmZpbGVcIiwgdHlwZTogXCJmaWxlXCIsIG11bHRpcGxlOiB0aGlzLnByb3BzLm11bHRpcGxlLCByZWY6IFwiZmlsZUlucHV0XCIsIHZhbHVlOiBcIlwiLCBvbkNoYW5nZTogdGhpcy5vbkZpbGVQaWNrZWQsIGFjY2VwdDogdGhpcy5wcm9wcy5hY2NlcHQgfSksXG4gICAgICAgICAgICBmb2xkZXJJbnB1dCxcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICAgICAgKTtcbiAgICB9XG5cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWl4aW5zRm9ybU1peGluID0gcmVxdWlyZSgnLi4vbWl4aW5zL0Zvcm1NaXhpbicpO1xuXG52YXIgX21peGluc0Zvcm1NaXhpbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taXhpbnNGb3JtTWl4aW4pO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdtYXRlcmlhbC11aScpO1xuXG52YXIgVG9nZ2xlID0gX3JlcXVpcmUuVG9nZ2xlO1xuXG4vKipcbiAqIEJvb2xlYW4gaW5wdXRcbiAqL1xuZXhwb3J0c1snZGVmYXVsdCddID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnSW5wdXRCb29sZWFuJyxcblxuICAgIG1peGluczogW19taXhpbnNGb3JtTWl4aW4yWydkZWZhdWx0J11dLFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBza2lwQnVmZmVyQ2hhbmdlczogdHJ1ZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBvbkNoZWNrOiBmdW5jdGlvbiBvbkNoZWNrKGV2ZW50LCBuZXdWYWx1ZSkge1xuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKG5ld1ZhbHVlLCB0aGlzLnN0YXRlLnZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBkaXJ0eTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiBuZXdWYWx1ZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZ2V0Qm9vbGVhblN0YXRlOiBmdW5jdGlvbiBnZXRCb29sZWFuU3RhdGUoKSB7XG4gICAgICAgIHZhciBib29sVmFsID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBib29sVmFsID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgYm9vbFZhbCA9IGJvb2xWYWwgPT0gXCJ0cnVlXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJvb2xWYWw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICB2YXIgYm9vbFZhbCA9IHRoaXMuZ2V0Qm9vbGVhblN0YXRlKCk7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9nZ2xlLCB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlZDogYm9vbFZhbCxcbiAgICAgICAgICAgICAgICBvblRvZ2dsZTogdGhpcy5vbkNoZWNrLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiB0aGlzLnByb3BzLmRpc2FibGVkLFxuICAgICAgICAgICAgICAgIGxhYmVsOiB0aGlzLmlzRGlzcGxheUZvcm0oKSA/IHRoaXMucHJvcHMuYXR0cmlidXRlcy5sYWJlbCA6IG51bGwsXG4gICAgICAgICAgICAgICAgbGFiZWxQb3NpdGlvbjogdGhpcy5pc0Rpc3BsYXlGb3JtKCkgPyAnbGVmdCcgOiAncmlnaHQnXG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWl4aW5zQWN0aW9uUnVubmVyTWl4aW4gPSByZXF1aXJlKCcuLi9taXhpbnMvQWN0aW9uUnVubmVyTWl4aW4nKTtcblxudmFyIF9taXhpbnNBY3Rpb25SdW5uZXJNaXhpbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taXhpbnNBY3Rpb25SdW5uZXJNaXhpbik7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJ21hdGVyaWFsLXVpJyk7XG5cbnZhciBSYWlzZWRCdXR0b24gPSBfcmVxdWlyZS5SYWlzZWRCdXR0b247XG5cbi8qKlxuICogU2ltcGxlIFJhaXNlZEJ1dHRvbiBleGVjdXRpbmcgdGhlIGFwcGx5QnV0dG9uQWN0aW9uXG4gKi9cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0lucHV0QnV0dG9uJyxcblxuICAgIG1peGluczogW19taXhpbnNBY3Rpb25SdW5uZXJNaXhpbjJbJ2RlZmF1bHQnXV0sXG5cbiAgICBhcHBseUJ1dHRvbjogZnVuY3Rpb24gYXBwbHlCdXR0b24oKSB7XG5cbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGhpcy5wcm9wcy5hY3Rpb25DYWxsYmFjaztcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAodHJhbnNwb3J0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSB0cmFuc3BvcnQucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0LnN0YXJ0c1dpdGgoJ1NVQ0NFU1M6JykpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsLnB5ZGlvLmRpc3BsYXlNZXNzYWdlKCdTVUNDRVNTJywgdHJhbnNwb3J0LnJlc3BvbnNlVGV4dC5yZXBsYWNlKCdTVUNDRVNTOicsICcnKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsLnB5ZGlvLmRpc3BsYXlNZXNzYWdlKCdFUlJPUicsIHRyYW5zcG9ydC5yZXNwb25zZVRleHQucmVwbGFjZSgnRVJST1I6JywgJycpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXBwbHlBY3Rpb24oY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmFpc2VkQnV0dG9uLCB7XG4gICAgICAgICAgICBsYWJlbDogdGhpcy5wcm9wcy5hdHRyaWJ1dGVzWydsYWJlbCddLFxuICAgICAgICAgICAgb25Ub3VjaFRhcDogdGhpcy5hcHBseUJ1dHRvbixcbiAgICAgICAgICAgIGRpc2FibGVkOiB0aGlzLnByb3BzLmRpc2FibGVkXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21peGluc0Zvcm1NaXhpbiA9IHJlcXVpcmUoJy4uL21peGlucy9Gb3JtTWl4aW4nKTtcblxudmFyIF9taXhpbnNGb3JtTWl4aW4yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWl4aW5zRm9ybU1peGluKTtcblxudmFyIF9GaWxlRHJvcHpvbmUgPSByZXF1aXJlKCcuL0ZpbGVEcm9wem9uZScpO1xuXG52YXIgX0ZpbGVEcm9wem9uZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9GaWxlRHJvcHpvbmUpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcHlkaW9IdHRwQXBpID0gcmVxdWlyZSgncHlkaW8vaHR0cC9hcGknKTtcblxudmFyIF9weWRpb0h0dHBBcGkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHlkaW9IdHRwQXBpKTtcblxudmFyIF9weWRpbyA9IHJlcXVpcmUoJ3B5ZGlvJyk7XG5cbnZhciBfcHlkaW8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHlkaW8pO1xuXG52YXIgX3B5ZGlvVXRpbExhbmcgPSByZXF1aXJlKCdweWRpby91dGlsL2xhbmcnKTtcblxudmFyIF9weWRpb1V0aWxMYW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3B5ZGlvVXRpbExhbmcpO1xuXG52YXIgX1B5ZGlvJHJlcXVpcmVMaWIgPSBfcHlkaW8yWydkZWZhdWx0J10ucmVxdWlyZUxpYignaG9jJyk7XG5cbnZhciBOYXRpdmVGaWxlRHJvcFByb3ZpZGVyID0gX1B5ZGlvJHJlcXVpcmVMaWIuTmF0aXZlRmlsZURyb3BQcm92aWRlcjtcblxuLy8gSnVzdCBlbmFibGUgdGhlIGRyb3AgbWVjaGFuaXNtLCBidXQgZG8gbm90aGluZywgaXQgaXMgbWFuYWdlZCBieSB0aGUgRmlsZURyb3B6b25lXG52YXIgQmluYXJ5RHJvcFpvbmUgPSBOYXRpdmVGaWxlRHJvcFByb3ZpZGVyKF9GaWxlRHJvcHpvbmUyWydkZWZhdWx0J10sIGZ1bmN0aW9uIChpdGVtcywgZmlsZXMsIHByb3BzKSB7fSk7XG5cbi8qKlxuICogVUkgZm9yIGRpc3BsYXlpbmcgYW5kIHVwbG9hZGluZyBhbiBpbWFnZSxcbiAqIHVzaW5nIHRoZSBiaW5hcnlDb250ZXh0IHN0cmluZy5cbiAqL1xuZXhwb3J0c1snZGVmYXVsdCddID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0lucHV0SW1hZ2UnLFxuXG4gICAgbWl4aW5zOiBbX21peGluc0Zvcm1NaXhpbjJbJ2RlZmF1bHQnXV0sXG5cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgYXR0cmlidXRlczogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGJpbmFyeV9jb250ZXh0OiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XG4gICAgICAgIHZhciBpbWdTcmMgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmICgobmV3UHJvcHMudmFsdWUgfHwgbmV3UHJvcHMuYmluYXJ5X2NvbnRleHQgJiYgbmV3UHJvcHMuYmluYXJ5X2NvbnRleHQgIT09IHRoaXMucHJvcHMuYmluYXJ5X2NvbnRleHQpICYmICF0aGlzLnN0YXRlLnJlc2V0KSB7XG4gICAgICAgICAgICBpbWdTcmMgPSB0aGlzLmdldEJpbmFyeVVybChuZXdQcm9wcywgdGhpcy5zdGF0ZS50ZW1wb3JhcnlCaW5hcnkgJiYgdGhpcy5zdGF0ZS50ZW1wb3JhcnlCaW5hcnkgPT09IG5ld1Byb3BzLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdQcm9wcy5hdHRyaWJ1dGVzWydkZWZhdWx0SW1hZ2UnXSkge1xuICAgICAgICAgICAgaW1nU3JjID0gbmV3UHJvcHMuYXR0cmlidXRlc1snZGVmYXVsdEltYWdlJ107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGltZ1NyYykge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGltYWdlU3JjOiBpbWdTcmMsIHJlc2V0OiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICAgICAgdmFyIGltZ1NyYyA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG9yaWdpbmFsQmluYXJ5ID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy52YWx1ZSkge1xuICAgICAgICAgICAgaW1nU3JjID0gdGhpcy5nZXRCaW5hcnlVcmwodGhpcy5wcm9wcyk7XG4gICAgICAgICAgICBvcmlnaW5hbEJpbmFyeSA9IHRoaXMucHJvcHMudmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5hdHRyaWJ1dGVzWydkZWZhdWx0SW1hZ2UnXSkge1xuICAgICAgICAgICAgaW1nU3JjID0gdGhpcy5wcm9wcy5hdHRyaWJ1dGVzWydkZWZhdWx0SW1hZ2UnXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBpbWFnZVNyYzogaW1nU3JjLCBvcmlnaW5hbEJpbmFyeTogb3JpZ2luYWxCaW5hcnkgfTtcbiAgICB9LFxuXG4gICAgZ2V0QmluYXJ5VXJsOiBmdW5jdGlvbiBnZXRCaW5hcnlVcmwocHJvcHMpIHtcbiAgICAgICAgdmFyIHB5ZGlvID0gX3B5ZGlvSHR0cEFwaTJbJ2RlZmF1bHQnXS5nZXRDbGllbnQoKS5nZXRQeWRpb09iamVjdCgpO1xuICAgICAgICB2YXIgdXJsID0gcHlkaW8uUGFyYW1ldGVycy5nZXQoJ0VORFBPSU5UX1JFU1RfQVBJJykgKyBwcm9wcy5hdHRyaWJ1dGVzWydsb2FkQWN0aW9uJ107XG4gICAgICAgIHZhciBiSWQgPSBwcm9wcy52YWx1ZTtcbiAgICAgICAgaWYgKHByb3BzLmJpbmFyeV9jb250ZXh0ICYmIHByb3BzLmJpbmFyeV9jb250ZXh0LmluZGV4T2YoJ3VzZXJfaWQ9JykgPT09IDApIHtcbiAgICAgICAgICAgIGJJZCA9IHByb3BzLmJpbmFyeV9jb250ZXh0LnJlcGxhY2UoJ3VzZXJfaWQ9JywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKCd7QklOQVJZfScsIGJJZCk7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfSxcblxuICAgIGdldFVwbG9hZFVybDogZnVuY3Rpb24gZ2V0VXBsb2FkVXJsKCkge1xuICAgICAgICB2YXIgcHlkaW8gPSBfcHlkaW9IdHRwQXBpMlsnZGVmYXVsdCddLmdldENsaWVudCgpLmdldFB5ZGlvT2JqZWN0KCk7XG4gICAgICAgIHZhciB1cmwgPSBweWRpby5QYXJhbWV0ZXJzLmdldCgnRU5EUE9JTlRfUkVTVF9BUEknKSArIHRoaXMucHJvcHMuYXR0cmlidXRlc1sndXBsb2FkQWN0aW9uJ107XG4gICAgICAgIHZhciBiSWQgPSAnJztcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuYmluYXJ5X2NvbnRleHQgJiYgdGhpcy5wcm9wcy5iaW5hcnlfY29udGV4dC5pbmRleE9mKCd1c2VyX2lkPScpID09PSAwKSB7XG4gICAgICAgICAgICBiSWQgPSB0aGlzLnByb3BzLmJpbmFyeV9jb250ZXh0LnJlcGxhY2UoJ3VzZXJfaWQ9JywgJycpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMudmFsdWUpIHtcbiAgICAgICAgICAgIGJJZCA9IHRoaXMucHJvcHMudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiSWQgPSBfcHlkaW9VdGlsTGFuZzJbJ2RlZmF1bHQnXS5jb21wdXRlU3RyaW5nU2x1Zyh0aGlzLnByb3BzLmF0dHJpYnV0ZXNbXCJuYW1lXCJdICsgXCIucG5nXCIpO1xuICAgICAgICB9XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKCd7QklOQVJZfScsIGJJZCk7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfSxcblxuICAgIHVwbG9hZENvbXBsZXRlOiBmdW5jdGlvbiB1cGxvYWRDb21wbGV0ZShuZXdCaW5hcnlOYW1lKSB7XG4gICAgICAgIHZhciBwcmV2VmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRlbXBvcmFyeUJpbmFyeTogbmV3QmluYXJ5TmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBudWxsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxGb3JtRGF0YSA9IHsgdHlwZTogJ2JpbmFyeScgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLm9yaWdpbmFsQmluYXJ5KSB7XG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbEZvcm1EYXRhWydvcmlnaW5hbF9iaW5hcnknXSA9IHRoaXMuc3RhdGUub3JpZ2luYWxCaW5hcnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKG5ld0JpbmFyeU5hbWUsIHByZXZWYWx1ZSwgYWRkaXRpb25hbEZvcm1EYXRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBodG1sVXBsb2FkOiBmdW5jdGlvbiBodG1sVXBsb2FkKCkge1xuICAgICAgICB3aW5kb3cuZm9ybU1hbmFnZXJIaWRkZW5JRnJhbWVTdWJtaXNzaW9uID0gKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHRoaXMudXBsb2FkQ29tcGxldGUocmVzdWx0LnRyaW0oKSk7XG4gICAgICAgICAgICB3aW5kb3cuZm9ybU1hbmFnZXJIaWRkZW5JRnJhbWVTdWJtaXNzaW9uID0gbnVsbDtcbiAgICAgICAgfSkuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5yZWZzLnVwbG9hZEZvcm0uc3VibWl0KCk7XG4gICAgfSxcblxuICAgIG9uRHJvcDogZnVuY3Rpb24gb25Ecm9wKGZpbGVzLCBldmVudCwgZHJvcHpvbmUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBpZiAoX3B5ZGlvSHR0cEFwaTJbJ2RlZmF1bHQnXS5zdXBwb3J0c1VwbG9hZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogdHJ1ZSB9KTtcbiAgICAgICAgICAgIF9weWRpb0h0dHBBcGkyWydkZWZhdWx0J10uZ2V0UmVzdENsaWVudCgpLmdldE9yVXBkYXRlSnd0KCkudGhlbihmdW5jdGlvbiAoand0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHhoclNldHRpbmdzID0geyBjdXN0b21IZWFkZXJzOiB7IEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIGp3dCB9IH07XG4gICAgICAgICAgICAgICAgX3B5ZGlvSHR0cEFwaTJbJ2RlZmF1bHQnXS5nZXRDbGllbnQoKS51cGxvYWRGaWxlKGZpbGVzWzBdLCBcInVzZXJmaWxlXCIsICcnLCAoZnVuY3Rpb24gKHRyYW5zcG9ydCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZSh0cmFuc3BvcnQucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuYmluYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZENvbXBsZXRlKHJlc3VsdC5iaW5hcnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBsb2FkaW5nOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgICB9KS5iaW5kKF90aGlzKSwgKGZ1bmN0aW9uICh0cmFuc3BvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIH0pLmJpbmQoX3RoaXMpLCBmdW5jdGlvbiAoY29tcHV0YWJsZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHByb2dyZXNzXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNvbXB1dGFibGVFdmVudCk7XG4gICAgICAgICAgICAgICAgfSwgX3RoaXMuZ2V0VXBsb2FkVXJsKCksIHhoclNldHRpbmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5odG1sVXBsb2FkKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xlYXJJbWFnZTogZnVuY3Rpb24gY2xlYXJJbWFnZSgpIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKGdsb2JhbC5jb25maXJtKCdEbyB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGN1cnJlbnQgaW1hZ2U/JykpIHtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByZXZWYWx1ZSA9IF90aGlzMi5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICBfdGhpczIuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgcmVzZXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9LCAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKCcnLCBwcmV2VmFsdWUsIHsgdHlwZTogJ2JpbmFyeScgfSk7XG4gICAgICAgICAgICAgICAgfSkuYmluZChfdGhpczIpKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHZhciBjb3ZlckltYWdlU3R5bGUgPSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IFwidXJsKFwiICsgdGhpcy5zdGF0ZS5pbWFnZVNyYyArIFwiKVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiBcIjUwJSA1MCVcIixcbiAgICAgICAgICAgIGJhY2tncm91bmRTaXplOiBcImNvdmVyXCJcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGljb25zID0gW107XG4gICAgICAgIGlmICh0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUubG9hZGluZykge1xuICAgICAgICAgICAgaWNvbnMucHVzaChfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnc3BhbicsIHsga2V5OiAnc3Bpbm5lcicsIGNsYXNzTmFtZTogJ2ljb24tc3Bpbm5lciByb3RhdGluZycsIHN0eWxlOiB7IG9wYWNpdHk6ICcwJyB9IH0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb25zLnB1c2goX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGtleTogJ2NhbWVyYScsIGNsYXNzTmFtZTogJ2ljb24tY2FtZXJhJywgc3R5bGU6IHsgb3BhY2l0eTogJzAnIH0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdpbWFnZS1sYWJlbCcgfSxcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmF0dHJpYnV0ZXMubGFiZWxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZm9ybScsXG4gICAgICAgICAgICAgICAgeyByZWY6ICd1cGxvYWRGb3JtJywgZW5jVHlwZTogJ211bHRpcGFydC9mb3JtLWRhdGEnLCB0YXJnZXQ6ICd1cGxvYWRlcl9oaWRkZW5faWZyYW1lJywgbWV0aG9kOiAncG9zdCcsIGFjdGlvbjogdGhpcy5nZXRVcGxvYWRVcmwoKSB9LFxuICAgICAgICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICBCaW5hcnlEcm9wWm9uZSxcbiAgICAgICAgICAgICAgICAgICAgeyBvbkRyb3A6IHRoaXMub25Ecm9wLCBhY2NlcHQ6ICdpbWFnZS8qJywgc3R5bGU6IGNvdmVySW1hZ2VTdHlsZSB9LFxuICAgICAgICAgICAgICAgICAgICBpY29uc1xuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2JpbmFyeS1yZW1vdmUtYnV0dG9uJywgb25DbGljazogdGhpcy5jbGVhckltYWdlIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGtleTogJ3JlbW92ZScsIGNsYXNzTmFtZTogJ21kaSBtZGktY2xvc2UnIH0pLFxuICAgICAgICAgICAgICAgICcgUkVTRVQnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScsIHsgc3R5bGU6IHsgZGlzcGxheTogXCJub25lXCIgfSwgaWQ6ICd1cGxvYWRlcl9oaWRkZW5faWZyYW1lJywgbmFtZTogJ3VwbG9hZGVyX2hpZGRlbl9pZnJhbWUnIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG59KTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9taXhpbnNGb3JtTWl4aW4gPSByZXF1aXJlKCcuLi9taXhpbnMvRm9ybU1peGluJyk7XG5cbnZhciBfbWl4aW5zRm9ybU1peGluMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21peGluc0Zvcm1NaXhpbik7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUmVhY3RNVUkgPSByZXF1aXJlKCdtYXRlcmlhbC11aS1sZWdhY3knKTtcblxuLyoqXG4gKiBUZXh0IGlucHV0IHRoYXQgaXMgY29udmVydGVkIHRvIGludGVnZXIsIGFuZFxuICogdGhlIFVJIGNhbiByZWFjdCB0byBhcnJvd3MgZm9yIGluY3JlbWVudGluZy9kZWNyZW1lbnRpbmcgdmFsdWVzXG4gKi9cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0lucHV0SW50ZWdlcicsXG5cbiAgICBtaXhpbnM6IFtfbWl4aW5zRm9ybU1peGluMlsnZGVmYXVsdCddXSxcblxuICAgIGtleURvd246IGZ1bmN0aW9uIGtleURvd24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGluYyA9IDAsXG4gICAgICAgICAgICBtdWx0aXBsZSA9IDE7XG4gICAgICAgIGlmIChldmVudC5rZXkgPT0gJ0VudGVyJykge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVFZGl0TW9kZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PSAnQXJyb3dVcCcpIHtcbiAgICAgICAgICAgIGluYyA9ICsxO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PSAnQXJyb3dEb3duJykge1xuICAgICAgICAgICAgaW5jID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBtdWx0aXBsZSA9IDEwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJzZWQgPSBwYXJzZUludCh0aGlzLnN0YXRlLnZhbHVlKTtcbiAgICAgICAgaWYgKGlzTmFOKHBhcnNlZCkpIHBhcnNlZCA9IDA7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlZCArIGluYyAqIG11bHRpcGxlO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlKG51bGwsIHZhbHVlKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGlzcGxheUdyaWQoKSAmJiAhdGhpcy5zdGF0ZS5lZGl0TW9kZSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgb25DbGljazogdGhpcy5wcm9wcy5kaXNhYmxlZCA/IGZ1bmN0aW9uICgpIHt9IDogdGhpcy50b2dnbGVFZGl0TW9kZSwgY2xhc3NOYW1lOiB2YWx1ZSA/ICcnIDogJ3BhcmFtVmFsdWUtZW1wdHknIH0sXG4gICAgICAgICAgICAgICAgIXZhbHVlID8gJ0VtcHR5JyA6IHZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGludHZhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaW50dmFsID0gcGFyc2VJbnQodGhpcy5zdGF0ZS52YWx1ZSkgKyAnJztcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4oaW50dmFsKSkgaW50dmFsID0gdGhpcy5zdGF0ZS52YWx1ZSArICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnR2YWwgPSAnMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdpbnRlZ2VyLWlucHV0JyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3RNVUkuVGV4dEZpZWxkLCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpbnR2YWwsXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiB0aGlzLm9uQ2hhbmdlLFxuICAgICAgICAgICAgICAgICAgICBvbktleURvd246IHRoaXMua2V5RG93bixcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IHRoaXMucHJvcHMuZGlzYWJsZWQsXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0OiB0aGlzLmlzRGlzcGxheUZvcm0oKSA/IHRoaXMucHJvcHMuYXR0cmlidXRlcy5sYWJlbCA6IG51bGxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWl4aW5zRm9ybU1peGluID0gcmVxdWlyZSgnLi4vbWl4aW5zL0Zvcm1NaXhpbicpO1xuXG52YXIgX21peGluc0Zvcm1NaXhpbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taXhpbnNGb3JtTWl4aW4pO1xuXG52YXIgX21peGluc0ZpZWxkV2l0aENob2ljZXMgPSByZXF1aXJlKCcuLi9taXhpbnMvRmllbGRXaXRoQ2hvaWNlcycpO1xuXG52YXIgX21peGluc0ZpZWxkV2l0aENob2ljZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWl4aW5zRmllbGRXaXRoQ2hvaWNlcyk7XG5cbi8qKlxuICogU2VsZWN0IGJveCBpbnB1dCBjb25mb3JtaW5nIHRvIFB5ZGlvIHN0YW5kYXJkIGZvcm0gcGFyYW1ldGVyLlxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJ21hdGVyaWFsLXVpJyk7XG5cbnZhciBTZWxlY3RGaWVsZCA9IF9yZXF1aXJlLlNlbGVjdEZpZWxkO1xudmFyIE1lbnVJdGVtID0gX3JlcXVpcmUuTWVudUl0ZW07XG52YXIgQ2hpcCA9IF9yZXF1aXJlLkNoaXA7XG5cbnZhciBMYW5nVXRpbHMgPSByZXF1aXJlKCdweWRpby91dGlsL2xhbmcnKTtcbnZhciBJbnB1dFNlbGVjdEJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0lucHV0U2VsZWN0Qm94JyxcblxuICAgIG1peGluczogW19taXhpbnNGb3JtTWl4aW4yWydkZWZhdWx0J11dLFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBza2lwQnVmZmVyQ2hhbmdlczogdHJ1ZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBvbkRyb3BEb3duQ2hhbmdlOiBmdW5jdGlvbiBvbkRyb3BEb3duQ2hhbmdlKGV2ZW50LCBpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZShldmVudCwgdmFsdWUpO1xuICAgICAgICB0aGlzLnRvZ2dsZUVkaXRNb2RlKCk7XG4gICAgfSxcblxuICAgIG9uTXVsdGlwbGVTZWxlY3Q6IGZ1bmN0aW9uIG9uTXVsdGlwbGVTZWxlY3QoZXZlbnQsIGluZGV4LCBuZXdWYWx1ZSkge1xuICAgICAgICBpZiAobmV3VmFsdWUgPT0gLTEpIHJldHVybjtcbiAgICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgICAgIHZhciBjdXJyZW50VmFsdWVzID0gdHlwZW9mIGN1cnJlbnRWYWx1ZSA9PT0gJ3N0cmluZycgPyBjdXJyZW50VmFsdWUuc3BsaXQoJywnKSA6IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgaWYgKCFjdXJyZW50VmFsdWVzLmluZGV4T2YobmV3VmFsdWUpICE9PSAtMSkge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlcy5wdXNoKG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UoZXZlbnQsIGN1cnJlbnRWYWx1ZXMuam9pbignLCcpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvZ2dsZUVkaXRNb2RlKCk7XG4gICAgfSxcblxuICAgIG9uTXVsdGlwbGVSZW1vdmU6IGZ1bmN0aW9uIG9uTXVsdGlwbGVSZW1vdmUodmFsdWUpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgICAgIHZhciBjdXJyZW50VmFsdWVzID0gdHlwZW9mIGN1cnJlbnRWYWx1ZSA9PT0gJ3N0cmluZycgPyBjdXJyZW50VmFsdWUuc3BsaXQoJywnKSA6IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgaWYgKGN1cnJlbnRWYWx1ZXMuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG4gICAgICAgICAgICBjdXJyZW50VmFsdWVzID0gTGFuZ1V0aWxzLmFycmF5V2l0aG91dChjdXJyZW50VmFsdWVzLCBjdXJyZW50VmFsdWVzLmluZGV4T2YodmFsdWUpKTtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UobnVsbCwgY3VycmVudFZhbHVlcy5qb2luKCcsJykpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHZhciBjdXJyZW50VmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgICB2YXIgbWVudUl0ZW1zID0gW10sXG4gICAgICAgICAgICBtdWx0aXBsZU9wdGlvbnMgPSBbXSxcbiAgICAgICAgICAgIG1hbmRhdG9yeSA9IHRydWU7XG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5hdHRyaWJ1dGVzWydtYW5kYXRvcnknXSB8fCB0aGlzLnByb3BzLmF0dHJpYnV0ZXNbJ21hbmRhdG9yeSddICE9IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICBtYW5kYXRvcnkgPSBmYWxzZTtcbiAgICAgICAgICAgIG1lbnVJdGVtcy5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHsgdmFsdWU6IC0xLCBwcmltYXJ5VGV4dDogdGhpcy5wcm9wcy5hdHRyaWJ1dGVzWydsYWJlbCddICsgJy4uLicgfSkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjaG9pY2VzID0gdGhpcy5wcm9wcy5jaG9pY2VzO1xuXG4gICAgICAgIGNob2ljZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgbWVudUl0ZW1zLnB1c2goUmVhY3QuY3JlYXRlRWxlbWVudChNZW51SXRlbSwgeyB2YWx1ZToga2V5LCBwcmltYXJ5VGV4dDogdmFsdWUgfSkpO1xuICAgICAgICAgICAgbXVsdGlwbGVPcHRpb25zLnB1c2goeyB2YWx1ZToga2V5LCBsYWJlbDogdmFsdWUgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5pc0Rpc3BsYXlHcmlkKCkgJiYgIXRoaXMuc3RhdGUuZWRpdE1vZGUgfHwgdGhpcy5wcm9wcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChjaG9pY2VzLmdldCh2YWx1ZSkpIHZhbHVlID0gY2hvaWNlcy5nZXQodmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLnByb3BzLmRpc2FibGVkID8gZnVuY3Rpb24gKCkge30gOiB0aGlzLnRvZ2dsZUVkaXRNb2RlLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IHZhbHVlID8gJycgOiAncGFyYW1WYWx1ZS1lbXB0eScgfSxcbiAgICAgICAgICAgICAgICAhdmFsdWUgPyAnRW1wdHknIDogdmFsdWUsXG4gICAgICAgICAgICAgICAgJyDCoMKgJyxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdpY29uLWNhcmV0LWRvd24nIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5tdWx0aXBsZSAmJiB0aGlzLnByb3BzLm11bHRpcGxlID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFZhbHVlcyA9IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRWYWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVzID0gY3VycmVudFZhbHVlLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaGFzVmFsdWUgPSBjdXJyZW50VmFsdWVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogXCJtdWx0aXBsZSBoYXMtdmFsdWVcIiB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgZmxleFdyYXA6ICd3cmFwJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVzLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGlwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG9uUmVxdWVzdERlbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLm9uTXVsdGlwbGVSZW1vdmUodik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdEZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdGhpcy5vbk11bHRpcGxlU2VsZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudUl0ZW1zXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0RmllbGQsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ6IHRoaXMucHJvcHMuYXR0cmlidXRlcy5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY3VycmVudFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiB0aGlzLm9uRHJvcERvd25DaGFuZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsbFdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW51SXRlbXNcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gSW5wdXRTZWxlY3RCb3ggPSBfbWl4aW5zRmllbGRXaXRoQ2hvaWNlczJbJ2RlZmF1bHQnXShJbnB1dFNlbGVjdEJveCk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBJbnB1dFNlbGVjdEJveDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9taXhpbnNBY3Rpb25SdW5uZXJNaXhpbiA9IHJlcXVpcmUoJy4uL21peGlucy9BY3Rpb25SdW5uZXJNaXhpbicpO1xuXG52YXIgX21peGluc0FjdGlvblJ1bm5lck1peGluMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21peGluc0FjdGlvblJ1bm5lck1peGluKTtcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnTW9uaXRvcmluZ0xhYmVsJyxcblxuICAgIG1peGluczogW19taXhpbnNBY3Rpb25SdW5uZXJNaXhpbjJbJ2RlZmF1bHQnXV0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICAgICAgdmFyIGxvYWRpbmdNZXNzYWdlID0gJ0xvYWRpbmcnO1xuICAgICAgICBpZiAodGhpcy5jb250ZXh0ICYmIHRoaXMuY29udGV4dC5nZXRNZXNzYWdlKSB7XG4gICAgICAgICAgICBsb2FkaW5nTWVzc2FnZSA9IHRoaXMuY29udGV4dC5nZXRNZXNzYWdlKDQ2NiwgJycpO1xuICAgICAgICB9IGVsc2UgaWYgKGdsb2JhbC5weWRpbyAmJiBnbG9iYWwucHlkaW8uTWVzc2FnZUhhc2gpIHtcbiAgICAgICAgICAgIGxvYWRpbmdNZXNzYWdlID0gZ2xvYmFsLnB5ZGlvLk1lc3NhZ2VIYXNoWzQ2Nl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBsb2FkaW5nTWVzc2FnZSB9O1xuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IChmdW5jdGlvbiAodHJhbnNwb3J0KSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc3RhdHVzOiB0cmFuc3BvcnQucmVzcG9uc2VUZXh0IH0pO1xuICAgICAgICB9KS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9wb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5hcHBseUFjdGlvbihjYWxsYmFjayk7XG4gICAgICAgIH0pLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX3BvbGxlcigpO1xuICAgICAgICB0aGlzLl9wZSA9IGdsb2JhbC5zZXRJbnRlcnZhbCh0aGlzLl9wb2xsZXIsIDEwMDAwKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICBpZiAodGhpcy5fcGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5jbGVhckludGVydmFsKHRoaXMuX3BlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnN0YXR1c1xuICAgICAgICApO1xuICAgIH1cblxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWl4aW5zRm9ybU1peGluID0gcmVxdWlyZSgnLi4vbWl4aW5zL0Zvcm1NaXhpbicpO1xuXG52YXIgX21peGluc0Zvcm1NaXhpbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taXhpbnNGb3JtTWl4aW4pO1xuXG52YXIgX21hdGVyaWFsVWkgPSByZXF1aXJlKCdtYXRlcmlhbC11aScpO1xuXG4vKipcbiAqIFRleHQgaW5wdXQsIGNhbiBiZSBzaW5nbGUgbGluZSwgbXVsdGlMaW5lLCBvciBwYXNzd29yZCwgZGVwZW5kaW5nIG9uIHRoZVxuICogYXR0cmlidXRlcy50eXBlIGtleS5cbiAqL1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuZXhwb3J0c1snZGVmYXVsdCddID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnVGV4dEZpZWxkJyxcblxuICAgIG1peGluczogW19taXhpbnNGb3JtTWl4aW4yWydkZWZhdWx0J11dLFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGlzcGxheUdyaWQoKSAmJiAhdGhpcy5zdGF0ZS5lZGl0TW9kZSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmF0dHJpYnV0ZXNbJ3R5cGUnXSA9PT0gJ3Bhc3N3b3JkJyAmJiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJyoqKioqKioqKioqJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBvbkNsaWNrOiB0aGlzLnByb3BzLmRpc2FibGVkID8gZnVuY3Rpb24gKCkge30gOiB0aGlzLnRvZ2dsZUVkaXRNb2RlLCBjbGFzc05hbWU6IHZhbHVlID8gJycgOiAncGFyYW1WYWx1ZS1lbXB0eScgfSxcbiAgICAgICAgICAgICAgICAhdmFsdWUgPyAnRW1wdHknIDogdmFsdWVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZmllbGQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLlRleHRGaWVsZCwge1xuICAgICAgICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0OiB0aGlzLmlzRGlzcGxheUZvcm0oKSA/IHRoaXMucHJvcHMuYXR0cmlidXRlcy5sYWJlbCA6IG51bGwsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuc3RhdGUudmFsdWUgfHwgXCJcIixcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogdGhpcy5vbkNoYW5nZSxcbiAgICAgICAgICAgICAgICBvbktleURvd246IHRoaXMuZW50ZXJUb1RvZ2dsZSxcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnByb3BzLmF0dHJpYnV0ZXNbJ3R5cGUnXSA9PT0gJ3Bhc3N3b3JkJyA/ICdwYXNzd29yZCcgOiBudWxsLFxuICAgICAgICAgICAgICAgIG11bHRpTGluZTogdGhpcy5wcm9wcy5hdHRyaWJ1dGVzWyd0eXBlJ10gPT09ICd0ZXh0YXJlYScsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IHRoaXMucHJvcHMuZGlzYWJsZWQsXG4gICAgICAgICAgICAgICAgZXJyb3JUZXh0OiB0aGlzLnByb3BzLmVycm9yVGV4dCxcbiAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU6ICdvZmYnLFxuICAgICAgICAgICAgICAgIGZ1bGxXaWR0aDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5hdHRyaWJ1dGVzWyd0eXBlJ10gPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2Zvcm0nLFxuICAgICAgICAgICAgICAgICAgICB7IGF1dG9Db21wbGV0ZTogJ29mZicsIHN0eWxlOiB7IGRpc3BsYXk6ICdpbmxpbmUnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgZmllbGRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBmaWVsZFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21peGluc0Zvcm1NaXhpbiA9IHJlcXVpcmUoJy4uL21peGlucy9Gb3JtTWl4aW4nKTtcblxudmFyIF9taXhpbnNGb3JtTWl4aW4yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWl4aW5zRm9ybU1peGluKTtcblxudmFyIF9weWRpb1V0aWxQYXNzID0gcmVxdWlyZSgncHlkaW8vdXRpbC9wYXNzJyk7XG5cbnZhciBfcHlkaW9VdGlsUGFzczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9weWRpb1V0aWxQYXNzKTtcblxudmFyIF9tYXRlcmlhbFVpID0gcmVxdWlyZSgnbWF0ZXJpYWwtdWknKTtcblxuLyoqXG4gKiBUZXh0IGlucHV0LCBjYW4gYmUgc2luZ2xlIGxpbmUsIG11bHRpTGluZSwgb3IgcGFzc3dvcmQsIGRlcGVuZGluZyBvbiB0aGVcbiAqIGF0dHJpYnV0ZXMudHlwZSBrZXkuXG4gKi9cblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1ZhbGlkTG9naW4nLFxuXG4gICAgbWl4aW5zOiBbX21peGluc0Zvcm1NaXhpbjJbJ2RlZmF1bHQnXV0sXG5cbiAgICB0ZXh0VmFsdWVDaGFuZ2VkOiBmdW5jdGlvbiB0ZXh0VmFsdWVDaGFuZ2VkKGV2ZW50LCB2YWx1ZSkge1xuICAgICAgICB2YXIgZXJyID0gX3B5ZGlvVXRpbFBhc3MyWydkZWZhdWx0J10uaXNWYWxpZExvZ2luKHZhbHVlKTtcbiAgICAgICAgdmFyIHByZXZTdGF0ZVZhbGlkID0gdGhpcy5zdGF0ZS52YWxpZDtcbiAgICAgICAgdmFyIHZhbGlkID0gIWVycjtcbiAgICAgICAgaWYgKHByZXZTdGF0ZVZhbGlkICE9PSB2YWxpZCAmJiB0aGlzLnByb3BzLm9uVmFsaWRTdGF0dXNDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25WYWxpZFN0YXR1c0NoYW5nZSh2YWxpZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbGlkOiB2YWxpZCwgZXJyOiBlcnIgfSk7XG5cbiAgICAgICAgdGhpcy5vbkNoYW5nZShldmVudCwgdmFsdWUpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5pc0Rpc3BsYXlHcmlkKCkgJiYgIXRoaXMuc3RhdGUuZWRpdE1vZGUpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5hdHRyaWJ1dGVzWyd0eXBlJ10gPT09ICdwYXNzd29yZCcgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcqKioqKioqKioqKic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgb25DbGljazogdGhpcy5wcm9wcy5kaXNhYmxlZCA/IGZ1bmN0aW9uICgpIHt9IDogdGhpcy50b2dnbGVFZGl0TW9kZSwgY2xhc3NOYW1lOiB2YWx1ZSA/ICcnIDogJ3BhcmFtVmFsdWUtZW1wdHknIH0sXG4gICAgICAgICAgICAgICAgIXZhbHVlID8gJ0VtcHR5JyA6IHZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGVyciA9IHRoaXMuc3RhdGUuZXJyO1xuXG4gICAgICAgICAgICB2YXIgZmllbGQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLlRleHRGaWVsZCwge1xuICAgICAgICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0OiB0aGlzLmlzRGlzcGxheUZvcm0oKSA/IHRoaXMucHJvcHMuYXR0cmlidXRlcy5sYWJlbCA6IG51bGwsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuc3RhdGUudmFsdWUgfHwgXCJcIixcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKGUsIHYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnRleHRWYWx1ZUNoYW5nZWQoZSwgdik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbktleURvd246IHRoaXMuZW50ZXJUb1RvZ2dsZSxcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnByb3BzLmF0dHJpYnV0ZXNbJ3R5cGUnXSA9PT0gJ3Bhc3N3b3JkJyA/ICdwYXNzd29yZCcgOiBudWxsLFxuICAgICAgICAgICAgICAgIG11bHRpTGluZTogdGhpcy5wcm9wcy5hdHRyaWJ1dGVzWyd0eXBlJ10gPT09ICd0ZXh0YXJlYScsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IHRoaXMucHJvcHMuZGlzYWJsZWQsXG4gICAgICAgICAgICAgICAgZXJyb3JUZXh0OiB0aGlzLnByb3BzLmVycm9yVGV4dCB8fCBlcnIsXG4gICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlOiAnb2ZmJyxcbiAgICAgICAgICAgICAgICBmdWxsV2lkdGg6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuYXR0cmlidXRlc1sndHlwZSddID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdmb3JtJyxcbiAgICAgICAgICAgICAgICAgICAgeyBhdXRvQ29tcGxldGU6ICdvZmYnLCBzdHlsZTogeyBkaXNwbGF5OiAnaW5saW5lJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgZmllbGRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59KTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9taXhpbnNGb3JtTWl4aW4gPSByZXF1aXJlKCcuLi9taXhpbnMvRm9ybU1peGluJyk7XG5cbnZhciBfbWl4aW5zRm9ybU1peGluMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21peGluc0Zvcm1NaXhpbik7XG5cbnZhciBQYXNzVXRpbHMgPSByZXF1aXJlKCdweWRpby91dGlsL3Bhc3MnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJ21hdGVyaWFsLXVpJyk7XG5cbnZhciBUZXh0RmllbGQgPSBfcmVxdWlyZS5UZXh0RmllbGQ7XG5leHBvcnRzWydkZWZhdWx0J10gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdWYWxpZFBhc3N3b3JkJyxcblxuICAgIG1peGluczogW19taXhpbnNGb3JtTWl4aW4yWydkZWZhdWx0J11dLFxuXG4gICAgaXNWYWxpZDogZnVuY3Rpb24gaXNWYWxpZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudmFsaWQ7XG4gICAgfSxcblxuICAgIGNoZWNrTWluTGVuZ3RoOiBmdW5jdGlvbiBjaGVja01pbkxlbmd0aCh2YWx1ZSkge1xuICAgICAgICB2YXIgbWluTGVuZ3RoID0gcGFyc2VJbnQoZ2xvYmFsLnB5ZGlvLmdldFBsdWdpbkNvbmZpZ3MoXCJjb3JlLmF1dGhcIikuZ2V0KFwiUEFTU1dPUkRfTUlOTEVOR1RIXCIpKTtcbiAgICAgICAgcmV0dXJuICEodmFsdWUgJiYgdmFsdWUubGVuZ3RoIDwgbWluTGVuZ3RoKTtcbiAgICB9LFxuXG4gICAgZ2V0TWVzc2FnZTogZnVuY3Rpb24gZ2V0TWVzc2FnZShtZXNzYWdlSWQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dCAmJiB0aGlzLmNvbnRleHQuZ2V0TWVzc2FnZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5nZXRNZXNzYWdlKG1lc3NhZ2VJZCwgJycpO1xuICAgICAgICB9IGVsc2UgaWYgKGdsb2JhbC5weWRpbyAmJiBnbG9iYWwucHlkaW8uTWVzc2FnZUhhc2gpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWwucHlkaW8uTWVzc2FnZUhhc2hbbWVzc2FnZUlkXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVQYXNzU3RhdGU6IGZ1bmN0aW9uIHVwZGF0ZVBhc3NTdGF0ZSgpIHtcbiAgICAgICAgdmFyIHByZXZTdGF0ZVZhbGlkID0gdGhpcy5zdGF0ZS52YWxpZDtcbiAgICAgICAgdmFyIG5ld1N0YXRlID0gUGFzc1V0aWxzLmdldFN0YXRlKHRoaXMucmVmcy5wYXNzLmdldFZhbHVlKCksIHRoaXMucmVmcy5jb25maXJtID8gdGhpcy5yZWZzLmNvbmZpcm0uZ2V0VmFsdWUoKSA6ICcnKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gICAgICAgIGlmIChwcmV2U3RhdGVWYWxpZCAhPT0gbmV3U3RhdGUudmFsaWQgJiYgdGhpcy5wcm9wcy5vblZhbGlkU3RhdHVzQ2hhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uVmFsaWRTdGF0dXNDaGFuZ2UobmV3U3RhdGUudmFsaWQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUGFzc3dvcmRDaGFuZ2U6IGZ1bmN0aW9uIG9uUGFzc3dvcmRDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQYXNzU3RhdGUoKTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZShldmVudCwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICB9LFxuXG4gICAgb25Db25maXJtQ2hhbmdlOiBmdW5jdGlvbiBvbkNvbmZpcm1DaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbmZpcm1WYWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhc3NTdGF0ZSgpO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlKGV2ZW50LCB0aGlzLnN0YXRlLnZhbHVlKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGlzcGxheUdyaWQoKSAmJiAhdGhpcy5zdGF0ZS5lZGl0TW9kZSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgb25DbGljazogdGhpcy5wcm9wcy5kaXNhYmxlZCA/IGZ1bmN0aW9uICgpIHt9IDogdGhpcy50b2dnbGVFZGl0TW9kZSwgY2xhc3NOYW1lOiB2YWx1ZSA/ICcnIDogJ3BhcmFtVmFsdWUtZW1wdHknIH0sXG4gICAgICAgICAgICAgICAgIXZhbHVlID8gJ0VtcHR5JyA6IHZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG92ZXJmbG93ID0geyBvdmVyZmxvdzogJ2hpZGRlbicsIHdoaXRlU3BhY2U6ICdub3dyYXAnLCB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsIHdpZHRoOiAnMTAwJScgfTtcbiAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSB0aGlzLnN0YXRlLnZhbGlkID8gJycgOiAnbXVpLWVycm9yLWFzLWhpbnQnO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gdGhpcy5wcm9wcy5jbGFzc05hbWUgKyAnICcgKyBjbGFzc05hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgX2NvbmZpcm0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS52YWx1ZSAmJiAhdGhpcy5wcm9wcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIF9jb25maXJtID0gW1JlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsga2V5OiAnc2VwJywgc3R5bGU6IHsgd2lkdGg6IDIwIH0gfSksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGV4dEZpZWxkLCB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2NvbmZpcm0nLFxuICAgICAgICAgICAgICAgICAgICByZWY6ICdjb25maXJtJyxcbiAgICAgICAgICAgICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ6IHRoaXMuZ2V0TWVzc2FnZSgxOTkpLFxuICAgICAgICAgICAgICAgICAgICBmbG9hdGluZ0xhYmVsU2hyaW5rU3R5bGU6IF9leHRlbmRzKHt9LCBvdmVyZmxvdywgeyB3aWR0aDogJzEzMCUnIH0pLFxuICAgICAgICAgICAgICAgICAgICBmbG9hdGluZ0xhYmVsU3R5bGU6IG92ZXJmbG93LFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuc3RhdGUuY29uZmlybVZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdGhpcy5vbkNvbmZpcm1DaGFuZ2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgICAgICAgICAgICAgIG11bHRpTGluZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiB0aGlzLnByb3BzLmRpc2FibGVkLFxuICAgICAgICAgICAgICAgICAgICBmdWxsV2lkdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7IGZsZXg6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JUZXh0OiB0aGlzLnN0YXRlLmNvbmZpcm1FcnJvclRleHRcbiAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZm9ybScsXG4gICAgICAgICAgICAgICAgeyBhdXRvQ29tcGxldGU6ICdvZmYnIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBtYXJnaW5Ub3A6IC0xNiB9IH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGV4dEZpZWxkLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWY6ICdwYXNzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0OiB0aGlzLmlzRGlzcGxheUZvcm0oKSA/IHRoaXMucHJvcHMuYXR0cmlidXRlcy5sYWJlbCA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBmbG9hdGluZ0xhYmVsU2hyaW5rU3R5bGU6IF9leHRlbmRzKHt9LCBvdmVyZmxvdywgeyB3aWR0aDogJzEzMCUnIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXRpbmdMYWJlbFN0eWxlOiBvdmVyZmxvdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuc3RhdGUudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdGhpcy5vblBhc3N3b3JkQ2hhbmdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duOiB0aGlzLmVudGVyVG9Ub2dnbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlMaW5lOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiB0aGlzLnByb3BzLmRpc2FibGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUZXh0OiB0aGlzLnN0YXRlLnBhc3NFcnJvclRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsV2lkdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogeyBmbGV4OiAxIH1cbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIF9jb25maXJtXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWl4aW5zSGVscGVyTWl4aW4gPSByZXF1aXJlKCcuL21peGlucy9IZWxwZXJNaXhpbicpO1xuXG52YXIgX21peGluc0hlbHBlck1peGluMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21peGluc0hlbHBlck1peGluKTtcblxudmFyIF9tYW5hZ2VyTWFuYWdlciA9IHJlcXVpcmUoJy4vbWFuYWdlci9NYW5hZ2VyJyk7XG5cbnZhciBfbWFuYWdlck1hbmFnZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFuYWdlck1hbmFnZXIpO1xuXG52YXIgX2ZpZWxkc1RleHRGaWVsZCA9IHJlcXVpcmUoJy4vZmllbGRzL1RleHRGaWVsZCcpO1xuXG52YXIgX2ZpZWxkc1RleHRGaWVsZDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9maWVsZHNUZXh0RmllbGQpO1xuXG52YXIgX2ZpZWxkc1ZhbGlkUGFzc3dvcmQgPSByZXF1aXJlKCcuL2ZpZWxkcy9WYWxpZFBhc3N3b3JkJyk7XG5cbnZhciBfZmllbGRzVmFsaWRQYXNzd29yZDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9maWVsZHNWYWxpZFBhc3N3b3JkKTtcblxudmFyIF9maWVsZHNJbnB1dEludGVnZXIgPSByZXF1aXJlKCcuL2ZpZWxkcy9JbnB1dEludGVnZXInKTtcblxudmFyIF9maWVsZHNJbnB1dEludGVnZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZmllbGRzSW5wdXRJbnRlZ2VyKTtcblxudmFyIF9maWVsZHNJbnB1dEJvb2xlYW4gPSByZXF1aXJlKCcuL2ZpZWxkcy9JbnB1dEJvb2xlYW4nKTtcblxudmFyIF9maWVsZHNJbnB1dEJvb2xlYW4yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZmllbGRzSW5wdXRCb29sZWFuKTtcblxudmFyIF9maWVsZHNJbnB1dEJ1dHRvbiA9IHJlcXVpcmUoJy4vZmllbGRzL0lucHV0QnV0dG9uJyk7XG5cbnZhciBfZmllbGRzSW5wdXRCdXR0b24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZmllbGRzSW5wdXRCdXR0b24pO1xuXG52YXIgX2ZpZWxkc01vbml0b3JpbmdMYWJlbCA9IHJlcXVpcmUoJy4vZmllbGRzL01vbml0b3JpbmdMYWJlbCcpO1xuXG52YXIgX2ZpZWxkc01vbml0b3JpbmdMYWJlbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9maWVsZHNNb25pdG9yaW5nTGFiZWwpO1xuXG52YXIgX2ZpZWxkc0lucHV0U2VsZWN0Qm94ID0gcmVxdWlyZSgnLi9maWVsZHMvSW5wdXRTZWxlY3RCb3gnKTtcblxudmFyIF9maWVsZHNJbnB1dFNlbGVjdEJveDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9maWVsZHNJbnB1dFNlbGVjdEJveCk7XG5cbnZhciBfZmllbGRzQXV0b2NvbXBsZXRlQm94ID0gcmVxdWlyZSgnLi9maWVsZHMvQXV0b2NvbXBsZXRlQm94Jyk7XG5cbnZhciBfZmllbGRzQXV0b2NvbXBsZXRlQm94MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZpZWxkc0F1dG9jb21wbGV0ZUJveCk7XG5cbnZhciBfZmllbGRzSW5wdXRJbWFnZSA9IHJlcXVpcmUoJy4vZmllbGRzL0lucHV0SW1hZ2UnKTtcblxudmFyIF9maWVsZHNJbnB1dEltYWdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZpZWxkc0lucHV0SW1hZ2UpO1xuXG52YXIgX3BhbmVsRm9ybVBhbmVsID0gcmVxdWlyZSgnLi9wYW5lbC9Gb3JtUGFuZWwnKTtcblxudmFyIF9wYW5lbEZvcm1QYW5lbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wYW5lbEZvcm1QYW5lbCk7XG5cbnZhciBfcGFuZWxGb3JtSGVscGVyID0gcmVxdWlyZSgnLi9wYW5lbC9Gb3JtSGVscGVyJyk7XG5cbnZhciBfcGFuZWxGb3JtSGVscGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BhbmVsRm9ybUhlbHBlcik7XG5cbnZhciBfZmllbGRzRmlsZURyb3B6b25lID0gcmVxdWlyZSgnLi9maWVsZHMvRmlsZURyb3B6b25lJyk7XG5cbnZhciBfZmllbGRzRmlsZURyb3B6b25lMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZpZWxkc0ZpbGVEcm9wem9uZSk7XG5cbnZhciBfZmllbGRzQXV0b2NvbXBsZXRlVHJlZSA9IHJlcXVpcmUoJy4vZmllbGRzL0F1dG9jb21wbGV0ZVRyZWUnKTtcblxudmFyIF9maWVsZHNBdXRvY29tcGxldGVUcmVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZpZWxkc0F1dG9jb21wbGV0ZVRyZWUpO1xuXG52YXIgUHlkaW9Gb3JtID0ge1xuICBIZWxwZXJNaXhpbjogX21peGluc0hlbHBlck1peGluMlsnZGVmYXVsdCddLFxuICBNYW5hZ2VyOiBfbWFuYWdlck1hbmFnZXIyWydkZWZhdWx0J10sXG4gIElucHV0VGV4dDogX2ZpZWxkc1RleHRGaWVsZDJbJ2RlZmF1bHQnXSxcbiAgVmFsaWRQYXNzd29yZDogX2ZpZWxkc1ZhbGlkUGFzc3dvcmQyWydkZWZhdWx0J10sXG4gIElucHV0Qm9vbGVhbjogX2ZpZWxkc0lucHV0Qm9vbGVhbjJbJ2RlZmF1bHQnXSxcbiAgSW5wdXRJbnRlZ2VyOiBfZmllbGRzSW5wdXRJbnRlZ2VyMlsnZGVmYXVsdCddLFxuICBJbnB1dEJ1dHRvbjogX2ZpZWxkc0lucHV0QnV0dG9uMlsnZGVmYXVsdCddLFxuICBNb25pdG9yaW5nTGFiZWw6IF9maWVsZHNNb25pdG9yaW5nTGFiZWwyWydkZWZhdWx0J10sXG4gIElucHV0U2VsZWN0Qm94OiBfZmllbGRzSW5wdXRTZWxlY3RCb3gyWydkZWZhdWx0J10sXG4gIEF1dG9jb21wbGV0ZUJveDogX2ZpZWxkc0F1dG9jb21wbGV0ZUJveDJbJ2RlZmF1bHQnXSxcbiAgQXV0b2NvbXBsZXRlVHJlZTogX2ZpZWxkc0F1dG9jb21wbGV0ZVRyZWUyWydkZWZhdWx0J10sXG4gIElucHV0SW1hZ2U6IF9maWVsZHNJbnB1dEltYWdlMlsnZGVmYXVsdCddLFxuICBGb3JtUGFuZWw6IF9wYW5lbEZvcm1QYW5lbDJbJ2RlZmF1bHQnXSxcbiAgUHlkaW9IZWxwZXI6IF9wYW5lbEZvcm1IZWxwZXIyWydkZWZhdWx0J10sXG4gIEZpbGVEcm9wWm9uZTogX2ZpZWxkc0ZpbGVEcm9wem9uZTJbJ2RlZmF1bHQnXSxcbiAgY3JlYXRlRm9ybUVsZW1lbnQ6IF9tYW5hZ2VyTWFuYWdlcjJbJ2RlZmF1bHQnXS5jcmVhdGVGb3JtRWxlbWVudFxufTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gUHlkaW9Gb3JtO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIF9maWVsZHNWYWxpZExvZ2luID0gcmVxdWlyZSgnLi4vZmllbGRzL1ZhbGlkTG9naW4nKTtcblxudmFyIF9maWVsZHNWYWxpZExvZ2luMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZpZWxkc1ZhbGlkTG9naW4pO1xuXG52YXIgWE1MVXRpbHMgPSByZXF1aXJlKCdweWRpby91dGlsL3htbCcpO1xudmFyIElucHV0Qm9vbGVhbiA9IHJlcXVpcmUoJy4vLi4vZmllbGRzL0lucHV0Qm9vbGVhbicpO1xudmFyIElucHV0VGV4dCA9IHJlcXVpcmUoJy4vLi4vZmllbGRzL1RleHRGaWVsZCcpO1xudmFyIFZhbGlkUGFzc3dvcmQgPSByZXF1aXJlKCcuLy4uL2ZpZWxkcy9WYWxpZFBhc3N3b3JkJyk7XG52YXIgSW5wdXRJbnRlZ2VyID0gcmVxdWlyZSgnLi8uLi9maWVsZHMvSW5wdXRJbnRlZ2VyJyk7XG52YXIgSW5wdXRCdXR0b24gPSByZXF1aXJlKCcuLy4uL2ZpZWxkcy9JbnB1dEJ1dHRvbicpO1xudmFyIE1vbml0b3JpbmdMYWJlbCA9IHJlcXVpcmUoJy4vLi4vZmllbGRzL01vbml0b3JpbmdMYWJlbCcpO1xudmFyIElucHV0SW1hZ2UgPSByZXF1aXJlKCcuLy4uL2ZpZWxkcy9JbnB1dEltYWdlJyk7XG52YXIgU2VsZWN0Qm94ID0gcmVxdWlyZSgnLi8uLi9maWVsZHMvSW5wdXRTZWxlY3RCb3gnKTtcbnZhciBBdXRvY29tcGxldGVCb3ggPSByZXF1aXJlKCcuLy4uL2ZpZWxkcy9BdXRvY29tcGxldGVCb3gnKTtcbnZhciBBdXRvY29tcGxldGVUcmVlID0gcmVxdWlyZSgnLi8uLi9maWVsZHMvQXV0b2NvbXBsZXRlVHJlZScpO1xuXG4vKipcbiAqIFV0aWxpdHkgY2xhc3MgdG8gcGFyc2UgLyBoYW5kbGUgcHlkaW8gc3RhbmRhcmQgZm9ybSBkZWZpbml0aW9ucy92YWx1ZXMuXG4gKi9cblxudmFyIE1hbmFnZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1hbmFnZXIoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNYW5hZ2VyKTtcbiAgICB9XG5cbiAgICBNYW5hZ2VyLmhhc0hlbHBlciA9IGZ1bmN0aW9uIGhhc0hlbHBlcihwbHVnaW5JZCwgcGFyYW1OYW1lKSB7XG5cbiAgICAgICAgdmFyIGhlbHBlcnMgPSBNYW5hZ2VyLmdldEhlbHBlcnNDYWNoZSgpO1xuICAgICAgICByZXR1cm4gaGVscGVyc1twbHVnaW5JZF0gJiYgaGVscGVyc1twbHVnaW5JZF1bJ3BhcmFtZXRlcnMnXVtwYXJhbU5hbWVdO1xuICAgIH07XG5cbiAgICBNYW5hZ2VyLmdldEhlbHBlcnNDYWNoZSA9IGZ1bmN0aW9uIGdldEhlbHBlcnNDYWNoZSgpIHtcbiAgICAgICAgaWYgKCFNYW5hZ2VyLkhFTFBFUlNfQ0FDSEUpIHtcbiAgICAgICAgICAgIHZhciBoZWxwZXJDYWNoZSA9IHt9O1xuICAgICAgICAgICAgdmFyIGhlbHBlcnMgPSBYTUxVdGlscy5YUGF0aFNlbGVjdE5vZGVzKHdpbmRvdy5weWRpby5SZWdpc3RyeS5nZXRYTUwoKSwgJ3BsdWdpbnMvKi9jbGllbnRfc2V0dGluZ3MvcmVzb3VyY2VzL2pzW0B0eXBlPVwiaGVscGVyXCJdJyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlbHBlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaGVscGVyTm9kZSA9IGhlbHBlcnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIHBsdWdpbiA9IGhlbHBlck5vZGUuZ2V0QXR0cmlidXRlKFwicGx1Z2luXCIpO1xuICAgICAgICAgICAgICAgIGhlbHBlckNhY2hlW3BsdWdpbl0gPSB7IG5hbWVzcGFjZTogaGVscGVyTm9kZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzTmFtZScpLCBwYXJhbWV0ZXJzOiB7fSB9O1xuICAgICAgICAgICAgICAgIHZhciBwYXJhbU5vZGVzID0gWE1MVXRpbHMuWFBhdGhTZWxlY3ROb2RlcyhoZWxwZXJOb2RlLCAncGFyYW1ldGVyJyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBwYXJhbU5vZGVzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbU5vZGUgPSBwYXJhbU5vZGVzW2tdO1xuICAgICAgICAgICAgICAgICAgICBoZWxwZXJDYWNoZVtwbHVnaW5dWydwYXJhbWV0ZXJzJ11bcGFyYW1Ob2RlLmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgTWFuYWdlci5IRUxQRVJTX0NBQ0hFID0gaGVscGVyQ2FjaGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hbmFnZXIuSEVMUEVSU19DQUNIRTtcbiAgICB9O1xuXG4gICAgTWFuYWdlci5wYXJzZVBhcmFtZXRlcnMgPSBmdW5jdGlvbiBwYXJzZVBhcmFtZXRlcnMoeG1sRG9jdW1lbnQsIHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBYTUxVdGlscy5YUGF0aFNlbGVjdE5vZGVzKHhtbERvY3VtZW50LCBxdWVyeSkubWFwKChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIE1hbmFnZXIucGFyYW1ldGVyTm9kZVRvSGFzaChub2RlKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSk7XG4gICAgfTtcblxuICAgIE1hbmFnZXIucGFyYW1ldGVyTm9kZVRvSGFzaCA9IGZ1bmN0aW9uIHBhcmFtZXRlck5vZGVUb0hhc2gocGFyYW1Ob2RlKSB7XG4gICAgICAgIHZhciBwYXJhbXNBdHRzID0gcGFyYW1Ob2RlLmF0dHJpYnV0ZXM7XG4gICAgICAgIHZhciBwYXJhbXNPYmplY3QgPSB7fTtcbiAgICAgICAgaWYgKHBhcmFtTm9kZS5wYXJlbnROb2RlICYmIHBhcmFtTm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUgJiYgcGFyYW1Ob2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHBhcmFtc09iamVjdFtcInBsdWdpbklkXCJdID0gcGFyYW1Ob2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29sbGVjdENkYXRhID0gZmFsc2U7XG4gICAgICAgIHZhciBNZXNzYWdlSGFzaCA9IGdsb2JhbC5weWRpby5NZXNzYWdlSGFzaDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtc0F0dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhdHROYW1lID0gcGFyYW1zQXR0cy5pdGVtKGkpLm5vZGVOYW1lO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1zQXR0cy5pdGVtKGkpLnZhbHVlO1xuICAgICAgICAgICAgaWYgKChhdHROYW1lID09PSBcImxhYmVsXCIgfHwgYXR0TmFtZSA9PT0gXCJkZXNjcmlwdGlvblwiIHx8IGF0dE5hbWUgPT09IFwiZ3JvdXBcIiB8fCBhdHROYW1lLmluZGV4T2YoXCJncm91cF9zd2l0Y2hfXCIpID09PSAwKSAmJiBNZXNzYWdlSGFzaFt2YWx1ZV0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1lc3NhZ2VIYXNoW3ZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdHROYW1lID09PSBcImNkYXRhdmFsdWVcIikge1xuICAgICAgICAgICAgICAgIGNvbGxlY3RDZGF0YSA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJhbXNPYmplY3RbYXR0TmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdENkYXRhKSB7XG4gICAgICAgICAgICBwYXJhbXNPYmplY3RbJ3ZhbHVlJ10gPSBwYXJhbU5vZGUuZmlyc3RDaGlsZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zT2JqZWN0Wyd0eXBlJ10gPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgaWYgKHBhcmFtc09iamVjdFsndmFsdWUnXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zT2JqZWN0Wyd2YWx1ZSddID0gcGFyYW1zT2JqZWN0Wyd2YWx1ZSddID09PSBcInRydWVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbXNPYmplY3RbJ2RlZmF1bHQnXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zT2JqZWN0WydkZWZhdWx0J10gPSBwYXJhbXNPYmplY3RbJ2RlZmF1bHQnXSA9PT0gXCJ0cnVlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zT2JqZWN0Wyd0eXBlJ10gPT09ICdpbnRlZ2VyJykge1xuICAgICAgICAgICAgaWYgKHBhcmFtc09iamVjdFsndmFsdWUnXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zT2JqZWN0Wyd2YWx1ZSddID0gcGFyc2VJbnQocGFyYW1zT2JqZWN0Wyd2YWx1ZSddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbXNPYmplY3RbJ2RlZmF1bHQnXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zT2JqZWN0WydkZWZhdWx0J10gPSBwYXJzZUludChwYXJhbXNPYmplY3RbJ2RlZmF1bHQnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcmFtc09iamVjdDtcbiAgICB9O1xuXG4gICAgTWFuYWdlci5jcmVhdGVGb3JtRWxlbWVudCA9IGZ1bmN0aW9uIGNyZWF0ZUZvcm1FbGVtZW50KHByb3BzKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgc3dpdGNoIChwcm9wcy5hdHRyaWJ1dGVzWyd0eXBlJ10pIHtcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dEJvb2xlYW4sIHByb3BzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgICAgICBjYXNlICdwYXNzd29yZCc6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBSZWFjdC5jcmVhdGVFbGVtZW50KElucHV0VGV4dCwgcHJvcHMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndmFsaWQtcGFzc3dvcmQnOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gUmVhY3QuY3JlYXRlRWxlbWVudChWYWxpZFBhc3N3b3JkLCBwcm9wcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd2YWxpZC1sb2dpbic6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBSZWFjdC5jcmVhdGVFbGVtZW50KF9maWVsZHNWYWxpZExvZ2luMlsnZGVmYXVsdCddLCBwcm9wcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXRJbnRlZ2VyLCBwcm9wcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdidXR0b24nOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dEJ1dHRvbiwgcHJvcHMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW9uaXRvcic6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBSZWFjdC5jcmVhdGVFbGVtZW50KE1vbml0b3JpbmdMYWJlbCwgcHJvcHMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaW1hZ2UnOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dEltYWdlLCBwcm9wcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gUmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3RCb3gsIHByb3BzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2F1dG9jb21wbGV0ZSc6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBSZWFjdC5jcmVhdGVFbGVtZW50KEF1dG9jb21wbGV0ZUJveCwgcHJvcHMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXV0b2NvbXBsZXRlLXRyZWUnOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gUmVhY3QuY3JlYXRlRWxlbWVudChBdXRvY29tcGxldGVUcmVlLCBwcm9wcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsZWdlbmQnOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2hpZGRlbic6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAocHJvcHMudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBwcm9wcy52YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3BhcmFtVmFsdWUtZW1wdHknIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnRW1wdHknXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgTWFuYWdlci5TbGFzaGVzVG9Kc29uID0gZnVuY3Rpb24gU2xhc2hlc1RvSnNvbih2YWx1ZXMpIHtcbiAgICAgICAgaWYgKHZhbHVlcyA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB2YWx1ZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZXdWYWx1ZXMgPSB7fTtcbiAgICAgICAgdmFyIHJlY3Vyc2VPbktleXMgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXModmFsdWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHZhbHVlc1trXTtcbiAgICAgICAgICAgIGlmIChrLmluZGV4T2YoJy8nKSA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSBrLnNwbGl0KCcvJyk7XG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0UGFydCA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RQYXJ0ID0gcGFydHMuam9pbignLycpO1xuICAgICAgICAgICAgICAgIGlmICghbmV3VmFsdWVzW2ZpcnN0UGFydF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVzW2ZpcnN0UGFydF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBuZXdWYWx1ZXNbZmlyc3RQYXJ0XSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVzW2ZpcnN0UGFydF0gPSB7ICdAdmFsdWUnOiBuZXdWYWx1ZXNbZmlyc3RQYXJ0XSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuZXdWYWx1ZXNbZmlyc3RQYXJ0XVtsYXN0UGFydF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJlY3Vyc2VPbktleXNbZmlyc3RQYXJ0XSA9IGZpcnN0UGFydDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlc1trXSAmJiB0eXBlb2YgbmV3VmFsdWVzW2tdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZXNba11bJ0B2YWx1ZSddID0gZGF0YTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZXNba10gPSBkYXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5rZXlzKHJlY3Vyc2VPbktleXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBuZXdWYWx1ZXNba2V5XSA9IE1hbmFnZXIuU2xhc2hlc1RvSnNvbihuZXdWYWx1ZXNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3VmFsdWVzO1xuICAgIH07XG5cbiAgICBNYW5hZ2VyLkpzb25Ub1NsYXNoZXMgPSBmdW5jdGlvbiBKc29uVG9TbGFzaGVzKHZhbHVlcykge1xuICAgICAgICB2YXIgcHJlZml4ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gJycgOiBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgdmFyIG5ld1ZhbHVlcyA9IHt9O1xuICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZXMpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWVzW2tdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHZhciBzdWJWYWx1ZXMgPSBNYW5hZ2VyLkpzb25Ub1NsYXNoZXModmFsdWVzW2tdLCBwcmVmaXggKyBrICsgJy8nKTtcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZXMgPSBfZXh0ZW5kcyh7fSwgbmV3VmFsdWVzLCBzdWJWYWx1ZXMpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXNba11bJ0B2YWx1ZSddKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlc1twcmVmaXggKyBrXSA9IHZhbHVlc1trXVsnQHZhbHVlJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZXNbcHJlZml4ICsga10gPSB2YWx1ZXNba107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3VmFsdWVzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEV4dHJhY3QgUE9TVC1yZWFkeSB2YWx1ZXMgZnJvbSBhIGNvbWJvIHBhcmFtZXRlcnMvdmFsdWVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGVmaW5pdGlvbnMgQXJyYXkgU3RhbmRhcmQgRm9ybSBEZWZpbml0aW9uIGFycmF5XG4gICAgICogQHBhcmFtIHZhbHVlcyBPYmplY3QgS2V5L1ZhbHVlcyBvZiB0aGUgY3VycmVudCBmb3JtXG4gICAgICogQHBhcmFtIHByZWZpeCBTdHJpbmcgT3B0aW9uYWwgcHJlZml4IHRvIGFkZCB0byBhbGwgcGFyYW1ldGVycyAoYnkgZGVmYXVsdCBEUklWRVJfT1BUSU9OXykuXG4gICAgICogQHJldHVybnMgT2JqZWN0IE9iamVjdCB3aXRoIGFsbCBweWRpby1jb21wYXRpYmxlIFBPU1QgcGFyYW1ldGVyc1xuICAgICAqL1xuXG4gICAgTWFuYWdlci5nZXRWYWx1ZXNGb3JQT1NUID0gZnVuY3Rpb24gZ2V0VmFsdWVzRm9yUE9TVChkZWZpbml0aW9ucywgdmFsdWVzKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyAnRFJJVkVSX09QVElPTl8nIDogYXJndW1lbnRzWzJdO1xuICAgICAgICB2YXIgYWRkaXRpb25hbE1ldGFkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA8PSAzIHx8IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1szXTtcblxuICAgICAgICB2YXIgY2xpZW50UGFyYW1zID0ge307XG4gICAgICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNsaWVudFBhcmFtc1twcmVmaXggKyBrZXldID0gdmFsdWVzW2tleV07XG4gICAgICAgICAgICAgICAgdmFyIGRlZlR5cGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGVmaW5pdGlvbnMubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmluaXRpb25zW2RdWyduYW1lJ10gPT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZUeXBlID0gZGVmaW5pdGlvbnNbZF1bJ3R5cGUnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZGVmVHlwZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IGtleS5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdCwgcHJldjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3QgPSBwYXJ0cy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXYgPSBwYXJ0cy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGRlZmluaXRpb25zLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGFzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmluaXRpb25zW2tdWyduYW1lJ10gPT0gbGFzdCAmJiBkZWZpbml0aW9uc1trXVsnZ3JvdXBfc3dpdGNoX25hbWUnXSAmJiBkZWZpbml0aW9uc1trXVsnZ3JvdXBfc3dpdGNoX25hbWUnXSA9PSBwcmV2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZlR5cGUgPSBkZWZpbml0aW9uc1trXVsndHlwZSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZpbml0aW9uc1trXVsnbmFtZSddID09IGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZUeXBlID0gZGVmaW5pdGlvbnNba11bJ3R5cGUnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vZGVmaW5pdGlvbnMubWFwKGZ1bmN0aW9uKGQpe2lmKGQubmFtZSA9PSB0aGVLZXkpIGRlZlR5cGUgPSBkLnR5cGV9KTtcbiAgICAgICAgICAgICAgICBpZiAoZGVmVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVmVHlwZSA9PSBcImltYWdlXCIpIGRlZlR5cGUgPSBcImJpbmFyeVwiO1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRQYXJhbXNbcHJlZml4ICsga2V5ICsgJ19hanhwdHlwZSddID0gZGVmVHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFkZGl0aW9uYWxNZXRhZGF0YSAmJiBhZGRpdGlvbmFsTWV0YWRhdGFba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtZXRhIGluIGFkZGl0aW9uYWxNZXRhZGF0YVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWRkaXRpb25hbE1ldGFkYXRhW2tleV0uaGFzT3duUHJvcGVydHkobWV0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRQYXJhbXNbcHJlZml4ICsga2V5ICsgJ18nICsgbWV0YV0gPSBhZGRpdGlvbmFsTWV0YWRhdGFba2V5XVttZXRhXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlb3JkZXIgdHJlZSBrZXlzXG4gICAgICAgIHZhciBhbGxLZXlzID0gT2JqZWN0LmtleXMoY2xpZW50UGFyYW1zKTtcbiAgICAgICAgYWxsS2V5cy5zb3J0KCk7XG4gICAgICAgIGFsbEtleXMucmV2ZXJzZSgpO1xuICAgICAgICB2YXIgdHJlZUtleXMgPSB7fTtcbiAgICAgICAgYWxsS2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKFwiL1wiKSA9PT0gLTEpIHJldHVybjtcbiAgICAgICAgICAgIGlmIChrZXkuZW5kc1dpdGgoXCJfYWp4cHR5cGVcIikpIHJldHVybjtcbiAgICAgICAgICAgIHZhciB0eXBlS2V5ID0ga2V5ICsgXCJfYWp4cHR5cGVcIjtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IGtleS5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICB2YXIgcGFyZW50TmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgICAgICAgICB2YXIgcGFyZW50S2V5O1xuICAgICAgICAgICAgd2hpbGUgKHBhcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudEtleSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRLZXkgPSB0cmVlS2V5cztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFwYXJlbnRLZXlbcGFyZW50TmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50S2V5W3BhcmVudE5hbWVdID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhcmVudEtleSA9IHBhcmVudEtleVtwYXJlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBwYXJlbnROYW1lID0gcGFydHMuc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0eXBlID0gY2xpZW50UGFyYW1zW3R5cGVLZXldO1xuICAgICAgICAgICAgZGVsZXRlIGNsaWVudFBhcmFtc1t0eXBlS2V5XTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRLZXkgJiYgIXBhcmVudEtleVtwYXJlbnROYW1lXSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2ID0gY2xpZW50UGFyYW1zW2tleV07XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEtleVtwYXJlbnROYW1lXSA9IHYgPT0gXCJ0cnVlXCIgfHwgdiA9PSAxIHx8IHYgPT09IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiaW50ZWdlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEtleVtwYXJlbnROYW1lXSA9IHBhcnNlSW50KGNsaWVudFBhcmFtc1trZXldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgJiYgdHlwZS5zdGFydHNXaXRoKFwiZ3JvdXBfc3dpdGNoOlwiKSAmJiB0eXBlb2YgY2xpZW50UGFyYW1zW2tleV0gPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRLZXlbcGFyZW50TmFtZV0gPSB7IGdyb3VwX3N3aXRjaF92YWx1ZTogY2xpZW50UGFyYW1zW2tleV0gfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRLZXlbcGFyZW50TmFtZV0gPSBjbGllbnRQYXJhbXNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmVudEtleSAmJiB0eXBlICYmIHR5cGUuc3RhcnRzV2l0aCgnZ3JvdXBfc3dpdGNoOicpKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50S2V5W3BhcmVudE5hbWVdW1wiZ3JvdXBfc3dpdGNoX3ZhbHVlXCJdID0gY2xpZW50UGFyYW1zW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgY2xpZW50UGFyYW1zW2tleV07XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKGtleSBpbiB0cmVlS2V5cykge1xuICAgICAgICAgICAgaWYgKCF0cmVlS2V5cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcbiAgICAgICAgICAgIHZhciB0cmVlVmFsdWUgPSB0cmVlS2V5c1trZXldO1xuICAgICAgICAgICAgaWYgKGNsaWVudFBhcmFtc1trZXkgKyAnX2FqeHB0eXBlJ10gJiYgY2xpZW50UGFyYW1zW2tleSArICdfYWp4cHR5cGUnXS5pbmRleE9mKCdncm91cF9zd2l0Y2g6JykgPT09IDAgJiYgIXRyZWVWYWx1ZVsnZ3JvdXBfc3dpdGNoX3ZhbHVlJ10pIHtcbiAgICAgICAgICAgICAgICB0cmVlVmFsdWVbJ2dyb3VwX3N3aXRjaF92YWx1ZSddID0gY2xpZW50UGFyYW1zW2tleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNsaWVudFBhcmFtc1trZXldID0gSlNPTi5zdHJpbmdpZnkodHJlZVZhbHVlKTtcbiAgICAgICAgICAgIGNsaWVudFBhcmFtc1trZXkgKyAnX2FqeHB0eXBlJ10gPSBcInRleHQvanNvblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2xlYW4gWFhYX2dyb3VwX3N3aXRjaCBwYXJhbWV0ZXJzXG4gICAgICAgIGZvciAodmFyIHRoZUtleSBpbiBjbGllbnRQYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICghY2xpZW50UGFyYW1zLmhhc093blByb3BlcnR5KHRoZUtleSkpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAodGhlS2V5LmluZGV4T2YoXCIvXCIpID09IC0xICYmIGNsaWVudFBhcmFtc1t0aGVLZXldICYmIGNsaWVudFBhcmFtc1t0aGVLZXkgKyBcIl9hanhwdHlwZVwiXSAmJiBjbGllbnRQYXJhbXNbdGhlS2V5ICsgXCJfYWp4cHR5cGVcIl0uc3RhcnRzV2l0aChcImdyb3VwX3N3aXRjaDpcIikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNsaWVudFBhcmFtc1t0aGVLZXldID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50UGFyYW1zW3RoZUtleV0gPSBKU09OLnN0cmluZ2lmeSh7IGdyb3VwX3N3aXRjaF92YWx1ZTogY2xpZW50UGFyYW1zW3RoZUtleV0gfSk7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudFBhcmFtc1t0aGVLZXkgKyBcIl9hanhwdHlwZVwiXSA9IFwidGV4dC9qc29uXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNsaWVudFBhcmFtcy5oYXNPd25Qcm9wZXJ0eSh0aGVLZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoZUtleS5lbmRzV2l0aChcIl9ncm91cF9zd2l0Y2hcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNsaWVudFBhcmFtc1t0aGVLZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbGllbnRQYXJhbXM7XG4gICAgfTtcblxuICAgIHJldHVybiBNYW5hZ2VyO1xufSkoKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gTWFuYWdlcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFBhdGhVdGlscyA9IHJlcXVpcmUoJ3B5ZGlvL3V0aWwvcGF0aCcpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSB7XG5cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgYXR0cmlidXRlczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgICBhcHBseUJ1dHRvbkFjdGlvbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGFjdGlvbkNhbGxiYWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICAgIH0sXG5cbiAgICBhcHBseUFjdGlvbjogZnVuY3Rpb24gYXBwbHlBY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNob2ljZXNWYWx1ZSA9IHRoaXMucHJvcHMuYXR0cmlidXRlc1snY2hvaWNlcyddLnNwbGl0KFwiOlwiKTtcbiAgICAgICAgdmFyIGZpcnN0UGFydCA9IGNob2ljZXNWYWx1ZS5zaGlmdCgpO1xuICAgICAgICBpZiAoZmlyc3RQYXJ0ID09PSBcInJ1bl9jbGllbnRfYWN0aW9uXCIgJiYgZ2xvYmFsLnB5ZGlvKSB7XG4gICAgICAgICAgICBnbG9iYWwucHlkaW8uZ2V0Q29udHJvbGxlcigpLmZpcmVBY3Rpb24oY2hvaWNlc1ZhbHVlLnNoaWZ0KCkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmFwcGx5QnV0dG9uQWN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1ldGVycyA9IHsgYWN0aW9uOiBmaXJzdFBhcnQgfTtcbiAgICAgICAgICAgIGlmIChjaG9pY2VzVmFsdWUubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnNbJ2FjdGlvbl9wbHVnaW5faWQnXSA9IGNob2ljZXNWYWx1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnNbJ2FjdGlvbl9wbHVnaW5fbWV0aG9kJ10gPSBjaG9pY2VzVmFsdWUuc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmF0dHJpYnV0ZXNbJ25hbWUnXS5pbmRleE9mKFwiL1wiKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzWydidXR0b25fa2V5J10gPSBQYXRoVXRpbHMuZ2V0RGlybmFtZSh0aGlzLnByb3BzLmF0dHJpYnV0ZXNbJ25hbWUnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb3BzLmFwcGx5QnV0dG9uQWN0aW9uKHBhcmFtZXRlcnMsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cblxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgQ29tcG9uZW50ID0gX3JlcXVpcmUuQ29tcG9uZW50O1xuXG52YXIgX3JlcXVpcmUkcmVxdWlyZUxpYiA9IHJlcXVpcmUoJ3B5ZGlvJykucmVxdWlyZUxpYignYm9vdCcpO1xuXG52YXIgUHlkaW9Db250ZXh0Q29uc3VtZXIgPSBfcmVxdWlyZSRyZXF1aXJlTGliLlB5ZGlvQ29udGV4dENvbnN1bWVyO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoUHlkaW9Db21wb25lbnQpIHtcbiAgICB2YXIgRmllbGRXaXRoQ2hvaWNlcyA9IChmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICAgICAgICBfaW5oZXJpdHMoRmllbGRXaXRoQ2hvaWNlcywgX0NvbXBvbmVudCk7XG5cbiAgICAgICAgRmllbGRXaXRoQ2hvaWNlcy5wcm90b3R5cGUubG9hZEV4dGVybmFsVmFsdWVzID0gZnVuY3Rpb24gbG9hZEV4dGVybmFsVmFsdWVzKGNob2ljZXMpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBweWRpbyA9IHRoaXMucHJvcHMucHlkaW87XG5cbiAgICAgICAgICAgIHZhciBwYXJzZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgbGlzdF9hY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoY2hvaWNlcyBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uQ2hvaWNlc0xvYWRlZCkgdGhpcy5vbkNob2ljZXNMb2FkZWQoY2hvaWNlcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY2hvaWNlczogY2hvaWNlcywgcGFyc2VkOiBwYXJzZWQgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG91dHB1dCA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGlmIChjaG9pY2VzLmluZGV4T2YoJ2pzb25fZmlsZTonKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHBhcnNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxpc3RfYWN0aW9uID0gY2hvaWNlcy5yZXBsYWNlKCdqc29uX2ZpbGU6JywgJycpO1xuICAgICAgICAgICAgICAgIG91dHB1dC5zZXQoJzAnLCBweWRpby5NZXNzYWdlSGFzaFsnYWp4cF9hZG1pbi5ob21lLjYnXSk7XG4gICAgICAgICAgICAgICAgUHlkaW9BcGkuZ2V0Q2xpZW50KCkubG9hZEZpbGUobGlzdF9hY3Rpb24sIGZ1bmN0aW9uICh0cmFuc3BvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld091dHB1dCA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zcG9ydC5yZXNwb25zZUpTT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zcG9ydC5yZXNwb25zZUpTT04uZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPdXRwdXQuc2V0KGVudHJ5LmtleSwgZW50cnkubGFiZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHJhbnNwb3J0LnJlc3BvbnNlVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU09OLnBhcnNlKHRyYW5zcG9ydC5yZXNwb25zZVRleHQpLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld091dHB1dC5zZXQoZW50cnkua2V5LCBlbnRyeS5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIHBhcnNpbmcgbGlzdCAnICsgY2hvaWNlcywgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0U3RhdGUoeyBjaG9pY2VzOiBuZXdPdXRwdXQgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLm9uQ2hvaWNlc0xvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLm9uQ2hvaWNlc0xvYWRlZChuZXdPdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hvaWNlcyA9PT0gXCJQWURJT19BVkFJTEFCTEVfTEFOR1VBR0VTXCIpIHtcbiAgICAgICAgICAgICAgICBweWRpby5saXN0TGFuZ3VhZ2VzV2l0aENhbGxiYWNrKGZ1bmN0aW9uIChrZXksIGxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5zZXQoa2V5LCBsYWJlbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25DaG9pY2VzTG9hZGVkKSB0aGlzLm9uQ2hvaWNlc0xvYWRlZChvdXRwdXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaG9pY2VzID09PSBcIlBZRElPX0FWQUlMQUJMRV9SRVBPU0lUT1JJRVNcIikge1xuICAgICAgICAgICAgICAgIGlmIChweWRpby51c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc29ydGVyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBweWRpby51c2VyLnJlcG9zaXRvcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChyZXBvc2l0b3J5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcG9zaXRvcnkuZ2V0UmVwb3NpdG9yeVR5cGUoKSAhPT0gXCJjZWxsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc29ydGVyLnB1c2goeyBpZDogcmVwb3NpdG9yeS5nZXRJZCgpLCBsYWJlbDogcmVwb3NpdG9yeS5nZXRMYWJlbCgpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL291dHB1dC5zZXQocmVwb3NpdG9yeS5nZXRJZCgpLCByZXBvc2l0b3J5LmdldExhYmVsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ydGVyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5sYWJlbCA+IGIubGFiZWwgPyAxIDogLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlci5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dC5zZXQoZC5pZCwgZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25DaG9pY2VzTG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaG9pY2VzTG9hZGVkKG91dHB1dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBQYXJzZSBzdHJpbmcgYW5kIHJldHVybiBtYXBcbiAgICAgICAgICAgICAgICBjaG9pY2VzLnNwbGl0KFwiLFwiKS5tYXAoZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBjaG9pY2Uuc3BsaXQoJ3wnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGwubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBsWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSBsWzFdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBsYWJlbCA9IGNob2ljZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsLnB5ZGlvLk1lc3NhZ2VIYXNoW2xhYmVsXSkgbGFiZWwgPSBnbG9iYWwucHlkaW8uTWVzc2FnZUhhc2hbbGFiZWxdO1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuc2V0KHZhbHVlLCBsYWJlbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBjaG9pY2VzOiBvdXRwdXQsIHBhcnNlZDogcGFyc2VkIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gRmllbGRXaXRoQ2hvaWNlcyhwcm9wcywgY29udGV4dCkge1xuICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZpZWxkV2l0aENob2ljZXMpO1xuXG4gICAgICAgICAgICBfQ29tcG9uZW50LmNhbGwodGhpcywgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgdmFyIGNob2ljZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBjaG9pY2VzLnNldCgnMCcsIHRoaXMucHJvcHMucHlkaW8gPyB0aGlzLnByb3BzLnB5ZGlvLk1lc3NhZ2VIYXNoWydhanhwX2FkbWluLmhvbWUuNiddIDogJyAuLi4gJyk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0geyBjaG9pY2VzOiBjaG9pY2VzLCBjaG9pY2VzUGFyc2VkOiBmYWxzZSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgRmllbGRXaXRoQ2hvaWNlcy5wcm90b3R5cGUuY29tcG9uZW50RGlkTW91bnQgPSBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmF0dHJpYnV0ZXNbJ2Nob2ljZXMnXSkge1xuICAgICAgICAgICAgICAgIHZhciBfbG9hZEV4dGVybmFsVmFsdWVzID0gdGhpcy5sb2FkRXh0ZXJuYWxWYWx1ZXModGhpcy5wcm9wcy5hdHRyaWJ1dGVzWydjaG9pY2VzJ10pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNob2ljZXMgPSBfbG9hZEV4dGVybmFsVmFsdWVzLmNob2ljZXM7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlZCA9IF9sb2FkRXh0ZXJuYWxWYWx1ZXMucGFyc2VkO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNob2ljZXM6IGNob2ljZXMsIGNob2ljZXNQYXJzZWQ6IHBhcnNlZCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBGaWVsZFdpdGhDaG9pY2VzLnByb3RvdHlwZS5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzID0gZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xuICAgICAgICAgICAgaWYgKG5ld1Byb3BzLmF0dHJpYnV0ZXNbJ2Nob2ljZXMnXSAmJiBuZXdQcm9wcy5hdHRyaWJ1dGVzWydjaG9pY2VzJ10gIT09IHRoaXMucHJvcHMuYXR0cmlidXRlc1snY2hvaWNlcyddKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9sb2FkRXh0ZXJuYWxWYWx1ZXMyID0gdGhpcy5sb2FkRXh0ZXJuYWxWYWx1ZXMobmV3UHJvcHMuYXR0cmlidXRlc1snY2hvaWNlcyddKTtcblxuICAgICAgICAgICAgICAgIHZhciBjaG9pY2VzID0gX2xvYWRFeHRlcm5hbFZhbHVlczIuY2hvaWNlcztcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VkID0gX2xvYWRFeHRlcm5hbFZhbHVlczIucGFyc2VkO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGNob2ljZXM6IGNob2ljZXMsXG4gICAgICAgICAgICAgICAgICAgIGNob2ljZXNQYXJzZWQ6IHBhcnNlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIEZpZWxkV2l0aENob2ljZXMucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFB5ZGlvQ29tcG9uZW50LCBfZXh0ZW5kcyh7fSwgdGhpcy5wcm9wcywgdGhpcy5zdGF0ZSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBGaWVsZFdpdGhDaG9pY2VzO1xuICAgIH0pKENvbXBvbmVudCk7XG5cbiAgICBGaWVsZFdpdGhDaG9pY2VzID0gUHlkaW9Db250ZXh0Q29uc3VtZXIoRmllbGRXaXRoQ2hvaWNlcyk7XG5cbiAgICByZXR1cm4gRmllbGRXaXRoQ2hvaWNlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFB5ZGlvQXBpID0gcmVxdWlyZSgncHlkaW8vaHR0cC9hcGknKTtcbi8qKlxuICogUmVhY3QgTWl4aW4gZm9yIEZvcm0gRWxlbWVudFxuICovXG5leHBvcnRzWydkZWZhdWx0J10gPSB7XG5cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgYXR0cmlidXRlczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAgICAgZGlzcGxheUNvbnRleHQ6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbJ2Zvcm0nLCAnZ3JpZCddKSxcbiAgICAgICAgZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgICAgICBtdWx0aXBsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYW55LFxuICAgICAgICBvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2hhbmdlRWRpdE1vZGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBiaW5hcnlfY29udGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgZXJyb3JUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGlzcGxheUNvbnRleHQ6ICdmb3JtJyxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBpc0Rpc3BsYXlHcmlkOiBmdW5jdGlvbiBpc0Rpc3BsYXlHcmlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNwbGF5Q29udGV4dCA9PSAnZ3JpZCc7XG4gICAgfSxcblxuICAgIGlzRGlzcGxheUZvcm06IGZ1bmN0aW9uIGlzRGlzcGxheUZvcm0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmRpc3BsYXlDb250ZXh0ID09ICdmb3JtJztcbiAgICB9LFxuXG4gICAgdG9nZ2xlRWRpdE1vZGU6IGZ1bmN0aW9uIHRvZ2dsZUVkaXRNb2RlKCkge1xuICAgICAgICBpZiAodGhpcy5pc0Rpc3BsYXlGb3JtKCkpIHJldHVybjtcbiAgICAgICAgdmFyIG5ld1N0YXRlID0gIXRoaXMuc3RhdGUuZWRpdE1vZGU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0TW9kZTogbmV3U3RhdGUgfSk7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlRWRpdE1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VFZGl0TW9kZShuZXdTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZW50ZXJUb1RvZ2dsZTogZnVuY3Rpb24gZW50ZXJUb1RvZ2dsZShldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlRWRpdE1vZGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBidWZmZXJDaGFuZ2VzOiBmdW5jdGlvbiBidWZmZXJDaGFuZ2VzKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICB0aGlzLnRyaWdnZXJQcm9wc09uQ2hhbmdlKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgfSxcblxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiBvbkNoYW5nZShldmVudCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRWYWx1ZSA/IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0VmFsdWUoKSA6IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hhbmdlVGltZW91dCkge1xuICAgICAgICAgICAgZ2xvYmFsLmNsZWFyVGltZW91dCh0aGlzLmNoYW5nZVRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IHZhbHVlLFxuICAgICAgICAgICAgb2xkVmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5za2lwQnVmZmVyQ2hhbmdlcykge1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyUHJvcHNPbkNoYW5nZShuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgZGlydHk6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogbmV3VmFsdWVcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5za2lwQnVmZmVyQ2hhbmdlcykge1xuICAgICAgICAgICAgdmFyIHRpbWVyTGVuZ3RoID0gMjUwO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuYXR0cmlidXRlc1sndHlwZSddID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgICAgICAgdGltZXJMZW5ndGggPSAxMjAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VUaW1lb3V0ID0gZ2xvYmFsLnNldFRpbWVvdXQoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckNoYW5nZXMobmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgIH0pLmJpbmQodGhpcyksIHRpbWVyTGVuZ3RoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0cmlnZ2VyUHJvcHNPbkNoYW5nZTogZnVuY3Rpb24gdHJpZ2dlclByb3BzT25DaGFuZ2UobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmF0dHJpYnV0ZXNbJ3R5cGUnXSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVFZGl0TW9kZSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShuZXdWYWx1ZSwgb2xkVmFsdWUsIHsgdHlwZTogdGhpcy5wcm9wcy5hdHRyaWJ1dGVzWyd0eXBlJ10gfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHZhbHVlOiBuZXdQcm9wcy52YWx1ZSxcbiAgICAgICAgICAgIGRpcnR5OiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlZGl0TW9kZTogZmFsc2UsXG4gICAgICAgICAgICBkaXJ0eTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5wcm9wcy52YWx1ZVxuICAgICAgICB9O1xuICAgIH1cblxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuLyoqXG4gKiBSZWFjdCBNaXhpbiBmb3IgdGhlIGZvcm0gaGVscGVyIDogZGVmYXVsdCBwcm9wZXJ0aWVzIHRoYXRcbiAqIGhlbHBlcnMgY2FuIHJlY2VpdmVcbiAqL1xuZXhwb3J0c1snZGVmYXVsdCddID0ge1xuICBwcm9wVHlwZXM6IHtcbiAgICBwYXJhbU5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgcGFyYW1BdHRyaWJ1dGVzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIHZhbHVlczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICB1cGRhdGVDYWxsYmFjazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tYW5hZ2VyTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXIvTWFuYWdlcicpO1xuXG52YXIgX21hbmFnZXJNYW5hZ2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hbmFnZXJNYW5hZ2VyKTtcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZXF1aXJlJHJlcXVpcmVMaWIgPSByZXF1aXJlKCdweWRpbycpLnJlcXVpcmVMaWIoJ2Jvb3QnKTtcblxudmFyIEFzeW5jQ29tcG9uZW50ID0gX3JlcXVpcmUkcmVxdWlyZUxpYi5Bc3luY0NvbXBvbmVudDtcblxuLyoqXG4gKiBEaXNwbGF5IGEgZm9ybSBjb21wYW5pb24gbGlua2VkIHRvIGEgZ2l2ZW4gaW5wdXQuXG4gKiBQcm9wczogaGVscGVyRGF0YSA6IGNvbnRhaW5zIHRoZSBwbHVnaW5JZCBhbmQgdGhlIHdob2xlIHBhcmFtQXR0cmlidXRlc1xuICovXG5leHBvcnRzWydkZWZhdWx0J10gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdGb3JtSGVscGVyJyxcblxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBoZWxwZXJEYXRhOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICBjbG9zZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICAgIH0sXG5cbiAgICBjbG9zZUhlbHBlcjogZnVuY3Rpb24gY2xvc2VIZWxwZXIoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2xvc2UoKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHZhciBoZWxwZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmhlbHBlckRhdGEpIHtcbiAgICAgICAgICAgIHZhciBoZWxwZXJzQ2FjaGUgPSBfbWFuYWdlck1hbmFnZXIyWydkZWZhdWx0J10uZ2V0SGVscGVyc0NhY2hlKCk7XG4gICAgICAgICAgICB2YXIgcGx1Z2luSGVscGVyTmFtZXNwYWNlID0gaGVscGVyc0NhY2hlW3RoaXMucHJvcHMuaGVscGVyRGF0YVsncGx1Z2luSWQnXV1bJ25hbWVzcGFjZSddO1xuICAgICAgICAgICAgaGVscGVyID0gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2hlbHBlci10aXRsZScgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiAnaGVscGVyLWNsb3NlIG1kaSBtZGktY2xvc2UnLCBvbkNsaWNrOiB0aGlzLmNsb3NlSGVscGVyIH0pLFxuICAgICAgICAgICAgICAgICAgICAnUHlkaW8gQ29tcGFuaW9uJ1xuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnaGVscGVyLWNvbnRlbnQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXN5bmNDb21wb25lbnQsIF9leHRlbmRzKHt9LCB0aGlzLnByb3BzLmhlbHBlckRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogcGx1Z2luSGVscGVyTmFtZXNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50TmFtZTogJ0hlbHBlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbU5hbWU6IHRoaXMucHJvcHMuaGVscGVyRGF0YVsncGFyYW1BdHRyaWJ1dGVzJ11bJ25hbWUnXVxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3B5ZGlvLWZvcm0taGVscGVyJyArIChoZWxwZXIgPyAnIGhlbHBlci12aXNpYmxlJyA6ICcgaGVscGVyLWVtcHR5JyksIHN0eWxlOiB7IHpJbmRleDogMSB9IH0sXG4gICAgICAgICAgICBoZWxwZXJcbiAgICAgICAgKTtcbiAgICB9XG5cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3JlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9Hcm91cFN3aXRjaFBhbmVsID0gcmVxdWlyZSgnLi9Hcm91cFN3aXRjaFBhbmVsJyk7XG5cbnZhciBfR3JvdXBTd2l0Y2hQYW5lbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Hcm91cFN3aXRjaFBhbmVsKTtcblxudmFyIF9SZXBsaWNhdGlvblBhbmVsID0gcmVxdWlyZSgnLi9SZXBsaWNhdGlvblBhbmVsJyk7XG5cbnZhciBfUmVwbGljYXRpb25QYW5lbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9SZXBsaWNhdGlvblBhbmVsKTtcblxudmFyIF9tYW5hZ2VyTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXIvTWFuYWdlcicpO1xuXG52YXIgX21hbmFnZXJNYW5hZ2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hbmFnZXJNYW5hZ2VyKTtcblxudmFyIF9weWRpb1V0aWxMYW5nID0gcmVxdWlyZShcInB5ZGlvL3V0aWwvbGFuZ1wiKTtcblxudmFyIF9weWRpb1V0aWxMYW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3B5ZGlvVXRpbExhbmcpO1xuXG52YXIgX21hdGVyaWFsVWkgPSByZXF1aXJlKFwibWF0ZXJpYWwtdWlcIik7XG5cbi8qKlxuICogRm9ybSBQYW5lbCBpcyBhIHJlYWR5IHRvIHVzZSBmb3JtIGJ1aWxkZXIgaW5oZXJpdGVkIGZvciBQeWRpbydzIGxlZ2FjeSBwYXJhbWV0ZXJzIGZvcm1hdHMgKCdzdGFuZGFyZCBmb3JtJykuXG4gKiBJdCBpcyB2ZXJ5IHZlcnNhdGlsZSBhbmQgY2FuIGJhc2ljYWxseSB0YWtlIGEgc2V0IG9mIHBhcmFtZXRlcnMgZGVmaW5lZCBpbiB0aGUgWE1MIG1hbmlmZXN0cyAob3IgZGVmaW5lZCBtYW51YWxseVxuICogaW4gSlMpIGFuZCBkaXNwbGF5IHRoZW0gYXMgYSB1c2VyIGZvcm0uXG4gKiBJdCBpcyBhIGNvbnRyb2xsZWQgY29tcG9uZW50OiBpdCB0YWtlcyBhIHt2YWx1ZXN9IG9iamVjdCBhbmQgdHJpZ2dlcnMgYmFjayBhbiBvbkNoYW5nZSgpIGZ1bmN0aW9uLlxuICpcbiAqIFNlZSBhbHNvIE1hbmFnZXIgY2xhc3MgdG8gZ2V0IHNvbWUgdXRpbGl0YXJ5IGZ1bmN0aW9ucyB0byBwYXJzZSBwYXJhbWV0ZXJzIGFuZCBleHRyYWN0IHZhbHVlcyBmb3IgdGhlIGZvcm0uXG4gKi9cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdGb3JtUGFuZWwnLFxuXG4gICAgX2hpZGRlblZhbHVlczoge30sXG4gICAgX2ludGVybmFsVmFsaWQ6IG51bGwsXG4gICAgX3BhcmFtZXRlcnNNZXRhZGF0YTogbnVsbCxcblxuICAgIHByb3BUeXBlczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogQXJyYXkgb2YgUHlkaW8gU3RhbmRhcmRGb3JtIHBhcmFtZXRlcnNcbiAgICAgICAgICovXG4gICAgICAgIHBhcmFtZXRlcnM6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9iamVjdCBjb250YWluaW5nIHZhbHVlcyBmb3IgdGhlIHBhcmFtZXRlcnNcbiAgICAgICAgICovXG4gICAgICAgIHZhbHVlczogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmlnZ2VyIHVuaXRhcnkgZnVuY3Rpb24gd2hlbiBvbmUgZm9ybSBpbnB1dCBjaGFuZ2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgb25QYXJhbWV0ZXJDaGFuZ2U6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmQgYWxsIGZvcm0gdmFsdWVzIG9uY2hhbmdlLCBpbmNsdWRpbmcgZXZlbnR1YWxseSB0aGUgcmVtb3ZlZCBvbmVzIChmb3IgZHluYW1pYyBwYW5lbHMpXG4gICAgICAgICAqL1xuICAgICAgICBvbkNoYW5nZTogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuICAgICAgICAvKipcbiAgICAgICAgICogVHJpZ2dlcmVkIHdoZW4gdGhlIGZvcm0gZ2xvYmFiYWxseSBzd2l0Y2hlcyBiZXR3ZWVuIHZhbGlkIGFuZCBpbnZhbGlkIHN0YXRlXG4gICAgICAgICAqIFRyaWdnZXJlZCBvbmNlIGF0IGZvcm0gY29uc3RydWN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBvblZhbGlkU3RhdHVzQ2hhbmdlOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEaXNhYmxlIHRoZSB3aG9sZSBmb3JtIGF0IG9uY2VcbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGVkOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdHJpbmcgYWRkZWQgdG8gdGhlIGltYWdlIGlucHV0cyBmb3IgdXBsb2FkL2Rvd25sb2FkIG9wZXJhdGlvbnNcbiAgICAgICAgICovXG4gICAgICAgIGJpbmFyeV9jb250ZXh0OiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIDAgYnkgZGVmYXVsdCwgc3ViZm9ybXMgd2lsbCBoYXZlIHRoZWlyIHpEZXB0aCB2YWx1ZSBpbmNyZWFzZWQgYnkgb25lXG4gICAgICAgICAqL1xuICAgICAgICBkZXB0aDogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5udW1iZXIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBhbiBhZGRpdGlvbmFsIGhlYWRlciBjb21wb25lbnQgKGFkZGVkIGluc2lkZSBmaXJzdCBzdWJwYW5lbClcbiAgICAgICAgICovXG4gICAgICAgIGhlYWRlcjogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgYW4gYWRkaXRpb25hbCBmb290ZXIgY29tcG9uZW50IChhZGRlZCBpbnNpZGUgbGFzdCBzdWJwYW5lbClcbiAgICAgICAgICovXG4gICAgICAgIGZvb3RlcjogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgb3RoZXIgYXJiaXRyYXJ5IHBhbmVscywgZWl0aGVyIGF0IHRoZSB0b3Agb3IgdGhlIGJvdHRvbVxuICAgICAgICAgKi9cbiAgICAgICAgYWRkaXRpb25hbFBhbmVzOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgIHRvcDogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5hcnJheSxcbiAgICAgICAgICAgIGJvdHRvbTogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5hcnJheVxuICAgICAgICB9KSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGFycmF5IG9mIHRhYnMgY29udGFpbmluZyBncm91cE5hbWVzLiBHcm91cHMgd2lsbCBiZSBzcGxpdHRlZFxuICAgICAgICAgKiBhY2Nyb3NzIHRob3NlIHRhYnNcbiAgICAgICAgICovXG4gICAgICAgIHRhYnM6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaXJlZCB3aGVuIGEgdGhlIGFjdGl2ZSB0YWIgY2hhbmdlc1xuICAgICAgICAgKi9cbiAgICAgICAgb25UYWJDaGFuZ2U6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgYml0IGxpa2UgdGFicywgYnV0IHVzaW5nIGFjY29yZGlvbi1saWtlIGxheW91dFxuICAgICAgICAgKi9cbiAgICAgICAgYWNjb3JkaW9uaXplSWZHcm91cHNNb3JlVGhhbjogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGb3J3YXJkIGFuIGV2ZW50IHdoZW4gc2Nyb2xsaW5nIHRoZSBmb3JtXG4gICAgICAgICAqL1xuICAgICAgICBvblNjcm9sbENhbGxiYWNrOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXN0cmljdCB0byBhIHN1YnNldCBvZiBmaWVsZCBncm91cHNcbiAgICAgICAgICovXG4gICAgICAgIGxpbWl0VG9Hcm91cHM6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZ25vcmUgc29tZSBzcGVjaWZpYyBmaWVsZHMgdHlwZXNcbiAgICAgICAgICovXG4gICAgICAgIHNraXBGaWVsZHNUeXBlczogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5hcnJheSxcblxuICAgICAgICAvKiBIZWxwZXIgT3B0aW9ucyAqL1xuICAgICAgICAvKipcbiAgICAgICAgICogUGFzcyBwb2ludGVycyB0byB0aGUgUHlkaW8gQ29tcGFuaW9uIGNvbnRhaW5lclxuICAgICAgICAgKi9cbiAgICAgICAgc2V0SGVscGVyRGF0YTogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuICAgICAgICAvKipcbiAgICAgICAgICogRnVuY3Rpb24gdG8gY2hlY2sgaWYgdGhlIGNvbXBhbmlvbiBpcyBhY3RpdmUgb3Igbm9uZSBhbmQgaWYgYSBwYXJhbWV0ZXJcbiAgICAgICAgICogaGFzIGhlbHBlciBkYXRhXG4gICAgICAgICAqL1xuICAgICAgICBjaGVja0hhc0hlbHBlcjogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuICAgICAgICAvKipcbiAgICAgICAgICogVGVzdCBmb3IgcGFyYW1ldGVyXG4gICAgICAgICAqL1xuICAgICAgICBoZWxwZXJUZXN0Rm9yOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLnN0cmluZ1xuXG4gICAgfSxcblxuICAgIGV4dGVybmFsbHlTZWxlY3RUYWI6IGZ1bmN0aW9uIGV4dGVybmFsbHlTZWxlY3RUYWIoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRhYlNlbGVjdGVkSW5kZXg6IGluZGV4IH0pO1xuICAgIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25UYWJDaGFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHRhYlNlbGVjdGVkSW5kZXg6IDAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge307XG4gICAgfSxcblxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgICAgICByZXR1cm4geyBkZXB0aDogMCwgdmFsdWVzOiB7fSB9O1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XG4gICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShuZXdQcm9wcy5wYXJhbWV0ZXJzKSAhPT0gSlNPTi5zdHJpbmdpZnkodGhpcy5wcm9wcy5wYXJhbWV0ZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5faW50ZXJuYWxWYWxpZCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9oaWRkZW5WYWx1ZXMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuX3BhcmFtZXRlcnNNZXRhZGF0YSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdQcm9wcy52YWx1ZXMgJiYgbmV3UHJvcHMudmFsdWVzICE9PSB0aGlzLnByb3BzLnZhbHVlcykge1xuICAgICAgICAgICAgdGhpcy5jaGVja1ZhbGlkU3RhdHVzKG5ld1Byb3BzLnZhbHVlcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0VmFsdWVzOiBmdW5jdGlvbiBnZXRWYWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLnZhbHVlczsgLy9MYW5nVXRpbHMubWVyZ2VPYmplY3RzUmVjdXJzaXZlKHRoaXMuX2hpZGRlblZhbHVlcywgdGhpcy5wcm9wcy52YWx1ZXMpO1xuICAgIH0sXG5cbiAgICBvblBhcmFtZXRlckNoYW5nZTogZnVuY3Rpb24gb25QYXJhbWV0ZXJDaGFuZ2UocGFyYW1OYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgdmFyIGFkZGl0aW9uYWxGb3JtRGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMyB8fCBhcmd1bWVudHNbM10gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbM107XG5cbiAgICAgICAgLy8gVXBkYXRlIHdyaXRlVmFsdWVzXG4gICAgICAgIHZhciBuZXdWYWx1ZXMgPSBfcHlkaW9VdGlsTGFuZzJbJ2RlZmF1bHQnXS5kZWVwQ29weSh0aGlzLmdldFZhbHVlcygpKTtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25QYXJhbWV0ZXJDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25QYXJhbWV0ZXJDaGFuZ2UocGFyYW1OYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUsIGFkZGl0aW9uYWxGb3JtRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFkZGl0aW9uYWxGb3JtRGF0YSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9wYXJhbWV0ZXJzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJhbWV0ZXJzTWV0YWRhdGEgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3BhcmFtZXRlcnNNZXRhZGF0YVtwYXJhbU5hbWVdID0gYWRkaXRpb25hbEZvcm1EYXRhO1xuICAgICAgICB9XG4gICAgICAgIG5ld1ZhbHVlc1twYXJhbU5hbWVdID0gbmV3VmFsdWU7XG4gICAgICAgIHZhciBkaXJ0eSA9IHRydWU7XG4gICAgICAgIHRoaXMub25DaGFuZ2UobmV3VmFsdWVzLCBkaXJ0eSk7XG4gICAgfSxcblxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiBvbkNoYW5nZShuZXdWYWx1ZXMsIGRpcnR5LCByZW1vdmVWYWx1ZXMpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2UpIHtcbiAgICAgICAgICAgIC8vbmV3VmFsdWVzID0gTGFuZ1V0aWxzLm1lcmdlT2JqZWN0c1JlY3Vyc2l2ZSh0aGlzLl9oaWRkZW5WYWx1ZXMsIG5ld1ZhbHVlcyk7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5faGlkZGVuVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2hpZGRlblZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIG5ld1ZhbHVlc1trZXldID09PSB1bmRlZmluZWQgJiYgKCFyZW1vdmVWYWx1ZXMgfHwgcmVtb3ZlVmFsdWVzW2tleV0gPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVzW2tleV0gPSB0aGlzLl9oaWRkZW5WYWx1ZXNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKG5ld1ZhbHVlcywgZGlydHksIHJlbW92ZVZhbHVlcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja1ZhbGlkU3RhdHVzKG5ld1ZhbHVlcyk7XG4gICAgfSxcblxuICAgIG9uU3ViZm9ybUNoYW5nZTogZnVuY3Rpb24gb25TdWJmb3JtQ2hhbmdlKG5ld1ZhbHVlcywgZGlydHksIHJlbW92ZVZhbHVlcykge1xuICAgICAgICB2YXIgdmFsdWVzID0gX3B5ZGlvVXRpbExhbmcyWydkZWZhdWx0J10ubWVyZ2VPYmplY3RzUmVjdXJzaXZlKHRoaXMuZ2V0VmFsdWVzKCksIG5ld1ZhbHVlcyk7XG4gICAgICAgIGlmIChyZW1vdmVWYWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gcmVtb3ZlVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlbW92ZVZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrKSAmJiB2YWx1ZXNba10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWVzW2tdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faGlkZGVuVmFsdWVzW2tdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9oaWRkZW5WYWx1ZXNba107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vbkNoYW5nZSh2YWx1ZXMsIGRpcnR5LCByZW1vdmVWYWx1ZXMpO1xuICAgIH0sXG5cbiAgICBvblN1YmZvcm1WYWxpZFN0YXR1c0NoYW5nZTogZnVuY3Rpb24gb25TdWJmb3JtVmFsaWRTdGF0dXNDaGFuZ2UobmV3VmFsaWRWYWx1ZSwgZmFpbGVkTWFuZGF0b3JpZXMpIHtcbiAgICAgICAgaWYgKChuZXdWYWxpZFZhbHVlICE9PSB0aGlzLl9pbnRlcm5hbFZhbGlkIHx8IHRoaXMucHJvcHMuZm9yY2VWYWxpZFN0YXR1c0NoZWNrKSAmJiB0aGlzLnByb3BzLm9uVmFsaWRTdGF0dXNDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25WYWxpZFN0YXR1c0NoYW5nZShuZXdWYWxpZFZhbHVlLCBmYWlsZWRNYW5kYXRvcmllcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faW50ZXJuYWxWYWxpZCA9IG5ld1ZhbGlkVmFsdWU7XG4gICAgfSxcblxuICAgIGFwcGx5QnV0dG9uQWN0aW9uOiBmdW5jdGlvbiBhcHBseUJ1dHRvbkFjdGlvbihwYXJhbWV0ZXJzLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5hcHBseUJ1dHRvbkFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5hcHBseUJ1dHRvbkFjdGlvbihwYXJhbWV0ZXJzLCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgLy8gT2xkIHdheVxuICAgICAgICBwYXJhbWV0ZXJzID0gTGFuZ1V0aWxzLm1lcmdlT2JqZWN0c1JlY3Vyc2l2ZShwYXJhbWV0ZXJzLCB0aGlzLmdldFZhbHVlc0ZvclBPU1QodGhpcy5nZXRWYWx1ZXMoKSkpO1xuICAgICAgICBQeWRpb0FwaS5nZXRDbGllbnQoKS5yZXF1ZXN0KHBhcmFtZXRlcnMsIGNhbGxiYWNrKTtcbiAgICAgICAgKi9cbiAgICB9LFxuXG4gICAgZ2V0VmFsdWVzRm9yUE9TVDogZnVuY3Rpb24gZ2V0VmFsdWVzRm9yUE9TVCh2YWx1ZXMpIHtcbiAgICAgICAgdmFyIHByZWZpeCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/ICdEUklWRVJfT1BUSU9OXycgOiBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgcmV0dXJuIF9tYW5hZ2VyTWFuYWdlcjJbJ2RlZmF1bHQnXS5nZXRWYWx1ZXNGb3JQT1NUKHRoaXMucHJvcHMucGFyYW1ldGVycywgdmFsdWVzLCBwcmVmaXgsIHRoaXMuX3BhcmFtZXRlcnNNZXRhZGF0YSk7XG4gICAgfSxcblxuICAgIGNoZWNrVmFsaWRTdGF0dXM6IGZ1bmN0aW9uIGNoZWNrVmFsaWRTdGF0dXModmFsdWVzKSB7XG4gICAgICAgIHZhciBmYWlsZWRNYW5kYXRvcmllcyA9IFtdO1xuICAgICAgICB0aGlzLnByb3BzLnBhcmFtZXRlcnMubWFwKChmdW5jdGlvbiAocCkge1xuICAgICAgICAgICAgaWYgKFsnc3RyaW5nJywgJ3RleHRhcmVhJywgJ3Bhc3N3b3JkJywgJ2ludGVnZXInXS5pbmRleE9mKHAudHlwZSkgPiAtMSAmJiAocC5tYW5kYXRvcnkgPT09IFwidHJ1ZVwiIHx8IHAubWFuZGF0b3J5ID09PSB0cnVlKSkge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWVzIHx8ICF2YWx1ZXMuaGFzT3duUHJvcGVydHkocC5uYW1lKSB8fCB2YWx1ZXNbcC5uYW1lXSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlc1twLm5hbWVdID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGZhaWxlZE1hbmRhdG9yaWVzLnB1c2gocCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHAudHlwZSA9PT0gJ3ZhbGlkLXBhc3N3b3JkJyAmJiB0aGlzLnJlZnNbJ2Zvcm0tZWxlbWVudC0nICsgcC5uYW1lXSkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yZWZzWydmb3JtLWVsZW1lbnQtJyArIHAubmFtZV0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZhaWxlZE1hbmRhdG9yaWVzLnB1c2gocCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdmFyIHByZXZpb3VzVmFsdWUgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcHJldmlvdXNWYWx1ZSA9IHRoaXMuX2ludGVybmFsVmFsaWQ7IC8vKHRoaXMuX2ludGVybmFsVmFsaWQgIT09IHVuZGVmaW5lZCA/IHRoaXMuX2ludGVybmFsVmFsaWQgOiB0cnVlKTtcbiAgICAgICAgbmV3VmFsdWUgPSAhZmFpbGVkTWFuZGF0b3JpZXMubGVuZ3RoO1xuICAgICAgICBpZiAoKG5ld1ZhbHVlICE9PSB0aGlzLl9pbnRlcm5hbFZhbGlkIHx8IHRoaXMucHJvcHMuZm9yY2VWYWxpZFN0YXR1c0NoZWNrKSAmJiB0aGlzLnByb3BzLm9uVmFsaWRTdGF0dXNDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25WYWxpZFN0YXR1c0NoYW5nZShuZXdWYWx1ZSwgZmFpbGVkTWFuZGF0b3JpZXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2ludGVybmFsVmFsaWQgPSBuZXdWYWx1ZTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLmNoZWNrVmFsaWRTdGF0dXModGhpcy5wcm9wcy52YWx1ZXMpO1xuICAgIH0sXG5cbiAgICByZW5kZXJHcm91cEhlYWRlcjogZnVuY3Rpb24gcmVuZGVyR3JvdXBIZWFkZXIoZ3JvdXBMYWJlbCwgYWNjb3JkaW9uaXplLCBpbmRleCwgYWN0aXZlKSB7XG5cbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB7IGtleTogJ2dyb3VwLScgKyBncm91cExhYmVsIH07XG4gICAgICAgIGlmIChhY2NvcmRpb25pemUpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5zdGF0ZSAmJiB0aGlzLnN0YXRlLmN1cnJlbnRBY3RpdmVHcm91cCA/IHRoaXMuc3RhdGUuY3VycmVudEFjdGl2ZUdyb3VwIDogbnVsbDtcbiAgICAgICAgICAgIHByb3BlcnRpZXNbJ2NsYXNzTmFtZSddID0gJ2dyb3VwLWxhYmVsLScgKyAoYWN0aXZlID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnKTtcbiAgICAgICAgICAgIHByb3BlcnRpZXNbJ29uQ2xpY2snXSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRBY3RpdmVHcm91cDogY3VycmVudCAhPT0gaW5kZXggPyBpbmRleCA6IG51bGwgfSk7XG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgZ3JvdXBMYWJlbCA9IFtfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnc3BhbicsIHsga2V5OiAndG9nZ2xlcicsIGNsYXNzTmFtZTogXCJncm91cC1hY3RpdmUtdG9nZ2xlciBpY29uLWFuZ2xlLVwiICsgKGN1cnJlbnQgPT09IGluZGV4ID8gJ2Rvd24nIDogJ3JpZ2h0JykgfSksIGdyb3VwTGFiZWxdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdoJyArICgzICsgdGhpcy5wcm9wcy5kZXB0aCksIHByb3BlcnRpZXMsIGdyb3VwTGFiZWwpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGFsbEdyb3VwcyA9IFtdO1xuICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoKTtcbiAgICAgICAgdmFyIGdyb3Vwc09yZGVyZWQgPSBbJ19fREVGQVVMVF9fJ107XG4gICAgICAgIGFsbEdyb3Vwc1snX19ERUZBVUxUX18nXSA9IHsgRklFTERTOiBbXSB9O1xuICAgICAgICB2YXIgcmVwbGljYXRpb25Hcm91cHMgPSB7fTtcblxuICAgICAgICB0aGlzLnByb3BzLnBhcmFtZXRlcnMubWFwKChmdW5jdGlvbiAoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIHR5cGUgPSBhdHRyaWJ1dGVzWyd0eXBlJ107XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5za2lwRmllbGRzVHlwZXMgJiYgdGhpcy5wcm9wcy5za2lwRmllbGRzVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBhcmFtTmFtZSA9IGF0dHJpYnV0ZXNbJ25hbWUnXTtcbiAgICAgICAgICAgIHZhciBmaWVsZDtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzWydncm91cF9zd2l0Y2hfbmFtZSddKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZ3JvdXAgPSBhdHRyaWJ1dGVzWydncm91cCddIHx8ICdfX0RFRkFVTFRfXyc7XG4gICAgICAgICAgICBpZiAoIWFsbEdyb3Vwc1tncm91cF0pIHtcbiAgICAgICAgICAgICAgICBncm91cHNPcmRlcmVkLnB1c2goZ3JvdXApO1xuICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tncm91cF0gPSB7IEZJRUxEUzogW10sIExBQkVMOiBncm91cCB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVwR3JvdXAgPSBhdHRyaWJ1dGVzWydyZXBsaWNhdGlvbkdyb3VwJ107XG4gICAgICAgICAgICBpZiAocmVwR3JvdXApIHtcblxuICAgICAgICAgICAgICAgIGlmICghcmVwbGljYXRpb25Hcm91cHNbcmVwR3JvdXBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxpY2F0aW9uR3JvdXBzW3JlcEdyb3VwXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFBBUkFNUzogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBHUk9VUDogZ3JvdXAsXG4gICAgICAgICAgICAgICAgICAgICAgICBQT1NJVElPTjogYWxsR3JvdXBzW2dyb3VwXS5GSUVMRFMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tncm91cF0uRklFTERTLnB1c2goJ1JFUExJQ0FUSU9OOicgKyByZXBHcm91cCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENvcHlcbiAgICAgICAgICAgICAgICB2YXIgcmVwQXR0ciA9IF9weWRpb1V0aWxMYW5nMlsnZGVmYXVsdCddLmRlZXBDb3B5KGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXBBdHRyWydyZXBsaWNhdGlvbkdyb3VwJ107XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlcEF0dHJbJ2dyb3VwJ107XG4gICAgICAgICAgICAgICAgcmVwbGljYXRpb25Hcm91cHNbcmVwR3JvdXBdLlBBUkFNUy5wdXNoKHJlcEF0dHIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlLmluZGV4T2YoXCJncm91cF9zd2l0Y2g6XCIpID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZmllbGQgPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChfR3JvdXBTd2l0Y2hQYW5lbDJbJ2RlZmF1bHQnXSwgX2V4dGVuZHMoe30sIHRoaXMucHJvcHMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiB0aGlzLm9uU3ViZm9ybUNoYW5nZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtQXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHRoaXMucHJvcHMucGFyYW1ldGVycyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogdGhpcy5wcm9wcy52YWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHBhcmFtTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2Nyb2xsQ2FsbGJhY2s6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdFRvR3JvdXBzOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25WYWxpZFN0YXR1c0NoYW5nZTogdGhpcy5vblN1YmZvcm1WYWxpZFN0YXR1c0NoYW5nZVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhdHRyaWJ1dGVzWyd0eXBlJ10gIT09ICdoaWRkZW4nKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlbHBlck1hcms7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLnNldEhlbHBlckRhdGEgJiYgdGhpcy5wcm9wcy5jaGVja0hhc0hlbHBlciAmJiB0aGlzLnByb3BzLmNoZWNrSGFzSGVscGVyKGF0dHJpYnV0ZXNbJ25hbWUnXSwgdGhpcy5wcm9wcy5oZWxwZXJUZXN0Rm9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNob3dIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0SGVscGVyRGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtQXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiB2YWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RWYWx1ZXM6IHRoaXMuZ2V0VmFsdWVzRm9yUE9TVCh2YWx1ZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBseUJ1dHRvbkFjdGlvbjogdGhpcy5hcHBseUJ1dHRvbkFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMucHJvcHMuaGVscGVyVGVzdEZvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVscGVyTWFyayA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdpY29uLXF1ZXN0aW9uLXNpZ24nLCBvbkNsaWNrOiBzaG93SGVscGVyIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYW5kYXRvcnlNaXNzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjbGFzc0xlZ2VuZCA9IFwiZm9ybS1sZWdlbmRcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNbJ2Vycm9yVGV4dCddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xlZ2VuZCA9IFwiZm9ybS1sZWdlbmQgbWFuZGF0b3J5LW1pc3NpbmdcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhdHRyaWJ1dGVzWyd3YXJuaW5nVGV4dCddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xlZ2VuZCA9IFwiZm9ybS1sZWdlbmQgd2FybmluZy1tZXNzYWdlXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXR0cmlidXRlc1snbWFuZGF0b3J5J10gJiYgKGF0dHJpYnV0ZXNbJ21hbmRhdG9yeSddID09PSBcInRydWVcIiB8fCBhdHRyaWJ1dGVzWydtYW5kYXRvcnknXSA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChbJ3N0cmluZycsICd0ZXh0YXJlYScsICdpbWFnZScsICdpbnRlZ2VyJ10uaW5kZXhPZihhdHRyaWJ1dGVzWyd0eXBlJ10pICE9PSAtMSAmJiAhdmFsdWVzW3BhcmFtTmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYW5kYXRvcnlNaXNzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xlZ2VuZCA9IFwiZm9ybS1sZWdlbmQgbWFuZGF0b3J5LW1pc3NpbmdcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZjogXCJmb3JtLWVsZW1lbnQtXCIgKyBwYXJhbU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcGFyYW1OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlc1twYXJhbU5hbWVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIG9uQ2hhbmdlKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgYWRkaXRpb25hbEZvcm1EYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMub25QYXJhbWV0ZXJDaGFuZ2UocGFyYW1OYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUsIGFkZGl0aW9uYWxGb3JtRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgYXR0cmlidXRlc1sncmVhZG9ubHknXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlOiBhdHRyaWJ1dGVzWydtdWx0aXBsZSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmluYXJ5X2NvbnRleHQ6IHRoaXMucHJvcHMuYmluYXJ5X2NvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5Q29udGV4dDogJ2Zvcm0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlCdXR0b25BY3Rpb246IHRoaXMuYXBwbHlCdXR0b25BY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclRleHQ6IG1hbmRhdG9yeU1pc3NpbmcgPyBweWRpby5NZXNzYWdlSGFzaFsnNjIxJ10gOiBhdHRyaWJ1dGVzLmVycm9yVGV4dCA/IGF0dHJpYnV0ZXMuZXJyb3JUZXh0IDogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsga2V5OiBwYXJhbU5hbWUsIGNsYXNzTmFtZTogJ2Zvcm0tZW50cnktJyArIGF0dHJpYnV0ZXNbJ3R5cGUnXSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX21hbmFnZXJNYW5hZ2VyMlsnZGVmYXVsdCddLmNyZWF0ZUZvcm1FbGVtZW50KHByb3BzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc0xlZ2VuZCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNbJ3dhcm5pbmdUZXh0J10gPyBhdHRyaWJ1dGVzWyd3YXJuaW5nVGV4dCddIDogYXR0cmlidXRlc1snZGVzY3JpcHRpb24nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVscGVyTWFya1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGlkZGVuVmFsdWVzW3BhcmFtTmFtZV0gPSB2YWx1ZXNbcGFyYW1OYW1lXSA9PT0gdW5kZWZpbmVkID8gYXR0cmlidXRlc1snZGVmYXVsdCddIDogdmFsdWVzW3BhcmFtTmFtZV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tncm91cF0uRklFTERTLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgZm9yICh2YXIgckdyb3VwIGluIHJlcGxpY2F0aW9uR3JvdXBzKSB7XG4gICAgICAgICAgICBpZiAoIXJlcGxpY2F0aW9uR3JvdXBzLmhhc093blByb3BlcnR5KHJHcm91cCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByR3JvdXBEYXRhID0gcmVwbGljYXRpb25Hcm91cHNbckdyb3VwXTtcbiAgICAgICAgICAgIGFsbEdyb3Vwc1tyR3JvdXBEYXRhLkdST1VQXS5GSUVMRFNbckdyb3VwRGF0YS5QT1NJVElPTl0gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChfUmVwbGljYXRpb25QYW5lbDJbJ2RlZmF1bHQnXSwgX2V4dGVuZHMoe30sIHRoaXMucHJvcHMsIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwicmVwbGljYXRpb24tZ3JvdXAtXCIgKyByR3JvdXBEYXRhLlBBUkFNU1swXS5uYW1lLFxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiB0aGlzLm9uU3ViZm9ybUNoYW5nZSxcbiAgICAgICAgICAgICAgICBvblBhcmFtZXRlckNoYW5nZTogbnVsbCxcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IHRoaXMuZ2V0VmFsdWVzKCksXG4gICAgICAgICAgICAgICAgZGVwdGg6IHRoaXMucHJvcHMuZGVwdGggKyAxLFxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHJHcm91cERhdGEuUEFSQU1TLFxuICAgICAgICAgICAgICAgIGFwcGx5QnV0dG9uQWN0aW9uOiB0aGlzLmFwcGx5QnV0dG9uQWN0aW9uLFxuICAgICAgICAgICAgICAgIG9uU2Nyb2xsQ2FsbGJhY2s6IG51bGxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBncm91cFBhbmVzID0gW107XG4gICAgICAgIHZhciBhY2NvcmRpb25pemUgPSB0aGlzLnByb3BzLmFjY29yZGlvbml6ZUlmR3JvdXBzTW9yZVRoYW4gJiYgZ3JvdXBzT3JkZXJlZC5sZW5ndGggPiB0aGlzLnByb3BzLmFjY29yZGlvbml6ZUlmR3JvdXBzTW9yZVRoYW47XG4gICAgICAgIHZhciBjdXJyZW50QWN0aXZlR3JvdXAgPSB0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUuY3VycmVudEFjdGl2ZUdyb3VwID8gdGhpcy5zdGF0ZS5jdXJyZW50QWN0aXZlR3JvdXAgOiAwO1xuICAgICAgICBncm91cHNPcmRlcmVkLm1hcCgoZnVuY3Rpb24gKGcsIGdJbmRleCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMubGltaXRUb0dyb3VwcyAmJiB0aGlzLnByb3BzLmxpbWl0VG9Hcm91cHMuaW5kZXhPZihnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaGVhZGVyLFxuICAgICAgICAgICAgICAgIGdEYXRhID0gYWxsR3JvdXBzW2ddO1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9ICdweWRpby1mb3JtLWdyb3VwJyxcbiAgICAgICAgICAgICAgICBhY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChhY2NvcmRpb25pemUpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmUgPSBjdXJyZW50QWN0aXZlR3JvdXAgPT09IGdJbmRleDtcbiAgICAgICAgICAgICAgICBpZiAoZ0luZGV4ID09PSBjdXJyZW50QWN0aXZlR3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9ICcgZm9ybS1ncm91cC1hY3RpdmUnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSAnIGZvcm0tZ3JvdXAtaW5hY3RpdmUnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZ0RhdGEuRklFTERTLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnRGF0YS5MQUJFTCAmJiAhKHRoaXMucHJvcHMuc2tpcEZpZWxkc1R5cGVzICYmIHRoaXMucHJvcHMuc2tpcEZpZWxkc1R5cGVzLmluZGV4T2YoJ0dyb3VwSGVhZGVyJykgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICBoZWFkZXIgPSB0aGlzLnJlbmRlckdyb3VwSGVhZGVyKGdEYXRhLkxBQkVMLCBhY2NvcmRpb25pemUsIGdJbmRleCwgYWN0aXZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmRlcHRoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9ICcgei1kZXB0aC0xJztcbiAgICAgICAgICAgICAgICBncm91cFBhbmVzLnB1c2goX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIF9tYXRlcmlhbFVpLlBhcGVyLFxuICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lLCBrZXk6ICdwYW5lLScgKyBnIH0sXG4gICAgICAgICAgICAgICAgICAgIGdJbmRleCA9PT0gMCAmJiB0aGlzLnByb3BzLmhlYWRlciA/IHRoaXMucHJvcHMuaGVhZGVyIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdEYXRhLkZJRUxEU1xuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBnSW5kZXggPT09IGdyb3Vwc09yZGVyZWQubGVuZ3RoIC0gMSAmJiB0aGlzLnByb3BzLmZvb3RlciA/IHRoaXMucHJvcHMuZm9vdGVyIDogbnVsbFxuICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBncm91cFBhbmVzLnB1c2goX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lLCBrZXk6ICdwYW5lLScgKyBnIH0sXG4gICAgICAgICAgICAgICAgICAgIGdJbmRleCA9PT0gMCAmJiB0aGlzLnByb3BzLmhlYWRlciA/IHRoaXMucHJvcHMuaGVhZGVyIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdEYXRhLkZJRUxEU1xuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBnSW5kZXggPT09IGdyb3Vwc09yZGVyZWQubGVuZ3RoIC0gMSAmJiB0aGlzLnByb3BzLmZvb3RlciA/IHRoaXMucHJvcHMuZm9vdGVyIDogbnVsbFxuICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuYWRkaXRpb25hbFBhbmVzKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBvdGhlclBhbmVzID0geyB0b3A6IFtdLCBib3R0b206IFtdIH07XG4gICAgICAgICAgICAgICAgdmFyIGRlcHRoID0gX3RoaXMyLnByb3BzLmRlcHRoO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XG5cbiAgICAgICAgICAgICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW90aGVyUGFuZXMuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29udGludWUnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpczIucHJvcHMuYWRkaXRpb25hbFBhbmVzW2tdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpczIucHJvcHMuYWRkaXRpb25hbFBhbmVzW2tdLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlclBhbmVzW2tdLnB1c2goX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbWF0ZXJpYWxVaS5QYXBlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncHlkaW8tZm9ybS1ncm91cCBhZGRpdGlvbmFsJywga2V5OiAnb3RoZXItcGFuZS0nICsgaW5kZXggfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQYW5lc1trXS5wdXNoKF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3B5ZGlvLWZvcm0tZ3JvdXAgYWRkaXRpb25hbCcsIGtleTogJ290aGVyLXBhbmUtJyArIGluZGV4IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayBpbiBvdGhlclBhbmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfcmV0MiA9IF9sb29wKGspO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChfcmV0MiA9PT0gJ2NvbnRpbnVlJykgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdyb3VwUGFuZXMgPSBvdGhlclBhbmVzWyd0b3AnXS5jb25jYXQoZ3JvdXBQYW5lcykuY29uY2F0KG90aGVyUGFuZXNbJ2JvdHRvbSddKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcm9wcy50YWJzKSB7XG4gICAgICAgICAgICB2YXIgX3JldDMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSBfdGhpczIucHJvcHMuY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgIHZhciBpbml0aWFsU2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgICAgIHZhciB0YWJzID0gX3RoaXMyLnByb3BzLnRhYnMubWFwKChmdW5jdGlvbiAodERlZikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSB0RGVmWydsYWJlbCddO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBzID0gdERlZlsnZ3JvdXBzJ107XG4gICAgICAgICAgICAgICAgICAgIGlmICh0RGVmWydzZWxlY3RlZCddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsU2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhbmVzID0gZ3JvdXBzLm1hcChmdW5jdGlvbiAoZ0lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXBQYW5lc1tnSWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdyb3VwUGFuZXNbZ0lkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgIF9tYXRlcmlhbFVpLlRhYixcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMucHJvcHMub25UYWJDaGFuZ2UgPyBpIC0gMSA6IHVuZGVmaW5lZCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IChjbGFzc05hbWUgPyBjbGFzc05hbWUgKyAnICcgOiAnICcpICsgJ3B5ZGlvLWZvcm0tcGFuZWwnICsgKHBhbmVzLmxlbmd0aCAlIDIgPyAnIGZvcm0tcGFuZWwtb2RkJyA6ICcnKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhbmVzXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSkuYmluZChfdGhpczIpKTtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMyLnN0YXRlLnRhYlNlbGVjdGVkSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpbml0aWFsU2VsZWN0ZWRJbmRleCA9IF90aGlzMi5zdGF0ZS50YWJTZWxlY3RlZEluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB2OiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdsYXlvdXQtZmlsbCB2ZXJ0aWNhbC1sYXlvdXQgdGFiLXZlcnRpY2FsLWxheW91dCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9tYXRlcmlhbFVpLlRhYnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyByZWY6ICd0YWJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbFNlbGVjdGVkSW5kZXg6IGluaXRpYWxTZWxlY3RlZEluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogX3RoaXMyLnByb3BzLm9uVGFiQ2hhbmdlID8gaW5pdGlhbFNlbGVjdGVkSW5kZXggOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiBfdGhpczIucHJvcHMub25UYWJDaGFuZ2UgPyBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMyLnNldFN0YXRlKHsgdGFiU2VsZWN0ZWRJbmRleDogaSB9KTtfdGhpczIucHJvcHMub25UYWJDaGFuZ2UoaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7IGZsZXg6IDEsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudENvbnRhaW5lclN0eWxlOiB7IGZsZXg6IDEsIG92ZXJmbG93WTogJ2F1dG8nIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYnNcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIF9yZXQzID09PSAnb2JqZWN0JykgcmV0dXJuIF9yZXQzLnY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICh0aGlzLnByb3BzLmNsYXNzTmFtZSA/IHRoaXMucHJvcHMuY2xhc3NOYW1lICsgJyAnIDogJyAnKSArICdweWRpby1mb3JtLXBhbmVsJyArIChncm91cFBhbmVzLmxlbmd0aCAlIDIgPyAnIGZvcm0tcGFuZWwtb2RkJyA6ICcnKSwgb25TY3JvbGw6IHRoaXMucHJvcHMub25TY3JvbGxDYWxsYmFjayB9LFxuICAgICAgICAgICAgICAgIGdyb3VwUGFuZXNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX0Zvcm1QYW5lbCA9IHJlcXVpcmUoJy4vRm9ybVBhbmVsJyk7XG5cbnZhciBfRm9ybVBhbmVsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0Zvcm1QYW5lbCk7XG5cbnZhciBfZmllbGRzSW5wdXRTZWxlY3RCb3ggPSByZXF1aXJlKCcuLi9maWVsZHMvSW5wdXRTZWxlY3RCb3gnKTtcblxudmFyIF9maWVsZHNJbnB1dFNlbGVjdEJveDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9maWVsZHNJbnB1dFNlbGVjdEJveCk7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBMYW5nVXRpbHMgPSByZXF1aXJlKCdweWRpby91dGlsL2xhbmcnKTtcblxuLyoqXG4gKiBTdWIgZm9ybSB3aXRoIGEgc2VsZWN0b3IsIHN3aXRjaGluZyBpdHMgZmllbGRzIGRlcGVuZGluZ1xuICogb24gdGhlIHNlbGVjdG9yIHZhbHVlLlxuICovXG5leHBvcnRzWydkZWZhdWx0J10gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdHcm91cFN3aXRjaFBhbmVsJyxcblxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBwYXJhbUF0dHJpYnV0ZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgICAgcGFyYW1ldGVyczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgICAgIHZhbHVlczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgICBvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICAgIH0sXG5cbiAgICBjb21wdXRlU3ViUGFuZWxQYXJhbWV0ZXJzOiBmdW5jdGlvbiBjb21wdXRlU3ViUGFuZWxQYXJhbWV0ZXJzKCkge1xuXG4gICAgICAgIC8vIENSRUFURSBTVUIgRk9STSBQQU5FTFxuICAgICAgICAvLyBHZXQgYWxsIHZhbHVlc1xuICAgICAgICB2YXIgc3dpdGNoTmFtZSA9IHRoaXMucHJvcHMucGFyYW1BdHRyaWJ1dGVzWyd0eXBlJ10uc3BsaXQoXCI6XCIpLnBvcCgpO1xuICAgICAgICB2YXIgcGFyZW50TmFtZSA9IHRoaXMucHJvcHMucGFyYW1BdHRyaWJ1dGVzWyduYW1lJ107XG4gICAgICAgIHZhciBzd2l0Y2hWYWx1ZXMgPSB7fSxcbiAgICAgICAgICAgIHBvdGVudGlhbFN1YlN3aXRjaGVzID0gW107XG5cbiAgICAgICAgdGhpcy5wcm9wcy5wYXJhbWV0ZXJzLm1hcCgoZnVuY3Rpb24gKHApIHtcbiAgICAgICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICAgICAgaWYgKCFwWydncm91cF9zd2l0Y2hfbmFtZSddKSByZXR1cm47XG4gICAgICAgICAgICBpZiAocFsnZ3JvdXBfc3dpdGNoX25hbWUnXSAhPSBzd2l0Y2hOYW1lKSB7XG4gICAgICAgICAgICAgICAgcG90ZW50aWFsU3ViU3dpdGNoZXMucHVzaChwKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY3J0U3dpdGNoID0gcFsnZ3JvdXBfc3dpdGNoX3ZhbHVlJ107XG4gICAgICAgICAgICBpZiAoIXN3aXRjaFZhbHVlc1tjcnRTd2l0Y2hdKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoVmFsdWVzW2NydFN3aXRjaF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBwWydncm91cF9zd2l0Y2hfbGFiZWwnXSxcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzS2V5czoge31cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcCA9IExhbmdVdGlscy5kZWVwQ29weShwKTtcbiAgICAgICAgICAgIGRlbGV0ZSBwWydncm91cF9zd2l0Y2hfbmFtZSddO1xuICAgICAgICAgICAgcFsnbmFtZSddID0gcGFyZW50TmFtZSArICcvJyArIHBbJ25hbWUnXTtcbiAgICAgICAgICAgIHZhciB2S2V5ID0gcFsnbmFtZSddO1xuICAgICAgICAgICAgdmFyIHBhcmFtTmFtZSA9IHZLZXk7XG4gICAgICAgICAgICBpZiAoc3dpdGNoVmFsdWVzW2NydFN3aXRjaF0uZmllbGRzS2V5c1twYXJhbU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoVmFsdWVzW2NydFN3aXRjaF0uZmllbGRzLnB1c2gocCk7XG4gICAgICAgICAgICBzd2l0Y2hWYWx1ZXNbY3J0U3dpdGNoXS5maWVsZHNLZXlzW3BhcmFtTmFtZV0gPSBwYXJhbU5hbWU7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy52YWx1ZXMgJiYgdGhpcy5wcm9wcy52YWx1ZXNbdktleV0pIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2hWYWx1ZXNbY3J0U3dpdGNoXS52YWx1ZXNbcGFyYW1OYW1lXSA9IHRoaXMucHJvcHMudmFsdWVzW3ZLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcbiAgICAgICAgLy8gUmVtZXJnZSBwb3RlbnRpYWxTdWJTd2l0Y2hlcyB0byBlYWNoIHBhcmFtZXRlcnMgc2V0XG4gICAgICAgIGZvciAodmFyIGsgaW4gc3dpdGNoVmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoc3dpdGNoVmFsdWVzLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN2ID0gc3dpdGNoVmFsdWVzW2tdO1xuICAgICAgICAgICAgICAgIHN2LmZpZWxkcyA9IHN2LmZpZWxkcy5jb25jYXQocG90ZW50aWFsU3ViU3dpdGNoZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN3aXRjaFZhbHVlcztcbiAgICB9LFxuXG4gICAgY2xlYXJTdWJQYXJhbWV0ZXJzVmFsdWVzOiBmdW5jdGlvbiBjbGVhclN1YlBhcmFtZXRlcnNWYWx1ZXMocGFyZW50TmFtZSwgbmV3VmFsdWUsIG5ld0ZpZWxkcykge1xuICAgICAgICB2YXIgdmFscyA9IExhbmdVdGlscy5kZWVwQ29weSh0aGlzLnByb3BzLnZhbHVlcyk7XG4gICAgICAgIHZhciB0b1JlbW92ZSA9IHt9O1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFscykge1xuICAgICAgICAgICAgaWYgKHZhbHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkuaW5kZXhPZihwYXJlbnROYW1lICsgJy8nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRvUmVtb3ZlW2tleV0gPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YWxzW3BhcmVudE5hbWVdID0gbmV3VmFsdWU7XG5cbiAgICAgICAgbmV3RmllbGRzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgICAgICAgaWYgKHAudHlwZSA9PSAnaGlkZGVuJyAmJiBwWydkZWZhdWx0J10gJiYgIXBbJ2dyb3VwX3N3aXRjaF9uYW1lJ10gfHwgcFsnZ3JvdXBfc3dpdGNoX25hbWUnXSA9PSBwYXJlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFsc1twWyduYW1lJ11dID0gcFsnZGVmYXVsdCddO1xuICAgICAgICAgICAgICAgIGlmICh0b1JlbW92ZVtwWyduYW1lJ11dICE9PSB1bmRlZmluZWQpIGRlbGV0ZSB0b1JlbW92ZVtwWyduYW1lJ11dO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwWyduYW1lJ10uaW5kZXhPZihwYXJlbnROYW1lICsgJy8nKSA9PT0gMCAmJiBwWydkZWZhdWx0J10pIHtcbiAgICAgICAgICAgICAgICBpZiAocFsndHlwZSddICYmIHBbJ3R5cGUnXS5zdGFydHNXaXRoKCdncm91cF9zd2l0Y2g6JykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy92YWxzW3BbJ25hbWUnXV0gPSB7Z3JvdXBfc3dpdGNoX3ZhbHVlOnBbJ2RlZmF1bHQnXX07XG4gICAgICAgICAgICAgICAgICAgIHZhbHNbcFsnbmFtZSddXSA9IHBbJ2RlZmF1bHQnXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWxzW3BbJ25hbWUnXV0gPSBwWydkZWZhdWx0J107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh2YWxzLCB0cnVlLCB0b1JlbW92ZSk7XG4gICAgICAgIC8vdGhpcy5vblBhcmFtZXRlckNoYW5nZShwYXJlbnROYW1lLCBuZXdWYWx1ZSk7XG4gICAgfSxcblxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiBvbkNoYW5nZShuZXdWYWx1ZXMsIGRpcnR5LCByZW1vdmVWYWx1ZXMpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShuZXdWYWx1ZXMsIHRydWUsIHJlbW92ZVZhbHVlcyk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMucHJvcHMucGFyYW1BdHRyaWJ1dGVzO1xuICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy5wcm9wcy52YWx1ZXM7XG5cbiAgICAgICAgdmFyIHBhcmFtTmFtZSA9IGF0dHJpYnV0ZXNbJ25hbWUnXTtcbiAgICAgICAgdmFyIHN3aXRjaFZhbHVlcyA9IHRoaXMuY29tcHV0ZVN1YlBhbmVsUGFyYW1ldGVycyhhdHRyaWJ1dGVzKTtcbiAgICAgICAgdmFyIHNlbGVjdG9yVmFsdWVzID0gbmV3IE1hcCgpO1xuICAgICAgICBPYmplY3Qua2V5cyhzd2l0Y2hWYWx1ZXMpLm1hcChmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgc2VsZWN0b3JWYWx1ZXMuc2V0KGssIHN3aXRjaFZhbHVlc1trXS5sYWJlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgc2VsZWN0b3JDaGFuZ2VyID0gKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5jbGVhclN1YlBhcmFtZXRlcnNWYWx1ZXMocGFyYW1OYW1lLCBuZXdWYWx1ZSwgc3dpdGNoVmFsdWVzW25ld1ZhbHVlXSA/IHN3aXRjaFZhbHVlc1tuZXdWYWx1ZV0uZmllbGRzIDogW10pO1xuICAgICAgICB9KS5iaW5kKHRoaXMpO1xuICAgICAgICB2YXIgc3ViRm9ybSA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNlbGVjdG9yTGVnZW5kID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3ViRm9ybUhlYWRlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHNlbGVjdG9yID0gUmVhY3QuY3JlYXRlRWxlbWVudChfZmllbGRzSW5wdXRTZWxlY3RCb3gyWydkZWZhdWx0J10sIHtcbiAgICAgICAgICAgIGtleTogcGFyYW1OYW1lLFxuICAgICAgICAgICAgbmFtZTogcGFyYW1OYW1lLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnZ3JvdXAtc3dpdGNoLXNlbGVjdG9yJyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBwYXJhbU5hbWUsXG4gICAgICAgICAgICAgICAgY2hvaWNlczogc2VsZWN0b3JWYWx1ZXMsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGF0dHJpYnV0ZXNbJ2xhYmVsJ10sXG4gICAgICAgICAgICAgICAgbWFuZGF0b3J5OiBhdHRyaWJ1dGVzWydtYW5kYXRvcnknXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZXNbcGFyYW1OYW1lXSxcbiAgICAgICAgICAgIG9uQ2hhbmdlOiBzZWxlY3RvckNoYW5nZXIsXG4gICAgICAgICAgICBkaXNwbGF5Q29udGV4dDogJ2Zvcm0nLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IHRoaXMucHJvcHMuZGlzYWJsZWQsXG4gICAgICAgICAgICByZWY6ICdzdWJGb3JtU2VsZWN0b3InXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBoZWxwZXJNYXJrID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5zZXRIZWxwZXJEYXRhICYmIHRoaXMucHJvcHMuY2hlY2tIYXNIZWxwZXIgJiYgdGhpcy5wcm9wcy5jaGVja0hhc0hlbHBlcihhdHRyaWJ1dGVzWyduYW1lJ10sIHRoaXMucHJvcHMuaGVscGVyVGVzdEZvcikpIHtcbiAgICAgICAgICAgIHZhciBzaG93SGVscGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNldEhlbHBlckRhdGEoeyBwYXJhbUF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsIHZhbHVlczogdmFsdWVzIH0pO1xuICAgICAgICAgICAgfSkuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIGhlbHBlck1hcmsgPSBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdpY29uLXF1ZXN0aW9uLXNpZ24nLCBvbkNsaWNrOiBzaG93SGVscGVyIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZWN0b3JMZWdlbmQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2Zvcm0tbGVnZW5kJyB9LFxuICAgICAgICAgICAgYXR0cmlidXRlc1snZGVzY3JpcHRpb24nXSxcbiAgICAgICAgICAgICcgJyxcbiAgICAgICAgICAgIGhlbHBlck1hcmtcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHZhbHVlc1twYXJhbU5hbWVdICYmIHN3aXRjaFZhbHVlc1t2YWx1ZXNbcGFyYW1OYW1lXV0pIHtcbiAgICAgICAgICAgIHN1YkZvcm1IZWFkZXIgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdoNCcsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICB2YWx1ZXNbcGFyYW1OYW1lXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHN1YkZvcm0gPSBSZWFjdC5jcmVhdGVFbGVtZW50KF9Gb3JtUGFuZWwyWydkZWZhdWx0J10sIHtcbiAgICAgICAgICAgICAgICBvblBhcmFtZXRlckNoYW5nZTogdGhpcy5wcm9wcy5vblBhcmFtZXRlckNoYW5nZSxcbiAgICAgICAgICAgICAgICBhcHBseUJ1dHRvbkFjdGlvbjogdGhpcy5wcm9wcy5hcHBseUJ1dHRvbkFjdGlvbixcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogdGhpcy5wcm9wcy5kaXNhYmxlZCxcbiAgICAgICAgICAgICAgICByZWY6IHBhcmFtTmFtZSArICctU1VCJyxcbiAgICAgICAgICAgICAgICBrZXk6IHBhcmFtTmFtZSArICctU1VCJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdzdWItZm9ybScsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczogc3dpdGNoVmFsdWVzW3ZhbHVlc1twYXJhbU5hbWVdXS5maWVsZHMsXG4gICAgICAgICAgICAgICAgdmFsdWVzOiB2YWx1ZXMsXG4gICAgICAgICAgICAgICAgZGVwdGg6IHRoaXMucHJvcHMuZGVwdGggKyAxLFxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiB0aGlzLm9uQ2hhbmdlLFxuICAgICAgICAgICAgICAgIGNoZWNrSGFzSGVscGVyOiB0aGlzLnByb3BzLmNoZWNrSGFzSGVscGVyLFxuICAgICAgICAgICAgICAgIHNldEhlbHBlckRhdGE6IHRoaXMucHJvcHMuc2V0SGVscGVyRGF0YSxcbiAgICAgICAgICAgICAgICBoZWxwZXJUZXN0Rm9yOiB2YWx1ZXNbcGFyYW1OYW1lXSxcbiAgICAgICAgICAgICAgICBhY2NvcmRpb25pemVJZkdyb3Vwc01vcmVUaGFuOiA1XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdzdWItZm9ybS1ncm91cCcgfSxcbiAgICAgICAgICAgIHNlbGVjdG9yLFxuICAgICAgICAgICAgc2VsZWN0b3JMZWdlbmQsXG4gICAgICAgICAgICBzdWJGb3JtXG4gICAgICAgICk7XG4gICAgfVxuXG59KTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09ICdmdW5jdGlvbicgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90ICcgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBfRm9ybVBhbmVsID0gcmVxdWlyZSgnLi9Gb3JtUGFuZWwnKTtcblxudmFyIF9Gb3JtUGFuZWwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRm9ybVBhbmVsKTtcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIENvbXBvbmVudCA9IF9yZXF1aXJlLkNvbXBvbmVudDtcblxudmFyIF9yZXF1aXJlMiA9IHJlcXVpcmUoJ21hdGVyaWFsLXVpJyk7XG5cbnZhciBJY29uQnV0dG9uID0gX3JlcXVpcmUyLkljb25CdXR0b247XG52YXIgRmxhdEJ1dHRvbiA9IF9yZXF1aXJlMi5GbGF0QnV0dG9uO1xudmFyIFBhcGVyID0gX3JlcXVpcmUyLlBhcGVyO1xuXG52YXIgVVBfQVJST1cgPSAnbWRpIG1kaS1tZW51LXVwJztcbnZhciBET1dOX0FSUk9XID0gJ21kaSBtZGktbWVudS1kb3duJztcbnZhciBSRU1PVkUgPSAnbWRpIG1kaS1kZWxldGUtY2lyY2xlJztcblxudmFyIFJlcGxpY2F0ZWRHcm91cCA9IChmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICAgIF9pbmhlcml0cyhSZXBsaWNhdGVkR3JvdXAsIF9Db21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gUmVwbGljYXRlZEdyb3VwKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSZXBsaWNhdGVkR3JvdXApO1xuXG4gICAgICAgIF9Db21wb25lbnQuY2FsbCh0aGlzLCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgIHZhciBzdWJWYWx1ZXMgPSBwcm9wcy5zdWJWYWx1ZXM7XG4gICAgICAgIHZhciBwYXJhbWV0ZXJzID0gcHJvcHMucGFyYW1ldGVycztcblxuICAgICAgICB2YXIgZmlyc3RQYXJhbSA9IHBhcmFtZXRlcnNbMF07XG4gICAgICAgIHZhciBpbnN0YW5jZVZhbHVlID0gc3ViVmFsdWVzW2ZpcnN0UGFyYW1bJ25hbWUnXV0gfHwgJyc7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHRvZ2dsZWQ6IGluc3RhbmNlVmFsdWUgPyBmYWxzZSA6IHRydWUgfTtcbiAgICB9XG5cbiAgICBSZXBsaWNhdGVkR3JvdXAucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcztcbiAgICAgICAgdmFyIGRlcHRoID0gX3Byb3BzLmRlcHRoO1xuICAgICAgICB2YXIgb25Td2FwVXAgPSBfcHJvcHMub25Td2FwVXA7XG4gICAgICAgIHZhciBvblN3YXBEb3duID0gX3Byb3BzLm9uU3dhcERvd247XG4gICAgICAgIHZhciBvblJlbW92ZSA9IF9wcm9wcy5vblJlbW92ZTtcbiAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSBfcHJvcHMucGFyYW1ldGVycztcbiAgICAgICAgdmFyIHN1YlZhbHVlcyA9IF9wcm9wcy5zdWJWYWx1ZXM7XG4gICAgICAgIHZhciBkaXNhYmxlZCA9IF9wcm9wcy5kaXNhYmxlZDtcbiAgICAgICAgdmFyIHRvZ2dsZWQgPSB0aGlzLnN0YXRlLnRvZ2dsZWQ7XG5cbiAgICAgICAgdmFyIGZpcnN0UGFyYW0gPSBwYXJhbWV0ZXJzWzBdO1xuICAgICAgICB2YXIgaW5zdGFuY2VWYWx1ZSA9IHN1YlZhbHVlc1tmaXJzdFBhcmFtWyduYW1lJ11dIHx8IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICB7IHN0eWxlOiB7IGNvbG9yOiAncmdiYSgwLDAsMCwwLjMzKScgfSB9LFxuICAgICAgICAgICAgJ0VtcHR5IFZhbHVlJ1xuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgUGFwZXIsXG4gICAgICAgICAgICB7IHN0eWxlOiB7IG1hcmdpbkxlZnQ6IDIsIG1hcmdpblJpZ2h0OiAyLCBtYXJnaW5Cb3R0b206IDEwIH0gfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInIH0gfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uQnV0dG9uLCB7IGljb25DbGFzc05hbWU6ICdtZGkgbWRpLWNoZXZyb24tJyArICh0aGlzLnN0YXRlLnRvZ2dsZWQgPyAndXAnIDogJ2Rvd24nKSwgb25Ub3VjaFRhcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKHsgdG9nZ2xlZDogIV90aGlzLnN0YXRlLnRvZ2dsZWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IH0pXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgeyBzdHlsZTogeyBmbGV4OiAxLCBmb250U2l6ZTogMTYgfSB9LFxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVZhbHVlXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uQnV0dG9uLCB7IGljb25DbGFzc05hbWU6IFVQX0FSUk9XLCBvblRvdWNoVGFwOiBvblN3YXBVcCwgZGlzYWJsZWQ6ICEhIW9uU3dhcFVwIHx8IGRpc2FibGVkIH0pLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb25CdXR0b24sIHsgaWNvbkNsYXNzTmFtZTogRE9XTl9BUlJPVywgb25Ub3VjaFRhcDogb25Td2FwRG93biwgZGlzYWJsZWQ6ICEhIW9uU3dhcERvd24gfHwgZGlzYWJsZWQgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgdG9nZ2xlZCAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KF9Gb3JtUGFuZWwyWydkZWZhdWx0J10sIF9leHRlbmRzKHt9LCB0aGlzLnByb3BzLCB7XG4gICAgICAgICAgICAgICAgdGFiczogbnVsbCxcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IHN1YlZhbHVlcyxcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogbnVsbCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdyZXBsaWNhYmxlLWdyb3VwJyxcbiAgICAgICAgICAgICAgICBkZXB0aDogZGVwdGhcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHRvZ2dsZWQgJiYgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IHN0eWxlOiB7IHBhZGRpbmc6IDQsIHRleHRBbGlnbjogJ3JpZ2h0JyB9IH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGbGF0QnV0dG9uLCB7IGxhYmVsOiAnUmVtb3ZlJywgcHJpbWFyeTogdHJ1ZSwgb25Ub3VjaFRhcDogb25SZW1vdmUsIGRpc2FibGVkOiAhISFvblJlbW92ZSB8fCBkaXNhYmxlZCB9KVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICByZXR1cm4gUmVwbGljYXRlZEdyb3VwO1xufSkoQ29tcG9uZW50KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gUmVwbGljYXRlZEdyb3VwO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX1JlcGxpY2F0ZWRHcm91cCA9IHJlcXVpcmUoJy4vUmVwbGljYXRlZEdyb3VwJyk7XG5cbnZhciBfUmVwbGljYXRlZEdyb3VwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1JlcGxpY2F0ZWRHcm91cCk7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJ21hdGVyaWFsLXVpJyk7XG5cbnZhciBJY29uQnV0dG9uID0gX3JlcXVpcmUuSWNvbkJ1dHRvbjtcblxudmFyIExhbmdVdGlscyA9IHJlcXVpcmUoJ3B5ZGlvL3V0aWwvbGFuZycpO1xuXG4vKipcbiAqIFN1YiBmb3JtIHJlcGxpY2F0aW5nIGl0c2VsZiAoKy8tKVxuICovXG5leHBvcnRzWydkZWZhdWx0J10gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdSZXBsaWNhdGlvblBhbmVsJyxcblxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBwYXJhbWV0ZXJzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgICAgdmFsdWVzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICBvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGRpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgYmluYXJ5X2NvbnRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRlcHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG4gICAgfSxcblxuICAgIGJ1aWxkU3ViVmFsdWU6IGZ1bmN0aW9uIGJ1aWxkU3ViVmFsdWUodmFsdWVzKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IDAgOiBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgdmFyIHN1YlZhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHN1ZmZpeCA9IGluZGV4ID09IDAgPyAnJyA6ICdfJyArIGluZGV4O1xuICAgICAgICB0aGlzLnByb3BzLnBhcmFtZXRlcnMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICB2YXIgcE5hbWUgPSBwWyduYW1lJ107XG4gICAgICAgICAgICBpZiAodmFsdWVzW3BOYW1lICsgc3VmZml4XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzdWJWYWwpIHN1YlZhbCA9IHt9O1xuICAgICAgICAgICAgICAgIHN1YlZhbFtwTmFtZV0gPSB2YWx1ZXNbcE5hbWUgKyBzdWZmaXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN1YlZhbCB8fCBmYWxzZTtcbiAgICB9LFxuXG4gICAgaW5kZXhlZFZhbHVlczogZnVuY3Rpb24gaW5kZXhlZFZhbHVlcyhyb3dzQXJyYXkpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gMCxcbiAgICAgICAgICAgIHZhbHVlcyA9IHt9O1xuICAgICAgICByb3dzQXJyYXkubWFwKGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgICAgIHZhciBzdWZmaXggPSBpbmRleCA9PSAwID8gJycgOiAnXycgKyBpbmRleDtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcm93KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFyb3cuaGFzT3duUHJvcGVydHkocCkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHZhbHVlc1twICsgc3VmZml4XSA9IHJvd1twXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH0sXG5cbiAgICBpbmRleFZhbHVlczogZnVuY3Rpb24gaW5kZXhWYWx1ZXMocm93c0FycmF5LCByZW1vdmVMYXN0Um93KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGluZGV4ZWQgPSB0aGlzLmluZGV4ZWRWYWx1ZXMocm93c0FycmF5KTtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmIChyZW1vdmVMYXN0Um93KSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RSb3cgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRJbmRleCA9IHJvd3NBcnJheS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5wcm9wcy5wYXJhbWV0ZXJzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFJvd1twWyduYW1lJ10gKyAobmV4dEluZGV4ID4gMCA/ICdfJyArIG5leHRJbmRleCA6ICcnKV0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnByb3BzLm9uQ2hhbmdlKGluZGV4ZWQsIHRydWUsIGxhc3RSb3cpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoaW5kZXhlZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5zdGFuY2VzOiBmdW5jdGlvbiBpbnN0YW5jZXMoKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIC8vIEFuYWx5emUgY3VycmVudCB2YWx1ZSB0byBncmFiIG51bWJlciBvZiByb3dzLlxuICAgICAgICB2YXIgcm93cyA9IFtdLFxuICAgICAgICAgICAgc3ViVmFsID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoc3ViVmFsID0gdGhpcy5idWlsZFN1YlZhbHVlKHRoaXMucHJvcHMudmFsdWVzLCBpbmRleCkpIHtcbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICByb3dzLnB1c2goc3ViVmFsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZmlyc3RQYXJhbSA9IHRoaXMucHJvcHMucGFyYW1ldGVyc1swXTtcbiAgICAgICAgaWYgKCFyb3dzLmxlbmd0aCAmJiBmaXJzdFBhcmFtWydyZXBsaWNhdGlvbk1hbmRhdG9yeSddID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVtcHR5VmFsdWUgPSB7fTtcbiAgICAgICAgICAgICAgICBfdGhpczIucHJvcHMucGFyYW1ldGVycy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlWYWx1ZVtwWyduYW1lJ11dID0gcFsnZGVmYXVsdCddIHx8ICcnO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJvd3MucHVzaChlbXB0eVZhbHVlKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfSxcblxuICAgIGFkZFJvdzogZnVuY3Rpb24gYWRkUm93KCkge1xuICAgICAgICB2YXIgbmV3VmFsdWUgPSB7fSxcbiAgICAgICAgICAgIGN1cnJlbnRWYWx1ZXMgPSB0aGlzLmluc3RhbmNlcygpO1xuICAgICAgICB0aGlzLnByb3BzLnBhcmFtZXRlcnMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZVtwWyduYW1lJ11dID0gcFsnZGVmYXVsdCddIHx8ICcnO1xuICAgICAgICB9KTtcbiAgICAgICAgY3VycmVudFZhbHVlcy5wdXNoKG5ld1ZhbHVlKTtcbiAgICAgICAgdGhpcy5pbmRleFZhbHVlcyhjdXJyZW50VmFsdWVzKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlUm93OiBmdW5jdGlvbiByZW1vdmVSb3coaW5kZXgpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlcyA9IHRoaXMuaW5zdGFuY2VzKCk7XG4gICAgICAgIHZhciByZW1vdmVJbnN0ID0gaW5zdGFuY2VzW2luZGV4XTtcbiAgICAgICAgaW5zdGFuY2VzID0gTGFuZ1V0aWxzLmFycmF5V2l0aG91dCh0aGlzLmluc3RhbmNlcygpLCBpbmRleCk7XG4gICAgICAgIGluc3RhbmNlcy5wdXNoKHJlbW92ZUluc3QpO1xuICAgICAgICB0aGlzLmluZGV4VmFsdWVzKGluc3RhbmNlcywgdHJ1ZSk7XG4gICAgfSxcblxuICAgIHN3YXBSb3dzOiBmdW5jdGlvbiBzd2FwUm93cyhpLCBqKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZXMgPSB0aGlzLmluc3RhbmNlcygpO1xuICAgICAgICB2YXIgdG1wID0gaW5zdGFuY2VzW2pdO1xuICAgICAgICBpbnN0YW5jZXNbal0gPSBpbnN0YW5jZXNbaV07XG4gICAgICAgIGluc3RhbmNlc1tpXSA9IHRtcDtcbiAgICAgICAgdGhpcy5pbmRleFZhbHVlcyhpbnN0YW5jZXMpO1xuICAgIH0sXG5cbiAgICBvbkNoYW5nZTogZnVuY3Rpb24gb25DaGFuZ2UoaW5kZXgsIG5ld1ZhbHVlcywgZGlydHkpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlcyA9IHRoaXMuaW5zdGFuY2VzKCk7XG4gICAgICAgIGluc3RhbmNlc1tpbmRleF0gPSBuZXdWYWx1ZXM7XG4gICAgICAgIHRoaXMuaW5kZXhWYWx1ZXMoaW5zdGFuY2VzKTtcbiAgICB9LFxuXG4gICAgb25QYXJhbWV0ZXJDaGFuZ2U6IGZ1bmN0aW9uIG9uUGFyYW1ldGVyQ2hhbmdlKGluZGV4LCBwYXJhbU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICB2YXIgaW5zdGFuY2VzID0gdGhpcy5pbnN0YW5jZXMoKTtcbiAgICAgICAgaW5zdGFuY2VzW2luZGV4XVtwYXJhbU5hbWVdID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMuaW5kZXhWYWx1ZXMoaW5zdGFuY2VzKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgICAgICB2YXIgcGFyYW1ldGVycyA9IF9wcm9wcy5wYXJhbWV0ZXJzO1xuICAgICAgICB2YXIgZGlzYWJsZWQgPSBfcHJvcHMuZGlzYWJsZWQ7XG5cbiAgICAgICAgdmFyIGZpcnN0UGFyYW0gPSBwYXJhbWV0ZXJzWzBdO1xuICAgICAgICB2YXIgcmVwbGljYXRpb25UaXRsZSA9IGZpcnN0UGFyYW1bJ3JlcGxpY2F0aW9uVGl0bGUnXSB8fCBmaXJzdFBhcmFtWydsYWJlbCddO1xuICAgICAgICB2YXIgcmVwbGljYXRpb25EZXNjcmlwdGlvbiA9IGZpcnN0UGFyYW1bJ3JlcGxpY2F0aW9uRGVzY3JpcHRpb24nXSB8fCBmaXJzdFBhcmFtWydkZXNjcmlwdGlvbiddO1xuICAgICAgICB2YXIgcmVwbGljYXRpb25NYW5kYXRvcnkgPSBmaXJzdFBhcmFtWydyZXBsaWNhdGlvbk1hbmRhdG9yeSddID09PSAndHJ1ZSc7XG5cbiAgICAgICAgdmFyIGluc3RhbmNlcyA9IHRoaXMuaW5zdGFuY2VzKCk7XG4gICAgICAgIHZhciBtdWx0aXBsZSA9IGluc3RhbmNlcy5sZW5ndGggPiAxO1xuICAgICAgICB2YXIgcm93cyA9IGluc3RhbmNlcy5tYXAoZnVuY3Rpb24gKHN1YlZhbHVlcywgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBvblN3YXBVcCA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvblN3YXBEb3duID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9uUmVtb3ZlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdmFyIG9uUGFyYW1ldGVyQ2hhbmdlID0gZnVuY3Rpb24gb25QYXJhbWV0ZXJDaGFuZ2UocGFyYW1OYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBfdGhpczMub25QYXJhbWV0ZXJDaGFuZ2UoaW5kZXgsIHBhcmFtTmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAobXVsdGlwbGUgJiYgaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgb25Td2FwVXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMy5zd2FwUm93cyhpbmRleCwgaW5kZXggLSAxKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG11bHRpcGxlICYmIGluZGV4IDwgaW5zdGFuY2VzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBvblN3YXBEb3duID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczMuc3dhcFJvd3MoaW5kZXgsIGluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtdWx0aXBsZSB8fCAhcmVwbGljYXRpb25NYW5kYXRvcnkpIHtcbiAgICAgICAgICAgICAgICBvblJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMzLnJlbW92ZVJvdyhpbmRleCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9wcyA9IHsgb25Td2FwVXA6IG9uU3dhcFVwLCBvblN3YXBEb3duOiBvblN3YXBEb3duLCBvblJlbW92ZTogb25SZW1vdmUsIG9uUGFyYW1ldGVyQ2hhbmdlOiBvblBhcmFtZXRlckNoYW5nZSB9O1xuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1JlcGxpY2F0ZWRHcm91cDJbJ2RlZmF1bHQnXSwgX2V4dGVuZHMoeyBrZXk6IGluZGV4IH0sIF90aGlzMy5wcm9wcywgcHJvcHMsIHsgc3ViVmFsdWVzOiBzdWJWYWx1ZXMgfSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdyZXBsaWNhYmxlLWZpZWxkJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3RpdGxlLWJhcicgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb25CdXR0b24sIHsga2V5OiAnYWRkJywgc3R5bGU6IHsgZmxvYXQ6ICdyaWdodCcgfSwgaWNvbkNsYXNzTmFtZTogJ21kaSBtZGktcGx1cycsIGljb25TdHlsZTogeyBmb250U2l6ZTogMjQgfSwgdG9vbHRpcDogJ0FkZCB2YWx1ZScsIG9uQ2xpY2s6IHRoaXMuYWRkUm93LCBkaXNhYmxlZDogZGlzYWJsZWQgfSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAndGl0bGUnIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcGxpY2F0aW9uVGl0bGVcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2xlZ2VuZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVwbGljYXRpb25EZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICByb3dzXG4gICAgICAgICk7XG4gICAgfVxuXG59KTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIl19
