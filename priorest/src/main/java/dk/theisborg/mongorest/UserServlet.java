package dk.theisborg.mongorest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLConnection;
import java.net.UnknownHostException;
import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Formatter;
import java.util.UUID;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.MongoException;
import com.mongodb.WriteResult;

/**
 * This user application has two different kind of users: private users and application users.
 *
 * A private user will only get access to content he has created himself.
 * An application user will get access according to the access rights defined for the application
 *
 * @author g95511
 *
 */

@WebServlet("/user")
public class UserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String DATABASE;
	private String USER;
	Mongo m = null;
	private String SITE;
	String serverType="";

	public UserServlet() {
		super();
	}
	public void init(ServletConfig config) {
		try {
			serverType = System.getenv("SERVER_TYPE");
			System.out.println("****************************************");
			System.out.println("serverType="+ serverType);
			System.out.println("****************************************");
			if (serverType==null || serverType.equalsIgnoreCase("local") || serverType.equalsIgnoreCase("dev")|| serverType.equalsIgnoreCase("Prod")) {
				m = new MongoClient("mongo", 27017);
//				} else if(serverType.equalsIgnoreCase("dev")){
//					m = new MongoClient(new MongoClientURI("mongodb://prioclouddevdb.westeurope.cloudapp.azure.com:27017"));
			} else if(serverType.equalsIgnoreCase("test")){
// 					Test env. used for Cosmo re-trial
//					m = new MongoClient(new MongoClientURI("mongodb://priocloudtestdb.westeurope.cloudapp.azure.com:27017"));
				m = new MongoClient(new MongoClientURI("mongodb://priocosmodbtest:DgkDqmlT9O6ZYYVVKRehm40ebrFEsY150FnlD7qh4AE5rLSPc6mnS3D9A4xdvGCX2xgcxIOPbh754Xysu6qzyw%3D%3D@priocosmodbtest.documents.azure.com:10255/?ssl=true"));
//
//				} else if(serverType.equalsIgnoreCase("prod")){
////					m = new MongoClient(new MongoClientURI("mongodb://priocloudproddb.westeurope.cloudapp.azure.com:27017"));
//					m = new MongoClient("mongo", 27017);
//				}else{
//					System.out.println("UNKNOWN SERVER TYPE: " + serverType);
			}
			System.out.println("Connected");
			SITE=Prop.load(config.getServletContext()).getProperty("sitename");
			DATABASE=Prop.load(config.getServletContext()).getProperty("database");
			USER=Prop.load(config.getServletContext()).getProperty("userdatabase");
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (MongoException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("GET NOT SUPPORTED");
	}
	protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		setHeaders(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("POST");
		String message="";
		String action=request.getParameter("action");
		String email=request.getParameter("email");
		String password=request.getParameter("password");
		String auid=request.getParameter("auid");	//application uid
		String application=request.getParameter("application");	//application name
		String uuid=request.getParameter("uuid");
		System.out.println(action + " [" + email + "] [" + password + "] [" + auid + "] [" + application+"] ["+uuid+"]");
		DBObject user = new BasicDBObject();
		if (action==null){
			System.out.println("no action param set");
			return;
		}

		System.out.println("action ["+action+"]");
		response.setContentType("application/json;charset=UTF-8");
		response.addHeader("Access-Control-Allow-Origin", "*"); 	//for now let anyone use this userapplication
		if (action.equals("check") ) {
//				System.out.println("logged in: "+ (request.getSession().getAttribute("uuid")!=null));
//				loggedIn=(request.getSession().getAttribute("uuid")!=null);
		}else if (action.equals("ssologin") ) {
			String token=request.getParameter("token");
			JSONObject frontendjson = readJsonFromUrl(getAdSsoUrl(), token);
			System.out.println("json: " + frontendjson.toString());
			//TODO: extract email from frontendjson and use it
			DB db = m.getDB(USER);
			DBCollection collection = db.getCollection("user");
			BasicDBObject whereQuery = new BasicDBObject();
			whereQuery.put("email", frontendjson.getString("user_id").toLowerCase());
			whereQuery.put("application", application);
			DBCursor cursor = collection.find(whereQuery);
			if(cursor.hasNext()) {
				DBObject json = cursor.next();
				uuid=(String) json.get("uuid");
				String dbauid=(String) json.get("auid");
				//lets get the salt and see if the encrypted password matches
				String savedpassword=(String) json.get("password");
				String salt=(String) json.get("salt");
				System.out.println("SSO auto login correct");
				//TODO: load the entire user object here and remove salt, password and add isAdmin if needed
				user=json;
				DBObject update = new BasicDBObject();
				update.put("$set", new BasicDBObject("authtoken",UUID.randomUUID().toString()).append("lastlogin", new Date()));
				System.out.println("updating login user: " + update.toString());
				collection.update(user, update);
				System.out.println("updating login user: " + update.toString());
				user.put("authenticated", true);
				user.put("uuid", uuid);
				if(userIsOwner(uuid, dbauid, application)){	//check if creator is admin
					user.put("admin", true);
				}
			}else{
				user.put("authenticated", false);
				user.put("message", "Incorrect username or password.");
			}
		}else if (action.equals("login") ) {
			DB db = m.getDB(USER);
			DBCollection collection = db.getCollection("user");
			BasicDBObject whereQuery = new BasicDBObject();
			whereQuery.put("email", email);
			whereQuery.put("application", application);
			DBCursor cursor = collection.find(whereQuery);
			if(cursor.hasNext()) {
				DBObject json = cursor.next();
				uuid=(String) json.get("uuid");
				String dbauid=(String) json.get("auid");
				//lets get the salt and see if the encrypted password matches
				String savedpassword=(String) json.get("password");
				String salt=(String) json.get("salt");
				String encrypted=encryptPassword(password, salt);
				System.out.println(password+ "] [" + salt+ "] [" + encrypted+ "] [" + savedpassword+ "] [" + auid+ "] [" + dbauid);
//				if (savedpassword.equals(encrypted) && ((auid==null && dbauid==null) || auid.equals(dbauid)) ) {
				if (savedpassword!=null && savedpassword.equals(encrypted)) {
					System.out.println("login correct");
					//TODO: load the entire user object here and remove salt, password and add isAdmin if needed
					user=json;
					DBObject update = new BasicDBObject();
					update.put("$set", new BasicDBObject("authtoken",UUID.randomUUID().toString()).append("lastlogin", new Date()));

//					user.put("authtoken", UUID.randomUUID().toString());
//					user.put("lastlogin", new Date());
					System.out.println("updating login user: " + update.toString());
					collection.update(user, update);
					System.out.println("updating login user: " + update.toString());
					user.put("authenticated", true);
					user.put("uuid", uuid);
					if(userIsOwner(uuid, dbauid, application)){	//check if creator is admin
						user.put("admin", true);
					}
				}else{
					user.put("authenticated", false);
					user.put("message", "Incorrect username or password.");
				}
			}else{
				user.put("authenticated", false);
				user.put("message", "Incorrect username or password.");
			}
		}else if (action.equals("logout") ) {
			user.put("authenticated", false);
		}else if (action.equals("deleteuser") ) {
			if(!userIsOwner(uuid, auid, application)){
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				System.out.println("User with uuid ["+uuid+"] is not owner of ["+application+"] ["+auid+"]");
				user.put("message", "User with uuid ["+uuid+"] is not owner of ["+application+"] ["+auid+"]");
			}else{
				DB db = m.getDB(USER);
				DBCollection collection = db.getCollection("user");
				DBObject searchById = new BasicDBObject("email", request.getParameter("email"));
				searchById.put("auid", auid); // to avoid hackers messing with other peoples data...
				BasicDBObject found = (BasicDBObject) collection.findOne(searchById);
				collection.remove(found);
				// return some meaningless json so jquery is happy
				PrintWriter out = response.getWriter();
				out.println("{}");
				out.flush();
				out.close();
			}
		}else if (action.equals("adduser")) {	//creates application sub user
			//System.out.println("XXXXXXXXXXXXXXXXXXXXXXXXXX");
			BasicDBObject dbUser=(BasicDBObject) getUser(auid, uuid);
			if(!(isAdmin(dbUser) || isSubAdmin(dbUser))){	//check if creator is admin
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
				System.out.println("User with uuid ["+uuid+"] is not admin of ["+application+"] ["+auid+"]");
				user.put("message", "User with uuid ["+uuid+"] is not admin or subadmin of ["+application+"] ["+auid+"]");
			}else{
				System.out.println("user with uuid ["+uuid+"] is admin of ["+application+"] ["+auid+"]");
				//get json user object
				StringBuffer jb = new StringBuffer();
				String line = null;
				try {
					BufferedReader reader = request.getReader();
					while ((line = reader.readLine()) != null)
						jb.append(line);
				} catch (Exception e) { /* report an error */
				}
				Object o = com.mongodb.util.JSON.parse(jb.toString());
				DBObject doc = (DBObject) o;
				email=(String)doc.get("email");
				if(!doc.containsField("bu")){
					response.setStatus(HttpServletResponse.SC_FORBIDDEN);
					user.put("message", "User MUST have a BU.");
				}else{
					if(email==null || email.equals("")){
						response.setStatus(HttpServletResponse.SC_FORBIDDEN);
						user.put("message", "User MUST have an email.");
					}else{
						System.out.println("got email from JSON=" + email);
						System.out.println("insert!");
						DB db = m.getDB(USER);
						DBCollection collection = db.getCollection("user");
						BasicDBObject whereQuery = new BasicDBObject();
						whereQuery.put("email", email);
						whereQuery.put("application", application);
						DBCursor cursor = collection.find(whereQuery);
						if(cursor.hasNext()) {
							response.setStatus(HttpServletResponse.SC_FORBIDDEN);
							user.put("authenticated", false);
							user.put("message", "email already in use. Please choose another");
						}else{
							uuid=UUID.randomUUID().toString();
							String salt=UUID.randomUUID().toString();
							String onetimepassword=UUID.randomUUID().toString();
							doc.put("created", new Date());
							doc.put("application", application);
							doc.put("auid", auid);
							doc.put("uuid", uuid);
							doc.put("email", email);
							doc.put("salt", salt);
							doc.put("onetimepassword",onetimepassword);
							sanitize(doc);
							WriteResult result = collection.insert(doc);
							user=doc;
						}
					}
				}
			}
		}else if (action.equals("resetpassword")) {
			String otpw=resetPassword(application, email);
			new DkimMail("noreply@priocloud.com", email, "Your password has been reset", "Click this link to change your password:\nhttps://priocloud.com/"+SITE+"#/otpw/"+otpw).send();
		}else if (action.equals("updateuser")) {
			//System.out.println("XXXXXXXXXXXXXXXXXXXXXXXXXX");
			BasicDBObject admin=(BasicDBObject) getUser(auid, uuid);
			System.out.println("user with uuid ["+uuid+"] is admin ["+(isAdmin(admin)||isSubAdmin(admin))+"] of ["+application+"] ["+auid+"]");
			//get json user object
			StringBuffer jb = new StringBuffer();
			String line = null;
			try {
				BufferedReader reader = request.getReader();
				while ((line = reader.readLine()) != null)
					jb.append(line);
			} catch (Exception e) { /* report an error */
			}
			Object o = com.mongodb.util.JSON.parse(jb.toString());
			DBObject doc = (DBObject) o;
//			if(doc.containsField("authenticated")){
//				doc.removeField("authenticated");
//			}
			if(!doc.containsField("bu")){
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
				user.put("message", "User MUST have a BU.");
			}else if(!doc.containsField("email")){
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
				user.put("message", "User MUST have an email.");
			}else{
				email=(String)doc.get("email");
				String useruuid = (String)doc.get("uuid");
				System.out.println("got email from JSON=" + email);
				System.out.println("Update!");
				DB db = m.getDB(USER);
				DBCollection collection = db.getCollection("user");
				BasicDBObject whereQuery = new BasicDBObject();
				whereQuery.put("uuid", useruuid);
				whereQuery.put("application", application);
				whereQuery.put("auid", auid); // to avoid hackers messing with other peoples data...
				BasicDBObject found = (BasicDBObject) collection.findOne(whereQuery);
				BasicDBObject edit = (BasicDBObject) collection.findOne(whereQuery);
				edit.putAll(doc);
				edit.put("updated", new Date());
				edit.put("auid", auid);
				edit.put("uuid", useruuid);
				System.out.println("New updated item:");
				System.out.println(edit.toString());
//				if(found.getString("authtoken").equals(edit.getString("authtoken")) && (isAdmin(found) || isSubAdmin(found) || found.getString("email").equals(edit.getString("email")))) {
				if(found.getString("email").equals(admin.getString("email")) || (isAdmin(admin) || isSubAdmin(admin) )) {
					if(!isAdmin(admin) && !isSubAdmin(admin)) {
						edit.put("admin", found.get("admin"));
						edit.put("subadmin", found.get("subadmin"));
						edit.put("financecontroller", found.get("financecontroller"));
					}
					collection.update(found, edit);
				}
				user=edit;
				user.put("authenticated", true);
			}
		}else if (action.equals("destroycompany")) {
			if(userIsOwner(uuid, auid, application)){
				System.out.println("DESTROY COMPANY: " + auid);
				System.out.println(email);
				removeByAuid(DATABASE, "project", auid);
				removeByAuid(DATABASE, "bu", auid);
				removeByAuid(DATABASE, "company", auid);
				removeByAuid(USER, "user", auid);
				removeByAuid(USER, "application", auid);
			}else{
				System.out.println("User is not owner and cannot erase");
			}
		}else if (action.equals("getusers")) {
			BasicDBObject dbUser=(BasicDBObject) getUser(auid, uuid);
//			if(!(isAdmin(dbUser) || isSubAdmin(dbUser))){	//check if creator is admin
//				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//				System.out.println("User with uuid ["+uuid+"] is not admin of ["+application+"] ["+auid+"]");
//				user.put("message", "User with uuid ["+uuid+"] is not admin or subadmin of ["+application+"] ["+auid+"]");
//				response.setContentType("application/json;charset=UTF-8");
//				PrintWriter out = response.getWriter();
//				out.print(user.toString());
//				out.flush();out.close();
//				return;
//			}
			boolean isAdmin=isAdmin(dbUser);
			System.out.println("isAdmin="+isAdmin);
			boolean isSubAdmin=isSubAdmin(dbUser);
			System.out.println("isSubAdmin="+isSubAdmin);
			DB db = m.getDB(USER);
			DBCollection collection = db.getCollection("user");
			BasicDBObject whereQuery = new BasicDBObject();
			whereQuery.put("application", application);
			whereQuery.put("auid", auid);
			DBCursor cursor = collection.find(whereQuery);
			PrintWriter out = response.getWriter();
			out.print("[");
			while (cursor.hasNext()) {
				DBObject json = cursor.next();
				json.removeField("_id");
				if(isAdmin) {
					System.out.println("Is admin keeping fields");
				}else {
					if(isSubAdmin) {
						if(isSubAdmin && json.containsField("admin") && json.get("admin") !=null && ((boolean)json.get("admin")) == true) {
							System.out.println("Is sub admin but not allowed to look at admin - removing OTPW");
							json.removeField("uuid");
							json.removeField("onetimepassword");
						}
					}else {
						System.out.println("normal user - removing OTPW");
						json.removeField("uuid");
						json.removeField("onetimepassword");
					}
				}
				json.removeField("password");
				json.removeField("salt");
				out.print(json);
				out.println(cursor.hasNext() ? "," : "");
			}
			out.println("]");
			out.flush();
			out.close();
			return;
		}else if (action.equals("masterlogin")) {
			if(userIsMaster(uuid, auid, application)){
				String masteruuid=request.getParameter("masteruuid");
				DB db = m.getDB(USER);
				DBCollection collection = db.getCollection("user");
				BasicDBObject whereQuery = new BasicDBObject();
				whereQuery.put("uuid", masteruuid);
				whereQuery.put("application", application);
				DBCursor cursor = collection.find(whereQuery);
				if(cursor.hasNext()) {
					DBObject json = cursor.next();
					user=json;
					user.put("authenticated", true);
					user.put("admin", true);
				}
			}
		}else if (action.equals("loadallcompanies")) {
			if(userIsMaster(uuid, auid, application)){
				DB db = m.getDB(USER);
				DBCollection collection = db.getCollection("application");
				DBCursor cursor = collection.find();
				PrintWriter out = response.getWriter();
				out.print("[");
				while (cursor.hasNext()) {
					DBObject json = cursor.next();
					out.print(json);
					out.println(cursor.hasNext() ? "," : "");
				}
				out.println("]");
				out.flush();
				out.close();
				return;
			}
		}else if (action.equals("updatepassword")) {	//sets new pw after one time pw hit
			String onetimepassword=request.getParameter("onetimepassword");
			user=updatePassword(application, email, password, onetimepassword);
		}else if (action.equals("createproject")) {	//creates project and admin user
			if (application==null) {
				System.out.println("Application cannot be null");
				return;
			}
			DB db = m.getDB(USER);
			DBCollection collection = db.getCollection("user");
			BasicDBObject whereQuery = new BasicDBObject();
			whereQuery.put("email", email);
			whereQuery.put("application", application);
			DBCursor cursor = collection.find(whereQuery);
			if(cursor.hasNext()) {
				user.put("authenticated", false);
				user.put("message", "Username already in use. Please choose another");
			}else{
				//create new application
				auid=UUID.randomUUID().toString();
				uuid=createAdminUser(application, auid, email, password);
				createApplication(application, auid, email, uuid);
				user.put("application", application);
				user.put("auid", auid);
				user.put("email", email);
				user.put("name", "Admin");
				user.put("authenticated", true);
				user.put("admin", true);
				user.put("uuid", uuid);
				if(serverType.equals("prod")){
					new DkimMail("noreply@priocloud.com", email, "PrioCloud account created", "We have created your PrioCloud account.").send();
				}
			}
		}
		user.removeField("_id");
		user.removeField("password");
		user.removeField("salt");
		response.setContentType("application/json;charset=UTF-8");
		PrintWriter out = response.getWriter();
		out.print(user.toString());
		out.flush();out.close();
	}

	private String getAdSsoUrl() {
		String serverType = System.getenv("SERVER_TYPE");
		if (serverType==null  || serverType.equalsIgnoreCase("local")) {
			return null;
		} else if(serverType.equalsIgnoreCase("dev")){
			return "https://prioclouddevfrontend.azurewebsites.net/.auth/me";
		} else if(serverType.equalsIgnoreCase("test")){
			return "https://priocloudtest.azurewebsites.net/.auth/me";
		} else if(serverType.equalsIgnoreCase("prod")){
			return "https://priocloud.azurewebsites.net/.auth/me";
		}else{
			System.out.println("UNKNOWN SERVER TYPE CANNOT SET SSO AD: " + serverType);
		}
		return null;
	}
	private void removeByAuid(String dbname, String collectionname, String auid) {
		DB db = m.getDB(dbname);
		DBCollection collection = db.getCollection(collectionname);
		BasicDBObject whereQuery = new BasicDBObject();
		whereQuery.put("auid", auid);
		DBCursor cursor = collection.find(whereQuery);
		System.out.println("find ["+dbname+"] ["+collectionname+"]");
		while (cursor.hasNext()) {
			DBObject json = cursor.next();
			System.out.println("deleting: " + json.toString());
			collection.remove(json);
		}
	}
	private void sanitize(DBObject doc) {
		System.out.println("Sanitizing user");
		if (doc.containsField("bu")) {
			System.out.println("doc has BU");
			DBObject bu = ((DBObject)doc.get("bu"));
			if(bu.containsField("ownerbu")){
				System.out.println("REMOVING PARENT BU");
				bu.removeField("ownerbu");	//remove top owner for security reasons
			}
			if(bu.containsField("owner")){
				System.out.println("REMOVING BU OWNER");
				bu.removeField("owner");	//remove top owner for security reasons
			}
		}
		System.out.println(doc.toString());
	}

	private boolean userIsOwner(String uuid, String auid, String application) {
		System.out.println("testing if user is owner ["+uuid+"] ["+auid+"] ["+application+"]");
		DB db = m.getDB(USER);
		DBCollection collection = db.getCollection("application");
		BasicDBObject whereQuery = new BasicDBObject();
		whereQuery.put("uuid", uuid);
		whereQuery.put("auid", auid);
		whereQuery.put("application", application);
		DBCursor cursor = collection.find(whereQuery);
		if(cursor.hasNext()) {
			System.out.println("user is owner");
			return true;
		}
		System.out.println("user is NOT owner");
		return false;
	}

	private boolean userIsMaster(String uuid, String auid, String application) {
		System.out.println("testing if user is master ["+uuid+"] ["+auid+"] ["+application+"]");
		DB db = m.getDB(USER);
		DBCollection collection = db.getCollection("application");
		BasicDBObject whereQuery = new BasicDBObject();
		whereQuery.put("uuid", uuid);
		whereQuery.put("auid", auid);
		whereQuery.put("application", application);
		DBCursor cursor = collection.find(whereQuery);
		if(cursor.hasNext()) {
			String email=cursor.next().get("email").toString();
			boolean master=email.equals("theisborg@gDkimMail.com") || email.equals("mikkel.groth.privat@gDkimMail.com");
			System.out.println("master email: " + email + " " + master);
			return master;
		}
		System.out.println("user is NOT master");
		return false;
	}

	private DBObject getUser(String auid, String uuid) {
		DB db = m.getDB(USER);
		DBCollection collection = db.getCollection("user");
		BasicDBObject whereQuery = new BasicDBObject();
		whereQuery.put("uuid", uuid);
		whereQuery.put("auid", auid);
		DBCursor cursor = collection.find(whereQuery);
		if(cursor.hasNext()) {
			return cursor.next();
		}
		return null;
	}

	private boolean userIsAdmin(String uuid, String auid, String application) {
		System.out.println("testing if user is admin ["+uuid+"] ["+auid+"] ["+application+"]");
		DBObject user=getUser(auid, uuid);
		return isAdmin(user);
	}

	private String resetPassword(String application, String email) {
		System.out.println("Reset PW ["+application+"] ["+email+"]");
		String onetimepassword=UUID.randomUUID().toString();
		DB db = m.getDB(USER);
		DBCollection collection = db.getCollection("user");
		BasicDBObject whereQuery = new BasicDBObject();
		whereQuery.put("email", email);
		whereQuery.put("application", application);
		BasicDBObject found = (BasicDBObject) collection.findOne(whereQuery);
		DBObject update = new BasicDBObject();
		update.put("$set", new BasicDBObject("onetimepassword",onetimepassword));
		//TODO: destroy old pw?
		WriteResult result = collection.update(found, update);
		System.out.println(result);
		return onetimepassword;
	}

	private DBObject updatePassword(String application, String email, String password, String onetimepassword) {
		DBObject user = new BasicDBObject();
		DB db = m.getDB(USER);
		DBCollection collection = db.getCollection("user");
		BasicDBObject whereQuery = new BasicDBObject();
		whereQuery.put("email", email);
		whereQuery.put("application", application);
		DBCursor cursor = collection.find(whereQuery);
		if(cursor.hasNext()) {
			DBObject json = cursor.next();
			String uuid=(String) json.get("uuid");
			String dbauid=(String) json.get("auid");
			String savedpassword=(String) json.get("password");
			String salt=(String) json.get("salt");
			String dbonetimepassword=(String) json.get("onetimepassword");
			String encrypted=encryptPassword(password, salt);
			if (onetimepassword.equals(dbonetimepassword)) {
				System.out.println("onetime password match");
				BasicDBObject found = (BasicDBObject) collection.findOne(whereQuery);
				DBObject update = new BasicDBObject();
				update.put("$set", new BasicDBObject("password",encrypted));
				WriteResult result = collection.update(found, update);
				user=found;
				user.put("authenticated", true);
				System.out.println(result);
			}else{
				user.put("message", "onetime password DOES NOT match");
				System.out.println("onetime password DOES NOT match");
			}
		}else{
			user.put("message", "User does not exist");
		}
		return user;
	}

	public String createAdminUser(String application, String auid, String email, String password){
		String uuid=UUID.randomUUID().toString();
		String salt=UUID.randomUUID().toString();
		DB db = m.getDB(USER);
		DBCollection collection = db.getCollection("user");
		DBObject doc = new BasicDBObject();
		doc.put("created", new Date());
		doc.put("application", application);
		if (auid!=null) {	// private users has no application connection
			doc.put("auid", auid);
		}
		doc.put("admin", true);
		doc.put("name", "Admin");
		doc.put("uuid", uuid);
		doc.put("email", email);
		doc.put("salt", salt);
		doc.put("password", encryptPassword(password, salt));
		WriteResult result = collection.insert(doc);
		System.out.println(result);
		return uuid;
	}

	public String createApplication(String application, String auid, String email, String uuid){
		DB db = m.getDB(USER);
		DBCollection collection = db.getCollection("application");
		DBObject doc = new BasicDBObject();
		doc.put("created", new Date());
		doc.put("application", application);
		doc.put("auid", auid);
		doc.put("uuid", uuid);
		doc.put("email", email);
		WriteResult result = collection.insert(doc);
		System.out.println(result);
		return auid;
	}

	private static String encryptPassword(String password, String salt) {
		String sha1 = "";
		try {
			MessageDigest crypt = MessageDigest.getInstance("SHA-1");
			crypt.reset();
			crypt.update((password+salt).getBytes("UTF-8"));
			sha1 = byteToHex(crypt.digest());
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return sha1;
	}

	private static String byteToHex(final byte[] hash) {
		Formatter formatter = new Formatter();
		for (byte b : hash) {
			formatter.format("%02x", b);
		}
		String result = formatter.toString();
		formatter.close();
		return result;
	}

	private boolean isAdmin(DBObject dbUser) {
		return hasTrueKey((BasicDBObject) dbUser, "admin");
	}

	private boolean isSubAdmin(DBObject dbUser) {
		return hasTrueKey((BasicDBObject) dbUser, "subadmin");
	}
	private boolean hasTrueKey(BasicDBObject dbUser, String key) {
		if(dbUser!=null && dbUser.containsField(key) && "true".equals(dbUser.getString(key))) {
			return true;
		}
		return false;
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
//		if (server != null) {
//			response.setHeader("Access-Control-Allow-Origin", server);
//			response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//			response.setHeader("Access-Control-Allow-Headers", "Content-Type");
//		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
		response.addHeader("Access-Control-Allow-Headers", "Content-Type");
	}


	private static String readAll(Reader rd) throws IOException {
		StringBuilder sb = new StringBuilder();
		int cp;
		while ((cp = rd.read()) != -1) {
			sb.append((char) cp);
		}
		return sb.toString();
	}

	public static JSONObject readJsonFromUrl(String urlname, String token) throws IOException, JSONException {
		URL url = new URL(urlname);
		URLConnection connection = url.openConnection();
		connection.setRequestProperty("Authorization", "Bearer " + token);

		InputStream is = connection.getInputStream();
		try {
			BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
			String jsonText = readAll(rd);
			System.out.println("got json");
			System.out.println(jsonText);
			JSONArray json = new JSONArray(jsonText);
			return json.getJSONObject(0);
		} finally {
			is.close();
		}
	}
}