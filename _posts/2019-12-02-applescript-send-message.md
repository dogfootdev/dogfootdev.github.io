---
title: 맥에서 아이폰으로 메세지 보내기
layout: post
description: AppleScript를 이용해서 맥에서 SMS, MMS를 전송해보자.
date: '2019-12-02 17:50:00 +0000'
categories: applescrip shellscript macOS-10.15.1 iOS-13.2.3
comments: true
---

맥에서 지원하는 [AppleScript]([https://ko.wikipedia.org/wiki/%EC%95%A0%ED%94%8C%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8](https://ko.wikipedia.org/wiki/애플스크립트))로 아이폰과 연동된 맥에서 SMS, MMS 메시지를 전송할 수 있는 기능을 제공한다.  
이번 포스팅에서는 맥에서 `applescript`와 `termianl`로 메시지 전송테스트를 진행하고자 한다.  

아래는 `applescript`코드에서 전화번호와 메세지 내용을 넣고 맥에서 실행 시키면 메세지를 전송할 수 있다.

```applescript
tell application "Messages"
	set targetBuddy to "+8210********"
	set targetService to id of 1st service whose service type = iMessage
	set textMessage to "message content"
	set theBuddy to buddy targetBuddy of service id targetService
	send textMessage to theBuddy
end tell
```

<br>
targetBuddy에 아래와 같이 국제번호 형식에 맞춰 전화번호를 적어 준다.  
applescript 실행 시 targetBuddy를 찾을 수 없다면 맥의 연락처를 참고해 보자.
```applescript
set targetBuddy to "+821011112222"
```

<br>
textMessage에 전송할 메세지 내용을 적고
```applescript
set textMessage to "맥에서 메시지를 보내보자"
```

메시지 코드를 `sendmessage.applescript`로 저장하고 더블 클릭하면 아래와 같이 스크립트 편집기가 실행이 되며 실행 버튼을 누르면 메시지 전송이 된다.
![image-20191202173204361](http://dogfootdev.github.io/assets/image/posts/2019-12-02-applescript-send-message/image-20191202173204361.png)

<br>
아래와 같이 문자가 전송된 것을 확인할 수 있다.  
![image-20191202173720463](http://dogfootdev.github.io/assets/image/posts/2019-12-02-applescript-send-message/image-20191202173720463.png)

<br>
`send file`에 파일경로를 적용하면 파일 전송도 가능하다.
그 외 어떤 파일을 전송할 수 있는지 확인해 보면 좋을 것 같다.

```applescript
tell application "Messages"
	set targetBuddy to "+821011112222"
	set targetService to id of 1st service whose service type = iMessage
	set theBuddy to buddy targetBuddy of service id targetService
	send file "/Users/{username}/Desktop/image.png" to theBuddy
end tell
```

<br>
Terminal에서 메시지 전송하는 방법은 아래와 같다.  
command로 쓰기 위해서 `\"` 이스케이프 처리가 필요

```applescript
osascript -e "tell application \"Messages\"
	set targetBuddy to \"+821011112222\"
	set targetService to id of 1st service whose service type = iMessage
	set textMessage to \"맥에서 메시지를 보내보자\"
	set theBuddy to buddy targetBuddy of service id targetService
	send textMessage to theBuddy
end tell"
```

다음 포스팅은 Terminal로 메시지 전송하는 것을 응용하여 아이폰에서 받은 메시지를 다른 사람에게 포워딩을 해보도록 하겠다.
<br>