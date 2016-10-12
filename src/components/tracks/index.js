import mockedTree from '../../mocks/searchtrek-tree-export';

function extractData(data) {
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
      date: data.timestamp ? new Date(data.timestamp).toDateString() : 'n/a'
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

  return convertToTreeView(snapshotToArray(data));
}

function getMocks() {
  const mocks = Object.keys(mockedTree)
    .map(key => ({
      key,
      val: () => mockedTree[key]
    }));
  return extractData(mocks);
}

function fromFirebaseSnapshot(data) {
  return data;
}

export default function Tracks({ Firebase }) {
  const tree$ = Firebase.get('tree');
  return {
    data$: tree$
      .map(extractData)
      .startWith([])
      .remember()
  };
}
