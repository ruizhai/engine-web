package org.zr.web;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.zr.web.dao.BasicDao;
import org.zr.web.dao.TgtDao;
import org.zr.web.utils.PropertiesUtil;

/**
 * Hello world!
 *
 */
@SpringBootApplication
public class Application implements CommandLineRunner {
		
	public void run(String... args) throws Exception {
		PropertiesUtil.init();
		BasicDao.init();
		TgtDao.init();
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
