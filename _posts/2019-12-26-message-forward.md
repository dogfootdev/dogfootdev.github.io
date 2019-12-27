---
title: 커멘드 라인으로 아이폰 메시지 포워딩 하기
layout: post
description: 새로 받은 신용카드 사용내역 메시지를 맥에서 커멘드 라인으로 아이폰으로 포워딩하기
date: '2019-12-16 22:00:00 +0000'
categories: sqlite macOS-10.15.1 automation
comments: true

---

이번 포스팅은 신용카드 사용내역 중 새 메시지만 추출하여 지정한 대상에게 메시지를 전달하는 포워딩 커멘드를 구현하는 포스팅하겠다.

**사전 지식**  

- [맥에서 커멘드라인으로 아이폰 메세지 보내기]({% post_url 2019-12-02-applescript-send-message%})

- [맥용 메시지 앱에서 신용카드 사용내역 추출하기]({% post_url 2019-12-11-message-chat-db-select%})

- [sqlite](http://www.tutorialspoint.com/sqlite/)



##특수문자 REPLACE 처리

새 메시지 추출하기 앞서 카드사 메시지에는 보통 개행과 `*` 애스터리스크 문자가 포함되 있어 text에 아래와 같이 REPLACE 처리가 필요하다.

```shell
REPLACE(REPLACE(text, \"
\", \"\"), \"*\", \"\*\")
```

1. 메시지에 개행이 포함되어 있으면, 개행 별로 하나의 메시지로 인식하여 출력되어 개행을 스페이스로 REPACE 처리
2. `*` 애스터리스크 문자가 포함되면 현재 폴더의 전체 내용 출력되어 `*` 를 `\*` 로 REPACE 처리

```shell
sqlite3 ~/Library/Messages/chat.db "SELECT REPLACE(REPLACE(text,SELECT REPLACE(REPLACE(text, \"
\", \"\"), \"*\", \"\*\") FROM message m INNER JOIN handle h ON h.ROWID=m.handle_id WHERE h.id=\""+82157712234"\" AND ND m.date>551866646548764928" | while read prkey; do
	echo "------------------------"
	echo "$prkey"
done


```



##새 메시지만 출력 하기

메시지가 정상 출력되면 마지막으로 보낸 메시지 시간을 **lastdate.txt**파일에 저장하고 **LASTDATE** 변수로 가져오는 작업을 해주면 새로 받은(마지막으로 보낸 메시지 시간 이후) 메시지만 출력이 된다.

```shell
LASTDATE=$(<lastdate.txt)
sqlite3 ~/Library/Messages/chat.db "SELECT REPLACE(REPLACE(text, \"
\", \"\"), \"*\", \"\*\") FROM message m INNER JOIN handle h ON h.ROWID=m.handle_id WHERE h.id=\""+82157712234"\" AND m.date>"${LASTDATE} | while read prkey; 
do
	echo "------------------------"
	echo "$prkey"
done

```

 select 구문에 **date**를 추가하면 db에 등록된 메시지 시간을 출력을 할 수 있다.

이때 시간은 **LASTMESSAGEDATA**에 메시지는 **MESSAGE**에 저장을 해주도록 하자.

```shell
LASTDATE=$(<lastdate.txt)
sqlite3 ~/Library/Messages/chat.db "SELECT REPLACE(REPLACE(text, \"
\", \"\"), \"*\", \"\*\"), date FROM message m INNER JOIN handle h ON h.ROWID=m.handle_id WHERE h.id=\""+82157712234"\" AND m.date>"${LASTDATE} | while read prkey; 
do
	LASTMESSAGEDATA=$(echo ${prkey} | awk -F'|' '{print $2}');
	MESSAGE=$(echo ${prkey} | awk -F'|' '{print $1}');
	echo ${LASTMESSAGEDATA}
	echo ${MESSAGE}
done

```

select 후 마지막 메시지 시간을 **lastdate.txt**에 업데이트하면 새 메시지만 출력할 수 있는 기본 구조가 된다.

```shell
LASTDATE=$(<lastdate.txt)
LASTMESSAGEDATA=${LASTDATE}
sqlite3 ~/Library/Messages/chat.db "SELECT REPLACE(REPLACE(text, \"
\", \"\"), \"*\", \"\*\"), date FROM message m INNER JOIN handle h ON h.ROWID=m.handle_id WHERE h.id=\""+82157712234"\" AND m.date>"${LASTDATE} | while read prkey; 
do
	LASTMESSAGEDATA=$(echo ${prkey} | awk -F'|' '{print $2}');
	echo ${LASTMESSAGEDATA} > lastdate.txt	
	MESSAGE=$(echo ${prkey} | awk -F'|' '{print $1}');
	echo ${LASTMESSAGEDATA}
	echo ${MESSAGE}
done

```



##새 메시지만 전달하기

새 메시지 전달은 간단하다.

**FROMPHONENUMBER**에 카드사 전화번호를 입력하고 **TOPHONENUMBER**에 메시지를 전달하는 대상 전화번호를 입력 후 [맥용 메시지 앱에서 신용카드 사용내역 추출하기]({% post_url 2019-12-11-message-chat-db-select%})에서 다룬 코드를 적용하면 된다.

```shell
FROMPHONENUMBER="+8215771234"
TOPHONENUMBER="+821012341234"
LASTDATE=$(<lastdate.txt)
LASTMESSAGEDATA=${LASTDATE}
sqlite3 ~/Library/Messages/chat.db "SELECT REPLACE(REPLACE(text, \"
\", \"\"), \"*\", \"\*\"), date FROM message m INNER JOIN handle h ON h.ROWID=m.handle_id WHERE h.id=\""${FROMPHONENUMBER}"\" AND m.date>"${LASTDATE} | while read prkey; 
do
	LASTMESSAGEDATA=$(echo ${prkey} | awk -F'|' '{print $2}');
	echo ${LASTMESSAGEDATA} > lastdate.txt	
	MESSAGE=$(echo ${prkey} | awk -F'|' '{print $1}');
	echo ${LASTMESSAGEDATA}
	echo ${MESSAGE}
	osascript -e "tell application \"Messages\"
	    set targetBuddy to \"${TOPHONENUMBER}\"
	    set targetService to id of 1st service whose service type = iMessage
	    set textMessage to \"${MESSAGE}\"
	    set theBuddy to buddy targetBuddy of service id targetService
	    send textMessage to theBuddy
	end tell"
	sleep 1
done
```



## 포워딩 커멘드실행

작성한 코드를 send-message.sh로 등록하고 터미널에서 실행하면 새 메시지가 포워딩 되는 것을 확인 할 수 있다.

```shell
./send-message.sh
```

<!--

## Git source code

[aadfadf]();

-->

## 주의사항

- 새 메시지가 일시에 대량 발송되는 것을 방지하기 위해 sleep 시간은 1초로 지정하였다.
- lastdate.txt에 0으로 지정하면 모든 카드내역이 전송되는 일이 발생하게 된며, sleep으로 처리하기 때문에 PC를 재시작하여도 멈추지 않고 모든 메시지가 전송되는 카오스를 경험하게 될 것이다.



다음은 메시지 포워딩 커멘드를 주기적으로 호출하도록 스케쥴러(launchd)에 등록하는 방법에 대해 포스팅하도록 하겠다.

<br><br>

