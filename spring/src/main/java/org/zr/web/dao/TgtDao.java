package org.zr.web.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Map;

import org.apache.commons.dbcp.BasicDataSource;
import org.zr.web.utils.PropertiesUtil;

import com.google.common.collect.Maps;

public class TgtDao {
	
	private static BasicDataSource ds;
	
	public static void init() {
		ds = new BasicDataSource();
		String className = PropertiesUtil.getString("tgt.datasource.driver-class-name");
		String url = PropertiesUtil.getString("tgt.datasource.url");
		String user = PropertiesUtil.getString("tgt.datasource.username");
		String pass = PropertiesUtil.getString("tgt.datasource.password");
		String validation = PropertiesUtil.getString("tgt.datasource.validation-query");
		int maxIdle = PropertiesUtil.getInt("tgt.datasource.max-idle");
		int minIdle = PropertiesUtil.getInt("tgt.datasource.min-idle");
		int maxActive = PropertiesUtil.getInt("tgt.datasource.max-active");
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
	
	
	public static Map<String, String> getSelect(String sql) {
		Connection conn = null;
		PreparedStatement stmt = null;
		Map<String, String> map = Maps.newHashMap();
		sql = sql + " limit 0";
		try {
			conn = ds.getConnection();
			stmt = conn.prepareStatement(sql);
			stmt.executeQuery();
			ResultSetMetaData meta = stmt.getMetaData();
			for(int i = 1; i <= meta.getColumnCount(); i++) {
				String fieldNm = meta.getColumnLabel(i) == null ?  meta.getColumnName(i) : meta.getColumnLabel(i);
				map.put(fieldNm, fieldNm);
			}
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
		return map;
	}
	
}
