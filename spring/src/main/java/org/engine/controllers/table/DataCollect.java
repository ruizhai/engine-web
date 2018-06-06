package org.engine.controllers.table;

import java.io.IOException;
import java.util.Map;

import org.engine.modules.Result;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.google.common.collect.Maps;


@RestController
@RequestMapping(value = "/api/table", produces = "application/json; charset=utf-8")
public class DataCollect extends BasicTable {
	
	private final static String pk = "TASK_ID";
	
	private final static String tableName = "bi_map_data_collect";
	
	private final static String[] showField = {"TASK_NM","TABLE_CN_NM","COLLECT_MODE"};
	
	private final static String[] fieldCnNm = {"任务名","来源表名","采集方式"};

	private final static String[] deleteTables = {"BI_MAP_ATTR", "BI_MAP_ACT", "BI_MAP_CLEAN", "BI_MAP_REL", "BI_MAP_ENT"};

	@Override
	@RequestMapping(value = "/" + tableName + "/get", method = RequestMethod.POST)
	public Result get(@RequestBody String param) {
		Result result = getRs(tableName, showField, fieldCnNm, pk, param);
		return result;
	}

	@Override
	@RequestMapping(value = "/" + tableName + "/insert", method = RequestMethod.POST)
	public Result insert(@RequestBody String param) {
		Map<String, String> paramMap = Maps.newHashMap();
		try {
			paramMap = mapper.readValue(param, new TypeReference<Map<String, String>>(){});
		} catch (IOException e) {
			e.printStackTrace();
		}
		if(null == paramMap.get("COLLECTSQL")) {
			String sql = "select * from " + paramMap.get("TABLE_NM");
			paramMap.put("COLLECTSQL", sql);
		}
		String id = insertRs(tableName, paramMap, pk);
		Result result = new Result();
		result.putData("id", id);
		result.setCode("0000");
		return result;
	}
	
	@Override
	@RequestMapping(value = "/" + tableName + "/delete", method = RequestMethod.POST)
	public Result delete(@RequestBody String param) {
		delRs(tableName, pk, deleteTables, null, param);
		return null;
	}

	@Override
	@RequestMapping(value = "/" + tableName + "/update", method = RequestMethod.POST)
	public Result update(@RequestBody String param) {
		Map<String, String> paramMap = Maps.newHashMap();
		try {
			paramMap = mapper.readValue(param, new TypeReference<Map<String, String>>(){});
		} catch (IOException e) {
			e.printStackTrace();
		}
		if(null == paramMap.get("COLLECTSQL")) {
			String sql = "select * from " + paramMap.get("TABLE_NM");
			paramMap.put("COLLECTSQL", sql);
		}
		updateRs(tableName, paramMap, pk);
		Result result = new Result();
		result.setCode("0000");
		return result;
	}

	@Override
	@RequestMapping(value = "/" + tableName + "/form", method = RequestMethod.POST)
	public Result form(@RequestBody String param) {
		return formRs(tableName, pk, param);
	}
	
}
