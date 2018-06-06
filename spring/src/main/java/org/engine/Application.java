package org.engine;

import org.engine.dao.BasicDao;
import org.engine.dao.TgtDao;
import org.engine.utils.PropertiesUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

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
