---
title: 맥에서 커멘드 라인으로 아이폰 메시지 보내기
layout: post
description: AppleScript를 이용해서 맥에서 메시지(SMS, MMS)를 전송해보자.
date: '2019-12-02 17:50:00 +0000'
categories: appleScript automation macOS-10.15.1 iOS-13.2.3
comments: true
---

맥에서 지원하는 [AppleScript]([https://ko.wikipedia.org/wiki/%EC%95%A0%ED%94%8C%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8](https://ko.wikipedia.org/wiki/애플스크립트))로 아이폰과 연동된 맥에서 메시지(SMS, MMS)를 전송할 수 있는 기능을 제공한다.  
이번 포스팅에서는 맥에서 커멘드 라인으로 `applescript`를 실행하여 메시지 전송을 해보도록 하겠다.  

아래 코드는 `applescript`로 메시지를 보낼 수 있는 예제 코드이다.

```applescript
tell application "Messages"
	set targetBuddy to "+8210********"
	set targetService to id of 1st service whose service type = iMessage
	set textMessage to "message content"
	set theBuddy to buddy targetBuddy of service id targetService
	send textMessage to theBuddy
end tell
```
targetBuddy는 보낼 대상 전화번호이며, textMessage에 전송할 메시지 내용을 의미한다.

targetBuddy에 아래와 같이 전화번호를 국제번호 형식에 맞춰 적어 준다.  
`applescript` 실행 시 targetBuddy를 찾을 수 없다는 에러가 난다면, 맥의 연락처에 등록되어 있는 전화번호를 참고해 보자.
```applescript
set targetBuddy to "+821011112222"
```

textMessage에 전송할 메시지 내용을 적고
```applescript
set textMessage to "맥에서 메시지를 보내보자"
```

위 코드를 `sendmessage.applescript`로 저장하고 더블 클릭하면 아래와 같이 스크립트 편집기가 실행이 되며 실행 버튼을 누르면 메시지가 전송된다.
![image-20191202173204361]({{ site.baseurl }}/assets/image/posts/2019-12-02-applescript-send-message/image-20191202173204361.png)

아래와 같이 문자가 전송된 것을 확인할 수 있다.  
![image-20191202173720463]({{ site.baseurl }}/assets/image/posts/2019-12-02-applescript-send-message/image-20191202173720463.png)

`send file`에 파일 경로를 적용하면 파일 전송도 가능하다.
그 외 어떤 파일을 전송할 수 있는지 확인해 보면 좋을 것 같다.
```applescript
tell application "Messages"
	set targetBuddy to "+821011112222"
	set targetService to id of 1st service whose service type = iMessage
	set theBuddy to buddy targetBuddy of service id targetService
	send file "/Users/{username}/Desktop/image.png" to theBuddy
end tell
```

터미널에서 커멘드 라인으로 아래 코드를 실행시키면 메시지가 전송된 것을 확인할 수 있을 것이다.
osascript command로 실행하기 위해서는 `\"` 이스케이프 처리가 필요하다.

```applescript
osascript -e "tell application \"Messages\"
	set targetBuddy to \"+821011112222\"
	set targetService to id of 1st service whose service type = iMessage
	set textMessage to \"맥에서 메시지를 보내보자\"
	set theBuddy to buddy targetBuddy of service id targetService
	send textMessage to theBuddy
end tell"
```

커멘드 라인으로 메시지 전송하는 것을 응용하여 아이폰에서 받은 메시지를 다른 사람에게 포워딩하는 포스팅을 하겠다.
[맥용 메시지 앱에서 신용카드 사용내역 추출하기]({% post_url 2019-12-11-message-chat-db-select%})  
<br><br>
