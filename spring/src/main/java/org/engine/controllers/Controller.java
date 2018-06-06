package org.engine.controllers;

import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Maps;

@RestController
@RequestMapping(value = "/api", produces = "application/json; charset=utf-8")

public class Controller {
	@RequestMapping(value = "/currentUser", method = RequestMethod.GET)
	public Map<String, Object> currentUser() {
		Map<String, Object> rs = Maps.newHashMap();
		rs.put("name", "zr");
		rs.put("notifyCount", 12);
		rs.put("avatar", "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png");
		return rs;
	}
}