package org.zr.web.controllers.table;

import java.io.IOException;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.zr.web.modules.Result;

import com.fasterxml.jackson.core.type.TypeReference;
import com.google.common.collect.Maps;

@RestController
@RequestMapping(value = "/api/table", produces = "application/json; charset=utf-8")
public class MapClean extends BasicTable {

	private final static String pk = "RULE_ID";
	
	private final static String tableName = "bi_map_clean";
	
	private final static String[] showField = {"CLEAN_NM","FIELD_NM","CLEAN_RULE"};
	
	private final static String[] fieldCnNm = {"任务名称","字段名称","清理规则"};

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
		String id = insertRs(tableName, paramMap, pk);
		Result result = new Result();
		result.putData("id", id);
		result.setCode("0000");
		return result;
	}
	
	@Override
	@RequestMapping(value = "/" + tableName + "/delete", method = RequestMethod.POST)
	public Result delete(@RequestBody String param) {
		delRs(tableName, pk, null, null, param);
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
