/*
 *The MIT License (MIT)
 *
 *Copyright (c) 2014 Ruben Kleiman
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *and associated documentation files (the "Software"), to deal in the Software without restriction,
 *including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 *subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in all copies or
 *substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 *INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 *PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 *LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
 *THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// SERVER SIDE --------------------------------------------------------------------------------------------

'use strict';

///* app: The express app */
//var app;

var express = require('express');

var appUtils = require('../utilities/generalUtils.js');

/* Require MongoDB implementation */
var store = require('../store/storeManager.js');

/* Object schemas */
var schemas = require('../model/schema.js');

var poemMethods = require('./methods/poemMethods.js').methods;

/**
 * Contains the private methods for this service.
 * TODO this needs to be in sync with the work types defined in shared.js Solution: conditionally define these functions in shared.js when file is loaded into node.js
 */
var workType = {

    methods: {
        WebSite: poemMethods,
        WebPage: poemMethods,
        BookPoetry: poemMethods,
        Poem: poemMethods,
        BookDrama: poemMethods,
        BookNovel: poemMethods,
        BookNonFiction: poemMethods,
        BookFiction: poemMethods,
        BookShortStories: poemMethods,
        ShortStory: poemMethods,
        JournalArticle: poemMethods,
        MagazineArticle: poemMethods,
        FreeFormat: poemMethods
    }
};

/**
 * The public API for the catalog service.
 */
var catalogService = {

    saveMetadata: function (session, catalog, callback) {
        try {
            store.saveCatalogMetadata(session, catalog, callback);
        } catch (error) {
            callback(appUtils.makeError(error));
        }
    },

    /* search: searches catalog per query */
    search: function (query, callback) {
        try {
            store.searchCatalog(query, callback); // TODO move this meth to search service
        } catch (error) {
            callback(appUtils.makeError(error));
        }
    },

    /**
     * saveContent: Updates an existing or inserts a new catalog item. The item must
     * be in canonical form.
     *
     * 1. Canonicalize the catalog metadata and any contents if its format is not canonical.
     * 2. If the catalog has an id, the id requests this to be processed as an update;
     *    else, a new catalog item is created.
     * 3. Add or update the catalog item (in the store) using the appropriate method specified in the
     *    catalog's format and workType fields.
     *
     * Sends notifications as necessary for warnings and successful completion, but not for errors.
     */
    saveContent: function (session, catalog, callback) {

        // TODO turn this into a queue-based service (at least, for parsing any content)
        // TODO TODO TODO must handle changing catalog metadata versus saving contents: they should be separate operations from the client

        if (catalog.content && catalog.content.length > 0) {
            if (catalog.workType) {
                var workTypeMethods = workType.methods[catalog.workType];
                if (workTypeMethods) {
                    var formatName = catalog.contentFormat;
                    if (formatName) {
                        var format = workTypeMethods[formatName];
                        if (format) {
                            var canonicalizeContentMeth = format.canonicalize;
                            if (canonicalizeContentMeth && (typeof canonicalizeContentMeth === 'function')) {
                                canonicalizeContentMeth(catalog);
                                store.saveCatalogContent(session, catalog, callback);
                            } else {
                                callback({type: 'fatal', msg: 'No method for canonicalizing work. contentFormat "' + formatName + '" workType "' + catalog.workType + '" item id ' + catalog.id + ' title: "' + catalog.title + '"'});
                            }
                        } else {
                            callback({type: 'fatal', msg: 'No support for work contentFormat "' + formatName + '" workType "' + catalog.workType + '" item id ' + catalog.id + ' title: "' + catalog.title + '"'});
                        }
                    } else {
                        callback({type: 'fatal', msg: 'No support for work contentFormat "' + formatName + '" workType "' + catalog.workType + '" item id ' + catalog.id + ' title: "' + catalog.title + '"'});
                    }
                } else {
                    callback({type: 'fatal', msg: 'No workType "' + catalog.workType + '" for item id ' + catalog.id + ' title: "' + catalog.title + '"'});
                }
            } else {
                callback({type: 'fatal', msg: 'Work workType is missing for item id ' + catalog.id + ' title: ' + catalog.title});
            }
        } else {
            express.get('sockets').getSocket(session, express.get('notificationSocketName')).emit('note', {type: 'warn', msg: 'Catalog item had no content'});
            console.warn({type: 'trans', msg: 'Missing content'});
        }
    }
};

exports.catalogService = catalogService;
