package org.engine.controllers.chart;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

@RestController
@RequestMapping(value = "/api/chart", produces = "application/json; charset=utf-8")
public class ChartTest {
	
	@RequestMapping(value = "/test", method = RequestMethod.POST)
	public List<Map<String, Long>> getEntAttr() {
		List<Map<String, Long>> rs = Lists.newArrayList();
		for(int i = 0; i < 10; i++) {
			Map<String, Long> t = Maps.newHashMap();
			t.put("x", new Date().getTime() + 1000 * 60 * 30 * i);
			t.put("y1", (long) (Math.floor(Math.random() * 100) + 10));
			rs.add(t);
		}
		return rs;
	}	

}
