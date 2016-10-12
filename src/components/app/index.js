import React from 'react';
import { Stream as xs } from 'xstream/core';
import parseSearchString from '../../utils/parseSearchString';
import Page from '../../reactComponents/page';
import Configuration from '../../components/configuration';
import { default as TracksSource } from '../../components/tracks';
import Tracks from '../../reactComponents/tracks';
import PageNavbar from '../../reactComponents/page-navbar';
import PageContent from '../../reactComponents/page-content';
import NodeInspector from '../../reactComponents/node-inspector';

function makeRouteFromCategories(router, categories$) {
  return categories$
    .map(categories => {
      return categories.reduce((acc, { id }) => {
        acc['/' + id] = { type: 'category', payload: id };
        return acc;
      }, {});
    })
    .fold((acc, cur) => {
      return { ...acc, ...cur };
    }, {
      '/': { type: 'root' },
      '/categories': {
        type: 'category-list'
      },
      '/games/:id': id => ({ type: 'games', payload: id })
    })
    .map(router.define.bind(router))
    .flatten()
    .filter(r => r.value && r.value.type)
    .remember()
    .map(r => {
      return {
        ...r,
        search: parseSearchString(r.location.search)
      };
    });
}
function makeRemoveNodeUrl(nodeId) {
  return 'http://localhost:8888/api/tree/' + nodeId;
}
function makeMoveNodeUrl(nodeId, toNodeId) {
  return 'http://localhost:8888/api/tree/' + nodeId + '/move/' + toNodeId;
}
function makeCutNodeUrl(nodeId) {
  return 'http://localhost:8888/api/tree/' + nodeId + '/cut';
}

function renderDummy() {
  return <div className="workplace--side-bar--page-list--dummy">Select node to
    show its
    properties</div>
}


function view(state$, interact) {
  return state$
    .map((state) => {
      const {
        config,
        route,
        runningGame,
        categories,
        isMenuShown,
        selectedMenuItem,
        tracks,
        selectedNodes,
        mode
      } = state;

      const finalCategories = categories.map(c => {
        return {
          ...c,
          href: route.createHref(c.path),
          isActive: c.path === route.path
        };
      });

      function renderSettings() {
        return (
          <div className="workplace--side-bar--page-list--dummy">Settings will be here</div>
        );
      }

      function renderTracks() {
        return (
          <div className="workplace columns is-gapless is-marginless"
               style={{ position: 'relative' }}>

            <div className="column is-two-thirds workplace--content">
              <Tracks data={tracks}
                      selectedNodes={selectedNodes}
                      onClickNode={interact.cb('node-clicked')}
              />
            </div>

            <div className="column workplace--side-bar">
              <div className="workplace--side-bar--page-list">
                {selectedNodes.map((n, i) => (
                  <div key={i} className="workplace--side-bar--page">
                    <NodeInspector node={n}
                                   onNodeRemove={interact.cb('remove-selected-node')}
                                   onNodeMove={interact.cb('move-selected-node')}
                                   onNodeCut={interact.cb('cut-selected-node')}/>
                  </div>
                ))}
                {selectedNodes.length < 1 && renderDummy()}
              </div>
            </div>
          </div>
        );
      }

      return (
        <Page isGameRunning={runningGame}>
          <PageNavbar logoUrl={config.logoUrl}
                      activeMenuItem={selectedMenuItem && selectedMenuItem.displayName}
                      onToggleMenu={interact.cb('toggle-menu')}
                      isMenuShown={isMenuShown}
                      menuItems={finalCategories}/>

          <PageContent>
            {state.selectedMenuItem && state.selectedMenuItem.id === 'tracks' && renderTracks()}
            {state.selectedMenuItem && state.selectedMenuItem.id === 'settings' && renderSettings()}
          </PageContent>
        </Page>
      );
    })
}

export default function App(sources) {
  const configuration = Configuration({ HTTP: sources.HTTP });
  const config$ = configuration.config$;
  const rawCategories$ = config$
    .map(c => c.lobbyCategories);

  const route$ = makeRouteFromCategories(sources.router, rawCategories$);

  const selectedMenuItemId$ = route$
    .map(r => {
      if (r.value.type === 'category') {
        return r.value.payload;
      }
      return null;
    })
    .startWith(null);

  const categories$ =
    rawCategories$
      .map(categories => categories.map(c => ({
        path: '/' + c.id,
        id: c.id,
        displayName: c.displayName
      })))
      .startWith([])
      .remember();

  const isMenuShown$ = route$
    .map(r => {
      return sources.interact.get('toggle-menu')
        .fold(acc => {
          return !acc;
        }, false)
    })
    .flatten();

  const selectedMenuItem$ = categories$
    .map(categories => {
      return selectedMenuItemId$.map(id => {
        return categories.filter(c => c.id === id)[0] || null;
      })
    })
    .flatten()
    .startWith(null);

  const redirectToFirstMenuItem$ = categories$
    .map(categories => {
      return route$
        .filter(r => r.path === '/')
        .mapTo(categories[0])
    })
    .flatten()
    .filter(v => !!v)
    .map(c => '/' + c.id);

  const tracks = TracksSource({ Firebase: sources.Firebase });

  const removeSelectedNode$ = sources.interact.get('remove-selected-node');
  const moveSelectedNode$ = sources.interact.get('move-selected-node');
  const cutSelectedNode$ = sources.interact.get('cut-selected-node');

  const resetSelectedNodes$ = sources.Action.filter(({ type }) => ['removing-node', 'moving-node', 'cutting-node'].indexOf(type) > -1)

  const selectedNodes$ = xs
    .merge(
      tracks.data$.mapTo([])
      , resetSelectedNodes$.mapTo([])
    )
    .map(() => {
      return sources.interact
        .get('node-clicked')
        .debug('[node-clicked]')
        .fold((acc, node) => {
          console.debug('[node-clicked]:INSIDE');
          return acc.indexOf(node) > -1
            ? acc.filter(n => n !== node)
            : [...acc, node];
        }, [])
        .debug('---->')
    })
    //    .debug('RESET selectedNodes')
    .flatten()
    .startWith([])
    .debug('OUTPUT selectedNodes');

  const mode$ = xs
    .merge(
      removeSelectedNode$.mapTo('remove'),
      moveSelectedNode$.mapTo('move'),
      cutSelectedNode$.mapTo('cut'),
      //selectedNodes$.filter(({ length }) => length ===
      // 0).mapTo('idle').debug('selectedNodes$ for MODE'),
      resetSelectedNodes$.mapTo('idle')
    )
    .fold((_, m) => m, 'idle')
    .debug('MODE');

  const state$ = xs
    .combine(
      config$,
      route$,
      selectedMenuItemId$,
      categories$,
      isMenuShown$,
      selectedMenuItem$,
      tracks.data$,
      mode$,
      selectedNodes$.debug('selectedNodes$ for STATE')
    )
    .map(([
      config,
      route,
      selectedMenuItemId,
      categories,
      isMenuShown,
      selectedMenuItem,
      tracks,
      mode,
      selectedNodes
    ]) => {
      return {
        config,
        route,
        selectedMenuItemId,
        categories,
        isMenuShown,
        selectedMenuItem,
        tracks,
        selectedNodes,
        mode
      };
    });

  const vdom$ = view(state$, sources.interact);

  const removeNodeRequest$ = xs
    .combine(mode$, selectedNodes$)
    .filter(([mode, nodes]) => mode === 'remove' && nodes.length > 0)
    .map(([mode, nodes]) => xs.of(...nodes.map(n => {
      return {
        url: makeRemoveNodeUrl(n.id),
        method: 'DELETE',
        category: 'remove-node'
      };
    })))
    .flatten();

  const moveNodeRequest$ = xs
    .combine(mode$, selectedNodes$)
    .debug(x => {
      console.debug('moveNodeRequest$', x);
    })
    .filter(([mode, nodes]) => mode === 'move' && nodes.length === 2)
    .map(([mode, nodes]) => {
      return xs.of({
        url: makeMoveNodeUrl(nodes[0].id, nodes[1].id),
        method: 'POST',
        category: 'move-node'
      });
    })
    .flatten();

  const cutNodeRequest$ = xs
    .combine(mode$, selectedNodes$)
    .filter(([mode, nodes]) => mode === 'cut' && nodes.length > 0)
    .map(([mode, nodes]) => xs.of(...nodes.map(n => {
      return {
        url: makeCutNodeUrl(n.id),
        method: 'DELETE',
        category: 'cut-node'
      };
    })))
    .flatten();

  const httpSink$ = xs.merge(
    configuration.HTTP,
    removeNodeRequest$,
    moveNodeRequest$,
    cutNodeRequest$
  ).debug('HTTP');

  const routerSink$ = xs.merge(
    redirectToFirstMenuItem$
  );

  const actions$ = xs.merge(
    removeNodeRequest$.mapTo({ type: 'removing-node' }),
    moveNodeRequest$.mapTo({ type: 'moving-node' }),
    cutNodeRequest$.mapTo({ type: 'cutting-node' })
  );

  return {
    Action: actions$,
    DOM: vdom$,
    HTTP: httpSink$,
    router: routerSink$
  };
}
