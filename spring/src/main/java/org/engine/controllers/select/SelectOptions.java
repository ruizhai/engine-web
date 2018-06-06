package org.engine.controllers.select;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.engine.dao.BasicDao;
import org.engine.dao.TgtDao;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;


@RestController
@RequestMapping(value = "/api/select", produces = "application/json; charset=utf-8")
public class SelectOptions {

	private static Map<String, String> je(String param) {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, String> paramMap = Maps.newHashMap();
		try {
			paramMap = mapper.readValue(param, new TypeReference<Map<String, String>>(){});
		} catch (IOException e) {
			e.printStackTrace();
		}
		return paramMap;
	}
	
	private static List<Map<String, String>> mtol(Map<String, String> map) {
		List<Map<String, String>> rs = map.entrySet().stream().map(e -> {
			Map<String, String> t = Maps.newHashMap();
			t.put("key", e.getKey());
			t.put("value", e.getValue());
			return t;
		}).collect(Collectors.toList());
		return rs;
	}
	
	@RequestMapping(value = "/ent", method = RequestMethod.POST)
	public List<Map<String, String>> getEnt(@RequestBody String param) {
		Map<String, String> paramMap = je(param);
		Map<String, String> map = getEntMap(paramMap);
		return mtol(map);
	}

	@RequestMapping(value = "/entAttr", method = RequestMethod.POST)
	public List<Map<String, String>> getEntAttr(@RequestBody String param) {
		Map<String, String> paramMap = je(param);
		Map<String, String> map = getEntAttrMap(paramMap);
		return mtol(map);
	}	
	
	public static Map<String, String> getEntMap(Map<String, String> paramMap) {
		String sql = "select ENTITY_EN_NM, ENTITY_NM from BI_DATA_ENTITY";
		if(null != paramMap.get("taskId")) {
			String exSql = "select ENTITY_NM from BI_MAP_ENT where TASK_ID = '" + paramMap.get("taskId") + "'";
			sql = sql + " where ENTITY_EN_NM not in (" + exSql + ")";
		}
		Map<String, String> entMap = BasicDao.getSelect(sql);
		return entMap;
	}
	
	public static  Map<String, String> getEntAttrMap(Map<String, String> paramMap) {
		String sql = "select ATTR_EN_NM, ATTR_NM from BI_DATA_ATTR where BELONG_TYPE = '01'";
		if(null != paramMap.get("entNm")) {
			String exSql = "select ENTITY_ID from BI_DATA_ENTITY where ENTITY_EN_NM = '" + paramMap.get("entNm") + "'";
			sql = sql + " and BELONG_ID in (" + exSql + ")"; 
		}
		if(null != paramMap.get("loadTaskId")) {
			String exSql = "select TGT_FIELD_NM from BI_MAP_ATTR where BELONG_TYPE = '01' and LOAD_TASK_ID = '" + paramMap.get("loadTaskId") + "'";
			if(null != paramMap.get("attrId")) {
				exSql = exSql + " and id <> '" + paramMap.get("attrId") + "'";
			}
			sql = sql + " and ATTR_EN_NM not in(" + exSql + ")";
		}
		Map<String, String> entAttrMap = BasicDao.getSelect(sql);
		return entAttrMap;
	}
	
	@RequestMapping(value = "/act", method = RequestMethod.POST)
	public List<Map<String, String>> getAct(@RequestBody String param) {
		Map<String, String> paramMap = je(param);
		Map<String, String> map = getActMap(paramMap);
		return mtol(map);
	}

	@RequestMapping(value = "/actAttr", method = RequestMethod.POST)
	public List<Map<String, String>> getActAttr(@RequestBody String param) {
		Map<String, String> paramMap = je(param);
		Map<String, String> map = getActAttrMap(paramMap);
		return mtol(map);
	}	
	
	@RequestMapping(value = "/tgtField", method = RequestMethod.POST)
	public List<Map<String, String>> getTgtField(@RequestBody String param) {
		Map<String, String> paramMap = je(param);
		String sql = "SELECT COLLECTSQL from BI_MAP_DATA_COLLECT where TASK_ID = '" + paramMap.get("taskId") + "'";
		List<Map<String, Object>> lines = BasicDao.select(sql);
		if(lines.size() == 1) {
			String tgtSql = BasicDao.select(sql).get(0).get("COLLECTSQL").toString();
			Map<String, String> map = getField(tgtSql);
			return mtol(map);
		}
		return null;
	}	
	
	public static Map<String, String> getActMap(Map<String, String> paramMap) {
		String sql = "select ACTION_EN_NM, ACTION_NM from BI_DATA_ACTION "
				+ "where SRC_ACTION_ID is null "
				+ "and SRC_REL_ID is null "
				+ "and RULE_ID is null";
		if(null != paramMap.get("taskId")) {
			String exSql = "select ACTION_NM from BI_MAP_ACT where TASK_ID = '" + paramMap.get("taskId") + "'";
			sql = sql + " and ACTION_EN_NM not in (" + exSql + ")";
		}
		Map<String, String> actMap = BasicDao.getSelect(sql);
		return actMap;
	}
	
	public static  Map<String, String> getActAttrMap(Map<String, String> paramMap) {
		String sql = "select ATTR_EN_NM, ATTR_NM from BI_DATA_ATTR where BELONG_TYPE = '02'";
		if(null != paramMap.get("actNm")) {
			String exSql = "select ACTION_ID from BI_DATA_ACTION where ACTION_EN_NM = '" + paramMap.get("actNm") + "'";
			sql = sql + " and BELONG_ID in (" + exSql + ")"; 
		}
		if(null != paramMap.get("loadTaskId")) {
			String exSql = "select TGT_FIELD_NM from BI_MAP_ATTR where BELONG_TYPE = '02' and LOAD_TASK_ID = '" + paramMap.get("loadTaskId") + "'";
			if(null != paramMap.get("attrId")) {
				exSql = exSql + " and id <> '" + paramMap.get("attrId") + "'";
			}
			sql = sql + " and ATTR_EN_NM not in(" + exSql + ")";
		}
		Map<String, String> entAttrMap = BasicDao.getSelect(sql);
		return entAttrMap;
	}
	
	@RequestMapping(value = "/rel", method = RequestMethod.POST)
	public List<Map<String, String>> getRel(@RequestBody String param) {
		Map<String, String> paramMap = je(param);
		Map<String, String> map = getRelMap(paramMap);
		return mtol(map);
	}
	
	public static Map<String, String> getRelMap(Map<String, String> paramMap) {
		String sql = "select REL_EN_NM, REL_NM from BI_DATA_REL  "
				+ "where REL_TYPE = '01' ";
		if(null != paramMap.get("taskId")) {
			String exSql = "select REL_NM from BI_MAP_REL where TASK_ID = '" + paramMap.get("taskId") + "'";
			if(null != paramMap.get("id")) {
				exSql = exSql + " and REL_TASK_ID <> '" + paramMap.get("id") + "'";
			}
			sql = sql + " and REL_EN_NM not in (" + exSql + ")";
		}
		Map<String, String> actMap = BasicDao.getSelect(sql);
		return actMap;
	}
	
	public static Map<String, String> getField(String sql) {
		Map<String, String> map = TgtDao.getSelect(sql);
		return map;
	}
	
	
	//源表字段拆分
}
