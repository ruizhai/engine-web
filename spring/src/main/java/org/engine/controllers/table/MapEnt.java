package org.engine.controllers.table;

import java.io.IOException;
import java.util.Map;

import org.engine.controllers.select.SelectOptions;
import org.engine.modules.Result;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.google.common.collect.Maps;

@RestController
@RequestMapping(value = "/api/table", produces = "application/json; charset=utf-8")
public class MapEnt extends BasicTable {
	
	private final static String pk = "ENTITY_TASK_ID";
	
	private final static String tableName = "bi_map_ent";
	
	private final static String[] showField = {"ENTITY_NM","ENTITY_CN_NM","UPDATE_RULE"};
	
	private final static String[] fieldCnNm = {"实体英文名称","实体中文名称","更新规则"};
	
	private final static String[] deleteTables = {"BI_MAP_ATTR"};

	private final static String[] pks = {"LOAD_TASK_ID"};
	
	@Override
	@RequestMapping(value = "/" + tableName + "/get", method = RequestMethod.POST)
	public Result get(@RequestBody String param) {
		Result result = getRs(tableName, showField, fieldCnNm, pk, param);
		return result;
	}

	@Override
	@RequestMapping(value = "/" + tableName + "/insert", method = RequestMethod.POST)
	public Result insert(@RequestBody String param) {
		Map<String, String> entMap = SelectOptions.getEntMap(Maps.newHashMap());
		Map<String, String> paramMap = Maps.newHashMap();
		try {
			paramMap = mapper.readValue(param, new TypeReference<Map<String, String>>(){});
		} catch (IOException e) {
			e.printStackTrace();
		}
		paramMap.put("ENTITY_NM", paramMap.get("ENTITY_CN_NM"));
		paramMap.put("ENTITY_CN_NM", entMap.get(paramMap.get("ENTITY_NM")));
		String id = insertRs(tableName, paramMap, pk);
		Result result = new Result();
		result.putData("id", id);
		result.setCode("0000");
		return result;
	}
	
	@Override
	@RequestMapping(value = "/" + tableName + "/delete", method = RequestMethod.POST)
	public Result delete(@RequestBody String param) {
		delRs(tableName, pk, deleteTables, pks, param);
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
