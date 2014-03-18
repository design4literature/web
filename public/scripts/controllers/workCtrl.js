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

// CLIENT SIDE --------------------------------------------------------------------------------------------

'use strict';


var testAnnotation = {
    name: 'Multi-hilite',
    views: {
        selection: [
            {
                note: {lang: 'en', text: 'Note the repetition: male/malae. <i>bellus</i> is a colloquial form of <i>bonus</i>. Catullus, like the <i>novi poetae</i>, is unafraid of diminutives and vernacular language. ' +
                    '<br/>See: <a class="note" href="http://www.perseus.tufts.edu/hopper/morph?l=bellus&la=la" target="_blank">Perseus Latin Word Study Tool</a>'},
                sids: [1, 2], // selector ids
                method: 'sid', /* Find the text to hilite using the given sids */
                css: {'class': 'D_HY'}
            },
            {
                note: {lang: 'en', text: 'Note the repetition: bella/bellum. <i>bellus</i> is a colloquial form of <i>bonus</i>. Catullus, like the <i>novi poetae</i>, is unafraid of diminutives and vernacular language. ' +
                    '<br/>See: <a class="note" href="http://www.perseus.tufts.edu/hopper/morph?l=bellus&la=la" target="_blank">Perseus Latin Word Study Tool</a>'},
                sids: [3, 4], // selector ids
                method: 'sid', /* Find the text to hilite using the given sids */
                css: {'class': 'D_HR'}
            }
        ]
    }, /* end views */
    actions: {
        hover: {
            text: ''
        }
    }, /* end actions */
    context: {
        parent: 'body'
    } /* end context */
};

var work =
{ content: "<D_P>" +
    "        <D_V>" +
    "        <D_L>Lugete, o Veneres Cupidinesque</D_L>" +
    "        <D_L>et quantum est hominum venustiorum!</D_L>" +
    "        <D_L>passer mortuus est meae puellae,</D_L>" +
    "        <D_L>passer, deliciae meae puellae,</D_L>" +
    "        <D_L>quem plus illa oculis suis amabat;</D_L>" +
    "        <D_L>nam mellitus erat, suamque norat</D_L>" +
    "        <D_L>ipsa tam bene quam puella matrem,</D_L>" +
    "        <D_L>nec sese a gremio illius movebat,</D_L>" +
    "        <D_L>sed circumsiliens modo huc modo illuc</D_L>" +
    "        <D_L>ad solam dominam usque pipiabat.</D_L>" +
    "        <D_L>qui nunc it per iter tenebricosum</D_L>" +
    "       <D_L>illuc unde negant redire quemquam.</D_L>" +
    "        <D_L>at vobis" +
    "<d_ss sid='1'/>" +
    "        male" +
    "<d_se sid='1'/>" +
    "        sit," +
    "<d_ss sid='2'/>" +
    "        malae" +
    "<d_se sid='2'/>" +
    "        tenebrae" +
    "        </D_L>" +
    "        <D_L>Orci, quae omnia" +
    "<d_ss sid='3'/>" +
    "        bella" +
    "<d_se sid='3'/>" +
    "        devoratis;" +
    "</D_L>" +
    "        <D_L>tam" +
    "<d_ss sid='4'/>" +
    "        bellum" +
    "<d_se sid='4'/>" +
    "        mihi passerem abstulistis." +
    "</D_L>" +
    "        <D_L>o factum male! o miselle passer!</D_L>" +
    "        <D_L>tua nunc opera meae puellae</D_L>" +
    "        <D_L>flendo turgiduli rubent ocelli.</D_L>" +
    "</D_V>" +
    "</D_P>",
    type: 'Poem'
};

horaceApp.controller('WorkCtrl', function ($scope, EditorEngine2, WorkDirectoryService, EditorSettings, UserPrefs, $stateParams) {


    function makeJtreeData(toc, jtreeData) { // TODO deal with a huge outline // TODO make recursive for all levels
        for (var i in toc) {
            var chunk = toc[i],
                toplevelItem = {id: chunk.id, icon: false, text: chunk.title};
            jtreeData.push(toplevelItem);
            if (chunk.sections && chunk.sections.length !== 0) {
                toplevelItem.children = [];
                makeJtreeData(chunk.sections, toplevelItem.children);
            }
        }
    }

    /* Execute after document loads */
    $scope.$on('$viewContentLoaded', function () { // TODO this only works for poems now
        $.ajax({ // TODO convert to $http call for consistency
            type: "GET",
            url: 'catalog/work/chunk?id=' + $scope.editor.id,
            success: function (a, b) {
                if (a.type === 'ack') {
                    if (a.content) {
                        try {
                            $scope.editor.activateSettings(EditorSettings);
                            $scope.editor.workDirectory = WorkDirectoryService.makeDirectory(a.content);
                            var jtreeData = [],
                                jtreeToc = {
//                                    plugins: ['search'],
                                    core: {multiple: false, data: jtreeData}
                                };
                            makeJtreeData(a.content.toc, jtreeData);

//                            var to = false;
//                            $('#tocSearch').keyup(function () {
//                                if (to) {
//                                    clearTimeout(to);
//                                }
//                                to = setTimeout(function () {
//                                    var v = $('#tocSearch').val();
//                                    var r = $('#toc').jstree(true).search(v);
//                                    console.info(r);
//                                }, 3000);
//                            });

                            $('#toc').jstree(jtreeToc);
                            $('#toc').on('changed.jstree', function (event, data) {
                                var chunkInfo = $scope.editor.workDirectory.getChunkInfo(data.node.id, function (err, chunkInfo) {
                                    $scope.editor.setContent(chunkInfo);
                                });
//                                console.info('Changed: ' + JSON.stringify(data.node.text) + ' id: ' + data.node.id);
                            });
                            $('#toc').on('hover_node.jstree', function (event, data) {
//                                console.info('Hover: ' + JSON.stringify(data.node.text) + ' id: ' + data.node.id);
                            });
                            // Set initial content TODO pick up "last location" from user history
                            $scope.editor.workDirectory.getChunkInfo(a.content.id, function (err, chunkInfo) {
                                $.jstree.reference('#toc').select_node(a.content.id);
                                $scope.editor.setContent(chunkInfo);
                            });
                        } catch (error) {
                            console.trace(error.message, error.stack); // TODO handle this
                        }
                    } else {
                        alert('no content'); // TODO handle this
                        console.trace(a)
                    }
                } else { // TODO handle development error
                    console.trace(a);
                }
            },
            error: function (err) {
                console.trace(err); // TODO handle real error
            }
        });
    });

    /* Drawer: a drawer UI object. TODO might be in a service if it is useful elsewhere */
    function Drawer(name) {
        this.snap = new Snap({element: document.getElementById(name)});
        this.toggle = function () {
            if(this.snap.state().state=="left" ){
                this.snap.close();
            } else {
                this.snap.open('left');
            }
        }
    }

    $scope.editor = {

        /* drawer: contains table of contents and perhaps other aids */
        drawer: new Drawer('tocDrawer'),

        id: $stateParams.id,

        /* Start pagination controls */
        pager: {
            currentPage: 1,
            totalPages: 10,
            setPage: function (pageno) {
                if (pageno > 0 && pageno <= $scope.editor.pager.totalPages) {
                    $scope.editor.pager.currentPage = pageno;
                }
            },
            changePage: function () {
                var val = $('#pageSelector')[0].value;
            }
        },
        /* End pagination controls */

        workDirectory: undefined,

        setContent: function (chunkInfo) {
            var layout = $scope.editor.engine.workTypeLayouts[chunkInfo.dataType];
            if (layout) {
                layout(chunkInfo);
            } else {
                console.trace({type: 'fatal', msg: 'Invalid work chunk layout type "' + chunkInfo.dataType + '"'});
            }
        },

        /**
         * Activates settings. Removes current settings.
         * @param settings The editor's settings object.
         */
        activateSettings: function (settings) {

            function activateSettingStyles() {
                var styles = $('#d_styles');
                if (!styles || styles.length === 0) {
                    throw {type: 'fatal', msg: 'Default styles (id d_styles) missing'};
                }
                var className;
                var style;
                var html = '';
                for (className in settings.styles) {
                    if (settings.styles.hasOwnProperty(className)) {
                        style = settings.styles[className];
                        html += style + ' ';
                    }
                }
                styles[0].innerHTML = html;
            }

            activateSettingStyles();
        },

        // stub function to do a test annotation
        test: function () {
            var viewMethName;
            for (viewMethName in testAnnotation.views) {
                if (testAnnotation.views.hasOwnProperty(viewMethName)) {
                    var viewMeth = $scope.editor.engine.viewMethods[viewMethName];
                    if (viewMeth) {
                        viewMeth($scope, testAnnotation);
                    } else {
                        throw {type: 'fatal', msg: 'No view method named "' + viewMethName + '"'};
                    }
                }
            }
        },

        // stub function to clear all annotation views
        clearAnnotationViews: function () {
            $(EditorSettings.nodeNames.selectionSpan).each(function (i) {
                var child = $(this)[0].firstChild;
                $(this).replaceWith(child);

            });
        }
    };
    /* End of $scope.editor */

// Set the editor engine to use
    $scope.editor.engine = EditorEngine2;

// Set the user preferences
    $scope.editor.prefs = UserPrefs;

});
/* End EditCtrl */
