package school.sptech.Logs;

import org.springframework.jdbc.core.JdbcTemplate;
import school.sptech.Conectores.Conexao;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class Log {
    private static List<LogMensagem> logsComMensagem = new ArrayList<>();

    public static void logTEP(){
        System.out.println("\n\n\n" +
                " /$$$$$$$$ /$$$$$$$$ /$$$$$$$ \n" +
                "|__  $$__/| $$_____/| $$__  $$\n" +
                "   | $$   | $$      | $$  \\ $$\n" +
                "   | $$   | $$$$$   | $$$$$$$/\n" +
                "   | $$   | $$__/   | $$____/ \n" +
                "   | $$   | $$      | $$      \n" +
                "   | $$   | $$$$$$$$| $$      \n" +
                "   |__/   |________/|__/      \n" +
                "                              \n" +
                " Transparência Econômica Paulista...                           \n" +
                "                              \n" +
                "                              \n" );
    }
    // O Log só vai ter um metodo que vai receber alguns parâmetros que vai constituir nele

    // Recebe um LocalDateTime chamado "horaAtual", uma String chamado "Tipo Log" que vai ser aquelas mensagens (Debug, ERRO, INFO e outras), e Mensagem que vai ser o texto que vamos escrever.
    public static void logMensagem(LocalDateTime horaAtual, String tipoLog, String mensagem){

        // Estou passando como quero que a data fique. Ainda não está mudando a data recebida só está montando um formato de como vai ficar.
        DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // Aqui cria outra variável que usa a data recebida como parâmetro e formata com base no formato feito anteriormente
        String horaAtualFormatada = horaAtual.format(formato);



        logsComMensagem.add(new LogMensagem(horaAtualFormatada, tipoLog, mensagem ));
        // Faz um Sout simples pegando Todas variáveis passadas como parâmetro e a data que formatou
        System.out.println(horaAtualFormatada +  " [" + tipoLog + "] " + mensagem );
    }


    public static void logEnvioEmLote(){
        Conexao conexao = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());


        String sql = """
        INSERT INTO logBD (datahora, tipo, mensagem)
        VALUES (?, ?, ?)
    """;

        // dataHora datetime NOT NULL, tipo VARCHAR(45) NOT NULL, mensagem VARCHAR(100)

        template.batchUpdate(sql, logsComMensagem, logsComMensagem.size(), (ps, logAtual) -> {
            ps.setString(1, logAtual.getHoraAtual());
            ps.setString(2, logAtual.getTipoLog());
            ps.setString(3, logAtual.getMensagem());
        });

        logsComMensagem.clear();
    }
}
