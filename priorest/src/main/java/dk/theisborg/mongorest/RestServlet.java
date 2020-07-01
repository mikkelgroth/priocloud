package dk.theisborg.mongorest;

import com.mongodb.*;
import org.bson.types.ObjectId;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

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

@WebServlet("/rest/*")
public class RestServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Mongo m = null;
  private String DATABASE;
  private String USER;
	private String DATABASE_NAME="priocloud";

	public RestServlet() {
		super();
	}

	public void init(ServletConfig config) {
		try {
			 String serverType = System.getenv("SERVER_TYPE");
			 System.out.println("****************************************");
			 System.out.println("serverType="+ serverType);
			 System.out.println("****************************************");
				if (serverType==null || serverType.equalsIgnoreCase("local") || serverType.equalsIgnoreCase("prod") || serverType.equalsIgnoreCase("dev") ) {
					m = new MongoClient("mongo", 27017);
//				} else if(serverType.equalsIgnoreCase("dev")){
//					m = new MongoClient(new MongoClientURI("mongodb://prioclouddevdb.westeurope.cloudapp.azure.com:27017/?maxIdleTimeMS=5000"));
 				} else if(serverType.equalsIgnoreCase("test")){
// 					Test env. used for Cosmo re-trial 
//					m = new MongoClient(new MongoClientURI("mongodb://priocloudtestdb.westeurope.cloudapp.azure.com:27017"));
					m = new MongoClient(new MongoClientURI("mongodb://priocosmodbtest:DgkDqmlT9O6ZYYVVKRehm40ebrFEsY150FnlD7qh4AE5rLSPc6mnS3D9A4xdvGCX2xgcxIOPbh754Xysu6qzyw%3D%3D@priocosmodbtest.documents.azure.com:10255/?ssl=true"));     
//				} else if(serverType.equalsIgnoreCase("prod")){
////					m = new MongoClient(new MongoClientURI("mongodb://priocloudproddb.westeurope.cloudapp.azure.com:27017"));
//					m = new MongoClient("mongo", 27017);
//				}else{
//					System.out.println("UNKNOWN SERVER TYPE: " + serverType);
				}
				System.out.println("Connected");
	      DATABASE=DATABASE_NAME;
	      USER=DATABASE_NAME;
		} catch (MongoException e) {
			e.printStackTrace();
		}
	}

	@Override
	protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		super.doOptions(request, response);
		setHeaders(request, response);
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("GET " + getClientIpAddr(request) + " " + new Date());
		setHeaders(request, response);
		response.setContentType("application/json;charset=UTF-8");
		String[] items = getItems(request);
		if (items.length == 0) {
			return;
		}
		String auid = items[1];
		if (auid.equals("mailtest")) {
			String from=request.getParameter("from")==null?"noreply@danbryg.dk":request.getParameter("from");
			String to=request.getParameter("to")==null?"theisborg@gmail.com":request.getParameter("to");
			System.out.println("Sending mail ["+from+"] ["+to+"]...");
			new DkimMail(from, to, "Her er en mail", "Dette er message feltet.").send();
			return;
		}
		if (auid.equals("favicon.ico") || auid.equals("robots.txt") || items.length < 4) {
			return;
		}
		System.out.println(auid);
		String uuid = items[2];
		System.out.println("Session uuid=[" + uuid + "] [" + request.getRequestURI() + "]");
		String collectionname = items[3];
		DB db = m.getDB(DATABASE);
		DBCollection collection = db.getCollection(collectionname);
		DBCollection projectcollection = db.getCollection("project");

		if(collectionname.equals("bu")){
			System.out.println("Get BUs recursively.");
			ArrayList<DBObject> bus=getBus(projectcollection, collection, auid, uuid);
			PrintWriter out = response.getWriter();
			out.println(bus);
			out.flush();
			out.close();
		}else if(collectionname.equals("project")){
			System.out.println("Get project list from bu id.");
			if (items.length < 5) {
				return;
			}
			ArrayList<DBObject> projects=new ArrayList<>();
			String buuid = items[4];
			BasicDBObject whereQuery = new BasicDBObject("bu._id", new ObjectId(buuid));
			whereQuery.put("auid", auid);
			DBCursor cursor = collection.find(whereQuery).sort(new BasicDBObject("_id", 1));
			while (cursor.hasNext()) {
				projects.add(cursor.next());
			}
//			DBObject user=getUser(auid, uuid);
//			//add po
//			whereQuery = new BasicDBObject("po.email", user.get("email").toString());
//			whereQuery.put("auid", auid);
//			cursor = collection.find(whereQuery).sort(new BasicDBObject("_id", 1));
//			while (cursor.hasNext()) {
//				projects.add(cursor.next());
//			}
//			//add pm
//			whereQuery = new BasicDBObject("pm.email", user.get("email").toString());
//			whereQuery.put("auid", auid);
//			cursor = collection.find(whereQuery).sort(new BasicDBObject("_id", 1));
//			while (cursor.hasNext()) {
//				projects.add(cursor.next());
//			}
			PrintWriter out = response.getWriter();
			out.println(projects);
			out.flush();
			out.close();
		}else{
			BasicDBObject whereQuery = new BasicDBObject();
			whereQuery.put("auid", auid);
			if (request.getParameter("key") != null && request.getParameter("val") != null) {
				whereQuery.put(request.getParameter("key"), request.getParameter("val"));
			}
			PrintWriter out = response.getWriter();
			DBCursor cursor = collection.find(whereQuery).sort(new BasicDBObject("_id", 1));
			out.print("[");
			while (cursor.hasNext()) {
				DBObject json = cursor.next();
				json.removeField("uuid");
				out.print(json);
				out.println(cursor.hasNext() ? "," : "");
			}
			out.println("]");
			out.flush();
			out.close();
			System.out.println("got something");
		}
	}


	private ArrayList<DBObject> getBus(DBCollection projectcollection, DBCollection collection, String auid, String uuid) {
		ArrayList<DBObject> bus=new ArrayList<>();
		//lookup users BU
		DBObject dbUser=getUser(auid, uuid);
		System.out.println("Got user: " + dbUser.toString());
//		DBObject bu=getUserBU(collection, user);
		if(isAdmin(dbUser) || isSubAdmin(dbUser)){
			System.out.println("User is owner - adding all");
			BasicDBObject whereQuery = new BasicDBObject();
			whereQuery.put("auid", auid);
			DBCursor cursor = collection.find(whereQuery).sort(new BasicDBObject("_id", 1));
			while (cursor.hasNext()) {
				bus.add(cursor.next());
			}
		}else{
			//if(bu.containsField("ownerbu")) bu.removeField("ownerbu");	//remove top owner for security reasons
			System.out.println("USER BU=" + dbUser);
			DBObject bu=(DBObject) dbUser.get("bu");
			if (bu instanceof BasicDBList) {	//get new multi BU structure
				BasicDBList basicDBList = ((BasicDBList) bu);
				for (int i = 0; i < basicDBList.size(); i++) {
					BasicDBObject obj = (BasicDBObject) basicDBList.get(i);
					System.out.println("Get new recursive: "+obj.get("_id"));
					bus.addAll(getChildrenRecursively(collection, obj.get("_id").toString()));
					bus.add(0,obj);	//add top bu
				}
//				//remove duplicates if any
				Set setItems = new LinkedHashSet(bus);
				bus.clear();
				bus.addAll(setItems);
			}else{	//get old single BU structure
				System.out.println("Get recursive: "+bu.get("_id"));
				bus=getChildrenRecursively(collection, bu.get("_id").toString());
				bus.add(0,bu);	//add top bu
			}
		}
		return bus;
	}

	private ArrayList<DBObject> getChildrenRecursively(DBCollection collection, String buuid) {
		ArrayList<DBObject> arr = new ArrayList<>();
		DBObject searchById = new BasicDBObject("ownerbu._id", new ObjectId(buuid));
		DBCursor cursor = collection.find(searchById);		
		while (cursor.hasNext()) {
			DBObject json = cursor.next();
			System.out.println("Adding child: " + json);
			arr.add(json);
			arr.addAll(getChildrenRecursively(collection, json.get("_id").toString()));
		}
		return arr;
	}
	

	private DBObject getBUById(DBCollection collection, String buuid) {
		DBObject searchById = new BasicDBObject("_id", new ObjectId(buuid));
		return collection.findOne(searchById);
	}
	

	private ArrayList<DBObject> getPmBoBUs(DBObject user, DBCollection projectcollection, DBCollection collection, String uuid){
		ArrayList<DBObject> arr = new ArrayList<>();
		ArrayList<String> list = new ArrayList<>();
		list.addAll(getBUsByKey(projectcollection, "pm.email", user.get("email").toString(), "bu._id", uuid));
		list.addAll(getBUsByKey(projectcollection, "po.email", user.get("email").toString(), "bu._id", uuid));
		for(String key : list){
			System.out.println("Adding by key: " + key);
			arr.addAll(getChildrenRecursively(collection, key));
			arr.add(getBUById(collection, key));
		}
		return arr;
	}

	private ArrayList<String> getBUsByKey(DBCollection collection, String key, String email, String BUkey, String uuid){
		ArrayList<String> arr = new ArrayList<>();
		DBObject searchById = new BasicDBObject(key, email);
		System.out.println("Search ["+key+"] val ["+uuid+"]");
		DBCursor cursor = collection.find(searchById);		
		while (cursor.hasNext()) {
			DBObject json = cursor.next();
			String found=getNested(json, BUkey);
			System.out.println(found + " X " + email);
			arr.add(getNested(json, BUkey));
		}
		return arr;
	}
	
	private String getNested(DBObject json, String bUkey) {
		for(String search : bUkey.split("\\.")){
			System.out.println("searching: "+ search);
			if (search.equals("_id")) {
				System.out.println("returning: " + json.get(search).toString());
				return json.get(search).toString();
			} else {
				json=(DBObject) json.get(search);
			}
		}
		System.out.println("returning: " + json.toString());
		return json.toString();
	}

//	private DBObject getUserBU(DBCollection collection, DBObject user) {
//		if(!user.containsField("bu")){
//			return null;
//		}
//		DBObject searchById = new BasicDBObject("_id", new ObjectId(((DBObject)user.get("bu")).get("_id").toString()));
//		DBObject json = collection.findOne(searchById);
//		System.out.println("User BU=" + json);
//		return json;
//	}


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

	/*
	private void getBus(HttpServletResponse response, HttpServletRequest request, DBCollection collection) throws IOException {
		BasicDBObject whereQuery = new BasicDBObject();
		whereQuery.put("auid", request.getParameter("auid"));
		if (request.getParameter("key") != null && request.getParameter("val") != null) {
			whereQuery.put(request.getParameter("key"), request.getParameter("val"));
		}
		PrintWriter out = response.getWriter();
		DBCursor cursor = collection.find(whereQuery).sort(new BasicDBObject("_id", 1));
		out.print("[");
		while (cursor.hasNext()) {
			DBObject json = cursor.next();
			json.removeField("uuid");
			out.print(json);
			out.println(cursor.hasNext() ? "," : "");
		}
		out.println("]");
		out.flush();
		out.close();
	}*/

	private String[] getItems(HttpServletRequest request) {
        String SEEK="/rest";
        int pos =request.getRequestURI().indexOf(SEEK) + SEEK.length();
/*
		String[] items= request.getRequestURI().substring(pos).split("/");
		System.out.println(request.getRequestURI());
		System.out.println(request.getRequestURI().substring(pos) + " L=" + items.length);
		String auid = items[1];
		String uuid = items[2];
		String collectionname = items[3];
		System.out.println(auid + " " + uuid + " " + collectionname + " ");
*/
		return request.getRequestURI().substring(pos).split("/");
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
		String[] items = getItems(request);
		System.out.println("L=" + items.length);
		String auid = items[1];
		String uuid = items[2];
		DB db = m.getDB(DATABASE);
		if (items.length == 3) {
			System.out.println(uuid + " has no collection!");
			System.out.println(request.getParameter("data"));
			db.createCollection(request.getParameter("data"), null);
			return;
		}
		String collectionname = items[3];
		DBCollection collection = db.getCollection(collectionname);
		if (collection == null) {
			System.out.println("Collection is NULL");
		}
		DBObject dbUser=getUser(auid, uuid);
		System.out.println("Got DB user: " + dbUser.toString());
//		boolean ok=securityCheckOK(dbUser, collectionname) && securityCheckProjectOK(dbUser, collectionname);
		boolean ok=securityCheckOK(dbUser, collectionname);
		if(!ok) {
			System.out.println("Security check failed for collection ["+collectionname+"] and user ["+dbUser+"]");
			return;
		}
		
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

		DBObject doc = (DBObject) o;
		if (doc instanceof BasicDBList) {
			System.out.println("Houston - we have a list!");
			BasicDBList basicDBList = ((BasicDBList) doc);
			for (int i = 0; i < basicDBList.size(); i++) {
				BasicDBObject obj = (BasicDBObject) basicDBList.get(i);
				obj.put("created", new Date());
				obj.put("auid", auid);
				obj.put("uuid", uuid);
				obj.put("ip", ip);
				sanitize(collectionname, obj);
				collection.insert(obj);
			}
		} else {
			doc.put("created", new Date());
			doc.put("auid", auid);
			doc.put("uuid", uuid);
			doc.put("ip", ip);
			sanitize(collectionname, doc);
			collection.insert(doc);
		}
		// return some meaningless json so jquery is happy
		PrintWriter out = response.getWriter();
		out.println(com.mongodb.util.JSON.serialize(doc));
		out.flush();
		out.close();
		System.out.println("added something");
	}

	private boolean securityCheckOK(DBObject dbUser, String collectionname, DBObject project, BasicDBObject dbProject) {
		if(collectionname.equals("project")){
			if(isAdmin(dbUser) || isSubAdmin(dbUser)) {
				System.out.println("user is admin or subadmin");
				return true;
			}
			DB db = m.getDB(DATABASE);
			DBCollection BUcollection = db.getCollection("bu");
			System.out.println("------------------");
			System.out.println(project.toString());
			System.out.println("++++++++++++++++++");
			System.out.println(((BasicDBObject)project.get("bu")).get("_id").toString());
			System.out.println("------------------");
			DBObject dbBU = getBUById(BUcollection, ((BasicDBObject)project.get("bu")).get("_id").toString());
			String ownerEmail=((BasicDBObject)dbBU.get("owner")).get("email").toString();
			System.out.println("ownerEmail=" + ownerEmail);
			System.out.println("------------------");
			if(ownerEmail.equals(dbUser.get("email"))) {
				System.out.println("user is BU owner and can manipulate project");
				return true;				
			}
			String pmEmail="";
			try {
				pmEmail=((BasicDBObject)dbProject.get("pm")).get("email").toString();	
			} catch (Exception e) {
			}
			System.out.println("pmEmail=" + pmEmail);
			System.out.println("------------------");
			String altpmEmail="";
			try {
				altpmEmail=((BasicDBObject)dbProject.get("altpm")).get("email").toString();	
			} catch (Exception e) {
			}
			System.out.println("altpmEmail=" + altpmEmail);
			System.out.println("------------------");
			String poEmail="";
			try {
				poEmail=((BasicDBObject)dbProject.get("po")).get("email").toString();	
			} catch (Exception e) {
			}
			System.out.println("poEmail=" + poEmail);
			System.out.println("------------------");
			String financecontrollerEmail="";
			try {
				financecontrollerEmail=((BasicDBObject)dbProject.get("financecontroller")).get("email").toString();	
			} catch (Exception e) {
			}
			System.out.println("financecontrollerEmail=" + financecontrollerEmail);
			System.out.println("------------------");
			if(pmEmail.equals(dbUser.get("email")) || 
					altpmEmail.equals(dbUser.get("email"))||
					poEmail.equals(dbUser.get("email")) ||
					financecontrollerEmail.equals(dbUser.get("email"))) {
				System.out.println("user is pm, po, altpm or financecontroller and can manipulate project");
				return true;				
			}
			return false;
		}
		return true;	//non project save
	}

	//simple access management
	private boolean securityCheckOK(DBObject dbUser, String collectionname) {
		if(collectionname.equals("company") && !isAdmin(dbUser)) {
			System.out.println("user is not admin but tries to save company");
			return false;
		}
		if(collectionname.equals("bu") && !isAdmin(dbUser)) {
			System.out.println("user is not admin but tries to save bu");
			return false;
		}
		return true;
	}
	private boolean securityCheckProjectOK(DBObject dbUser, String collectionname) {
		if(collectionname.equals("project") && !isAdmin(dbUser)) {
			System.out.println("user is not admin but tries to save project");
			return false;
		}
		return true;
	}

	private void showHeaders(HttpServletRequest request) {
		Enumeration enParams = request.getHeaderNames();
		while (enParams.hasMoreElements()) {
			String paramName = (String) enParams.nextElement();
			System.out.println(paramName + ":" + request.getHeader(paramName));
		}
	}

	private boolean userIsOwner(String uuid, String auid) {
		System.out.println("testing if user is owner ["+uuid+"] ["+auid+"] ");
		DB db = m.getDB(USER);
		DBCollection collection = db.getCollection("application");
		BasicDBObject whereQuery = new BasicDBObject();
		whereQuery.put("uuid", uuid);
		whereQuery.put("auid", auid);
		DBCursor cursor = collection.find(whereQuery);		
		if(cursor.hasNext()) {
			System.out.println("user is owner");
			return true;
		}
		System.out.println("user is NOT owner");
		return false;
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("PUT"+ " " + new Date());
		response.setContentType("application/json;charset=UTF-8");
		setHeaders(request, response);
		String[] items = getItems(request);
		String auid = items[1];
		String uuid = items[2];
		String collectionname = items[3];
		// String uuid=(String) request.getSession().getAttribute("uuid");
		DB db = m.getDB(DATABASE);
		
		DBObject dbUser=getUser(auid, uuid);
		System.out.println("Got DB user: " + dbUser.toString());
		boolean ok=securityCheckOK(dbUser, collectionname);
		if(!ok) {
			System.out.println("Security check failed for collection ["+collectionname+"] and user ["+dbUser+"]");
			return;
		}
		
		DBCollection collection = db.getCollection(collectionname);
		if (items.length > 4) {
			DBObject searchById = new BasicDBObject("_id", new ObjectId(items[4]));
			searchById.put("auid", auid); // to avoid hackers messing with other peoples data...
			BasicDBObject found = (BasicDBObject) collection.findOne(searchById);
			StringBuffer jb = new StringBuffer();
			String line = null;
			try {
				BufferedReader reader = request.getReader();
				while ((line = reader.readLine()) != null)
					jb.append(line);
			} catch (Exception e) { /* report an error */
			}
			System.out.println("got JSON=" + jb);
			Object o = com.mongodb.util.JSON.parse(jb.toString());
			DBObject doc = (DBObject) o;
			ok=securityCheckOK(dbUser, collectionname, doc, found);
			if(!ok) {
				System.out.println("Security check failed for collection ["+collectionname+"] and user ["+dbUser+"]");
				return;
			}

			// doc.removeField("_id"); //TODO this will fix angular PUT bug where _id is empty?
			doc.put("updated", new Date());
			doc.put("auid", auid);
			doc.put("uuid", uuid);
			sanitize(collectionname, doc);
			collection.update(found, doc);
			// return some meaningless json so jquery is happy
			PrintWriter out = response.getWriter();
			out.println(com.mongodb.util.JSON.serialize(doc));
			out.flush();
			out.close();
			System.out.println("updated something");
		}
	}

	private void sanitize(String collectionname, DBObject doc) {
		System.out.println("Sanitizing: " + collectionname);
		if (collectionname.equals("bu")) {
			if (doc.containsField("ownerbu")) {
				DBObject bu = ((DBObject)doc.get("ownerbu"));
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
	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("DELETE"+ " " + new Date());
		setHeaders(request, response);
		response.setContentType("application/json;charset=UTF-8");
		String[] items = getItems(request);
		String auid = items[1];
		String uuid = items[2];
		String collectionname = items[3];
		DB db = m.getDB(DATABASE);

		DBObject dbUser=getUser(auid, uuid);
		System.out.println("Got DB user: " + dbUser.toString());
		if(!isAdmin(dbUser)) {
			System.out.println("Only admin can delete from database");
			System.out.println("Security check failed for collection ["+collectionname+"] and user ["+dbUser+"]");
			return;
		}

		DBCollection collection = db.getCollection(collectionname);
		if (items.length > 4) {
			DBObject searchById = new BasicDBObject("_id", new ObjectId(items[4]));
			searchById.put("auid", auid); // to avoid hackers messing with other peoples data...
			BasicDBObject found = (BasicDBObject) collection.findOne(searchById);
			collection.remove(found);
			// return some meaningless json so jquery is happy
			PrintWriter out = response.getWriter();
			out.println("{}");
			out.flush();
			out.close();
			System.out.println("deleted something");
		}
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
