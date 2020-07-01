package dk.theisborg.mongorest;

import javax.servlet.ServletContext;
import java.io.IOException;
import java.util.Properties;

public class Prop {

  private static final String FILE_PATH = "/WEB-INF/config.properties";

  public static Properties load(ServletContext context) throws IOException {
    Properties properties = new Properties();
    properties.load(context.getResourceAsStream(FILE_PATH));
    return properties;
  }
}
