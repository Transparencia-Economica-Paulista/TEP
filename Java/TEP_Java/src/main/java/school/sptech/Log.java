package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Log {

    public  void logTEP(){
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

    public void logMensagem(LocalDateTime horaAtual, String tipoLog, String mensagem){
        // Aqui ele está passando uma instância do conexão, porque já quero lançar o log para o banco quando ele for feito.
        // Configurações padrão:
        Conexao conexao = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());

        // Estou passando como quero que a data fique. Ainda não está mudando a data recebida só está montando um formato de como vai ficar.
        DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


        // Aqui cria outra variável que usa a data recebida como parâmetro e formata com base no formato feito anteriormente
        String horaAtualFormatada = horaAtual.format(formato);


        // Faz um Sout simples pegando Todas variáveis passadas como parâmetro e a data que formatou
        System.out.println(horaAtualFormatada +  " [" + tipoLog + "] " + mensagem );

        // Faz um insert das variáveis usadas no sout para o banco de log
        template.update("INSERT INTO logBD values (default, ?,?,?)", horaAtualFormatada, tipoLog, mensagem);
    }
}
