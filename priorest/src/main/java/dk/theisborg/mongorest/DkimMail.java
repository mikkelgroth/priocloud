package dk.theisborg.mongorest;

import net.markenwerk.utils.mail.dkim.Canonicalization;
import net.markenwerk.utils.mail.dkim.DkimMessage;
import net.markenwerk.utils.mail.dkim.DkimSigner;
import net.markenwerk.utils.mail.dkim.SigningAlgorithm;

import javax.mail.Message.RecipientType;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Date;
import java.util.Properties;

public class DkimMail {

	private String from;
	private String to;
	private String subject;
	private String message;

	public DkimMail(String from, String to, String subject, String message) {
		this.from = from;
		this.to = to;
		this.subject = subject;
		this.message = message;
	}

	public String send() {
		// Assuming you are sending email from localhost
		String host = "postfix";

		// Get system properties
		Properties properties = System.getProperties();

		// Setup mail server
		properties.setProperty("mail.smtp.host", host);

		// Get the default Session object.
		Session session = Session.getDefaultInstance(properties);
		String res;
		try {
			// Create a default MimeMessage object.
			MimeMessage dkimMessage = new MimeMessage(session);
			dkimMessage.setFrom(new InternetAddress(from));
			dkimMessage.setRecipient(RecipientType.TO, new InternetAddress(to));
			dkimMessage.setSubject(subject);
			dkimMessage.setContent(message, "text/plain; charset=utf-8");
			dkimMessage.setSentDate(new Date());
			//TODO: load signingDomain from "from" parameter
			MimeMessage dkimSignedMessage = dkimSignMessage(dkimMessage, from, from.substring(from.indexOf("@")+1), "dkim");
			Transport.send(dkimSignedMessage);
			System.out.println("DKIM mail sent by transport to: " + this.to);
			return "OK";
		} catch (Exception e) {
			res=e.getLocalizedMessage();
			System.out.println("Failed to send mail to [" + to + "] from ["+from+"] ["+ from.substring(from.indexOf("@")+1)+"] subject [" + subject + "] msg [" + message + "]");
			System.out.println(e);
			e.printStackTrace();
		}
	    return "FAIL: " + res;

	}

	private MimeMessage dkimSignMessage(MimeMessage message, String from, String signingDomain, String selector) throws Exception {
		DkimSigner dkimSigner = new DkimSigner(signingDomain, selector, getDkimPrivateKeyFile(from));
		dkimSigner.setIdentity(from);
		dkimSigner.setHeaderCanonicalization(Canonicalization.SIMPLE);
		dkimSigner.setBodyCanonicalization(Canonicalization.RELAXED);
		dkimSigner.setSigningAlgorithm(SigningAlgorithm.SHA256_WITH_RSA);
		dkimSigner.setLengthParam(true);
		dkimSigner.setZParam(false);
		return new DkimMessage(message, dkimSigner);
	}

	// TODO: FIX THIS SO WE DONT USE THE FILESYSTEM
	private File getDkimPrivateKeyFile(String from) {
	    URL url = this.getClass().getClassLoader().getResource("/dkim/dkim.der");
		File file = null;
		try {
			file = new File(url.toURI());
			System.out.println(file.getAbsolutePath());
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return file;
//		String absolutePath = file.getAbsolutePath();
//		return new File("/srv/basic/dkim.der");
	}

}
