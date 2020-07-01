package dk.theisborg.mongorest;

import com.mongodb.BasicDBObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

/**
 * This is a generic REST service.
 * 
 * Expected request are in the format of:
 * 		/rest/<auid>/<uuid>/<entity>
 * 
 * where 
 * <auid> == application uid
 * <uuid> == user uid
 * <entity> == json object to store
 * 
 * The service will do access rights validation by the user._roles
 * 
 * In a later version we will change <uuid> with a sessionid? 
 * 
 * @author g95511
 * JS test for deploy
 */

@WebServlet("/mail")
public class MailServlet extends HttpServlet {

	public MailServlet() {
		super();
	}

	@Override
	protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		super.doOptions(request, response);
		setHeaders(request, response);
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("GET " + getClientIpAddr(request) + " " + new Date());
		setHeaders(request, response);
	}

	/**
	 * This is the place to ensure that requests only comes from a certain domain. For now everyone can write to this database
	 * 
	 * @param request
	 * @param response
	 */
	private void setHeaders(HttpServletRequest request, HttpServletResponse response) {
		String server = request.getHeader("Origin");
//		if (server != null && server.contains("ttsoftware.dk")) {
		if (server != null) {
//			response.setHeader("Access-Control-Allow-Origin", server);
//			response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//			response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
		response.addHeader("Access-Control-Allow-Headers", "Content-Type");
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("POST"+ " " + new Date());
		setHeaders(request, response);
		response.setContentType("application/json;charset=UTF-8");

		System.out.println("Sending mail");

		StringBuffer jb = new StringBuffer();
		String line = null;
		try {
			BufferedReader reader = request.getReader();
			while ((line = reader.readLine()) != null)
				jb.append(line);
		} catch (Exception e) { /* report an error */
		}
		String ip = getClientIpAddr(request);
		System.out.println("got JSON=" + jb);
		Object o = com.mongodb.util.JSON.parse(jb.toString());
		BasicDBObject doc = (BasicDBObject) o;

		System.out.println("got JSON=" + doc.toJson());

		new DkimMail("noreply@priocloud.com", doc.getString("to"), doc.getString("subject"), doc.getString("message")).send();
//		new DkimMail("noreply@priocloud.com", request.getParameter("to"), request.getParameter("subject"), request.getParameter("message")).send();

		// return some meaningless json so jquery is happy
		PrintWriter out = response.getWriter();
		out.println(com.mongodb.util.JSON.serialize("{status:OK}"));
		out.flush();
		out.close();
		System.out.println("added something");
	}

	public static String getClientIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("X-Forwarded-For");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}
}
