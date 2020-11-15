function createMessage() {
  const repositoryNames = fetchRepositoryNames();
  const reposName = fetchRepositoryNames();
  
  var json
  const repos = []
  for (i = 0, len = reposName.length; i < len; ++i) {
    json  = fetchCommitTotal(reposName[i]);
    repos.push(json.data.repository);
  }
  
  var branch;
  var total;
  var info;
  const projectName = [];
  const project = [];
  for (i = 0, len = repos.length; i < len; ++i) {
    branch = repos[i].refs.edges;
    total = repos[i].refs.nodes;
    info = prepareInfo(branch, total);
    // commit = 0の時は表示しない
    if(info === null) continue;
    projectName.push(reposName[i]);
    project.push(info);
  }
  // JSONを整形し、プロジェクト毎のブランチとコミット数を取得

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
    message += '*' + projectName[i];
    message += '*\n ```' + project[i] + '```\n\n';
  }
  message += '明日も頑張りましょう！:whale:'

  // Slackに送る
  sendToSlack(message);
}

function prepareInfo(branch, total) {
  const branchName  = [];
  const commitTotal = [];
  const data        = [];

  for (var i = 0, len = branch.length; i < len; ++i) {
    // コミット数が0のブランチを除外
    if(parseInt(total[i].target.history.totalCount) === 0) {
      continue;
    }

    // 配列にオブジェクトを格納
    data.push({
      "branchName"  : branch[i].node.name,
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

//  Issueを作った
//  Issueにコメントした
//  PullRequestを作った
//  Pullrequestにレビューコメントをした

//  GraphQL内での変数の使い方注意
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

  const options = {
    'method' : 'get',
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

function fetchRepositoryNames() {
  const url   = 'https://api.github.com/graphql';
  const token = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  const user = PropertiesService.getScriptProperties().getProperty("USER_NAME");
  const graphql = 'query {\
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
    'method' : 'get',
    'contentType' : 'application/json',
    'headers' : {
      'Authorization' : 'Bearer ' +  token
     },
    'payload' : JSON.stringify({ query : graphql })
  };

  const response = UrlFetchApp.fetch(url, options);
  const json     = JSON.parse(response.getContentText());

  const repositories = json.data.user.repositories.edges;
  var repositoryList = [];
  for (var i=0; i<10; i++){
    repositoryList.push(repositories[i].node.name);
  }
  return repositoryList;
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

  // Slackに通知する際の名前、色、画像を決定する
  const data = {
    'username' : 'GitHub Report',
    'icon_emoji' : ':dolphin:',
    'attachments': [{
      'color': '#fc166a',
      'text' : body,
    }],
  };

  const payload = JSON.stringify(data);
  const options = {
    'method' : 'POST',
    'contentType' : 'application/json',
    'payload' : payload
  };

  UrlFetchApp.fetch(url, options);
}