# GitHub Report
Google App Scriptで書かれた，Slack上で動くGitHubでの行動通知Bot．

指定した時間帯になると，Slackに1日の行動を通知してくれます．

<img src="https://pbs.twimg.com/media/Em4CHdRUUAUzF0_?format=jpg&name=small" width="320px">

# 利用方法

```main.gs```をGoogle Driveに保存して実行します．

下記の手順に従ってください．

## Google App Scriptへ設置
### プログラム本体を設置
- https://drive.google.com/ を開き，左上にある「新規」ボタンをクリック
- 出てきたメニューから「その他 > Google App Script」を選択

<img src="https://github.com/KotaIkehara/github-report/blob/main/images/new.png" width="500px">

- 空のプロジェクトが作成されるので，```main.gs```をコピーしてブラウザのエディタ内に貼り付けて保存する．

### プロパティの設定
このアプリは，3つのプロパティを設定する必要があります．下記の手順に従って設定を行ってください．

- まず，編集のプロジェクト画面のメニューにある「ファイル > プロジェクトのプロパティ」をクリック

<img src="https://user-images.githubusercontent.com/50253187/99481151-da5b8500-299c-11eb-8754-81a6f31e4e97.png" width="320px">

- 「プロジェクトのプロパティ」画面のメニュー内にある「スクリプトのプロパティ」をクリック

<image src="https://user-images.githubusercontent.com/50253187/99481418-6d94ba80-299d-11eb-8dbb-326ba0d36d5e.png" width="500px">

- 「+ 行を追加」をクリックすればプロパティの追加ができます

#### 設定するプロパティ
設定するプロパティは下記の3つです．

1. GITHUB_TOKEN
1. USER_NAME
1. SLACK_WEBHOOK_URL

##### GITHUB_TOKEN
[個人アクセストークンを発行する - GitHub Docs](https://docs.github.com/ja/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)に従いトークンを発行します．ステップ7.で付与するスコープは一番上の```repo```にチェックを入れればOK

##### USER_NAME
GitHubアカウントのユーザ名．```https://github.com/<USER_NAME>```に該当する．

##### SLACK_WEBHOOK_URL
[SalckでのIncoming Webhookの利用｜Slack](https://slack.com/intl/ja-jp/help/articles/115005265063-Slack-%E3%81%A7%E3%81%AE-Incoming-Webhook-%E3%81%AE%E5%88%A9%E7%94%A8)に従って発行する．BOTの作成もこのページの手順に従ってください．

## 課題
日々開発をしていく中で様々な実装を行い，学ぶことがたくさんある．
ただ，開発を進めることだけに囚われてしまうと，学んだことや調べたことを振り返る機会が減り身につくものも身につかないと感じた．

## 解決案
エンジニアの1日のGitHub上の行動を毎日決まった時間に通知することで，振り返りの機会を作る．

### メリット
- 「毎日決まった時間」にすることで，1日の振り返りが習慣化するというメリットがある．
- Slack届いたメッセージにコメントをすることで，見た目もすっきりした状態でこれまでの振り返りを蓄積していける

## 開発言語
- GAS

サーバーにデプロイせずに利用できるため開発コストが低くなること，時間によるトリガーの設定が簡単であることからGASを選択しました．

## 何ができるか？
1日のコミット数をブランチ毎，リポジトリ毎に一覧化し，Slackへメッセージを送ります．

## 将来的に実装したいこと
- Issueを作った
- Issueにコメントした
- PullRequestを作った
- PullRequestにレビューコメントした

などもメッセージに追加していきたいと考えています．

## エンジニアの行動を構成する要素は何か？
- コミット数
- Pull Request数
- レビュー数（どれだけ他人のコードを読んだか）
- Issue数
- 発信
  - Twitter投稿
  - Qiita記事

## 利用できそうなデータ

