package school.sptech.Conectores;

import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Slack {
    private static HttpClient client = HttpClient.newHttpClient();
    private static final String url = System.getenv("SLACK_WEBHOOK");


    public void tratarMensagem(String mensagem) {
        JSONObject json = new JSONObject();
        json.put("text", mensagem);
        try{
            chamarAPI(json);
        }catch (Exception e){
            System.err.println("mensagem = " + e.getMessage());
        }
    }

    public void chamarAPI(JSONObject object) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder(URI.create(url)).header("accept", "application/json").POST(HttpRequest.BodyPublishers.ofString(object.toString())).build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println(String.format("Status:%s ", response.statusCode()));
        System.out.println(String.format("Response: %s", response.body()));

    }
}
