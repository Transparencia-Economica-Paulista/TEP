package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;
import school.sptech.Conectores.Conexao;
import school.sptech.Conectores.S3Conexao;
import school.sptech.Conectores.Slack;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ListObjectsRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.S3Object;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import static school.sptech.Logs.Log.*;

public class Main {
    public static void main(String[] args) {
        // Precisar passar as dependências no arquivo pom.xml. No caso desde arquivo passei as dependências do mysql, jdbc, Aws e do Apache POI.
        ZoneId zoneId = ZoneId.of("America/Sao_Paulo");


        //Sempre mudar a conexão!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // Fazemos uma instância para a conexão.


        Slack slack = new Slack();

        slack.tratarMensagem("Iniciou a nossa aplicação!");

            Conexao conexao = new Conexao();
            JdbcTemplate template = new JdbcTemplate(conexao.getConexao());

            logTEP();

            template.update("SET foreign_key_checks = 0");
            template.update("TRUNCATE TABLE Metricas_do_pib");
            template.update("TRUNCATE TABLE Indicadores");


            //Fazendo a Instãncia para pegar o cliente do S3.
            S3Client s3conec = new S3Conexao().getS3Client();
            //Declaro o nome do Bucket
            String bucketName = "tep-base-dados-bucket";

            //Declaro uma Variável que vai ser responsável por ler e mandar dados que não se repetem.
            Integer tentativa = 0;


            logMensagem(LocalDateTime.now(zoneId), "Debug", "Iniciando Conexão com o Bucket com o nome: " + bucketName);
            //Abro o Try
            try {
                //Criando a requisição para pedir uma lista objetos
                ListObjectsRequest requisicao = ListObjectsRequest.builder().bucket(bucketName).build();
                //Com base na conexão pego a requisição e mando e crio uma lista de objetos.
                List<S3Object> objetos = s3conec.listObjects(requisicao).contents();

                logMensagem(LocalDateTime.now(zoneId), "Debug", "Objetos achados com sucesso!");


                logMensagem(LocalDateTime.now(zoneId), "Debug", "Percorrendo objetos");
                //percorrendo a  lista
                for (S3Object objeto : objetos) {

                    //pegando a chave do objeto que é o caminho do objeto
                    String caminhoDoArquivo = objeto.key();

                    //condição para conferir se é uma planilha
                    if (caminhoDoArquivo.endsWith(".xlsx")) {
                        logMensagem(LocalDateTime.now(zoneId), "Debug", "Achado a  planilha: " + caminhoDoArquivo);

                        // criei essa variavel só pra usar no bloco de pegar o ano da planilha
                        String nomeArquivo = objeto.key();
                        //Faço a tratativa para pegar apenas o Ano que tem escrito na planilha
                        Integer inicioAno = nomeArquivo.lastIndexOf('-') + 1;
                        Integer fimAno = nomeArquivo.lastIndexOf('.');
                        String ano = nomeArquivo.substring(inicioAno, fimAno);
                        Integer anoDaplanilha = Integer.parseInt(ano);


                        // Fazemos uma instância para o Leitor (Classe responsável por ler a planilha usando Apache POI).
                        Leitor leitor1 = new Leitor();

                        if (anoDaplanilha > 2016) {
                            leitor1.extrairMunicipios(s3conec, bucketName, caminhoDoArquivo, tentativa, anoDaplanilha, template);

                            //Mudo o valor para que depois que passar no metodo de extrair só faça algumas ações já antes falada
                            tentativa = 1;
                        }

                    }
                }
        slack.tratarMensagem("Boas notícias! O Jar rodou sem erro 😊");
            } catch (S3Exception e) {
                logMensagem(LocalDateTime.now(zoneId), "Debug", "Falha ao conectar bucket");

                slack.tratarMensagem("Ops! Parece que falhou em conectar o bucket 😢");
            }
        logMensagem(LocalDateTime.now(zoneId), "Debug", "Terminou a aplicação");

        logEnvioEmLote();

        }



    }
