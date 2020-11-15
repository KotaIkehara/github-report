﻿# GitHub Report

## 課題
日々開発をしていく中で様々な実装を行い，学ぶことがたくさんある．
ただ，開発を進めることだけに囚われてしまうと，学んだことや調べたことを振り返る機会が減り身につくものも身につかないと感じた．

## 解決案
エンジニアの1日のGitHub上の行動を毎日決まった時間に通知することで，振り返りの機会を作る．

### メリット
- 「毎日決まった時間」にすることで，1日の振り返りが習慣化するというメリットがある．
- Slack届いたメッセージにコメントをすることで，見た目もすっきりした状態でこれまでの振り返りを蓄積していける

## 実際の画面
![実際の画面](https://pbs.twimg.com/media/Em4CHdRUUAUzF0_?format=jpg&name=small)

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

