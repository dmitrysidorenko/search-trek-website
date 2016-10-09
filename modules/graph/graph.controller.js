(function () {
  var module = angular.module('graph');
  module.controller('graphController', function ($scope, $timeout) {
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
        var d = normalizeTreeItem(row.val());
        d.id = row.key;
        arr.push({ key: row.key, data: d });
      });
      return arr;
    }

    var byId;

    function normalizeTreeItem(data) {
      const linkPreview = data.linkPreview || {};
      return Object.assign({}, data, {
        preview: Object.assign({}, linkPreview, {
          title: linkPreview.title || data.title,
          url: linkPreview.url || data.pageUrl,
          description: linkPreview.description || '',
          type: linkPreview.type || 'link',
          providerName: linkPreview.provider_name || '',
          thumbnailUrl: linkPreview.thumbnail_url || ''
        }),
        date: data.timestamp ? new Date(data.timestamp).toLocaleDateString() : 'n/a'
      });
    }

    function convertToTreeView(arr) {
      byId = arr.reduce(function (acc, cur) {
        acc[cur.key] = Object.assign({}, cur.data, {
          name: cur.data.title,
          children: []
        });
        return acc;
      }, {});

      return arr.reduce(function (acc, cur) {
        var node = byId[cur.key];
        var parent = byId[node.parentId];
        if (parent && node !== parent) {
          parent.children.push(node);
          node.parentNodeId = parent.id;
        } else {
          acc.push(node);
        }
        return acc;
      }, []);
    }

    $scope.$on('moved', function (event, parent, node) {
      if (node.id === parent.id || node.parentNodeId === parent.id || parent.parentNodeId === node.id) {
        return;
      }
      var newTree = move(node, parent, $scope.tree);
      $timeout(function () {
        $scope.tree = newTree;
      });
      expandAllNodes(newTree);
      /*
       setTimeout(function () {
       $scope.$apply(function () {
       var newTree = move(node, parent, $scope.tree);
       $scope.tree = newTree;
       expandAllNodes(newTree);
       });
       }, 0);
       */
      /*            $timeout(function () {
       parent.children.push(node);
       var oldParent = byId[node.parentNodeId];

       node.parentNodeId = parent.id;

       if (oldParent) {
       oldParent.children = oldParent.children.filter(function (n) {
       return n.id !== node.id
       });
       } else {
       tree = tree.filter(function (n) {
       return n.id !== node.id
       });
       }

       $scope.tree = tree;
       }, 1000);*/
    });

    function move(node, parent, tree) {
      parent.children.push(node);
      var oldParent = byId[node.parentNodeId];

      node.parentNodeId = parent.id;

      if (oldParent) {
        var newOldParent = Object.assign({}, oldParent, {
          children: oldParent.children.filter(function (n) {
            return n.id !== node.id
          })
        });
        return tree.map(function (n) {
          return n === oldParent ? newOldParent : n;
        });
      } else {
        return tree.filter(function (n) {
          return n.id !== node.id
        });
      }
    }

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
    //     "favIconUrl":
    // "https://www.google.com.ua/images/branding/product/ico/googleg_lodp.ico",
    // "openerTabId": 2829, "pageUrl":
    // "https://www.google.com.ua/?gfe_rd=cr&ei=5wf5V7L9JYL67gSWkoHIDw#q=asia",
    // "tabId": 2829, "title": "Google", "name": "Google", "children": [{
    // "favIconUrl": "https://en.wikipedia.org/static/favicon/wikipedia.ico",
    // "openerTabId": 2829, "pageUrl": "https://en.wikipedia.org/wiki/Asia",
    // "parentId": "-KT_20-90cPvNv502xZL", "tabId": 2829, "title": "Asia -
    // Wikipedia, the free encyclopedia", "name": "Asia - Wikipedia, the free
    // encyclopedia", "children": [{ "favIconUrl": "", "openerTabId": 2829,
    // "pageUrl": "https://en.wikipedia.org/wiki/Caucasus_Mountains",
    // "parentId": "-KT_2286WT7gkB19dsut", "tabId": 2829, "title": "Caucasus
    // Mountains - Wikipedia, the free encyclopedia", "name": "Caucasus
    // Mountains - Wikipedia, the free encyclopedia", "children": [{
    // "favIconUrl": "", "openerTabId": 2829, "pageUrl":
    // "https://en.wikipedia.org/wiki/Western_Caucasus", "parentId":
    // "-KT_25NTnswbnIg4rokj", "tabId": 2833, "title": "Western Caucasus -
    // Wikipedia, the free encyclopedia", "name": "Western Caucasus -
    // Wikipedia, the free encyclopedia", "children": [] }, { "favIconUrl": "",
    // "openerTabId": 2829, "pageUrl":
    // "https://en.wikipedia.org/wiki/Likhi_Range", "parentId":
    // "-KT_25NTnswbnIg4rokj", "tabId": 2837, "title": "Likhi Range -
    // Wikipedia, the free encyclopedia", "name": "Likhi Range - Wikipedia, the
    // free encyclopedia", "children": [] }] }] }] }];

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
