export const config = {
  "brandName": "SearchTrack",
  "lobbyCategories": [{
    "id": "tracks",
    "displayName": "Tracks"
  }, {
    "id": "settings",
    "displayName": "Settings"
  }],
  "gameLaunchUrlTemplate": "https://casinotesteur.tain.com/lobby/cwl/igame?gameId={game.id}",
  "gameIconsUrlTemplate": "https://cdn.tain.com/casino/v3/content/flash/online_lobby/tain/icons/id_{game.id}.jpg",
  "logoUrlTemplate": "/assets/images/big-logo.png"
};

export const playerInfo = {
  "displayName": "John Doe",
  "balance": { "cash": 10.33, "bonus": 3.19 }
};
