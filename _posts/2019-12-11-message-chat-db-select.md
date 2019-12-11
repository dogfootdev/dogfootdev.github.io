---
title: 맥용 메시지 앱에서 신용카드 사용내역 추출하기
layout: post
description: 아이폰과 연동된 맥용 메시지 앱의 chat.db에서 신용카드 사용내역 데이터를 가져와 보자
date: '2019-12-10 22:00:00 +0000'
categories: sqlite macOS-10.15.1
comments: true
---

신용카드 사용내역을 포워딩 해야하는데, 아이폰 또는 맥에서 자원하는 서비스가 없어 메시지 포워딩 해주는 커멘드를 만들게 되었다.  
이번 포스팅은 메시지 포워딩을 하기위한 사전 작업으로 메시지 앱의 chat.db를 sqlite로 신용카드 사용 내역만 추출하는 쿼리에 대해 다뤄보겠다.

**사전 지식**  
<!-- [맥에서 아이폰으로 메세지 보내기]({% post_url 2019-12-02-applescript-send-message%})   -->
[sqlite](http://www.tutorialspoint.com/sqlite/)


아래 [brew](https://brew.sh/index_ko) 명령어를 터미널에서 실행 시키면 sqlite가 설치된다.
```shell
brew install sqlite
```

sqlite 설치가 완료됐다면 아래 위치에 있는 메시지앱의 db를 확인해 보자.
```shell
 ~/Library/Messages/chat.db
```


sqlite로 테이블 목록을 출력해 보면 아래와 같은 에러가 발생한다.

```shell
sqlite3 ~/Library/Messages/chat.db ".table";

Error: unable to open database "~/Library/Messages/chat.db": unable to open database file
```

chat.db에 접근할 수 있는 권한이 없어서 발생하는 에러이며, chmod로 실행, 쓰기, 읽기 권한을 설정해 주면 된다.
```shell
chmod 777 ~/Library/Messages/chat.db
```

다시 sqlite로 테실행하면 아래와 같이 테이블 목록이 출력된다.
```shell
sqlite3 ~/Library/Messages/chat.db ".table";

_SqliteDatabaseProperties  kvtable                  
attachment                 message                  
chat                       message_attachment_join  
chat_handle_join           message_processing_task  
chat_message_join          sync_deleted_attachments 
deleted_messages           sync_deleted_chats       
handle                     sync_deleted_messages  
```

위 테이블 목록에서 message, handle 테이블의 컬럼을 출력해보면 아래와 같다.
```shell
sqlite3 ~/Library/Messages/chat.db "PRAGMA TABLE_INFO(message)";

0|ROWID|INTEGER|0||1
1|guid|TEXT|1||0
2|text|TEXT|0||0
3|replace|INTEGE
4|service_center|TEXT|0||0
5|handle_id|INTEGER|0|0|0
.
15|date|INTEGER|0||0
.
```
위 ***message***의 컬럼 정보를 출력해 보면 3번째 컬럼의 ***text***가 문자 내용이고, 6번째 컬럼의 ***handle_id***가 ***handle*** 테이블에 있는 ***ROWID***를 의미한다.
```shell
sqlite3 ~/Library/Messages/chat.db "PRAGMA TABLE_INFO(handle_id)";

0|ROWID|INTEGER|0||1
1|id|TEXT|1||0
2|country|TEXT|0||0
3|service|TEXT|1||0
4|uncanonicalized_id|TEXT|0||0
5|person_centric_id|TEXT|0||0
```
위 ***handle*** 컬럼의 ***id***는 전화번호를 의미한다.

위 두 테이블의 컬럼 정보로 신용카드 내역만 추출하는 쿼리를 아래와 같이 만들어 보았다.  
`h.id`에 카드사 전화번호를 넣고 터미널에서 실행하면 다음과 같이 출력 된다.
```shell
sqlite3 ~/Library/Messages/chat.db "SELECT text FROM message m INNER JOIN handle h ON h.ROWID=m.handle_id WHERE h.id=\"+82********\"" | while read prkey; do
   echo "$prkey"
done

[Web발신]
**카드승인
12,345원 일시불
01/01 00:00 **수퍼***
누적1,234,567원
.
.
```
***AND*** 조건을 추가하여 특정 기간의 메시지만 출력 가능하다.  
기간 설정은 ***message***의 15번째 컬럼 ***date***를 참고하면 된다.
```shell
sqlite3 ~/Library/Messages/chat.db "SELECT text FROM message m INNER JOIN handle h ON h.ROWID=m.handle_id WHERE h.id=\"+82********\" AND m.date>551866646548764928" | while read prkey; do
   echo "$prkey"
done
```

다음은 새 메시지가 있을 경우 메시지를 포워딩하는 커멘드에 대해 포스팅하도록 하겠다.
<br><br>
