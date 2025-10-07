package school.sptech;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        // Precisar passar as dependências no arquivo pom.xml.  No caso desde arquivo passei as dependências do mysql e do jdbc

        // Depois de Criar o Metodo de "Conexao"

        // Agora tem que instâciar a classe
        Conexao conexao = new Conexao();

        // Tem que chamar o Criar uma variével do tipo JdbcTemplete e passar o GET que foi feito da Conexão
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());

        // Para Manipular o banco usamos o Template que vai meio que passar todos os comando para o banco de dados

        // Tem alguns jeito que serve para se comunicar com o banco:

        //template.execute(drop table Teste)
        //template.execute("Create Table Teste (id int primary key, nomes varchar(45))");

        //Tem o template.update que serve para fazer as maiorias de iteração com o banco sendo elas
        // INSERT INTO, DELETE, UPDATE...

        // Tem que colocar um ?, depois " , " e aí o valor que quer colocar
        template.update("insert into nomes  values(Default, ?)", "Miguel");

        // Para fazer select temos que criar uma classe (No caso desse arquivo foi feito o "Nomes") indêntica com a tabela que vamos ver os dados


        //Como vai retornar uma lista, declaramos que iremos receber uma lista de Nomes
        // BeanPropertyRowMapper vai ser responsável por mapear os dados do banco para colocar na Classe Nomes
        List<Nomes> nomes = template.query("select * from nomes", new BeanPropertyRowMapper<>(Nomes.class));

        // Se for fazer outro select é só passar o nome da variável que já existente
        nomes = template.query("select * from nomes", new BeanPropertyRowMapper<>(Nomes.class));
        System.out.println(nomes);
    }
}
