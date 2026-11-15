import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class FeedbackServer {
    public static void main(String[] args) throws Exception {
        // Starts a local web server on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/submit-feedback", new FeedbackHandler());
        server.setExecutor(null); 
        System.out.println("🚀 Java Feedback Backend running on http://localhost:8080...");
        server.start();
    }

    static class FeedbackHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                
                // 1. Read raw incoming form data
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
                BufferedReader br = new BufferedReader(isr);
                String formData = br.readLine();

                
                FileWriter fileWriter = new FileWriter("feedback.txt", true);
                PrintWriter printWriter = new PrintWriter(fileWriter);
                
                
                String decodedData = URLDecoder.decode(formData, StandardCharsets.UTF_8);
                
               
                printWriter.println("--- NEW COMMITMENT RECEIVED ---");
                printWriter.println("--------------------------------\n");
                printWriter.close();

                
                String responseText = "<html><body style='font-family:sans-serif; text-align:center; padding-top:100px; background:#fcfbfa; color:#1b4332;'>"
                        + "<h1>Thank You!</h1>"
                        + "<p>Your commitment to SDG 15 (Life on Land) has been saved securely by the Java backend server.</p>"
                        + "<a href='http://127.0.0' style='color:#526e4d;'>← Back to Website</a>"
                        + "</body></html>";
                
                
                exchange.getResponseHeaders().set("Content-Type", "text/html");
                exchange.sendResponseHeaders(200, responseText.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(responseText.getBytes());
                os.close();
            }
        }
    }
}
