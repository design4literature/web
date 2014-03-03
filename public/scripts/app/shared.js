/*
 The MIT License (MIT)

 Copyright (c) 2014 Ruben Kleiman

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

// Keeping everything in one file for now to facilitate quick prototyping... but...

// TODO Clean up so we don't pollute globals; also isolate and eliminate objs not needed by server

/* shallowCopyObj: a simple shallow copy of the object (no inheritance) */
function shallowCopyObj(obj) {
    var copy = {};
    for (var prop in obj) {
        copy[prop] = obj[prop];
    }
    return copy;
}
function objectOverrides(obj, overrides) {
    for (var key in overrides) {
        obj[key] = overrides[key];
    }
    return obj;
}
function makeRequired(obj) {
    var copy = shallowCopyObj(obj);
    if (copy.description) {
        copy.description = 'REQUIRED FIELD. ' + copy.description;
    }
    return objectOverrides(copy, {required: true});
}


// langs: language dropdown (TODO should come from server)
/**
 * @author Phil Teare
 * using wikipedia data
 */
var isoLangs = {
    "en":{
        "name":"English",
        "nativeName":"English"
    },
    "ab":{
        "name":"Abkhaz",
        "nativeName":"аҧсуа"
    },
    "aa":{
        "name":"Afar",
        "nativeName":"Afaraf"
    },
    "af":{
        "name":"Afrikaans",
        "nativeName":"Afrikaans"
    },
    "ak":{
        "name":"Akan",
        "nativeName":"Akan"
    },
    "sq":{
        "name":"Albanian",
        "nativeName":"Shqip"
    },
    "am":{
        "name":"Amharic",
        "nativeName":"አማርኛ"
    },
    "ar":{
        "name":"Arabic",
        "nativeName":"العربية"
    },
    "an":{
        "name":"Aragonese",
        "nativeName":"Aragonés"
    },
    "hy":{
        "name":"Armenian",
        "nativeName":"Հայերեն"
    },
    "as":{
        "name":"Assamese",
        "nativeName":"অসমীয়া"
    },
    "av":{
        "name":"Avaric",
        "nativeName":"авар мацӀ, магӀарул мацӀ"
    },
    "ae":{
        "name":"Avestan",
        "nativeName":"avesta"
    },
    "ay":{
        "name":"Aymara",
        "nativeName":"aymar aru"
    },
    "az":{
        "name":"Azerbaijani",
        "nativeName":"azərbaycan dili"
    },
    "bm":{
        "name":"Bambara",
        "nativeName":"bamanankan"
    },
    "ba":{
        "name":"Bashkir",
        "nativeName":"башҡорт теле"
    },
    "eu":{
        "name":"Basque",
        "nativeName":"euskara, euskera"
    },
    "be":{
        "name":"Belarusian",
        "nativeName":"Беларуская"
    },
    "bn":{
        "name":"Bengali",
        "nativeName":"বাংলা"
    },
    "bh":{
        "name":"Bihari",
        "nativeName":"भोजपुरी"
    },
    "bi":{
        "name":"Bislama",
        "nativeName":"Bislama"
    },
    "bs":{
        "name":"Bosnian",
        "nativeName":"bosanski jezik"
    },
    "br":{
        "name":"Breton",
        "nativeName":"brezhoneg"
    },
    "bg":{
        "name":"Bulgarian",
        "nativeName":"български език"
    },
    "my":{
        "name":"Burmese",
        "nativeName":"ဗမာစာ"
    },
    "ca":{
        "name":"Catalan; Valencian",
        "nativeName":"Català"
    },
    "ch":{
        "name":"Chamorro",
        "nativeName":"Chamoru"
    },
    "ce":{
        "name":"Chechen",
        "nativeName":"нохчийн мотт"
    },
    "ny":{
        "name":"Chichewa; Chewa; Nyanja",
        "nativeName":"chiCheŵa, chinyanja"
    },
    "zh":{
        "name":"Chinese",
        "nativeName":"中文 (Zhōngwén), 汉语, 漢語"
    },
    "cv":{
        "name":"Chuvash",
        "nativeName":"чӑваш чӗлхи"
    },
    "kw":{
        "name":"Cornish",
        "nativeName":"Kernewek"
    },
    "co":{
        "name":"Corsican",
        "nativeName":"corsu, lingua corsa"
    },
    "cr":{
        "name":"Cree",
        "nativeName":"ᓀᐦᐃᔭᐍᐏᐣ"
    },
    "hr":{
        "name":"Croatian",
        "nativeName":"hrvatski"
    },
    "cs":{
        "name":"Czech",
        "nativeName":"česky, čeština"
    },
    "da":{
        "name":"Danish",
        "nativeName":"dansk"
    },
    "dv":{
        "name":"Divehi; Dhivehi; Maldivian;",
        "nativeName":"ދިވެހި"
    },
    "nl":{
        "name":"Dutch",
        "nativeName":"Nederlands, Vlaams"
    },
//    "en":{
//        "name":"English",
//        "nativeName":"English"
//    },
    "eo":{
        "name":"Esperanto",
        "nativeName":"Esperanto"
    },
    "et":{
        "name":"Estonian",
        "nativeName":"eesti, eesti keel"
    },
    "ee":{
        "name":"Ewe",
        "nativeName":"Eʋegbe"
    },
    "fo":{
        "name":"Faroese",
        "nativeName":"føroyskt"
    },
    "fj":{
        "name":"Fijian",
        "nativeName":"vosa Vakaviti"
    },
    "fi":{
        "name":"Finnish",
        "nativeName":"suomi, suomen kieli"
    },
    "fr":{
        "name":"French",
        "nativeName":"français, langue française"
    },
    "ff":{
        "name":"Fula; Fulah; Pulaar; Pular",
        "nativeName":"Fulfulde, Pulaar, Pular"
    },
    "gl":{
        "name":"Galician",
        "nativeName":"Galego"
    },
    "ka":{
        "name":"Georgian",
        "nativeName":"ქართული"
    },
    "de":{
        "name":"German",
        "nativeName":"Deutsch"
    },
    "el":{
        "name":"Greek, Modern",
        "nativeName":"Ελληνικά"
    },
    "gn":{
        "name":"Guaraní",
        "nativeName":"Avañeẽ"
    },
    "gu":{
        "name":"Gujarati",
        "nativeName":"ગુજરાતી"
    },
    "ht":{
        "name":"Haitian; Haitian Creole",
        "nativeName":"Kreyòl ayisyen"
    },
    "ha":{
        "name":"Hausa",
        "nativeName":"Hausa, هَوُسَ"
    },
    "he":{
        "name":"Hebrew (modern)",
        "nativeName":"עברית"
    },
    "hz":{
        "name":"Herero",
        "nativeName":"Otjiherero"
    },
    "hi":{
        "name":"Hindi",
        "nativeName":"हिन्दी, हिंदी"
    },
    "ho":{
        "name":"Hiri Motu",
        "nativeName":"Hiri Motu"
    },
    "hu":{
        "name":"Hungarian",
        "nativeName":"Magyar"
    },
    "ia":{
        "name":"Interlingua",
        "nativeName":"Interlingua"
    },
    "id":{
        "name":"Indonesian",
        "nativeName":"Bahasa Indonesia"
    },
    "ie":{
        "name":"Interlingue",
        "nativeName":"Occidental/Interlingue"
    },
    "ga":{
        "name":"Irish",
        "nativeName":"Gaeilge"
    },
    "ig":{
        "name":"Igbo",
        "nativeName":"Asụsụ Igbo"
    },
    "ik":{
        "name":"Inupiaq",
        "nativeName":"Iñupiaq, Iñupiatun"
    },
    "io":{
        "name":"Ido",
        "nativeName":"Ido"
    },
    "is":{
        "name":"Icelandic",
        "nativeName":"Íslenska"
    },
    "it":{
        "name":"Italian",
        "nativeName":"Italiano"
    },
    "iu":{
        "name":"Inuktitut",
        "nativeName":"ᐃᓄᒃᑎᑐᑦ"
    },
    "ja":{
        "name":"Japanese",
        "nativeName":"日本語 (にほんご／にっぽんご)"
    },
    "jv":{
        "name":"Javanese",
        "nativeName":"basa Jawa"
    },
    "kl":{
        "name":"Kalaallisut, Greenlandic",
        "nativeName":"kalaallisut, kalaallit oqaasii"
    },
    "kn":{
        "name":"Kannada",
        "nativeName":"ಕನ್ನಡ"
    },
    "kr":{
        "name":"Kanuri",
        "nativeName":"Kanuri"
    },
    "ks":{
        "name":"Kashmiri",
        "nativeName":"कश्मीरी, كشميري‎"
    },
    "kk":{
        "name":"Kazakh",
        "nativeName":"Қазақ тілі"
    },
    "km":{
        "name":"Khmer",
        "nativeName":"ភាសាខ្មែរ"
    },
    "ki":{
        "name":"Kikuyu, Gikuyu",
        "nativeName":"Gĩkũyũ"
    },
    "rw":{
        "name":"Kinyarwanda",
        "nativeName":"Ikinyarwanda"
    },
    "ky":{
        "name":"Kirghiz, Kyrgyz",
        "nativeName":"кыргыз тили"
    },
    "kv":{
        "name":"Komi",
        "nativeName":"коми кыв"
    },
    "kg":{
        "name":"Kongo",
        "nativeName":"KiKongo"
    },
    "ko":{
        "name":"Korean",
        "nativeName":"한국어 (韓國語), 조선말 (朝鮮語)"
    },
    "ku":{
        "name":"Kurdish",
        "nativeName":"Kurdî, كوردی‎"
    },
    "kj":{
        "name":"Kwanyama, Kuanyama",
        "nativeName":"Kuanyama"
    },
    "la":{
        "name":"Latin",
        "nativeName":"latine, lingua latina"
    },
    "lb":{
        "name":"Luxembourgish, Letzeburgesch",
        "nativeName":"Lëtzebuergesch"
    },
    "lg":{
        "name":"Luganda",
        "nativeName":"Luganda"
    },
    "li":{
        "name":"Limburgish, Limburgan, Limburger",
        "nativeName":"Limburgs"
    },
    "ln":{
        "name":"Lingala",
        "nativeName":"Lingála"
    },
    "lo":{
        "name":"Lao",
        "nativeName":"ພາສາລາວ"
    },
    "lt":{
        "name":"Lithuanian",
        "nativeName":"lietuvių kalba"
    },
    "lu":{
        "name":"Luba-Katanga",
        "nativeName":""
    },
    "lv":{
        "name":"Latvian",
        "nativeName":"latviešu valoda"
    },
    "gv":{
        "name":"Manx",
        "nativeName":"Gaelg, Gailck"
    },
    "mk":{
        "name":"Macedonian",
        "nativeName":"македонски јазик"
    },
    "mg":{
        "name":"Malagasy",
        "nativeName":"Malagasy fiteny"
    },
    "ms":{
        "name":"Malay",
        "nativeName":"bahasa Melayu, بهاس ملايو‎"
    },
    "ml":{
        "name":"Malayalam",
        "nativeName":"മലയാളം"
    },
    "mt":{
        "name":"Maltese",
        "nativeName":"Malti"
    },
    "mi":{
        "name":"Māori",
        "nativeName":"te reo Māori"
    },
    "mr":{
        "name":"Marathi (Marāṭhī)",
        "nativeName":"मराठी"
    },
    "mh":{
        "name":"Marshallese",
        "nativeName":"Kajin M̧ajeļ"
    },
    "mn":{
        "name":"Mongolian",
        "nativeName":"монгол"
    },
    "na":{
        "name":"Nauru",
        "nativeName":"Ekakairũ Naoero"
    },
    "nv":{
        "name":"Navajo, Navaho",
        "nativeName":"Diné bizaad, Dinékʼehǰí"
    },
    "nb":{
        "name":"Norwegian Bokmål",
        "nativeName":"Norsk bokmål"
    },
    "nd":{
        "name":"North Ndebele",
        "nativeName":"isiNdebele"
    },
    "ne":{
        "name":"Nepali",
        "nativeName":"नेपाली"
    },
    "ng":{
        "name":"Ndonga",
        "nativeName":"Owambo"
    },
    "nn":{
        "name":"Norwegian Nynorsk",
        "nativeName":"Norsk nynorsk"
    },
    "no":{
        "name":"Norwegian",
        "nativeName":"Norsk"
    },
    "ii":{
        "name":"Nuosu",
        "nativeName":"ꆈꌠ꒿ Nuosuhxop"
    },
    "nr":{
        "name":"South Ndebele",
        "nativeName":"isiNdebele"
    },
    "oc":{
        "name":"Occitan",
        "nativeName":"Occitan"
    },
    "oj":{
        "name":"Ojibwe, Ojibwa",
        "nativeName":"ᐊᓂᔑᓈᐯᒧᐎᓐ"
    },
    "cu":{
//        "name":"Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
        "name":"Old Church Slavonic",
        "nativeName":"ѩзыкъ словѣньскъ"
    },
    "om":{
        "name":"Oromo",
        "nativeName":"Afaan Oromoo"
    },
    "or":{
        "name":"Oriya",
        "nativeName":"ଓଡ଼ିଆ"
    },
    "os":{
        "name":"Ossetian, Ossetic",
        "nativeName":"ирон æвзаг"
    },
    "pa":{
        "name":"Panjabi, Punjabi",
        "nativeName":"ਪੰਜਾਬੀ, پنجابی‎"
    },
    "pi":{
        "name":"Pāli",
        "nativeName":"पाऴि"
    },
    "fa":{
        "name":"Persian",
        "nativeName":"فارسی"
    },
    "pl":{
        "name":"Polish",
        "nativeName":"polski"
    },
    "ps":{
        "name":"Pashto, Pushto",
        "nativeName":"پښتو"
    },
    "pt":{
        "name":"Portuguese",
        "nativeName":"Português"
    },
    "qu":{
        "name":"Quechua",
        "nativeName":"Runa Simi, Kichwa"
    },
    "rm":{
        "name":"Romansh",
        "nativeName":"rumantsch grischun"
    },
    "rn":{
        "name":"Kirundi",
        "nativeName":"kiRundi"
    },
    "ro":{
        "name":"Romanian, Moldavian, Moldovan",
        "nativeName":"română"
    },
    "ru":{
        "name":"Russian",
        "nativeName":"русский язык"
    },
    "sa":{
        "name":"Sanskrit (Saṁskṛta)",
        "nativeName":"संस्कृतम्"
    },
    "sc":{
        "name":"Sardinian",
        "nativeName":"sardu"
    },
    "sd":{
        "name":"Sindhi",
        "nativeName":"सिन्धी, سنڌي، سندھی‎"
    },
    "se":{
        "name":"Northern Sami",
        "nativeName":"Davvisámegiella"
    },
    "sm":{
        "name":"Samoan",
        "nativeName":"gagana faa Samoa"
    },
    "sg":{
        "name":"Sango",
        "nativeName":"yângâ tî sängö"
    },
    "sr":{
        "name":"Serbian",
        "nativeName":"српски језик"
    },
    "gd":{
        "name":"Scottish Gaelic; Gaelic",
        "nativeName":"Gàidhlig"
    },
    "sn":{
        "name":"Shona",
        "nativeName":"chiShona"
    },
    "si":{
        "name":"Sinhala, Sinhalese",
        "nativeName":"සිංහල"
    },
    "sk":{
        "name":"Slovak",
        "nativeName":"slovenčina"
    },
    "sl":{
        "name":"Slovene",
        "nativeName":"slovenščina"
    },
    "so":{
        "name":"Somali",
        "nativeName":"Soomaaliga, af Soomaali"
    },
    "st":{
        "name":"Southern Sotho",
        "nativeName":"Sesotho"
    },
    "es":{
        "name":"Spanish; Castilian",
        "nativeName":"español, castellano"
    },
    "su":{
        "name":"Sundanese",
        "nativeName":"Basa Sunda"
    },
    "sw":{
        "name":"Swahili",
        "nativeName":"Kiswahili"
    },
    "ss":{
        "name":"Swati",
        "nativeName":"SiSwati"
    },
    "sv":{
        "name":"Swedish",
        "nativeName":"svenska"
    },
    "ta":{
        "name":"Tamil",
        "nativeName":"தமிழ்"
    },
    "te":{
        "name":"Telugu",
        "nativeName":"తెలుగు"
    },
    "tg":{
        "name":"Tajik",
        "nativeName":"тоҷикӣ, toğikī, تاجیکی‎"
    },
    "th":{
        "name":"Thai",
        "nativeName":"ไทย"
    },
    "ti":{
        "name":"Tigrinya",
        "nativeName":"ትግርኛ"
    },
    "bo":{
        "name":"Tibetan Standard, Tibetan, Central",
        "nativeName":"བོད་ཡིག"
    },
    "tk":{
        "name":"Turkmen",
        "nativeName":"Türkmen, Түркмен"
    },
    "tl":{
        "name":"Tagalog",
        "nativeName":"Wikang Tagalog"
    },
    "tn":{
        "name":"Tswana",
        "nativeName":"Setswana"
    },
    "to":{
        "name":"Tonga (Tonga Islands)",
        "nativeName":"faka Tonga"
    },
    "tr":{
        "name":"Turkish",
        "nativeName":"Türkçe"
    },
    "ts":{
        "name":"Tsonga",
        "nativeName":"Xitsonga"
    },
    "tt":{
        "name":"Tatar",
        "nativeName":"татарча, tatarça, تاتارچا‎"
    },
    "tw":{
        "name":"Twi",
        "nativeName":"Twi"
    },
    "ty":{
        "name":"Tahitian",
        "nativeName":"Reo Tahiti"
    },
    "ug":{
        "name":"Uighur, Uyghur",
        "nativeName":"Uyƣurqə, ئۇيغۇرچە‎"
    },
    "uk":{
        "name":"Ukrainian",
        "nativeName":"українська"
    },
    "ur":{
        "name":"Urdu",
        "nativeName":"اردو"
    },
    "uz":{
        "name":"Uzbek",
        "nativeName":"zbek, Ўзбек, أۇزبېك‎"
    },
    "ve":{
        "name":"Venda",
        "nativeName":"Tshivenḓa"
    },
    "vi":{
        "name":"Vietnamese",
        "nativeName":"Tiếng Việt"
    },
    "vo":{
        "name":"Volapük",
        "nativeName":"Volapük"
    },
    "wa":{
        "name":"Walloon",
        "nativeName":"Walon"
    },
    "cy":{
        "name":"Welsh",
        "nativeName":"Cymraeg"
    },
    "wo":{
        "name":"Wolof",
        "nativeName":"Wollof"
    },
    "fy":{
        "name":"Western Frisian",
        "nativeName":"Frysk"
    },
    "xh":{
        "name":"Xhosa",
        "nativeName":"isiXhosa"
    },
    "yi":{
        "name":"Yiddish",
        "nativeName":"ייִדיש"
    },
    "yo":{
        "name":"Yoruba",
        "nativeName":"Yorùbá"
    },
    "za":{
        "name":"Zhuang, Chuang",
        "nativeName":"Saɯ cueŋƅ, Saw cuengh"
    }
};

function getLangs() {
    var langs = [];
    for (var i in isoLangs) {
        var lang = isoLangs[i];
        langs.push([i, lang.name])
    }
    return langs;
}
var langs = getLangs();

function getCodes(obj) {
    var i, codes = {};
    for (i in obj) {
        var code = obj[i][0];
        codes[code] = code;
    }
    return codes;
}

langs.codes = getCodes(langs);

// contentFormats: formats for uploaded content
var contentFormats = {
    dflMarkdown: 'dflMarkdown'
};
contentFormats.options = [
    [contentFormats.dflMarkdown, 'DFL Markdown']
];

/**
 * workTypeSpecs: specs for each work type
 * TODO should come from server
 * key: the work type code
 * value: the work type spec
 * Each spec contains:
 * name := the displayable name for this work type TODO replace with lang string id
 * source := {file | url | ... }
 *    file := provider must upload a content file
 *    url := content is specified by an url in the catalog item
 *    ... := TBD
 * rank: An integer denoting display order (presentation)
 // TODO see workType in catalogService.js (nodejs)
 */
var workTypeSpecs = {
    WebSite: {name: 'Web Site', source: 'url', rank: 1},
    WebPage: {name: 'Web Page', source: 'url', rank: 2},
    BookPoetry: {name: 'Poetry (Book)', source: 'file', rank: 3},
    Poem: {name: 'Poem', source: 'file', rank: 4},
    BookDrama: {name: 'Drama (Book)', source: 'file', rank: 5},
    BookNovel: {name: 'Novel (Book)', source: 'file', rank: 6},
    BookNonFiction: {name: 'Non-Fiction (Book)', source: 'file', rank: 7},
    BookFiction: {name: 'Fiction (Book)', source: 'file', rank: 8},
    BookShortStories: {name: 'Short Stories (Book)', source: 'file', rank: 9},
    ShortStory: {name: 'Short Story', source: 'file', rank: 10},
    JournalArticle: {name: 'Article (Journal)', source: 'file', rank: 11},
    MagazineArticle: {name: 'Article (Magazine)', source: 'file', rank: 12},
    FreeFormat: {name: 'Free Format Text', source: 'file', rank: 13}
};

function makeWorkTypes() {
    function insertSort(obj, rankPropName) { // TODO move to utils
        for (var i = 0, j, other; i < obj.length; ++i) {
            other = obj[i];
            for (j = i - 1; j >= 0 && obj[j][rankPropName] > other[rankPropName]; --j)
                obj[j + 1] = obj[j];
            obj[j + 1] = other;
        }
    }
    var presentationArray = [];
    for (var key in workTypeSpecs) {
        var spec = workTypeSpecs[key];
        var obj = {};
        for (var i in spec) {
            obj[i] = spec[i];
        }
        obj.code = key;
        presentationArray.push(obj);
    }
    insertSort(presentationArray, 'rank'); // change to quick if specs get larger

    return presentationArray;
}

//workTypes.codes = getCodes(workTypes);

var catalogFieldNames = {
    workType: 'workType',
    id: 'id',
    title: 'title',
    lang: 'lang',
    authors: 'authors',
    editors: 'editors',
    edition: 'edition',
    publisherAddress: 'publisherAddress',
    publisherName: 'publisherName',
    publisherCity: 'publisherCity',
    publisherProvince: 'publisherCountry',
    publisherCountry: 'publisherProvince',
    copyright: 'copyright',
    subjects: 'subjects',
    pageUrl: 'pageUrl',
    websiteUrl: 'websiteUrl',
    contentFormat: 'contentFormat'
};
var makePrettyFuns = {
    default: function(id, name, value) {
            var span = '<span>';
            if (font) {
                span += '<' + font + '>' + name + ': ' + '</' + font + '>' + value;
            } else {
                span += name + ': ' + value;
            }
            if (delim) {
                span += '; ';
            }
            return span + '</span>';
    }
};
function makePrettyDefault(info) {
    return info;
}
/**
 * catalogFieldSpecs: Presentation specs for each catalog field
 * id := the id of the field
 * name := displayable name
 * type := {text | input | select | typeahead} to present in a textarea or drop-down menu, respectively
 *     text := presented as a textarea, input := presented as an input, select := presented as a menu, typeahead := presented as a typeahead
 * require := {true | false}
 * options := collection of options (used by select type) in display order
 * specs := specifications object for each collection element keyed by code (value is the spec)
 * validator := the validation method
 * xformer := the object transformer := {set | push | construct}, where
 *    set := sets the server-side value with the client's value without transformation
 *    push := pushes the client's value into a server-side array
 *    construct := builds a server-side object with the client's value. The key for the constructed
 *                 server-side object is the toId (see publisher as an example), and the key
 *                 for the client-side value is the subId if it is defined, else the id itself.
 *    When transforming an object, the server-side property is the same id.
 * min := the minimum length (string) or value (number) of the object
 * max := the maximum length or value of the object
 * toId := an alternate id to use server-side; if not provided, then defaults to the id field
 * subId := the id of the value in an object (server-side); if not provided, then defaults to the toId
 * inForm := {true | false} true if field should be shown in catalog metadata form
 * TODO get these from server (autogenerated from various sources--e.g., ISO languages) or just generate into this file
 */
var catalogFieldSpecs = { // TODO incorporate the value type (string/number/choice) and constraints (min/max size, etc)
    workType: {id: 'workType', required: true, name: 'Work Type', type: 'select', specs: workTypeSpecs, options: makeWorkTypes(), validator: 'string', xformer: 'set', inForm: false, rank: 20, prettyFun: makePrettyDefault},
    id: {id: '_id', name: 'Identifier', type: 'input', description: 'Unique identifier for the catalog item', min: 36, max: 36, validator: 'string', xformer: 'set', inForm: true, rank: 0, prettyFun: makePrettyDefault},
    title: {id: 'title', name: 'Title', type: 'text', min: 1, description: "The work's original title", validator: 'string', xformer: 'set', inForm: true, rank: 10, prettyFun: makePrettyDefault},
    lang: {id: 'lang', name: 'Language', type: 'select', options: langs, min: 2, max: 8, description: 'The main language in which the work for this catalog item is written', validator: 'string', xformer: 'set', inForm: true, rank: 30, prettyFun: makePrettyDefault},
    authors: {id: 'authors', subId: 'fullName', subIdName: 'Name', name: 'Author(s)', type: 'text', description: 'A list of the original author(s) of this work', validator: 'string', xformer: 'push', inForm: true, rank: 50, prettyFun: makePrettyDefault},
    editors: {id: 'editors', subId: 'fullName', subIdName: 'Name', name: 'Editor(s)', type: 'text', description: 'For anthologies and other collections, this is a list of the original editor(s) of this work.', validator: 'string', xformer: 'push', inForm: true, rank: 60, prettyFun: makePrettyDefault},
    edition: {id: 'edition', name: 'Edition', type: 'input', description: 'The edition of this work. This must be a number.', validator: 'integer', min: 1, max: 1000, xformer: 'set', inForm: true, rank: 40, prettyFun: makePrettyDefault}, // TODO present a number wheel?
    publisherAddress: {id: 'publisherAddress', toId: 'publisher', 'subId': 'address', subIdName: 'Full Address', name: "Publisher Address", type: 'typeahead', description: "The address of this work's publisher", validator: 'string', xformer: 'construct', inForm: true, rank: 1, prettyFun: makePrettyDefault},
    publisherName: {id: 'publisherName', toId: 'publisher', 'subId': 'name', name: 'Publisher Name', type: 'input', min: 1, description: "The name of this work's publisher", xform: 'map', xformer: 'construct', validator: 'string', inForm: true, rank: 70, prettyFun: makePrettyDefault},
    publisherCity: {id: 'publisherCity', toId: 'publisher', 'subId': 'city', name: 'Publisher City', type: 'input', description: "The publisher's city", xform: 'map', xformer: 'construct', validator: 'string', inForm: true, rank: 80, prettyFun: makePrettyDefault},
    publisherProvince: {id: 'publisherProvince', toId: 'publisher', 'subId': 'province', name: 'Publisher Province', type: 'input', description: "The publisher's province or state", xform: 'map', xformer: 'construct', validator: 'string', inForm: true, rank: 90, prettyFun: makePrettyDefault},
    publisherCountry: {id: 'publisherCountry', toId: 'publisher', 'subId': 'country', name: 'Publisher Country', type: 'input', description: "The publisher's country", xform: 'map', xformer: 'construct', validator: 'string', inForm: true, rank: 100, prettyFun: makePrettyDefault},
    copyright: {id: 'copyright', name: 'Copyright', type: 'text', min: 8, description: "A copyright description", validator: 'string', xformer: 'set', inForm: true, rank: 110, prettyFun: makePrettyDefault},
    subjects: {id: 'subjects', subId: 'name', name: 'Subject(s)', type: 'text', description: "Subjects areas pertaining to this work", validator: 'string', xformer: 'push', inForm: true, rank: 120, prettyFun: makePrettyDefault},
    pageUrl: {id: 'pageUrl', name: 'Page URL', type: 'input', placeholder: 'http://', min: 10, description: "The URL to the page cited by this catalog item", validator: 'url', xformer: 'set', inForm: true, rank: 11, prettyFun: makePrettyDefault},
    websiteUrl: {id: 'websiteUrl', name: 'Website URL', type: 'input', placeholder: 'http://', min: 10, description: "The URL to the home page cited by this catalog item", validator: 'url', xformer: 'set', inForm: true, rank: 11, prettyFun: makePrettyDefault},
    contentFormat: {id: 'contentFormat', name: 'Content Format', type: 'select', description: "The format of an uploaded content file", validator: 'noop', xformer: 'set', inForm: false, rank: 1000, prettyFun: makePrettyDefault} // TODO set to appropriate validator instead of noop
};

/**
 * catalogFieldSubSpecs: these are further specs for each subId and toId field appearing in the catalogFieldSpecs.
 * The key is the subId (or toId) and the value is an object with the spec for the subId or toId.
 * name := the displayable name for the subId or toId
 */
var catalogFieldSubSpecs = {
    fullName: {name: 'Name'},
    publisher: {name: 'Publisher'},
    name: {name: 'Name'},
    city: {name: 'City'},
    province: {name: 'Province'},
    country: {name: 'Country'},
    address: {name: 'Address'}
};

/** workTypeCatalogFieldSpecs: Each work type's set of field specs ordered for presentation. */
var workTypeCatalogFieldSpecs = {
    WebSite: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.lang),
        makeRequired(catalogFieldSpecs.websiteUrl),
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType
//        catalogFieldSpecs.contentFormat
    ],
    WebPage: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.lang),
        makeRequired(catalogFieldSpecs.pageUrl),
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType
//        catalogFieldSpecs.contentFormat
    ],
    BookPoetry: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ],
    Poem: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ],
    BookDrama: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ],
    BookNovel: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ],
    BookNonFiction: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ],
    BookFiction: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ],
    BookShortStories: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ],
    ShortStory: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ],
    JournalArticle: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ],
    MagazineArticle: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ],
    FreeFormat: [
        catalogFieldSpecs.id,
        makeRequired(catalogFieldSpecs.title),
        makeRequired(catalogFieldSpecs.lang),
        catalogFieldSpecs.authors ,
        catalogFieldSpecs.editors ,
        catalogFieldSpecs.edition ,
        catalogFieldSpecs.publisherName ,
        catalogFieldSpecs.publisherAddress ,
        catalogFieldSpecs.publisherCity ,
        catalogFieldSpecs.publisherProvince ,
        catalogFieldSpecs.publisherCountry ,
        catalogFieldSpecs.copyright ,
        catalogFieldSpecs.subjects,
        catalogFieldSpecs.workType,
        catalogFieldSpecs.contentFormat
    ]
};

/* client: groups all metadata client with nodejs server */
var client = {

    /* workTypeOptions: client uses this for work type menu */
    workTypeOptions: catalogFieldSpecs.workType.options,

    /* shared: data shared between server and client. TODO this is a stub. Should come from server DB */
    shared: {

        /**
         * definitions: Shared between server and client.
         */
        definitions: {

            /*
             * Collections used for validation, etc.
             * Key: the field id, value: the collection of possible values for the field.
             */
            collections: {
                /* Supported bcp47 language codes */
                lang: langs.codes
            },

            contentFormats: contentFormats,

            /* The size in characters allowed in each content chunk */
            chunkSize: 40, // TODO make this 4096 (or more) for production

            /* The content formats for CatalogOptions.contentFormat */
            contentFormatRaw: 'raw',
            contentFormatCanonical: 'canonical'
        },

        /**
         * workTypeCatalogFieldSpecs: some info may appear client-specific (e.g., placeholder)
         * but can be conceived of as a constraint (e.g., placeholder := a default value).
         */
        workTypeCatalogFieldSpecs: workTypeCatalogFieldSpecs,

        catalogFieldSpecs: catalogFieldSpecs,

        catalogFieldSubSpecs: catalogFieldSubSpecs,

        /**
         * makeClientCatalog: creates a client catalog based on the work type.
         * @param workType  The work type
         * @return {*} A client catalog for the specified work type
         */
        makeClientCatalog: function (workType) {
            var cat = {};
            var specs = workTypeCatalogFieldSpecs[workType];
            if (typeof specs === 'undefined') {
                throw {type: 'fatal', msg: 'Missing specs for work type ' + workType};
            }
            for (var i in specs) {
                var spec = specs[i];
                cat[spec.id] = undefined;
            }
            return cat;
        }
    }
};

if ('undefined' === typeof horaceApp) {
    exports.shared = client.shared; // export to nodejs
}