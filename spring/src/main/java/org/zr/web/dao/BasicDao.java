package org.zr.web.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

import org.apache.commons.dbcp.BasicDataSource;
import org.zr.web.utils.PropertiesUtil;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

public class BasicDao {
	
	private static BasicDataSource ds;
	
	public static void init() {
		ds = new BasicDataSource();
		String className = PropertiesUtil.getString("my.datasource.driver-class-name");
		String url = PropertiesUtil.getString("my.datasource.url");
		String user = PropertiesUtil.getString("my.datasource.username");
		String pass = PropertiesUtil.getString("my.datasource.password");
		String validation = PropertiesUtil.getString("my.datasource.validation-query");
		int maxIdle = PropertiesUtil.getInt("my.datasource.max-idle");
		int minIdle = PropertiesUtil.getInt("my.datasource.min-idle");
		int maxActive = PropertiesUtil.getInt("my.datasource.max-active");
		ds.setDriverClassName(className);
		ds.setUrl(url);
		ds.setUsername(user);
		ds.setPassword(pass);
		ds.setValidationQuery(validation);
		ds.setMaxIdle(maxIdle);
		ds.setMinIdle(minIdle);
		ds.setMaxActive(maxActive);
		ds.setRemoveAbandoned( true );
		ds.setTestOnBorrow( true );  
		ds.setPoolPreparedStatements( true );
		ds.setMaxOpenPreparedStatements( 20 );
	}
	
	public static List<Map<String, Object>> select(String sql) {
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		List<Map<String, Object>> lines = Lists.newArrayList();
		try {
			conn = ds.getConnection();
			stmt = conn.prepareStatement(sql);
			rs = stmt.executeQuery();
			ResultSetMetaData meta = rs.getMetaData();
			while(rs.next()) {
				Map<String, Object> map = Maps.newHashMap();
				for(int i = 1; i <= meta.getColumnCount(); i++) {
					map.put(meta.getColumnName(i), rs.getObject(i));
				}
				lines.add(map);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if(null != rs) rs.close();
				if(null != stmt) stmt.close();
				if(null != conn) conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}	
		return lines;
	}
	
	public static List<Map<String, Object>> select(String sql, String pk) {
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		List<Map<String, Object>> lines = Lists.newArrayList();
		try {
			conn = ds.getConnection();
			stmt = conn.prepareStatement(sql);
			rs = stmt.executeQuery();
			lines = getDataSource(rs, pk);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if(null != rs) rs.close();
				if(null != stmt) stmt.close();
				if(null != conn) conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}	
		return lines;
	}
	
	public static Map<String, String> getSelect(String sql) {
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		Map<String, String> map = Maps.newHashMap();
		try {
			conn = ds.getConnection();
			stmt = conn.prepareStatement(sql);
			rs = stmt.executeQuery();
			map = getSelectMap(rs);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if(null != rs) rs.close();
				if(null != stmt) stmt.close();
				if(null != conn) conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}	
		return map;
	}
	
	private static Map<String, String> getSelectMap(ResultSet rs) {
		Map<String, String> map = Maps.newHashMap();
		try {
			while(rs.next()) {
				map.put(rs.getString(1), rs.getString(2));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return map;
	}
	
	 private static List<Map<String, Object>> getDataSource(ResultSet rs, String pk) {
		List<Map<String, Object>> lines = Lists.newArrayList();
		try {
			ResultSetMetaData meta = rs.getMetaData();
			int c = meta.getColumnCount();
			while(rs.next()) {
				Map<String, Object> line = Maps.newHashMap(); 
				for(int i = 1; i <= c ; i++) {
					line.put(meta.getColumnName(i).equals(pk) ? "id" : meta.getColumnName(i) , rs.getObject(i));
				}
				lines.add(line);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return lines;
	}
	
	public static long count(String tableName, String filter) {
		String sql = "select count(*) as COUNT from " + tableName + " " + filter;
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		long count = 0;
		try {
			conn = ds.getConnection();
			stmt = conn.prepareStatement(sql);
			rs = stmt.executeQuery();
			rs.next();
			count = rs.getLong("COUNT");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if(null != rs) rs.close();
				if(null != stmt) stmt.close();
				if(null != conn) conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}	
		return count;
	}
	
	public static void update(String sql) {
		Connection conn = null;
		Statement stmt = null;
		try {
			conn = ds.getConnection();
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if(null != stmt) stmt.close();
				if(null != conn) conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}	
	}
	
	public static String pagination(String sql, int current, int pageSize) {
		sql = sql + " limit " + ((current - 1) * pageSize) + ", " + pageSize;
		return sql;
	}
}
