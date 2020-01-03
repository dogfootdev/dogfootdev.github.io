---
title: 메시지 포워딩 커멘드를 agent에 등록하기
layout: post
description: agent에 메시지 포워딩 커멘드를 등록하여 주기적으로 메시지 포워딩하기
date: '2019-12-31 22:00:00 +0000'
categories: shell launchctl automation macOS-10.15.1 iOS-13.2.3
comments: true

---

이번 포스팅은 [커멘드 라인으로 아이폰 메시지 포워딩 하기]({% post_url 2019-12-26-message-forward%})에서 다룬 커멘드를 agent에 등록하여 주기적으로 새 메시지를 포워딩하는 설정을 하겠다.

**사전 지식**

- [커멘드 라인으로 아이폰 메시지 포워딩 하기]({% post_url 2019-12-26-message-forward%})

## plist 파일 작성
**com.dogfootdev.message-forward.plist**파일을 아래와 같이 생성하자.

1. `~/send-message.sh`파일은 절대 경로로 수정
2. **com.dogfootdev.message-forward**는 agent id
3. StartInterval integer 설정으로 10초 주기적으로 **send-message.sh**가 실행 됨

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
  	<key>Label</key>
  	<string>com.dogfootdev.message-forward</string>
	<key>ProgramArguments</key>
	<array>
		<string>~/send-message.sh</string>
	</array>
    <key>StartInterval</key>
	<integer>10</integer>
</dict>
</plist>
```

## 작성한 plist 파일을 agent 서비스에 등록

launchctl의 agent는 폴더 위치 별로 권한이 다르게 실행되는데, 전체 시스템권한으로 실행하기 위해 `/System/Library/LaunchDaemons`에 배치하도록 하겠다.

```shell
~/Library/LaunchAgents				#Per-user agents provided by the user.
/Library/LaunchAgents				#Per-user agents provided by the administrator.
/Library/LaunchDaemons				#System wide daemons provided by the administrator.
/System/Library/LaunchAgents		#Mac OS X Per-user agents.
/System/Library/LaunchDaemons		#Mac OS X System wide daemons.
```

plist 파일을 배치 후 다음 명령어로 서비스를 등록(**load**)한다.
```shell
sudo launchctl load -w /System/Library/LaunchDaemons/com.dogfootdev.message-forward.plist
```

## agent 서비스 실행하기

agent 서비스 실행은 간단하다.

plist에서 작성한 agent id를 아래 명령어와 같이 실행 시켜주면 된다.
```shell
launchctl start com.dogfootdev.message-forward
```
agent 중지는 아래와 같다.
```shell
launchctl stop com.dogfootdev.message-forward
```
agent가 등록 됐는지 확인해 보자.
```shell
launchctl list

665	0	com.dogfootdev.message-forward
```

## 맥 시스템 무결성 상테 해제
여기까지 진행했다면 agent에서 10초 간격으로 `~/send-message.sh` 커멘드는 실행되는데 한가지 문제가 있다.

agent로 커멘드 실행 시 `~/Library/Messages/chat.db`에 접근이 안되는 것이다.

[맥용 메시지 앱에서 신용카드 사용내역 추출하기]({% post_url 2019-12-11-message-chat-db-select%})에서 **chat.db**에 적용한 권한과 무관하게 접근이 안된다.

agent에서 `~/Library/Messages/chat.db`에 접근하려면 맥의 시스템 무결성(SIP) 무결성 보호를 disable 해야한다.

시스템 무결성 보호를 해제
1. 부팅 시 cmd + R를 눌러 복구 모드로 진입
2. Utility > Terminal 열어서 아래 커맨드 입력
3. 맥 재부팅

```shell
csrutil disable
```


여기까지 설정했다면 이제 새 메시지가 도착하고 10초 안에 메시지가 포워딩되는지 확인해보자.





