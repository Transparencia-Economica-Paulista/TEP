package school.sptech.Conectores;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

public class Conexao{
    // Passa um atributo do tipo da DataSource
    private DataSource conexao;

    // Um Construtor
    public Conexao() {
        // Chamamos o DriverManagerDataSource, que ele vai ser o responsável por gerenciar essas informações

        // Dá o nome de driver
        DriverManagerDataSource driver = new DriverManagerDataSource();
        //Pegando Variáveis:
        String dbUrl = "jdbc:mysql://" + System.getenv("DB_HOST") + ":3306/TEP";
        String dbUser = System.getenv("DB_USER");
        String dbPass = System.getenv("DB_PASSWORD");


        // Informamos o "jdbc:mysql", que é padrão. Depois o Hostname, porta e nome da Database
        driver.setUrl(dbUrl);
        // Nome do usuário, EX: root
        driver.setUsername(dbUser);
        // Por fim, informamos a senha.
        driver.setPassword(dbPass);

        //Declaramos que o valor da conexao vai ser igual driver
        this.conexao = driver;
    }

    //Aqui tem o Get para pegar essa conexao
    public DataSource getConexao(){
        return this.conexao;
    }
}
