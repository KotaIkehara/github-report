function createMessage() {
  const reposNames = getRepositoryNames();
  
  var json;
  const repos = [];
  for (i = 0, len = reposNames.length; i < len; ++i) {
    json  = fetchCommitTotal(reposNames[i]);
    repos.push(json.data.repository);
  }
  
  var branches;
  var total;
  var info;
  const projectName = [];
  const project = [];
  for (i = 0, len = repos.length; i < len; ++i) {
    branches = repos[i].refs.edges;
    total = repos[i].refs.nodes;
    info = prepareInfo(branches, total);
    
    // commit数 = 0の時は表示しない
    if(info === null) continue;
    
    projectName.push(reposNames[i]);
    project.push(info);
  }

  //  日付情報の取得
  const today        = formatDate(0);
  const oneDayBefore = formatDate(-1);
  const time = new Date();
  const hour = time.getHours();
  const triggerTime = hour + ':00';

  // メッセージの作成
  var message = '今日もお疲れ様でした:dolphin:\n';
  message += 'デイリーアクションを報告します．\n';
  message += '(集計日：' + oneDayBefore + ' ' + triggerTime + ' ~ ' + today + ' ' + triggerTime + ')\n\n';

  for (i = 0, len = project.length; i < len; ++i) {
    // "*": 太字, "```": インラインコード
    message += '*' + projectName[i];
    message += '*\n ```' + project[i] + '```\n\n';
  }
  message += '明日も頑張りましょう！:whale:';

  // Slackに送る
  sendToSlack(message);
}

function prepareInfo(branches, total) {
  const branchName  = [];
  const commitTotal = [];
  const data        = [];

  for (var i = 0, len = branches.length; i < len; ++i) {
    // コミット数が0のブランチを除外
    if(parseInt(total[i].target.history.totalCount) === 0) {
      continue;
    }
    // dataにブランチ名と，そのブランチのコミット数を格納
    data.push({
      "branchName"  : branches[i].node.name,
      "commitTotal" : total[i].target.history.totalCount
    });
  }

  var info = '';
  var sum = 0;

  for (var i = 0, len = data.length; i < len; ++i) {
    info += data[i].branchName + ' のコミット数：' + data[i].commitTotal + '件' + '\n';
    sum += data[i].commitTotal;
  }
  if(sum === 0) {
    return null;
  } else {
    info += '合計' + sum + '件';
  }
  return info;
}

function fetchCommitTotal(name) {
  const url   = 'https://api.github.com/graphql';
  const token = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  const user = PropertiesService.getScriptProperties().getProperty("USER_NAME");
  const oneDayBefore = formatDate(-1);

//  GraphQL内での変数の使い方でつまずいた
// 改行文字をエスケープしないと，正しくパース出来ない
  const graphql = ' \
{ \
repository(owner: "' + user + '", name: "' + name + '") {\
    ...RepoFragment\
  }\
}\
fragment RepoFragment on Repository {\
  refs(first: 100, refPrefix:"refs/heads/") {\
    edges {\
      node {\
        name\
      }\
    }\
    nodes {\
        target {\
      ... on Commit {\
        history(first: 0, since: "'
         + oneDayBefore +
        'T09:00:00.000+09:00"  ) {\
          totalCount\
        }\
       }\
     }\
   }\
 }\
}\
';
  
  
//クエリ，ミューテーションに関わらず，JSONエンコードされたボディを提供するので、HTTPの動詞はPOST
  const options = {
    'method' : 'post',
    'contentType' : 'application/json',
    'headers' : {
      'Authorization' : 'Bearer ' +  token
     },
    'payload' : JSON.stringify({ query : graphql })
  };

  const response = UrlFetchApp.fetch(url, options);
  const json     = JSON.parse(response.getContentText());
  return json;
}

function getRepositoryNames() {
  const url   = 'https://api.github.com/graphql';
  const token = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  const user = PropertiesService.getScriptProperties().getProperty("USER_NAME");
  
  //最近更新されたリポジトリの内，10件のレポジトリ名をクエリする
  const graphql = '\
  {\
  user(login: "' + user + '") {\
    repositories(first: 10, affiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {\
      edges {\
        node {\
          name\
        }\
      }\
    }\
  }\
}\
';

  const options = {
    'method' : 'post',
    'contentType' : 'application/json',
    'headers' : {
      'Authorization' : 'Bearer ' +  token
     },
    'payload' : JSON.stringify({ query : graphql })
  };

  const response = UrlFetchApp.fetch(url, options);
  const json     = JSON.parse(response.getContentText());

  const repositories = json.data.user.repositories.edges;
  const repositoryNames = [];
  for (var i=0; i<10; i++){
    repositoryNames.push(repositories[i].node.name);
  }
  return repositoryNames;
}

/** 
日付をフォーマットする
@param  {int} days
@return {string} YYYY-MM-DD
**/ 
function formatDate(days) {
  const now = new Date;
  const oneWeekBefore = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  const year    = oneWeekBefore.getFullYear();
  const month   = ('0' + (oneWeekBefore.getMonth() + 1)).slice(-2);
  const date    = ('0' + oneWeekBefore.getDate()).slice(-2);
  const format  = year+ '-' + month + '-' + date;

  return format;
}

function sendToSlack(body) {
  const url = PropertiesService.getScriptProperties().getProperty("SLACK_WEBHOOK_URL");

  // Slackに通知する際の名前，アイコン，色を決定する
  const data = {
    'username' : 'GitHub Report',
    'icon_emoji' : ':dolphin:',
    'attachments': [{
      'text' : body,
    }],
  };

  const payload = JSON.stringify(data);
  const options = {
    'method' : 'POST',
    'contentType' : 'application/json',
    'payload' : payload
  };

  // Slack Webhook urlへPOSTリクエストを送る
  UrlFetchApp.fetch(url, options);
}