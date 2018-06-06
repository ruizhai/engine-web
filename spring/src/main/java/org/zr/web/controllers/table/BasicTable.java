package org.zr.web.controllers.table;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.zr.web.dao.BasicDao;
import org.zr.web.modules.Result;
import org.zr.web.utils.Tools;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

public abstract class BasicTable {

	public abstract Result get(String param);
	
	public abstract Result delete(String param);
	
	public abstract Result insert(String param);
	
	public abstract Result update(String param);

	public abstract Result form(String param);
	
	protected static ObjectMapper mapper = new ObjectMapper();
	 
	protected Result getRs(String tableName, String[] showField, String[] fieldCnNm, String pk, String param) {
		Map<String, Object> paramMap = Maps.newHashMap();
		try {
			paramMap = mapper.readValue(param, new TypeReference<Map<String, Object>>(){});
		} catch (IOException e) {
			e.printStackTrace();
		}
		@SuppressWarnings("unchecked")
		Map<String, String> filter = (Map<String, String>) paramMap.get("filter");
		Result result = new Result();
		result.setData(Maps.newHashMap());
		result.getData().put("columns", getColumns(showField, fieldCnNm));
		String filterSql = getFilter(filter);
		String sql = getSelectSql(tableName, showField, pk, filterSql);
		sql = BasicDao.pagination(sql, (int)paramMap.get("current"), (int)paramMap.get("pageSize"));
		List<Map<String, Object>> lines = BasicDao.select(sql, pk);
		result.getData().put("dataSource", lines);
		result.getData().put("total", BasicDao.count(tableName, filterSql));
		return result;
	}
	
	protected Result formRs(String tableName, String pk, String id) {
		Result result = new Result();
		id = id.replaceAll("\"", "");
		String sql = "select * from " + tableName + " where " + pk + " = '" + id + "'";
		List<Map<String, Object>> lines = BasicDao.select(sql, pk);
		result.setData(lines.get(0));
		return result;
	}
	
	protected String insertRs(final String tableName, Map<String, String> paramMap, final String pk) {
		String id = Tools.uuid();
		String sql = getInsertSql(tableName, pk, paramMap, id);
		BasicDao.update(sql);
		return id;
	}
	
	protected void updateRs(String tableName, Map<String, String> paramMap, String pk) {
		String id = paramMap.get("id");
		paramMap.remove("id");
		String sql = getUpdateSql(tableName, pk, paramMap, id);
		BasicDao.update(sql);
	}
	
	protected void delRs(String tableName, String pk, String[] tables, String[] pks, String id) {
		id = id.replaceAll("\"", "");
		String sql = getDelSql(tableName, pk, id);
		BasicDao.update(sql);
		if(null != tables) {
			for(int i = 0; i < tables.length; i++) {
				sql = getDelSql(tables[i], null == pks ? pk : pks[i], id);
				BasicDao.update(sql);
			}
		}
	}
	
	
	protected List<Map<String, String>> getColumns(String[] showField, String[] fieldCnNm) {
		List<Map<String, String>> columns = Lists.newArrayList();
		for(int i = 0; i < showField.length; i++) {
			String t = fieldCnNm[i];
			String k = showField[i];
			Map<String, String> col = Maps.newHashMap(); 
			col.put("title", t);
			col.put("dataIndex", k);
			col.put("key", k);
			columns.add(col);
		}
		return columns;
	}
	
	protected String getSelectSql(String tableName, String[] showField, String pk, String filter) {
		String sql = "select ";
		for(String field : showField) {
			sql = sql + field + ", ";
		}
		sql = sql + pk;
		sql = sql + " from " + tableName;
		sql = sql + filter;
		return sql;
	}
	
	private String getFilter(Map<String, String> filter) {
		String where = "";
		if(null != filter && filter.size() > 0) {
			where = where + " where "; 
			for(Entry<String, String> f : filter.entrySet()) {
				where = where + f.getKey() + " = '" + f.getValue() + "' and ";
			}
		}
		where = StringUtils.removeEnd(where, " and ");
		return where;
	}
	
	protected String getInsertSql(String tableName, String pk, Map<String, String> param, String id) {
		String sql = "insert into " + tableName + " ( ";
		String values = "";
		for(Entry<String, String> field : param.entrySet()) {
			String k = field.getKey();
			String v = field.getValue();
			sql = sql + k + ", ";
			values = values + "'" + v + "', "; 
		}
		values = values + "'" + id + "'";
		sql = sql + pk + " ) VALUES ( " + values + " )";
		return sql;
	}
	
	protected String getUpdateSql(String tableName, String pk, Map<String, String> param, String id) {
		String sql = "UPDATE " + tableName + " SET ";
		for(Entry<String, String> field : param.entrySet()) {
			String k = field.getKey();
			String v = field.getValue();
			sql = sql + k + " = '" + v.replaceAll("'", "''") + "', ";
		}
		sql = StringUtils.removeEnd(sql, ", ");
		sql = sql + " WHERE " + pk + " = '" + id + "'";
		return sql;
	}
	
	protected String getDelSql(String tableName, String pk, String id) {
		String sql = "DELETE FROM " + tableName + " WHERE " + pk + " = '" + id + "'";
		return sql;
	}
}
