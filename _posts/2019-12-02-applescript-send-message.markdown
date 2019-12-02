---
layout: post
title:  "AppleScript send essage"
description: AppleScript로 맥에서 아이폰으로 SMS, MMS를 전송해보자.
date:   2019-12-02 17:50:00
categories: applescrip shellscript macOS-10.15.1 iOS-13.2.3
---

맥에서 지원하는 [AppleScript]([https://ko.wikipedia.org/wiki/%EC%95%A0%ED%94%8C%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8](https://ko.wikipedia.org/wiki/애플스크립트))로 아이폰과 연동된 맥에서 SMS 또는 MMS 메시지 전송하는 기능을 지원하는데, 이번 포스팅에서는 맥에서 `applescript`와 `termianl`을 활용하여 아이폰으로 메시지 전송테스트를 해보도록 하겠다.


아래 메시지 전송을 코드에서

```applescript
tell application "Messages"
	set targetBuddy to "+8210********"
	set targetService to id of 1st service whose service type = iMessage
	set textMessage to "message content"
	set theBuddy to buddy targetBuddy of service id targetService
	send textMessage to theBuddy
end tell
```

targetBuddy에 메시지 전송할 대상 번호를 적용하고

```applescript
set targetBuddy to "+8210********"

set targetBuddy to "+821011112222"
```

textMessage에 메세지 내용을 적고

```applescript
set textMessage to "message content"

set textMessage to "맥에서 메시지를 보내보자"
```

위 메시지 코드를 `sendmessage.applescript`로 저장하고 더블 클릭하면 아래와 같이 스크립트 편집기가 실행이 되며 실행 버튼을 누르면 메시지 전송이 된다.

![image-20191202173204361](asset/image/posts/2019-12-02-applescript-send-message/image-20191202173204361.png)

아래와 같이 문자가 전송된 것을 확인할 수 있다.

![image-20191202173720463](asset/image/posts/2019-12-02-applescript-send-message/image-20191202173720463.png)


Terminal에서 메시지 전송하는 방법은 아래와 같다.

```applescript
osascript -e "tell application \"Messages\"
	set targetBuddy to \"+821011112222\"
	set targetService to id of 1st service whose service type = iMessage
	set textMessage to \"맥에서 메시지를 보내보자\"
	set theBuddy to buddy targetBuddy of service id targetService
	send textMessage to theBuddy
end tell"
```

Terminal로 메시지 전송 응용한다면 다양한 활용이 가능하다.


다음은 아이폰 메시지를 포워딩하는 방법을 포스팅을 해보도록 하겠다.




