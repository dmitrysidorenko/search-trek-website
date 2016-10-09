(function () {
    var module = angular.module('graph');
    module.controller('graphController', function ($scope) {
        /*$scope.showSelected = function (node, selected) {
         debugger
         $scope.selectedNode = node;
         };*/

        var config = {
            apiKey: "AIzaSyC5N0FavZVS3L-FWaBXnLtuKgC0qJ9CDUE",
            authDomain: "searchtrek.firebaseapp.com",
            databaseURL: "https://searchtrek.firebaseio.com",
            storageBucket: "searchtrek.appspot.com",
            messagingSenderId: "612488784459"
        };
        firebase.initializeApp(config);

        var treeRef = firebase.database().ref('tree');
        treeRef.on('value', function (s) {
            $scope.$apply(function () {
                $scope.tree = convertToTreeView(snapshotToArray(s));
                expandAllNodes.call(this, $scope.tree);
            });
        });

        function snapshotToArray(snapshot) {
            var arr = [];
            snapshot.forEach(function (row) {
                var d = row.val();
                arr.push({key: row.key, data: d});
            });
            return arr;
        }

        function convertToTreeView(arr) {
            var byId = arr.reduce(function (acc, cur) {
                acc[cur.key] = Object.assign({}, cur.data, {
                    name: cur.data.title,
                    children: []
                });
                return acc;
            }, {});
            console.log('ById', byId);
            return arr.reduce(function (acc, cur) {
                var node = byId[cur.key];
                var parent = byId[node.parentId];
                if (parent && node !== parent) {
                    parent.children.push(node);
                } else {
                    acc.push(node);
                }
                return acc;
            }, []);
        }

        $scope.selectedNode;

        $scope.showSelected = function (node, selected) {
            $scope.onSelection(node, selected);
        };


        $scope.treeOptions = {
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
        };

        // $scope.tree = [{
        //     "favIconUrl": "https://www.google.com.ua/images/branding/product/ico/googleg_lodp.ico",
        //     "openerTabId": 2829,
        //     "pageUrl": "https://www.google.com.ua/?gfe_rd=cr&ei=5wf5V7L9JYL67gSWkoHIDw#q=asia",
        //     "tabId": 2829,
        //     "title": "Google",
        //     "name": "Google",
        //     "children": [{
        //         "favIconUrl": "https://en.wikipedia.org/static/favicon/wikipedia.ico",
        //         "openerTabId": 2829,
        //         "pageUrl": "https://en.wikipedia.org/wiki/Asia",
        //         "parentId": "-KT_20-90cPvNv502xZL",
        //         "tabId": 2829,
        //         "title": "Asia - Wikipedia, the free encyclopedia",
        //         "name": "Asia - Wikipedia, the free encyclopedia",
        //         "children": [{
        //             "favIconUrl": "",
        //             "openerTabId": 2829,
        //             "pageUrl": "https://en.wikipedia.org/wiki/Caucasus_Mountains",
        //             "parentId": "-KT_2286WT7gkB19dsut",
        //             "tabId": 2829,
        //             "title": "Caucasus Mountains - Wikipedia, the free encyclopedia",
        //             "name": "Caucasus Mountains - Wikipedia, the free encyclopedia",
        //             "children": [{
        //                 "favIconUrl": "",
        //                 "openerTabId": 2829,
        //                 "pageUrl": "https://en.wikipedia.org/wiki/Western_Caucasus",
        //                 "parentId": "-KT_25NTnswbnIg4rokj",
        //                 "tabId": 2833,
        //                 "title": "Western Caucasus - Wikipedia, the free encyclopedia",
        //                 "name": "Western Caucasus - Wikipedia, the free encyclopedia",
        //                 "children": []
        //             }, {
        //                 "favIconUrl": "",
        //                 "openerTabId": 2829,
        //                 "pageUrl": "https://en.wikipedia.org/wiki/Likhi_Range",
        //                 "parentId": "-KT_25NTnswbnIg4rokj",
        //                 "tabId": 2837,
        //                 "title": "Likhi Range - Wikipedia, the free encyclopedia",
        //                 "name": "Likhi Range - Wikipedia, the free encyclopedia",
        //                 "children": []
        //             }]
        //         }]
        //     }]
        // }];

        $scope.expandedNodes = [];
        function expandAllNodes(tree) {
            tree.forEach(function (leaf) {
                if (leaf.children) {
                    $scope.expandedNodes.push(leaf);
                    expandAllNodes.call(this, leaf.children);
                }
            });
        }

        //expandAllNodes.call(this, $scope.tree);
    });
})();
