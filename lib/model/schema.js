/*
 * Copyright (c) 2014 Ruben Kleiman under Creative Commons Attribution-ShareAlike 4.0 International License.
 *
 * This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/4.0/ or send a letter
 * to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 *
 */

//var integerRegexp = /^(?:-?(?:0|[1-9][0-9]*))$/;
//var emailRegexp = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;

// CLIENT SIDE --------------------------------------------------------------------------------------------

'use strict';

var
    generalUtils = require('../utilities/generalUtils.js'),

// shared.js contains specs and definitions shared by the client and server
// as well as some client-specific data.
// We extract the only the shared data for incorporation in the server schema.
    shared = require('../../public/scripts/app/shared.js').shared,

// Maximum length of a string in a non-content field that will be saved.
    maxStringLength = 4096,

// Minimum length of a string in a non-content field
    minStringLength = 1,

// Match a url
    urlRegexp = new RegExp("^(http|https|ftp)\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~])*$"),

// fieldSpecCache: An object whose key is a work type and whose value
// is an object whose key is a field name and whose value is the field's spec.
    fieldSpecCache = {};

/**
 * Returns an array of specs as an object whose key
 * is the spec's id and whose value is the spec.
 * @param specArray A spec array for a work type.
 * @returns {{}} Returns an array of specs as an object whose key
 */
function makeWtFieldSpecs(specArray) {
    var specs = {};
    specArray.forEach(function (spec) {
        specs[spec.id] = spec;
    });
    return specs;
}

/**
 * getFieldSpec: Returns the field spec for a field
 * @param workType  The work type
 * @param fieldId The id of the field
 * @returns {*} Returns the field's spec object
 */
var getFieldSpec = function (workType, fieldId) {
    var wtSpecs = fieldSpecCache[workType];
    if (typeof wtSpecs === 'undefined') {
        wtSpecs = makeWtFieldSpecs(shared.workTypeCatalogFieldSpecs[workType]);
        fieldSpecCache[workType] = wtSpecs;
    }
    return wtSpecs[fieldId];
}

// The schema definitions and functions
exports.schema = {

    /**
     * Client value validators are based on the assumption that
     * same checks were made at the client side before sending
     * data to server. Hence, all validation errors are considered fatal.
     */
    validators: {

        /**
         * noop: assumes data is valid
         * @param catalog the catalog object holding field values
         * @param fieldSpec The field's spec
         * @param txId The transaction id
         */
        noop: function (catalog, fieldSpec, txId) {
        },

        /**
         * string: checks the validity of a string value in a field
         * @param catalog the catalog object holding field values
         * @param fieldSpec The field's spec
         * @param txId The transaction id
         */
        string: function (catalog, fieldSpec, txId) {
            var val = catalog[fieldSpec.id];
            var type = typeof val;
            if (type !== 'undefined') {
                if (type !== 'string') {
                    throw new generalUtils.DFLCondition(generalUtils.DFLCondition.fatal,
                        'Field ' + fieldSpec.name + ' must be a string',
                        {txId: txId});
                }
                var min = fieldSpec.min || minStringLength;
                var max = fieldSpec.max || maxStringLength;
                var len = val.length;
                if (len !== 0 && (len < min || len > max)) {
                    if (min === max) {
                        throw new generalUtils.DFLCondition(generalUtils.DFLCondition.fatal,
                            'Field ' + fieldSpec.name + ' must be exactly ' + min + ' characters',
                            {txId: txId});
                    } else {
                        throw new generalUtils.DFLCondition(generalUtils.DFLCondition.fatal,
                            'Field ' + fieldSpec.name + ' must be between ' + min + ' and ' + max + ' characters',
                            {txId: txId});
                    }
                }
            }
        },

        /**
         * collection: checks whether the val is in the collection of allowed values.
         * @param catalog   the catalog object holding field values
         * @param fieldSpec The field's spec
         * @param txId The transaction id
         */
        collection: function (catalog, fieldSpec, txId) {
            var fieldId = fieldSpec.id;
            var val = catalog[fieldId];
            if (typeof val !== 'undefined') {
                var col = shared.definitions.collections[fieldId];
                if (typeof col === 'undefined') {
                    throw new generalUtils.DFLCondition(generalUtils.DFLCondition.fatal,
                        'Field "' + fieldSpec.name + '" must be a collection',
                        {txId: txId});
                }
                if (!col.hasOwnProperty(val)) {
                    throw new generalUtils.DFLCondition(generalUtils.DFLCondition.fatal,
                        'Field "' + fieldSpec.name + '" value (' + val + ' is invalid',
                        {txId: txId});
                }
            }
        },

        /**
         * integer: checks whether the val is an integer
         * @param catalog the catalog object holding field values
         * @param fieldSpec The field's spec
         * @param txId The transaction id
         */
        integer: function (catalog, fieldSpec, txId) {
            var val = catalog[fieldSpec.id];
            if (typeof val !== 'undefined') {
                var int;
                try {
                    int = parseInt(val, 10);
                } catch (error) {
                    int = NaN;
                }
                if (isNaN(int)) {
                    throw new generalUtils.DFLCondition(generalUtils.DFLCondition.fatal,
                        'Field "' + fieldSpec.name + '" value "' + val + '" must be an integer',
                        {txId: txId});
                }
                var min = fieldSpec.min || 0;
                var max = fieldSpec.max || Number.MAX_VALUE;
                if (int < min || int > max) {
                    throw new generalUtils.DFLCondition(generalUtils.DFLCondition.error,
                        'Field "' + fieldSpec.name + '" value "' + val + '" must be between ' + min + ' and ' + max,
                        {txId: txId});
                }
            }
        },

        /**
         * http: checks whether the field value is an URL
         * @param catalog the catalog object holding field values
         * @param fieldSpec The field's spec
         * @param txId The transaction id
         */
        url: function (catalog, fieldSpec, txId) {
            var val = catalog[fieldSpec.id];
            if (typeof val !== 'undefined') {
                if (!urlRegexp.test(val)) {
                    throw new generalUtils.DFLCondition(generalUtils.DFLCondition.error,
                        'Field "' + fieldSpec.name + '" value "' + val + '" must be an URL',
                        {txId: txId});
                }
            }
        }
    }, // end validators

    /**
     * Transformers convert catalog fields from the client into
     * canonical catalog fields for the server. Canonical catalogs
     * are the lingua franca for catalogs and are independent
     * from how the DB stores them. Services use the canonical
     * catalog form.
     */
    transformers: {

        /**
         * noop: doesn't perform any transformation
         * @param fieldSpec The field spec
         * @param catalog   The catalog object
         * @param targetCatalog The target catalog object (into which we are copying data)
         */
        noop: function (fieldSpec, catalog, targetCatalog) {
        },

        /**
         * set: sets the target catalog field directly from the catalog
         * @param fieldSpec The field spec
         * @param catalog   The catalog object
         * @param targetCatalog The target catalog object (into which we are copying data)
         */
        set: function (fieldSpec, catalog, targetCatalog) {
            var fieldId = fieldSpec.id;
            var val = catalog[fieldId];
            if (typeof val !== 'undefined' && val.length !== 0) {
                targetCatalog[fieldSpec.toId || fieldId] = val;
            }
        },

        /**
         * push: pushes the catalog field into a corresponding array in the target catalog
         * @param fieldSpec The field spec
         * @param catalog   The catalog object
         * @param targetCatalog The target catalog object (into which we are copying data)
         */
        push: function (fieldSpec, catalog, targetCatalog) {
            var fieldId = fieldSpec.id;
            var vals = catalog[fieldId];
            var delimiter = ';';
            if (typeof vals !== 'undefined') {
                vals = vals.split(delimiter);
                if (vals.length != 0) {
                    var target = [];
                    var subId = fieldSpec.subId;
                    for (var i in vals) {
                        var name = vals[i];
                        if (name.length != 0) {
                            var obj = {};
                            obj[subId] = name;
                            target.push(obj);
                        }
                    }
                    if (target.length !== 0) {
                        targetCatalog[fieldSpec.toId || fieldId] = target;
                    }
                }
            }
        },

        authors: function (fieldSpec, catalog, targetCatalog) {
            var fieldId = fieldSpec.id;
            var persons = catalog[fieldId];
            if (persons) {
                persons = Array.isArray(persons) ? persons : [persons];  // TODO eventually will get an array from client; then remove this check
                var keywords = '';
                for (var i in persons) {
                    var person = persons[i];
                    keywords += person.fullName;
                    if (person.altNames) {
                        keywords += ' ' + person.altNames;
                    }
                }
                targetCatalog.authors = {keywords: keywords, data: persons};
            }
        },

        editors: function (fieldSpec, catalog, targetCatalog) {
            var fieldId = fieldSpec.id;
            var persons = catalog[fieldId];
            if (persons) {
                persons = Array.isArray(persons) ? persons : [persons];  // TODO eventually will get an array from client; then remove this check
                var keywords = '';
                for (var i in persons) {
                    var person = persons[i];
                    keywords += person.fullName;
                    if (person.altNames) {
                        keywords += ' ' + person.altNames;
                    }
                }
                targetCatalog.editors = {keywords: keywords, data: persons};
            }
        },

        /**
         * subjects: pushes the catalog field into a corresponding array in the target catalog
         * @param fieldSpec The field spec
         * @param catalog   The catalog object
         * @param targetCatalog The target catalog object (into which we are copying data)
         */
        subjects: function (fieldSpec, catalog, targetCatalog) {
            var fieldId = fieldSpec.id;
            var vals = catalog[fieldId]; // TODO eventually get objects with ids, as in authors
            var delimiter = ';';
            var target = {keywords: vals, data: []};
            if (typeof vals !== 'undefined') {
                vals = vals.split(delimiter);
                if (vals.length != 0) {
                    for (var i in vals) {
                        var name = vals[i];
                        if (name.length != 0) {
                            var obj = {};
                            obj['name'] = name;
                            obj['_id'] = 'todo';
                            target.data.push(obj);
                        }
                    }
                    targetCatalog.subjects = target;
                }
            }
        },


        /**
         * construct: builds an object in the target catalog that corresponds the data in the specified catalog
         * @param fieldSpec The field spec
         * @param catalog   The catalog object
         * @param targetCatalog The target catalog object (into which we are copying data)
         */
        construct: function (fieldSpec, catalog, targetCatalog) {
            var fieldId = fieldSpec.id;
            if (catalog[fieldId]) {
                var targetSubId = fieldSpec.subId || fieldId;
                var targetId = fieldSpec.toId || fieldId;
                var obj = targetCatalog[targetId] || new Object();
                obj[targetSubId] = catalog[fieldId];
                targetCatalog[targetId] = obj;
            }
        }
    },

    definitions: shared.definitions,

    /* query: catalog search query fields */
    query: {
        general: '' /* general: text query on any catalog metadata and content */
    },

    makeClientCatalog: shared.makeClientCatalog,

    catalogFieldSpecs: shared.catalogFieldSpecs,

    getFieldSpec: getFieldSpec,

    /**
     * ContentVersion: object contains version information for a catalog item's content.
     * @param id,     The version id, . This is an arbitrary string, but it generally
     * is an integer.
     * @param dateTime The ISO datetime when this version was posted or published (default: now)
     * @constructor
     */
    ContentVersion: function (number, dateTime) {
        this.number = number || '1';
        this.dateTime = dateTime || new Date().toISOString();
    },

    ContentDescription: function () { // TODO incorporate this into UI once main things are working
        /* notes: general notes in freehand */
        this.notes = null;
        /* print: if true, this was published in a print form (default: false) */
        this.print = false;
        /* images: the number of images in work (default: 0). An image can be an illustration, figure, chart, map, etc. */
        this.images = 0;
        /* maps: images that are maps (default: 0) */
        this.maps = 0;
        /* format: if print is true, this is the widthxheight of the book (default: null) */
        this.format = null;
        /* pages: if published in print form, the number of pages (default: null) */
        this.pages = null;
        /* words: number of words in work (default: null) */
        this.words = null;
    },


    Poem: function () {
        this.verses = [];
    },
    Verse: function () {
        this.lines = [];
    }
};