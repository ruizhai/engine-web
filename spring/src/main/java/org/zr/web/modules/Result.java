package org.zr.web.modules;

import java.util.Map;

import com.google.common.collect.Maps;

public class Result {
	
	private String code;
	
	private Map<String, Object> data;
	
	private Map<String, String> errMsg;
	
	private String uuid;

	public String getCode() {
		return code;
	}
	
	public void putData(String key, String value) {
		if(null == data) {
			data = Maps.newHashMap();
		}
		data.put(key, value);
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

	public Map<String, String> getErrMsg() {
		return errMsg;
	}

	public void setErrMsg(Map<String, String> errMsg) {
		this.errMsg = errMsg;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
	
}
