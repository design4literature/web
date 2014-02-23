/*
 The MIT License (MIT)

 Copyright (c) 2013 Ruben Kleiman

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// CLIENT (SOME SHARED WITH SERVER) --------------------------------------------------------------------------------

'use strict';

// TODO Clean up so we don't pollute globals

var langs = [
    ['grc', 'Ancient Greek (grc)'],
    ['en', 'English (en)'],
    ['la', 'Latin (la)']
];
langs.codes = function () {
    var i, codes = {};
    for (i in this) {
        var code = this[i][0];
        codes[code] = code;
    }
    return codes;
};

var workTypes = [
    ['WebSite', 'Web Site'],
    ['WebPage', 'Web Page'],
    ['BookPoems', 'Book of Poems'],
    ['Poem', 'Poem'],
    ['BookNovel', 'Novel (Book)'],
    ['BookNonFiction', 'Non-Fiction (Book)'],
    ['BookShortStories', 'Short Stories (Book)'],
    ['ShortStory', 'Short Story'],
    ['JournalArticle', 'Article (Journal)'],
    ['MagazineArticle', 'Article (Magazine)'],
    ['Unknown', 'Other (Unknown Corpus)']
];
workTypes.codes = langs.codes;

/**
 * catalogFieldSpecs: Presentation specs for each catalog field
 * id := the id of the field
 * name := displayable name
 * type := {text | select} to present in a textarea or drop-down menu, respectively
 * require := {true | false}
 * TODO get these from server (autogenerated from various sources--e.g., ISO languages) or just generate this file
 */
var catalogFieldSpecs = {
    id: {id: 'id', name: 'Identifier', type: 'input'},
    title: {id: 'title', required: true, name: 'Title', type: 'text'},
    lang: {id: 'lang', required: true, name: 'Language', type: 'select', options: langs},
    workType: {id: 'workType', required: true, name: 'Work Type', type: 'select', options: workTypes},
    authors: {id: 'authors', name: 'Author(s)', type: 'text'},
    editors: {id: 'editors', name: 'Editor(s)', type: 'text'},
    edition: {id: 'edition', name: 'Edition', type: 'input'}, // TODO a number wheel?
    publisherName: {id: 'publisherName', name: 'Publisher', type: 'input'},
    publisherCity: {id: 'publisherCity', name: 'Publisher City', type: 'input'},
    publisherProvince: {id: 'publisherProvince', name: 'Publisher Province', type: 'input'},
    publisherCountryISO: {id: 'publisherCountryISO', name: 'Publisher Country', type: 'input'},
    copyright: {id: 'copyright', name: 'Copyright', type: 'text'},
    subjects: {id: 'subjects', name: 'Subject(s)', type: 'text'}, // TODO some kind of keyword widget?
    pageUrl: {id: 'pageUrl', name: 'Page URL', type: 'input'},
    websiteUrl: {id: 'websiteUrl', name: 'Website URL', type: 'input', placeholder: 'http://'} // TODO add placeholders for text/input fields
};

/** definitions: common constants */
var definitions = {

    // TODO consolidate languages into one descriptor
    // TODO move this into a service so that data can be (more) dynamically fetched from server and there won't be a need to shared this file

    /* Supported bcp47 language codes */
    lang: langs.codes(langs),

    workType: workTypes.codes(),

    /* The content formats for CatalogOptions.contentFormat */
    contentFormatRaw: 'raw',
    contentFormatCanonical: 'canonical'
};

/* client: groups all metadata client with nodejs server */
var client = {


    shared: {
        /**
         * definitions: Shared between server and client.
         */
        definitions: definitions,

        /**
         * ClientCatalog: catalog metadata fields for the client. Must keep this
         * in synch with server-side schema.js
         * @constructor
         */
        ClientCatalog: function () { // TODO rename ClientCatalogMetadata
            this.notify = true; // use notifications TODO remove this from ClientCatalog object itself
            this.id = undefined;
            this.title = undefined;
            this.lang = undefined;
            this.workType = undefined; // TODO make blank
            this.authors = undefined;
            this.editors = undefined;
            this.edition = undefined;
            this.publisherName = undefined;
            this.publisherCity = undefined;
            this.publisherProvince = undefined;
            this.publisherCountryISO = undefined;
            this.copyright = undefined;
            this.subjects = undefined;
            this.similarEditions = undefined;
//        contentFormat: 'raw' // TODO this is part of the content upload process--doesn't belong here
        }
    },

    catalogFieldSpecs: catalogFieldSpecs, // TODO really needed?

    workTypeCatalogFieldInfo: {
        BookPoems: [
            catalogFieldSpecs.id,
            catalogFieldSpecs.title ,
            catalogFieldSpecs.lang ,
            catalogFieldSpecs.authors ,
            catalogFieldSpecs.editors ,
            catalogFieldSpecs.edition ,
            catalogFieldSpecs.publisherName ,
            catalogFieldSpecs.publisherCity ,
            catalogFieldSpecs.publisherProvince ,
            catalogFieldSpecs.publisherCountryISO ,
            catalogFieldSpecs.copyright ,
            catalogFieldSpecs.subjects
        ],
        WebSite: [
            catalogFieldSpecs.id,
            catalogFieldSpecs.title ,
            catalogFieldSpecs.lang ,
            catalogFieldSpecs.websiteUrl ,
            catalogFieldSpecs.copyright ,
            catalogFieldSpecs.subjects
        ],
        WebPage: [
            catalogFieldSpecs.id,
            catalogFieldSpecs.title ,
            catalogFieldSpecs.lang ,
            catalogFieldSpecs.authors ,
            catalogFieldSpecs.editors ,
            catalogFieldSpecs.edition ,
            catalogFieldSpecs.publisherName ,
            catalogFieldSpecs.publisherCity ,
            catalogFieldSpecs.publisherProvince ,
            catalogFieldSpecs.publisherCountryISO ,
            catalogFieldSpecs.copyright ,
            catalogFieldSpecs.subjects
        ],
        Poem: [
            catalogFieldSpecs.id,
            catalogFieldSpecs.title ,
            catalogFieldSpecs.lang ,
            catalogFieldSpecs.authors ,
            catalogFieldSpecs.editors ,
            catalogFieldSpecs.edition ,
            catalogFieldSpecs.publisherName ,
            catalogFieldSpecs.publisherCity ,
            catalogFieldSpecs.publisherProvince ,
            catalogFieldSpecs.publisherCountryISO ,
            catalogFieldSpecs.copyright ,
            catalogFieldSpecs.subjects],
        BookNovel: [
            catalogFieldSpecs.id,
            catalogFieldSpecs.title ,
            catalogFieldSpecs.lang ,
            catalogFieldSpecs.authors ,
            catalogFieldSpecs.editors ,
            catalogFieldSpecs.edition ,
            catalogFieldSpecs.publisherName ,
            catalogFieldSpecs.publisherCity ,
            catalogFieldSpecs.publisherProvince ,
            catalogFieldSpecs.publisherCountryISO ,
            catalogFieldSpecs.copyright ,
            catalogFieldSpecs.subjects],
        BookNonFiction: [
            catalogFieldSpecs.id,
            catalogFieldSpecs.title ,
            catalogFieldSpecs.lang ,
            catalogFieldSpecs.authors ,
            catalogFieldSpecs.editors ,
            catalogFieldSpecs.edition ,
            catalogFieldSpecs.publisherName ,
            catalogFieldSpecs.publisherCity ,
            catalogFieldSpecs.publisherProvince ,
            catalogFieldSpecs.publisherCountryISO ,
            catalogFieldSpecs.copyright ,
            catalogFieldSpecs.subjects],
        BookShortStories: [
            catalogFieldSpecs.id,
            catalogFieldSpecs.title ,
            catalogFieldSpecs.lang ,
            catalogFieldSpecs.authors ,
            catalogFieldSpecs.editors ,
            catalogFieldSpecs.edition ,
            catalogFieldSpecs.publisherName ,
            catalogFieldSpecs.publisherCity ,
            catalogFieldSpecs.publisherProvince ,
            catalogFieldSpecs.publisherCountryISO ,
            catalogFieldSpecs.copyright ,
            catalogFieldSpecs.subjects],
        ShortStory: [
            catalogFieldSpecs.id,
            catalogFieldSpecs.title ,
            catalogFieldSpecs.lang ,
            catalogFieldSpecs.authors ,
            catalogFieldSpecs.editors ,
            catalogFieldSpecs.edition ,
            catalogFieldSpecs.publisherName ,
            catalogFieldSpecs.publisherCity ,
            catalogFieldSpecs.publisherProvince ,
            catalogFieldSpecs.publisherCountryISO ,
            catalogFieldSpecs.copyright ,
            catalogFieldSpecs.subjects],
        JournalArticle: [
            catalogFieldSpecs.id,
            catalogFieldSpecs.title ,
            catalogFieldSpecs.lang ,
            catalogFieldSpecs.authors ,
            catalogFieldSpecs.editors ,
            catalogFieldSpecs.edition ,
            catalogFieldSpecs.publisherName ,
            catalogFieldSpecs.publisherCity ,
            catalogFieldSpecs.publisherProvince ,
            catalogFieldSpecs.publisherCountryISO ,
            catalogFieldSpecs.copyright ,
            catalogFieldSpecs.subjects],
        Unknown: [
            catalogFieldSpecs.id,
            catalogFieldSpecs.title ,
            catalogFieldSpecs.lang ,
            catalogFieldSpecs.authors ,
            catalogFieldSpecs.editors ,
            catalogFieldSpecs.edition ,
            catalogFieldSpecs.publisherName ,
            catalogFieldSpecs.publisherCity ,
            catalogFieldSpecs.publisherProvince ,
            catalogFieldSpecs.publisherCountryISO ,
            catalogFieldSpecs.copyright ,
            catalogFieldSpecs.subjects]
    }
};

if ('undefined' === typeof horaceApp) {
    exports.shared = client.shared; // export to nodejs
}