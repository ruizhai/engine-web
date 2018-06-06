package org.engine.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PropertiesUtil {
	private static Logger log = LoggerFactory.getLogger(PropertiesUtil.class);

	private static Configuration config = null;

	public static void init() {
		try {
			String cfgFile = System.getProperty("cfg");
			if (null != cfgFile) {
				config = new PropertiesConfiguration(cfgFile);
			} else {
				log.info("cfgFile不存在,使用jar内部配置文件.");
				config = new PropertiesConfiguration("application.properties");
			}
		} catch (ConfigurationException e) {
			log.error("读取配置文件失败!", e);
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			e.printStackTrace(new PrintStream(out));
			log.error(out.toString());
			try {
				out.close();
			} catch (IOException e2) {
				e2.printStackTrace();
			}
		}
	}

	public static Configuration getConfig() {
		return config;
	}

	public static void setConfig(Configuration config) {
		PropertiesUtil.config = config;
	}

	public static void set(String key, Object val) {
		config.setProperty(key, val);
	}

	public static String getString(String key) {

		String value = config.getString(key);

		return value;

	}

	public static String getString(String key, String defVal) {

		String value;
		try {
			value = config.getString(key);
			if (null == value) {
				value = defVal;
			}
		} catch (Exception e) {
			value = defVal;
		}
		return value;
	}

	public static String[] getStringArray(String key) {

		String[] valueArray = config.getStringArray(key);

		return valueArray;

	}

	public static String[] getStringArray(String key, String[] defVal) {
		String[] valueArray;
		try {
			valueArray = config.getStringArray(key);
			if (null == valueArray || valueArray.length <= 0) {
				valueArray = defVal;
			}
		} catch (Exception e) {
			valueArray = defVal;
		}
		return valueArray;
	}

	public static int getInt(String key) {

		int value = -1;

		value = config.getInt(key);

		return value;
	}

	public static int getInt(String key, int defVal) {

		int value = -1;

		try {
			value = config.getInt(key);
		} catch (Exception e) {
			value = defVal;
		}

		return value;
	}


	public static boolean getBoolean(String key, boolean defVal) {
		boolean value = defVal;
		try {
			value = config.getBoolean(key);
		} catch (Exception e) {
			value = defVal;
		}
		return value;
	}
}