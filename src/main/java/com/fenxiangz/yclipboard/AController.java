package com.fenxiangz.yclipboard;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class AController {
    @MessageMapping("/receiveContent")
    @SendTo("/topic/clipboardList")
    public ClipboardMsg transfer(ClipboardMsg message) throws Exception {
        return new ClipboardMsg(message.getContent());
    }
}