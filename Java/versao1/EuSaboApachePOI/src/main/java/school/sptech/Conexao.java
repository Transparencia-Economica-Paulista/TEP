package school.sptech;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.DriverManager;

public class Conexao{
    // Passa um atributo do tipo da DataSource
    private DataSource conexao;

    // Um Construtor
    public Conexao() {
        // Chamamos o DriverManagerDataSource, que ele vai ser o responsável por gerenciar essas informações

        // Dá o nome de driver
        DriverManagerDataSource driver = new DriverManagerDataSource();

        // Informamos o "jdbc:mysql", que é padrão. Depois o Hostname, porta e nome da Database
        driver.setUrl("jdbc:mysql://localhost:3306/Laboratorio");
        // Nome do usuário, EX: root
        driver.setUsername("EuTeste");
        // Por fim, informamos a senha.
        driver.setPassword("urubu100");

        //Dizemos que o valor da conexao vai ser igual driver
        this.conexao = driver;
    }

    //Aqui tem o Get para pegar essa conexao
    public DataSource getConexao(){
        return this.conexao;
    }
}
