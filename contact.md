---
title: 문의하기
layout: contact
description: AppleScript를 이용해서 맥에서 SMS, MMS를 전송해보자.
comments: false
---


  
문의하기
=======================
  
  
<form name="sentMessage" id="contactForm" novalidate="" action="https://formspree.io/no10305@gmail.com" method="post"> <input type="hidden" name="_subject" value="블로그에서 새로운 연락이 왔습니다."> <input type="text" name="_gotcha" style="display:none"> <div class="control-group"> <div class="form-group floating-label-form-group controls"> <label>이름</label> <input type="text" class="form-control" placeholder="이름" id="name" name="name" required="" data-validation-required-message="이름을 입력해주세요."> <div class="help-block text-danger"></div> </div> <div class="form-group floating-label-form-group controls"> <label>이메일</label> <input type="email" class="form-control" placeholder="이메일" id="email" name="email" required="" data-validation-validemail-message="이메일 형식이 아닙니다." data-validation-required-message="이메일을 입력해 주세요."> <div class="help-block text-danger"></div> </div> <div class="form-group floating-label-form-group controls"> <label>메세지</label> <textarea rows="5" class="form-control" placeholder="메세지" id="message" name="message" required="" data-validation-required-message="메세지를 입력해 주세요."></textarea> <div class="help-block text-danger"></div> </div> </div> <br> <div id="success"></div> <div class="form-group"> <button type="submit" class="btn btn-primary" id="sendMessageButton">Send</button> </div> </form>